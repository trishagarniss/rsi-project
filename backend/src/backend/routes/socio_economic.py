from fastapi import APIRouter, status
from ..controllers.socio_economic_controller import (
    create_socio_economic_endpoint, get_by_student_endpoint,
    get_socio_economic_endpoint, update_socio_economic_endpoint,
    delete_socio_economic_endpoint,
)
from ..dto.socio_economic import SocioEconomicResponse

router = APIRouter()

router.add_api_route("/", endpoint=create_socio_economic_endpoint, methods=["POST"], response_model=SocioEconomicResponse, status_code=status.HTTP_201_CREATED)
router.add_api_route("/by-student/{student_id}", endpoint=get_by_student_endpoint, methods=["GET"], response_model=SocioEconomicResponse)
router.add_api_route("/{id}", endpoint=get_socio_economic_endpoint, methods=["GET"], response_model=SocioEconomicResponse)
router.add_api_route("/{id}", endpoint=update_socio_economic_endpoint, methods=["PUT"], response_model=SocioEconomicResponse)
router.add_api_route("/{id}", endpoint=delete_socio_economic_endpoint, methods=["DELETE"], status_code=status.HTTP_204_NO_CONTENT)
