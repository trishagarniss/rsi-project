from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

from src.backend.models.enums import TenantStatus

# 1. Skema untuk Validasi Input (Request dari Frontend)
class TenantCreateDTO(BaseModel):
    name: str = Field(..., min_length=3, max_length=150, description="Nama sekolah minimal 3 karakter")
    alamat: Optional[str] = Field(None, max_length=255)
    contact_email: Optional[EmailStr] = Field(None, description="Email valid sekolah")
    logo_url: Optional[str] = Field(None)
    
    # Status otomatis ACTIVE jika tidak dikirim dari frontend, tapi bisa di-override
    status: TenantStatus = TenantStatus.ACTIVE

# 2. Skema untuk Validasi Output (Response ke Frontend)
class TenantResponseDTO(BaseModel):
    id: UUID
    name: str
    alamat: Optional[str]
    status: TenantStatus
    contact_email: Optional[str]
    logo_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        # Konfigurasi ini WAJIB agar Pydantic bisa membaca data dari SQLAlchemy ORM
        from_attributes = True 

# 3. Skema untuk Update (Request dari Frontend jika mau edit data)
class TenantUpdateDTO(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=150)
    alamat: Optional[str] = Field(None, max_length=255)
    contact_email: Optional[EmailStr] = Field(None)
    status: Optional[TenantStatus] = Field(None)
    logo_url: Optional[str] = Field(None)