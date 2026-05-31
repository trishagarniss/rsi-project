from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..models.socio_economic import SocioEconomic
from ..dto.socio_economic import SocioEconomicCreate, SocioEconomicUpdate
from ..services.audit_service import log_action
from ..repositories.socio_economic_repository import (
    find_student_by_id, find_socio_economic_by_id, find_by_student,
    create_socio_economic as repo_create_socio_economic,
    update_socio_economic_fields, delete_socio_economic_record,
)


async def _validate_student(db: AsyncSession, tenant_id: int, student_id: int):
    student = await find_student_by_id(db, tenant_id, student_id)
    if not student:
        raise ValueError("Siswa tidak ditemukan")


async def create_socio_economic(db: AsyncSession, tenant_id: int, data: SocioEconomicCreate, user_id: int) -> SocioEconomic:
    await _validate_student(db, tenant_id, data.student_id)
    existing = await find_by_student(db, tenant_id, data.student_id)
    if existing:
        raise ValueError("Data sosial ekonomi sudah ada untuk siswa ini")
    record = await repo_create_socio_economic(db, tenant_id, data.model_dump())
    await db.commit()
    await log_action(db, tenant_id, user_id, "create", "socio_economic", record.id, f"Student ID: {data.student_id}")
    return record


async def get_socio_economic(db: AsyncSession, tenant_id: int, id: int) -> Optional[SocioEconomic]:
    return await find_socio_economic_by_id(db, tenant_id, id)


async def get_by_student(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[SocioEconomic]:
    return await find_by_student(db, tenant_id, student_id)


async def update_socio_economic(db: AsyncSession, tenant_id: int, id: int, data: SocioEconomicUpdate, user_id: int) -> Optional[SocioEconomic]:
    record = await find_socio_economic_by_id(db, tenant_id, id)
    if not record:
        return None
    update_data = data.model_dump(exclude_unset=True)
    record = await update_socio_economic_fields(db, record, update_data)
    await db.commit()
    await log_action(db, tenant_id, user_id, "update", "socio_economic", id, f"Update: {update_data}")
    return record


async def delete_socio_economic(db: AsyncSession, tenant_id: int, id: int, user_id: int) -> Optional[SocioEconomic]:
    record = await find_socio_economic_by_id(db, tenant_id, id)
    if not record:
        return None
    await delete_socio_economic_record(db, record)
    await db.commit()
    await log_action(db, tenant_id, user_id, "delete", "socio_economic", id)
    return record
