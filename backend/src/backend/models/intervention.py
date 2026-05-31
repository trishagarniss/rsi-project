from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
import enum
from ..database.engine import Base

class JenisIntervensi(str, enum.Enum):
    KONSELING_INDIVIDU = "konseling_individu"
    KONSELING_KELOMPOK = "konseling_kelompok"
    HOME_VISIT = "home_visit"
    REFERRAL = "referral"
    KLASIKAL = "klasikal"
    LAINNYA = "lainnya"
    
class StatusIntervensi(str, enum.Enum):
    DIRENCANAKAN = "direncanakan"
    DILAKSANAKAN = "dilaksanakan"
    SELESAI = "selesai"
    DITINDAKLANJUTI = "ditindaklanjuti"
    
class Intervention(Base):
    __tablename__ = "interventions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    jenis = Column(SQLEnum(JenisIntervensi), nullable=False)
    status = Column(SQLEnum(StatusIntervensi), default=StatusIntervensi.DIRENCANAKAN)
    tanggal_intervensi = Column(DateTime(timezone=True), nullable=False)
    catatan = Column(Text, nullable=True)
    tindak_lanjut = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())