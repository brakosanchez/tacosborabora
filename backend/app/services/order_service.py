from typing import List
from datetime import datetime
from app.models.order import Order, OrderItem
from app.models.product import Product

async def create_order(order_data: dict) -> Order:
    # Calcular total_amount
    total_amount = sum(item["quantity"] * item["price"] for item in order_data["items"])
    
    # Crear objetos OrderItem
    items = [
        OrderItem(
            product_id=item["product_id"],
            quantity=item["quantity"],
            price=item["price"]
        )
        for item in order_data["items"]
    ]
    
    # Crear y guardar el pedido
    order = Order(
        user_id=order_data["user_id"],
        items=items,
        total_amount=total_amount,
        status=order_data.get("status", "pending"),
        payment_method=order_data["payment_method"],
        delivery_address=order_data.get("delivery_address"),
        notes=order_data.get("notes")
    )
    await order.insert()
    return order

async def update_order_status(order_id: str, new_status: str) -> Order:
    order = await Order.find_one(Order.id == order_id)
    if not order:
        raise ValueError("Order not found")
    
    order.status = new_status
    order.update_timestamp()
    await order.save()
    return order

async def get_orders_by_status(status: str) -> List[Order]:
    return await Order.find(Order.status == status).to_list()
