from fastapi import FastAPI
from src.backend.routes import auth_routes, tenant_routes, user_routes, student_routes

app = FastAPI(
    title="ASGARD API",
    description="Backend Sistem Deteksi Risiko Putus Sekolah",
    version="1.0.0"
)

# Daftar Routes
app.include_router(auth_routes.router)
app.include_router(tenant_routes.router)
app.include_router(user_routes.router)
app.include_router(student_routes.router)

@app.get("/")
def root():
    return {"message": "Selamat datang di ASGARD API!"}