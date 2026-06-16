from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from src.backend.models.risk_prediction import RiskPredictionLog
from src.backend.models.enums import RiskStatus

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
    return db.query(RiskPredictionLog).options(joinedload(RiskPredictionLog.student)).filter(
        RiskPredictionLog.tenant_id == tenant_id,
        RiskPredictionLog.is_at_risk == True
    ).order_by(RiskPredictionLog.risk_score.desc()).all()
    
def get_latest_prediction_by_tenant_all(db: Session,tenant_id: str) -> Optional[RiskPredictionLog]:
    return db.query(RiskPredictionLog).filter(
        RiskPredictionLog.tenant_id == tenant_id
    ).order_by(RiskPredictionLog.created_at.desc()).all()

def get_all_predictions(db: Session, tenant_id: str, risk_status: Optional[str] = None) -> List[RiskPredictionLog]:
    query = db.query(RiskPredictionLog).options(joinedload(RiskPredictionLog.student)).filter(
        RiskPredictionLog.tenant_id == tenant_id
    )
    if risk_status:
        query = query.filter(RiskPredictionLog.risk_status == risk_status)
    return query.order_by(RiskPredictionLog.created_at.desc()).all()

def count_predicted_students(db: Session, tenant_id: Optional[str] = None) -> int:
    query = db.query(func.count(RiskPredictionLog.student_id.distinct()))
    if tenant_id:
        query = query.filter(RiskPredictionLog.tenant_id == tenant_id)
    return query.scalar() or 0
