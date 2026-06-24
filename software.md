# Software & Environment Resources — ASGARD

## Environment Resources

| Sumber Daya | Spesifikasi Minimum | Spesifikasi yang Digunakan |
|-------------|-------------------|--------------------------|
| **Prosesor** | Intel Core i5 (8th gen+) / AMD Ryzen 5 | 13th Gen Intel Core i5-13420H (8 core, 12 thread, 2.1 GHz) |
| **RAM** | 8 GB | 16 GB |
| **Storage** | 256 GB SSD | 512 GB SSD |
| **Arsitektur** | 64-bit | 64-bit |
| **Sistem Operasi** | Windows 10 / Linux (Ubuntu 20.04+) / macOS 12+ | Windows 11 Home Single Language (Build 26200) |
| **Konektivitas** | Koneksi internet stabil | Local network (100.77.143.80) |

### Port yang Digunakan

| Port | Layanan | Keterangan |
|------|---------|------------|
| 80 | Nginx | HTTP |
| 443 | Nginx | HTTPS |
| 3000 | Next.js (Frontend) | Aplikasi admin |
| 8000 | FastAPI (Backend) | REST API |
| 5432 | PostgreSQL | Database |
| 6379 | Redis | Cache |

---

## Software Pendukung

### A. Perangkat Lunak Pengembangan (Development Tools)

| Perangkat Lunak | Versi | Fungsi |
|----------------|-------|--------|
| Docker Desktop | 29.5.3 | Container orchestration & management |
| Visual Studio Code | — | Code editor utama |
| Git | — | Version control |
| Node.js | v24.17.0 | Runtime JavaScript frontend |
| npm | 11.17.0 | Package manager frontend |
| Python | >= 3.11 | Runtime backend |
| Java OpenJDK | 11.0.31 (Temurin) | Pendukung (opsional) |

### B. Infrastruktur & Middleware (via Docker)

| Layanan | Image/Software | Port | Fungsi |
|---------|---------------|------|--------|
| **PostgreSQL** | postgres:15-alpine | 5432 | Database utama |
| **Redis** | redis:7-alpine | 6379 | Cache & kode registrasi |
| **Nginx** | nginx:alpine | 80/443 | Reverse proxy & load balancer |

### C. Framework & Library Backend (Python)

| Library | Versi Minimal | Fungsi |
|---------|---------------|--------|
| FastAPI | >=0.136.1 | REST API framework |
| Uvicorn | — | ASGI server |
| SQLAlchemy | >=2.0.49 | Object Relational Mapper (ORM) |
| Alembic | >=1.18.4 | Database migration |
| psycopg2-binary | >=2.9.12 | Driver PostgreSQL |
| Pandas | >=3.0.3 | Data processing & CSV parsing |
| scikit-learn | >=1.8.0 | Machine learning model |
| joblib | >=1.3.0 | Load/save model (.pkl) |
| python-jose | >=3.5.0 | JWT authentication |
| bcrypt / passlib | — | Password hashing |
| Celery | >=5.6.3 | Async task queue |
| Redis (client) | >=7.4.0 | Redis connection |
| Pydantic | >=2.0.0 | Data validation |
| Python-multipart | >=0.0.29 | File upload handling |
| openpyxl | >=3.1.5 | Excel file support |
| docxtpl | >=0.20.2 | Word document template |
| pytest | >=9.0.3 | Unit testing |
| ruff | >=0.15.14 | Linter |

### D. Framework & Library Frontend (Node.js)

| Library | Versi | Fungsi |
|---------|-------|--------|
| Next.js | 16.2.6 | React framework (SSR/SSG) |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type safety & developer experience |
| Tailwind CSS | v4 | Utility-first CSS framework |
| Axios | ^1.17.0 | HTTP client untuk API |
| TanStack React Query | ^5.101.0 | Server state management |
| Recharts | ^3.8.1 | Grafik & dashboard |
| Lucide React | ^1.17.0 | Icon library |
| ESLint | ^9 | Code linting |
