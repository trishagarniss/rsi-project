import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, StaffCreateDTO
from src.backend.models.user import User
from src.backend.models.tenant import Tenant
from src.backend.repositories import user_repo, tenant_repo
from src.backend.middlewares.auth import get_password_hash
from src.backend.models.enums import UserRole
from src.backend.database.redis import get_redis_client

def register_new_user(db: Session, user_data: UserCreateDTO) -> User:
    # 1. Cari data sekolah berdasarkan registration_code yang diinput user
    tenant = tenant_repo.get_tenant_by_code(db, user_data.registration_code)
    if not tenant:
        raise HTTPException(
            status_code=404, 
            detail="Kode registrasi tidak valid atau tidak ditemukan!"
        )
        
    # 2. Cek Single Use Code & Pastikan Belum Ada Admin Utama di Sekolah Ini
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
    
def register_staff_member(db: Session, staff_data: StaffCreateDTO, current_admin: User) -> User:
    # 1. Pastikan hanya Admin yang boleh menambah staf
    if current_admin.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Hanya Admin sekolah yang berhak menambah staf.")
        
    # 2. Keamanan ketat: Admin tidak boleh iseng membuat akun Superadmin
    if staff_data.role == UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Anda tidak berhak membuat akun Superadmin.")

    # 3. Cek apakah email staf sudah terdaftar
    existing_user = user_repo.get_user_by_email(db, email=staff_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")

    # 4. Hash password dan buat akun
    hashed_pw = get_password_hash(staff_data.password)

    # Akun baru otomatis diikat ke tenant_id milik Admin yang membuatnya!
    return user_repo.create_user(
        db=db, 
        fullname=staff_data.fullname,
        email=staff_data.email,
        hashed_password=hashed_pw,
        tenant_id=current_admin.tenant_id, 
        role=staff_data.role              
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
    
def change_password(db: Session, old_pw: str, new_pw : str, current_user: User) :
    if user_repo.CheckOldPassword(db, current_user.id, old_pw) :
        user_repo.ChangePassword(db,current_user.id,new_pw)
    else :
        raise HTTPException(status_code=403, detail="Password Lama Salah")
    
def send_reset_token(db: Session, email: str):
    user = user_repo.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail=f"User dengan email {email} tidak ditemukan.")
    
    # Generate Token
    token = f"{random.randint(0,999999):06d}"
    redis_client = get_redis_client()
    
    # Simpan ke Redis dengan batas waktu 900 detik (15 menit)
    redis_client.setex(f"pwd_reset:{email}", 900, token)
    
    # Kirim Email
    email_pengirim = "asgardkelompok2@gmail.com"
    password_pengirim = "ccyd usvm bccm uuhp" 
    
    msg = MIMEMultipart('alternative') 
    msg['From'] = email_pengirim
    msg['To'] = email
    msg['Subject'] = "🔑 Token Reset Password A.S.G.A.R.D"
    
    html_email = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; padding: 20px; }}
            .container {{ max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 24px; border: 4px solid #161D6F; box-shadow: 8px 8px 0px 0px #FFC107; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            h2 {{ color: #161D6F; font-weight: 900; font-size: 24px; margin-bottom: 10px; }}
            p {{ color: #475569; font-size: 16px; line-height: 1.6; }}
            .token-box {{ background-color: #EEF2FF; border: 2px dashed #161D6F; padding: 25px; text-align: center; border-radius: 16px; margin: 30px 0; }}
            .token {{ font-size: 48px; font-weight: 900; color: #161D6F; letter-spacing: 12px; margin: 0; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #94A3B8; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Halo, Tim ASGARD! 👋</h2>
            </div>
            <p>Waduh, lupa password ya? Tenang, santai aja. Sistem udah buatin token khusus buat kamu nih biar bisa masuk lagi.</p>
            <p>Gunakan 6 digit token di bawah ini untuk mereset password kamu. (Tinggal <strong>blok dan copy</strong> aja angkanya):</p>
            
            <div class="token-box">
                <p class="token">{token}</p>
            </div>
            
            <p><strong>⚠️ Perhatian:</strong> Token ini cuma berlaku selama <strong>15 menit</strong> ya! Kalau lewat dari itu, tokennya bakal hangus otomatis.</p>
            
            <div class="footer">
                <p>Email ini dikirim otomatis oleh Sistem Deteksi Dini ASGARD.<br>Jangan berikan kode ini ke siapapun!</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(html_email, 'html'))

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(email_pengirim, password_pengirim)
            server.sendmail(email_pengirim, email, msg.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Sistem gagal mengirim email. Silakan coba lagi.")

def validate_reset_token(email: str, token: str):
    redis_client = get_redis_client()
    stored_token = redis_client.get(f"pwd_reset:{email}")
    
    if not stored_token:
        raise HTTPException(status_code=400, detail="Token kedaluwarsa atau email tidak terdaftar.")
        
    if stored_token != token:
        raise HTTPException(status_code=400, detail="Token keamanan yang Anda masukkan salah.")
        
    return True

def reset_forgotten_password(db: Session, email: str, token: str, new_pw: str):
    # 1. Validasi token ke Redis
    validate_reset_token(email, token)
    
    # 2. Update Password di Database
    user = user_repo.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="Akun tidak ditemukan.")
        
    user_repo.ChangePassword(db, user.id, new_pw)
    
    # 3. Hapus Token dari Redis agar tidak bisa dipakai 2 kali (Penting untuk keamanan!)
    redis_client = get_redis_client()
    redis_client.delete(f"pwd_reset:{email}")
    
# def forgot_password(db: Session, token: str, new_pw : str, email: str) :
#     if user_repo.CheckToken(db, email, token) :
#         current_user = user_repo.get_user_by_email(email)
#         if not current_user :
#             raise HTTPException(status_code=404, detail=f"Pengguna dengan enail {email} tidak ditemukan.")
#         user_repo.ChangePassword(db,current_user.id,new_pw)
#     else :
#         raise HTTPException(status_code=403, detail="Token Salah")