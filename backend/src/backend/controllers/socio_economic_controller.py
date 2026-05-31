from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.engine import get_db
from ..middlewares.auth import get_current_user, require_role
from ..models.user import User
from ..dto.socio_economic import SocioEconomicCreate, SocioEconomicUpdate, SocioEconomicResponse
from ..services.socio_economic_service import (
    create_socio_economic, get_socio_economic, get_by_student,
    update_socio_economic, delete_socio_economic,
)

async def create_socio_economic_endpoint(
    data: SocioEconomicCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    try:
        return await create_socio_economic(db, current_user.tenant_id, data, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

async def get_by_student_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_by_student(db, current_user.tenant_id, student_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data sosial ekonomi tidak ditemukan")
    return record

async def get_socio_economic_endpoint(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_socio_economic(db, current_user.tenant_id, id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data sosial ekonomi tidak ditemukan")
    return record

async def update_socio_economic_endpoint(
    id: int,
    data: SocioEconomicUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await update_socio_economic(db, current_user.tenant_id, id, data, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data sosial ekonomi tidak ditemukan")
    return record

async def delete_socio_economic_endpoint(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await delete_socio_economic(db, current_user.tenant_id, id, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data sosial ekonomi tidak ditemukan")
