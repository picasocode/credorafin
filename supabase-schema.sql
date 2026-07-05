-- ============================================================================
-- Credora Fintech — Supabase Schema Migration
-- Run this in the Supabase SQL Editor (or via supabase db push)
-- ============================================================================

-- --------------------------------------------------------------------------
-- Helper: auto-update updated_at on row modification
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. contact_inquiries
-- ============================================================================
CREATE TABLE contact_inquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  funding_requirement TEXT,
  city          TEXT,
  message       TEXT,
  referral_source TEXT,
  ip_address    TEXT,
  user_agent    TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','contacted','in_progress','converted','closed')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ
);

CREATE INDEX idx_contact_inquiries_status    ON contact_inquiries (status);
CREATE INDEX idx_contact_inquiries_created   ON contact_inquiries (created_at);

CREATE TRIGGER trg_contact_inquiries_updated_at
  BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 2. referral_partners
-- ============================================================================
CREATE TABLE referral_partners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT NOT NULL,
  business_type   TEXT,
  company_name    TEXT,
  city            TEXT,
  referral_source TEXT,
  message         TEXT,
  ip_address      TEXT,
  user_agent      TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','active','suspended','rejected')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ
);

CREATE INDEX idx_referral_partners_status    ON referral_partners (status);
CREATE INDEX idx_referral_partners_created   ON referral_partners (created_at);

CREATE TRIGGER trg_referral_partners_updated_at
  BEFORE UPDATE ON referral_partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 3. job_applications
-- ============================================================================
CREATE TABLE job_applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  position    TEXT NOT NULL,
  experience  TEXT,
  message     TEXT,
  resume_url  TEXT,
  ip_address  TEXT,
  user_agent  TEXT,
  status      TEXT NOT NULL DEFAULT 'new'
              CHECK (status IN ('new','screening','interview','offered','rejected','hired')),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE INDEX idx_job_applications_status   ON job_applications (status);
CREATE INDEX idx_job_applications_created  ON job_applications (created_at);
CREATE INDEX idx_job_applications_position ON job_applications (position);

CREATE TRIGGER trg_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 4. brochure_downloads
-- ============================================================================
CREATE TABLE brochure_downloads (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL,
  product        TEXT NOT NULL,
  brochure_file  TEXT NOT NULL,
  ip_address     TEXT,
  user_agent     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. admin_users
-- ============================================================================
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin'
                CHECK (role IN ('admin','viewer')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login    TIMESTAMPTZ
);

-- ============================================================================
-- Row-Level Security (RLS)
-- ============================================================================
ALTER TABLE contact_inquiries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_partners  ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE brochure_downloads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users         ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Service-role policies (full access via Supabase service_role key)
-- ============================================================================
CREATE POLICY "service_role_all_contact_inquiries"
  ON contact_inquiries FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_referral_partners"
  ON referral_partners FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_job_applications"
  ON job_applications FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_brochure_downloads"
  ON brochure_downloads FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_admin_users"
  ON admin_users FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- Anon policies (INSERT only on public form tables, NO access on admin_users)
-- ============================================================================
CREATE POLICY "anon_insert_contact_inquiries"
  ON contact_inquiries FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_referral_partners"
  ON referral_partners FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_job_applications"
  ON job_applications FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_brochure_downloads"
  ON brochure_downloads FOR INSERT
  TO anon WITH CHECK (true);

-- ============================================================================
-- Default admin user
-- Email:    admin@credora.in
-- Password: Credora@Admin2024  (change after first login)
-- ============================================================================
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@credora.in',
  '$2b$12$eVeZiDovHY7klfHpaPJnY.4biyPni8640D54Yfa.Eu.EovZUnZyrG',
  'Credora Admin',
  'admin'
)
ON CONFLICT (email) DO NOTHING;