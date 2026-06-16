"""drop_features_snapshot

Revision ID: ed0be41229dc
Revises: 5e68a6c1d8fd
Create Date: 2026-06-14 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ed0be41229dc'
down_revision: Union[str, Sequence[str], None] = '5e68a6c1d8fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('risk_prediction_logs', 'features_snapshot')


def downgrade() -> None:
    op.add_column('risk_prediction_logs',
        sa.Column('features_snapshot', postgresql.JSONB(astext_type=sa.Text()), nullable=False)
    )
