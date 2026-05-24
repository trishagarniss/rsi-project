from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from ..core.database import Base

class Academic(Base):
    __tablename__ = "academics"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False)                    # 1 = Ganjil, 2 = Genap
    tahun_ajaran = Column(String(20), nullable=False)             # "2024/2025"
    tingkat = Column(String(10), nullable=False)                  # "7", "8", "9" / "10", "11", "12"
    jurusan = Column(String(30), nullable=True)                   # "IPA"/"IPS"/"Bahasa" (SMA), null (SMP)
    rata_rata_nilai = Column(Float, nullable=True)
    jumlah_mapel_tidak_tuntas = Column(Integer, nullable=True)
    kenaikan_kelas = Column(Boolean, nullable=True)               # naik kelas atau tidak
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        UniqueConstraint('student_id', 'semester', 'tahun_ajaran', name='uq_academic_student_semester'),
    )