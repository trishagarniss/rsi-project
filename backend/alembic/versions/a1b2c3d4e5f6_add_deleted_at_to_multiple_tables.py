"""add deleted_at column for soft delete

Revision ID: a1b2c3d4e5f6
Revises: 9a1b2c3d4e5f
Create Date: 2026-06-16 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '9a1b2c3d4e5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('tenants', sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('socio_economics', sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('attendances', sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('academics', sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('ml_models', sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column('ml_models', 'deleted_at')
    op.drop_column('academics', 'deleted_at')
    op.drop_column('attendances', 'deleted_at')
    op.drop_column('socio_economics', 'deleted_at')
    op.drop_column('tenants', 'deleted_at')
