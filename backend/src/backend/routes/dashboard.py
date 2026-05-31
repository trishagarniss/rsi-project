from fastapi import APIRouter
from ..controllers.dashboard_controller import (
    stats_endpoint, risk_by_class_endpoint, recent_activity_endpoint,
)
from ..dto.dashboard import StatsResponse, RiskByClassResponse, RecentActivityResponse

router = APIRouter()

router.add_api_route("/stats", endpoint=stats_endpoint, methods=["GET"], response_model=StatsResponse)
router.add_api_route("/risk-by-class", endpoint=risk_by_class_endpoint, methods=["GET"], response_model=RiskByClassResponse)
router.add_api_route("/recent-activity", endpoint=recent_activity_endpoint, methods=["GET"], response_model=RecentActivityResponse)
