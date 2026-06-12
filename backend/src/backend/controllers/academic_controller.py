from sqlalchemy.orm import Session
from src.backend.dto.academic_dto import AcademicCreateDTO, AcademicResponseDTO, AcademicUpdateDTO
from src.backend.services import academic_service
from src.backend.models.user import User

def register_academic(db: Session, data: AcademicCreateDTO, current_user: User):
    new_record = academic_service.add_academic_record(db, data, current_user)
    return {
        "status": "success",
        "message": "Data akademik berhasil disimpan.",
        "data": AcademicResponseDTO.model_validate(new_record)
    }

def fetch_student_academics(db: Session, student_id: str, current_user: User):
    records = academic_service.get_academic_by_student(db, student_id, current_user)
    return {
        "status": "success",
        "data": [AcademicResponseDTO.model_validate(r) for r in records]
    }
    
def update_academic(db: Session, academic_id: str, data: AcademicUpdateDTO, current_user: User):
    updated_record = academic_service.modify_academic_record(db, academic_id, data, current_user)
    return {
        "status": "success",
        "message": "Data akademik berhasil diperbarui.",
        "data": AcademicResponseDTO.model_validate(updated_record)
    }
    
def remove_academic(db: Session, academic_id: str, current_user: User):
    academic_service.delete_academic_record(db, academic_id, current_user)
    return {
        "status": "success",
        "message": "Data akademik berhasil dihapus."
    }