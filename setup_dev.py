#!/usr/bin/env python3
"""
Script de configuración para el entorno de desarrollo de Tacos Bora Bora.
Este script ayuda a configurar el entorno de desarrollo de manera sencilla.
"""
import os
import sys
import subprocess
import platform
from pathlib import Path
from typing import List, Optional, Dict, Any
import shutil
import venv

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

class SetupDev:
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.is_windows = platform.system() == 'Windows'
        self.venv_dir = project_root / 'venv'
        self.env_file = project_root / '.env'
        self.env_example_file = project_root / '.env.example'
        
        # Rutas a los archivos de requisitos
        self.backend_dir = project_root / 'backend'
        
        # Archivos de requisitos
        self.requirements_file = self.backend_dir / 'requirements.txt'
        self.requirements_dev_file = self.backend_dir / 'requirements-dev.txt' if (self.backend_dir / 'requirements-dev.txt').exists() else None
        self.requirements_security_file = project_root / 'requirements-security.txt' if (project_root / 'requirements-security.txt').exists() else None
        
        # Verificar que el archivo requirements.txt existe
        if not self.requirements_file.exists():
            print(f"{Colors.FAIL}Error: No se encontró el archivo {self.requirements_file}{Colors.ENDC}")
            print(f"Asegúrate de que el archivo requirements.txt existe en el directorio backend/")
            sys.exit(1)
        
        # Comandos base para instalar dependencias
        self.install_commands = {
            'windows': [
                ['python', '-m', 'venv', 'venv']
            ],
            'unix': [
                ['python3', '-m', 'venv', 'venv']
            ]
        }
        
        # Comando para instalar requirements.txt del backend
        pip_cmd_windows = '.\\venv\\Scripts\\pip'
        pip_cmd_unix = 'venv/bin/pip'
        
        # Agregar comando para instalar dependencias principales
        self.install_commands['windows'].append(
            [pip_cmd_windows, 'install', '-r', str(self.requirements_file.relative_to(self.project_root))]
        )
        self.install_commands['unix'].append(
            [pip_cmd_unix, 'install', '-r', str(self.requirements_file.relative_to(self.project_root))]
        )
        
        # Agregar comandos para archivos opcionales si existen
        if self.requirements_dev_file:
            rel_path = str(self.requirements_dev_file.relative_to(self.project_root))
            self.install_commands['windows'].append(
                [pip_cmd_windows, 'install', '-r', rel_path]
            )
            self.install_commands['unix'].append(
                [pip_cmd_unix, 'install', '-r', rel_path]
            )
            
        if self.requirements_security_file:
            rel_path = str(self.requirements_security_file.relative_to(self.project_root))
            self.install_commands['windows'].append(
                [pip_cmd_windows, 'install', '-r', rel_path]
            )
            self.install_commands['unix'].append(
                [pip_cmd_unix, 'install', '-r', rel_path]
            )
    
    def run_command(self, command: List[str], cwd: Optional[Path] = None, shell: bool = False) -> bool:
        """Ejecuta un comando en la terminal."""
        if cwd is None:
            cwd = self.project_root
        
        print(f"{Colors.OKBLUE}Ejecutando: {' '.join(command)}{Colors.ENDC}")
        try:
            result = subprocess.run(
                command,
                cwd=cwd,
                shell=shell,
                check=True,
                text=True,
                capture_output=True
            )
            if result.stdout:
                print(result.stdout)
            return True
        except subprocess.CalledProcessError as e:
            print(f"{Colors.FAIL}Error al ejecutar el comando:{Colors.ENDC}")
            if e.stdout:
                print(f"Salida estándar:\n{e.stdout}")
            if e.stderr:
                print(f"Error estándar:\n{e.stderr}")
            return False
    
    def create_virtualenv(self) -> bool:
        """Crea un entorno virtual de Python."""
        print(f"{Colors.HEADER}Creando entorno virtual...{Colors.ENDC}")
        
        if self.venv_dir.exists():
            print(f"{Colors.WARNING}El directorio 'venv' ya existe. ¿Deseas eliminarlo y crear uno nuevo? (s/n): {Colors.ENDC}", end='')
            if input().strip().lower() == 's':
                try:
                    shutil.rmtree(self.venv_dir)
                    print(f"{Colors.OKGREEN}Entorno virtual anterior eliminado.{Colors.ENDC}")
                except Exception as e:
                    print(f"{Colors.FAIL}Error al eliminar el entorno virtual: {e}{Colors.ENDC}")
                    return False
            else:
                print(f"{Colors.WARNING}Usando el entorno virtual existente.{Colors.ENDC}")
                return True
        
        try:
            venv.create(self.venv_dir, with_pip=True)
            print(f"{Colors.OKGREEN}Entorno virtual creado en {self.venv_dir}{Colors.ENDC}")
            return True
        except Exception as e:
            print(f"{Colors.FAIL}Error al crear el entorno virtual: {e}{Colors.ENDC}")
            return False
    
    def install_dependencies(self) -> bool:
        """Instala las dependencias del proyecto."""
        print(f"{Colors.HEADER}Instalando dependencias...{Colors.ENDC}")
        
        # Instalar dependencias según el sistema operativo
        os_type = 'windows' if self.is_windows else 'unix'
        
        # 1. Crear entorno virtual
        print(f"\n{Colors.HEADER}=== Creando entorno virtual ==={Colors.ENDC}")
        if not self.run_command(
            self.install_commands[os_type][0],  # Crear venv
            cwd=self.project_root,
            shell=self.is_windows
        ):
            return False
        
        # 2. Instalar dependencias principales
        print(f"\n{Colors.HEADER}=== Instalando dependencias principales ==={Colors.ENDC}")
        cmd_idx = 1  # El índice del comando para instalar dependencias principales
        
        # Construir el comando para instalar dependencias
        pip_cmd = self.install_commands[os_type][cmd_idx]
        
        # Ejecutar el comando desde el directorio raíz
        if not self.run_command(
            pip_cmd,
            cwd=self.project_root,
            shell=self.is_windows
        ):
            print(f"{Colors.FAIL}Error al instalar las dependencias principales{Colors.ENDC}")
            return False
        
        # 3. Instalar dependencias adicionales si existen
        if len(self.install_commands[os_type]) > 2:
            print(f"\n{Colors.HEADER}=== Instalando dependencias adicionales ==={Colors.ENDC}")
            for cmd in self.install_commands[os_type][2:]:
                if not self.run_command(
                    cmd,
                    cwd=self.project_root,
                    shell=self.is_windows
                ):
                    print(f"{Colors.WARNING}Advertencia: No se pudo instalar una dependencia opcional.{Colors.ENDC}")
        
        print(f"\n{Colors.OKGREEN}✓ Todas las dependencias se instalaron correctamente.{Colors.ENDC}")
        return True
    
    def setup_environment(self) -> bool:
        """Configura el archivo .env si no existe."""
        print(f"{Colors.HEADER}Configurando variables de entorno...{Colors.ENDC}")
        
        if not self.env_example_file.exists():
            print(f"{Colors.WARNING}No se encontró el archivo .env.example{Colors.ENDC}")
            return False
        
        if self.env_file.exists():
            print(f"{Colors.WARNING}El archivo .env ya existe. ¿Deseas sobrescribirlo? (s/n): {Colors.ENDC}", end='')
            if input().strip().lower() != 's':
                print(f"{Colors.WARNING}Usando el archivo .env existente.{Colors.ENDC}")
                return True
        
        try:
            # Ejecutar el script generate_env.py
            generate_script = self.project_root / 'scripts' / 'generate_env.py'
            if generate_script.exists():
                cmd = [
                    'python', str(generate_script)
                ]
                if self.run_command(cmd):
                    print(f"{Colors.OKGREEN}Archivo .env generado exitosamente.{Colors.ENDC}")
                    return True
            else:
                # Si no existe el script, copiar .env.example a .env
                shutil.copy2(self.env_example_file, self.env_file)
                print(f"{Colors.WARNING}Se copió .env.example a .env. Por favor, configura las variables manualmente.{Colors.ENDC}")
                return True
        except Exception as e:
            print(f"{Colors.FAIL}Error al configurar el archivo .env: {e}{Colors.ENDC}")
        
        return False
    
    def run_checks(self) -> bool:
        """Ejecuta verificaciones de seguridad."""
        print(f"{Colors.HEADER}Ejecutando verificaciones de seguridad...{Colors.ENDC}")
        
        check_script = self.project_root / 'scripts' / 'check_security.py'
        if not check_script.exists():
            print(f"{Colors.WARNING}No se encontró el script de verificación de seguridad.{Colors.ENDC}")
            return False
        
        # Instalar requests si es necesario
        try:
            import requests
        except ImportError:
            print(f"{Colors.WARNING}Instalando la dependencia 'requests'...{Colors.ENDC}")
            pip_cmd = ['.\\venv\\Scripts\\pip'] if self.is_windows else ['venv/bin/pip']
            if not self.run_command(pip_cmd + ['install', 'requests']):
                return False
        
        # Ejecutar el script de verificación
        cmd = ['python', str(check_script)]
        return self.run_command(cmd)
    
    def print_success(self):
        """Mensaje de éxito final."""
        print(f"\n{Colors.OKGREEN}{'='*60}{Colors.ENDC}")
        print(f"{Colors.OKGREEN}{' '*20}¡Configuración completada!{' '*20}{Colors.ENDC}")
        print(f"{Colors.OKGREEN}{'='*60}{Colors.ENDC}")
        
        print("\nPara activar el entorno virtual, ejecuta:")
        if self.is_windows:
            print(f"{Colors.BOLD}  .\\venv\\Scripts\\activate{Colors.ENDC}")
        else:
            print(f"{Colors.BOLD}  source venv/bin/activate{Colors.ENDC}")
        
        print("\nPara iniciar el servidor de desarrollo, ejecuta:")
        print(f"{Colors.BOLD}  python -m uvicorn app.main:app --reload{Colors.ENDC}")
        
        print("\nPara más información, consulta el archivo README.md")
    
    def run(self):
        """Ejecuta el proceso completo de configuración."""
        print(f"{Colors.HEADER}{'='*60}{Colors.ENDC}")
        print(f"{Colors.HEADER}{' '*15}Configuración del Entorno de Desarrollo{' '*15}{Colors.ENDC}")
        print(f"{Colors.HEADER}{' '*15}         Tacos Bora Bora{' '*15}{Colors.ENDC}")
        print(f"{Colors.HEADER}{'='*60}{Colors.ENDC}\n")
        
        try:
            # 1. Crear entorno virtual
            if not self.create_virtualenv():
                print(f"{Colors.FAIL}Error al configurar el entorno virtual.{Colors.ENDC}")
                return False
            
            # 2. Instalar dependencias
            if not self.install_dependencies():
                print(f"{Colors.FAIL}Error al instalar las dependencias.{Colors.ENDC}")
                return False
            
            # 3. Configurar variables de entorno
            if not self.setup_environment():
                print(f"{Colors.WARNING}Advertencia: No se pudo configurar el archivo .env correctamente.{Colors.ENDC}")
            
            # 4. Ejecutar verificaciones de seguridad
            print("\n")
            if not self.run_checks():
                print(f"{Colors.WARNING}Advertencia: Se encontraron problemas en las verificaciones de seguridad.{Colors.ENDC}")
            
            # 5. Mostrar mensaje de éxito
            self.print_success()
            return True
            
        except Exception as e:
            print(f"\n{Colors.FAIL}Error inesperado: {e}{Colors.ENDC}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    project_root = Path(__file__).parent
    setup = SetupDev(project_root)
    success = setup.run()
    sys.exit(0 if success else 1)
