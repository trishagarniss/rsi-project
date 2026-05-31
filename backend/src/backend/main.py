from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from sqlalchemy import text
from .routes import auth, student, academic, attendance, socio_economic, prediction, dashboard, counseling, reports, tenants, models, audit, monitoring, import_data
from .database.engine import engine, Base
from .database.redis import redis_client
from .config.settings import settings, BACKEND_DIR

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

            # Setup Row-Level Security untuk multi-tenant isolation
            rls_path = os.path.join(BACKEND_DIR, "scripts", "rls.sql")
            if os.path.exists(rls_path):
                with open(rls_path) as f:
                    rls_sql = f.read()
                for statement in rls_sql.split(";"):
                    stmt = statement.strip()
                    if stmt:
                        await conn.execute(text(stmt + ";"))
                print("[RLS] Row-Level Security policies applied")
    except Exception as e:
        print(f"[WARN] Database tidak tersedia: {e}")
    yield
    try:
        await engine.dispose()
        await redis_client.close()
    except Exception:
        pass
    
app = FastAPI(
    title="ASGARD API",
    description="Analisis Sistem Gejala Awal Risiko Dropout",
    version="1.0.0",
    lifespan=lifespan,
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(student.router, prefix="/api/v1/students", tags=["Students"])
app.include_router(academic.router, prefix="/api/v1/academics", tags=["Academic"])
app.include_router(attendance.router, prefix="/api/v1/attendances", tags=["Attendance"])
app.include_router(socio_economic.router, prefix="/api/v1/socio-economics", tags=["Socio Economic"])
app.include_router(prediction.router, prefix="/api/v1/predictions", tags=["Predictions"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(counseling.router, prefix="/api/v1/counseling", tags=["Counseling"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(tenants.router, prefix="/api/v1/tenants", tags=["Tenants"])
app.include_router(models.router, prefix="/api/v1/models", tags=["Models"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Audit"])
app.include_router(monitoring.router, prefix="/api/v1/monitoring", tags=["Monitoring"])
app.include_router(import_data.router, prefix="/api/v1/import", tags=["Import"])

@app.get("/") 
def root():
    return {"message": "ASGARD API is running"}
@app.get("/health")
async def health():
    return {"status": "ok"}