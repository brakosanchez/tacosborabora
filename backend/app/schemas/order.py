from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total_amount: float
    status: str = "pending"
    payment_method: str
    delivery_address: Optional[str]
    notes: Optional[str]

class OrderUpdate(BaseModel):
    status: Optional[str]
    delivery_address: Optional[str]
    notes: Optional[str]

class Order(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    total_amount: float
    status: str
    payment_method: str
    delivery_address: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
