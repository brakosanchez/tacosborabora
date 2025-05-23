from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.db.mongodb import MongoDB
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(tags=["health"])

@router.get("/health", include_in_schema=False)
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
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": settings.VERSION,
            "database": {
                "status": "connected",
                "name": settings.MONGODB_DB,
                "collections": collections
            }
        }
        
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

@router.get("/health/protected", include_in_schema=False)
async def protected_health_check(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Endpoint de salud protegido que verifica la autenticación del usuario.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "is_active": current_user.is_active
        },
        "message": "La autenticación es exitosa y el token es válido"
    }
