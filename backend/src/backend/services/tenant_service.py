from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.tenant import Tenant, TenantStatus
from ..schemas.tenant import TenantCreate, TenantUpdate
from ..services.audit_service import log_action

async def create_tenant(db: AsyncSession, data: TenantCreate, user_id: int) -> Tenant:
    tenant = Tenant(**data.model_dump())
    db.add(tenant)
    await db.commit()
    await db.refresh(tenant)
    await log_action(db, None, user_id, "create", "tenant", tenant.id, f"Nama: {data.name}, Subdomain: {data.subdomain}")
    return tenant

async def get_tenant(db: AsyncSession, tenant_id: int) -> Optional[Tenant]:
    result = await db.execute(select(Tenant).where(Tenant.id == tenant_id))
    return result.scalar_one_or_none()

async def get_tenants(db: AsyncSession, skip: int = 0, limit: int = 10) -> tuple[list[Tenant], int]:
    total = (await db.execute(select(func.count()).select_from(Tenant))).scalar()
    result = await db.execute(select(Tenant).offset(skip).limit(limit).order_by(Tenant.id))
    return list(result.scalars().all()), total

async def update_tenant(db: AsyncSession, tenant_id: int, data: TenantUpdate, user_id: int) -> Optional[Tenant]:
    tenant = await get_tenant(db, tenant_id)
    if not tenant:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tenant, key, value)
    await db.commit()
    await db.refresh(tenant)
    await log_action(db, tenant_id, user_id, "update", "tenant", tenant_id, f"Update: {update_data}")
    return tenant

async def deactivate_tenant(db: AsyncSession, tenant_id: int, user_id: int) -> Optional[Tenant]:
    tenant = await get_tenant(db, tenant_id)
    if not tenant:
        return None
    tenant.status = TenantStatus.INACTIVE
    await db.commit()
    await db.refresh(tenant)
    await log_action(db, tenant_id, user_id, "deactivate", "tenant", tenant_id)
    return tenant
