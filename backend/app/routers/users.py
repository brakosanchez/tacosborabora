from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB
from app.core.security import get_password_hash, verify_password
from app.core.config import settings
from typing import List
from beanie import PydanticObjectId

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserInDB)
async def create_user(user: UserCreate):
    db_user = await User.find_one(User.email == user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        hashed_password=hashed_password
    )
    await db_user.save()
    return db_user

@router.get("/", response_model=List[UserInDB])
async def read_users():
    users = await User.find_all().to_list()
    return users

@router.get("/{user_id}", response_model=UserInDB)
async def read_user(user_id: PydanticObjectId):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
