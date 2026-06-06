from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

from src.backend.models.enums import TenantStatus

# 1. Skema untuk Validasi Input (Request dari Frontend)
class TenantCreateDTO(BaseModel):
    name: str = Field(..., min_length=3, max_length=150, description="Nama sekolah minimal 3 karakter")
    address: Optional[str] = Field(None, max_length=255) 
    contact_email: Optional[EmailStr] = Field(None, description="Email valid sekolah")
    status: TenantStatus = TenantStatus.ACTIVE

# 2. Skema untuk Validasi Output (Response ke Frontend)
class TenantResponseDTO(BaseModel):
    id: str 
    name: str
    address: Optional[str]
    contact_email: Optional[str]
    registration_code: str
    status: TenantStatus
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True 

# 3. Skema untuk Update (Request dari Frontend jika mau edit data)
class TenantUpdateDTO(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=150)
    address: Optional[str] = Field(None, max_length=255)
    contact_email: Optional[EmailStr] = Field(None)
    status: Optional[TenantStatus] = Field(None)