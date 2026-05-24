from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...schemas.report import StudentReportResponse, ClassReportResponse, ExportReportResponse
from ...services.report_service import get_student_report, get_class_report, get_export_report

router = APIRouter()

@router.get("/student/{student_id}", response_model=StudentReportResponse)
async def student_report_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return await get_student_report(db, current_user.tenant_id, student_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/class/{class_name}", response_model=ClassReportResponse)
async def class_report_endpoint(
    class_name: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_class_report(db, current_user.tenant_id, class_name)

@router.get("/export", response_model=ExportReportResponse)
async def export_report_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_export_report(db, current_user.tenant_id)
