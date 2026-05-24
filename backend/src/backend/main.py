from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .api.v1 import auth, student, prediction, dashboard, counseling, reports, tenants, models, audit, monitoring
from .core.database import engine, Base
from .core.redis_client import redis_client
from .core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()
    await redis_client.close()
    
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
app.include_router(prediction.router, prefix="/api/v1/predictions", tags=["Predictions"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(counseling.router, prefix="/api/v1/counseling", tags=["Counseling"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(tenants.router, prefix="/api/v1/tenants", tags=["Tenants"])
app.include_router(models.router, prefix="/api/v1/models", tags=["Models"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Audit"])
app.include_router(monitoring.router, prefix="/api/v1/monitoring", tags=["Monitoring"])

@app.get("/")
def root():
    return {"message": "ASGARD API is running"}
@app.get("/health")
async def health():
    return {"status": "ok"}