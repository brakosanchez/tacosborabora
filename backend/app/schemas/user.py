from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class User(UserInDB):
    class Config:
        from_attributes = True
