import os
import uuid
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException

from src.backend.dto.ml_model_dto import MlModelCreateDTO, MlModelUpdateDTO, MlModelResponseDTO
from src.backend.services import ml_model_service
from src.backend.services.audit_log_service import record_activity
from src.backend.services.notification_service import notify_all_superadmins
from src.backend.models.user import User

STORAGE_DIR = "storage/models"

async def create_model(
    db: Session,
    file: UploadFile,
    version: str,
    algorithm: str,
    accuracy_score: float | None,
    is_active: bool,
    current_user: User,
):
    if not file.filename or not file.filename.endswith(".pkl"):
        raise HTTPException(status_code=400, detail="File harus berupa .pkl")

    os.makedirs(STORAGE_DIR, exist_ok=True)
    filename = f"{uuid.uuid4()}.pkl"
    file_path = os.path.join(STORAGE_DIR, filename)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    data = MlModelCreateDTO(
        version=version,
        algorithm=algorithm,
        file_path=file_path,
        accuracy_score=accuracy_score,
        is_active=is_active,
    )

    new_model = ml_model_service.deploy_new_model(db, data, current_user)
    record_activity(
        db, "CREATE", "model", current_user,
        entity_id=new_model.id,
        details={"version": data.version, "algorithm": data.algorithm, "file_path": file_path},
    )
    notify_all_superadmins(
        db, "ML Model Baru",
        f"Model ML {data.version} ({data.algorithm}) ditambahkan oleh {current_user.fullname}.",
        "info", "model", new_model.id,
    )
    return {
        "status": "success",
        "message": "Model ML berhasil ditambahkan.",
        "data": MlModelResponseDTO.model_validate(new_model),
    }

def get_all_models(db: Session, current_user: User):
    models = ml_model_service.fetch_all_models(db, current_user)
    return {
        "status": "success",
        "data": [MlModelResponseDTO.model_validate(m) for m in models],
    }

def update_model(db: Session, model_id: str, data: MlModelUpdateDTO, current_user: User):
    updated = ml_model_service.modify_model(db, model_id, data, current_user)
    record_activity(
        db, "UPDATE", "model", current_user,
        entity_id=model_id,
        details=data.model_dump(exclude_unset=True),
    )
    return {
        "status": "success",
        "message": "Status model ML berhasil diperbarui.",
        "data": MlModelResponseDTO.model_validate(updated),
    }

def delete_model(db: Session, model_id: str, current_user: User):
    ml_model_service.remove_model(db, model_id, current_user)
    record_activity(db, "DELETE", "model", current_user, entity_id=model_id)
    return {
        "status": "success",
        "message": "Model ML berhasil dihapus.",
    }
