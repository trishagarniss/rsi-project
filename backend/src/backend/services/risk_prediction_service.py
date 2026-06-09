from sqlalchemy.orm import Session
from fastapi import HTTPException
import random # HANYA UNTUK MOCK SEMENTARA

from src.backend.repositories import risk_prediction_repo, student_repo, ml_model_repo, tenant_repo
from src.backend.dto.risk_prediction_dto import RiskPredictionCreateDTO
from src.backend.models.user import User

def execute_prediction(db: Session, student_id: str, current_user: User):
    # 1. Pastikan siswa ada & milik sekolah ini
    student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")

    # 2. Ambil Model ML Global yang sedang aktif (buatan Superadmin)
    active_model = ml_model_repo.get_active_model(db)
    if not active_model:
        raise HTTPException(status_code=500, detail="Sistem belum memiliki Model ML yang aktif. Hubungi Superadmin.")

    # 3. Ambil Threshold Risiko khusus untuk sekolah ini
    tenant = tenant_repo.get_tenant_by_id(db, current_user.tenant_id)
    threshold = tenant.risk_confidence_threshold or 0.75 # Default fallback

    # =====================================================================
    # 4. TODO (ALVIAN): GANTI BAGIAN INI DENGAN INFERENSI ML ASLI (joblib/pickle)
    # Di sini Alvian bisa query data socio_economic & attendance, lalu di-feed ke model
    mock_risk_score = round(random.uniform(0.1, 0.95), 2) # Contoh: 0.82
    # =====================================================================

    # 5. Tentukan status berisiko berdasarkan threshold sekolah
    is_at_risk = mock_risk_score >= threshold

    # 6. Simpan ke database
    pred_data = RiskPredictionCreateDTO(
        student_id=student.id,
        ml_model_id=active_model.id,
        risk_score=mock_risk_score,
        is_at_risk=is_at_risk,
        factors_summary="Simulasi alasan dari ML" if is_at_risk else None
    )

    return risk_prediction_repo.save_prediction(db, pred_data.model_dump(), current_user.tenant_id)

def fetch_student_prediction_history(db: Session, student_id: str, current_user: User):
    # Validasi kepemilikan siswa
    if not student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id):
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    # Ambil prediksi terbaru
    return risk_prediction_repo.get_latest_prediction_by_student(db, student_id, current_user.tenant_id)