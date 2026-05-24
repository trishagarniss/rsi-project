from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class StudentReportResponse(BaseModel):
    student: dict
    academics: list[dict]
    attendances: list[dict]
    socio_economic: Optional[dict] = None
    latest_prediction: Optional[dict] = None
    interventions: list[dict]

class ClassReportItem(BaseModel):
    id: int
    nis: str
    name: str
    skor_risiko: Optional[float] = None
    label_risiko: Optional[str] = None
    total_intervensi: int
    intervensi_terakhir: Optional[datetime] = None

class ClassReportResponse(BaseModel):
    class_name: str
    total_siswa: int
    total_berisiko_tinggi: int
    total_berisiko_sedang: int
    total_berisiko_rendah: int
    students: list[ClassReportItem]

class ExportRow(BaseModel):
    nis: str
    name: str
    class_name: Optional[str] = None
    rata_rata_nilai: Optional[float] = None
    persentase_kehadiran: Optional[float] = None
    alpha: int = 0
    skor_risiko: Optional[float] = None
    label_risiko: Optional[str] = None
    tanggal_prediksi: Optional[datetime] = None
    total_intervensi: int = 0

class ExportReportResponse(BaseModel):
    total: int
    items: list[ExportRow]
