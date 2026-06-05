from fastapi import FastAPI
from src.backend.routes import tenant_routes, user_routes

app = FastAPI(
    title="ASGARD API",
    description="Backend Sistem Deteksi Risiko Putus Sekolah",
    version="1.0.0"
)

# Daftar Routes
app.include_router(tenant_routes.router)
app.include_router(user_routes.router)

@app.get("/")
def root():
    return {"message": "Selamat datang di ASGARD API!"}