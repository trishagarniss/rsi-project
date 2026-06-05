from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException

from src.backend.repositories import tenant_repo
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO
from src.backend.models.tenant import Tenant

def create_new_tenant(db: Session, tenant_data: TenantCreateDTO) -> Tenant:
    """Logika bisnis pendaftaran Sekolah baru"""
    
    # 1. Pengecekan Duplikasi Nama Sekolah
    existing_name = tenant_repo.get_tenant_by_name(db, tenant_data.name)
    if existing_name:
        raise HTTPException(status_code=400, detail=f"Sekolah dengan nama '{tenant_data.name}' sudah terdaftar.")

    # 2. Pengecekan Duplikasi Email (Hanya jika email diisi)
    if tenant_data.contact_email:
        existing_email = tenant_repo.get_tenant_by_email(db, tenant_data.contact_email)
        if existing_email:
            raise HTTPException(status_code=400, detail=f"Email '{tenant_data.contact_email}' sudah digunakan oleh sekolah lain.")

    return tenant_repo.create_tenant(db, tenant_data)

def get_tenants_list(db: Session, skip: int = 0, limit: int = 100) -> List[Tenant]:
    return tenant_repo.get_all_tenants(db, skip=skip, limit=limit)

def get_tenant_detail(db: Session, tenant_id: str) -> Tenant:
    tenant = tenant_repo.get_tenant_by_id(db, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Data sekolah tidak ditemukan.")
    return tenant

def update_existing_tenant(db: Session, tenant_id: str, tenant_data: TenantUpdateDTO) -> Tenant:
    """Logika bisnis mengedit data sekolah"""
    existing_tenant = get_tenant_detail(db, tenant_id)
    
    # 1. Cek bentrok nama (jika nama diubah)
    if tenant_data.name and tenant_data.name != existing_tenant.name:
        if tenant_repo.get_tenant_by_name(db, tenant_data.name):
            raise HTTPException(status_code=400, detail="Nama tersebut sudah digunakan sekolah lain.")

    # 2. Cek bentrok email (jika email diubah)
    if tenant_data.contact_email and tenant_data.contact_email != existing_tenant.contact_email:
        if tenant_repo.get_tenant_by_email(db, tenant_data.contact_email):
            raise HTTPException(status_code=400, detail="Email tersebut sudah digunakan sekolah lain.")

    return tenant_repo.update_tenant(db, tenant_id, tenant_data)

def delete_existing_tenant(db: Session, tenant_id: str):
    get_tenant_detail(db, tenant_id) # Cek eksistensi
    success = tenant_repo.delete_tenant(db, tenant_id)
    if not success:
        raise HTTPException(status_code=500, detail="Gagal menghapus data sekolah.")
    return {"detail": "Sekolah berhasil dihapus"}