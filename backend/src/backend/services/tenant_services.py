from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from fastapi import HTTPException

from src.backend.repositories import tenant_repo
from src.backend.dto.tenant_dto import TenantCreateDTO, TenantUpdateDTO
from src.backend.models.tenant import Tenant

def create_new_tenant(db: Session, tenant_data: TenantCreateDTO) -> Tenant:
    """
    Logika bisnis untuk membuat sekolah baru.
    Di sini Vian bisa menambahkan pengecekan kompleks nanti, misalnya:
    'Apakah nama sekolah sudah pernah terdaftar?'
    """
    # Untuk sementara, kita langsung teruskan ke repository
    return tenant_repo.create_tenant(db, tenant_data)

def get_tenants_list(db: Session, skip: int = 0, limit: int = 100) -> List[Tenant]:
    """Mengambil daftar sekolah"""
    return tenant_repo.get_all_tenants(db, skip=skip, limit=limit)

def get_tenant_detail(db: Session, tenant_id: UUID) -> Tenant:
    """Mengambil detail satu sekolah dan melempar error 404 jika tidak ada"""
    tenant = tenant_repo.get_tenant_by_id(db, tenant_id)
    if not tenant:
        # HTTP 404 akan langsung mengembalikan respon error rapi ke Next.js
        raise HTTPException(status_code=404, detail="Data sekolah (Tenant) tidak ditemukan")
    return tenant

def update_existing_tenant(db: Session, tenant_id: UUID, tenant_data: TenantUpdateDTO) -> Tenant:
    """Logika bisnis untuk mengedit data sekolah"""
    # 1. Panggil fungsi di atas untuk mengecek apakah sekolahnya ada
    get_tenant_detail(db, tenant_id) 
    
    # 2. Jika ada, baru teruskan perintah update ke repository
    updated_tenant = tenant_repo.update_tenant(db, tenant_id, tenant_data)
    if not updated_tenant:
        raise HTTPException(status_code=400, detail="Gagal memperbarui data sekolah")
    
    return updated_tenant

def delete_existing_tenant(db: Session, tenant_id: UUID) -> dict:
    """Logika bisnis untuk menghapus sekolah"""
    # 1. Pastikan sekolahnya eksis
    get_tenant_detail(db, tenant_id)
    
    # 2. Eksekusi penghapusan di repository
    success = tenant_repo.delete_tenant(db, tenant_id)
    if success:
        return {"message": "Data sekolah berhasil dihapus secara permanen"}
        
    raise HTTPException(status_code=400, detail="Gagal menghapus data sekolah")