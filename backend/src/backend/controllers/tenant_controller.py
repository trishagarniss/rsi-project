from sqlalchemy.orm import Session
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO, TenantResponseDTO
from src.backend.services import tenant_service
from src.backend.services.audit_log_service import record_activity
from src.backend.services.notification_service import notify_all_superadmins
from src.backend.models.user import User

def register_tenant(db: Session, tenant_data: TenantCreateDTO, current_user: User):
    new_tenant = tenant_service.create_new_tenant(db, tenant_data)
    reg_code = tenant_service.generate_tenant_reg_code(new_tenant.id)
    safe_data = TenantResponseDTO.model_validate(new_tenant)
    safe_data.registration_code = reg_code
    record_activity(db, "CREATE", "tenant", current_user, entity_id=new_tenant.id, details={"name": tenant_data.name})
    notify_all_superadmins(db, f"Tenant Baru: {new_tenant.name}", f"Sekolah {new_tenant.name} berhasil didaftarkan oleh {current_user.fullname}.", "success", "tenant", new_tenant.id)
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

def modify_tenant(db: Session, tenant_id: str, tenant_data: TenantUpdateDTO, current_user: User):
    updated = tenant_service.update_existing_tenant(db, tenant_id, tenant_data)
    record_activity(db, "UPDATE", "tenant", current_user, entity_id=tenant_id, details=tenant_data.model_dump(exclude_unset=True))
    return {
        "status": "success", 
        "message": "Data sekolah berhasil diperbarui", 
        "data": TenantResponseDTO.model_validate(updated)
    }

def remove_tenant(db: Session, tenant_id: str, current_user: User):
    tenant = tenant_service.get_tenant_detail(db, tenant_id)
    tenant_service.delete_existing_tenant(db, tenant_id)
    record_activity(db, "DELETE", "tenant", current_user, entity_id=tenant_id, details={"name": tenant.name})
    return {
        "status": "success", 
        "message": "Data sekolah berhasil dihapus"
    }
    
def fetch_registration_code(db: Session, tenant_id: str):
    tenant_service.get_tenant_detail(db, tenant_id)
    code = tenant_service.get_reg_code_from_redis(tenant_id)
    expires_in = tenant_service.get_reg_code_ttl(tenant_id)
    return {
        "status": "success",
        "data": {
            "tenant_id": tenant_id,
            "registration_code": code,
            "expires_in_seconds": expires_in
        }
    }

def regenerate_tenant_code(db: Session, tenant_id: str, current_user: User):
    tenant_service.get_tenant_detail(db, tenant_id)
    new_reg_code = tenant_service.generate_tenant_reg_code(tenant_id)
    expires_in = tenant_service.get_reg_code_ttl(tenant_id)
    record_activity(db, "UPDATE", "tenant", current_user, entity_id=tenant_id, details={"action": "regenerate_code"})
    return {
        "status": "success",
        "message": "Kode registrasi baru berhasil dibuat (berlaku 24 jam ke depan)",
        "data": {
            "tenant_id": tenant_id,
            "new_registration_code": new_reg_code,
            "expires_in_seconds": expires_in
        }
    }