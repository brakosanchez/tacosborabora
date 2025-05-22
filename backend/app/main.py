from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.inventory_item import InventoryItem
from app.routers import auth, users, menu, orders, inventory, health

# Lista blanca de dominios permitidos
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

# Configurar CORS
app = FastAPI(title="Tacos Bora Bora API")

# Configuración de CORS más permisiva para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    max_age=3600
)

# Middleware para manejo de errores
@app.middleware("http")
async def error_handler(request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Error interno del servidor. Por favor, intenta de nuevo."}
        )

# Incluir rutas
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(menu.router, prefix="/api/menu", tags=["menu"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(health.router, prefix="/api", tags=["health"])

@app.on_event("startup")
async def startup_event():
    """Initialize database connection"""
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(
        database=client[settings.MONGODB_DB],
        document_models=[User, Product, Order, InventoryItem]
    )

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Tacos Bora Bora"}
