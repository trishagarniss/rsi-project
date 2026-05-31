from fastapi import Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ..database.engine import get_db
from ..middlewares.auth import get_current_user, require_role
from ..models.user import User
from ..dto.academic import AcademicCreate, AcademicUpdate, AcademicResponse
from ..services.academic_service import (
    create_academic, get_academic, get_academics,
    update_academic, delete_academic,
)

async def create_academic_endpoint(
    data: AcademicCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    try:
        return await create_academic(db, current_user.tenant_id, data, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

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

async def get_academic_endpoint(
    academic_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_academic(db, current_user.tenant_id, academic_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data akademik tidak ditemukan")
    return record

async def update_academic_endpoint(
    academic_id: int,
    data: AcademicUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await update_academic(db, current_user.tenant_id, academic_id, data, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data akademik tidak ditemukan")
    return record

async def delete_academic_endpoint(
    academic_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await delete_academic(db, current_user.tenant_id, academic_id, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data akademik tidak ditemukan")
