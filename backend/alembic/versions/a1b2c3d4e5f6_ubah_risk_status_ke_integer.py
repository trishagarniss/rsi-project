"""ubah risk_status dari enum ke integer

Revision ID: a1b2c3d4e5f6
Revises: 9a1b2c3d4e5f
Create Date: 2026-06-16 00:00:00.000000
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "9a1b2c3d4e5f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tambah kolom integer sementara
    op.add_column(
        "risk_prediction_logs",
        sa.Column("risk_status_int", sa.Integer(), nullable=True),
    )

    # Konversi data: AT_RISK → 1, NOT_AT_RISK → 0, lainnya → 0
    op.execute(
        """
        UPDATE risk_prediction_logs
        SET risk_status_int = CASE
            WHEN risk_status = 'AT_RISK' THEN 1
            ELSE 0
        END
        """
    )

    # Set NOT NULL
    op.alter_column("risk_prediction_logs", "risk_status_int", nullable=False)

    # Hapus kolom enum lama
    op.drop_column("risk_prediction_logs", "risk_status")

    # Rename kolom baru
    op.alter_column("risk_prediction_logs", "risk_status_int", new_column_name="risk_status")

    # Hapus tipe enum
    op.execute("DROP TYPE IF EXISTS riskstatus")


def downgrade() -> None:
    # Buat ulang tipe enum
    op.execute("CREATE TYPE riskstatus AS ENUM ('AT_RISK', 'NOT_AT_RISK')")

    # Tambah kolom enum sementara
    op.add_column(
        "risk_prediction_logs",
        sa.Column(
            "risk_status_enum",
            sa.Enum("AT_RISK", "NOT_AT_RISK", name="riskstatus"),
            nullable=True,
        ),
    )

    # Konversi data: 1 → AT_RISK, 0 → NOT_AT_RISK
    op.execute(
        """
        UPDATE risk_prediction_logs
        SET risk_status_enum = CASE
            WHEN risk_status = 1 THEN 'AT_RISK'
            ELSE 'NOT_AT_RISK'
        END
        """
    )

    # Set NOT NULL
    op.alter_column("risk_prediction_logs", "risk_status_enum", nullable=False)

    # Hapus kolom integer lama
    op.drop_column("risk_prediction_logs", "risk_status")

    # Rename kolom enum
    op.alter_column("risk_prediction_logs", "risk_status_enum", new_column_name="risk_status")
