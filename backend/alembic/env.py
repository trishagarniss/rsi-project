import os
import sys
from logging.config import fileConfig
from sqlalchemy import pool
from alembic import context
from dotenv import load_dotenv

# 1. Memastikan Python bisa membaca folder src/ dan file .env
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
load_dotenv()

# 2. Import Engine dan Base milik ASGARD
from src.backend.database.engine import engine, Base

# 3. WAJIB Import semua model agar terdeteksi oleh Alembic
from src.backend.models import (
    tenant, user, student, academic, attendance, 
    socio_economic, ml_model, risk_prediction, audit_log, notification
)

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 4. Targetkan ke metadata model kita
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    context.configure(
        url=str(engine.url),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine
    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()