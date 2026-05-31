from fastapi import APIRouter
from ..controllers.reports_controller import (
    student_report_endpoint, class_report_endpoint, export_report_endpoint,
)
from ..dto.report import StudentReportResponse, ClassReportResponse, ExportReportResponse

router = APIRouter()

router.add_api_route("/student/{student_id}", endpoint=student_report_endpoint, methods=["GET"], response_model=StudentReportResponse)
router.add_api_route("/class/{class_name}", endpoint=class_report_endpoint, methods=["GET"], response_model=ClassReportResponse)
router.add_api_route("/export", endpoint=export_report_endpoint, methods=["GET"], response_model=ExportReportResponse)
