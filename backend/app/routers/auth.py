from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.auth_service import authenticate_user, create_access_token

# Configuración de bcrypt
pwd_context = CryptContext(
    schemes=["bcrypt"],
    bcrypt__rounds=12,
    deprecated="auto"
)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        # Validar que el usuario existe
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=["Credenciales inválidas"],
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # Validar que el usuario está activo
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=["Usuario inactivo"],
            )
            
        # Validar que el usuario tiene un email
        if not user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=["El usuario no tiene un email válido"],
            )
            
        # Crear token
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(minutes=30)
        )
        
        # Preparar respuesta
        response = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": user.email,
                "role": getattr(user, 'role', "user"),
                "full_name": user.full_name
            }
        }
        
        return response
        
    except HTTPException as e:
        # Propagar errores HTTP existentes
        raise e
        
    except Exception as e:
        # Loguear el error para debugging
        print(f"Error en login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=["Error interno del servidor. Por favor, intenta de nuevo."]
        )

@router.post("/register")
async def register(user: UserCreate):
    try:
        # Verifica si ya existe un usuario con ese email
        existing_user = await User.find_one(User.email == user.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=["email: El correo electrónico ya está registrado"]
            )
            
        # Validar contraseñas
        if user.password != user.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=["confirm_password: Las contraseñas no coinciden"]
            )
            
        # Crear nuevo usuario
        hashed_password = get_password_hash(user.password)
        new_user = User(
            email=user.email,
            hashed_password=pwd_context.hash(user.password),
            full_name=user.full_name,
            phone=user.phone,
            street_address=user.street_address,
            neighborhood=user.neighborhood,
            allergies=allergies,
            role=user.role
        )
        await new_user.create()

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"detail": "Usuario registrado exitosamente"}
        )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": [f"Error interno del servidor: {str(e)}"]}
        )
