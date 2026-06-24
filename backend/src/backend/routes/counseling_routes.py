import os
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from src.backend.middlewares.auth import require_role
from src.backend.models.user import User
from src.backend.models.enums import UserRole

router = APIRouter(prefix="/api/v1/counseling", tags=["Counseling"])

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "..", "templates", "Template_Surat_Panggilan.docx")
TEMPLATE_PATH = os.path.normpath(TEMPLATE_PATH)

@router.get("/download-template")
def download_template(
    current_user: User = Depends(require_role([UserRole.COUNSELOR])),
):
    if not os.path.exists(TEMPLATE_PATH):
        return {"status": "error", "message": "Template surat tidak ditemukan."}
    return FileResponse(
        TEMPLATE_PATH,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="Template_Surat_Panggilan.docx",
    )
