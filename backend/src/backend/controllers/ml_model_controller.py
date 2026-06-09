from sqlalchemy.orm import Session
from src.backend.dto.ml_model_dto import MlModelCreateDTO, MlModelUpdateDTO, MlModelResponseDTO
from src.backend.services import ml_model_service
from src.backend.models.user import User

def create_model(db: Session, data: MlModelCreateDTO, current_user: User):
    new_model = ml_model_service.deploy_new_model(db, data, current_user)
    return {
        "status": "success",
        "message": "Model ML berhasil ditambahkan.",
        "data": MlModelResponseDTO.model_validate(new_model)
    }

def get_all_models(db: Session, current_user: User):
    models = ml_model_service.fetch_all_models(db, current_user)
    return {
        "status": "success",
        "data": [MlModelResponseDTO.model_validate(m) for m in models]
    }

def update_model(db: Session, model_id: str, data: MlModelUpdateDTO, current_user: User):
    updated = ml_model_service.modify_model(db, model_id, data, current_user)
    return {
        "status": "success",
        "message": "Status model ML berhasil diperbarui.",
        "data": MlModelResponseDTO.model_validate(updated)
    }

def delete_model(db: Session, model_id: str, current_user: User):
    ml_model_service.remove_model(db, model_id, current_user)
    return {
        "status": "success",
        "message": "Model ML berhasil dihapus."
    }