from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.database import get_db
from ...core.security import get_current_user, require_role
from ...models.user import User
from ...schemas.socio_economic import SocioEconomicCreate, SocioEconomicUpdate, SocioEconomicResponse
from ...services.socio_economic_service import (
    create_socio_economic, get_socio_economic, get_by_student,
    update_socio_economic, delete_socio_economic,
)

router = APIRouter()

@router.post("/", response_model=SocioEconomicResponse, status_code=status.HTTP_201_CREATED)
async def create_socio_economic_endpoint(
    data: SocioEconomicCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    try:
        return await create_socio_economic(db, current_user.tenant_id, data, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/by-student/{student_id}", response_model=SocioEconomicResponse)
async def get_by_student_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_by_student(db, current_user.tenant_id, student_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data sosial ekonomi tidak ditemukan")
    return record

@router.get("/{id}", response_model=SocioEconomicResponse)
async def get_socio_economic_endpoint(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = await get_socio_economic(db, current_user.tenant_id, id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data sosial ekonomi tidak ditemukan")
    return record

@router.put("/{id}", response_model=SocioEconomicResponse)
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

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_socio_economic_endpoint(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    record = await delete_socio_economic(db, current_user.tenant_id, id, current_user.id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data sosial ekonomi tidak ditemukan")
