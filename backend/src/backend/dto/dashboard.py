from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StatsResponse(BaseModel):
    total_siswa: int
    total_kelas: int
    total_intervensi: int
    siswa_berisiko_tinggi: int
    siswa_berisiko_sedang: int
    siswa_berisiko_rendah: int
    persentase_tinggi: float

class RiskByClassItem(BaseModel):
    class_name: str
    total: int
    rendah: int
    sedang: int
    tinggi: int

class RiskByClassResponse(BaseModel):
    items: list[RiskByClassItem]

class ActivityItem(BaseModel):
    tipe: str
    student_name: str
    class_name: Optional[str] = None
    tanggal: datetime
    detail: str

class RecentActivityResponse(BaseModel):
    items: list[ActivityItem]
