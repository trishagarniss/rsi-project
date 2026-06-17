from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException,Query
from sqlalchemy.orm import Session
import io
import pandas as pd
from src.backend.database.engine import get_db
from src.backend.controllers import risk_prediction_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/predictions", tags=["Risk Prediction"])

@router.post("/student/{student_id}", status_code=status.HTTP_201_CREATED)
def trigger_student_prediction(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.predict_single_student(db, student_id, current_user)

@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def trigger_bulk_prediction(
    request_data: risk_prediction_controller.BulkPredictRequestDTO,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.predict_bulk_students(db, request_data, current_user)

@router.post("/all", status_code=status.HTTP_201_CREATED)
def trigger_all_unpredicted_prediction(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.predict_all_students(db, current_user)

@router.get("/student/{student_id}")
def get_student_latest_prediction(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.get_prediction_history(db, student_id, current_user)

@router.get("/student/all")
def get_student_latest_prediction(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR]))
):
    return risk_prediction_controller.get_prediction_history_all(db, current_user)

@router.get("/count")
def get_prediction_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR])),
):
    return risk_prediction_controller.get_prediction_count(db, current_user)

@router.get("/")
def get_all_student_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR])),
    risk_status: int = Query(None)
):
    return risk_prediction_controller.get_all_predictions(db, current_user, risk_status)

@router.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...),db: Session = Depends(get_db),current_user: User = Depends(require_role([UserRole.ADMIN]))):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File harus berformat CSV!")
    
    try:
        contents = await file.read()
        data = io.BytesIO(contents)
        df = pd.read_csv(data)
        df.to_dict(orient="list")
        return risk_prediction_controller.upload_file(db,current_user,df)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses file: {str(e)}")