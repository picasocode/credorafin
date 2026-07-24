-- ============================================================================
-- CredoraFin — Consolidated Supabase schema (all 11 tables + RLS)
--
-- This file is a convenience copy of the canonical migration at
--   supabase/migrations/00000000000000_init.sql
--
-- Usage options:
--   1. Local dev (recommended):  `supabase db push`   (applies all migrations)
--   2. Supabase Cloud dashboard: paste this whole file into the SQL Editor
--   3. Prisma-managed:           `bun run db:push`    (Prisma creates tables)
--
-- All three paths produce an identical schema. The Prisma-managed path is the
-- default for this repo because the seed script + API routes use Prisma.
-- The Supabase migration/SQL is provided so the schema can also be managed
-- from the Supabase side (Studio, migrations, branching) when needed.
-- ============================================================================

\i supabase/migrations/00000000000000_init.sql
