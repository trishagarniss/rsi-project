from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class JenisIntervensi(str, Enum):
    KONSELING_INDIVIDU = "konseling_individu"
    KONSELING_KELOMPOK = "konseling_kelompok"
    HOME_VISIT = "home_visit"
    REFERRAL = "referral"
    KLASIKAL = "klasikal"
    LAINNYA = "lainnya"

class StatusIntervensi(str, Enum):
    DIRENCANAKAN = "direncanakan"
    DILAKSANAKAN = "dilaksanakan"
    SELESAI = "selesai"
    DITINDAKLANJUTI = "ditindaklanjuti"

class InterventionBase(BaseModel):
    student_id: int
    jenis: JenisIntervensi
    tanggal_intervensi: datetime
    catatan: Optional[str] = None
    tindak_lanjut: Optional[str] = None

class InterventionCreate(InterventionBase):
    pass

class InterventionUpdate(BaseModel):
    jenis: Optional[JenisIntervensi] = None
    status: Optional[StatusIntervensi] = None
    tanggal_intervensi: Optional[datetime] = None
    catatan: Optional[str] = None
    tindak_lanjut: Optional[str] = None

class InterventionResponse(InterventionBase):
    id: int
    tenant_id: int
    status: StatusIntervensi
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
