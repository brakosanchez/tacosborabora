#!/usr/bin/env python3
"""
Script para verificar la configuración de seguridad del proyecto Tacos Bora Bora.
Este script comprueba que todas las configuraciones de seguridad estén correctamente establecidas.
"""
import os
import sys
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import re
import json
import requests
from urllib.parse import urlparse

# Colores para la salida en consola
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class SecurityChecker:
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.env_file = project_root / ".env"
        self.settings_file = project_root / "backend" / "app" / "core" / "config.py"
        self.results: List[Dict] = []
    
    def run_checks(self):
        """Ejecuta todas las comprobaciones de seguridad."""
        print(f"{Colors.HEADER}=== Verificación de Seguridad Tacos Bora Bora ==={Colors.ENDC}\n")
        
        # Verificar archivos de configuración
        self.check_file_exists(self.env_file, "Archivo de variables de entorno (.env)", True)
        self.check_file_permissions(self.env_file, 0o600, "El archivo .env debe tener permisos 600 (solo lectura/escritura para el propietario)")
        
        # Verificar configuraciones de seguridad
        self.check_env_variables()
        self.check_dependencies()
        self.check_security_headers()
        
        # Mostrar resumen
        self.print_summary()
    
    def check_file_exists(self, file_path: Path, description: str, is_critical: bool = False):
        """Verifica si un archivo existe."""
        exists = file_path.exists()
        status = "OK" if exists else "NO ENCONTRADO"
        color = Colors.OKGREEN if exists else (Colors.FAIL if is_critical else Colors.WARNING)
        
        self.results.append({
            "check": description,
            "status": status,
            "message": f"Archivo: {file_path}",
            "critical": is_critical
        })
        
        print(f"[{color}{status}{Colors.ENDC}] {description}")
        return exists
    
    def check_file_permissions(self, file_path: Path, expected_mode: int, message: str):
        """Verifica los permisos de un archivo."""
        if not file_path.exists():
            return False
        
        try:
            mode = file_path.stat().st_mode & 0o777
            is_secure = mode == expected_mode
            status = f"PERMISOS: {oct(mode)[-3:]} (esperado: {oct(expected_mode)[-3:]})"
            
            self.results.append({
                "check": f"Permisos de {file_path.name}",
                "status": "OK" if is_secure else "ADVERTENCIA",
                "message": status,
                "critical": not is_secure
            })
            
            color = Colors.OKGREEN if is_secure else Colors.WARNING
            print(f"[{color}{status}{Colors.ENDC}] {message}")
            return is_secure
        except Exception as e:
            self.record_error(f"Error al verificar permisos de {file_path.name}", str(e))
            return False
    
    def check_env_variables(self):
        """Verifica las variables de entorno críticas."""
        critical_vars = [
            "SECRET_KEY",
            "JWT_SECRET",
            "CSRF_SECRET_KEY",
            "MONGODB_URI",
        ]
        
        if not self.env_file.exists():
            return
        
        # Leer variables del archivo .env
        env_vars = {}
        with open(self.env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
        
        # Verificar variables críticas
        for var in critical_vars:
            if var not in env_vars or not env_vars[var]:
                self.record_error(
                    f"Variable de entorno crítica faltante",
                    f"La variable {var} no está definida o está vacía en {self.env_file.name}",
                    True
                )
            elif "example" in env_vars[var].lower() or "changeme" in env_vars[var].lower():
                self.record_warning(
                    f"Valor inseguro en variable de entorno",
                    f"La variable {var} tiene un valor inseguro o por defecto"
                )
    
    def check_dependencies(self):
        """Verifica dependencias vulnerables usando safety o pip-audit."""
        try:
            # Verificar si está instalado safety o pip-audit
            try:
                # Primero intentamos con pip-audit que es la herramienta recomendada
                result = subprocess.run(
                    [sys.executable, "-m", "pip_audit", "--json"],
                    capture_output=True,
                    text=True,
                    check=False
                )
                
                if result.returncode == 0:
                    self.record_success(
                        "Análisis de dependencias",
                        "No se encontraron vulnerabilidades conocidas en las dependencias (usando pip-audit)"
                    )
                else:
                    try:
                        # Intentar analizar la salida JSON para obtener detalles
                        vulnerabilities = json.loads(result.stdout).get("vulnerabilities", [])
                        if vulnerabilities:
                            self.record_error(
                                "Vulnerabilidades en dependencias",
                                f"Se encontraron {len(vulnerabilities)} vulnerabilidades en las dependencias. Ejecuta 'pip-audit' para más detalles.",
                                True
                            )
                    except json.JSONDecodeError:
                        self.record_warning(
                            "No se pudo verificar dependencias",
                            f"Error al ejecutar pip-audit: {result.stderr}"
                        )
            except (subprocess.SubprocessError, FileNotFoundError):
                # Si pip-audit falla, intentar con safety
                try:
                    result = subprocess.run(
                        ["safety", "check", "--json"],
                        capture_output=True,
                        text=True,
                        check=False
                    )
                    
                    if result.returncode == 0:
                        self.record_success(
                            "Análisis de dependencias",
                            "No se encontraron vulnerabilidades conocidas en las dependencias (usando safety)"
                        )
                    else:
                        try:
                            # Intentar analizar la salida JSON de safety
                            data = json.loads(result.stdout)
                            if data.get("vulnerabilities"):
                                self.record_error(
                                    "Vulnerabilidades en dependencias",
                                    f"Se encontraron {len(data['vulnerabilities'])} vulnerabilidades en las dependencias. Ejecuta 'safety check' para más detalles.",
                                    True
                                )
                        except json.JSONDecodeError:
                            self.record_warning(
                                "No se pudo verificar dependencias",
                                "No se pudo analizar la salida de safety. Asegúrate de tener instalado 'safety' con 'pip install safety'."
                            )
                except (subprocess.SubprocessError, FileNotFoundError):
                    self.record_warning(
                        "Herramienta de análisis de dependencias no encontrada",
                        "Instala 'pip-audit' o 'safety' para verificar vulnerabilidades en dependencias: 'pip install pip-audit' o 'pip install safety'"
                    )
        except Exception as e:
            self.record_error("Error al verificar dependencias", str(e))
    
    def check_security_headers(self):
        """Verifica los encabezados de seguridad HTTP."""
        if not self.check_file_exists(self.settings_file, "Archivo de configuración de Django"):
            return
        
        required_headers = [
            "SECURE_HSTS_SECONDS",
            "SECURE_CONTENT_TYPE_NOSNIFF",
            "SECURE_BROWSER_XSS_FILTER",
            "SECURE_REFERRER_POLICY",
            "SESSION_COOKIE_SECURE",
            "SESSION_COOKIE_HTTPONLY",
            "CSRF_COOKIE_SECURE",
            "CSRF_COOKIE_HTTPONLY",
        ]
        
        try:
            with open(self.settings_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            missing_headers = []
            for header in required_headers:
                if not re.search(fr'{header}\s*=', content):
                    missing_headers.append(header)
            
            if missing_headers:
                self.record_error(
                    "Encabezados de seguridad faltantes",
                    f"Faltan configuraciones de seguridad en {self.settings_file.name}: {', '.join(missing_headers)}",
                    True
                )
            else:
                self.record_success(
                    "Configuración de encabezados de seguridad",
                    "Todos los encabezados de seguridad recomendados están configurados"
                )
        except Exception as e:
            self.record_error("Error al verificar encabezados de seguridad", str(e))
    
    def record_success(self, check: str, message: str):
        """Registra una comprobación exitosa."""
        self.results.append({
            "check": check,
            "status": "OK",
            "message": message,
            "critical": False
        })
        print(f"[{Colors.OKGREEN}OK{Colors.ENDC}] {check}")
    
    def record_warning(self, check: str, message: str, critical: bool = False):
        """Registra una advertencia."""
        self.results.append({
            "check": check,
            "status": "ADVERTENCIA",
            "message": message,
            "critical": critical
        })
        print(f"[{Colors.WARNING}ADVERTENCIA{Colors.ENDC}] {check}: {message}")
    
    def record_error(self, check: str, message: str, critical: bool = True):
        """Registra un error."""
        self.results.append({
            "check": check,
            "status": "ERROR",
            "message": message,
            "critical": critical
        })
        print(f"[{Colors.FAIL}ERROR{Colors.ENDC}] {check}: {message}")
    
    def print_summary(self):
        """Muestra un resumen de los resultados."""
        print(f"\n{Colors.HEADER}=== Resumen de la Verificación de Seguridad ==={Colors.ENDC}")
        
        # Contar resultados
        total = len(self.results)
        ok = sum(1 for r in self.results if r["status"] == "OK")
        warnings = sum(1 for r in self.results if r["status"] == "ADVERTENCIA")
        errors = sum(1 for r in self.results if r["status"] == "ERROR")
        critical_issues = sum(1 for r in self.results if r["critical"] and r["status"] != "OK")
        
        # Mostrar resumen
        print(f"\n{Colors.BOLD}Comprobaciones realizadas:{Colors.ENDC} {total}")
        print(f"{Colors.OKGREEN}✓ Correctas:{Colors.ENDC} {ok}")
        print(f"{Colors.WARNING}⚠ Advertencias:{Colors.ENDC} {warnings}")
        print(f"{Colors.FAIL}✗ Errores:{Colors.ENDC} {errors} ({critical_issues} críticos)")
        
        # Mostrar problemas críticos primero
        critical_issues = [r for r in self.results if r["critical"] and r["status"] != "OK"]
        if critical_issues:
            print(f"\n{Colors.FAIL}{Colors.BOLD}Problemas Críticos de Seguridad:{Colors.ENDC}")
            for issue in critical_issues:
                print(f"- {issue['check']}: {issue['message']}")
        
        # Mostrar recomendaciones
        if errors or warnings:
            print(f"\n{Colors.WARNING}{Colors.BOLD}Recomendaciones:{Colors.ENDC}")
            if any("dependencias" in r["check"].lower() for r in self.results if r["status"] != "OK"):
                print("- Ejecuta 'pip-audit' o 'safety check' para verificar vulnerabilidades en las dependencias")
            if any("permisos" in r["check"].lower() for r in self.results if r["status"] != "OK"):
                print("- Asegúrate de que los archivos de configuración tengan los permisos adecuados (600 para .env)")
            if any("encabezados" in r["check"].lower() for r in self.results if r["status"] != "OK"):
                print("- Revisa la configuración de los encabezados de seguridad en tu servidor web")
        
        # Mostrar conclusión
        if critical_issues:
            print(f"\n{Colors.FAIL}{Colors.BOLD}¡Se encontraron problemas críticos de seguridad que deben ser corregidos!{Colors.ENDC}")
        elif errors or warnings:
            print(f"\n{Colors.WARNING}Se encontraron algunos problemas que deberías revisar.{Colors.ENDC}")
        else:
            print(f"\n{Colors.OKGREEN}{Colors.BOLD}¡Todo parece estar en orden! No se encontraron problemas de seguridad críticos.{Colors.ENDC}")
        
        print("\nPara más información sobre cómo corregir estos problemas, consulta la documentación de seguridad de Django:")
        print("https://docs.djangoproject.com/en/stable/topics/security/")

if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    checker = SecurityChecker(project_root)
    checker.run_checks()
