from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional
from ..models.student import Student


async def find_student_by_id(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[Student]:
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def find_students(
    db: AsyncSession, tenant_id: int,
    skip: int = 0, limit: int = 10,
    search: Optional[str] = None,
    class_name: Optional[str] = None,
) -> tuple[list[Student], int]:
    base = select(Student).where(Student.tenant_id == tenant_id, Student.is_active == True)
    count_base = select(func.count()).where(Student.tenant_id == tenant_id, Student.is_active == True)

    if search:
        search_filter = or_(Student.name.ilike(f"%{search}%"), Student.nis.ilike(f"%{search}%"))
        base = base.where(search_filter)
        count_base = count_base.where(search_filter)

    if class_name:
        base = base.where(Student.class_name == class_name)
        count_base = count_base.where(Student.class_name == class_name)

    total = (await db.execute(count_base)).scalar()
    result = await db.execute(base.offset(skip).limit(limit).order_by(Student.id))
    students = result.scalars().all()
    return list(students), total


async def create_student(db: AsyncSession, tenant_id: int, nis: str, name: str, class_name: Optional[str]) -> Student:
    student = Student(
        tenant_id=tenant_id,
        nis=nis,
        name=name,
        class_name=class_name,
    )
    db.add(student)
    await db.flush()
    await db.refresh(student)
    return student


async def update_student_fields(db: AsyncSession, student: Student, update_data: dict) -> Student:
    for key, value in update_data.items():
        setattr(student, key, value)
    await db.flush()
    await db.refresh(student)
    return student


async def soft_delete_student(db: AsyncSession, student: Student) -> Student:
    student.is_active = False
    await db.flush()
    await db.refresh(student)
    return student


async def find_student_by_nis(db: AsyncSession, tenant_id: int, nis: str) -> Optional[Student]:
    result = await db.execute(
        select(Student).where(Student.tenant_id == tenant_id, Student.nis == nis, Student.is_active == True)
    )
    return result.scalar_one_or_none()
