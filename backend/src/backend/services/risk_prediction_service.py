import os
import numpy as np
import pandas as pd
import joblib
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from src.backend.repositories import (
    risk_prediction_repo,
    student_repo,
    ml_model_repo,
    tenant_repo,
    socio_economic_repo,
    academic_repo,
    attendance_repo,
)
from src.backend.dto.risk_prediction_dto import RiskPredictionCreateDTO
from src.backend.models.user import User
from src.backend.models.enums import UserRole

FEATURE_COLUMNS = [
    "avg_score", "min_score", "max_score", "std_score",
    "total_failed", "total_incomplete", "semester_count", "last_score",
    "failed_rate", "incomplete_rate", "score_trend", "avg_attendance",
    "total_unexcused", "total_sick", "total_excused", "attendance_trend",
    "parents_income", "monthly_expenses", "birth_order", "dependents_count",
    "has_kip_scholarship", "is_working_student", "has_internet_access",
    "distance_to_school_km", "expense_ratio", "is_firstborn", "age",
    "gender_male", "edu_level",
    "housing_status_other", "housing_status_owned", "housing_status_rented",
    "housing_status_with_relatives",
    "transportation_mode_bus", "transportation_mode_car",
    "transportation_mode_motorcycle", "transportation_mode_walk",
]

EDU_MAP = {
    "elementary school": 0,
    "junior high school": 1,
    "senior high school": 2,
    "bachelor": 3,
    "master": 4,
}

HOUSING_CATEGORIES = ["orphanage", "other", "owned", "rented", "with_relatives"]
TRANSPORT_CATEGORIES = ["bicycle", "bus", "car", "motorcycle", "walk"]


def _build_feature_vector(academic_data, attendance_data, se_data, student):
    ac_rows = sorted(academic_data, key=lambda x: x.semester)
    at_rows = sorted(attendance_data, key=lambda x: x.semester)

    ac_semesters = np.array([r.semester for r in ac_rows], dtype=float)
    ac_scores = np.array([r.average_score or 0.0 for r in ac_rows], dtype=float)

    at_semesters = np.array([r.semester for r in at_rows], dtype=float)
    at_pcts = np.array([r.attendance_percentage or 0.0 for r in at_rows], dtype=float)

    n_ac = len(ac_rows)
    n_at = len(at_rows)

    avg_score = float(np.mean(ac_scores)) if n_ac > 0 else 0.0
    min_score = float(np.min(ac_scores)) if n_ac > 0 else 0.0
    max_score = float(np.max(ac_scores)) if n_ac > 0 else 0.0
    std_score = float(np.std(ac_scores)) if n_ac > 1 else 0.0
    total_failed = float(sum(r.failed_subjects_count or 0 for r in ac_rows))
    total_incomplete = float(sum(r.incomplete_assignments_count or 0 for r in ac_rows))
    semester_count = float(n_ac)
    last_score = float(ac_scores[-1]) if n_ac > 0 else 0.0
    failed_rate = total_failed / semester_count if semester_count > 0 else 0.0
    incomplete_rate = total_incomplete / semester_count if semester_count > 0 else 0.0
    score_trend = float(np.polyfit(ac_semesters, ac_scores, 1)[0]) if n_ac >= 2 else 0.0

    avg_attendance = float(np.mean(at_pcts)) if n_at > 0 else 0.0
    total_unexcused = float(sum(r.unexcused_count or 0 for r in at_rows))
    total_sick = float(sum(r.sick_count or 0 for r in at_rows))
    total_excused = float(sum(r.excused_count or 0 for r in at_rows))
    attendance_trend = float(np.polyfit(at_semesters, at_pcts, 1)[0]) if n_at >= 2 else 0.0

    parents_income = float(se_data.parents_income or 0)
    monthly_expenses = float(se_data.monthly_expenses or 0)
    birth_order = float(se_data.birth_order or 1)
    dependents_count = float(se_data.dependents_count or 0)
    has_kip = float(int(se_data.has_kip_scholarship) if se_data.has_kip_scholarship is not None else 0)
    is_working = float(int(se_data.is_working_student) if se_data.is_working_student is not None else 0)
    has_internet = float(int(se_data.has_internet_access) if se_data.has_internet_access is not None else 1)
    distance = float(se_data.distance_to_school_km or 0.0)

    expense_ratio = monthly_expenses / (parents_income + 1)
    is_firstborn = 1.0 if birth_order == 1.0 else 0.0

    dob = student.date_of_birth
    age = float(2020 - dob.year) if dob else 15.0

    gender_male = 1.0 if student.gender and student.gender.value == "male" else 0.0

    edu_raw = se_data.parents_education_level or ""
    edu_level = float(EDU_MAP.get(edu_raw.lower(), 0))

    housing_raw = se_data.housing_status.value if se_data.housing_status else "orphanage"
    transport_raw = se_data.transportation_mode or "bicycle"

    housing_onehot = {
        f"housing_status_{cat}": 1.0 if housing_raw == cat else 0.0
        for cat in HOUSING_CATEGORIES[1:]
    }
    transport_onehot = {
        f"transportation_mode_{cat}": 1.0 if transport_raw == cat else 0.0
        for cat in TRANSPORT_CATEGORIES[1:]
    }

    raw = {
        "avg_score": avg_score,
        "min_score": min_score,
        "max_score": max_score,
        "std_score": std_score,
        "total_failed": total_failed,
        "total_incomplete": total_incomplete,
        "semester_count": semester_count,
        "last_score": last_score,
        "failed_rate": failed_rate,
        "incomplete_rate": incomplete_rate,
        "score_trend": score_trend,
        "avg_attendance": avg_attendance,
        "total_unexcused": total_unexcused,
        "total_sick": total_sick,
        "total_excused": total_excused,
        "attendance_trend": attendance_trend,
        "parents_income": parents_income,
        "monthly_expenses": monthly_expenses,
        "birth_order": birth_order,
        "dependents_count": dependents_count,
        "has_kip_scholarship": has_kip,
        "is_working_student": is_working,
        "has_internet_access": has_internet,
        "distance_to_school_km": distance,
        "expense_ratio": expense_ratio,
        "is_firstborn": is_firstborn,
        "age": age,
        "gender_male": gender_male,
        "edu_level": edu_level,
        **housing_onehot,
        **transport_onehot,
    }

    return [raw[col] for col in FEATURE_COLUMNS]

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
            detail="Data siswa belum lengkap. Pastikan profil Sosio-Ekonomi, Akademik, dan Absensi sudah diisi."
        )

    active_model = ml_model_repo.get_active_model(db)
    if not active_model:
        raise HTTPException(
            status_code=500,
            detail="Sistem belum memiliki Model ML yang aktif. Silakan hubungi Superadmin."
        )

    tenant = tenant_repo.get_tenant_by_id(db, current_user.tenant_id)
    threshold = getattr(tenant, "risk_confidence_threshold", 0.75)

    feature_values = _build_feature_vector(academic_data, attendance_data, se_data, student)
    df_features = pd.DataFrame([feature_values], columns=FEATURE_COLUMNS)

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

    risk_status = 1 if risk_score >= threshold else 0

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
    threshold = getattr(tenant, "risk_confidence_threshold", 0.75)

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
                "reason": "Data prasyarat (Sosio-Ekonomi, Akademik, Absensi) belum lengkap.",
            })
            continue

        try:
            feature_values = _build_feature_vector(academic_data, attendance_data, se_data, student)
            df_features = pd.DataFrame([feature_values], columns=FEATURE_COLUMNS)

            if hasattr(model, "predict_proba"):
                risk_score = round(float(model.predict_proba(df_features)[0][1]), 2)
            else:
                risk_score = float(model.predict(df_features)[0])

            risk_status = 1 if risk_score >= threshold else 0

            successful_predictions.append({
                "student_id": student.id,
                "model_id": active_model.id,
                "risk_score": risk_score,
                "risk_status": risk_status,
            })
        except Exception as e:
            skipped_students.append({
                "student_id": student.id,
                "name": student.name,
                "reason": f"Gagal diproses ML: {str(e)}",
            })

    if successful_predictions:
        risk_prediction_repo.bulk_save_predictions(db, successful_predictions, current_user.tenant_id)

    return {
        "status": "success",
        "message": f"Prediksi massal selesai. {len(successful_predictions)} berhasil, {len(skipped_students)} dilewati.",
        "data": {
            "total_processed": len(student_ids),
            "success_count": len(successful_predictions),
            "skipped_count": len(skipped_students),
            "skipped_details": skipped_students,
        },
    }


