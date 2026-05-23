from fastapi import FastAPI

app = FastAPI(
    title="ASGARD API",
    description="Analisis Sistem Gejala Awal Risiko Dropout",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "ASGARD Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}