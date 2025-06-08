import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB, UserResponse, UserBase
from app.core.security import get_password_hash, verify_password, oauth2_scheme, get_current_user, get_current_active_user
from app.core.config import settings
from typing import List, Optional, Dict, Any
from beanie import PydanticObjectId
from pydantic import BaseModel

# Configurar logger
logger = logging.getLogger(__name__)

class UserUpdate(BaseModel):
    """Esquema para actualizar datos de usuario"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    street_address: Optional[str] = None
    neighborhood: Optional[str] = None
    allergies: Optional[List[str]] = None
    gender: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Nuevo Nombre",
                "phone": "1234567890",
                "street_address": "Nueva Calle 123",
                "neighborhood": "Nueva Colonia",
                "allergies": ["cacahuate"],
                "gender": "male"
            }
        }

# Usando las funciones de autenticación de security.py

# El prefijo se maneja en main.py al incluir el router
router = APIRouter(tags=["users"])

@router.get("/test-auth", response_model=dict)
async def test_auth(current_user: User = Depends(get_current_active_user)):
    """Endpoint de prueba para verificar la autenticación"""
    return {
        "message": "¡Autenticación exitosa!",
        "user_email": current_user.email,
        "is_active": current_user.is_active
    }

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    """
    Crea un nuevo usuario en el sistema.
    """
    # Verificar si el usuario ya existe
    existing_user = await User.find_one(User.email == user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya está registrado"
        )
    
    # Crear el nuevo usuario
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        phone=user.phone,
        street_address=user.street_address,
        neighborhood=user.neighborhood,
        allergies=user.allergies,
        role=user.role if hasattr(user, 'role') else "customer"
    )
    await db_user.save()
    return db_user

@router.get("/", response_model=List[UserResponse])
async def read_users():
    """Obtiene la lista de usuarios."""
    users = await User.find_all().to_list()
    return users

@router.options("/me", status_code=status.HTTP_200_OK)
async def options_current_user():
    """Maneja las solicitudes OPTIONS para /api/users/me"""
    return {}

@router.get("/me", response_model=UserResponse, response_model_exclude={"hashed_password"})
async def read_current_user(current_user: User = Depends(get_current_active_user)):
    """
    Obtiene el perfil del usuario actual.
    
    Este endpoint requiere autenticación y devuelve los datos del usuario autenticado.
    """
    try:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
            
        # Asegurarse de que el usuario tenga todos los campos necesarios
        user_data = current_user.dict(exclude={"hashed_password"})
        
        # Asegurarse de que el ID sea un string
        if hasattr(current_user, 'id') and current_user.id:
            user_data['id'] = str(current_user.id)
            
        return user_data
        
    except Exception as e:
        logger.error(f"Error al obtener el perfil del usuario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el perfil del usuario: {str(e)}"
        )

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(user_id: PydanticObjectId):
    """Obtiene un usuario por su ID."""
    user = await User.get(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate, 
    current_user: User = Depends(get_current_active_user)
):
    """
    Actualiza el perfil del usuario actual.
    
    Permite actualizar los datos del perfil del usuario autenticado.
    """
    try:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
            
        # Obtener los datos a actualizar
        update_data = user_update.dict(exclude_unset=True)
        logger.info(f"Actualizando usuario {current_user.email} con datos: {update_data}")
        
        # Validar el número de teléfono si se proporciona
        if 'phone' in update_data and update_data['phone']:
            phone = update_data['phone']
            if not phone.isdigit() or len(phone) < 10 or len(phone) > 12:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El número de teléfono debe contener entre 10 y 12 dígitos"
                )
        
        # Actualizar solo los campos proporcionados
        for field, value in update_data.items():
            if hasattr(current_user, field) and value is not None:
                setattr(current_user, field, value)
        
        # Actualizar la fecha de actualización
        current_user.updated_at = datetime.utcnow()
        
        # Guardar los cambios
        await current_user.save()
        
        # Convertir a respuesta excluyendo la contraseña
        user_dict = current_user.dict(exclude={"hashed_password"})
        
        # Asegurarse de que el ID sea un string
        if hasattr(current_user, 'id') and current_user.id:
            user_dict['id'] = str(current_user.id)
        
        logger.info(f"Usuario {current_user.email} actualizado exitosamente")
        return user_dict
        
    except HTTPException as he:
        logger.error(f"Error de validación al actualizar usuario: {str(he.detail)}")
        raise he
    except Exception as e:
        logger.error(f"Error al actualizar el perfil del usuario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el perfil del usuario: {str(e)}"
        )
        
    except Exception as e:
        print(f"[ERROR] Error al guardar los cambios: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el perfil: {str(e)}"
        )
