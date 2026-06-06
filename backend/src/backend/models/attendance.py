import uuid
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base

def generate_attendance_id():
    return f"AT_{uuid.uuid4()}"
class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(String(50), primary_key=True, default=generate_attendance_id, index=True)
    student_id = Column(String(50), ForeignKey("students.id", ondelete="CASCADE"), index=True, nullable=False)
    tenant_id = Column(String(50), ForeignKey("tenants.id"), index=True, nullable=False)

    semester = Column(Integer, nullable=False)
    academic_year = Column(String(20), nullable=False)
    
    present_count = Column(Integer, default=0)
    sick_count = Column(Integer, default=0)
    excused_count = Column(Integer, default=0)
    unexcused_count = Column(Integer, default=0)
    attendance_percentage = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi
    student = relationship("Student", backref="attendances")