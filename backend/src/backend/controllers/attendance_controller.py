from fastapi import Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ..database.engine import get_db
from ..middlewares.auth import get_current_user, require_role
from ..models.user import User
from ..dto.attendance import AttendanceCreate, AttendanceUpdate, AttendanceResponse
from ..services.attendance_service import (
    create_attendance, get_attendance, get_attendances,
    update_attendance, delete_attendance,
)

async def create_attendance_endpoint(
    data: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    try:
        return await create_attendance(db, current_user.tenant_id, data, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def list_attendances_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    student_id: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit
    records, total = await get_attendances(
        db, current_user.tenant_id,
        skip=skip, limit=limit,
        student_id=student_id,
    )
    return records

async def get_attendance_endpoint(
    attendance_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_attendance(db, current_user.tenant_id, attendance_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data absensi tidak ditemukan")
    return record

async def update_attendance_endpoint(
    attendance_id: int,
    data: AttendanceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await update_attendance(db, current_user.tenant_id, attendance_id, data, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data absensi tidak ditemukan")
    return record

async def delete_attendance_endpoint(
    attendance_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await delete_attendance(db, current_user.tenant_id, attendance_id, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data absensi tidak ditemukan")
