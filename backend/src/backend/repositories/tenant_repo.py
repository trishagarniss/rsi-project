from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from src.backend.models.tenant import Tenant
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO

def get_tenant_by_id(db: Session, tenant_id: UUID) -> Optional[Tenant]:
    """Mengambil satu data sekolah berdasarkan ID"""
    return db.query(Tenant).filter(Tenant.id == tenant_id).first()

def get_all_tenants(db: Session, skip: int = 0, limit: int = 100) -> List[Tenant]:
    """Mengambil banyak data sekolah (mendukung pagination)"""
    return db.query(Tenant).offset(skip).limit(limit).all()

def create_tenant(db: Session, tenant_data: TenantCreateDTO) -> Tenant:
    """Menyimpan data sekolah baru ke database"""
    # model_dump() mengubah Pydantic object menjadi dictionary Python
    db_tenant = Tenant(**tenant_data.model_dump())
    
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant) # Mengambil data terbaru (termasuk ID dan created_at yang digenerate DB)
    
    return db_tenant

def update_tenant(db: Session, tenant_id: UUID, tenant_data: TenantUpdateDTO) -> Optional[Tenant]:
    """Memperbarui data sekolah yang sudah ada"""
    db_tenant = get_tenant_by_id(db, tenant_id)
    
    if db_tenant:
        # exclude_unset=True memastikan kita HANYA mengupdate kolom yang dikirim oleh frontend
        update_data = tenant_data.model_dump(exclude_unset=True) 
        
        for key, value in update_data.items():
            setattr(db_tenant, key, value)
            
        db.commit()
        db.refresh(db_tenant)
        
    return db_tenant

def delete_tenant(db: Session, tenant_id: UUID) -> bool:
    """Menghapus data sekolah (Hard Delete - Karena tenant adalah tabel paling atas)"""
    db_tenant = get_tenant_by_id(db, tenant_id)
    
    if db_tenant:
        db.delete(db_tenant)
        db.commit()
        return True
    return False