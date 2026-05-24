from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime
from typing import Optional
from ..models.student import Student
from ..models.risk_prediction import RiskPrediction
from ..models.intervention import Intervention

async def get_dashboard_alert(db: AsyncSession, tenant_id: int) -> Optional[dict]:
    tinggi = (
        await db.execute(
            select(func.count()).where(
                RiskPrediction.tenant_id == tenant_id,
                RiskPrediction.label_risiko == "tinggi",
            )
        )
    ).scalar()

    if tinggi > 0:
        return {
            "type": "warning",
            "message": f"{tinggi} siswa berisiko tinggi butuh intervensi segera",
        }

    return None

async def get_notifications(db: AsyncSession, tenant_id: int) -> list[dict]:
    notif = []
    alert = await get_dashboard_alert(db, tenant_id)
    if alert:
        notif.append(alert)

    today = datetime.utcnow()
    overdue = await db.execute(
        select(Intervention)
        .where(
            Intervention.tenant_id == tenant_id,
            Intervention.status == "direncanakan",
            Intervention.tanggal_intervensi < today,
        )
        .limit(5)
    )
    for inter in overdue.scalars().all():
        notif.append({
            "type": "reminder",
            "message": f"Intervensi #{inter.id} untuk siswa #{inter.student_id} lewat jadwal",
        })

    return notif
