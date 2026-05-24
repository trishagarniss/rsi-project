from fastapi import FastAPI
from .api.v1 import auth
from .core.database import engine, Base
from .core.redis_client import redis_client
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: buat tabel database (hanya untuk development, di production pakai migration)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: tutup koneksi
    await engine.dispose()
    await redis_client.close()

app = FastAPI(title="ASGARD API", version="1.0.0", lifespan=lifespan)

# Include routers
app.include_router(auth.router)

@app.get("/health")
async def health():
    return {"status": "ok"}