from fastapi import APIRouter, status
from ..controllers.student_controller import (
    create_student_endpoint, bulk_create_students_endpoint,
    list_students_endpoint, get_student_endpoint,
    update_student_endpoint, delete_student_endpoint,
)
from ..dto.student import StudentResponse, BulkImportResult, StudentListResponse

router = APIRouter()

router.add_api_route("/", endpoint=create_student_endpoint, methods=["POST"], response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
router.add_api_route("/bulk", endpoint=bulk_create_students_endpoint, methods=["POST"], response_model=BulkImportResult)
router.add_api_route("/", endpoint=list_students_endpoint, methods=["GET"], response_model=StudentListResponse)
router.add_api_route("/{student_id}", endpoint=get_student_endpoint, methods=["GET"], response_model=StudentResponse)
router.add_api_route("/{student_id}", endpoint=update_student_endpoint, methods=["PUT"], response_model=StudentResponse)
router.add_api_route("/{student_id}", endpoint=delete_student_endpoint, methods=["DELETE"], response_model=StudentResponse)
