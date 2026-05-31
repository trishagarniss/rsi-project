from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.engine import get_db
from ..middlewares.auth import get_current_user
from ..models.user import User
from ..dto.dashboard import StatsResponse, RiskByClassResponse, RecentActivityResponse
from ..services.dashboard_service import get_stats, get_risk_by_class, get_recent_activity

async def stats_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_stats(db, current_user.tenant_id)

async def risk_by_class_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_risk_by_class(db, current_user.tenant_id)

async def recent_activity_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(20, ge=1, le=100),
):
    return await get_recent_activity(db, current_user.tenant_id, limit)
