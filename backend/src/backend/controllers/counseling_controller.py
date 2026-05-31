from fastapi import Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ..database.engine import get_db
from ..middlewares.auth import get_current_user, require_role
from ..models.user import User
from ..dto.intervention import InterventionCreate, InterventionUpdate, InterventionResponse
from ..services.counseling_service import (
    create_intervention, get_intervention, get_interventions,
    update_intervention, delete_intervention,
)

async def create_intervention_endpoint(
    data: InterventionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin", "konselor"])),
):
    try:
        return await create_intervention(db, current_user.tenant_id, data, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def list_interventions_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    student_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    jenis: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit
    records, total = await get_interventions(
        db, current_user.tenant_id,
        skip=skip, limit=limit,
        student_id=student_id, status=status, jenis=jenis,
    )
    return records

async def get_intervention_endpoint(
    intervention_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_intervention(db, current_user.tenant_id, intervention_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intervensi tidak ditemukan")
    return record

async def update_intervention_endpoint(
    intervention_id: int,
    data: InterventionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await update_intervention(db, current_user.tenant_id, intervention_id, data, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intervensi tidak ditemukan")
    return record

async def delete_intervention_endpoint(
    intervention_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await delete_intervention(db, current_user.tenant_id, intervention_id, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intervensi tidak ditemukan")
