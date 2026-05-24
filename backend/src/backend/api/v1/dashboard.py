from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...schemas.dashboard import StatsResponse, RiskByClassResponse, RecentActivityResponse
from ...services.dashboard_service import get_stats, get_risk_by_class, get_recent_activity

router = APIRouter()

@router.get("/stats", response_model=StatsResponse)
async def stats_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_stats(db, current_user.tenant_id)

@router.get("/risk-by-class", response_model=RiskByClassResponse)
async def risk_by_class_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_risk_by_class(db, current_user.tenant_id)

@router.get("/recent-activity", response_model=RecentActivityResponse)
async def recent_activity_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(20, ge=1, le=100),
):
    return await get_recent_activity(db, current_user.tenant_id, limit)
