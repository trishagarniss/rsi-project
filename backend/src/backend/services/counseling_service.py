from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..models.intervention import Intervention
from ..dto.intervention import InterventionCreate, InterventionUpdate
from ..services.audit_service import log_action
from ..repositories.intervention_repository import (
    find_student_by_id, find_intervention_by_id, find_interventions,
    create_intervention as repo_create_intervention,
    update_intervention_fields, delete_intervention_record,
)


async def _validate_student(db: AsyncSession, tenant_id: int, student_id: int):
    student = await find_student_by_id(db, tenant_id, student_id)
    if not student:
        raise ValueError("Siswa tidak ditemukan")


async def create_intervention(db: AsyncSession, tenant_id: int, data: InterventionCreate, user_id: int) -> Intervention:
    await _validate_student(db, tenant_id, data.student_id)
    record = await repo_create_intervention(db, tenant_id, data.model_dump(), user_id)
    await db.commit()
    await log_action(db, tenant_id, user_id, "create", "intervention", record.id, f"Student ID: {data.student_id}, Jenis: {data.jenis.value}")
    return record


async def get_intervention(db: AsyncSession, tenant_id: int, intervention_id: int) -> Optional[Intervention]:
    return await find_intervention_by_id(db, tenant_id, intervention_id)


async def get_interventions(
    db: AsyncSession, tenant_id: int,
    skip: int = 0, limit: int = 10,
    student_id: Optional[int] = None,
    status: Optional[str] = None,
    jenis: Optional[str] = None,
) -> tuple[list[Intervention], int]:
    return await find_interventions(db, tenant_id, skip, limit, student_id, status, jenis)


async def update_intervention(db: AsyncSession, tenant_id: int, intervention_id: int, data: InterventionUpdate, user_id: int) -> Optional[Intervention]:
    record = await find_intervention_by_id(db, tenant_id, intervention_id)
    if not record:
        return None
    update_data = data.model_dump(exclude_unset=True)
    record = await update_intervention_fields(db, record, update_data)
    await db.commit()
    await log_action(db, tenant_id, user_id, "update", "intervention", intervention_id, f"Update: {update_data}")
    return record


async def delete_intervention(db: AsyncSession, tenant_id: int, intervention_id: int, user_id: int) -> Optional[Intervention]:
    record = await find_intervention_by_id(db, tenant_id, intervention_id)
    if not record:
        return None
    await delete_intervention_record(db, record)
    await db.commit()
    await log_action(db, tenant_id, user_id, "delete", "intervention", intervention_id)
    return record
