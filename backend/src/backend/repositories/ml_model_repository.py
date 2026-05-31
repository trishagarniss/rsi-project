from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.ml_model import MlModel


async def create_model(db: AsyncSession, data_dict: dict) -> MlModel:
    model = MlModel(**data_dict)
    db.add(model)
    await db.flush()
    await db.refresh(model)
    return model


async def find_active_model(db: AsyncSession) -> Optional[MlModel]:
    result = await db.execute(
        select(MlModel).where(MlModel.is_active == True)
    )
    return result.scalar_one_or_none()


async def find_model_by_id(db: AsyncSession, model_id: int) -> Optional[MlModel]:
    result = await db.execute(
        select(MlModel).where(MlModel.id == model_id)
    )
    return result.scalar_one_or_none()


async def find_models(db: AsyncSession, skip: int = 0, limit: int = 10) -> tuple[list[MlModel], int]:
    total = (await db.execute(select(func.count()).select_from(MlModel))).scalar()
    result = await db.execute(
        select(MlModel).offset(skip).limit(limit).order_by(MlModel.created_at.desc())
    )
    return list(result.scalars().all()), total


async def deactivate_all_models(db: AsyncSession) -> None:
    from sqlalchemy import update as sql_update
    await db.execute(
        sql_update(MlModel.__table__).where(MlModel.is_active == True).values(is_active=False)
    )
    await db.flush()


async def update_model_fields(db: AsyncSession, model: MlModel, update_data: dict) -> MlModel:
    for key, value in update_data.items():
        setattr(model, key, value)
    await db.flush()
    await db.refresh(model)
    return model


async def delete_model_record(db: AsyncSession, model: MlModel) -> None:
    await db.delete(model)
    await db.flush()
