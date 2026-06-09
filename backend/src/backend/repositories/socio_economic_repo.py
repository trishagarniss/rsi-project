from sqlalchemy.orm import Session
from typing import Optional
from src.backend.models.socio_economic import SocioEconomic

def create_socio_economic(db: Session, data: dict, tenant_id: str) -> SocioEconomic:
    new_record = SocioEconomic(**data, tenant_id=tenant_id)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def get_by_student(db: Session, student_id: str, tenant_id: str) -> Optional[SocioEconomic]:
    return db.query(SocioEconomic).filter(
        SocioEconomic.student_id == student_id,
        SocioEconomic.tenant_id == tenant_id
    ).first()

def get_by_id(db: Session, se_id: str, tenant_id: str) -> Optional[SocioEconomic]:
    return db.query(SocioEconomic).filter(
        SocioEconomic.id == se_id,
        SocioEconomic.tenant_id == tenant_id
    ).first()

def update_socio_economic(db: Session, db_obj: SocioEconomic, update_data: dict) -> SocioEconomic:
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_socio_economic(db: Session, db_obj: SocioEconomic) -> bool:
    db.delete(db_obj)
    db.commit()
    return True