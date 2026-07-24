-- ============================================================================
-- CredoraFin — Initial Supabase migration
-- Mirrors the Prisma schema (prisma/schema.prisma) exactly.
-- Tables use TEXT primary keys with app-generated cuid() values (Prisma default).
-- Safe to run via `supabase db push` OR directly in the Supabase SQL editor.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Helper: auto-update updated_at on row modification
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. admin_users
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'viewer'
                CHECK (role IN ('super_admin','admin','viewer')),
  password_hash TEXT NOT NULL,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);

CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 2. contact_inquiries
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id                 TEXT PRIMARY KEY,
  name               TEXT NOT NULL,
  business_name      TEXT,
  business_type      TEXT,
  funding_requirement TEXT,
  phone              TEXT NOT NULL,
  email              TEXT,
  message            TEXT,
  status             TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new','contacted','in_progress','converted','closed')),
  ip_address         TEXT,
  user_agent         TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status  ON public.contact_inquiries (status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created ON public.contact_inquiries (created_at);

CREATE TRIGGER trg_contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 3. referral_partners
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referral_partners (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT NOT NULL,
  business_name   TEXT,
  business_type   TEXT,
  city            TEXT,
  referral_source TEXT,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','active','suspended','rejected')),
  ip_address      TEXT,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_partners_status  ON public.referral_partners (status);
CREATE INDEX IF NOT EXISTS idx_referral_partners_created ON public.referral_partners (created_at);

CREATE TRIGGER trg_referral_partners_updated_at
  BEFORE UPDATE ON public.referral_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 4. job_positions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_positions (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  department  TEXT NOT NULL,
  location    TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'Full-time',
  experience  TEXT NOT NULL,
  salary      TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#304AC0',
  description TEXT NOT NULL,
  skills      TEXT NOT NULL,           -- JSON-encoded string array
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_positions_active ON public.job_positions (is_active);

CREATE TRIGGER trg_job_positions_updated_at
  BEFORE UPDATE ON public.job_positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 5. job_applications
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
  id         TEXT PRIMARY KEY,
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  position   TEXT NOT NULL,
  experience TEXT,
  message    TEXT,
  status     TEXT NOT NULL DEFAULT 'new'
             CHECK (status IN ('new','screening','interview','offered','rejected','hired')),
  ip_address TEXT,
  user_agent TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_status   ON public.job_applications (status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created  ON public.job_applications (created_at);
CREATE INDEX IF NOT EXISTS idx_job_applications_position ON public.job_applications (position);

CREATE TRIGGER trg_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 6. brochure_downloads
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.brochure_downloads (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL,
  product       TEXT NOT NULL,
  brochure_file TEXT NOT NULL,
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brochure_downloads_created ON public.brochure_downloads (created_at);

-- ============================================================================
-- 7. brochure_files
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.brochure_files (
  id            TEXT PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  file_name     TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type     TEXT NOT NULL,
  size          INTEGER NOT NULL,
  uploaded_by   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_brochure_files_updated_at
  BEFORE UPDATE ON public.brochure_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 8. product_overrides
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_overrides (
  id            TEXT PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT,
  short_desc    TEXT,
  full_desc     TEXT,
  brochure_file TEXT,
  brochure_url  TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by    TEXT
);

CREATE TRIGGER trg_product_overrides_updated_at
  BEFORE UPDATE ON public.product_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 9. hero_slides
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id               TEXT PRIMARY KEY,
  badge            TEXT NOT NULL,
  "headingWords"   TEXT NOT NULL,      -- JSON-encoded string array
  subtitle         TEXT NOT NULL,
  cta1             TEXT NOT NULL DEFAULT 'Build Finance',
  cta2             TEXT NOT NULL DEFAULT 'Contact us',
  image            TEXT NOT NULL,
  fallback_image   TEXT NOT NULL,
  hud_left_metric  TEXT NOT NULL,
  hud_left_label   TEXT NOT NULL,
  hud_left_status  TEXT NOT NULL,
  hud_right_metric TEXT NOT NULL,
  hud_right_label  TEXT NOT NULL,
  hud_right_trend  TEXT NOT NULL,
  hud_graph_value  TEXT NOT NULL,
  hud_graph_label  TEXT NOT NULL,
  tab_label        TEXT NOT NULL,
  tab_icon         TEXT NOT NULL DEFAULT 'Building2',
  accent           TEXT NOT NULL DEFAULT '#1A2255',
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_active
  ON public.hero_slides (is_active, sort_order);

CREATE TRIGGER trg_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 10. blog_posts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id            TEXT PRIMARY KEY,            -- slug, e.g. "credit-profile-vs-cibil"
  category      TEXT NOT NULL,
  category_icon TEXT NOT NULL DEFAULT 'FileText',
  title         TEXT NOT NULL,
  excerpt       TEXT NOT NULL,
  content       TEXT NOT NULL,               -- JSON-encoded string array of paragraphs
  author        TEXT NOT NULL DEFAULT 'Credora Advisory Team',
  date          TEXT NOT NULL,               -- ISO date string
  read_time     TEXT NOT NULL,
  color         TEXT NOT NULL DEFAULT '#304AC0',
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  tags          TEXT NOT NULL,               -- JSON-encoded string array
  image         TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_active   ON public.blog_posts (is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts (featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date     ON public.blog_posts (date);

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- Row-Level Security (RLS)
-- The Next.js app talks to Postgres via Prisma using the postgres role
-- (service-level credentials), which bypasses RLS. RLS is enabled so that
-- if you later expose tables via the Supabase auto-API / anon key, the
-- public can only INSERT into the public form tables and read public content.
-- ============================================================================
ALTER TABLE public.admin_users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_partners   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_positions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brochure_downloads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brochure_files      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_overrides   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts          ENABLE ROW LEVEL SECURITY;

-- service_role: full access on every table
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'admin_users','contact_inquiries','referral_partners','job_positions',
    'job_applications','brochure_downloads','brochure_files','product_overrides',
    'hero_slides','blog_posts'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "service_role_all_%s" ON public.%I;', t, t);
    EXECUTE format('CREATE POLICY "service_role_all_%s" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true);', t, t);
  END LOOP;
END $$;

-- anon: public read on active content tables
CREATE POLICY "anon_read_hero_slides"
  ON public.hero_slides FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "anon_read_blog_posts"
  ON public.blog_posts FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "anon_read_job_positions"
  ON public.job_positions FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "anon_read_product_overrides"
  ON public.product_overrides FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "anon_read_brochure_files"
  ON public.brochure_files FOR SELECT TO anon USING (true);

-- anon: INSERT only on public form tables (no read, no update, no delete)
CREATE POLICY "anon_insert_contact_inquiries"
  ON public.contact_inquiries FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_referral_partners"
  ON public.referral_partners FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_job_applications"
  ON public.job_applications FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_brochure_downloads"
  ON public.brochure_downloads FOR INSERT TO anon WITH CHECK (true);
