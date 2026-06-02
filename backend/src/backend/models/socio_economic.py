import uuid
from sqlalchemy import Column, Integer, BigInteger, Float, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base

class SocioEconomic(Base):
    __tablename__ = "socio_economics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    
    parents_income = Column(BigInteger, nullable=True)
    monthly_expenses = Column(BigInteger, nullable=True)
    parents_education_level = Column(String(100), nullable=True)
    
    birth_order = Column(Integer, nullable=True)
    dependents_count = Column(Integer, nullable=True)
    
    has_kip_scholarship = Column(Boolean, default=False)
    is_working_student = Column(Boolean, default=False)
    has_internet_access = Column(Boolean, default=True)
    
    distance_to_school_km = Column(Float, nullable=True)
    housing_status = Column(String(50), nullable=True) # Contoh: 'Milik Sendiri', 'Sewa', 'Numpang', dll
    transportation_mode = Column(String(50), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    student = relationship("Student", backref="socio_economic")