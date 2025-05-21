from beanie import Document
from typing import List, Optional
from datetime import datetime
from pydantic import Field

class OrderItem:
    product_id: str
    quantity: int
    price: float

class Order(Document):
    user_id: str
    items: List[OrderItem]
    total_amount: float
    status: str = "pending"  # "pending" | "preparing" | "ready" | "delivered" | "cancelled"
    payment_method: str  # "cash" | "card" | "online"
    delivery_address: Optional[str]
    notes: Optional[str]
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "orders"

    def update_timestamp(self):
        self.updated_at = datetime.now()
