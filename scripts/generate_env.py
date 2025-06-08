#!/usr/bin/env python3
"""
Script para generar un archivo .env con valores seguros para el proyecto Tacos Bora Bora.
Este script genera claves secretas aleatorias para la aplicación.
"""
import os
import secrets
import string
from pathlib import Path

def generate_random_secret(length=64):
    """Genera una cadena aleatoria segura para usar como secreto."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()_+-=[]{}|;:,.<>?"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_env_file(env_example_path, env_path):
    """Genera un archivo .env basado en .env.example con valores seguros."""
    # Leer el archivo .env.example
    with open(env_example_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Variables que requieren generación de secretos
    secret_vars = {
        'SECRET_KEY': generate_random_secret(64),
        'JWT_SECRET': generate_random_secret(64),
        'CSRF_SECRET_KEY': generate_random_secret(64),
    }
    
    # Generar el contenido del archivo .env
    env_content = []
    for line in lines:
        line = line.strip()
        
        # Saltar comentarios y líneas vacías
        if not line or line.startswith('#'):
            env_content.append(line)
            continue
        
        # Separar la clave y el valor
        if '=' in line:
            key, value = line.split('=', 1)
            key = key.strip()
            
            # Reemplazar valores de secretos
            if key in secret_vars:
                env_content.append(f"{key}={secret_vars[key]}")
            else:
                env_content.append(line)
        else:
            env_content.append(line)
    
    # Escribir el archivo .env
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(env_content) + '\n')
    
    print(f"Archivo {env_path} generado exitosamente con valores seguros.")
    print("¡Recuerda guardar este archivo de manera segura y no compartirlo públicamente!")

if __name__ == "__main__":
    # Rutas a los archivos
    project_root = Path(__file__).parent.parent
    env_example_path = project_root / ".env.example"
    env_path = project_root / ".env"
    
    # Verificar si el archivo .env ya existe
    if env_path.exists():
        print(f"El archivo {env_path} ya existe. ¿Deseas sobrescribirlo? (s/n): ", end='')
        if input().strip().lower() != 's':
            print("Operación cancelada.")
            exit(0)
    
    # Generar el archivo .env
    generate_env_file(env_example_path, env_path)
