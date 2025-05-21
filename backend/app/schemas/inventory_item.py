from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InventoryItemBase(BaseModel):
    name: str
    description: str
    quantity: int
    unit: str
    min_quantity: int
    supplier: str
    last_purchase_price: float

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(InventoryItemBase):
    name: Optional[str]
    description: Optional[str]
    quantity: Optional[int]
    unit: Optional[str]
    min_quantity: Optional[int]
    supplier: Optional[str]
    last_purchase_price: Optional[float]

class InventoryItem(InventoryItemBase):
    id: str
    is_critical: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
