from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.user_controller import create_user, login_user, get_user_by_id
from schemas.user_schemas import UserCreate, UserResponse, UserLogin
from database import get_db

users_router = APIRouter(prefix="/users", tags=["Users"])

@users_router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

@users_router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, user)

@users_router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_by_id(db, user_id)