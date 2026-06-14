from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.backend.routes import auth_routes, tenant_routes, user_routes, student_routes, academic_routes, attendance_routes, socio_economic_routes, ml_model_routes, risk_prediction_routes, audit_log_routes
from src.backend.config.settings import settings

app = FastAPI(
    title="ASGARD API",
    description="Backend Sistem Deteksi Risiko Putus Sekolah",
    version="1.0.0"
)

# Allow settings FRONTEND_URL and local/Tailscale development origins with credentials
origins = [settings.FRONTEND_URL] if settings.FRONTEND_URL else []
origins = list(set([o for o in origins if o]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|100\.\d+\.\d+\.\d+)(:\d+)?",
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

@app.get("/")
def root():
    return {"message": "Selamat datang di ASGARD API!"}