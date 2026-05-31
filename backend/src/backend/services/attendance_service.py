from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..models.attendance import Attendance
from ..dto.attendance import AttendanceCreate, AttendanceUpdate
from ..services.audit_service import log_action
from ..repositories.attendance_repository import (
    find_student_by_id, find_attendance_by_id, find_attendances,
    create_attendance as repo_create_attendance, update_attendance_fields, delete_attendance_record,
)


async def _validate_student(db: AsyncSession, tenant_id: int, student_id: int):
    student = await find_student_by_id(db, tenant_id, student_id)
    if not student:
        raise ValueError("Siswa tidak ditemukan")


async def create_attendance(db: AsyncSession, tenant_id: int, data: AttendanceCreate, user_id: int) -> Attendance:
    await _validate_student(db, tenant_id, data.student_id)
    persentase = round((data.hadir / data.total_hari) * 100, 2) if data.total_hari > 0 else 0.0
    data_dict = data.model_dump()
    data_dict["persentase_kehadiran"] = persentase
    record = await repo_create_attendance(db, tenant_id, data_dict)
    await db.commit()
    await log_action(db, tenant_id, user_id, "create", "attendance", record.id, f"Student ID: {data.student_id}, Semester: {data.semester}")
    return record


async def get_attendance(db: AsyncSession, tenant_id: int, attendance_id: int) -> Optional[Attendance]:
    return await find_attendance_by_id(db, tenant_id, attendance_id)


async def get_attendances(
    db: AsyncSession, tenant_id: int,
    skip: int = 0, limit: int = 10,
    student_id: Optional[int] = None,
) -> tuple[list[Attendance], int]:
    return await find_attendances(db, tenant_id, skip, limit, student_id)


async def update_attendance(db: AsyncSession, tenant_id: int, attendance_id: int, data: AttendanceUpdate, user_id: int) -> Optional[Attendance]:
    record = await find_attendance_by_id(db, tenant_id, attendance_id)
    if not record:
        return None
    update_data = data.model_dump(exclude_unset=True)
    if "hadir" in update_data and "total_hari" in update_data:
        hadir = update_data.get("hadir", record.hadir)
        total_hari = update_data.get("total_hari", record.total_hari)
        record.persentase_kehadiran = round((hadir / total_hari) * 100, 2) if total_hari > 0 else 0.0
    elif "hadir" in update_data:
        record.persentase_kehadiran = round((update_data["hadir"] / record.total_hari) * 100, 2) if record.total_hari > 0 else 0.0
    record = await update_attendance_fields(db, record, update_data)
    await db.commit()
    await log_action(db, tenant_id, user_id, "update", "attendance", attendance_id, f"Update: {update_data}")
    return record


async def delete_attendance(db: AsyncSession, tenant_id: int, attendance_id: int, user_id: int) -> Optional[Attendance]:
    record = await find_attendance_by_id(db, tenant_id, attendance_id)
    if not record:
        return None
    await delete_attendance_record(db, record)
    await db.commit()
    await log_action(db, tenant_id, user_id, "delete", "attendance", attendance_id)
    return record
