from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

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

def get_prediction_history(db: Session, student_id: str, current_user: User):
    prediction = risk_prediction_service.fetch_student_prediction_history(db, student_id, current_user)
    
    return {
        "status": "success",
        "data": RiskPredictionResponseDTO.model_validate(prediction)
    }
    
def get_all_predictions(db: Session, current_user: User, risk_status: str = None):
    predictions = risk_prediction_service.fetch_all_predictions(db, current_user, risk_status)
    
    return {
        "status": "success",
        "data": [RiskPredictionListDTO.model_validate(p) for p in predictions]
    }