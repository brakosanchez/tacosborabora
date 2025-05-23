import logging
from datetime import datetime
from contextlib import asynccontextmanager
import json
from fastapi import FastAPI, Request, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.db.mongodb import MongoDB
from app.routers import auth, users, menu, orders, inventory, health

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
    lifespan=lifespan
)

# Configuración de CORS
origins = [
    "http://localhost:3000",
    "http://192.168.0.16:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000"
]

# Headers permitidos
allowed_headers = [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
    "X-CSRF-Token",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=allowed_headers,
    expose_headers=allowed_headers,
    max_age=3600
)

# Agregar middleware para manejar las solicitudes OPTIONS
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response(
            content=json.dumps({"detail": "Preflight request successful"}),
            status_code=200,
            media_type="application/json"
        )
    else:
        response = await call_next(request)
    
    # Agregar encabezados CORS
    origin = request.headers.get("origin")
    if origin in origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
    
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
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Request completed: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        raise

# Incluir rutas de la API
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticación"])
app.include_router(users.router, prefix="/api/users", tags=["Usuarios"])
app.include_router(menu.router, prefix="/api/menu", tags=["Menú"])
app.include_router(orders.router, prefix="/api/orders", tags=["Órdenes"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventario"])
app.include_router(health.router, prefix="/api/health", tags=["Salud"])

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

# Ruta de salud
@app.get("/api/health", include_in_schema=False)
async def health_check():
    """
    Verifica el estado de la API.
    """
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION
    }
