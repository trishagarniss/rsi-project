import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text

from src.backend.models.user import User
from src.backend.models.enums import UserRole
from src.backend.database.engine import get_db
from src.backend.config.settings import settings

security = HTTPBearer()
ACCESS_TOKEN_TTL = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

IDLE_TIMEOUT_SECONDS = 3600
ACTIVITY_UPDATE_INTERVAL = 300


def _ensure_utc(dt: datetime) -> datetime:
    return dt.astimezone(timezone.utc) if dt.tzinfo else dt.replace(tzinfo=timezone.utc)

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(seconds=ACCESS_TOKEN_TTL))
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db) # Ubah jadi Sync Session
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = str(payload.get("sub")) # Pastikan dibaca sebagai String!
        if not user_id:
            raise HTTPException(status_code=401, detail="Token tidak valid")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    
    # Mode Sync untuk database query
    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User tidak ditemukan atau tidak aktif")

    now = datetime.now(timezone.utc)

    if user.last_activity_at:
        idle_seconds = (now - _ensure_utc(user.last_activity_at)).total_seconds()
        if idle_seconds > IDLE_TIMEOUT_SECONDS:
            raise HTTPException(status_code=401, detail="Sesi habis karena tidak ada aktivitas, silakan login ulang")

    if not user.last_activity_at or (now - _ensure_utc(user.last_activity_at)).total_seconds() > ACTIVITY_UPDATE_INTERVAL:
        user.last_activity_at = now
        db.commit()

    tenant_id = str(user.tenant_id) if user.tenant_id else ""
    db.execute(text("SELECT set_config('app.tenant_id', :tid, true)"), {"tid": tenant_id})

    return user

def require_role(allowed_roles: list[UserRole]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Izin ditolak. Akses tidak mencukupi.")
        return current_user
    return role_checker