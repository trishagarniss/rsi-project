from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from src.backend.database.engine import get_db
from src.backend.dto.user_dto import UserLoginDTO, UserCreateDTO
from src.backend.controllers import auth_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.get("/check-code/{reg_code}")
def check_reg_code(reg_code: str):
    return auth_controller.check_reg_code(reg_code)

@router.post("/login")
def login(login_data: UserLoginDTO, request: Request, db: Session = Depends(get_db)):
    return auth_controller.login(db=db, login_data=login_data, request=request)

@router.get("/login-history")
def login_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR])),
):
    return auth_controller.get_login_history(db, current_user)

@router.post("/logout-all")
def logout_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR])),
):
    return auth_controller.logout_all_devices(db, current_user)

@router.post("/register/{reg_code}", status_code=201)
def register_new_admin(reg_code: str, admin_data: UserCreateDTO, db: Session = Depends(get_db)):
    return auth_controller.register_admin(db, reg_code, admin_data)