from sqlalchemy.orm import Session
from fastapi import HTTPException

from src.backend.repositories import socio_economic_repo, student_repo
from src.backend.dto.socio_economic_dto import SocioEconomicCreateDTO, SocioEconomicUpdateDTO
from src.backend.models.user import User

def add_socio_economic_record(db: Session, data: SocioEconomicCreateDTO, current_user: User):
    # 1. Pastikan siswa ada & milik tenant ini
    student = student_repo.get_student_by_id_and_tenant(db, data.student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan di sekolah Anda.")
    
    # 2. Gembok 1:1 (Cegah Duplikasi)
    existing_record = socio_economic_repo.get_by_student(db, data.student_id, current_user.tenant_id)
    if existing_record:
        raise HTTPException(status_code=400, detail="Siswa ini sudah memiliki profil sosio-ekonomi. Gunakan fitur update untuk mengubah data.")
    
    return socio_economic_repo.create_socio_economic(db, data.model_dump(), current_user.tenant_id)

def get_student_socio_economic(db: Session, student_id: str, current_user: User):
    student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    record = socio_economic_repo.get_by_student(db, student_id, current_user.tenant_id)
    if not record:
        raise HTTPException(status_code=404, detail="Data sosio-ekonomi untuk siswa ini belum diisi.")
        
    return record

def modify_socio_economic_record(db: Session, se_id: str, data: SocioEconomicUpdateDTO, current_user: User):
    # Validasi kepemilikan data
    record = socio_economic_repo.get_by_id(db, se_id, current_user.tenant_id)
    if not record:
        raise HTTPException(status_code=404, detail="Data sosio-ekonomi tidak ditemukan.")
    
    update_data = data.model_dump(exclude_unset=True)
    return socio_economic_repo.update_socio_economic(db, record, update_data)

def remove_socio_economic_record(db: Session, se_id: str, current_user: User):
    record = socio_economic_repo.get_by_id(db, se_id, current_user.tenant_id)
    if not record:
        raise HTTPException(status_code=404, detail="Data sosio-ekonomi tidak ditemukan.")
    
    return socio_economic_repo.delete_socio_economic(db, record)