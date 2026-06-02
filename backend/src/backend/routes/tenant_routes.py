from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

# Import get_db untuk menyuntikkan koneksi database
from src.backend.database.engine import get_db
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO
from src.backend.controllers import tenant_controller

# Prefix mengatur awalan URL untuk semua route di bawahnya
router = APIRouter(prefix="/api/v1/tenants", tags=["Tenants"])

@router.post("/", status_code=201)
def create_tenant(tenant_data: TenantCreateDTO, db: Session = Depends(get_db)):
    return tenant_controller.register_tenant(db, tenant_data)

@router.get("/")
def get_all_tenants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return tenant_controller.fetch_all_tenants(db, skip, limit)

@router.get("/{tenant_id}")
def get_tenant(tenant_id: UUID, db: Session = Depends(get_db)):
    return tenant_controller.fetch_tenant_detail(db, tenant_id)

@router.put("/{tenant_id}")
def update_tenant(tenant_id: UUID, tenant_data: TenantUpdateDTO, db: Session = Depends(get_db)):
    return tenant_controller.modify_tenant(db, tenant_id, tenant_data)

@router.delete("/{tenant_id}")
def delete_tenant(tenant_id: UUID, db: Session = Depends(get_db)):
    return tenant_controller.remove_tenant(db, tenant_id)