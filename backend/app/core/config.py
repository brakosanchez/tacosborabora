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
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    
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
        "http://192.168.0.16:8000",
        "https://api.tacosborabora.com",
        "https://tacosborabora.com",
        "https://www.tacosborabora.com"
    ]
    
    # Configuración de seguridad
    SECURITY_CSRF_COOKIE_NAME: str = os.getenv("CSRF_COOKIE_NAME", "csrftoken")
    SECURITY_CSRF_HEADER_NAME: str = os.getenv("CSRF_HEADER_NAME", "X-CSRF-Token")
    SECURITY_CSRF_COOKIE_HTTP_ONLY: bool = os.getenv("CSRF_COOKIE_HTTP_ONLY", "True").lower() in ("true", "1", "t")
    SECURITY_CSRF_COOKIE_SECURE: bool = os.getenv("CSRF_COOKIE_SECURE", "False").lower() in ("true", "1", "t")
    SECURITY_CSRF_COOKIE_SAMESITE: str = os.getenv("CSRF_COOKIE_SAMESITE", "lax")  # lax, strict, or none
    SECURITY_CSRF_COOKIE_DOMAIN: str = os.getenv("CSRF_COOKIE_DOMAIN", "")
    SECURITY_CSRF_COOKIE_PATH: str = os.getenv("CSRF_COOKIE_PATH", "/")
    SECURITY_CSRF_COOKIE_MAX_AGE: int = int(os.getenv("CSRF_COOKIE_MAX_AGE", "86400"))  # 24 horas
    SECURITY_CSRF_SECRET_KEY: str = os.getenv("CSRF_SECRET_KEY", secrets.token_urlsafe(32))
    
    # Configuración de rate limiting
    RATE_LIMIT_DEFAULT: str = os.getenv("RATE_LIMIT_DEFAULT", "1000/day, 100/hour")
    RATE_LIMIT_AUTHENTICATED: str = os.getenv("RATE_LIMIT_AUTHENTICATED", "5000/day, 500/hour")
    
    # Configuración de contraseñas
    PASSWORD_MIN_LENGTH: int = int(os.getenv("PASSWORD_MIN_LENGTH", "8"))
    PASSWORD_REQUIRE_UPPERCASE: bool = os.getenv("PASSWORD_REQUIRE_UPPERCASE", "True").lower() in ("true", "1", "t")
    PASSWORD_REQUIRE_NUMBERS: bool = os.getenv("PASSWORD_REQUIRE_NUMBERS", "True").lower() in ("true", "1", "t")
    PASSWORD_REQUIRE_SPECIAL_CHARS: bool = os.getenv("PASSWORD_REQUIRE_SPECIAL_CHARS", "True").lower() in ("true", "1", "t")
    
    # Configuración de sesión
    SESSION_COOKIE_SECURE: bool = os.getenv("SESSION_COOKIE_SECURE", "False").lower() in ("true", "1", "t")
    SESSION_COOKIE_HTTPONLY: bool = os.getenv("SESSION_COOKIE_HTTPONLY", "True").lower() in ("true", "1", "t")
    SESSION_COOKIE_SAMESITE: str = os.getenv("SESSION_COOKIE_SAMESITE", "lax")
    SESSION_LIFETIME: int = int(os.getenv("SESSION_LIFETIME", "86400"))  # 24 horas
    
    # Configuración de seguridad de encabezados
    SECURE_HSTS_SECONDS: int = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))  # 1 año
    SECURE_HSTS_INCLUDE_SUBDOMAINS: bool = os.getenv("SECURE_HSTS_INCLUDE_SUBDOMAINS", "True").lower() in ("true", "1", "t")
    SECURE_HSTS_PRELOAD: bool = os.getenv("SECURE_HSTS_PRELOAD", "True").lower() in ("true", "1", "t")
    SECURE_CONTENT_TYPE_NOSNIFF: bool = os.getenv("SECURE_CONTENT_TYPE_NOSNIFF", "True").lower() in ("true", "1", "t")
    SECURE_BROWSER_XSS_FILTER: bool = os.getenv("SECURE_BROWSER_XSS_FILTER", "True").lower() in ("true", "1", "t")
    SECURE_REFERRER_POLICY: str = os.getenv("SECURE_REFERRER_POLICY", "same-origin")
    
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
    
    # Configuración de entorno
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DOMAIN: str = os.getenv("DOMAIN", "localhost")
    ALLOWED_HOSTS: List[str] = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
settings = get_settings()
