from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache
from pydantic import AnyHttpUrl, validator, EmailStr
import secrets
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

class Settings(BaseSettings):    
    # Aplicación
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Tacos Bora Bora"
    SERVER_NAME: str = "Tacos Bora Bora API"
    SERVER_HOST: AnyHttpUrl = "http://localhost:8000"
    VERSION: str = "1.0.0"
    
    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "tacosborabora")
    
    # Seguridad
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-key")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 días
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://192.168.0.16:3000",
        "http://192.168.0.16:8000"
    ]
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Primer usuario administrador
    FIRST_SUPERUSER: EmailStr = os.getenv("FIRST_SUPERUSER", "admin@tacosborabora.com")
    FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD", "changeme")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
settings = get_settings()
