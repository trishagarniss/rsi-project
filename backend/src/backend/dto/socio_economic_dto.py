from pydantic import BaseModel, Field
from typing import Optional
from src.backend.models.enums import HousingStatus

# 1. Skema untuk Validasi Input (Request dari Frontend)
class SocioEconomicCreateDTO(BaseModel):
    student_id: str = Field(..., description="ID Siswa wajib diisi")
    
    parents_income: Optional[int] = Field(None, ge=0, description="Pendapatan gabungan orang tua per bulan")
    monthly_expenses: Optional[int] = Field(None, ge=0, description="Pengeluaran per bulan")
    parents_education_level: Optional[str] = Field(None, max_length=100)
    
    birth_order: Optional[int] = Field(None, ge=1, description="Anak ke-berapa")
    dependents_count: Optional[int] = Field(None, ge=0, description="Jumlah tanggungan keluarga")
    
    has_kip_scholarship: bool = Field(False, description="Apakah memiliki KIP/Beasiswa")
    is_working_student: bool = Field(False, description="Apakah siswa bekerja")
    has_internet_access: bool = Field(True, description="Akses internet di rumah")
    
    distance_to_school_km: Optional[float] = Field(None, ge=0.0)
    housing_status: Optional[HousingStatus] = None
    transportation_mode: Optional[str] = Field(None, max_length=50, description="motorcycle, car, bus, bicycle, walk")

# 2. Skema untuk Update (Request dari Frontend jika mau edit data)
class SocioEconomicUpdateDTO(BaseModel):
    parents_income: Optional[int] = Field(None, ge=0)
    monthly_expenses: Optional[int] = Field(None, ge=0)
    parents_education_level: Optional[str] = Field(None, max_length=100)
    
    birth_order: Optional[int] = Field(None, ge=1)
    dependents_count: Optional[int] = Field(None, ge=0)
    
    has_kip_scholarship: Optional[bool] = None
    is_working_student: Optional[bool] = None
    has_internet_access: Optional[bool] = None
    
    distance_to_school_km: Optional[float] = Field(None, ge=0.0)
    housing_status: Optional[HousingStatus] = None
    transportation_mode: Optional[str] = Field(None, max_length=50)

# 3. Skema untuk Validasi Output (Response ke Frontend)
class SocioEconomicResponseDTO(BaseModel):
    id: str
    student_id: str
    tenant_id: str
    
    parents_income: Optional[int]
    monthly_expenses: Optional[int]
    parents_education_level: Optional[str]
    
    birth_order: Optional[int]
    dependents_count: Optional[int]
    
    has_kip_scholarship: bool
    is_working_student: bool
    has_internet_access: bool
    
    distance_to_school_km: Optional[float]
    housing_status: Optional[HousingStatus]
    transportation_mode: Optional[str]
    
    class Config:
        from_attributes = True