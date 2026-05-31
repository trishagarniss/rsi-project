from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Any

async def paginate(db: AsyncSession, query, page: int = 1, limit: int = 10) -> dict[str, Any]:
    total_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(total_query)).scalar()
    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    items = result.scalars().all()
    return {"items": items, "total": total, "page": page, "limit": limit}

def clean_nis(nis: str) -> str:
    return "".join(c for c in nis if c.isdigit())

def truncate_text(text: str, max_length: int = 100) -> str:
    return text[:max_length] + "..." if len(text) > max_length else text
