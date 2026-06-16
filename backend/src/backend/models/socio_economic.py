import uuid
from sqlalchemy import Column, Integer, BigInteger, Float, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base
from src.backend.models.enums import HousingStatus

def generate_socio_economic_id():
    return f"SE_{uuid.uuid4()}"

class SocioEconomic(Base):
    __tablename__ = "socio_economics"
    
    __table_args__ = (
        UniqueConstraint('student_id', name='_student_socio_economic_uc'),
    )

    id = Column(String(50), primary_key=True, default=generate_socio_economic_id, index=True)
    student_id = Column(String(50), ForeignKey("students.id", ondelete="CASCADE"), index=True, nullable=False)
    tenant_id = Column(String(50), ForeignKey("tenants.id", ondelete="CASCADE"), index=True, nullable=False)
    
    parents_income = Column(BigInteger, nullable=True)
    monthly_expenses = Column(BigInteger, nullable=True)
    parents_education_level = Column(String(100), nullable=True)
    
    birth_order = Column(Integer, nullable=True)
    dependents_count = Column(Integer, nullable=True)
    
    has_kip_scholarship = Column(Boolean, default=False)
    is_working_student = Column(Boolean, default=False)
    has_internet_access = Column(Boolean, default=True)
    
    distance_to_school_km = Column(Float, nullable=True)
    housing_status = Column(SQLEnum(HousingStatus), nullable=True)
    transportation_mode = Column(String(50), nullable=True)
    
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi
    student = relationship("Student", backref="socio_economic")