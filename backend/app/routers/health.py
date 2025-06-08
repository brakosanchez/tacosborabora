from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.db.mongodb import MongoDB
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="", tags=["health"])

@router.options("/health", status_code=status.HTTP_200_OK)
async def options_health_check() -> Dict[str, str]:
    """Maneja las solicitudes OPTIONS para /health"""
    return {}

@router.get("/health", include_in_schema=True, response_model=Dict[str, Any])
async def health_check() -> Dict[str, Any]:
    """
    Endpoint de salud que verifica el estado de la API y sus dependencias.
    """
    try:
        # Verificar conexión con MongoDB
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        await client.admin.command('ping')
        
        # Verificar que la base de datos existe y es accesible
        db = client[settings.MONGODB_DB]
        collections = await db.list_collection_names()
        
        # Crear respuesta con fechas formateadas como cadenas ISO
        response = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": settings.VERSION,
            "database": {
                "status": "connected",
                "name": settings.MONGODB_DB,
                "collections": collections
            }
        }
        
        # Asegurarse de que no hay objetos datetime en la respuesta
        def convert_dates(obj):
            if isinstance(obj, dict):
                return {k: convert_dates(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_dates(item) for item in obj]
            elif isinstance(obj, datetime):
                return obj.isoformat()
            return obj
            
        return convert_dates(response)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "unhealthy",
                "error": str(e),
                "database": {
                    "status": "disconnected",
                    "error": str(e)
                }
            }
        )

@router.get("/protected", include_in_schema=False, response_model=Dict[str, Any])
async def protected_health_check(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Endpoint de salud protegido que verifica la autenticación del usuario.
    """
    # Crear respuesta con fechas formateadas como cadenas ISO
    response = {
        "status": "authenticated",
        "user_id": str(current_user.id),
        "email": current_user.email,
        "is_active": current_user.is_active,
        "is_superuser": current_user.is_superuser,
        "timestamp": datetime.utcnow().isoformat(),
        "created_at": getattr(current_user, 'created_at', None),
        "updated_at": getattr(current_user, 'updated_at', None),
        "last_login": getattr(current_user, 'last_login', None)
    }
    
    # Asegurarse de que no hay objetos datetime en la respuesta
    def convert_dates(obj):
        if isinstance(obj, dict):
            return {k: convert_dates(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_dates(item) for item in obj]
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return obj
        
    return convert_dates(response)
