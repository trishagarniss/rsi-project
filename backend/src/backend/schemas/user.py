from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    KONSELOR = "konselor"

# === Request Schemas ===
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1)
    role: UserRole = UserRole.KONSELOR
    tenant_id: Optional[int] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# === Response Schemas ===
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    tenant_id: Optional[int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # untuk ORM

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900

class RefreshRequest(BaseModel):
    refresh_token: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900
    user: UserResponse

class TokenData(BaseModel):
    sub: str  # user_id as string
    role: UserRole
    tenant_id: Optional[int]