import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Date
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    
    nis = Column(String(50), index=True, nullable=False)
    name = Column(String(150), nullable=False)
    gender = Column(String(20), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    address = Column(String(255), nullable=True)
    
    parent_name = Column(String(150), nullable=True)
    parent_phone = Column(String(50), nullable=True)
    
    is_active = Column(Boolean, default=True)
    
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi
    tenant = relationship("Tenant", back_populates="students")