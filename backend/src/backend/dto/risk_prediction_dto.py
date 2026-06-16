from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from src.backend.models.enums import RiskStatus

class RiskPredictionCreateDTO(BaseModel):
    student_id: str
    model_id: str 
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_status: RiskStatus

class RiskPredictionResponseDTO(BaseModel):
    id: str
    student_id: str
    tenant_id: str
    model_id: str
    risk_status: RiskStatus
    risk_score: float
    created_at: datetime

    class Config:
        from_attributes = True
        
class StudentBasicInfo(BaseModel):
    fullname: str
    nisn: Optional[str]

    class Config:
        from_attributes = True

class RiskPredictionListDTO(BaseModel):
    id: str
    student_id: str
    student: Optional[StudentBasicInfo] = None 
    risk_status: RiskStatus
    risk_score: float
    created_at: datetime

    class Config:
        from_attributes = True