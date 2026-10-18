#!/usr/bin/env bash
# Rebuilds supabase/setup.sql from supabase/parts/*.sql (run after editing a part).
set -euo pipefail
cd "$(dirname "$0")"
python3 gen_seed.py
{
  cat <<'HDR'
-- =============================================================================
--  CICERO — database setup
--  Paste this whole file into Supabase → SQL Editor → New query → Run.
--  Safe to run on a new project or on the existing Lucevalie database, and safe
--  to run again later: it never overwrites products you create in the admin.
-- =============================================================================
begin;
HDR
  for f in parts/0*.sql; do printf '\n-- ======== %s ========\n' "$(basename "$f")"; cat "$f"; done
  printf '\ncommit;\n'
} > setup.sql
echo "wrote supabase/setup.sql"
