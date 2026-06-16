from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy.sql import func
from src.backend.models.ml_model import MlModel

def create_model(db: Session, data: dict) -> MlModel:
    new_model = MlModel(**data)
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    return new_model

def get_all_models(db: Session) -> List[MlModel]:
    return db.query(MlModel).filter(MlModel.deleted_at == None).order_by(MlModel.created_at.desc()).all()

def get_model_by_id(db: Session, model_id: str) -> Optional[MlModel]:
    return db.query(MlModel).filter(MlModel.id == model_id, MlModel.deleted_at == None).first()

def get_active_model(db: Session) -> Optional[MlModel]:
    return db.query(MlModel).filter(MlModel.is_active == True, MlModel.deleted_at == None).first()

def deactivate_all_models(db: Session):
    db.query(MlModel).update({"is_active": False})
    db.commit()

def update_model(db: Session, db_obj: MlModel, update_data: dict) -> MlModel:
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_model(db: Session, db_obj: MlModel) -> bool:
    db_obj.deleted_at = func.now()
    db.commit()
    return True