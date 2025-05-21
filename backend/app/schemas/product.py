from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: HttpUrl
    ingredients: List[str]

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    category: Optional[str]
    image_url: Optional[HttpUrl]
    ingredients: Optional[List[str]]

class Product(ProductBase):
    id: str
    is_available: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
