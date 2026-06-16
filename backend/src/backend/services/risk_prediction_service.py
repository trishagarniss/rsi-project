import os
import joblib
import pandas as pd
from sqlalchemy.orm import Session
from fastapi import HTTPException

from src.backend.repositories import (
    risk_prediction_repo, 
    student_repo, 
    ml_model_repo, 
    tenant_repo,
    socio_economic_repo, 
    academic_repo, 
    attendance_repo
)
from src.backend.dto.risk_prediction_dto import RiskPredictionCreateDTO
from src.backend.models.user import User
from src.backend.models.enums import RiskStatus, UserRole

def execute_prediction(db: Session, student_id: str, current_user: User):
    student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Data siswa tidak ditemukan di sekolah Anda.")

    se_data = socio_economic_repo.get_by_student(db, student_id, current_user.tenant_id)
    academic_data = academic_repo.get_by_student(db, student_id, current_user.tenant_id)
    attendance_data = attendance_repo.get_by_student(db, student_id, current_user.tenant_id)
    
    if not se_data or not academic_data or not attendance_data:
        raise HTTPException(
            status_code=400, 
            detail="Data siswa belum lengkap. Pastikan profil Sosio-Ekonomi, Akademik, dan Absensi sudah diisi minimal 1 semester."
        )

    active_model = ml_model_repo.get_active_model(db)
    if not active_model:
        raise HTTPException(
            status_code=500, 
            detail="Sistem belum memiliki Model ML yang aktif. Silakan hubungi Superadmin."
        )

    tenant = tenant_repo.get_tenant_by_id(db, current_user.tenant_id)
    threshold = getattr(tenant, 'risk_confidence_threshold', 0.75)

    latest_academic = sorted(academic_data, key=lambda x: x.semester, reverse=True)[0]
    latest_attendance = sorted(attendance_data, key=lambda x: x.semester, reverse=True)[0]
    
    raw_features = {
        "average_score": latest_academic.average_score or 0.0,
        "failed_subjects_count": latest_academic.failed_subjects_count or 0,
        "incomplete_assignments_count": latest_academic.incomplete_assignments_count or 0,
        "attendance_percentage": latest_attendance.attendance_percentage or 0.0,
        "present_count": latest_attendance.present_count or 0,
        "sick_count": latest_attendance.sick_count or 0,
        "excused_count": latest_attendance.excused_count or 0,
        "unexcused_count": latest_attendance.unexcused_count or 0,
        "parents_income": se_data.parents_income or 0,
        "monthly_expenses": se_data.monthly_expenses or 0,
        "parents_education_level": se_data.parents_education_level or "Unknown",
        "birth_order": se_data.birth_order or 1,
        "dependents_count": se_data.dependents_count or 0,
        "distance_to_school_km": se_data.distance_to_school_km or 0.0,
        "has_kip_scholarship": int(se_data.has_kip_scholarship) if se_data.has_kip_scholarship is not None else 0,
        "is_working_student": int(se_data.is_working_student) if se_data.is_working_student is not None else 0,
        "has_internet_access": int(se_data.has_internet_access) if se_data.has_internet_access is not None else 1,
        "housing_status": se_data.housing_status.value if se_data.housing_status else "Unknown",
        "gender": student.gender.value if student.gender else "Unknown"
    }
    
    df_features = pd.DataFrame([raw_features])
    
    if not os.path.exists(active_model.file_path):
        raise HTTPException(
            status_code=500, 
            detail=f"File model '{active_model.version}' tidak ditemukan di server: {active_model.file_path}"
        )
        
    try:
        model = joblib.load(active_model.file_path)
        
        if hasattr(model, "predict_proba"):
            risk_score = round(float(model.predict_proba(df_features)[0][1]), 2)
        else:
            risk_score = float(model.predict(df_features)[0])
            
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Terjadi kesalahan saat memproses model ML: {str(e)}"
        )

    # Sinkronisasi dengan kolom database yang baru
    risk_status = RiskStatus.AT_RISK if risk_score >= threshold else RiskStatus.NOT_AT_RISK

    pred_data = RiskPredictionCreateDTO(
        student_id=student.id,
        model_id=active_model.id,
        risk_score=risk_score,
        risk_status=risk_status,
    )

    return risk_prediction_repo.save_prediction(db, pred_data.model_dump(), current_user.tenant_id)


