from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.dto.socio_economic_dto import SocioEconomicCreateDTO, SocioEconomicUpdateDTO
from src.backend.controllers import socio_economic_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/socio-economics", tags=["Socio-Economic"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_socio_economic(
    data: SocioEconomicCreateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return socio_economic_controller.create_socio_economic(db, data, current_user)

@router.get("/student/{student_id}")
def get_socio_economic_by_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return socio_economic_controller.fetch_by_student(db, student_id, current_user)

@router.put("/{se_id}")
def update_socio_economic(
    se_id: str,
    data: SocioEconomicUpdateDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return socio_economic_controller.update_socio_economic(db, se_id, data, current_user)

@router.delete("/{se_id}")
def delete_socio_economic(
    se_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])) # Kunci ketat: Hanya Admin yang boleh hapus
):
    return socio_economic_controller.delete_socio_economic(db, se_id, current_user)