from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.controllers import risk_prediction_controller
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
    """Memicu model ML untuk memprediksi risiko satu siswa spesifik"""
    return risk_prediction_controller.trigger_prediction(db, student_id, current_user)

@router.get("/student/{student_id}")
def get_student_latest_prediction(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    """Melihat hasil prediksi terakhir milik siswa tersebut"""
    return risk_prediction_controller.get_latest_prediction(db, student_id, current_user)