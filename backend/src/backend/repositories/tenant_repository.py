from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.tenant import Tenant


async def create_tenant(db: AsyncSession, data_dict: dict) -> Tenant:
    tenant = Tenant(**data_dict)
    db.add(tenant)
    await db.flush()
    await db.refresh(tenant)
    return tenant


async def find_tenant_by_id(db: AsyncSession, tenant_id: int) -> Optional[Tenant]:
    result = await db.execute(select(Tenant).where(Tenant.id == tenant_id))
    return result.scalar_one_or_none()


async def find_tenants(db: AsyncSession, skip: int = 0, limit: int = 10) -> tuple[list[Tenant], int]:
    total = (await db.execute(select(func.count()).select_from(Tenant))).scalar()
    result = await db.execute(select(Tenant).offset(skip).limit(limit).order_by(Tenant.id))
    return list(result.scalars().all()), total


async def update_tenant_fields(db: AsyncSession, tenant: Tenant, update_data: dict) -> Tenant:
    for key, value in update_data.items():
        setattr(tenant, key, value)
    await db.flush()
    await db.refresh(tenant)
    return tenant


async def deactivate_tenant(db: AsyncSession, tenant: Tenant) -> Tenant:
    from ..models.tenant import TenantStatus
    tenant.status = TenantStatus.INACTIVE
    await db.flush()
    await db.refresh(tenant)
    return tenant
