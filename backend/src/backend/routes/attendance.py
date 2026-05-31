from fastapi import APIRouter, status
from ..controllers.attendance_controller import (
    create_attendance_endpoint, list_attendances_endpoint,
    get_attendance_endpoint, update_attendance_endpoint, delete_attendance_endpoint,
)
from ..dto.attendance import AttendanceResponse

router = APIRouter()

router.add_api_route("/", endpoint=create_attendance_endpoint, methods=["POST"], response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
router.add_api_route("/", endpoint=list_attendances_endpoint, methods=["GET"], response_model=list[AttendanceResponse])
router.add_api_route("/{attendance_id}", endpoint=get_attendance_endpoint, methods=["GET"], response_model=AttendanceResponse)
router.add_api_route("/{attendance_id}", endpoint=update_attendance_endpoint, methods=["PUT"], response_model=AttendanceResponse)
router.add_api_route("/{attendance_id}", endpoint=delete_attendance_endpoint, methods=["DELETE"], status_code=status.HTTP_204_NO_CONTENT)
