from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ...core.database import get_db
from ...core.security import get_current_user, require_role
from ...models.user import User
from ...schemas.intervention import InterventionCreate, InterventionUpdate, InterventionResponse
from ...services.counseling_service import (
    create_intervention, get_intervention, get_interventions,
    update_intervention, delete_intervention,
)

router = APIRouter()

@router.post("/", response_model=InterventionResponse, status_code=status.HTTP_201_CREATED)
async def create_intervention_endpoint(
    data: InterventionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin", "konselor"])),
):
    try:
        return await create_intervention(db, current_user.tenant_id, data, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/", response_model=list[InterventionResponse])
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

@router.get("/{intervention_id}", response_model=InterventionResponse)
async def get_intervention_endpoint(
    intervention_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_intervention(db, current_user.tenant_id, intervention_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intervensi tidak ditemukan")
    return record

@router.put("/{intervention_id}", response_model=InterventionResponse)
async def update_intervention_endpoint(
    intervention_id: int,
    data: InterventionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await update_intervention(db, current_user.tenant_id, intervention_id, data)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intervensi tidak ditemukan")
    return record

@router.delete("/{intervention_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_intervention_endpoint(
    intervention_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await delete_intervention(db, current_user.tenant_id, intervention_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intervensi tidak ditemukan")
