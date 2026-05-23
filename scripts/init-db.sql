-- Create initial tables (will be handled by alembic later, but for quick start)
CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO tenants (name, subdomain) VALUES ('Sekolah Contoh', 'sekolah1') ON CONFLICT DO NOTHING;