import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, StaffCreateDTO, SuperadminStaffCreateDTO
from pydantic import EmailStr
from src.backend.models.user import User
from src.backend.models.tenant import Tenant
from src.backend.repositories import user_repo, tenant_repo
from src.backend.middlewares.auth import get_password_hash
from src.backend.models.enums import UserRole
from src.backend.database.redis import get_redis_client
from src.backend.config.settings import settings

def create_staff_user(db: Session, staff_data: StaffCreateDTO, current_user: User) -> User:
    """Fungsi khusus untuk Admin Sekolah membuat akun Guru BK/Konselor"""
    
    # 1. Hanya Admin yang boleh bikin akun staf di sekolahnya
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403, 
            detail="Akses ditolak. Hanya Admin Sekolah yang dapat mendaftarkan staf baru."
        )
        
    # 2. Cek apakah email sudah dipakai
    existing_user = user_repo.get_user_by_email(db, staff_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar di sistem.")
        
    # 3. Kunci data ke sekolah (tenant) milik Admin yang sedang login
    user_data_dict = staff_data.model_dump()
    user_data_dict["tenant_id"] = current_user.tenant_id
    user_data_dict["role"] = UserRole.COUNSELOR # Paksa role jadi Konselor
    
    # Eksekusi simpan ke DB
    return user_repo.create_user(db, user_data_dict)

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
    
def register_staff_member_superadmin(db: Session, staff_data: SuperadminStaffCreateDTO, current_admin: User) -> User:
    
    if current_admin.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Akses ditolak. Hanya Superadmin yang berhak.")

    existing_user = user_repo.get_user_by_email(db, email=staff_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")

    tenant = tenant_repo.get_tenant_by_id(db, staff_data.tenant_id)
    if not tenant:
        raise HTTPException(status_code=400, detail="Tenant tidak ditemukan.")

    # 4. Hash password dan buat akun
    hashed_pw = get_password_hash(staff_data.password)

    # Akun baru diikat ke tenant_id yang dipilih Superadmin dari input
    return user_repo.create_user(
        db=db, 
        fullname=staff_data.fullname,
        email=staff_data.email,
        hashed_password=hashed_pw,
        tenant_id=staff_data.tenant_id, 
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
    target_user = get_user_detail(db, user_id, current_user)
    
    if current_user.role == UserRole.ADMIN:
        if target_user.role == UserRole.ADMIN and current_user.id != target_user.id:
            raise HTTPException(status_code=403, detail="Anda tidak diperbolehkan mengubah data sesama Admin.")
        
        if target_user.role == UserRole.SUPERADMIN:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki wewenang mengedit Superadmin.")
    
    # Validasi bentrok email jika email diubah
    if update_data.email and update_data.email != target_user.email:
        existing = user_repo.get_user_by_email(db, update_data.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email sudah digunakan oleh pengguna lain.")
            
    return user_repo.update_user(db, user_id, update_data)

def remove_user(db: Session, user_id: str, current_user: User):
    user_to_delete = get_user_detail(db, user_id, current_user) 
    
    if current_user.id == user_to_delete.id:
        raise HTTPException(status_code=400, detail="Anda tidak bisa menghapus akun Anda sendiri.")
    
    if current_user.role == UserRole.ADMIN:
        if user_to_delete.role in [UserRole.SUPERADMIN, UserRole.ADMIN]:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk menghapus Admin atau Superadmin.")
            
    result = user_repo.soft_delete_user_sp(db, user_id, current_user.id)
    
    if result == "USER_NOT_FOUND":
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan.")
    elif result == "CANNOT_DELETE_SELF":
        raise HTTPException(status_code=400, detail="Anda tidak bisa menghapus akun Anda sendiri.")
    elif result == "CANNOT_DELETE_SUPERADMIN":
        raise HTTPException(status_code=403, detail="Anda tidak diperbolehkan menghapus Superadmin.")
    elif result == "DELETE_FAILED":
        raise HTTPException(status_code=500, detail="Gagal menonaktifkan akun pengguna.")
        
    return True
    
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
    email_pengirim = settings.EMAIL_SENDER
    password_pengirim = settings.EMAIL_PASSWORD
    
    msg = MIMEMultipart('alternative') 
    msg['From'] = email_pengirim
    msg['To'] = email
    msg['Subject'] = "🔑 Token Reset Password A.S.G.A.R.D"
    
    html_email = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Base Styles (Desktop & Tablet) */
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; padding: 20px; color: #334155; margin: 0; }}
            .container {{ max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; border: 3px solid #161D6F; box-shadow: 8px 8px 0px 0px #FFC107; }}
            .logo-badge {{ display: inline-block; background-color: #161D6F; color: #FFC107; padding: 8px 16px; border-radius: 8px; font-weight: 900; font-size: 14px; letter-spacing: 1.5px; margin-bottom: 25px; border: 2px solid #161D6F; }}
            .header {{ text-align: left; margin-bottom: 30px; }}
            h2 {{ color: #161D6F; font-weight: 900; font-size: 24px; margin-bottom: 10px; line-height: 1.3; }}
            p {{ font-size: 15px; line-height: 1.6; color: #475569; }}
            .token-wrapper {{ background-color: #FFC107; padding: 6px; border-radius: 12px; margin: 35px 0; border: 3px solid #161D6F; }}
            .token-box {{ background-color: #ffffff; padding: 25px; text-align: center; border-radius: 6px; border: 2px dashed #161D6F; }}
            
            /* Ukuran font & spasi token dikurangi sedikit untuk default */
            .token {{ font-size: 34px; font-weight: 900; color: #161D6F; letter-spacing: 10px; margin: 0; font-family: 'Courier New', Courier, monospace; text-align: center; }}
            
            .alert-box {{ background-color: #FEF08A; border-left: 4px solid #EAB308; padding: 14px 16px; font-size: 14px; color: #854D0E; margin-top: 20px; border-radius: 0 8px 8px 0; }}
            .footer {{ text-align: center; margin-top: 40px; font-size: 12px; color: #94A3B8; border-top: 2px dashed #E2E8F0; padding-top: 25px; }}

            /* Mobile Responsive Styles */
            @media only screen and (max-width: 480px) {{
                body {{ padding: 10px; }}
                .container {{ padding: 25px 20px; border-width: 2px; box-shadow: 4px 4px 0px 0px #FFC107; border-radius: 12px; }}
                h2 {{ font-size: 20px; }}
                p {{ font-size: 14px; }}
                .logo-badge {{ font-size: 12px; padding: 6px 12px; margin-bottom: 20px; }}
                .token-wrapper {{ margin: 25px 0; padding: 4px; }}
                .token-box {{ padding: 20px 10px; }}
                
                /* Ukuran token untuk HP (Sangat aman dari patah baris) */
                .token {{ font-size: 26px; letter-spacing: 6px; }}
                
                .alert-box {{ font-size: 13px; padding: 12px; margin-top: 15px; }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-badge">A.S.G.A.R.D</div>
                <h2>Permintaan Reset Password</h2>
            </div>
            <p>Halo! Sistem mendeteksi adanya permintaan untuk mengatur ulang password akun Anda di portal <strong>Sistem Deteksi Dini Risiko Putus Sekolah</strong>.</p>
            <p>Silakan gunakan 6 digit kode keamanan di bawah ini untuk melanjutkan proses. <em>(Blok dan copy angka di bawah)</em>:</p>
            
            <div class="token-wrapper">
                <div class="token-box">
                    <p class="token">{token}</p>
                </div>
            </div>
            
            <div class="alert-box">
                <strong>⏳ Perhatian:</strong> Demi keamanan data akademik, token ini hanya berlaku selama <strong>15 menit</strong>.
            </div>
            
            <p style="margin-top: 25px; font-size: 13px; color: #64748B;">Jika Anda tidak pernah meminta reset password, abaikan saja email ini. Keamanan akun Anda tetap terjamin.</p>
            
            <div class="footer">
                <p>&copy; 2026 ASGARD System &bull; Universitas Sebelas Maret<br>Membangun masa depan pendidikan yang lebih baik.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(html_email, 'html'))

    try:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
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