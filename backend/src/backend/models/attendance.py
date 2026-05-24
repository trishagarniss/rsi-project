from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from ..core.database import Base

class Attendance(Base):
    __tablename__ = "attendances"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False)
    tahun_ajaran = Column(String(20), nullable=False)
    hadir = Column(Integer, default=0)
    sakit = Column(Integer, default=0)
    izin = Column(Integer, default=0)
    alpha = Column(Integer, default=0)
    total_hari = Column(Integer, nullable=False)
    persentase_kehadiran = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        UniqueConstraint('student_id', 'semester', 'tahun_ajaran', name='uq_attendance_student_semester'),
    )