from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.audit_log import AuditLog


async def create_audit_log(
    db: AsyncSession,
    tenant_id: Optional[int],
    user_id: Optional[int],
    aksi: str,
    target_type: str,
    target_id: Optional[int] = None,
    detail: Optional[str] = None,
    ip_address: Optional[str] = None,
) -> AuditLog:
    log = AuditLog(
        tenant_id=tenant_id,
        user_id=user_id,
        aksi=aksi,
        target_type=target_type,
        target_id=target_id,
        detail=detail,
        ip_address=ip_address,
    )
    db.add(log)
    await db.flush()
    await db.refresh(log)
    return log


async def find_audit_logs(
    db: AsyncSession,
    tenant_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[AuditLog], int]:
    base = select(AuditLog).order_by(AuditLog.created_at.desc())
    count_base = select(func.count()).select_from(AuditLog)

    if tenant_id is not None:
        base = base.where(AuditLog.tenant_id == tenant_id)
        count_base = count_base.where(AuditLog.tenant_id == tenant_id)

    total = (await db.execute(count_base)).scalar()
    result = await db.execute(base.offset(skip).limit(limit))
    return list(result.scalars().all()), total
