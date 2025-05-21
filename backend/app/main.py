from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.inventory_item import InventoryItem
from app.routers import auth, users, menu, orders, inventory

app = FastAPI(title="Tacos Bora Bora API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database connection"""
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(
        database=client[settings.MONGODB_DB],
        document_models=[User, Product, Order, InventoryItem]
    )

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(menu.router, prefix="/api/menu", tags=["menu"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Tacos Bora Bora"}
