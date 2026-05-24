from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.student import Student
from ..models.attendance import Attendance
from ..schemas.attendance import AttendanceCreate, AttendanceUpdate
from ..services.audit_service import log_action

async def _validate_student(db: AsyncSession, tenant_id: int, student_id: int):
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    if not result.scalar_one_or_none():
        raise ValueError("Siswa tidak ditemukan")

async def create_attendance(db: AsyncSession, tenant_id: int, data: AttendanceCreate, user_id: int) -> Attendance:
    await _validate_student(db, tenant_id, data.student_id)
    persentase = round((data.hadir / data.total_hari) * 100, 2) if data.total_hari > 0 else 0.0
    record = Attendance(tenant_id=tenant_id, persentase_kehadiran=persentase, **data.model_dump())
    db.add(record)
    await db.commit()
    await db.refresh(record)
    await log_action(db, tenant_id, user_id, "create", "attendance", record.id, f"Student ID: {data.student_id}, Semester: {data.semester}")
    return record

async def get_attendance(db: AsyncSession, tenant_id: int, attendance_id: int) -> Optional[Attendance]:
    result = await db.execute(
        select(Attendance).where(Attendance.id == attendance_id, Attendance.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()

async def get_attendances(
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

async def update_attendance(db: AsyncSession, tenant_id: int, attendance_id: int, data: AttendanceUpdate, user_id: int) -> Optional[Attendance]:
    record = await get_attendance(db, tenant_id, attendance_id)
    if not record:
        return None
    update_data = data.model_dump(exclude_unset=True)
    if "hadir" in update_data and "total_hari" in update_data:
        hadir = update_data.get("hadir", record.hadir)
        total_hari = update_data.get("total_hari", record.total_hari)
        record.persentase_kehadiran = round((hadir / total_hari) * 100, 2) if total_hari > 0 else 0.0
    elif "hadir" in update_data:
        record.persentase_kehadiran = round((update_data["hadir"] / record.total_hari) * 100, 2) if record.total_hari > 0 else 0.0
    for key, value in update_data.items():
        setattr(record, key, value)
    await db.commit()
    await db.refresh(record)
    await log_action(db, tenant_id, user_id, "update", "attendance", attendance_id, f"Update: {update_data}")
    return record

async def delete_attendance(db: AsyncSession, tenant_id: int, attendance_id: int, user_id: int) -> Optional[Attendance]:
    record = await get_attendance(db, tenant_id, attendance_id)
    if not record:
        return None
    await db.delete(record)
    await db.commit()
    await log_action(db, tenant_id, user_id, "delete", "attendance", attendance_id)
    return record
