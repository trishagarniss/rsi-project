from sqlalchemy.orm import Session
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO, TenantResponseDTO
from src.backend.services import tenant_service

def register_tenant(db: Session, tenant_data: TenantCreateDTO):
    new_tenant = tenant_service.create_new_tenant(db, tenant_data)
    safe_data = TenantResponseDTO.model_validate(new_tenant)
    
    return {
        "status": "success", 
        "message": "Sekolah berhasil didaftarkan", 
        "data": safe_data
    }

def fetch_all_tenants(db: Session, skip: int = 0, limit: int = 100):
    tenants = tenant_service.get_tenants_list(db, skip, limit)
    safe_data = [TenantResponseDTO.model_validate(t) for t in tenants]
    
    return {
        "status": "success", 
        "data": safe_data
    }

def fetch_tenant_detail(db: Session, tenant_id: str):
    tenant = tenant_service.get_tenant_detail(db, tenant_id)
    return {
        "status": "success", 
        "data": TenantResponseDTO.model_validate(tenant)
    }

def modify_tenant(db: Session, tenant_id: str, tenant_data: TenantUpdateDTO):
    updated = tenant_service.update_existing_tenant(db, tenant_id, tenant_data)
    return {
        "status": "success", 
        "message": "Data sekolah berhasil diperbarui", 
        "data": TenantResponseDTO.model_validate(updated)
    }

def remove_tenant(db: Session, tenant_id: str):
    tenant_service.delete_existing_tenant(db, tenant_id)
    return {
        "status": "success", 
        "message": "Data sekolah berhasil dihapus"
    }