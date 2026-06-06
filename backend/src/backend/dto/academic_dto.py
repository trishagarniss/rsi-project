from pydantic import BaseModel, Field
from typing import Optional

class AcademicCreateDTO(BaseModel):
    student_id: str
    semester: int = Field(..., ge=1, le=14)
    academic_year: str = Field(..., min_length=9, max_length=9) # Contoh: "2025/2026"
    average_score: float = Field(..., ge=0.0, le=100.0)
    failed_subjects_count: int = Field(0, ge=0)
    incomplete_assignments_count: int = Field(0, ge=0)

class AcademicResponseDTO(BaseModel):
    id: str
    student_id: str
    tenant_id: str
    semester: int
    academic_year: str
    average_score: float
    
    class Config:
        from_attributes = True