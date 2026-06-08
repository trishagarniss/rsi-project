from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from src.backend.models.enums import UserRole

# 1. DTO Register
class UserCreateDTO(BaseModel):
    registration_code: str
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
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True 

# 4. DTO Update Profil (Untuk ubah nama / role / status aktif)
class UserUpdateDTO(BaseModel):
    fullname: Optional[str] = Field(None, min_length=3, max_length=150)
    is_active: Optional[bool] = Field(None)
    
# 5. DTO Tambah Staf (Admin bisa tambah Admin atau Counselor baru) - mirip dengan UserCreateDTO tapi tanpa registration_code
class StaffCreateDTO(BaseModel):
    fullname: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole = Field(..., description="Pilih ADMIN atau COUNSELOR")
    
# 6. DTO Khusus untuk Ganti Password (Keamanan)
class UserChangePasswordDTO(BaseModel):
    old_password: str = Field(..., description="Password lama wajib diisi untuk verifikasi")
    new_password: str = Field(..., min_length=8, description="Password baru minimal 8 karakter")