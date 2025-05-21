from beanie import Document
from pydantic import EmailStr
from typing import Optional
from datetime import datetime

class User(Document):
    email: EmailStr
    hashed_password: str
    full_name: str
    role: str  # "admin" | "employee" | "customer"
    is_active: bool = True
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "users"

    def update_timestamp(self):
        self.updated_at = datetime.now()
