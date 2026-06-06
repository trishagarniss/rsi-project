from sqlalchemy.orm import Session
from src.backend.models.academic import Academic

def create_academic(db: Session, data: dict, tenant_id: str):
    new_record = Academic(**data, tenant_id=tenant_id)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def get_by_student(db: Session, student_id: str, tenant_id: str):
    return db.query(Academic).filter(
        Academic.student_id == student_id, 
        Academic.tenant_id == tenant_id
    ).all()