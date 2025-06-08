from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[EmailStr] = None
    scopes: list[str] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(UserLogin):
    full_name: str
    phone: str
    street_address: str
    neighborhood: str

class UserInDB(UserCreate):
    hashed_password: str
    is_active: bool = True
    role: str = "customer"
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
