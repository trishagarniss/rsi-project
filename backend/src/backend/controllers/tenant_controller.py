from sqlalchemy.orm import Session
from uuid import UUID

from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO
from src.backend.services import tenant_service

def register_tenant(db: Session, tenant_data: TenantCreateDTO):
    # Memanggil service (otak bisnis)
    result = tenant_service.create_new_tenant(db, tenant_data)
    
    # Membungkus hasil ke format JSON standar
    return {
        "status": "success", 
        "message": "Sekolah berhasil didaftarkan", 
        "data": result
    }

def fetch_all_tenants(db: Session, skip: int = 0, limit: int = 100):
    result = tenant_service.get_tenants_list(db, skip, limit)
    return {
        "status": "success", 
        "data": result
    }

def fetch_tenant_detail(db: Session, tenant_id: UUID):
    result = tenant_service.get_tenant_detail(db, tenant_id)
    return {
        "status": "success", 
        "data": result
    }

def modify_tenant(db: Session, tenant_id: UUID, tenant_data: TenantUpdateDTO):
    result = tenant_service.update_existing_tenant(db, tenant_id, tenant_data)
    return {
        "status": "success", 
        "message": "Data sekolah berhasil diperbarui", 
        "data": result
    }

def remove_tenant(db: Session, tenant_id: UUID):
    result = tenant_service.delete_existing_tenant(db, tenant_id)
    return {
        "status": "success", 
        "message": result["message"]
    }