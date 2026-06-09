from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, StaffCreateDTO
from src.backend.controllers import user_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/users", tags=["Users"])

# Untuk pendaftaran Admin Sekolah pakai registration code
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreateDTO, db: Session = Depends(get_db)):
    return user_controller.register_user(db=db, user_data=user_data)

# Untuk pendaftaran Konselor/Admin (wajib login sbg atmin)
@router.post("/staff", status_code=status.HTTP_201_CREATED)
def create_staff_member(
    data: StaffCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    return user_controller.create_staff(db, data, current_user)

@router.get("/")
def get_all_users(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
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