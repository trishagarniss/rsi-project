from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RiskPredictionCreateDTO(BaseModel):
    student_id: str
    ml_model_id: str
    risk_score: float = Field(..., ge=0.0, le=1.0)
    is_at_risk: bool
    factors_summary: Optional[str] = Field(None, description="Alasan utama berisiko (opsional)")

class RiskPredictionResponseDTO(BaseModel):
    id: str
    student_id: str
    tenant_id: str
    ml_model_id: str
    risk_score: float
    is_at_risk: bool
    factors_summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True