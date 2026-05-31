from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from ..models.enums import RiskLevel

# === Request Schemas ===
class StudentBase(BaseModel):
    nis: str = Field(..., min_length=1, max_length=20)
    name: str = Field(..., min_length=1)
    class_name: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    nis: Optional[str] = None
    name: Optional[str] = None
    class_name: Optional[str] = None

# === Response Schemas ===
class StudentResponse(StudentBase):
    id: int
    tenant_id: int
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StudentListResponse(BaseModel):
    items: list[StudentResponse]
    total: int
    page: int
    limit: int

# === Untuk Import Excel ===
class BulkImportResult(BaseModel):
    total_rows: int
    success_count: int
    failed_count: int
    errors: List[dict] = []  # baris ke berapa, error apa

# === Untuk Dashboard & Prediksi ===
class StudentRiskResponse(StudentResponse):
    risk_score: Optional[float] = None
    risk_level: Optional[RiskLevel] = None
    last_prediction_date: Optional[datetime] = None

class TopRiskStudent(StudentRiskResponse):
    rank: int
