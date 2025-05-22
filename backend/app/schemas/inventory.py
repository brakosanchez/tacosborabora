from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class InventoryItemBase(BaseModel):
    name: str
    quantity: int
    unit: str
    min_quantity: int = Field(default=10)
    last_updated: datetime = Field(default_factory=datetime.now)
    notes: Optional[str] = None

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    min_quantity: Optional[int] = None
    notes: Optional[str] = None

class InventoryItem(InventoryItemBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
