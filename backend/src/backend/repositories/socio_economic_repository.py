from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from ..models.student import Student
from ..models.socio_economic import SocioEconomic


async def find_student_by_id(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[Student]:
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    return result.scalar_one_or_none()


async def find_socio_economic_by_id(db: AsyncSession, tenant_id: int, id: int) -> Optional[SocioEconomic]:
    result = await db.execute(
        select(SocioEconomic).where(SocioEconomic.id == id, SocioEconomic.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def find_by_student(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[SocioEconomic]:
    result = await db.execute(
        select(SocioEconomic).where(SocioEconomic.student_id == student_id, SocioEconomic.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def create_socio_economic(db: AsyncSession, tenant_id: int, data_dict: dict) -> SocioEconomic:
    record = SocioEconomic(tenant_id=tenant_id, **data_dict)
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def update_socio_economic_fields(db: AsyncSession, record: SocioEconomic, update_data: dict) -> SocioEconomic:
    for key, value in update_data.items():
        setattr(record, key, value)
    await db.flush()
    await db.refresh(record)
    return record


async def delete_socio_economic_record(db: AsyncSession, record: SocioEconomic) -> None:
    await db.delete(record)
    await db.flush()
