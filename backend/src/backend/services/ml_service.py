import os
import json
import joblib
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from ..models.risk_prediction import RiskPrediction, RiskLevel
from ..models.ml_model import MlModel
from ..repositories.ml_model_repository import find_active_model

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "storage", "models")


async def get_active_model(db: AsyncSession) -> Optional[MlModel]:
    return await find_active_model(db)


def save_model_file(file_bytes: bytes, version: str) -> str:
    filename = f"model_{version}.pkl"
    filepath = os.path.join(STORAGE_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(file_bytes)
    return filepath


def load_model(file_path: str):
    return joblib.load(file_path)


def delete_model_file(file_path: str) -> None:
    if os.path.exists(file_path):
        os.remove(file_path)


def extract_features(student_data: dict) -> list:
    return [
        student_data.get("rata_rata_nilai", 0) or 0,
        student_data.get("jumlah_mapel_tidak_tuntas", 0) or 0,
        student_data.get("persentase_kehadiran", 0) or 0,
        student_data.get("alpha", 0) or 0,
        student_data.get("penghasilan_ortu", 0) or 0,
        student_data.get("jarak_rumah_sekolah", 0) or 0,
        1 if student_data.get("penerima_kip") else 0,
    ]


def predict_with_model(model, features: list) -> tuple[float, RiskLevel]:
    import numpy as np
    X = np.array([features])
    try:
        pred = model.predict(X)
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(X)
            confidence = float(np.max(proba[0])) if proba is not None else 0
        else:
            confidence = 0

        score = float(pred[0])
        score = max(0, min(100, score))

        if score >= 65:
            level = RiskLevel.TINGGI
        elif score >= 35:
            level = RiskLevel.SEDANG
        else:
            level = RiskLevel.RENDAH

        return score, level
    except Exception:
        return 0, RiskLevel.RENDAH
