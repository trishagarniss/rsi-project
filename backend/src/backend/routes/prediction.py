from fastapi import APIRouter
from typing import Optional
from ..controllers.prediction_controller import (
    predict_student_endpoint, list_predictions_endpoint,
    latest_prediction_endpoint, risk_summary_endpoint, top_risk_endpoint,
)
from ..dto.prediction import PredictionResult, PredictionResponse, RiskSummaryResponse

router = APIRouter()

router.add_api_route("/student/{student_id}", endpoint=predict_student_endpoint, methods=["POST"], response_model=PredictionResult)
router.add_api_route("/student/{student_id}", endpoint=list_predictions_endpoint, methods=["GET"], response_model=list[PredictionResponse])
router.add_api_route("/student/{student_id}/latest", endpoint=latest_prediction_endpoint, methods=["GET"], response_model=Optional[PredictionResponse])
router.add_api_route("/risk-summary", endpoint=risk_summary_endpoint, methods=["GET"], response_model=RiskSummaryResponse)
router.add_api_route("/top-risk", endpoint=top_risk_endpoint, methods=["GET"])
