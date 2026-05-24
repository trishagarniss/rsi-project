from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class SocioEconomicBase(BaseModel):
    student_id: int
    penghasilan_ortu: Optional[float] = None
    jumlah_tanggungan: Optional[int] = None
    pendidikan_ayah: Optional[str] = None
    pendidikan_ibu: Optional[str] = None
    pekerjaan_ayah: Optional[str] = None
    pekerjaan_ibu: Optional[str] = None
    status_rumah: Optional[str] = None
    penerima_kip: bool = False
    jarak_rumah_sekolah: Optional[float] = None
    transportasi: Optional[str] = None

class SocioEconomicCreate(SocioEconomicBase):
    pass

class SocioEconomicUpdate(BaseModel):
    penghasilan_ortu: Optional[float] = None
    jumlah_tanggungan: Optional[int] = None
    pendidikan_ayah: Optional[str] = None
    pendidikan_ibu: Optional[str] = None
    pekerjaan_ayah: Optional[str] = None
    pekerjaan_ibu: Optional[str] = None
    status_rumah: Optional[str] = None
    penerima_kip: Optional[bool] = None
    jarak_rumah_sekolah: Optional[float] = None
    transportasi: Optional[str] = None

class SocioEconomicResponse(SocioEconomicBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
