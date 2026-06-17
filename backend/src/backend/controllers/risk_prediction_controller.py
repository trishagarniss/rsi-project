from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import pandas as pd
from typing import List, Optional
from fastapi import HTTPException

from src.backend.services import risk_prediction_service
from src.backend.models.user import User
from src.backend.dto.risk_prediction_dto import RiskPredictionResponseDTO, RiskPredictionListDTO

# DTO Khusus untuk menerima list ID dari body JSON saat Bulk Predict (CSV)
class BulkPredictRequestDTO(BaseModel):
    student_ids: List[str]

def predict_single_student(db: Session, student_id: str, current_user: User):
    new_prediction = risk_prediction_service.execute_prediction(db, student_id, current_user)
    
    return {
        "status": "success",
        "message": "Prediksi risiko berhasil dilakukan.",
        "data": RiskPredictionResponseDTO.model_validate(new_prediction)
    }

def predict_bulk_students(db: Session, request_data: BulkPredictRequestDTO, current_user: User):
    result = risk_prediction_service.bulk_execute_prediction(db, request_data.student_ids, current_user)
    
    return result

def predict_all_students(db: Session, current_user: User):
    result = risk_prediction_service.predict_all_unpredicted_students(db, current_user)
    return result

def get_prediction_history(db: Session, student_id: str, current_user: User):
    prediction = risk_prediction_service.fetch_student_prediction_history(db, student_id, current_user)
    
    return {
        "status": "success",
        "data": RiskPredictionResponseDTO.model_validate(prediction)
    }
    
def get_prediction_history_all(db: Session, current_user: User):
    prediction = risk_prediction_service.fetch_student_prediction_history_all(db, current_user)
    return {
        "status": "success",
        "data": [RiskPredictionResponseDTO.model_validate(u) for u in prediction]
    }
    
def get_prediction_count(db: Session, current_user: User):
    count = risk_prediction_service.count_predicted_students(db, current_user)
    return {"status": "success", "count": count}

def get_all_predictions(db: Session, current_user: User, risk_status: Optional[int] = None):
    predictions = risk_prediction_service.fetch_all_predictions(db, current_user, risk_status)
    
    return {
        "status": "success",
        "data": [RiskPredictionListDTO.model_validate(p) for p in predictions]
    }
    
def upload_file(db : Session,  current_user: User, df : dict) :
    for i in {"name" : [] , "gender" : [], "address" : [], "date_of_birth" : [], "nis" : [], "nisn" : [], "parent_name" : [], "parent_phone" : [], "semester" : [], "academic_year" : [], "present_count" : [],
        "sick_count" : [], "excused_count" : [], "unexcused_count" : [], "attendance_percentage" : [], "average_score" : [], "failed_subjects_count": [], "incomplete_assignments_count" : [], 
        "parents_income" : [], "monthly_expenses" : [], "parents_education_level" : [], "birth_order" : [], "dependents_count" : [], "has_kip_scholarship" : [], "is_working_student" : [], 
        "has_internet_access" : [], "distance_to_school_km" : [], "housing_status" : [], "transportation_mode" : []
    } :
        if i not in df :
            raise HTTPException(status_code=400, detail="Kolom data tidak lengkap!")
    risk_prediction_service.upload_file(db,current_user.tenant_id, df)
    
    return {
        "status": "success",
        "message": "Data berhasil masuk!"
    }
