from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from src.backend.models.enums import RiskStatus

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
    model_id: str
    risk_status: RiskStatus
    risk_score: float
    features_snapshot: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True