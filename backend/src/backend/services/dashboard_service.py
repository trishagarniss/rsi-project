from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ..models.student import Student
from ..models.risk_prediction import RiskPrediction
from ..models.intervention import Intervention
from ..services.prediction_service import get_risk_summary

async def get_stats(db: AsyncSession, tenant_id: int) -> dict:
    total_siswa = (
        await db.execute(
            select(func.count()).where(Student.tenant_id == tenant_id, Student.is_active == True)
        )
    ).scalar()

    kelas = await db.execute(
        select(Student.class_name).where(Student.tenant_id == tenant_id, Student.is_active == True).distinct()
    )
    total_kelas = len(kelas.all())

    total_intervensi = (
        await db.execute(select(func.count()).where(Intervention.tenant_id == tenant_id))
    ).scalar()

    risk = await get_risk_summary(db, tenant_id)

    return {
        "total_siswa": total_siswa,
        "total_kelas": total_kelas,
        "total_intervensi": total_intervensi,
        "siswa_berisiko_tinggi": risk["risiko_tinggi"],
        "siswa_berisiko_sedang": risk["risiko_sedang"],
        "siswa_berisiko_rendah": risk["risiko_rendah"],
        "persentase_tinggi": risk["persentase_tinggi"],
    }

async def get_risk_by_class(db: AsyncSession, tenant_id: int) -> dict:
    latest_subq = (
        select(
            RiskPrediction.student_id,
            RiskPrediction.label_risiko,
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
            Student.class_name,
            latest_subq.c.label_risiko,
            func.count().label("jml"),
        )
        .join(latest_subq, Student.id == latest_subq.c.student_id)
        .where(latest_subq.c.rn == 1, Student.is_active == True)
        .group_by(Student.class_name, latest_subq.c.label_risiko)
        .order_by(Student.class_name)
    )

    class_map = {}
    for row in result.all():
        cn = row.class_name or "Unknown"
        if cn not in class_map:
            class_map[cn] = {"class_name": cn, "total": 0, "rendah": 0, "sedang": 0, "tinggi": 0}
        class_map[cn][row.label_risiko.value] = row.jml
        class_map[cn]["total"] += row.jml

    return {"items": list(class_map.values())}

async def get_recent_activity(db: AsyncSession, tenant_id: int, limit: int = 20) -> dict:
    preds = await db.execute(
        select(
            RiskPrediction.tanggal_prediksi.label("tanggal"),
            RiskPrediction.label_risiko,
            Student.name,
            Student.class_name,
        )
        .join(Student, RiskPrediction.student_id == Student.id)
        .where(RiskPrediction.tenant_id == tenant_id)
        .order_by(RiskPrediction.tanggal_prediksi.desc())
        .limit(limit)
    )

    inters = await db.execute(
        select(
            Intervention.created_at.label("tanggal"),
            Intervention.jenis,
            Intervention.status,
            Student.name,
            Student.class_name,
        )
        .join(Student, Intervention.student_id == Student.id)
        .where(Intervention.tenant_id == tenant_id)
        .order_by(Intervention.created_at.desc())
        .limit(limit)
    )

    activities = []
    for r in preds.all():
        activities.append({
            "tipe": "prediksi",
            "student_name": r.name,
            "class_name": r.class_name,
            "tanggal": r.tanggal,
            "detail": f"Risiko: {r.label_risiko.value}",
        })
    for r in inters.all():
        activities.append({
            "tipe": "intervensi",
            "student_name": r.name,
            "class_name": r.class_name,
            "tanggal": r.tanggal,
            "detail": f"{r.jenis.value} - {r.status.value}",
        })

    activities.sort(key=lambda x: x["tanggal"], reverse=True)
    return {"items": activities[:limit]}
