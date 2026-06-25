# ASGARD

**A**cademic **S**tudent drop-out risk **G**uardian, **A**nalysis & **R**eporting **D**ashboard

Sistem deteksi risiko putus sekolah — memantau dan memprediksi siswa berisiko dropout berdasarkan data akademik, kehadiran, dan sosial-ekonomi.

## Arsitektur

```
┌──────────┐    ┌──────────┐    ┌────────────┐
│  Nginx   │───▶│ Frontend │───▶│  Backend   │───▶ PostgreSQL
│ (proxy)  │    │ (Next.js)│    │ (FastAPI)  │───▶ Redis
└──────────┘    └──────────┘    └────────────┘
```

## Struktur Project

```
rsi-project/
├── backend/          # FastAPI REST API
│   └── README.md
├── frontend/         # Next.js App (React 19)
│   └── README.md
├── nginx/            # Konfigurasi reverse proxy
├── referensi/        # Dokumen dan data referensi
├── scripts/          # Script utility
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | FastAPI, Python 3.11+, SQLAlchemy 2.0, Alembic |
| **Database** | PostgreSQL 15, Redis 7 |
| **ML** | scikit-learn, pandas, joblib |
| **Auth** | JWT (python-jose) + bcrypt |
| **Proxy** | Nginx |
| **Container** | Docker, Docker Compose |

## Quick Start (Docker)

1. Clone project:
   ```bash
   git clone <repo-url>
   cd rsi-project
   ```

2. Copy dan sesuaikan environment:
   ```bash
   cp .env.example .env
   ```

3. Jalankan seluruh stack:
   ```bash
   docker-compose up -d
   ```

4. Akses aplikasi:
   - **Frontend** → http://localhost:3000
   - **Swagger API Docs** → http://localhost:8000/docs
   - **API Base** → http://localhost:8000/api/v1

## Setup Lokal

Petunjuk setup lokal masing-masing komponen ada di README sub-direktori:

- [Backend Setup](./backend/README.md)
- [Frontend Setup](./frontend/README.md)

## Environment Variables

Semua variabel environment dikonfigurasi di file `.env` (lihat `.env.example`).

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | Koneksi PostgreSQL |
| `REDIS_URL` | `redis://redis:6379/0` | Koneksi Redis |
| `JWT_SECRET_KEY` | — | Secret key JWT |
| `FRONTEND_URL` | `http://localhost:3000` | URL frontend untuk CORS |

## Developer

**ASGARD** — Tugas Besar RSI (Rekayasa Sistem Informasi)
