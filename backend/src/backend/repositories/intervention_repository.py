from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.student import Student
from ..models.intervention import Intervention


async def find_student_by_id(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[Student]:
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    return result.scalar_one_or_none()


async def find_intervention_by_id(db: AsyncSession, tenant_id: int, intervention_id: int) -> Optional[Intervention]:
    result = await db.execute(
        select(Intervention).where(Intervention.id == intervention_id, Intervention.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def find_interventions(
    db: AsyncSession, tenant_id: int,
    skip: int = 0, limit: int = 10,
    student_id: Optional[int] = None,
    status: Optional[str] = None,
    jenis: Optional[str] = None,
) -> tuple[list[Intervention], int]:
    base = select(Intervention).where(Intervention.tenant_id == tenant_id)
    count_base = select(func.count()).where(Intervention.tenant_id == tenant_id)

    if student_id is not None:
        base = base.where(Intervention.student_id == student_id)
        count_base = count_base.where(Intervention.student_id == student_id)
    if status:
        base = base.where(Intervention.status == status)
        count_base = count_base.where(Intervention.status == status)
    if jenis:
        base = base.where(Intervention.jenis == jenis)
        count_base = count_base.where(Intervention.jenis == jenis)

    total = (await db.execute(count_base)).scalar()
    result = await db.execute(base.offset(skip).limit(limit).order_by(Intervention.tanggal_intervensi.desc()))
    return list(result.scalars().all()), total


async def create_intervention(db: AsyncSession, tenant_id: int, data_dict: dict, created_by: int) -> Intervention:
    record = Intervention(tenant_id=tenant_id, created_by=created_by, **data_dict)
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def update_intervention_fields(db: AsyncSession, record: Intervention, update_data: dict) -> Intervention:
    for key, value in update_data.items():
        setattr(record, key, value)
    await db.flush()
    await db.refresh(record)
    return record


async def delete_intervention_record(db: AsyncSession, record: Intervention) -> None:
    await db.delete(record)
    await db.flush()
