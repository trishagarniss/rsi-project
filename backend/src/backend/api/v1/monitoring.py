from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timezone

from ...core.database import get_db
from ...core.redis_client import redis_client
from ...core.security import get_current_user
from ...models.user import User

router = APIRouter()

@router.get("/health")
async def health():
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "asgard-backend",
    }

@router.get("/check-db")
async def check_db(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "detail": str(e)}

@router.get("/check-redis")
async def check_redis():
    try:
        await redis_client.ping()
        return {"redis": "connected"}
    except Exception as e:
        return {"redis": "error", "detail": str(e)}

@router.get("/ping")
async def ping(current_user: User = Depends(get_current_user)):
    return {"message": "pong", "user": current_user.email, "role": current_user.role.value}
