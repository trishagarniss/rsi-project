from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ...core.database import get_db
from ...core.security import get_current_user, require_role
from ...models.user import User
from ...schemas.academic import AcademicCreate, AcademicUpdate, AcademicResponse
from ...services.academic_service import (
    create_academic, get_academic, get_academics,
    update_academic, delete_academic,
)

router = APIRouter()

@router.post("/", response_model=AcademicResponse, status_code=status.HTTP_201_CREATED)
async def create_academic_endpoint(
    data: AcademicCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    try:
        return await create_academic(db, current_user.tenant_id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/", response_model=list[AcademicResponse])
async def list_academics_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    student_id: Optional[int] = Query(None),
    tingkat: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit
    records, total = await get_academics(
        db, current_user.tenant_id,
        skip=skip, limit=limit,
        student_id=student_id, tingkat=tingkat,
    )
    return records

@router.get("/{academic_id}", response_model=AcademicResponse)
async def get_academic_endpoint(
    academic_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_academic(db, current_user.tenant_id, academic_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data akademik tidak ditemukan")
    return record

@router.put("/{academic_id}", response_model=AcademicResponse)
async def update_academic_endpoint(
    academic_id: int,
    data: AcademicUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await update_academic(db, current_user.tenant_id, academic_id, data)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data akademik tidak ditemukan")
    return record

@router.delete("/{academic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_academic_endpoint(
    academic_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await delete_academic(db, current_user.tenant_id, academic_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data akademik tidak ditemukan")
