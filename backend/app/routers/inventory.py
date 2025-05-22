from fastapi import APIRouter, Depends, HTTPException
from app.models.inventory_item import InventoryItem
from app.schemas.inventory import InventoryItemCreate, InventoryItemUpdate
from typing import List
from beanie import PydanticObjectId

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.post("/", response_model=InventoryItem)
async def create_inventory_item(item: InventoryItemCreate):
    db_item = InventoryItem(**item.model_dump())
    await db_item.save()
    return db_item

@router.get("/", response_model=List[InventoryItem])
async def read_inventory_items():
    items = await InventoryItem.find_all().to_list()
    return items

@router.get("/{item_id}", response_model=InventoryItem)
async def read_inventory_item(item_id: PydanticObjectId):
    item = await InventoryItem.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item

@router.put("/{item_id}", response_model=InventoryItem)
async def update_inventory_item(item_id: PydanticObjectId, item: InventoryItemUpdate):
    db_item = await InventoryItem.get(item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    update_data = item.model_dump(exclude_unset=True)
    await db_item.update(**update_data)
    return db_item

@router.delete("/{item_id}")
async def delete_inventory_item(item_id: PydanticObjectId):
    item = await InventoryItem.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    await item.delete()
    return {"message": "Inventory item deleted successfully"}
