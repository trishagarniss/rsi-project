from fastapi import Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ..database.engine import get_db
from ..middlewares.auth import get_current_user, require_role
from ..models.user import User
from ..dto.prediction import PredictionResponse, PredictionResult, RiskSummaryResponse
from ..services.prediction_service import (
    predict_student, get_predictions_by_student, get_latest_prediction,
    get_risk_summary, get_top_risk,
)

async def predict_student_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin", "konselor"])),
):
    try:
        return await predict_student(db, current_user.tenant_id, student_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def list_predictions_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50),
):
    return await get_predictions_by_student(db, current_user.tenant_id, student_id, limit)

async def latest_prediction_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prediction = await get_latest_prediction(db, current_user.tenant_id, student_id)
    if not prediction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Belum ada prediksi untuk siswa ini")
    return prediction

async def risk_summary_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_risk_summary(db, current_user.tenant_id)

async def top_risk_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50),
):
    return await get_top_risk(db, current_user.tenant_id, limit)
