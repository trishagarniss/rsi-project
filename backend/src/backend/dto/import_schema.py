from pydantic import BaseModel, Field
from typing import Optional

class ImportColumn(BaseModel):
    name: str
    label: str
    type: str
    required: bool
    example: str

IMPORT_COLUMNS = [
    ImportColumn(name="nis", label="NIS", type="string", required=True, example="12345"),
    ImportColumn(name="name", label="Nama Lengkap", type="string", required=True, example="Budi Santoso"),
    ImportColumn(name="class_name", label="Kelas", type="string", required=True, example="12-A"),
    ImportColumn(name="tingkat", label="Tingkat", type="string", required=True, example="12"),
    ImportColumn(name="jurusan", label="Jurusan", type="string", required=False, example="IPA"),
    ImportColumn(name="semester", label="Semester", type="int", required=True, example="1"),
    ImportColumn(name="tahun_ajaran", label="Tahun Ajaran", type="string", required=True, example="2024/2025"),
    ImportColumn(name="rata_rata_nilai", label="Rata-rata Nilai", type="float", required=False, example="82.5"),
    ImportColumn(name="jumlah_mapel_tidak_tuntas", label="Jml Mapel Tidak Tuntas", type="int", required=False, example="2"),
    ImportColumn(name="kenaikan_kelas", label="Kenaikan Kelas", type="bool", required=False, example="TRUE"),
    ImportColumn(name="hadir", label="Hadir", type="int", required=True, example="100"),
    ImportColumn(name="sakit", label="Sakit", type="int", required=False, example="3"),
    ImportColumn(name="izin", label="Izin", type="int", required=False, example="2"),
    ImportColumn(name="alpha", label="Alpha", type="int", required=True, example="1"),
    ImportColumn(name="total_hari", label="Total Hari Efektif", type="int", required=True, example="120"),
    ImportColumn(name="penghasilan_ortu", label="Penghasilan Ortu (Rp)", type="float", required=False, example="2500000"),
    ImportColumn(name="jumlah_tanggungan", label="Jumlah Tanggungan", type="int", required=False, example="4"),
    ImportColumn(name="pendidikan_ayah", label="Pendidikan Ayah", type="string", required=False, example="SMA"),
    ImportColumn(name="pendidikan_ibu", label="Pendidikan Ibu", type="string", required=False, example="SMP"),
    ImportColumn(name="penerima_kip", label="Penerima KIP", type="bool", required=False, example="FALSE"),
    ImportColumn(name="jarak_rumah_sekolah", label="Jarak Rumah (km)", type="float", required=False, example="3.5"),
]

IMPORT_SCHEMA_HEADER = [col.name for col in IMPORT_COLUMNS]

class ImportRow(BaseModel):
    nis: str
    name: str
    class_name: str
    tingkat: str
    jurusan: Optional[str] = None
    semester: int
    tahun_ajaran: str
    rata_rata_nilai: Optional[float] = None
    jumlah_mapel_tidak_tuntas: Optional[int] = None
    kenaikan_kelas: Optional[bool] = None
    hadir: int
    sakit: Optional[int] = 0
    izin: Optional[int] = 0
    alpha: int
    total_hari: int
    penghasilan_ortu: Optional[float] = None
    jumlah_tanggungan: Optional[int] = None
    pendidikan_ayah: Optional[str] = None
    pendidikan_ibu: Optional[str] = None
    penerima_kip: Optional[bool] = False
    jarak_rumah_sekolah: Optional[float] = None

class ImportPrediction(BaseModel):
    nis: str
    name: str
    skor_risiko: float
    label_risiko: str

class ImportResult(BaseModel):
    total_rows: int
    success_count: int
    failed_count: int
    errors: list[dict] = []
    predictions: list[ImportPrediction] = []

CSV_TEMPLATE_CONTENT = "nis,name,class_name,tingkat,jurusan,semester,tahun_ajaran,rata_rata_nilai,jumlah_mapel_tidak_tuntas,kenaikan_kelas,hadir,sakit,izin,alpha,total_hari,penghasilan_ortu,jumlah_tanggungan,pendidikan_ayah,pendidikan_ibu,penerima_kip,jarak_rumah_sekolah\n123456789,Budi Santoso,12-A,12,IPA,1,2024/2025,82.5,2,TRUE,100,3,2,1,120,2500000,4,SMA,SMP,FALSE,3.5\n"
