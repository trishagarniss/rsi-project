from sqlalchemy.orm import Session
from typing import List
from src.backend.dto.attendance_dto import AttendanceCreateDTO, AttendanceUpdateDTO, AttendanceResponseDTO
from src.backend.services import attendance_service
from src.backend.models.user import User

def create_attendance(db: Session, data: AttendanceCreateDTO, current_user: User):
    new_record = attendance_service.add_attendance_record(db, data, current_user)
    return {
        "status": "success",
        "message": "Data absensi berhasil disimpan.",
        "data": AttendanceResponseDTO.model_validate(new_record)
    }

def fetch_student_attendances(db: Session, student_id: str, current_user: User):
    records = attendance_service.get_student_attendances(db, student_id, current_user)
    return {
        "status": "success",
        "data": [AttendanceResponseDTO.model_validate(r) for r in records]
    }

def update_attendance(db: Session, attendance_id: str, data: AttendanceUpdateDTO, current_user: User):
    updated_record = attendance_service.modify_attendance_record(db, attendance_id, data, current_user)
    return {
        "status": "success",
        "message": "Data absensi berhasil diperbarui.",
        "data": AttendanceResponseDTO.model_validate(updated_record)
    }

def delete_attendance(db: Session, attendance_id: str, current_user: User):
    attendance_service.remove_attendance_record(db, attendance_id, current_user)
    return {
        "status": "success",
        "message": "Data absensi berhasil dihapus."
    }