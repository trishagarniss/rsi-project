from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.backend.database.engine import get_db
from src.backend.dto.student_dto import StudentCreateDTO
from src.backend.controllers import student_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/students", tags=["Students"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_student(
    student_data: StudentCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    return student_controller.register_student(db, student_data, current_user)

@router.get("/")
def get_students(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return student_controller.fetch_students(db, current_user, skip, limit)

@router.get("/count")
def get_student_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return student_controller.count_students(db, current_user)

@router.get("/{student_id}")
def get_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return student_controller.fetch_student_detail(db, student_id, current_user)

@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])) # Hanya Admin yang boleh hapus
):
    return student_controller.delete_student(db, student_id, current_user)

@router.put("/{student_id}")
def update_student(
    student_id: str,
    student_data: StudentCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    return student_controller.update_student(db, student_id, student_data, current_user)