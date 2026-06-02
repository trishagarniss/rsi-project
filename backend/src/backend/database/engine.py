import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Mengambil URL Database dari environment variables
# Jika gagal, akan jatuh ke nilai default untuk keperluan testing lokal
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://asgard_admin:asgard_rahasia_123@localhost:5432/asgard_db"
)

# Membuat engine SQLAlchemy
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True
)

# Membuat pabrik sesi database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class yang akan diwarisi oleh seluruh tabel (Models)
Base = declarative_base()

# Fungsi dependency injection untuk digunakan di routes/controllers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()