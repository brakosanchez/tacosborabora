from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="Correo electrónico")
    full_name: str = Field(..., min_length=2, description="Nombre completo")
    role: str = Field(..., description="Rol del usuario")
    phone: str = Field(..., min_length=10, max_length=10, description="Teléfono")
    street_address: str = Field(..., min_length=5, description="Calle y número")
    neighborhood: str = Field(..., min_length=3, description="Colonia")
    allergies: Optional[list] = Field(None, description="Lista de alergias")

    @validator('phone')
    def validate_phone(cls, v):
        if not v.isdigit():
            raise ValueError('El teléfono debe contener solo números')
        return v

    @validator('allergies')
    def validate_allergies(cls, v):
        if v is None or len(v) == 0:
            return None
        allowed_allergies = ['cacahuate', 'piña']
        if not all(allergy in allowed_allergies for allergy in v):
            raise ValueError('Solo se permiten las alergias: cacahuate, piña')
        return v

    @validator('street_address')
    def validate_street_address(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError('La dirección debe tener al menos 5 caracteres')
        return v

    @validator('neighborhood')
    def validate_neighborhood(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError('La colonia debe tener al menos 3 caracteres')
        return v

    @validator('full_name')
    def validate_full_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        return v

from typing import Optional, Union, List
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Contraseña")
    confirm_password: str = Field(..., min_length=6, description="Confirmar contraseña")

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

allowed_allergies = ['cacahuate', 'piña']  # Lista de alergias permitidas

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="Correo electrónico")
    full_name: str = Field(..., min_length=2, description="Nombre completo")
    role: str = Field(..., description="Rol del usuario")
    phone: str = Field(..., min_length=10, max_length=10, description="Teléfono")
    street_address: str = Field(..., min_length=5, description="Calle y número")
    neighborhood: str = Field(..., min_length=3, description="Colonia")
    allergies: Optional[Union[str, List[str]]] = Field(None, description="Lista de alergias")

    @validator('phone')
    def validate_phone(cls, v):
        if not v.isdigit():
            raise ValueError('El teléfono debe contener solo números')
        return v

    @validator('allergies')
    def validate_allergies(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            v = [a.strip() for a in v.split(',') if a.strip()]
        if isinstance(v, list):
            if not all(allergy in allowed_allergies for allergy in v):
                raise ValueError(f'Solo se permiten las alergias: {", ".join(allowed_allergies)}')
            return v
        raise ValueError('Las alergias deben ser una lista o una cadena separada por comas')

    @validator('street_address')
    def validate_street_address(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError('La dirección debe tener al menos 5 caracteres')
        return v

    @validator('neighborhood')
    def validate_neighborhood(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError('La colonia debe tener al menos 3 caracteres')
        return v

    @validator('full_name')
    def validate_full_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        return v

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Contraseña")
    confirm_password: str = Field(..., description="Confirmación de contraseña")

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Las contraseñas no coinciden')
        return v

    @validator('allergies')
    def validate_allergies(cls, v):
        if v is None:
            return []
        allowed_allergies = ['cacahuate', 'piña']
        if not all(allergy in allowed_allergies for allergy in v):
            raise ValueError('Solo se permiten las alergias: cacahuate, piña')
        return v

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Las contraseñas no coinciden')
        return v

class UserInDB(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class User(UserInDB):
    class Config:
        from_attributes = True
