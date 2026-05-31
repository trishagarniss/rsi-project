from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from ..models.user import User


async def create_user(db: AsyncSession, data_dict: dict) -> User:
    user = User(**data_dict)
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def find_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def find_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
