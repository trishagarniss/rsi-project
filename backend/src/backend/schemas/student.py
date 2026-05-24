from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

# === Risk Level Enum ===
class RiskLevel(str, Enum):
    RENDAH = "rendah"
    SEDANG = "sedang"
    TINGGI = "tinggi"

# === Request Schemas ===
class StudentBase(BaseModel):
    nis: str = Field(..., min_length=1, max_length=20)
    name: str = Field(..., min_length=1)
    class_name: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    class_name: Optional[str] = None

# === Response Schemas ===
class StudentResponse(StudentBase):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True

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