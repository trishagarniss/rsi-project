from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.sql import func
import enum
from ..database.engine import Base

class RiskLevel(str, enum.Enum):
    RENDAH = "rendah"
    SEDANG = "sedang"
    TINGGI = "tinggi"
    
class RiskPrediction(Base):
    __tablename__ = "risk_predictions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    skor_risiko = Column(Float, nullable=False)                 # 0.0 - 100.0
    label_risiko = Column(SQLEnum(RiskLevel), nullable=False)
    tanggal_prediksi = Column(DateTime(timezone=True), server_default=func.now())
    fitur_snapshot = Column(Text, nullable=True)                # JSON snapshot of feature values
    model_version = Column(String(20), nullable=True)           # "v1.0", "v2.1"
    created_at = Column(DateTime(timezone=True), server_default=func.now())