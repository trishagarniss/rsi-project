import os
from sqlalchemy.orm import Session
from fastapi import HTTPException
from src.backend.repositories import ml_model_repo
from src.backend.dto.ml_model_dto import MlModelCreateDTO, MlModelUpdateDTO
from src.backend.models.user import User
from src.backend.models.enums import UserRole

def deploy_new_model(db: Session, data: MlModelCreateDTO, current_user: User):
    if current_user.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Hanya Superadmin yang dapat men-deploy model ML.")
    
    # Kalau model baru ini langsung mau diaktifkan, matikan yang lama
    if data.is_active:
        ml_model_repo.deactivate_all_models(db)
        
    return ml_model_repo.create_model(db, data.model_dump())

def fetch_all_models(db: Session, current_user: User):
    if current_user.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Hanya Superadmin yang dapat melihat riwayat model.")
    return ml_model_repo.get_all_models(db)

def modify_model(db: Session, model_id: str, data: MlModelUpdateDTO, current_user: User):
    if current_user.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Akses ditolak.")

    record = ml_model_repo.get_model_by_id(db, model_id)
    if not record:
        raise HTTPException(status_code=404, detail="Model tidak ditemukan.")
    
    # Kalau update ini bertujuan mengaktifkan model, matikan yang lain
    if data.is_active is True and not record.is_active:
        ml_model_repo.deactivate_all_models(db)

    update_data = data.model_dump(exclude_unset=True)
    return ml_model_repo.update_model(db, record, update_data)

def remove_model(db: Session, model_id: str, current_user: User):
    if current_user.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    record = ml_model_repo.get_model_by_id(db, model_id)
    if not record:
        raise HTTPException(status_code=404, detail="Model tidak ditemukan.")
    
    if record.is_active:
        raise HTTPException(status_code=400, detail="Tidak dapat menghapus model yang sedang aktif. Matikan terlebih dahulu.")

    if record.file_path and os.path.exists(record.file_path):
        os.remove(record.file_path)

    return ml_model_repo.delete_model(db, record)