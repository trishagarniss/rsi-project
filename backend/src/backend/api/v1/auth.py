from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import timedelta
from ...core.security import verify_password, get_password_hash, create_access_token, decode_token
from ...core.config import settings
from ...models.user import User  # akan dibuat nanti
from ...schemas.user import UserLogin, UserOut, Token

router = APIRouter()
security = HTTPBearer()

# Simulasi database sementara (nanti pakai PostgreSQL)
fake_users_db = {
    "admin@sekolah.sch.id": {
        "id": 1,
        "email": "admin@sekolah.sch.id",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        "full_name": "Admin Sekolah",
        "role": "admin_sekolah",
        "tenant_id": 1,
        "is_active": True
    },
    "konselor@sekolah.sch.id": {
        "id": 2,
        "email": "konselor@sekolah.sch.id",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "full_name": "Konselor BK",
        "role": "konselor",
        "tenant_id": 1,
        "is_active": True
    },
    "superadmin@asgard.com": {
        "id": 3,
        "email": "superadmin@asgard.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "full_name": "Super Admin",
        "role": "super_admin",
        "tenant_id": None,
        "is_active": True
    }
}

@router.post("/login", response_model=Token)
async def login(user_login: UserLogin):
    user = fake_users_db.get(user_login.email)
    if not user or not verify_password(user_login.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"], "tenant_id": user["tenant_id"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    email = payload.get("sub")
    user = fake_users_db.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(**user)