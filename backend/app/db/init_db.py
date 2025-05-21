from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.inventory_item import InventoryItem

async def init_db():
    """Initialize database connection and create indexes"""
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    
    # Initialize Beanie with the database and all document models
    await init_beanie(
        database=client[settings.MONGODB_DB],
        document_models=[
            User,
            Product,
            Order,
            InventoryItem,
        ]
    )

    # Create indexes
    await User.create_indexes()
    await Product.create_indexes()
    await Order.create_indexes()
    await InventoryItem.create_indexes()

    return client[settings.MONGODB_DB]
