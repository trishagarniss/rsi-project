"""add sp_delete_account stored procedure

Revision ID: e7b8c9d0e1f2
Revises: 7df955d31ea6
Create Date: 2026-06-23 15:58:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e7b8c9d0e1f2'
down_revision: Union[str, Sequence[str], None] = '7df955d31ea6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
    CREATE OR REPLACE PROCEDURE sp_delete_account(
        p_user_id VARCHAR,
        p_deleted_by VARCHAR,
        INOUT p_result VARCHAR DEFAULT NULL
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_user_exists BOOLEAN;
        v_role VARCHAR;
        v_tenant_id VARCHAR;
        v_new_log_id VARCHAR;
    BEGIN
        -- Check if target user exists
        SELECT EXISTS(SELECT 1 FROM users WHERE id = p_user_id) INTO v_user_exists;
        IF NOT v_user_exists THEN
            p_result := 'USER_NOT_FOUND';
            RETURN;
        END IF;

        -- Check if trying to delete self
        IF p_user_id = p_deleted_by THEN
            p_result := 'CANNOT_DELETE_SELF';
            RETURN;
        END IF;

        -- Check role and get tenant_id of target user
        SELECT role::VARCHAR, tenant_id INTO v_role, v_tenant_id FROM users WHERE id = p_user_id;
        IF v_role = 'SUPERADMIN' THEN
            p_result := 'CANNOT_DELETE_SUPERADMIN';
            RETURN;
        END IF;

        -- Deactivate user account
        UPDATE users 
        SET is_active = FALSE 
        WHERE id = p_user_id;

        -- Insert into audit_logs
        v_new_log_id := 'AL_' || gen_random_uuid();
        INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_name, entity_id, details, created_at)
        VALUES (
            v_new_log_id, 
            v_tenant_id, 
            p_deleted_by, 
            'DELETE', 
            'user', 
            p_user_id, 
            jsonb_build_object('is_active', false),
            now()
        );

        p_result := 'SUCCESS';
    END;
    $$;
    """)


def downgrade() -> None:
    op.execute("DROP PROCEDURE IF EXISTS sp_delete_account(VARCHAR, VARCHAR, VARCHAR);")
