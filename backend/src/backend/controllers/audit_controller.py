from fastapi import Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.engine import get_db
from ..middlewares.auth import get_current_user, require_role
from ..models.user import User
from ..services.audit_service import get_audit_logs, get_logs_by_tenant

async def list_audit_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
):
    skip = (page - 1) * limit
    logs, total = await get_audit_logs(db, skip=skip, limit=limit)
    return {"items": logs, "total": total, "page": page, "limit": limit}

async def list_tenant_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
):
    skip = (page - 1) * limit
    tenant_id = current_user.tenant_id
    if not tenant_id:
        raise HTTPException(status_code=400, detail="Superadmin tidak memiliki tenant")
    logs, total = await get_logs_by_tenant(db, tenant_id, skip=skip, limit=limit)
    return {"items": logs, "total": total, "page": page, "limit": limit}
