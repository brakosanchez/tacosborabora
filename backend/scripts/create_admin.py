#!/usr/bin/env python3
"""
Script para crear un usuario administrador en la base de datos.
"""
import asyncio
import sys
from pathlib import Path

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.append(str(Path(__file__).parent.parent))

from app.core.config import settings
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from app.db.mongodb import MongoDB

async def create_admin_user():
    """Crea un usuario administrador si no existe."""
    # Conectar a la base de datos
    await MongoDB.connect_to_database()
    
    # Verificar si ya existe un administrador
    admin_email = "admin@tacosborabora.com"
    existing_admin = await User.find_one(User.email == admin_email)
    
    if existing_admin:
        print(f"El usuario administrador con email {admin_email} ya existe.")
        return
    
    # Crear el usuario administrador
    admin = User(
        email=admin_email,
        hashed_password=get_password_hash("admin123"),  # Contraseña por defecto
        full_name="Administrador",
        phone="1234567890",
        street_address="Calle Principal 123",
        neighborhood="Centro",
        role=UserRole.ADMIN,
        is_active=True
    )
    
    await admin.save()
    print(f"Usuario administrador creado exitosamente con email {admin_email} y contraseña 'admin123'")
    print("¡Por favor, cambia la contraseña después del primer inicio de sesión!")

if __name__ == "__main__":
    asyncio.run(create_admin_user())
