from fastapi import APIRouter, HTTPException
from typing import Dict
from datetime import datetime

router = APIRouter(tags=["health"])

@router.get("/health")
async def health_check() -> Dict:
    """
    Endpoint de salud que verifica la conexión con MongoDB
    """
    try:
        # Verificar conexión con MongoDB
        from app.core.config import settings
        from motor.motor_asyncio import AsyncIOMotorClient
        
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        await client.admin.command('ping')
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "mongodb": {
                "status": "connected",
                "uri": settings.MONGODB_URI.split('@')[-1].split('/')[0],
                "database": settings.MONGODB_DB
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service Unavailable: {str(e)}"
        )
