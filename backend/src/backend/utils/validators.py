from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from ..models.student import Student

async def validate_unique_nis(db: AsyncSession, tenant_id: int, nis: str, exclude_id: Optional[int] = None) -> bool:
    query = select(Student).where(Student.tenant_id == tenant_id, Student.nis == nis, Student.is_active == True)
    if exclude_id:
        query = query.where(Student.id != exclude_id)
    result = await db.execute(query)
    return result.scalar_one_or_none() is None