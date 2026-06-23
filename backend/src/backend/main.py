from datetime import datetime, timezone
import psutil

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from src.backend.routes import auth_routes, tenant_routes, user_routes, student_routes, academic_routes, attendance_routes, socio_economic_routes, ml_model_routes, risk_prediction_routes, audit_log_routes, contact_routes, notification_routes
from src.backend.config.settings import settings
from src.backend.database.engine import SessionLocal
from src.backend.database.redis import redis_client

app = FastAPI(
    title="ASGARD API",
    description="Backend Sistem Deteksi Risiko Putus Sekolah",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://100.77.143.80:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Daftar Routes
app.include_router(auth_routes.router)
app.include_router(tenant_routes.router)
app.include_router(user_routes.router)
app.include_router(student_routes.router)
app.include_router(academic_routes.router)
app.include_router(attendance_routes.router)
app.include_router(socio_economic_routes.router)
app.include_router(ml_model_routes.router)
app.include_router(risk_prediction_routes.router)
app.include_router(audit_log_routes.router)
app.include_router(contact_routes.router)
app.include_router(notification_routes.router)

# Health check
START_TIME = datetime.now(timezone.utc)

@app.get("/")
def root():
    return {"message": "Selamat datang di ASGARD API!"}

@app.get("/api/v1/health")
def health_check():
    uptime_seconds = (datetime.now(timezone.utc) - START_TIME).total_seconds()
    days, remainder = divmod(uptime_seconds, 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)
    uptime_str = f"{int(days)}d {int(hours)}h {int(minutes)}m {int(seconds)}s"

    # Database check
    db_ok = False
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db_ok = True
        db.close()
    except Exception:
        db_ok = False

    # Redis check
    redis_ok = False
    try:
        redis_client.ping()
        redis_ok = True
    except Exception:
        redis_ok = False

    # System metrics
    cpu_percent = psutil.cpu_percent(interval=0.5)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    return {
        "status": "ok",
        "uptime": uptime_str,
        "uptime_seconds": uptime_seconds,
        "database": "connected" if db_ok else "disconnected",
        "redis": "connected" if redis_ok else "disconnected",
        "cpu_percent": cpu_percent,
        "memory_percent": memory.percent,
        "memory_used_gb": round(memory.used / (1024**3), 2),
        "memory_total_gb": round(memory.total / (1024**3), 2),
        "disk_percent": disk.percent,
        "disk_used_gb": round(disk.used / (1024**3), 2),
        "disk_total_gb": round(disk.total / (1024**3), 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }