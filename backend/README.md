# ASGARD API

**A**cademic **S**tudent drop-out risk **G**uardian, **A**nalysis & **R**eporting **D**ashboard

Backend Sistem Deteksi Risiko Putus Sekolah — sebuah REST API berbasis FastAPI untuk memantau dan memprediksi risiko siswa putus sekolah berdasarkan data akademik, kehadiran, dan sosial-ekonomi.

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Framework** | FastAPI |
| **Database** | PostgreSQL 15 |
| **Cache / State** | Redis 7 |
| **ORM** | SQLAlchemy 2.0 |
| **Migration** | Alembic |
| **Auth** | JWT (python-jose) + bcrypt |
| **ML** | scikit-learn, joblib, pandas |
| **Task Queue** | Celery (tersedia) |
| **Dependency Manager** | uv |
| **Container** | Docker |

## Struktur Project

```
backend/
├── src/
│   └── backend/
│       ├── main.py                 # Entry point FastAPI
│       ├── config/
│       │   └── settings.py         # Pydantic BaseSettings
│       ├── controllers/            # Layer controller (10 modul)
│       ├── database/
│       │   ├── engine.py           # SQLAlchemy engine + session
│       │   └── redis.py            # Redis client
│       ├── dto/                    # Pydantic request/response schemas
│       ├── errors/                 # (siap pakai)
│       ├── middlewares/
│       │   └── auth.py             # JWT, bcrypt, role guard
│       ├── models/                 # SQLAlchemy ORM models (9 tabel)
│       ├── repositories/           # Data access layer
│       ├── routes/                 # FastAPI APIRouter (10 modul)
│       ├── services/               # Business logic layer
│       ├── task/                   # Celery tasks (siap pakai)
│       └── utils/                  # helpers, validators
├── alembic/
│   └── versions/                   # Database migrations
├── scripts/
│   ├── import_template.csv         # Template import siswa
│   └── rls.sql                     # Row-Level Security policies
├── storage/
│   ├── models/                     # File ML model (.pkl)
│   └── templates/                  # Template dokumen (docxtpl)
├── tests/
├── seed_superadmins.py             # Seeder akun superadmin
├── pyproject.toml                  # Dependencies
├── Dockerfile.backend              # Docker build
└── .env.example                    # Template environment
```

## Fitur

- **Multi-Tenant** — Setiap sekolah (tenant) memiliki data terisolasi dengan RLS PostgreSQL
- **Autentikasi & Autorasi** — JWT + bcrypt, role-based access (SUPERADMIN, ADMIN, COUNSELOR)
- **Manajemen Tenant** — CRUD sekolah, generate registration code (disimpan di Redis)
- **Manajemen Siswa** — CRUD data siswa dengan NIS unik per tenant
- **Data Akademik** — Nilai rata-rata, jumlah mapel tidak tuntas per semester
- **Data Kehadiran** — Presensi, sakit, izin, alpha per semester
- **Data Sosial-Ekonomi** — Penghasilan orang tua, tanggungan, KIP, jarak rumah, dll
- **Prediksi Risiko** — Machine learning (scikit-learn) untuk prediksi dropout
- **Prediksi Bulk** — Prediksi massal via CSV
- **Audit Log** — Semua aksi tercatat di audit_logs
- **Reset Password** — Token 6-digit via email (Redis, 15 menit TTL)
- **Dokumen** — Siap dengan docxtpl untuk generate laporan

## Entity Relationship

```
Tenant (1) ----< User (many)
Tenant (1) ----< Student (many)
Student (1) ----< Academic (many)       [per semester]
Student (1) ----< Attendance (many)     [per semester]
Student (1) ----< SocioEconomic (1)     [one-to-one]
Student (1) ----< RiskPredictionLog (many)
MlModel (1)  ----< RiskPredictionLog (many)
User (1)     ----< AuditLog (many)
Tenant (1)   ----< AuditLog (many)
```

## API Endpoints

Semua endpoint berada di prefix `/api/v1/`.

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/login` | Login pengguna |
| POST | `/auth/register/{reg_code}` | Registrasi admin baru |

### Tenants (SuperAdmin only)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/tenants` | Buat tenant baru |
| GET | `/tenants` | List semua tenant |
| GET | `/tenants/{id}` | Detail tenant |
| PUT | `/tenants/{id}` | Update tenant |
| DELETE | `/tenants/{id}` | Hapus tenant |
| POST | `/tenants/{id}/regenerate-code` | Generate ulang kode registrasi |

### Users
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/users/staff` | Tambah staff (admin/counselor) |
| GET | `/users` | List users |
| GET | `/users/{id}` | Detail user |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Hapus user |
| POST | `/users/change_password` | Ganti password |
| POST | `/users/forgot_password` | Lupa password (kirim token) |
| POST | `/users/get_token` | Validasi token reset |
| POST | `/users/check_token` | Cek token reset |

### Students
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/students` | Tambah siswa |
| GET | `/students` | List siswa |
| GET | `/students/{id}` | Detail siswa |
| PUT | `/students/{id}` | Update siswa |
| DELETE | `/students/{id}` | Hapus siswa |

### Academic
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/academics` | Tambah data akademik |
| GET | `/academics/student/{id}` | Data akademik siswa |
| PUT | `/academics/{id}` | Update data akademik |
| DELETE | `/academics/{id}` | Hapus data akademik |

### Attendance
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/attendances` | Tambah data kehadiran |
| GET | `/attendances/student/{id}` | Data kehadiran siswa |
| PUT | `/attendances/{id}` | Update data kehadiran |
| DELETE | `/attendances/{id}` | Hapus data kehadiran |

### Socio-Economic
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/socio-economics` | Tambah data sosial-ekonomi |
| GET | `/socio-economics/student/{id}` | Data sosial-ekonomi siswa |
| PUT | `/socio-economics/{id}` | Update data sosial-ekonomi |
| DELETE | `/socio-economics/{id}` | Hapus data sosial-ekonomi |

### ML Models (SuperAdmin only)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/models` | Upload model ML |
| GET | `/models` | List model |
| PUT | `/models/{id}` | Update model |
| DELETE | `/models/{id}` | Hapus model |

### Risk Prediction
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/predictions/student/{id}` | Prediksi risiko siswa |
| POST | `/predictions/bulk` | Prediksi massal via CSV |
| GET | `/predictions/student/{id}` | Riwayat prediksi siswa |

### Audit Logs (Admin only)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/audit-logs` | Lihat log aktivitas |

## Role & Hak Akses

| Role | Deskripsi |
|------|-----------|
| **SUPERADMIN** | Akses penuh ke semua tenant, kelola tenant & model ML |
| **ADMIN** | Kelola data di tenant sendiri (siswa, akademik, etc) |
| **COUNSELOR** | Lihat data siswa & hasil prediksi di tenant sendiri |

## Persiapan

### Prasyarat

- Python >= 3.11
- PostgreSQL 15
- Redis 7
- uv (opsional, untuk dependency management)
- Docker & Docker Compose (opsional)

### Setup Lokal

1. Clone project dan masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Buat virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   source .venv/bin/activate # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -e .
   pip install -e ".[dev]"
   ```

   Atau dengan uv:
   ```bash
   uv sync
   ```

4. Copy `.env.example` ke `.env` dan sesuaikan konfigurasi:
   ```bash
   cp .env.example .env
   ```

5. Jalankan migration database:
   ```bash
   alembic upgrade head
   ```

6. Jalankan RLS (Row-Level Security):
   ```bash
   # Jalankan SQL di scripts/rls.sql ke database PostgreSQL
   ```

7. (Opsional) Seed superadmin:
   ```bash
   python seed_superadmins.py
   ```

8. Jalankan server development:
   ```bash
   uvicorn src.backend.main:app --reload --port 8000
   ```

   API dapat diakses di `http://localhost:8000`
   Dokumentasi Swagger di `http://localhost:8000/docs`

### Setup dengan Docker

Jalankan dari root project:

```bash
docker-compose up -d
```

Atau dengan development override:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## Environment Variables

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:password@localhost:5432/asgard` | Koneksi database |
| `REDIS_URL` | `redis://localhost:6379/0` | Koneksi Redis |
| `JWT_SECRET_KEY` | `your-secret-key-change-this` | Secret key JWT |
| `JWT_ALGORITHM` | `HS256` | Algoritma JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Masa berlaku token |
| `DEBUG` | `False` | Mode debug |
| `FRONTEND_URL` | `http://localhost:3000` | URL frontend |

## Superadmin Default

Setelah menjalankan `seed_superadmins.py`, akun berikut tersedia:

| Nama | Email | Password |
|------|-------|----------|
| Trisha Garnis Wahningyun | trisha@asgard.com | password123 |
| Alvian Damar Budhi Hernowo | alvian@asgard.com | password123 |
| Fathul Fajar Nur Ikhsan | fathul@asgard.com | password123 |
| Kunto Rossindu Hidayattullah | kunto@asgard.com | password123 |
| Zaki Elias Al Haqqanikudus | zaki@asgard.com | password123 |

## Pengembangan

### Menambahkan Migration

```bash
alembic revision --autogenerate -m "deskripsi_perubahan"
alembic upgrade head
```

### Menjalankan Test

```bash
pytest
```

### Linting & Formatting

```bash
ruff check src/
black src/
```
