from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.database import get_db
from ...core.security import get_current_user, require_role
from ...models.user import User
from ...schemas.tenant import TenantCreate, TenantUpdate, TenantResponse
from ...services.tenant_service import (
    create_tenant, get_tenant, get_tenants,
    update_tenant, deactivate_tenant,
)

router = APIRouter()

@router.post("/", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
async def create_tenant_endpoint(
    data: TenantCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    return await create_tenant(db, data, current_user.id)

@router.get("/", response_model=list[TenantResponse])
async def list_tenants_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit
    tenants, total = await get_tenants(db, skip=skip, limit=limit)
    return tenants

@router.get("/{tenant_id}", response_model=TenantResponse)
async def get_tenant_endpoint(
    tenant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    tenant = await get_tenant(db, tenant_id)
    if not tenant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant tidak ditemukan")
    return tenant

@router.put("/{tenant_id}", response_model=TenantResponse)
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

@router.delete("/{tenant_id}")
async def deactivate_tenant_endpoint(
    tenant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    tenant = await deactivate_tenant(db, tenant_id, current_user.id)
    if not tenant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant tidak ditemukan")
    return {"message": "Tenant dinonaktifkan", "tenant_id": tenant_id}
