from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Tacos Bora Bora"
    
    # MongoDB
    MONGODB_URI: str
    MONGODB_DB: str
    
    # JWT
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://tacosborabora.com"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
settings = get_settings()
