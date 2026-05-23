from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from .core.config import settings
from .api.v1 import auth, students, predictions, dashboard, counseling, reports, tenants, models, audit, monitoring

app = FastAPI(
    title="ASGARD API",
    description="Analisis Sistem Gejala Awal Risiko Dropout",
    version="1.0.0",
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

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(students.router, prefix="/api/v1/students", tags=["Students"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["Predictions"])
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
def health():
    return {"status": "ok"}