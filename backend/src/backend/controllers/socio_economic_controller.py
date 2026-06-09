from sqlalchemy.orm import Session
from src.backend.dto.socio_economic_dto import SocioEconomicCreateDTO, SocioEconomicUpdateDTO, SocioEconomicResponseDTO
from src.backend.services import socio_economic_service
from src.backend.models.user import User

def create_socio_economic(db: Session, data: SocioEconomicCreateDTO, current_user: User):
    new_record = socio_economic_service.add_socio_economic_record(db, data, current_user)
    return {
        "status": "success",
        "message": "Profil sosio-ekonomi siswa berhasil disimpan.",
        "data": SocioEconomicResponseDTO.model_validate(new_record)
    }

def fetch_by_student(db: Session, student_id: str, current_user: User):
    record = socio_economic_service.get_student_socio_economic(db, student_id, current_user)
    return {
        "status": "success",
        "data": SocioEconomicResponseDTO.model_validate(record)
    }

def update_socio_economic(db: Session, se_id: str, data: SocioEconomicUpdateDTO, current_user: User):
    updated_record = socio_economic_service.modify_socio_economic_record(db, se_id, data, current_user)
    return {
        "status": "success",
        "message": "Profil sosio-ekonomi siswa berhasil diperbarui.",
        "data": SocioEconomicResponseDTO.model_validate(updated_record)
    }

def delete_socio_economic(db: Session, se_id: str, current_user: User):
    socio_economic_service.remove_socio_economic_record(db, se_id, current_user)
    return {
        "status": "success",
        "message": "Profil sosio-ekonomi berhasil dihapus."
    }