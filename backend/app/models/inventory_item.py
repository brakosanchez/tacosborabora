from beanie import Document
from typing import Optional
from datetime import datetime

class InventoryItem(Document):
    name: str
    description: str
    quantity: int
    unit: str  # "kg", "l", "units", etc.
    min_quantity: int
    supplier: str
    last_purchase_price: float
    is_critical: bool = False
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "inventory_items"

    def update_timestamp(self):
        self.updated_at = datetime.now()
