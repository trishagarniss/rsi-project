from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.controllers import risk_prediction_controller
from src.backend.controllers.risk_prediction_controller import BulkPredictRequestDTO # Wajib import DTO ini
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/predictions", tags=["Risk Prediction"])

@router.post("/student/{student_id}", status_code=status.HTTP_201_CREATED)
def trigger_student_prediction(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.predict_single_student(db, student_id, current_user)

@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def trigger_bulk_prediction(
    request_data: BulkPredictRequestDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.predict_bulk_students(db, request_data, current_user)

@router.get("/student/{student_id}")
def get_student_latest_prediction(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.get_prediction_history(db, student_id, current_user)

@router.get("/student/all")
def get_student_latest_prediction(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.get_prediction_history_all(db, current_user)