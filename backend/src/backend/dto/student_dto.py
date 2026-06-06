from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from src.backend.models.enums import Gender

# 1. Skema untuk Validasi Input (Request dari Frontend)
class StudentCreateDTO(BaseModel):
    nis: str = Field(..., max_length=50)
    name: str = Field(..., min_length=3, max_length=150)
    gender: Gender
    date_of_birth: Optional[date] = None
    address: Optional[str] = Field(None, max_length=255)
    parent_name: Optional[str] = Field(None, max_length=150)
    parent_phone: Optional[str] = Field(None, max_length=50)

class StudentResponseDTO(BaseModel):
    id: str
    tenant_id: str
    nis: str
    name: str
    gender: Gender
    date_of_birth: Optional[date]
    address: Optional[str]
    parent_name: Optional[str]
    parent_phone: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True