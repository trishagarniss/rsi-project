"""Application settings loaded from environment variables."""

from __future__ import annotations

import os
from pathlib import Path


def _load_dotenv_if_present() -> None:
    """Load key=value pairs from project-root `.env` if the file exists."""
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.is_file():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip("\"'")
        if key and key not in os.environ:
            os.environ[key] = value


_load_dotenv_if_present()


class Settings:
    PROJECT_NAME: str = os.environ.get("PROJECT_NAME", "ASGARD")
    API_V1_PREFIX: str = os.environ.get("API_V1_PREFIX", "/api/v1")
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL",
        "postgresql+psycopg2://asgard:asgard@localhost:5432/asgard_db",
    )


settings = Settings()
