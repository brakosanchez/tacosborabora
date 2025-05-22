from fastapi import APIRouter, Depends, HTTPException
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderUpdate
from typing import List
from beanie import PydanticObjectId

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=Order)
async def create_order(order: OrderCreate):
    db_order = Order(**order.model_dump())
    await db_order.save()
    return db_order

@router.get("/", response_model=List[Order])
async def read_orders():
    orders = await Order.find_all().to_list()
    return orders

@router.get("/{order_id}", response_model=Order)
async def read_order(order_id: PydanticObjectId):
    order = await Order.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}", response_model=Order)
async def update_order(order_id: PydanticObjectId, order: OrderUpdate):
    db_order = await Order.get(order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = order.model_dump(exclude_unset=True)
    await db_order.update(**update_data)
    return db_order

@router.delete("/{order_id}")
async def delete_order(order_id: PydanticObjectId):
    order = await Order.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    await order.delete()
    return {"message": "Order deleted successfully"}
