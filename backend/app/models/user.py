from beanie import Document
from pydantic import EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    CUSTOMER = "customer"
    STAFF = "staff"
    ADMIN = "admin"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class User(Document):
    email: EmailStr = Field(..., description="Correo electrónico")
    hashed_password: str = Field(..., description="Contraseña hash")
    full_name: str = Field(..., min_length=2, description="Nombre completo")
    phone: str = Field(..., min_length=10, max_length=12, description="Teléfono con código de país (ej. 525549655305)")
    street_address: str = Field(..., min_length=5, description="Dirección")
    neighborhood: str = Field(..., min_length=3, description="Colonia")
    allergies: List[str] = Field(default_factory=list, description="Lista de alergias")
    gender: Gender = Field(default=Gender.OTHER, description="Género del usuario")
    role: UserRole = Field(default=UserRole.CUSTOMER, description="Rol del usuario")
    is_active: bool = Field(default=True, description="Estado del usuario")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de actualización")
    last_login: Optional[datetime] = Field(default=None, description="Fecha del último inicio de sesión")
    
    class Settings:
        name = "users"
        use_state_management = True
        use_revision = True
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v.isdigit():
            raise ValueError('El teléfono debe contener solo números')
        if len(v) < 10 or len(v) > 12:
            raise ValueError('El teléfono debe tener entre 10 y 12 dígitos (incluyendo código de país)')
        return v
    
    def update_timestamp(self):
        self.updated_at = datetime.utcnow()
    
    def to_response(self) -> Dict[str, Any]:
        """Convierte el modelo a un diccionario para la respuesta de la API"""
        response = {
            "id": str(self.id),
            "email": self.email,
            "full_name": self.full_name,
            "phone": self.phone,
            "street_address": self.street_address,
            "neighborhood": self.neighborhood,
            "allergies": self.allergies,
            "gender": self.gender,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
        
        # Solo incluir last_login si tiene un valor
        if self.last_login:
            response["last_login"] = self.last_login.isoformat()
            
        return response
