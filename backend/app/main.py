import logging
from datetime import datetime
from contextlib import asynccontextmanager
import json
from fastapi import FastAPI, Request, status, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.gzip import GZipMiddleware
from typing import Optional, Dict, Any, List, Union, Callable, Awaitable
import re
import secrets
from app.core.config import settings
from app.middleware.security_middleware import SecurityMiddleware
from app.db.mongodb import MongoDB
from app.routers import auth, users, menu, orders, inventory, health, security
from app.dependencies import get_current_active_user, is_admin
from app.models.user import User, UserRole

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Maneja los eventos de inicio y cierre de la aplicación.
    """
    # Iniciar la conexión con MongoDB
    logger.info("Iniciando aplicación...")
    try:
        await MongoDB.connect_to_database()
        logger.info("Conexión a MongoDB establecida exitosamente")
    except Exception as e:
        logger.error(f"Error al conectar a MongoDB: {e}")
        raise
    
    yield
    
    # Cerrar la conexión con MongoDB
    logger.info("Cerrando aplicación...")
    await MongoDB.close_database_connection()
    logger.info("Conexión a MongoDB cerrada")

# Configuración de la aplicación
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para el sistema de Tacos Bora Bora",
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
    debug=settings.DEBUG,
    redirect_slashes=False,  # Evita redirecciones automáticas de /path a /path/
    # Configuración de CORS
    openapi_extra={
        "servers": [
            {"url": "https://api.tacosborabora.com", "description": "Production server"},
            {"url": "http://localhost:8000", "description": "Development server"}
        ]
    }
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "X-Total-Count"],
    max_age=600
)

# Middleware de seguridad para agregar encabezados HTTP
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, csp_directives: Dict[str, Union[str, List[str]]]):
        super().__init__(app)
        self.csp_directives = csp_directives
        self.csp = "; ".join(
            f"{directive} {' '.join(values) if isinstance(values, list) else values}"
            for directive, values in csp_directives.items()
        )
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Agregar encabezados de seguridad
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
            "Content-Security-Policy": self.csp,
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "X-Content-Security-Policy": self.csp,  # Para navegadores antiguos
            "X-WebKit-CSP": self.csp,  # Para navegadores WebKit antiguos
        }
        
        # No sobrescribir headers ya existentes
        for header, value in security_headers.items():
            if header not in response.headers:
                response.headers[header] = value
        
        return response

# Configuración de CSP (Content Security Policy)
CSP_DIRECTIVES = {
    "default-src": ["'self'"],
    "script-src": [
        "'self'",
        "'unsafe-inline'",  # Necesario para algunos componentes de UI
        "'unsafe-eval'",    # Necesario para algunos scripts de desarrollo
        "https://www.google.com",
        "https://www.gstatic.com",
        "https://www.googletagmanager.com",
    ],
    "style-src": [
        "'self'",
        "'unsafe-inline'",  # Necesario para estilos en línea
        "https://fonts.googleapis.com",
    ],
    "img-src": [
        "'self'",
        "data:",
        "https: data:",
        "https://*.cloudfront.net",
        "https://*.googleapis.com",
        "https://*.gstatic.com",
    ],
    "font-src": [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://fonts.googleapis.com",
    ],
    "connect-src": [
        "'self'",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.googletagmanager.com",
    ],
    "frame-src": [
        "'self'",
        "https://www.google.com",
        "https://www.youtube.com",
    ],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": ""
}

# Añadir middlewares de seguridad
app.add_middleware(SecurityHeadersMiddleware, csp_directives=CSP_DIRECTIVES)

# Middleware de seguridad avanzada
app.add_middleware(
    SecurityMiddleware,
    csrf_protection=True,
    xss_protection=True,
    sql_injection_protection=True,
    rate_limiting=True,
    max_requests=100,  # 100 solicitudes por ventana de tiempo
    time_window=900    # 15 minutos en segundos
)

# Middleware para compresión GZIP
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Middleware para redirección HTTPS
if not settings.DEBUG:
    app.add_middleware(HTTPSRedirectMiddleware)

# Aplicar el middleware CSRF a todas las rutas excepto a las de autenticación y seguridad
exempt_paths = [
    "/api/auth/",
    "/api/security/",
    "/docs",
    "/redoc",
    "/openapi.json"
]

# Middleware para manejar manualmente las opciones preflight
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    # Obtener el origen de la solicitud
    origin = request.headers.get("origin") or request.headers.get("Origin")
    
    # Verificar si el origen está permitido
    is_allowed_origin = origin in settings.CORS_ORIGINS if origin else False
    
    # Si es una solicitud OPTIONS (preflight), responder inmediatamente
    if request.method == "OPTIONS":
        response = Response(
            content=json.dumps({"detail": "Preflight request successful"}),
            status_code=200,
            media_type="application/json"
        )
        
        if is_allowed_origin and origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, X-CSRF-Token"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Expose-Headers"] = "Content-Range"
            response.headers["Access-Control-Max-Age"] = "600"  # 10 minutos
        
        return response
    
    # Para otras solicitudes, continuar con el procesamiento normal
    try:
        # Aplicar protección CSRF a rutas no exentas
        if not any(request.url.path.startswith(path) for path in exempt_paths):
            csrf_result = await csrf_protection(request, call_next)
            if csrf_result is not None:
                return csrf_result
        
        response = await call_next(request)
        
        # Agregar headers CORS a la respuesta
        if is_allowed_origin and origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Expose-Headers"] = "*"
        
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        response = JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )
        if is_allowed_origin and origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

# Manejo de excepciones global
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error no manejado: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Error interno del servidor. Por favor, intente de nuevo más tarde."}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Error de validación: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )

# Middleware para log de peticiones
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Registrar detalles de la solicitud entrante
    logger.info(f"\n{'='*50}")
    logger.info(f"Incoming request: {request.method} {request.url}")
    logger.info(f"Headers: {dict(request.headers)}")
    
    # Obtener el cuerpo de la solicitud para métodos que lo envían (POST, PUT, PATCH)
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.body()
            if body:
                logger.info(f"Request body: {body.decode()}")
        except Exception as e:
            logger.warning(f"Could not read request body: {str(e)}")
    
    # Procesar la solicitud y obtener la respuesta
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        # Asegurarnos de no modificar las respuestas CORS
        if "access-control-allow-origin" not in {k.lower() for k in response.headers.keys()} and request.method != "OPTIONS":
            # Solo agregar encabezados CORS si no están ya presentes
            origin = request.headers.get('origin')
            if origin in settings.CORS_ORIGINS:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
        
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        raise
    finally:
        logger.info(f"{'='*50}\n")

# Incluir routers
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# Rutas protegidas por autenticación
app.include_router(
    users.router, 
    prefix="/api/users", 
    tags=["users"],
    dependencies=[Depends(get_current_active_user)]
)

# Rutas protegidas por rol de administrador
app.include_router(
    menu.router, 
    prefix="/api/menu", 
    tags=["menu"],
    dependencies=[Depends(is_admin)]
)

app.include_router(
    orders.router, 
    prefix="/api/orders", 
    tags=["orders"],
    dependencies=[Depends(get_current_active_user)]
)

app.include_router(
    inventory.router, 
    prefix="/api/inventory", 
    tags=["inventory"],
    dependencies=[Depends(is_admin)]
)

app.include_router(
    security.router, 
    prefix="/api/security", 
    tags=["security"],
    dependencies=[Depends(is_admin)]
)

# Ruta raíz
@app.get("/", include_in_schema=False)
async def root():
    """
    Ruta raíz de la API.
    """
    return {
        "message": f"Bienvenido a la API de {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "docs": "/api/docs",
        "redoc": "/api/redoc"
    }
