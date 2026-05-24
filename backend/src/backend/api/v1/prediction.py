from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ...core.database import get_db
from ...core.security import get_current_user, require_role
from ...models.user import User
from ...schemas.prediction import PredictionResponse, PredictionResult, RiskSummaryResponse
from ...services.prediction_service import (
    predict_student, get_predictions_by_student, get_latest_prediction,
    get_risk_summary, get_top_risk,
)

router = APIRouter()

@router.post("/student/{student_id}", response_model=PredictionResult)
async def predict_student_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin", "konselor"])),
):
    try:
        return await predict_student(db, current_user.tenant_id, student_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/student/{student_id}", response_model=list[PredictionResponse])
async def list_predictions_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50),
):
    return await get_predictions_by_student(db, current_user.tenant_id, student_id, limit)

@router.get("/student/{student_id}/latest", response_model=Optional[PredictionResponse])
async def latest_prediction_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prediction = await get_latest_prediction(db, current_user.tenant_id, student_id)
    if not prediction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Belum ada prediksi untuk siswa ini")
    return prediction

@router.get("/risk-summary", response_model=RiskSummaryResponse)
async def risk_summary_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_risk_summary(db, current_user.tenant_id)

@router.get("/top-risk")
async def top_risk_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50),
):
    return await get_top_risk(db, current_user.tenant_id, limit)
