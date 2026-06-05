from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO
from src.backend.controllers import user_controller

router = APIRouter(prefix="/api/v1/users", tags=["Users"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreateDTO, db: Session = Depends(get_db)):
    return user_controller.register_user(db=db, user_data=user_data)

@router.get("/")
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_controller.fetch_all_users(db=db, skip=skip, limit=limit)

@router.get("/{user_id}")
def get_user_detail(user_id: str, db: Session = Depends(get_db)):
    return user_controller.fetch_user_detail(db=db, user_id=user_id)

@router.put("/{user_id}")
def update_user(user_id: str, update_data: UserUpdateDTO, db: Session = Depends(get_db)):
    return user_controller.update_user_profile(db=db, user_id=user_id, update_data=update_data)