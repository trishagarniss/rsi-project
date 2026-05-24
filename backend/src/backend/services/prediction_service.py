import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from typing import Optional
from datetime import datetime, timezone

from ..models.student import Student
from ..models.risk_prediction import RiskPrediction, RiskLevel
from ..services.academic_service import get_academics
from ..services.attendance_service import get_attendances
from ..services.socio_economic_service import get_by_student as get_socio_by_student

WEIGHT_ACADEMIC = 0.40
WEIGHT_ATTENDANCE = 0.35
WEIGHT_SOCIO = 0.25
MODEL_VERSION = "rule-based-v1"

def _academic_score(academic_records) -> float:
    total = 0
    count = 0
    for r in academic_records:
        score = 0
        if r.rata_rata_nilai is not None:
            if r.rata_rata_nilai < 60:
                score += 60
            elif r.rata_rata_nilai < 75:
                score += 35
            elif r.rata_rata_nilai < 85:
                score += 15
        if r.jumlah_mapel_tidak_tuntas is not None:
            if r.jumlah_mapel_tidak_tuntas >= 4:
                score += 30
            elif r.jumlah_mapel_tidak_tuntas >= 2:
                score += 15
        if r.kenaikan_kelas is False:
            score += 10
        total += score
        count += 1
    if count == 0:
        return 50
    return min(total / count, 100)

def _attendance_score(attendance_records) -> float:
    total = 0
    count = 0
    for r in attendance_records:
        score = 0
        if r.persentase_kehadiran is not None:
            if r.persentase_kehadiran < 70:
                score += 60
            elif r.persentase_kehadiran < 85:
                score += 30
            elif r.persentase_kehadiran < 95:
                score += 10
        if r.alpha >= 15:
            score += 30
        elif r.alpha >= 8:
            score += 15
        total += score
        count += 1
    if count == 0:
        return 50
    return min(total / count, 100)

def _socio_score(socio) -> float:
    if not socio:
        return 50
    score = 0
    if socio.penghasilan_ortu is not None and socio.penghasilan_ortu < 1000000:
        score += 25
    elif socio.penghasilan_ortu is not None and socio.penghasilan_ortu < 3000000:
        score += 10
    if socio.pendidikan_ayah in ("SD", "Tidak Sekolah", "tidak_sekolah"):
        score += 15
    if socio.pendidikan_ibu in ("SD", "Tidak Sekolah", "tidak_sekolah"):
        score += 15
    if socio.jarak_rumah_sekolah is not None and socio.jarak_rumah_sekolah > 10:
        score += 15
    elif socio.jarak_rumah_sekolah is not None and socio.jarak_rumah_sekolah > 5:
        score += 5
    if socio.status_rumah in ("sewa", "kontrak", "menumpang"):
        score += 10
    return min(score, 100)

def _compute_risk_level(total_score: float) -> RiskLevel:
    if total_score >= 65:
        return RiskLevel.TINGGI
    elif total_score >= 35:
        return RiskLevel.SEDANG
    return RiskLevel.RENDAH

async def predict_student(db: AsyncSession, tenant_id: int, student_id: int) -> dict:
    result = await db.execute(
        select(Student).where(Student.id == student_id, Student.tenant_id == tenant_id, Student.is_active == True)
    )
    student = result.scalar_one_or_none()
    if not student:
        raise ValueError("Siswa tidak ditemukan")

    academics, _ = await get_academics(db, tenant_id, limit=100, student_id=student_id)
    attendances, _ = await get_attendances(db, tenant_id, limit=100, student_id=student_id)
    socio = await get_socio_by_student(db, tenant_id, student_id)

    acad = _academic_score(academics)
    att = _attendance_score(attendances)
    soc = _socio_score(socio)

    total = (acad * WEIGHT_ACADEMIC) + (att * WEIGHT_ATTENDANCE) + (soc * WEIGHT_SOCIO)
    level = _compute_risk_level(total)

    features = {
        "academic_score": round(acad, 2),
        "attendance_score": round(att, 2),
        "socio_score": round(soc, 2),
        "academic_records": len(academics),
        "attendance_records": len(attendances),
        "has_socio": socio is not None,
    }

    prediction = RiskPrediction(
        student_id=student_id,
        tenant_id=tenant_id,
        skor_risiko=round(total, 2),
        label_risiko=level,
        fitur_snapshot=json.dumps(features, ensure_ascii=False),
        model_version=MODEL_VERSION,
    )
    db.add(prediction)
    await db.commit()
    await db.refresh(prediction)

    return {
        "student_id": student_id,
        "skor_risiko": round(total, 2),
        "label_risiko": level,
        "model_version": MODEL_VERSION,
    }

async def get_predictions_by_student(db: AsyncSession, tenant_id: int, student_id: int, limit: int = 10) -> list[RiskPrediction]:
    result = await db.execute(
        select(RiskPrediction)
        .where(RiskPrediction.student_id == student_id, RiskPrediction.tenant_id == tenant_id)
        .order_by(RiskPrediction.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())

async def get_latest_prediction(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[RiskPrediction]:
    result = await db.execute(
        select(RiskPrediction)
        .where(RiskPrediction.student_id == student_id, RiskPrediction.tenant_id == tenant_id)
        .order_by(RiskPrediction.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()

async def get_risk_summary(db: AsyncSession, tenant_id: int) -> dict:
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

    count_map = {RiskLevel.RENDAH: 0, RiskLevel.SEDANG: 0, RiskLevel.TINGGI: 0}
    for row in counts:
        count_map[row[0]] = row[1]

    tinggi_pct = round((count_map[RiskLevel.TINGGI] / total * 100), 2) if total > 0 else 0

    return {
        "total_siswa": total,
        "risiko_rendah": count_map[RiskLevel.RENDAH],
        "risiko_sedang": count_map[RiskLevel.SEDANG],
        "risiko_tinggi": count_map[RiskLevel.TINGGI],
        "persentase_tinggi": tinggi_pct,
    }

async def get_top_risk(db: AsyncSession, tenant_id: int, limit: int = 10) -> list[dict]:
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

    items = []
    for i, row in enumerate(result.all(), 1):
        items.append({
            "rank": i,
            "id": row.id,
            "nis": row.nis,
            "name": row.name,
            "class_name": row.class_name,
            "risk_score": float(row.skor_risiko) if row.skor_risiko else None,
            "risk_level": row.label_risiko.value if row.label_risiko else None,
            "last_prediction_date": row.tanggal_prediksi,
        })

    return items
