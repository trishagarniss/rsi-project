from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional
from enum import Enum
import re

class UserRole(str, Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    KONSELOR = "konselor"

# === Request Schemas ===
class PasswordCreate(BaseModel):
    password: str = Field(..., min_length=8)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v):
        if not re.search(r"[A-Z]", v):
            raise ValueError("Harus mengandung minimal 1 huruf besar")
        if not re.search(r"[a-z]", v):
            raise ValueError("Harus mengandung minimal 1 huruf kecil")
        if not re.search(r"\d", v):
            raise ValueError("Harus mengandung minimal 1 angka")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-]", v):
            raise ValueError("Harus mengandung minimal 1 simbol (!@#$%^&*)")
        return v

class UserCreate(BaseModel):
    email: EmailStr
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

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v):
        return PasswordCreate.validate_password_strength(cls, v)

class UserCreateResponse(UserResponse):
    generated_password: str

class TokenData(BaseModel):
    sub: str  # user_id as string
    role: UserRole
    tenant_id: Optional[int]