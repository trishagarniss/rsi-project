from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from ..models.student import Student
from ..models.risk_prediction import RiskPrediction


async def find_student_by_id(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[Student]:
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    return result.scalar_one_or_none()


async def create_prediction(db: AsyncSession, prediction_obj: RiskPrediction) -> RiskPrediction:
    db.add(prediction_obj)
    await db.flush()
    await db.refresh(prediction_obj)
    return prediction_obj


async def find_predictions_by_student(db: AsyncSession, tenant_id: int, student_id: int, limit: int = 10) -> list[RiskPrediction]:
    result = await db.execute(
        select(RiskPrediction)
        .where(RiskPrediction.student_id == student_id, RiskPrediction.tenant_id == tenant_id)
        .order_by(RiskPrediction.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


async def find_latest_prediction(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[RiskPrediction]:
    result = await db.execute(
        select(RiskPrediction)
        .where(RiskPrediction.student_id == student_id, RiskPrediction.tenant_id == tenant_id)
        .order_by(RiskPrediction.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def get_risk_summary_query(db: AsyncSession, tenant_id: int) -> list:
    total = (
        await db.execute(
            select(func.count()).select_from(Student).where(Student.tenant_id == tenant_id, Student.is_active == True)
        )
    ).scalar()

    subq = (
        select(
            RiskPrediction.student_id,
            func.row_number().over(
                partition_by=RiskPrediction.student_id,
                order_by=RiskPrediction.created_at.desc(),
            ).label("rn"),
            RiskPrediction.label_risiko,
        )
        .where(RiskPrediction.tenant_id == tenant_id)
        .subquery()
    )

    latest = select(subq.c.label_risiko).where(subq.c.rn == 1).subquery()

    counts = (
        await db.execute(
            select(latest.c.label_risiko, func.count().label("jml"))
            .group_by(latest.c.label_risiko)
        )
    ).all()

    return total, counts


async def get_top_risk_query(db: AsyncSession, tenant_id: int, limit: int = 10) -> list:
    latest_subq = (
        select(
            RiskPrediction.student_id,
            RiskPrediction.skor_risiko,
            RiskPrediction.label_risiko,
            RiskPrediction.tanggal_prediksi,
            func.row_number().over(
                partition_by=RiskPrediction.student_id,
                order_by=RiskPrediction.created_at.desc(),
            ).label("rn"),
        )
        .where(RiskPrediction.tenant_id == tenant_id)
        .subquery()
    )

    result = await db.execute(
        select(
            Student.id,
            Student.nis,
            Student.name,
            Student.class_name,
            latest_subq.c.skor_risiko,
            latest_subq.c.label_risiko,
            latest_subq.c.tanggal_prediksi,
        )
        .join(latest_subq, Student.id == latest_subq.c.student_id)
        .where(latest_subq.c.rn == 1, Student.is_active == True)
        .order_by(latest_subq.c.skor_risiko.desc())
        .limit(limit)
    )

    return result.all()
