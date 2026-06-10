from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, StaffCreateDTO, UserChangePasswordDTO, UserGetTokenDTO, UserCheckTokenDTO, UserChangePasswordByTokenDTO
from src.backend.controllers import user_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User, Token
from src.backend.repositories.user_repo import get_user_by_email, CheckToken, get_user_by_email_token

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
from datetime import datetime, timedelta
from src.backend.middlewares.auth import get_password_hash

router = APIRouter(prefix="/api/v1/users", tags=["Users"])

# Untuk pendaftaran Admin Sekolah pakai registration code
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreateDTO, db: Session = Depends(get_db)):
    return user_controller.register_user(db=db, user_data=user_data)

# Untuk pendaftaran Konselor/Admin (wajib login sbg atmin)
@router.post("/staff", status_code=status.HTTP_201_CREATED)
def create_staff_member(
    data: StaffCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    return user_controller.create_staff(db, data, current_user)

@router.get("/")
def get_all_users(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN]))
):
    return user_controller.fetch_all_users(db=db, current_user=current_user, skip=skip, limit=limit)

@router.get("/{user_id}")
def get_user_detail(
    user_id: str, db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN]))
):
    return user_controller.fetch_user_detail(db=db, user_id=user_id, current_user=current_user)

@router.put("/{user_id}")
def update_user(
    user_id: str, update_data: UserUpdateDTO, db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN]))
):
    return user_controller.update_user_profile(db=db, user_id=user_id, update_data=update_data, current_user=current_user)

@router.delete("/{user_id}")
def delete_user(
    user_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN]))
):
    return user_controller.delete_existing_user(db=db, user_id=user_id, current_user=current_user)

@router.post("/change_password")
def change_password(
    pw : UserChangePasswordDTO,
    bd: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return user_controller.change_password(bd,pw.old_password,pw.new_password,current_user)

@router.post("/get_token")
def get_token(Email : UserGetTokenDTO, db: Session = Depends(get_db)) :
    if not Email.email :
        return {"message" : "Email Tidak Boleh Kosong"}
    if not get_user_by_email(Email.email) :
        return {"message" : f"User dengan email {Email.email} tidak ditemukan"}
    
    email_pengirim = "asgardkelompok2@gmail.com"
    password_pengirim = "ccyd usvm bccm uuhp" 
    email_penerima = Email.email
    msg = MIMEMultipart()
    msg['From'] = email_pengirim
    msg['To'] = email_penerima
    msg['Subject'] = "Token Untuk Lupa Password A.S.G.A.R.D."
    token = f"{random.randint(0,999999):06d}"

    isi_email = f"Password Kok Lupa, Nih Token Reset Password.\n{token}"
    msg.attach(MIMEText(isi_email, 'plain'))

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            data = Token (email = Email.email, token= get_password_hash(token), expired = datetime.now() + timedelta(minutes=15)) # kalo fungsi ini error, kemungkinan besar masalahnya ada di sini (deklarasi Token)
            db.add(data)
            db.commit()
            db.refresh(data)
            server.login(email_pengirim, password_pengirim)
            server.sendmail(email_pengirim, email_penerima, msg.as_string())
        return {"message" : f"Token berhasil dikirim ke email {Email.email}"}

    except Exception as e:
        return {"message" : f"Token gagal dikirim ke email {Email.email}"}
    
@router.post("/check_token")
def check_forgot_token(user : UserCheckTokenDTO,  db: Session = Depends(get_db)) :
    if CheckToken(db=db, user_email= user.email, token=user.token) :
        data = get_user_by_email_token(db,user.email)
        if data:
            setattr(data, "token", datetime.now() + timedelta(minutes=60))
            db.commit()
            db.refresh(data)
            return {"message" : "Token Benar"}
    return {"message" : "Token Tidak Valid, Silahkan minta token lagi"}

@router.post("/forgot_password")
def forgot_password(user : UserChangePasswordByTokenDTO, db: Session = Depends(get_db)) :
    return user_controller.forgot_password(db,user.token,user.new_password,user.email)