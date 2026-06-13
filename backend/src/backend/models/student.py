import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Date, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import UniqueConstraint

from src.backend.database.engine import Base
from src.backend.models.enums import Gender

def generate_student_id():
    return f"S_{uuid.uuid4()}"

class Student(Base):
    __tablename__ = "students"
    __table_args__ = (
        UniqueConstraint('tenant_id', 'nis', name='_tenant_nis_uc'),
    )

    id = Column(String(50), primary_key=True, default=generate_student_id, index=True)
    tenant_id = Column(String(50), ForeignKey("tenants.id", ondelete="CASCADE"), index=True, nullable=False)

    nis = Column(String(50), index=True, nullable=False)
    nisn = Column(String(20), index=True, unique=True, nullable=True)
    
    name = Column(String(150), nullable=False)
    gender = Column(SQLEnum(Gender), nullable=False)
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