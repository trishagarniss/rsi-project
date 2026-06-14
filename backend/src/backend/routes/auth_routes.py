from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.database.engine import get_db
from src.backend.dto.user_dto import UserLoginDTO, UserCreateDTO
from src.backend.controllers import auth_controller

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.get("/check-code/{reg_code}")
def check_reg_code(reg_code: str):
    return auth_controller.check_reg_code(reg_code)

@router.post("/login")
def login(login_data: UserLoginDTO, db: Session = Depends(get_db)):
    return auth_controller.login(db=db, login_data=login_data)

@router.post("/register/{reg_code}", status_code=201)
def register_new_admin(reg_code: str, admin_data: UserCreateDTO, db: Session = Depends(get_db)):
    return auth_controller.register_admin(db, reg_code, admin_data)