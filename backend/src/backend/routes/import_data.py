from fastapi import APIRouter
from ..controllers.import_data_controller import download_template, upload_csv
from ..dto.import_schema import ImportResult

router = APIRouter()

router.add_api_route("/template", endpoint=download_template, methods=["GET"])
router.add_api_route("/upload", endpoint=upload_csv, methods=["POST"], response_model=ImportResult)
