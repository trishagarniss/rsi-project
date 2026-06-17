from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from typing import Optional
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.ml_model_dto import MlModelUpdateDTO
from src.backend.controllers import ml_model_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/models", tags=["ML Models"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_model(
    file: UploadFile = File(...),
    version: str = Form(...),
    algorithm: str = Form(...),
    accuracy_score: Optional[float] = Form(None),
    is_active: bool = Form(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN]))
):
    return await ml_model_controller.create_model(
        db, file, version, algorithm, accuracy_score, is_active, current_user
    )

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
