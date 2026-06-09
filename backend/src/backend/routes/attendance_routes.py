from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.attendance_dto import AttendanceCreateDTO, AttendanceUpdateDTO
from src.backend.controllers import attendance_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/attendances", tags=["Attendance"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_attendance(
    data: AttendanceCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return attendance_controller.create_attendance(db, data, current_user)

@router.get("/student/{student_id}")
def get_student_attendances(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return attendance_controller.fetch_student_attendances(db, student_id, current_user)

@router.put("/{attendance_id}")
def update_attendance(
    attendance_id: str,
    data: AttendanceUpdateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return attendance_controller.update_attendance(db, attendance_id, data, current_user)

@router.delete("/{attendance_id}")
def delete_attendance(
    attendance_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    return attendance_controller.delete_attendance(db, attendance_id, current_user)