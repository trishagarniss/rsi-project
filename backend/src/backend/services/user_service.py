from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, CounselorCreateDTO
from src.backend.models.user import User
from src.backend.models.tenant import Tenant
from src.backend.repositories import user_repo, tenant_repo
from src.backend.middlewares.auth import get_password_hash
from src.backend.models.enums import UserRole

def register_new_user(db: Session, user_data: UserCreateDTO) -> User:
    # 1. Cari data sekolah berdasarkan registration_code yang diinput user
    tenant = tenant_repo.get_tenant_by_code(db, user_data.registration_code)
    if not tenant:
        raise HTTPException(
            status_code=404, 
            detail="Kode registrasi tidak valid atau tidak ditemukan!"
        )
        
    # 2. 🔒 KUNCI UTAMA (CEK SINGLE-USE CODE)
    existing_admin = user_repo.get_admin_by_tenant(db, tenant.id)
    if existing_admin:
        raise HTTPException(
            status_code=403, 
            detail="Kode registrasi sudah hangus! Sekolah ini sudah memiliki Admin Utama. Pendaftaran ditolak."
        )
        
    # 3. Cek apakah email sudah dipakai (Validasi standar)
    existing_email = user_repo.get_user_by_email(db, email=user_data.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar. Silakan gunakan email lain.")

    # 4. Hash Password dan Eksekusi Buat User
    hashed_pw = get_password_hash(user_data.password)

    return user_repo.create_user(
        db=db, 
        fullname=user_data.fullname,
        email=user_data.email,
        hashed_password=hashed_pw,
        tenant_id=tenant.id,
        role=UserRole.ADMIN
    )   
    
def register_new_counselor(db: Session, counselor_data: CounselorCreateDTO, admin_user: User) -> User:
    existing_user = user_repo.get_user_by_email(db, email=counselor_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")

    hashed_pw = get_password_hash(counselor_data.password)

    return user_repo.create_user(
        db=db, 
        fullname=counselor_data.fullname,
        email=counselor_data.email,
        hashed_password=hashed_pw,
        tenant_id=admin_user.tenant_id,   
        role=UserRole.COUNSELOR           
    )
    
def get_users_list(db: Session, current_user: User, skip: int = 0, limit: int = 100) -> List[User]:
    if current_user.role == UserRole.SUPERADMIN:
        return user_repo.get_all_users(db, skip=skip, limit=limit)
    return user_repo.get_all_users(db, skip=skip, limit=limit, tenant_id=current_user.tenant_id)

def get_user_detail(db: Session, user_id: str, current_user: User) -> User:
    user = user_repo.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan.")
    
    if current_user.role in [UserRole.ADMIN, UserRole.COUNSELOR] and user.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Akses ditolak. Pengguna ini berada di luar sekolah Anda.")
    
    return user

def modify_existing_user(db: Session, user_id: str, update_data: UserUpdateDTO, current_user: User) -> User:
    get_user_detail(db, user_id, current_user)
    return user_repo.update_user(db, user_id, update_data)

def remove_user(db: Session, user_id: str, current_user: User):
    user_to_delete = get_user_detail(db, user_id, current_user) 
    
    if current_user.role == UserRole.ADMIN:
        if user_to_delete.role in [UserRole.SUPERADMIN, UserRole.ADMIN]:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk menghapus Admin atau Superadmin.")
            
    user_repo.delete_user(db, user_id)