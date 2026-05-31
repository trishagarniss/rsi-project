from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.student import Student
from ..models.academic import Academic


async def find_student_by_id(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[Student]:
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    return result.scalar_one_or_none()


async def find_academic_by_id(db: AsyncSession, tenant_id: int, academic_id: int) -> Optional[Academic]:
    result = await db.execute(
        select(Academic).where(Academic.id == academic_id, Academic.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def find_academics(
    db: AsyncSession, tenant_id: int,
    skip: int = 0, limit: int = 10,
    student_id: Optional[int] = None,
    tingkat: Optional[str] = None,
) -> tuple[list[Academic], int]:
    base = select(Academic).where(Academic.tenant_id == tenant_id)
    count_base = select(func.count()).where(Academic.tenant_id == tenant_id)

    if student_id is not None:
        base = base.where(Academic.student_id == student_id)
        count_base = count_base.where(Academic.student_id == student_id)
    if tingkat:
        base = base.where(Academic.tingkat == tingkat)
        count_base = count_base.where(Academic.tingkat == tingkat)

    total = (await db.execute(count_base)).scalar()
    result = await db.execute(base.offset(skip).limit(limit).order_by(Academic.semester))
    return list(result.scalars().all()), total


async def create_academic(db: AsyncSession, tenant_id: int, data_dict: dict) -> Academic:
    record = Academic(tenant_id=tenant_id, **data_dict)
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def update_academic_fields(db: AsyncSession, record: Academic, update_data: dict) -> Academic:
    for key, value in update_data.items():
        setattr(record, key, value)
    await db.flush()
    await db.refresh(record)
    return record


async def delete_academic_record(db: AsyncSession, record: Academic) -> None:
    await db.delete(record)
    await db.flush()
