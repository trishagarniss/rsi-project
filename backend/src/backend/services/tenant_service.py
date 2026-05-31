from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..models.tenant import Tenant
from ..dto.tenant import TenantCreate, TenantUpdate
from ..services.audit_service import log_action
from ..repositories.tenant_repository import (
    create_tenant as repo_create_tenant, find_tenant_by_id, find_tenants,
    update_tenant_fields, deactivate_tenant as repo_deactivate_tenant,
)


async def create_tenant(db: AsyncSession, data: TenantCreate, user_id: int) -> Tenant:
    tenant = await repo_create_tenant(db, data.model_dump())
    await db.commit()
    await log_action(db, None, user_id, "create", "tenant", tenant.id, f"Nama: {data.name}, Subdomain: {data.subdomain}")
    return tenant


async def get_tenant(db: AsyncSession, tenant_id: int) -> Optional[Tenant]:
    return await find_tenant_by_id(db, tenant_id)


async def get_tenants(db: AsyncSession, skip: int = 0, limit: int = 10) -> tuple[list[Tenant], int]:
    return await find_tenants(db, skip, limit)


async def update_tenant(db: AsyncSession, tenant_id: int, data: TenantUpdate, user_id: int) -> Optional[Tenant]:
    tenant = await find_tenant_by_id(db, tenant_id)
    if not tenant:
        return None
    update_data = data.model_dump(exclude_unset=True)
    tenant = await update_tenant_fields(db, tenant, update_data)
    await db.commit()
    await log_action(db, tenant_id, user_id, "update", "tenant", tenant_id, f"Update: {update_data}")
    return tenant


async def deactivate_tenant(db: AsyncSession, tenant_id: int, user_id: int) -> Optional[Tenant]:
    tenant = await find_tenant_by_id(db, tenant_id)
    if not tenant:
        return None
    tenant = await repo_deactivate_tenant(db, tenant)
    await db.commit()
    await log_action(db, tenant_id, user_id, "deactivate", "tenant", tenant_id)
    return tenant
