from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ...core.database import get_db
from ...core.security import get_current_user, require_role
from ...models.user import User
from ...schemas.student import (
    StudentCreate, StudentUpdate, StudentResponse, StudentListResponse, BulkImportResult,
)
from ...services.student_service import (
    create_student, get_student, get_students,
    update_student, soft_delete_student, bulk_create_students,
)

router = APIRouter()

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student_endpoint(
    data: StudentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    try:
        student = await create_student(db, current_user.tenant_id, data)
        return student
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.post("/bulk", response_model=BulkImportResult)
async def bulk_create_students_endpoint(
    data: list[StudentCreate],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    return await bulk_create_students(db, current_user.tenant_id, data)

@router.get("/", response_model=StudentListResponse)
async def list_students_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    class_name: Optional[str] = Query(None),
):
    skip = (page - 1) * limit
    students, total = await get_students(
        db, current_user.tenant_id,
        skip=skip, limit=limit,
        search=search, class_name=class_name,
    )
    return StudentListResponse(items=students, total=total, page=page, limit=limit)

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = await get_student(db, current_user.tenant_id, student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")
    return student

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student_endpoint(
    student_id: int,
    data: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    try:
        student = await update_student(db, current_user.tenant_id, student_id, data)
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")
        return student
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{student_id}", response_model=StudentResponse)
async def delete_student_endpoint(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    student = await soft_delete_student(db, current_user.tenant_id, student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")
    return student
