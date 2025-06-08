from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from fastapi.security.utils import get_authorization_scheme_param
from app.models.user import User, UserRole
from app.core.config import settings

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)
        self.scheme_name = "Bearer"
        self.auto_error = auto_error

    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.headers.get("Authorization")
        if not authorization:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No se proporcionaron credenciales de autenticación"
                )
            return None
            
        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Formato de token inválido"
                )
            return None
        return param

# Configuración de seguridad
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Funciones de utilidad
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña en texto plano coincide con el hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Genera un hash de la contraseña"""
    return pwd_context.hash(password)

def create_access_token(
    subject: Union[str, Any], 
    expires_delta: Optional[timedelta] = None,
    **kwargs
) -> str:
    """Crea un nuevo token JWT"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        **kwargs
    }
    
    return jwt.encode(
        to_encode, 
        settings.JWT_SECRET, 
        algorithm=settings.JWT_ALGORITHM
    )

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Obtiene el usuario actual a partir del token JWT"""
    print(f"[DEBUG] get_current_user - Token recibido: {token[:10]}...")  # Mostrar solo los primeros 10 caracteres del token
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        print("[DEBUG] Intentando decodificar el token...")
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        print(f"[DEBUG] Payload decodificado: {payload}")
        
        email: str = payload.get("sub")
        if email is None:
            print("[ERROR] No se encontró el campo 'sub' en el token")
            raise credentials_exception
            
        print(f"[DEBUG] Buscando usuario con email: {email}")
        user = await User.find_one(User.email == email)
        
        if user is None:
            print(f"[ERROR] No se encontró el usuario con email: {email}")
            raise credentials_exception
            
        print(f"[DEBUG] Usuario encontrado: {user.email}, activo: {user.is_active}")
        return user
        
    except JWTError as e:
        print(f"[ERROR] Error al decodificar el token: {str(e)}")
        raise credentials_exception from e

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Verifica que el usuario esté activo"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Usuario inactivo"
        )
    return current_user

# Funciones para verificación de roles
class RoleChecker:
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, user: User = Depends(get_current_active_user)) -> bool:
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos suficientes para realizar esta acción"
            )
        return True

# Comprobadores de roles
is_admin = RoleChecker([UserRole.ADMIN])
is_staff = RoleChecker([UserRole.STAFF, UserRole.ADMIN])
is_customer = RoleChecker([UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN])
