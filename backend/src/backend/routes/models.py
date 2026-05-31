from fastapi import APIRouter, status
from ..controllers.models_controller import (
    upload_model, list_models, get_active_model_endpoint,
    activate_model, deactivate_model, update_model, delete_model,
)
from ..dto.ml_model import MlModelUploadResponse, MlModelListResponse, MlModelResponse

router = APIRouter()

router.add_api_route("/upload", endpoint=upload_model, methods=["POST"], response_model=MlModelUploadResponse, status_code=status.HTTP_201_CREATED)
router.add_api_route("/", endpoint=list_models, methods=["GET"], response_model=MlModelListResponse)
router.add_api_route("/active", endpoint=get_active_model_endpoint, methods=["GET"], response_model=MlModelResponse | None)
router.add_api_route("/{model_id}/activate", endpoint=activate_model, methods=["PUT"], response_model=MlModelResponse)
router.add_api_route("/{model_id}/deactivate", endpoint=deactivate_model, methods=["PUT"], response_model=MlModelResponse)
router.add_api_route("/{model_id}", endpoint=update_model, methods=["PUT"], response_model=MlModelResponse)
router.add_api_route("/{model_id}", endpoint=delete_model, methods=["DELETE"])
