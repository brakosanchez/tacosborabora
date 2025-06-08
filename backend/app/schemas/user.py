from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

# Lista de alergias permitidas (ninguna está implícita como lista vacía)
ALLOWED_ALLERGIES = [
    'gluten', 'lacteos', 'huevo', 'pescado', 'mariscos', 'frutos_secos', 
    'cacahuates', 'soya', 'apio', 'mostaza', 'sesamo', 'sulfitos', 
    'altramuces', 'moluscos', 'cacahuate', 'piña'
]

class UserBase(BaseModel):
    """Esquema base para usuarios"""
    email: EmailStr = Field(..., description="Correo electrónico")
    full_name: str = Field(..., min_length=2, description="Nombre completo")
    role: str = Field(default="customer", description="Rol del usuario")
    phone: str = Field(..., min_length=10, max_length=12, description="Teléfono con código de país (ej. 525549655305)")
    street_address: str = Field(..., min_length=5, description="Calle y número")
    neighborhood: str = Field(..., min_length=3, description="Colonia")
    allergies: List[str] = Field(default_factory=list, description="Lista de alergias")
    gender: Gender = Field(default=Gender.OTHER, description="Género del usuario")

    @validator('phone')
    def validate_phone(cls, v):
        if not v.isdigit():
            raise ValueError('El teléfono debe contener solo números')
        return v

    @validator('allergies')
    def validate_allergies(cls, v):
        if not v:
            return []
            
        # Si es una cadena, convertir a lista
        if isinstance(v, str):
            v = [item.strip().lower() for item in v.split(',') if item.strip()]
        
        # Si es una lista, procesar cada elemento
        if isinstance(v, list):
            # Si hay 'ninguna' en la lista, devolver lista vacía
            if any(isinstance(item, str) and item.lower() == 'ninguna' for item in v):
                return []
                
            # Validar alergias permitidas
            for allergy in v:
                if allergy.lower() not in ALLOWED_ALLERGIES:
                    raise ValueError(f'Solo se permiten las alergias: {", ".join(ALLOWED_ALLERGIES)}')
            
            return v
            
        return []

    @validator('street_address')
    def validate_street_address(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError('La dirección debe tener al menos 5 caracteres')
        return v.strip()

    @validator('neighborhood')
    def validate_neighborhood(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError('La colonia debe tener al menos 3 caracteres')
        return v.strip()

    @validator('full_name')
    def validate_full_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        return v.strip()

class UserCreate(UserBase):
    """Esquema para la creación de usuarios"""
    password: str = Field(..., min_length=6, description="Contraseña")
    confirm_password: str = Field(..., description="Confirmar contraseña")
    role: str = Field(default="customer", description="Rol del usuario")

    class Config:
        # Excluir confirm_password de la salida
        json_schema_extra = {
            "example": {
                "email": "usuario@ejemplo.com",
                "full_name": "Nombre Apellido",
                "phone": "525549655305",  # Código de país + número
                "street_address": "Calle 123",
                "neighborhood": "Colonia",
                "allergies": [],
                "gender": "other",
                "role": "customer",
                "password": "contraseña123",
                "confirm_password": "contraseña123"
            }
        }
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Las contraseñas no coinciden')
        return v

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('La contraseña debe tener al menos 6 caracteres')
        return v

    @validator('confirm_password')
    def validate_confirm_password(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Las contraseñas no coinciden')
        return v
        
    def dict(self, **kwargs):
        # Excluir confirm_password al convertir a diccionario
        data = super().dict(**kwargs)
        data.pop('confirm_password', None)
        return data

class UserInDB(UserBase):
    """Esquema para usuarios en la base de datos"""
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "email": "usuario@ejemplo.com",
                "full_name": "Nombre Apellido",
                "phone": "525549655305",  # Código de país + número
                "street_address": "Calle 123",
                "neighborhood": "Colonia",
                "allergies": [],
                "gender": "other",
                "role": "customer",
                "is_active": True,
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00",
                "last_login": None
            }
        }

class UserResponse(UserBase):
    """Esquema para la respuesta de la API"""
    id: str
    is_active: bool = True
    created_at: str
    updated_at: str
    last_login: Optional[str] = None
    role: str = "customer"
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "email": "usuario@ejemplo.com",
                "full_name": "Nombre Apellido",
                "phone": "525549655305",  # Código de país + número
                "street_address": "Calle 123",
                "neighborhood": "Colonia",
                "allergies": [],
                "gender": "other",
                "role": "customer",
                "is_active": True,
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00",
                "last_login": None
            }
        }
        
    @classmethod
    def from_mongo(cls, data: dict):
        """Convierte un documento de MongoDB a un UserResponse"""
        if '_id' in data:
            data['id'] = str(data.pop('_id'))
        if 'id' in data and hasattr(data['id'], 'id'):  # Si es un ObjectId
            data['id'] = str(data['id'])
        return cls(**data)
