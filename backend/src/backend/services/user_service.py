from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, CounselorCreateDTO
from src.backend.models.user import User
from src.backend.models.tenant import Tenant
from src.backend.repositories import user_repo
from src.backend.middlewares.auth import get_password_hash
from src.backend.models.enums import UserRole

from src.backend.models.tenant import Tenant # Pastikan import ini ada

def register_new_user(db: Session, user_data: UserCreateDTO) -> User:
    # 1. Cek Duplikasi Email
    existing_user = user_repo.get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar. Silakan gunakan email lain.")

    # 2. Cari Tenant berdasarkan Registration Code
    tenant = db.query(Tenant).filter(Tenant.registration_code == user_data.registration_code).first()
    if not tenant:
        raise HTTPException(status_code=400, detail="Kode registrasi tidak valid atau tidak ditemukan.")

    # 3. Hash Password
    hashed_pw = get_password_hash(user_data.password)

    # 4. Buat Akun (Otomatis role ADMIN & masuk ke tenant yang ditemukan)
    return user_repo.create_user(
        db=db, 
        fullname=user_data.fullname,
        email=user_data.email,
        hashed_password=hashed_pw,
        tenant_id=tenant.id,   # ID Tenant otomatis didapat
        role=UserRole.ADMIN    # Role otomatis dikunci
    )
    
def register_new_counselor(db: Session, counselor_data: CounselorCreateDTO, admin_user: User) -> User:
    # 1. Cek Duplikasi Email
    existing_user = user_repo.get_user_by_email(db, email=counselor_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")

    # 2. Hash Password
    hashed_pw = get_password_hash(counselor_data.password)

    # 3. Buat Akun (Otomatis role COUNSELOR & masuk ke tenant milik Admin)
    return user_repo.create_user(
        db=db, 
        fullname=counselor_data.fullname,
        email=counselor_data.email,
        hashed_password=hashed_pw,
        tenant_id=admin_user.tenant_id,   # Diambil langsung dari data Admin
        role=UserRole.COUNSELOR           # Otomatis dikunci jadi Konselor
    )
    
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