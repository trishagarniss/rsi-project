import enum

class UserRole(str, enum.Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    KONSELOR = "konselor"

class TenantStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"

class RiskLevel(str, enum.Enum):
    RENDAH = "rendah"
    SEDANG = "sedang"
    TINGGI = "tinggi"

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
