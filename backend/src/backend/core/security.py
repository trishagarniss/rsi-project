from datetime import datetime, timedelta, timezone
from typing import Optional
import secrets
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from ..models.user import User
from ..core.database import get_db
from .config import settings
from .redis_client import redis_client

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

ACCESS_TOKEN_TTL = 900
REFRESH_TOKEN_TTL = 10800

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(seconds=ACCESS_TOKEN_TTL))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

async def create_refresh_token(user_id: int) -> str:
    token = secrets.token_urlsafe(48)
    key = f"refresh:{token}"
    await redis_client.setex(key, REFRESH_TOKEN_TTL, str(user_id))
    return token

async def verify_refresh_token(token: str) -> Optional[str]:
    key = f"refresh:{token}"
    user_id = await redis_client.get(key)
    return user_id.decode() if user_id else None

async def extend_refresh_token(token: str) -> None:
    key = f"refresh:{token}"
    await redis_client.expire(key, REFRESH_TOKEN_TTL)

async def revoke_refresh_token(token: str) -> None:
    key = f"refresh:{token}"
    await redis_client.delete(key)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    tenant_id = str(user.tenant_id) if user.tenant_id else ""
    await db.execute(text("SELECT set_config('app.tenant_id', :tid, true)"), {"tid": tenant_id})

    return user

def require_role(allowed_roles: list[str]):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker