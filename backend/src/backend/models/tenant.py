import uuid
import secrets
from sqlalchemy import Column, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base
from src.backend.models.enums import TenantStatus

# def generate_registration_code():
#     return f"REG-{secrets.token_hex(5).upper()}"

def generate_tenant_id():
    return f"T_{uuid.uuid4()}"

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(String(50), primary_key=True, default=generate_tenant_id, index=True)
    name = Column(String(150), nullable=False)
    address = Column(String(255), nullable=True)
    contact_email = Column(String(100), nullable=True)
    
    # registration_code = Column(String(20), unique=True, index=True, default=generate_registration_code)
    status = Column(SQLEnum(TenantStatus), default=TenantStatus.ACTIVE)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi ke tabel users
    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="tenant", cascade="all, delete-orphan")
    academics = relationship("Academic", cascade="all, delete-orphan")
    attendances = relationship("Attendance", cascade="all, delete-orphan")
    socio_economics = relationship("SocioEconomic", cascade="all, delete-orphan")
    risk_predictions = relationship("RiskPredictionLog", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", cascade="all, delete-orphan")