from sqlalchemy.orm import Session
from typing import List, Optional
from src.backend.models.risk_prediction import RiskPrediction

def save_prediction(db: Session, data: dict, tenant_id: str) -> RiskPrediction:
    new_prediction = RiskPrediction(**data, tenant_id=tenant_id)
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    return new_prediction

def get_latest_prediction_by_student(db: Session, student_id: str, tenant_id: str) -> Optional[RiskPrediction]:
    """Mengambil hasil prediksi paling baru untuk satu siswa"""
    return db.query(RiskPrediction).filter(
        RiskPrediction.student_id == student_id,
        RiskPrediction.tenant_id == tenant_id
    ).order_by(RiskPrediction.created_at.desc()).first()

def get_all_risky_students(db: Session, tenant_id: str) -> List[RiskPrediction]:
    """Mengambil daftar semua siswa yang saat ini berstatus BERISIKO untuk Dashboard BK"""
    # Catatan: Logika aslinya mungkin perlu subquery untuk mencari data 'terbaru' per siswa,
    # tapi ini cukup untuk MVP awal.
    return db.query(RiskPrediction).filter(
        RiskPrediction.tenant_id == tenant_id,
        RiskPrediction.is_at_risk == True
    ).order_by(RiskPrediction.risk_score.desc()).all()