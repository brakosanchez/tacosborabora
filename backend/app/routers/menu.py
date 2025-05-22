from fastapi import APIRouter, Depends, HTTPException
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from typing import List
from beanie import PydanticObjectId

router = APIRouter(prefix="/menu", tags=["menu"])

@router.post("/", response_model=Product)
async def create_product(product: ProductCreate):
    db_product = Product(**product.model_dump())
    await db_product.save()
    return db_product

@router.get("/", response_model=List[Product])
async def read_products():
    products = await Product.find_all().to_list()
    return products

@router.get("/{product_id}", response_model=Product)
async def read_product(product_id: PydanticObjectId):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: PydanticObjectId, product: ProductUpdate):
    db_product = await Product.get(product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.model_dump(exclude_unset=True)
    await db_product.update(**update_data)
    return db_product

@router.delete("/{product_id}")
async def delete_product(product_id: PydanticObjectId):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await product.delete()
    return {"message": "Product deleted successfully"}