def predict_all_unpredicted_students(db: Session, current_user: User):
    all_students = student_repo.get_all_active_students_by_tenant(db, current_user.tenant_id)
    predicted_ids = risk_prediction_repo.get_predicted_student_ids(db, current_user.tenant_id)

    unpredicted_ids = [s.id for s in all_students if s.id not in predicted_ids]

    if not unpredicted_ids:
        return {
            "status": "success",
            "message": "Semua siswa sudah memiliki prediksi risiko.",
            "data": {
                "total_processed": 0,
                "success_count": 0,
                "skipped_count": 0,
                "skipped_details": [],
            },
        }

    result = bulk_execute_prediction(db, unpredicted_ids, current_user)

    total_processed = result["data"]["total_processed"]
    success_count = result["data"]["success_count"]
    skipped_count = result["data"]["skipped_count"]

    if total_processed == 0:
        result["message"] = "Tidak ada data siswa baru yang dapat diprediksi. Pastikan data Akademik, Absensi, dan Sosio-Ekonomi sudah lengkap."

    return result


def auto_predict_on_data_change(db: Session, student_id: str, current_user: User):
    try:
        active_model = ml_model_repo.get_active_model(db)
        if not active_model or not os.path.exists(active_model.file_path):
            return

        student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
        if not student:
            return

        se_data = socio_economic_repo.get_by_student(db, student_id, current_user.tenant_id)
        academic_data = academic_repo.get_by_student(db, student_id, current_user.tenant_id)
        attendance_data = attendance_repo.get_by_student(db, student_id, current_user.tenant_id)

        if not se_data or not academic_data or not attendance_data:
            return

        tenant = tenant_repo.get_tenant_by_id(db, current_user.tenant_id)
        threshold = getattr(tenant, "risk_confidence_threshold", 0.75)

        model = joblib.load(active_model.file_path)
        feature_values = _build_feature_vector(academic_data, attendance_data, se_data, student)
        df_features = pd.DataFrame([feature_values], columns=FEATURE_COLUMNS)

        if hasattr(model, "predict_proba"):
            risk_score = round(float(model.predict_proba(df_features)[0][1]), 2)
        else:
            risk_score = float(model.predict(df_features)[0])

        risk_status = 1 if risk_score >= threshold else 0

        pred_data = RiskPredictionCreateDTO(
            student_id=student.id,
            model_id=active_model.id,
            risk_score=risk_score,
            risk_status=risk_status,
        )

        risk_prediction_repo.replace_prediction(db, pred_data.model_dump(), current_user.tenant_id)
    except Exception:
        pass


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

def fetch_all_predictions(db: Session, current_user: User, risk_status: int | None = None):
    predictions = risk_prediction_repo.get_all_predictions(
        db=db,
        tenant_id=current_user.tenant_id,
        risk_status=risk_status,
    )
    return predictions
