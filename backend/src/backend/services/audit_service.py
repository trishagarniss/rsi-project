from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..models.audit_log import AuditLog
from ..repositories.audit_repository import create_audit_log as repo_create_audit_log, find_audit_logs


async def log_action(
    db: AsyncSession,
    tenant_id: Optional[int],
    user_id: Optional[int],
    aksi: str,
    target_type: str,
    target_id: Optional[int] = None,
    detail: Optional[str] = None,
    ip_address: Optional[str] = None,
) -> AuditLog:
    log = await repo_create_audit_log(db, tenant_id, user_id, aksi, target_type, target_id, detail, ip_address)
    await db.commit()
    return log


async def get_audit_logs(
    db: AsyncSession,
    tenant_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[AuditLog], int]:
    return await find_audit_logs(db, tenant_id, skip, limit)


async def get_logs_by_tenant(db: AsyncSession, tenant_id: int, skip: int = 0, limit: int = 50) -> tuple[list[AuditLog], int]:
    return await find_audit_logs(db, tenant_id=tenant_id, skip=skip, limit=limit)
