"""add entity_name_entity_id_to_audit_logs_and_notifications

Revision ID: 9a1b2c3d4e5f
Revises: ed0be41229dc
Create Date: 2026-06-16 09:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = '9a1b2c3d4e5f'
down_revision: Union[str, Sequence[str], None] = 'ed0be41229dc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add entity_name and entity_id to audit_logs
    op.add_column('audit_logs', sa.Column('entity_name', sa.String(length=100), nullable=True))
    op.add_column('audit_logs', sa.Column('entity_id', sa.String(length=50), nullable=True))
    
    # Create notifications table
    op.create_table('notifications',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('user_id', sa.String(length=50), nullable=True),
        sa.Column('tenant_id', sa.String(length=50), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('type', sa.String(length=20), nullable=False, server_default='info'),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('reference_type', sa.String(length=50), nullable=True),
        sa.Column('reference_id', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_notifications_id'), 'notifications', ['id'], unique=False)
    op.create_index(op.f('ix_notifications_user_id'), 'notifications', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_notifications_user_id'), table_name='notifications')
    op.drop_index(op.f('ix_notifications_id'), table_name='notifications')
    op.drop_table('notifications')
    op.drop_column('audit_logs', 'entity_id')
    op.drop_column('audit_logs', 'entity_name')
