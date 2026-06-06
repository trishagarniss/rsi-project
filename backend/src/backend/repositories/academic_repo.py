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
    
def get_academic_by_id(db: Session, academic_id: str, tenant_id: str):
    return db.query(Academic).filter(
        Academic.id == academic_id,
        Academic.tenant_id == tenant_id
    ).first()

def get_duplicate_check(db: Session, student_id: str, semester: int, academic_year: str, tenant_id: str):
    return db.query(Academic).filter(
        Academic.student_id == student_id,
        Academic.semester == semester,
        Academic.academic_year == academic_year,
        Academic.tenant_id == tenant_id
    ).first()
    
def update_academic(db: Session, db_obj: Academic, update_data: dict):
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_academic(db: Session, db_obj: Academic):
    db.delete(db_obj)
    db.commit()
    return True