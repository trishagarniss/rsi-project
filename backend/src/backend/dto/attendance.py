from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AttendanceBase(BaseModel):
    student_id: int
    semester: int = Field(..., ge=1, le=2)
    tahun_ajaran: str = Field(..., min_length=1, max_length=20)
    hadir: int = 0
    sakit: int = 0
    izin: int = 0
    alpha: int = 0
    total_hari: int = Field(..., ge=1)

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    semester: Optional[int] = None
    tahun_ajaran: Optional[str] = None
    hadir: Optional[int] = None
    sakit: Optional[int] = None
    izin: Optional[int] = None
    alpha: Optional[int] = None
    total_hari: Optional[int] = None

class AttendanceResponse(AttendanceBase):
    id: int
    tenant_id: int
    persentase_kehadiran: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
