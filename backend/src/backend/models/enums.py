import enum

# Role Pengguna (user.py)
class UserRole(str, enum.Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    KONSELOR = "counselor"

# Status Sekolah (tenant.py)
class TenantStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"

# 3. Jenis Kelamin Siswa (student.py)
class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"

# 4. Status Tempat Tinggal (socio_economic.py)
class HousingStatus(str, enum.Enum):
    OWNED = "owned"             # Milik Sendiri
    RENTED = "rented"           # Sewa / Kos
    WITH_RELATIVES = "with_relatives" # Numpang keluarga
    ORPHANAGE = "orphanage"     # Panti Asuhan
    OTHER = "other"             # Lainnya
    
# 5. Status Prediksi Risiko (Untuk risk_prediction.py)
class RiskStatus(str, enum.Enum):
    AT_RISK = "at_risk"         # Beresiko
    NOT_AT_RISK = "not_at_risk" # Tidak beresiko