from sqlalchemy.orm import Session
from typing import List, Optional
from src.backend.models.risk_prediction import RiskPredictionLog

def save_prediction(db: Session, data: dict, tenant_id: str) -> RiskPredictionLog:
    new_prediction = RiskPredictionLog(**data, tenant_id=tenant_id)
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    return new_prediction

def bulk_save_predictions(db: Session, predictions_data: List[dict], tenant_id: str) -> bool:
    try:
        # Ubah list of dictionary menjadi list of object SQLAlchemy
        new_predictions = [
            RiskPredictionLog(**data, tenant_id=tenant_id) 
            for data in predictions_data
        ]
        
        # add_all akan mengirimkan data ke database dalam satu antrean besar (Batch)
        db.add_all(new_predictions)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error bulk insert predictions: {e}")
        return False

def get_latest_prediction_by_student(db: Session, student_id: str, tenant_id: str) -> Optional[RiskPredictionLog]:
    return db.query(RiskPredictionLog).filter(
        RiskPredictionLog.student_id == student_id,
        RiskPredictionLog.tenant_id == tenant_id
    ).order_by(RiskPredictionLog.created_at.desc()).first()

def get_all_risky_students(db: Session, tenant_id: str) -> List[RiskPredictionLog]:
    """Mengambil daftar semua siswa yang saat ini berstatus BERISIKO untuk Dashboard BK"""
    # Catatan: Logika aslinya mungkin perlu subquery untuk mencari data 'terbaru' per siswa,
    # tapi ini cukup untuk MVP awal.
    return db.query(RiskPredictionLog).filter(
        RiskPredictionLog.tenant_id == tenant_id,
        RiskPredictionLog.is_at_risk == True
    ).order_by(RiskPredictionLog.risk_score.desc()).all()