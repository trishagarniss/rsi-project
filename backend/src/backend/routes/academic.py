from fastapi import APIRouter, status
from ..controllers.academic_controller import (
    create_academic_endpoint, list_academics_endpoint,
    get_academic_endpoint, update_academic_endpoint, delete_academic_endpoint,
)
from ..dto.academic import AcademicResponse

router = APIRouter()

router.add_api_route("/", endpoint=create_academic_endpoint, methods=["POST"], response_model=AcademicResponse, status_code=status.HTTP_201_CREATED)
router.add_api_route("/", endpoint=list_academics_endpoint, methods=["GET"], response_model=list[AcademicResponse])
router.add_api_route("/{academic_id}", endpoint=get_academic_endpoint, methods=["GET"], response_model=AcademicResponse)
router.add_api_route("/{academic_id}", endpoint=update_academic_endpoint, methods=["PUT"], response_model=AcademicResponse)
router.add_api_route("/{academic_id}", endpoint=delete_academic_endpoint, methods=["DELETE"], status_code=status.HTTP_204_NO_CONTENT)
