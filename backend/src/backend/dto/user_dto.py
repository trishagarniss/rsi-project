from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from src.backend.models.enums import UserRole

# 1. DTO Register
class UserCreateDTO(BaseModel):
    fullname: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimal 8 karakter")

# 2. DTO Login
class UserLoginDTO(BaseModel):
    email: EmailStr
    password: str

# 3. DTO Output
class UserResponseDTO(BaseModel):
    id: str
    tenant_id: Optional[str]
    fullname: str
    email: EmailStr
    role: UserRole
    is_active: bool
    last_login_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True 

# 4. DTO Update Profil (Untuk ubah nama, email, status aktif)
class UserUpdateDTO(BaseModel):
    fullname: Optional[str] = Field(None, min_length=3, max_length=150)
    email: Optional[EmailStr] = Field(None)
    is_active: Optional[bool] = Field(None)
    
# 5. DTO Tambah Staf (Admin bisa tambah Admin atau Counselor baru) - mirip dengan UserCreateDTO tapi tanpa registration_code
class StaffCreateDTO(BaseModel):
    fullname: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole = Field(..., description="Pilih ADMIN atau COUNSELOR")
    
# Khusus SuperAdmin
class SuperadminStaffCreateDTO(BaseModel):
    fullname: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole = Field(..., description="Pilih SUPERADMIN, ADMIN, atau COUNSELOR")
    tenant_id: str
    
# 6. DTO Khusus untuk Ganti Password (Keamanan)
class UserChangePasswordDTO(BaseModel):
    old_password: str = Field(..., min_length=8, description="Password lama minimal 8 karakter")
    new_password: str = Field(..., min_length=8, description="Password baru minimal 8 karakter")
    
class UserCheckTokenDTO(BaseModel):
    email: EmailStr
    token: str = Field(..., min_length=6, max_length=6, description="Token berisi 6 karakter")

class UserGetTokenDTO(BaseModel):
    email: EmailStr
    
class UserChangePasswordByTokenDTO(BaseModel):
    email: EmailStr
    token: str = Field(..., min_length=6, max_length=6, description="Token berisi 6 karakter")
    new_password: str = Field(..., min_length=8, description="Password baru minimal 8 karakter")