def bulk_execute_prediction(db: Session, student_ids: list[str], current_user: User):
    active_model = ml_model_repo.get_active_model(db)
    if not active_model or not os.path.exists(active_model.file_path):
        raise HTTPException(status_code=500, detail="Sistem belum memiliki Model ML yang aktif/valid.")

    tenant = tenant_repo.get_tenant_by_id(db, current_user.tenant_id)
    threshold = getattr(tenant, 'risk_confidence_threshold', 0.75)

    try:
        model = joblib.load(active_model.file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memuat model ML: {str(e)}")

    successful_predictions = []
    skipped_students = []

    for student_id in student_ids:
        student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
        if not student:
            skipped_students.append({"student_id": student_id, "name": "Unknown", "reason": "Siswa tidak ditemukan."})
            continue

        se_data = socio_economic_repo.get_by_student(db, student_id, current_user.tenant_id)
        academic_data = academic_repo.get_by_student(db, student_id, current_user.tenant_id)
        attendance_data = attendance_repo.get_by_student(db, student_id, current_user.tenant_id)
        
        if not se_data or not academic_data or not attendance_data:
            skipped_students.append({
                "student_id": student_id, 
                "name": student.name, 
                "reason": "Data prasyarat (Sosio-Ekonomi, Akademik, Absensi) belum lengkap."
            })
            continue 

        latest_academic = sorted(academic_data, key=lambda x: x.semester, reverse=True)[0]
        latest_attendance = sorted(attendance_data, key=lambda x: x.semester, reverse=True)[0]
        
        raw_features = {
            "average_score": latest_academic.average_score or 0.0,
            "failed_subjects_count": latest_academic.failed_subjects_count or 0,
            "incomplete_assignments_count": latest_academic.incomplete_assignments_count or 0,
            "attendance_percentage": latest_attendance.attendance_percentage or 0.0,
            "present_count": latest_attendance.present_count or 0,
            "sick_count": latest_attendance.sick_count or 0,
            "excused_count": latest_attendance.excused_count or 0,
            "unexcused_count": latest_attendance.unexcused_count or 0,
            "parents_income": se_data.parents_income or 0,
            "monthly_expenses": se_data.monthly_expenses or 0,
            "parents_education_level": se_data.parents_education_level or "Unknown",
            "birth_order": se_data.birth_order or 1,
            "dependents_count": se_data.dependents_count or 0,
            "distance_to_school_km": se_data.distance_to_school_km or 0.0,
            "has_kip_scholarship": int(se_data.has_kip_scholarship) if se_data.has_kip_scholarship is not None else 0,
            "is_working_student": int(se_data.is_working_student) if se_data.is_working_student is not None else 0,
            "has_internet_access": int(se_data.has_internet_access) if se_data.has_internet_access is not None else 1,
            "housing_status": se_data.housing_status.value if se_data.housing_status else "Unknown",
            "gender": student.gender.value if student.gender else "Unknown"
        }

        df_features = pd.DataFrame([raw_features])

        try:
            if hasattr(model, "predict_proba"):
                risk_score = round(float(model.predict_proba(df_features)[0][1]), 2)
            else:
                risk_score = float(model.predict(df_features)[0])
                
            risk_status = RiskStatus.AT_RISK if risk_score >= threshold else RiskStatus.NOT_AT_RISK
            
            successful_predictions.append({
                "student_id": student.id,
                "model_id": active_model.id,
                "risk_score": risk_score,
                "risk_status": risk_status,
            })
        except Exception as e:
            skipped_students.append({"student_id": student.id, "name": student.name, "reason": f"Gagal diproses ML: {str(e)}"})

    if successful_predictions:
        risk_prediction_repo.bulk_save_predictions(db, successful_predictions, current_user.tenant_id)

    return {
        "status": "success",
        "message": f"Prediksi massal selesai. {len(successful_predictions)} berhasil, {len(skipped_students)} dilewati.",
        "data": {
            "total_processed": len(student_ids),
            "success_count": len(successful_predictions),
            "skipped_count": len(skipped_students),
            "skipped_details": skipped_students
        }
    }

def fetch_student_prediction_history(db: Session, student_id: str, current_user: User):
    if not student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id):
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan di sekolah Anda.")
    
    prediction = risk_prediction_repo.get_latest_prediction_by_student(db, student_id, current_user.tenant_id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Siswa ini belum pernah diprediksi risikonya.")
        
    return prediction

def fetch_student_prediction_history_all(db: Session, current_user: User):
    prediction = risk_prediction_repo.get_latest_prediction_by_tenant_all(db, current_user.tenant_id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Tidak ada data prediksi di sekolah anda, Silahkan melengkapi data siswa terlebih dahulu.")
    return prediction

def count_predicted_students(db: Session, current_user: User) -> int:
    if current_user.role == UserRole.SUPERADMIN:
        return risk_prediction_repo.count_predicted_students(db)
    return risk_prediction_repo.count_predicted_students(db, current_user.tenant_id)

def fetch_all_predictions(db: Session, current_user: User, risk_status: str = None):
    predictions = risk_prediction_repo.get_all_predictions(
        db=db, 
        tenant_id=current_user.tenant_id, 
        risk_status=risk_status
    )
    return predictions
