from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.user_dto import UserUpdateDTO, StaffCreateDTO, UserChangePasswordDTO, UserGetTokenDTO, UserCheckTokenDTO, UserChangePasswordByTokenDTO, SuperadminStaffCreateDTO
from src.backend.controllers import user_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/users", tags=["Users"])

@router.post("/staff", status_code=status.HTTP_201_CREATED)
def create_staff_member(
    data: StaffCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    return user_controller.create_staff(db, data, current_user)

@router.post("/superadminstaff", status_code=status.HTTP_201_CREATED)
def create_staff_member_superadmin(
    data: SuperadminStaffCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return user_controller.create_staff_superadmin(db, data, current_user)

@router.get("/")
def get_all_users(
    skip: int = 0, limit: int = 10000, db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN]))
):
    return user_controller.fetch_all_users(db=db, current_user=current_user, skip=skip, limit=limit)

@router.get("/{user_id}")
def get_user_detail(
    user_id: str, db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN]))
):
    return user_controller.fetch_user_detail(db=db, user_id=user_id, current_user=current_user)

@router.put("/{user_id}")
def update_user(
    user_id: str, update_data: UserUpdateDTO, db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN]))
):
    return user_controller.update_user_profile(db=db, user_id=user_id, update_data=update_data, current_user=current_user)

@router.delete("/{user_id}")
def delete_user(
    user_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN]))
):
    return user_controller.delete_existing_user(db=db, user_id=user_id, current_user=current_user)

@router.post("/change_password")
def change_password(
    pw: UserChangePasswordDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return user_controller.change_password(db, pw.old_password, pw.new_password, current_user)

@router.post("/get_token")
def get_token(payload: UserGetTokenDTO, db: Session = Depends(get_db)):
    return user_controller.request_password_reset_token(db, payload.email)
    
@router.post("/check_token")
def check_forgot_token(payload: UserCheckTokenDTO):
    return user_controller.verify_password_reset_token(payload.email, payload.token)

@router.post("/forgot_password")
def forgot_password(payload: UserChangePasswordByTokenDTO, db: Session = Depends(get_db)):
    return user_controller.forgot_password(db, payload.email, payload.token, payload.new_password)

