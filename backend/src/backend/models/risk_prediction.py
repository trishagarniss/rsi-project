import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base
from src.backend.models.enums import RiskStatus

def generate_risk_prediction_id():
    return f"RP_{uuid.uuid4()}"

class RiskPredictionLog(Base):
    __tablename__ = "risk_prediction_logs"

    id = Column(String(50), primary_key=True, default=generate_risk_prediction_id, index=True)
    student_id = Column(String(50), ForeignKey("students.id", ondelete="CASCADE"), index=True, nullable=False)
    tenant_id = Column(String(50), ForeignKey("tenants.id"), index=True, nullable=False)
    model_id = Column(String(50), ForeignKey("ml_models.id"), index=True, nullable=False)
    
    risk_status = Column(SQLEnum(RiskStatus), nullable=False)
    risk_score = Column(Float, nullable=False) # Nilai probabilitas 0.0 - 1.0
    
    features_snapshot = Column(JSONB, nullable=False) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relasi
    student = relationship("Student", backref="risk_predictions")
    ml_model = relationship("MlModel")