from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from ..models.student import Student
from ..models.socio_economic import SocioEconomic
from ..schemas.socio_economic import SocioEconomicCreate, SocioEconomicUpdate
from ..services.audit_service import log_action

async def _validate_student(db: AsyncSession, tenant_id: int, student_id: int):
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    if not result.scalar_one_or_none():
        raise ValueError("Siswa tidak ditemukan")

async def create_socio_economic(db: AsyncSession, tenant_id: int, data: SocioEconomicCreate, user_id: int) -> SocioEconomic:
    await _validate_student(db, tenant_id, data.student_id)
    existing = await get_by_student(db, tenant_id, data.student_id)
    if existing:
        raise ValueError("Data sosial ekonomi sudah ada untuk siswa ini")
    record = SocioEconomic(tenant_id=tenant_id, **data.model_dump())
    db.add(record)
    await db.commit()
    await db.refresh(record)
    await log_action(db, tenant_id, user_id, "create", "socio_economic", record.id, f"Student ID: {data.student_id}")
    return record

async def get_socio_economic(db: AsyncSession, tenant_id: int, id: int) -> Optional[SocioEconomic]:
    result = await db.execute(
        select(SocioEconomic).where(SocioEconomic.id == id, SocioEconomic.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()

async def get_by_student(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[SocioEconomic]:
    result = await db.execute(
        select(SocioEconomic).where(SocioEconomic.student_id == student_id, SocioEconomic.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()

async def update_socio_economic(db: AsyncSession, tenant_id: int, id: int, data: SocioEconomicUpdate, user_id: int) -> Optional[SocioEconomic]:
    record = await get_socio_economic(db, tenant_id, id)
    if not record:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
    await db.commit()
    await db.refresh(record)
    await log_action(db, tenant_id, user_id, "update", "socio_economic", id, f"Update: {update_data}")
    return record

async def delete_socio_economic(db: AsyncSession, tenant_id: int, id: int, user_id: int) -> Optional[SocioEconomic]:
    record = await get_socio_economic(db, tenant_id, id)
    if not record:
        return None
    await db.delete(record)
    await db.commit()
    await log_action(db, tenant_id, user_id, "delete", "socio_economic", id)
    return record
