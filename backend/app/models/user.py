from beanie import Document
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime

class User(Document):
    email: EmailStr = Field(..., description="Correo electrónico")
    hashed_password: str = Field(..., description="Contraseña hash")
    full_name: str = Field(..., min_length=2, description="Nombre completo")
    phone: str = Field(..., min_length=10, max_length=10, description="Teléfono")
    street_address: str = Field(..., min_length=5, description="Dirección")
    neighborhood: str = Field(..., min_length=3, description="Colonia")
    allergies: Optional[str] = Field(None, description="Alergias")
    role: str = Field(default="user", description="Rol del usuario")
    is_active: bool = Field(default=True, description="Estado del usuario")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de actualización")

    class Settings:
        name = "users"

    def update_timestamp(self):
        self.updated_at = datetime.utcnow()
