from sqlalchemy.orm import Session
from fastapi import HTTPException

from src.backend.repositories import attendance_repo, student_repo
from src.backend.dto.attendance_dto import AttendanceCreateDTO, AttendanceUpdateDTO
from src.backend.models.user import User
from src.backend.services.risk_prediction_service import auto_predict_on_data_change

def add_attendance_record(db: Session, data: AttendanceCreateDTO, current_user: User):
    student = student_repo.get_student_by_id_and_tenant(db, data.student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    # Gembok Logika: Cek apakah data untuk semester tersebut sudah ada
    existing_record = attendance_repo.get_by_student_and_semester(
        db, data.student_id, data.semester, data.academic_year, current_user.tenant_id
    )
    if existing_record:
        raise HTTPException(status_code=400, detail=f"Data absensi semester {data.semester} ({data.academic_year}) sudah ada. Silakan gunakan fitur update.")
    
    result = attendance_repo.create_attendance(db, data.model_dump(), current_user.tenant_id)
    
    auto_predict_on_data_change(db, data.student_id, current_user)
    
    return result

def get_student_attendances(db: Session, student_id: str, current_user: User):
    student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    return attendance_repo.get_by_student(db, student_id, current_user.tenant_id)

def modify_attendance_record(db: Session, attendance_id: str, data: AttendanceUpdateDTO, current_user: User):
    record = attendance_repo.get_by_id(db, attendance_id, current_user.tenant_id)
    if not record:
        raise HTTPException(status_code=404, detail="Data absensi tidak ditemukan.")
    
    # Jika user mencoba mengubah semester/tahun, pastikan tidak bentrok dengan data yang sudah ada
    if data.semester or data.academic_year:
        check_semester = data.semester or record.semester
        check_year = data.academic_year or record.academic_year
        
        conflict = attendance_repo.get_by_student_and_semester(db, record.student_id, check_semester, check_year, current_user.tenant_id)
        if conflict and conflict.id != attendance_id:
             raise HTTPException(status_code=400, detail="Perubahan ditolak: Data absensi untuk semester tersebut sudah terdaftar.")

    update_data = data.model_dump(exclude_unset=True)
    result = attendance_repo.update_attendance(db, record, update_data)
    
    auto_predict_on_data_change(db, record.student_id, current_user)
    
    return result

def remove_attendance_record(db: Session, attendance_id: str, current_user: User):
    record = attendance_repo.get_by_id(db, attendance_id, current_user.tenant_id)
    if not record:
        raise HTTPException(status_code=404, detail="Data absensi tidak ditemukan.")
    
    return attendance_repo.delete_attendance(db, record)