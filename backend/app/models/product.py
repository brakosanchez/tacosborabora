from beanie import Document
from typing import List, Optional
from datetime import datetime

class Product(Document):
    name: str
    description: str
    price: float
    category: str  # "tacos" | "bebidas" | "postres" | "salsas"
    image_url: str
    is_available: bool = True
    ingredients: List[str]
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "products"

    def update_timestamp(self):
        self.updated_at = datetime.now()
