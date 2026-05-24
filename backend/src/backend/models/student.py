from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, UniqueConstraint
from sqlalchemy.sql import func
from ..core.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    nis = Column(String(20), nullable=False, index=True)          # NIS tidak perlu unique global
    name = Column(String(100), nullable=False)
    class_name = Column(String(20), index=True)                   # misal "12-A"
    is_active = Column(Boolean, default=True, nullable=False)     # soft delete (siswa pindah/keluar)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint('tenant_id', 'nis', name='uq_student_tenant_nis'),
    )