from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO
from src.backend.models.user import User
from src.backend.repositories import user_repo, tenant_repo # <- Panggil tenant_repo untuk validasi!
from src.backend.middlewares.auth import get_password_hash
from src.backend.models.enums import UserRole

def register_new_user(db: Session, user_data: UserCreateDTO) -> User:
    
    if user_data.role == UserRole.SUPERADMIN and user_data.tenant_id:
        raise HTTPException(status_code=400, detail="Superadmin tidak boleh terikat pada satu sekolah (Tenant). Kosongkan tenant_id.")
    
    if user_data.role in [UserRole.ADMIN, UserRole.COUNSELOR] and not user_data.tenant_id:
        raise HTTPException(status_code=400, detail="Admin dan Konselor WAJIB memiliki ID Sekolah (tenant_id).")

    if user_data.tenant_id:
        existing_tenant = tenant_repo.get_tenant_by_id(db, user_data.tenant_id)
        if not existing_tenant:
            raise HTTPException(status_code=404, detail=f"Sekolah dengan ID {user_data.tenant_id} tidak ditemukan.")

    existing_user = user_repo.get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar. Silakan gunakan email lain atau Login.")
        
    hashed_pw = get_password_hash(user_data.password)
    return user_repo.create_user(db=db, user_data=user_data, hashed_password=hashed_pw)

def get_users_list(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return user_repo.get_all_users(db, skip, limit)

def get_user_detail(db: Session, user_id: str) -> User:
    user = user_repo.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan.")
    return user

def modify_existing_user(db: Session, user_id: str, update_data: UserUpdateDTO) -> User:
    get_user_detail(db, user_id) # Cek keberadaan user
    updated_user = user_repo.update_user(db, user_id, update_data)
    return updated_user