from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class TenantStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"

class TenantCreate(BaseModel):
    name: str = Field(..., min_length=1)
    subdomain: str = Field(..., min_length=1)
    contact_email: Optional[EmailStr] = None
    status: TenantStatus = TenantStatus.ACTIVE

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    subdomain: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    status: Optional[TenantStatus] = None

class TenantResponse(BaseModel):
    id: int
    name: str
    subdomain: str
    status: TenantStatus
    contact_email: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
