from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.backend.repositories import user_repo
from src.backend.dto.user_dto import UserLoginDTO, UserCreateDTO
from src.backend.middlewares.auth import verify_password, create_access_token, get_password_hash
from src.backend.database.redis import redis_client
from src.backend.models.enums import UserRole

def login_user(db: Session, login_data: UserLoginDTO):
    user = user_repo.get_user_by_email(db, email=login_data.email)
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email atau password salah")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akun dinonaktifkan")

    access_token = create_access_token(data={"sub": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "fullname": user.fullname, "email": user.email, "role": user.role.value, "tenant_id": user.tenant_id, "is_active": user.is_active, "created_at": user.created_at.isoformat() if user.created_at else None}
    }

def validate_reg_code(reg_code: str):
    redis_key = f"reg_code:{reg_code}"
    tenant_id = redis_client.get(redis_key)
    if not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kode registrasi tidak valid atau sudah kadaluarsa."
        )
    return {"tenant_id": tenant_id}

def register_admin_with_code(db: Session, reg_code: str, admin_data: UserCreateDTO):
    redis_key = f"reg_code:{reg_code}"
    
    # 1. Cek apakah kode valid dan masih ada di Redis
    tenant_id_bytes = redis_client.get(redis_key)
    if not tenant_id_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Kode registrasi tidak valid, sudah digunakan, atau kadaluarsa."
        )
    
    # Konversi data Redis jadi string (decode_responses=True sudah auto string)
    tenant_id = str(tenant_id_bytes) if not isinstance(tenant_id_bytes, str) else tenant_id_bytes
    
    # 2. Cek apakah email sudah terdaftar di database
    existing_user = user_repo.get_user_by_email(db, admin_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
        
    # 3. Proses pendaftaran Admin
    # Override role dan tenant_id agar sesuai dengan tujuan Registration Code
    admin_data.role = UserRole.ADMIN
    admin_data.tenant_id = tenant_id
    
    # Eksekusi pembuatan user ke repository
    new_admin = user_repo.create_user(db, admin_data)
    
    # 4. Hapus kode dari Redis agar hangus (Single-Use)
    redis_client.delete(redis_key)
    
    return {
        "message": "Registrasi Admin Sekolah berhasil. Kode registrasi telah hangus.",
        "admin_email": new_admin.email,
        "tenant_id": tenant_id
    }