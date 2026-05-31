from sqlalchemy.ext.asyncio import AsyncSession
from ..models.user import User


async def create_user(db: AsyncSession, data_dict: dict) -> User:
    user = User(**data_dict)
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user
