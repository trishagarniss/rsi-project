from fastapi import APIRouter, status
from ..controllers.counseling_controller import (
    create_intervention_endpoint, list_interventions_endpoint,
    get_intervention_endpoint, update_intervention_endpoint, delete_intervention_endpoint,
)
from ..dto.intervention import InterventionResponse

router = APIRouter()

router.add_api_route("/", endpoint=create_intervention_endpoint, methods=["POST"], response_model=InterventionResponse, status_code=status.HTTP_201_CREATED)
router.add_api_route("/", endpoint=list_interventions_endpoint, methods=["GET"], response_model=list[InterventionResponse])
router.add_api_route("/{intervention_id}", endpoint=get_intervention_endpoint, methods=["GET"], response_model=InterventionResponse)
router.add_api_route("/{intervention_id}", endpoint=update_intervention_endpoint, methods=["PUT"], response_model=InterventionResponse)
router.add_api_route("/{intervention_id}", endpoint=delete_intervention_endpoint, methods=["DELETE"], status_code=status.HTTP_204_NO_CONTENT)
