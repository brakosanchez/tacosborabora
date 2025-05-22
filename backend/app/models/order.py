from beanie import Document
from typing import List, Optional
from datetime import datetime
from pydantic import Field, BaseModel

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class Order(Document):
    user_id: str
    items: List[OrderItem]
    total_amount: float
    status: str = Field(default="pending")  # "pending" | "preparing" | "ready" | "delivered" | "cancelled"
    payment_method: str = Field(default="cash")  # "cash" | "card" | "online"
    delivery_address: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "orders"

    def update_timestamp(self):
        self.updated_at = datetime.now()
