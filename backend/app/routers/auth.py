from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Header
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from jose import JWTError
from pydantic import EmailStr
from app.core.config import settings
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserInDB, User as UserResponse
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    get_current_active_user,
    JWTBearer
)
from app.core.config import settings
from app.db.mongodb import get_database
router = APIRouter(tags=["auth"])

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Dict[str, Any]:
    """
    Autentica un usuario y devuelve un token JWT.
    """
    # Buscar usuario por email
    user = await User.find_one(User.email == form_data.username)
    
    # Verificar si el usuario existe y la contraseña es correcta
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar si el usuario está activo
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email,
        expires_delta=access_token_expires,
        role=user.role,
        user_id=str(user.id)
    )
    
    # Actualizar última conexión
    user.last_login = datetime.utcnow()
    await user.save()
    
    # Preparar respuesta
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_response()
    }

@router.get("/verify-token")
async def verify_user_token(authorization: str = Header(...)):
    """
    Verifica si un token es válido.
    """
    try:
        # Extraer el token del encabezado de autorización
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Formato de token inválido. Use 'Bearer <token>'"
            )
            
        token = authorization.split(" ")[1]
        
        # Verificar el token
        payload = await verify_token(token)
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )
            
        # Verificar que el usuario existe
        user = await User.find_one(User.email == email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
            
        return {"message": "Token válido", "user": {"email": user.email, "role": getattr(user, 'role', 'user')}}
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}"
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error al verificar token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al verificar el token"
        )

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Obtiene los datos del usuario autenticado actualmente.
    """
    # Convertir el modelo de usuario a un diccionario para la respuesta
    user_data = current_user.dict(exclude={"hashed_password"})
    user_data["id"] = str(user_data["id"])
    return user_data

@router.post("/refresh-token")
async def refresh_token(current_user: User = Depends(get_current_active_user)):
    """
    Refresca el token de acceso del usuario.
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=current_user.email,
        expires_delta=access_token_expires,
        role=current_user.role,
        user_id=str(current_user.id)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate) -> Dict[str, Any]:
    """
    Registra un nuevo usuario en el sistema.
    
    Args:
        user_data: Datos del usuario a registrar
        
    Returns:
        User: Datos del usuario registrado
        
    Raises:
        HTTPException: Si hay un error en la validación o el registro
    """
    # Verificar si el correo ya está registrado
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya está registrado"
        )
    
    # Crear el nuevo usuario
    try:
        hashed_password = get_password_hash(user_data.password)
        user_dict = user_data.dict(exclude={"password", "confirm_password"})
        
        # Crear el usuario en la base de datos
        user = User(
            **user_dict,
            hashed_password=hashed_password,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        await user.save()
        
        # Devolver los datos del usuario sin la contraseña
        return user.to_response()
        
    except Exception as e:
        print(f"Error en registro: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al registrar el usuario. Por favor, intente de nuevo más tarde."
        )
