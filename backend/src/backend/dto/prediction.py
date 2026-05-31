from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.enums import RiskLevel

class PredictionResponse(BaseModel):
    id: int
    student_id: int
    tenant_id: int
    skor_risiko: float
    label_risiko: RiskLevel
    tanggal_prediksi: datetime
    model_version: Optional[str] = None
    fitur_snapshot: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PredictionResult(BaseModel):
    student_id: int
    skor_risiko: float
    label_risiko: RiskLevel
    model_version: str

class RiskSummaryResponse(BaseModel):
    total_siswa: int
    risiko_rendah: int
    risiko_sedang: int
    risiko_tinggi: int
    persentase_tinggi: float
