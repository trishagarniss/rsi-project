from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.database.engine import get_db
from src.backend.dto.user_dto import UserLoginDTO
from src.backend.controllers import auth_controller

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/login")
def login(login_data: UserLoginDTO, db: Session = Depends(get_db)):
    return auth_controller.login(db=db, login_data=login_data)