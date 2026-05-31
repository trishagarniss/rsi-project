from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..models.student import Student
from ..dto.student import StudentCreate, StudentUpdate, BulkImportResult
from ..utils.validators import validate_unique_nis
from ..services.audit_service import log_action
from ..repositories.student_repository import (
    find_student_by_id, find_students,
    create_student as repo_create_student,
    update_student_fields, soft_delete_student as repo_soft_delete,
    find_student_by_nis,
)


async def create_student(db: AsyncSession, tenant_id: int, data: StudentCreate, user_id: int) -> Student:
    unique = await validate_unique_nis(db, tenant_id, data.nis)
    if not unique:
        raise ValueError(f"NIS '{data.nis}' sudah terdaftar di tenant ini")

    student = await repo_create_student(db, tenant_id, data.nis, data.name, data.class_name)
    await db.commit()
    await log_action(db, tenant_id, user_id, "create", "student", student.id, f"NIS: {data.nis}, Nama: {data.name}")
    return student


async def get_student(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[Student]:
    return await find_student_by_id(db, tenant_id, student_id)


async def get_students(
    db: AsyncSession, tenant_id: int,
    skip: int = 0, limit: int = 10,
    search: Optional[str] = None,
    class_name: Optional[str] = None,
) -> tuple[list[Student], int]:
    return await find_students(db, tenant_id, skip, limit, search, class_name)


async def update_student(db: AsyncSession, tenant_id: int, student_id: int, data: StudentUpdate, user_id: int) -> Optional[Student]:
    student = await find_student_by_id(db, tenant_id, student_id)
    if not student:
        return None

    if data.nis is not None and data.nis != student.nis:
        unique = await validate_unique_nis(db, tenant_id, data.nis, exclude_id=student_id)
        if not unique:
            raise ValueError(f"NIS '{data.nis}' sudah terdaftar di tenant ini")

    update_data = data.model_dump(exclude_unset=True)
    student = await update_student_fields(db, student, update_data)
    await db.commit()
    await log_action(db, tenant_id, user_id, "update", "student", student_id, f"Update: {update_data}")
    return student


async def soft_delete_student(db: AsyncSession, tenant_id: int, student_id: int, user_id: int) -> Optional[Student]:
    student = await find_student_by_id(db, tenant_id, student_id)
    if not student:
        return None

    student = await repo_soft_delete(db, student)
    await db.commit()
    await log_action(db, tenant_id, user_id, "delete", "student", student_id, f"Soft delete: {student.nis} - {student.name}")
    return student


async def bulk_create_students(db: AsyncSession, tenant_id: int, data_list: list[StudentCreate], user_id: int) -> BulkImportResult:
    total = len(data_list)
    success = 0
    errors = []

    for i, data in enumerate(data_list):
        try:
            existing = await find_student_by_nis(db, tenant_id, data.nis)
            if existing:
                errors.append({"row": i + 1, "error": f"NIS '{data.nis}' sudah terdaftar"})
                continue

            student = await repo_create_student(db, tenant_id, data.nis, data.name, data.class_name)
            await log_action(db, tenant_id, user_id, "bulk_create", "student", student.id, f"NIS: {data.nis}")
            success += 1
        except Exception as e:
            errors.append({"row": i + 1, "error": str(e)})

    await db.commit()
    return BulkImportResult(total_rows=total, success_count=success, failed_count=total - success, errors=errors)
