"""FastAPI application entry point for ASGARD."""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown hooks."""
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Early Warning System API for student dropout prediction.",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe for orchestration and load balancers."""
    return {"status": "ok"}
