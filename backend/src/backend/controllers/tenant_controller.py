from sqlalchemy.orm import Session
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO, TenantResponseDTO
from src.backend.services import tenant_service

def register_tenant(db: Session, tenant_data: TenantCreateDTO):
    # 1. Buat tenant di PostgreSQL
    new_tenant = tenant_service.create_new_tenant(db, tenant_data)
    
    # 2. PANGGIL REDIS: Generate kode registrasi 1x pakai
    reg_code = tenant_service.generate_tenant_reg_code(new_tenant.id)
    
    # 3. Gabungkan data (karena reg_code sudah tidak ada di DB, kita inject manual)
    safe_data = TenantResponseDTO.model_validate(new_tenant)
    safe_data.registration_code = reg_code # Masukkan kode dari Redis ke response
    
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
    
def regenerate_tenant_code(db: Session, tenant_id: str):
    # 1. Validasi apakah sekolahnya (tenant_id) benar-benar ada di database
    tenant_service.get_tenant_detail(db, tenant_id)
    
    # 2. Buat kode baru dan lempar ke Redis (akan langsung mereset waktu 24 jam)
    new_reg_code = tenant_service.generate_tenant_reg_code(tenant_id)
    
    return {
        "status": "success",
        "message": "Kode registrasi baru berhasil dibuat (berlaku 24 jam ke depan)",
        "data": {
            "tenant_id": tenant_id,
            "new_registration_code": new_reg_code
        }
    }