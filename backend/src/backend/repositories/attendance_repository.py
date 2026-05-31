from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.student import Student
from ..models.attendance import Attendance


async def find_student_by_id(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[Student]:
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    return result.scalar_one_or_none()


async def find_attendance_by_id(db: AsyncSession, tenant_id: int, attendance_id: int) -> Optional[Attendance]:
    result = await db.execute(
        select(Attendance).where(Attendance.id == attendance_id, Attendance.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def find_attendances(
    db: AsyncSession, tenant_id: int,
    skip: int = 0, limit: int = 10,
    student_id: Optional[int] = None,
) -> tuple[list[Attendance], int]:
    base = select(Attendance).where(Attendance.tenant_id == tenant_id)
    count_base = select(func.count()).where(Attendance.tenant_id == tenant_id)

    if student_id is not None:
        base = base.where(Attendance.student_id == student_id)
        count_base = count_base.where(Attendance.student_id == student_id)

    total = (await db.execute(count_base)).scalar()
    result = await db.execute(base.offset(skip).limit(limit).order_by(Attendance.semester))
    return list(result.scalars().all()), total


async def create_attendance(db: AsyncSession, tenant_id: int, data_dict: dict) -> Attendance:
    record = Attendance(tenant_id=tenant_id, **data_dict)
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def update_attendance_fields(db: AsyncSession, record: Attendance, update_data: dict) -> Attendance:
    for key, value in update_data.items():
        setattr(record, key, value)
    await db.flush()
    await db.refresh(record)
    return record


async def delete_attendance_record(db: AsyncSession, record: Attendance) -> None:
    await db.delete(record)
    await db.flush()
