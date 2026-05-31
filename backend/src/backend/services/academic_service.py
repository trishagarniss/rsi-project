from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..models.academic import Academic
from ..dto.academic import AcademicCreate, AcademicUpdate
from ..services.audit_service import log_action
from ..repositories.academic_repository import (
    find_student_by_id, find_academic_by_id, find_academics,
    create_academic as repo_create_academic, update_academic_fields, delete_academic_record,
)


async def _validate_student(db: AsyncSession, tenant_id: int, student_id: int):
    student = await find_student_by_id(db, tenant_id, student_id)
    if not student:
        raise ValueError("Siswa tidak ditemukan")


async def create_academic(db: AsyncSession, tenant_id: int, data: AcademicCreate, user_id: int) -> Academic:
    await _validate_student(db, tenant_id, data.student_id)
    record = await repo_create_academic(db, tenant_id, data.model_dump())
    await db.commit()
    await log_action(db, tenant_id, user_id, "create", "academic", record.id, f"Student ID: {data.student_id}, Semester: {data.semester}")
    return record


async def get_academic(db: AsyncSession, tenant_id: int, academic_id: int) -> Optional[Academic]:
    return await find_academic_by_id(db, tenant_id, academic_id)


async def get_academics(
    db: AsyncSession, tenant_id: int,
    skip: int = 0, limit: int = 10,
    student_id: Optional[int] = None,
    tingkat: Optional[str] = None,
) -> tuple[list[Academic], int]:
    return await find_academics(db, tenant_id, skip, limit, student_id, tingkat)


async def update_academic(db: AsyncSession, tenant_id: int, academic_id: int, data: AcademicUpdate, user_id: int) -> Optional[Academic]:
    record = await find_academic_by_id(db, tenant_id, academic_id)
    if not record:
        return None
    update_data = data.model_dump(exclude_unset=True)
    record = await update_academic_fields(db, record, update_data)
    await db.commit()
    await log_action(db, tenant_id, user_id, "update", "academic", academic_id, f"Update: {update_data}")
    return record


async def delete_academic(db: AsyncSession, tenant_id: int, academic_id: int, user_id: int) -> Optional[Academic]:
    record = await find_academic_by_id(db, tenant_id, academic_id)
    if not record:
        return None
    await delete_academic_record(db, record)
    await db.commit()
    await log_action(db, tenant_id, user_id, "delete", "academic", academic_id)
    return record
