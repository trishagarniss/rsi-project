from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class RiskPredictionCreateDTO(BaseModel):
    student_id: str
    model_id: str 
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_status: int

class RiskPredictionResponseDTO(BaseModel):
    id: str
    student_id: str
    tenant_id: str
    model_id: str
    risk_status: int
    risk_score: float
    created_at: datetime

    class Config:
        from_attributes = True
        
class StudentBasicInfo(BaseModel):
    name: str
    nisn: Optional[str]

    class Config:
        from_attributes = True

class RiskPredictionListDTO(BaseModel):
    id: str
    student_id: str
    student: Optional[StudentBasicInfo] = None 
    risk_status: int
    risk_score: float
    created_at: datetime
    factors: List[str] = []

    class Config:
        from_attributes = True