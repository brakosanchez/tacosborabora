"""
Módulo de rutas para la seguridad de la aplicación.
Incluye endpoints para CSRF, validación de formularios, etc.
"""
from fastapi import APIRouter, Request, Response, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import secrets
from datetime import datetime, timedelta
import hashlib
import hmac
import os

router = APIRouter(prefix="/api/security", tags=["security"])

# Configuración de seguridad
CSRF_TOKEN_EXPIRY_HOURS = 24  # 24 horas de validez para el token CSRF
CSRF_TOKEN_LENGTH = 32  # Longitud del token CSRF en bytes

# Almacenamiento en memoria para tokens CSRF (en producción, usa una base de datos)
csrf_tokens = {}

# Esquema de autenticación HTTP Bearer
security = HTTPBearer()

def generate_csrf_token() -> str:
    """Genera un token CSRF seguro."""
    return secrets.token_urlsafe(CSRF_TOKEN_LENGTH)

def generate_csrf_token_pair() -> tuple[str, str]:
    """
    Genera un par de tokens CSRF: uno para la cookie y otro para el encabezado.
    Devuelve (cookie_token, header_token)
    """
    # Generar un token aleatorio seguro
    token = secrets.token_urlsafe(CSRF_TOKEN_LENGTH)
    
    # Crear un token firmado para la cookie
    secret_key = os.getenv("CSRF_SECRET_KEY", "default-insecure-secret-key")
    signature = hmac.new(
        secret_key.encode(),
        token.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Combinar el token con la firma
    cookie_token = f"{token}.{signature}"
    
    return cookie_token, token

def verify_csrf_token(cookie_token: str, header_token: str) -> bool:
    """
    Verifica que el token del encabezado coincida con el token de la cookie.
    También verifica la firma del token de la cookie.
    """
    if not cookie_token or not header_token:
        return False
    
    # Separar el token de la firma
    parts = cookie_token.split('.')
    if len(parts) != 2:
        return False
    
    token, signature = parts
    
    # Verificar la firma
    secret_key = os.getenv("CSRF_SECRET_KEY", "default-insecure-secret-key")
    expected_signature = hmac.new(
        secret_key.encode(),
        token.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Usar comparación segura para evitar ataques de tiempo
    if not hmac.compare_digest(signature, expected_signature):
        return False
    
    # Verificar que el token del encabezado coincida con el token de la cookie
    return hmac.compare_digest(token, header_token)

@router.get("/csrf-token")
async def get_csrf_token():
    """
    Genera un nuevo token CSRF y lo devuelve en una cookie.
    El frontend debe incluir este token en el encabezado X-CSRF-Token en solicitudes POST/PUT/DELETE.
    """
    cookie_token, header_token = generate_csrf_token_pair()
    
    # Configurar la respuesta
    response = {
        "message": "CSRF token generado exitosamente",
        "token": header_token  # Solo para referencia, el frontend debe usar la cookie
    }
    
    # Crear la respuesta con la cookie
    from fastapi.responses import JSONResponse
    response_obj = JSONResponse(content=response)
    
    # Configurar la cookie HTTP-Only y SameSite=Lax
    response_obj.set_cookie(
        key="csrftoken",
        value=cookie_token,
        httponly=True,
        samesite="lax",  # o "strict" para mayor seguridad
        secure=os.getenv("ENVIRONMENT", "development") == "production",  # Solo HTTPS en producción
        max_age=CSRF_TOKEN_EXPIRY_HOURS * 3600,  # Tiempo de expiración en segundos
        domain=os.getenv("COOKIE_DOMAIN", None),
        path="/"
    )
    
    return response_obj

@router.post("/verify-csrf")
async def verify_csrf(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Verifica si el token CSRF proporcionado es válido.
    Se espera que el token esté en el encabezado 'Authorization: Bearer <token>'
    y que la cookie 'csrftoken' esté presente.
    """
    # Obtener el token del encabezado de autorización
    header_token = credentials.credentials if credentials else None
    
    # Obtener el token de la cookie
    cookie_token = request.cookies.get("csrftoken")
    
    # Verificar los tokens
    if not verify_csrf_token(cookie_token, header_token):
        raise HTTPException(
            status_code=403,
            detail="Token CSRF inválido o faltante"
        )
    
    return {"message": "Token CSRF válido"}

# Middleware para verificar CSRF en solicitudes no seguras
async def csrf_protection(request: Request, call_next):
    # Solo verificar métodos que modifican datos
    if request.method in ("POST", "PUT", "PATCH", "DELETE"):
        # Obtener el token del encabezado
        header_token = request.headers.get("x-csrftoken")
        
        # Obtener el token de la cookie
        cookie_token = request.cookies.get("csrftoken")
        
        # Verificar los tokens
        if not verify_csrf_token(cookie_token, header_token):
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=403,
                content={"detail": "Token CSRF inválido o faltante"}
            )
    
    # Continuar con la solicitud
    response = await call_next(request)
    return response
