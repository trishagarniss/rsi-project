from fastapi import Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.engine import get_db
from ..middlewares.auth import get_current_user, require_role
from ..models.user import User
from ..dto.tenant import TenantCreate, TenantUpdate, TenantResponse
from ..services.tenant_service import (
    create_tenant, get_tenant, get_tenants,
    update_tenant, deactivate_tenant,
)

async def create_tenant_endpoint(
    data: TenantCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    return await create_tenant(db, data, current_user.id)

async def list_tenants_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit
    tenants, total = await get_tenants(db, skip=skip, limit=limit)
    return tenants

async def get_tenant_endpoint(
    tenant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    tenant = await get_tenant(db, tenant_id)
    if not tenant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant tidak ditemukan")
    return tenant

async def update_tenant_endpoint(
    tenant_id: int,
    data: TenantUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    tenant = await update_tenant(db, tenant_id, data, current_user.id)
    if not tenant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant tidak ditemukan")
    return tenant

async def deactivate_tenant_endpoint(
    tenant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    tenant = await deactivate_tenant(db, tenant_id, current_user.id)
    if not tenant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant tidak ditemukan")
    return {"message": "Tenant dinonaktifkan", "tenant_id": tenant_id}
