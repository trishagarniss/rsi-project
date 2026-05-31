import json
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import datetime, timezone

from ..models.student import Student
from ..models.risk_prediction import RiskPrediction, RiskLevel
from ..services.academic_service import get_academics
from ..services.attendance_service import get_attendances
from ..services.socio_economic_service import get_by_student as get_socio_by_student
from ..services.audit_service import log_action
from ..repositories.prediction_repository import (
    find_student_by_id, create_prediction as repo_create_prediction,
    find_predictions_by_student as repo_find_predictions,
    find_latest_prediction as repo_find_latest_prediction,
    get_risk_summary_query, get_top_risk_query,
)

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


async def predict_student(db: AsyncSession, tenant_id: int, student_id: int, user_id: int) -> dict:
    student = await find_student_by_id(db, tenant_id, student_id)
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
    prediction = await repo_create_prediction(db, prediction)
    await db.commit()
    await log_action(db, tenant_id, user_id, "create", "risk_prediction", prediction.id, f"Student ID: {student_id}, Skor: {round(total, 2)}, Label: {level.value}")

    return {
        "student_id": student_id,
        "skor_risiko": round(total, 2),
        "label_risiko": level,
        "model_version": MODEL_VERSION,
    }


async def get_predictions_by_student(db: AsyncSession, tenant_id: int, student_id: int, limit: int = 10) -> list[RiskPrediction]:
    return await repo_find_predictions(db, tenant_id, student_id, limit)


async def get_latest_prediction(db: AsyncSession, tenant_id: int, student_id: int) -> Optional[RiskPrediction]:
    return await repo_find_latest_prediction(db, tenant_id, student_id)


async def get_risk_summary(db: AsyncSession, tenant_id: int) -> dict:
    total, counts = await get_risk_summary_query(db, tenant_id)

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
    rows = await get_top_risk_query(db, tenant_id, limit)

    items = []
    for i, row in enumerate(rows, 1):
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
