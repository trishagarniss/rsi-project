from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AcademicBase(BaseModel):
    student_id: int
    semester: int = Field(..., ge=1, le=2)
    tahun_ajaran: str = Field(..., min_length=1, max_length=20)
    tingkat: str = Field(..., min_length=1, max_length=10)
    jurusan: Optional[str] = None
    rata_rata_nilai: Optional[float] = None
    jumlah_mapel_tidak_tuntas: Optional[int] = None
    kenaikan_kelas: Optional[bool] = None

class AcademicCreate(AcademicBase):
    pass

class AcademicUpdate(BaseModel):
    semester: Optional[int] = None
    tahun_ajaran: Optional[str] = None
    tingkat: Optional[str] = None
    jurusan: Optional[str] = None
    rata_rata_nilai: Optional[float] = None
    jumlah_mapel_tidak_tuntas: Optional[int] = None
    kenaikan_kelas: Optional[bool] = None

class AcademicResponse(AcademicBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
