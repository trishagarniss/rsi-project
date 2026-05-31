from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.engine import get_db
from ..middlewares.auth import get_current_user
from ..models.user import User
from ..dto.report import StudentReportResponse, ClassReportResponse, ExportReportResponse
from ..services.report_service import get_student_report, get_class_report, get_export_report

async def student_report_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return await get_student_report(db, current_user.tenant_id, student_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def class_report_endpoint(
    class_name: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_class_report(db, current_user.tenant_id, class_name)

async def export_report_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_export_report(db, current_user.tenant_id)
