from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.student import Student
from ..models.academic import Academic
from ..schemas.academic import AcademicCreate, AcademicUpdate

async def _validate_student(db: AsyncSession, tenant_id: int, student_id: int):
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    if not result.scalar_one_or_none():
        raise ValueError("Siswa tidak ditemukan")

async def create_academic(db: AsyncSession, tenant_id: int, data: AcademicCreate) -> Academic:
    await _validate_student(db, tenant_id, data.student_id)
    record = Academic(tenant_id=tenant_id, **data.model_dump())
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record

async def get_academic(db: AsyncSession, tenant_id: int, academic_id: int) -> Optional[Academic]:
    result = await db.execute(
        select(Academic).where(Academic.id == academic_id, Academic.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()

async def get_academics(
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

async def update_academic(db: AsyncSession, tenant_id: int, academic_id: int, data: AcademicUpdate) -> Optional[Academic]:
    record = await get_academic(db, tenant_id, academic_id)
    if not record:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
    await db.commit()
    await db.refresh(record)
    return record

async def delete_academic(db: AsyncSession, tenant_id: int, academic_id: int) -> Optional[Academic]:
    record = await get_academic(db, tenant_id, academic_id)
    if not record:
        return None
    await db.delete(record)
    await db.commit()
    return record
