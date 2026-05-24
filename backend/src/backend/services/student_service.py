from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional
from ..models.student import Student
from ..schemas.student import StudentCreate, StudentUpdate, BulkImportResult
from ..utils.validators import validate_unique_nis
from ..services.audit_service import log_action

async def create_student(db: AsyncSession, tenant_id: int, data: StudentCreate, user_id: int) -> Student:
    unique = await validate_unique_nis(db, tenant_id, data.nis)
    if not unique:
        raise ValueError(f"NIS '{data.nis}' sudah terdaftar di tenant ini")

    student = Student(
        tenant_id=tenant_id,
        nis=data.nis,
        name=data.name,
        class_name=data.class_name,
    )
    db.add(student)
    await db.commit()
    await db.refresh(student)
    await log_action(db, tenant_id, user_id, "create", "student", student.id, f"NIS: {data.nis}, Nama: {data.name}")
    return student

async def get_student(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[Student]:
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()

async def get_students(
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

async def update_student(db: AsyncSession, tenant_id: int, student_id: int, data: StudentUpdate, user_id: int) -> Optional[Student]:
    student = await get_student(db, tenant_id, student_id)
    if not student:
        return None

    if data.nis is not None and data.nis != student.nis:
        unique = await validate_unique_nis(db, tenant_id, data.nis, exclude_id=student_id)
        if not unique:
            raise ValueError(f"NIS '{data.nis}' sudah terdaftar di tenant ini")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)

    await db.commit()
    await db.refresh(student)
    await log_action(db, tenant_id, user_id, "update", "student", student_id, f"Update: {update_data}")
    return student

async def soft_delete_student(db: AsyncSession, tenant_id: int, student_id: int, user_id: int) -> Optional[Student]:
    student = await get_student(db, tenant_id, student_id)
    if not student:
        return None

    student.is_active = False
    await db.commit()
    await db.refresh(student)
    await log_action(db, tenant_id, user_id, "delete", "student", student_id, f"Soft delete: {student.nis} - {student.name}")
    return student

async def bulk_create_students(db: AsyncSession, tenant_id: int, data_list: list[StudentCreate], user_id: int) -> BulkImportResult:
    total = len(data_list)
    success = 0
    errors = []

    for i, data in enumerate(data_list):
        try:
            unique = await validate_unique_nis(db, tenant_id, data.nis)
            if not unique:
                errors.append({"row": i + 1, "error": f"NIS '{data.nis}' sudah terdaftar"})
                continue

            student = Student(tenant_id=tenant_id, nis=data.nis, name=data.name, class_name=data.class_name)
            db.add(student)
            await db.flush()
            await log_action(db, tenant_id, user_id, "bulk_create", "student", student.id, f"NIS: {data.nis}")
            success += 1
        except Exception as e:
            errors.append({"row": i + 1, "error": str(e)})

    await db.commit()
    return BulkImportResult(total_rows=total, success_count=success, failed_count=total - success, errors=errors)
