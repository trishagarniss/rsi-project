from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO
from src.backend.controllers import tenant_controller

from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/tenants", tags=["Tenants"])

# Cuma SuperAdmin yg bisa buat tenant baru
@router.post("/", status_code=201)
def create_tenant(
    tenant_data: TenantCreateDTO, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return tenant_controller.register_tenant(db, tenant_data, current_user)

# Cuma SuperAdmin yg bisa lihat semua tenant
@router.get("/")
def get_all_tenants(
    skip: int = 0, 
    limit: int = 10000, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return tenant_controller.fetch_all_tenants(db, skip, limit)

# Cuma SuperAdmin yg bisa lihat detail tenant
@router.get("/{tenant_id}")
def get_tenant(
    tenant_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return tenant_controller.fetch_tenant_detail(db, tenant_id)

# Cuma SuperAdmin yg bisa edit tenant
@router.put("/{tenant_id}")
def update_tenant(
    tenant_id: str, 
    tenant_data: TenantUpdateDTO, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return tenant_controller.modify_tenant(db, tenant_id, tenant_data, current_user)

# Cuma SuperAdmin yg bisa hapus tenant
@router.delete("/{tenant_id}")
def delete_tenant(
    tenant_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return tenant_controller.remove_tenant(db, tenant_id, current_user)

# Cuma SuperAdmin yg bisa lihat kode registrasi
@router.get("/{tenant_id}/registration-code")
def get_registration_code(
    tenant_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return tenant_controller.fetch_registration_code(db, tenant_id)

# Cuma SuperAdmin yg bisa bikin ulang kode registrasi kalau kedaluwarsa
@router.post("/{tenant_id}/regenerate-code")
def regenerate_code(
    tenant_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return tenant_controller.regenerate_tenant_code(db, tenant_id, current_user)