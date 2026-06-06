from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.backend.database.engine import get_db
from src.backend.dto.academic_dto import AcademicCreateDTO
from src.backend.controllers import academic_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/academics", tags=["Academic"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_academic(
    data: AcademicCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return academic_controller.register_academic(db, data, current_user)

@router.get("/student/{student_id}")
def get_academics(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return academic_controller.fetch_student_academics(db, student_id, current_user)

@router.put("/{academic_id}")
def update_academic(
    academic_id: str,
    data: AcademicUpdateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return academic_controller.update_academic(db, academic_id, data, current_user)

@router.delete("/{academic_id}")
def delete_academic(
    academic_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])) # Hanya admin yang boleh menghapus rekam jejak nilai
):
    return academic_controller.remove_academic(db, academic_id, current_user)