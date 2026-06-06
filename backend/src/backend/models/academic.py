import uuid
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base

def generate_academic_id():
    return f"AC_{uuid.uuid4()}"

class Academic(Base):
    __tablename__ = "academics"

    id = Column(String(50), primary_key=True, default=generate_academic_id, index=True)
    student_id = Column(String(50), ForeignKey("students.id", ondelete="CASCADE"), index=True, nullable=False)
    tenant_id = Column(String(50), ForeignKey("tenants.id"), index=True, nullable=False)
    
    semester = Column(Integer, nullable=False) # Contoh: 1, 2, 3
    academic_year = Column(String(20), nullable=False) # Contoh: "2025/2026"
    
    average_score = Column(Float, nullable=False)
    failed_subjects_count = Column(Integer, default=0)
    incomplete_assignments_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi
    student = relationship("Student", backref="academics")