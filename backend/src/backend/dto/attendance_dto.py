from pydantic import BaseModel, Field
from typing import Optional

# 1. DTO Create (Input Baru)
class AttendanceCreateDTO(BaseModel):
    student_id: str
    semester: int = Field(..., ge=1, le=14)
    academic_year: str = Field(..., min_length=9, max_length=9) # Contoh: "2025/2026"
    present_count: int = Field(0, ge=0, description="Jumlah kehadiran")
    sick_count: int = Field(0, ge=0, description="Jumlah sakit")
    excused_count: int = Field(0, ge=0, description="Jumlah izin")
    unexcused_count: int = Field(0, ge=0, description="Jumlah alpha/tanpa keterangan")
    attendance_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)

# 2. DTO Update (Edit Data)
class AttendanceUpdateDTO(BaseModel):
    # Semua Optional, dan student_id TIDAK ADA di sini
    semester: Optional[int] = Field(None, ge=1, le=14)
    academic_year: Optional[str] = Field(None, min_length=9, max_length=9)
    present_count: Optional[int] = Field(None, ge=0)
    sick_count: Optional[int] = Field(None, ge=0)
    excused_count: Optional[int] = Field(None, ge=0)
    unexcused_count: Optional[int] = Field(None, ge=0)
    attendance_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)

# 3. DTO Response (Output ke Frontend)
class AttendanceResponseDTO(BaseModel):
    id: str
    student_id: str
    tenant_id: str
    semester: int
    academic_year: str
    present_count: int
    sick_count: int
    excused_count: int
    unexcused_count: int
    attendance_percentage: Optional[float]
    
    class Config:
        from_attributes = True