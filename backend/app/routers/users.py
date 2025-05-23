from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB, User as UserResponse
from app.core.security import get_password_hash, verify_password, oauth2_scheme
from app.core.config import settings
from typing import List, Optional
from beanie import PydanticObjectId

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = await User.find_one(User.email == email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

router = APIRouter(prefix="/users", tags=["users"])

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

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(user_id: PydanticObjectId):
    """Obtiene un usuario por su ID."""
    user = await User.get(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user
