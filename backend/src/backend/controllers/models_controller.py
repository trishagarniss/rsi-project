from fastapi import Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import os

from ..database.engine import get_db
from ..middlewares.auth import get_current_user, require_role
from ..models.user import User
from ..dto.ml_model import MlModelResponse, MlModelListResponse, MlModelUploadResponse
from ..repositories.ml_model_repository import (
    create_model, find_active_model, find_model_by_id, find_models,
    deactivate_all_models, update_model_fields, delete_model_record,
)
from ..services.ml_service import save_model_file, delete_model_file
from ..services.audit_service import log_action


async def upload_model(
    version: str = Form(...),
    algorithm: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    if not file.filename or not file.filename.endswith(".pkl"):
        raise HTTPException(status_code=400, detail="File harus berformat .pkl")

    content = await file.read()

    active = await find_active_model(db)

    file_path = save_model_file(content, version)

    model_data = {
        "version": version,
        "algorithm": algorithm,
        "file_path": file_path,
        "is_active": active is None,
        "uploaded_by": current_user.id,
    }
    model = await create_model(db, model_data)
    await db.commit()

    await log_action(
        db, current_user.tenant_id, current_user.id,
        "create", "ml_model", model.id,
        f"Upload model: {version} ({algorithm}), active={model.is_active}",
    )

    return MlModelUploadResponse(
        id=model.id,
        version=model.version,
        algorithm=model.algorithm,
        is_active=model.is_active,
        message="Model berhasil diupload",
    )


async def list_models(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "konselor"])),
):
    models_list, total = await find_models(db, skip, limit)
    return MlModelListResponse(
        items=[MlModelResponse.model_validate(m) for m in models_list],
        total=total,
    )


async def get_active_model_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin", "admin", "konselor"])),
):
    model = await find_active_model(db)
    if not model:
        return None
    return MlModelResponse.model_validate(model)


async def activate_model(
    model_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    model = await find_model_by_id(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model tidak ditemukan")

    await deactivate_all_models(db)
    model = await update_model_fields(db, model, {"is_active": True})
    await db.commit()

    await log_action(
        db, current_user.tenant_id, current_user.id,
        "update", "ml_model", model.id,
        f"Aktifkan model: {model.version} ({model.algorithm})",
    )

    return MlModelResponse.model_validate(model)


async def deactivate_model(
    model_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    model = await find_model_by_id(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model tidak ditemukan")
    if not model.is_active:
        raise HTTPException(status_code=400, detail="Model sudah tidak aktif")

    model = await update_model_fields(db, model, {"is_active": False})
    await db.commit()

    await log_action(
        db, current_user.tenant_id, current_user.id,
        "update", "ml_model", model.id,
        f"Nonaktifkan model: {model.version} ({model.algorithm})",
    )

    return MlModelResponse.model_validate(model)


async def update_model(
    model_id: int,
    version: Optional[str] = Form(None),
    algorithm: Optional[str] = Form(None),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    model = await find_model_by_id(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model tidak ditemukan")

    update_data = {}
    if version:
        update_data["version"] = version
    if algorithm:
        update_data["algorithm"] = algorithm
    if file and file.filename and file.filename.endswith(".pkl"):
        content = await file.read()
        new_path = save_model_file(content, version or model.version)
        if os.path.exists(model.file_path):
            delete_model_file(model.file_path)
        update_data["file_path"] = new_path

    if not update_data:
        raise HTTPException(status_code=400, detail="Tidak ada data yang diupdate")

    model = await update_model_fields(db, model, update_data)
    await db.commit()

    await log_action(
        db, current_user.tenant_id, current_user.id,
        "update", "ml_model", model.id,
        f"Update model: {model.version} ({model.algorithm})",
    )

    return MlModelResponse.model_validate(model)


async def delete_model(
    model_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    model = await find_model_by_id(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model tidak ditemukan")

    if os.path.exists(model.file_path):
        delete_model_file(model.file_path)

    await delete_model_record(db, model)
    await db.commit()

    await log_action(
        db, current_user.tenant_id, current_user.id,
        "delete", "ml_model", model_id,
        f"Hapus model: {model.version} ({model.algorithm})",
    )

    return {"message": "Model berhasil dihapus"}
