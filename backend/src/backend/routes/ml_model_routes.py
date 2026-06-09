from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.ml_model_dto import MlModelCreateDTO, MlModelUpdateDTO
from src.backend.controllers import ml_model_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/models", tags=["ML Models"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_model(
    data: MlModelCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return ml_model_controller.create_model(db, data, current_user)

@router.get("/")
def get_all_models(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return ml_model_controller.get_all_models(db, current_user)

@router.put("/{model_id}")
def update_model(
    model_id: str,
    data: MlModelUpdateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return ml_model_controller.update_model(db, model_id, data, current_user)

@router.delete("/{model_id}")
def delete_model(
    model_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return ml_model_controller.delete_model(db, model_id, current_user)