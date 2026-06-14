from fastapi import APIRouter
from src.backend.dto.contact_dto import ContactRequest
from src.backend.services.contact_service import process_contact

router = APIRouter(prefix="/api/v1/contact", tags=["Contact"])

@router.post("/")
def submit_contact(data: ContactRequest):
    process_contact(data.name, data.email, data.subject, data.message)
    return {
        "status": "success",
        "message": "Pesan berhasil dikirim. Kami akan segera merespons via Email."
    }
