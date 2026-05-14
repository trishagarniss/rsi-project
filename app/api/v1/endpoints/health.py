"""Versioned health and readiness checks."""

from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def api_health() -> dict[str, str]:
    """API v1 health check."""
    return {"api": "v1", "status": "ok"}
