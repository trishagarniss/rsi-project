from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class SocioEconomic(Base):
    __tablename__ = "socio_economics"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, unique=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    penghasilan_ortu = Column(Float, nullable=True)
    jumlah_tanggungan = Column(Integer, nullable=True)
    pendidikan_ayah = Column(String(30), nullable=True)
    pendidikan_ibu = Column(String(30), nullable=True)
    pekerjaan_ayah = Column(String(50), nullable=True)
    pekerjaan_ibu = Column(String(50), nullable=True)
    status_rumah = Column(String(30), nullable=True)
    penerima_kip = Column(Boolean, default=False)
    jarak_rumah_sekolah = Column(Float, nullable=True)
    transportasi = Column(String(30), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())