"""
Módulo de configuración para la conexión a MongoDB.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.inventory_item import InventoryItem

# Lista de modelos que serán usados con Beanie
DOCUMENT_MODELS = [
    User,
    Product,
    Order,
    InventoryItem
]

class MongoDB:
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_to_database(cls):
        """
        Establece la conexión con MongoDB y configura Beanie.
        """
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
            database = cls.client[settings.MONGODB_DB]
            
            # Inicializar Beanie con los modelos
            await init_beanie(
                database=database,
                document_models=DOCUMENT_MODELS
            )
            
            print("Conexión exitosa a MongoDB")
            return database
            
        except Exception as e:
            print(f"Error al conectar a MongoDB: {e}")
            raise
    
    @classmethod
    async def close_database_connection(cls):
        """
        Cierra la conexión con MongoDB.
        """
        if cls.client is not None:
            cls.client.close()
            print("Conexión a MongoDB cerrada")

# Función para obtener la base de datos
async def get_database():
    """
    Obtiene la instancia de la base de datos.
    """
    if not hasattr(MongoDB, 'client') or MongoDB.client is None:
        await MongoDB.connect_to_database()
    return MongoDB.client[settings.MONGODB_DB]
