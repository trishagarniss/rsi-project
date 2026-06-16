"""add_sp_delete_account

Revision ID: 824cee6db8ff
Revises: 9a1b2c3d4e5f
Create Date: 2026-06-16 14:35:25.970691

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '824cee6db8ff'
down_revision: Union[str, Sequence[str], None] = '9a1b2c3d4e5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
    CREATE OR REPLACE PROCEDURE sp_delete_account(
        p_user_id VARCHAR(50),
        p_deleted_by VARCHAR(50),
        OUT p_result VARCHAR(50)
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_tenant_id VARCHAR(50);
        v_target_role VARCHAR(50);
        v_exists BOOLEAN;
    BEGIN
        -- Mencegah user mendelete dirinya sendiri
        IF p_user_id = p_deleted_by THEN
            p_result := 'CANNOT_DELETE_SELF';
            RETURN;
        END IF;

        -- Cek keberadaan p_user_id di tabel users yang is_active = true
        SELECT EXISTS (
            SELECT 1 FROM users WHERE id = p_user_id AND is_active = true
        ) INTO v_exists;

        IF NOT v_exists THEN
            p_result := 'USER_NOT_FOUND';
            RETURN;
        END IF;

        SELECT tenant_id, role INTO v_tenant_id, v_target_role FROM users WHERE id = p_user_id;

        -- Mencegah penghapusan SUPERADMIN
        IF v_target_role = 'SUPERADMIN' THEN
            p_result := 'CANNOT_DELETE_SUPERADMIN';
            RETURN;
        END IF;

        -- Soft delete
        UPDATE users SET is_active = false, updated_at = NOW() WHERE id = p_user_id;

        -- Catat log
        INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_name, entity_id, details, created_at)
        VALUES (
            'AL_' || REPLACE(gen_random_uuid()::text, '-', ''),
            v_tenant_id,
            p_deleted_by,
            'SOFT_DELETE_USER',
            'user',
            p_user_id,
            '{"message": "User account deactivated via flag"}'::jsonb,
            NOW()
        );

        p_result := 'SUCCESS';

    EXCEPTION
        WHEN OTHERS THEN
            p_result := 'DELETE_FAILED';
    END;
    $$;
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP PROCEDURE IF EXISTS sp_delete_account(VARCHAR, VARCHAR);")

