-- Enable Row-Level Security untuk semua tabel tenant-scoped
-- Dijalankan otomatis saat app startup via main.py

DO $$ BEGIN
    ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE students ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE academics ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE socio_economics ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE risk_predictions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Policy: tenant_id harus cocok dengan session variable app.tenant_id
-- Superadmin bypass: saat app.tenant_id = '' atau NULL, semua data bisa diakses

CREATE POLICY IF NOT EXISTS tenant_isolation_tenants ON tenants
    USING (id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_users ON users
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_students ON students
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_academics ON academics
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_attendances ON attendances
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_socio_economics ON socio_economics
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_risk_predictions ON risk_predictions
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_interventions ON interventions
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_audit_logs ON audit_logs
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');

CREATE POLICY IF NOT EXISTS tenant_isolation_notifications ON notifications
    USING (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '')
    WITH CHECK (tenant_id = current_setting('app.tenant_id') OR current_setting('app.tenant_id') = '');
