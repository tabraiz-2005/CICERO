import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

export const BUCKET = 'product-images';

export interface Check {
  label: string;
  ok: boolean;
  fix?: string;
}

export async function runHealthChecks(): Promise<Check[]> {
  const checks: Check[] = [
    { label: 'Supabase URL & public key', ok: Boolean(env.supabaseUrl && env.supabasePublicKey), fix: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.' },
    { label: 'Supabase secret key', ok: Boolean(env.supabaseSecretKey), fix: 'Set SUPABASE_SECRET_KEY (Supabase → Project Settings → API keys → secret).' },
    { label: 'Stripe secret key', ok: Boolean(env.stripeSecretKey), fix: 'Set STRIPE_SECRET_KEY (Stripe → Developers → API keys).' },
    {
      label: 'Stripe webhook secret',
      ok: Boolean(env.stripeWebhookSecret),
      fix: 'Add a webhook endpoint for /api/stripe/webhook in Stripe and set STRIPE_WEBHOOK_SECRET. (Orders are still confirmed on the success page without it.)',
    },
    { label: 'Owner emails (ADMIN_EMAILS)', ok: env.adminEmails.length > 0, fix: 'Set ADMIN_EMAILS to your email address.' },
    {
      label: 'Stripe mode',
      ok: true,
      fix: env.stripeSecretKey.startsWith('sk_live') ? 'Live — real payments are being taken.' : 'Test mode — use card 4242 4242 4242 4242. Switch to live keys to take real payments.',
    },
  ];
  if (!env.supabaseSecretKey || !env.supabaseUrl) return checks;
  const admin = getSupabaseAdmin();
  const [settings, discounts, bucket] = await Promise.all([
    admin.from('store_settings').select('id').limit(1),
    admin.from('discount_codes').select('id').limit(1),
    admin.storage.getBucket(BUCKET),
  ]);
  checks.push({
    label: 'Database tables',
    ok: !settings.error && !discounts.error,
    fix: 'Open Supabase → SQL Editor, paste supabase/setup.sql and press Run.',
  });
  checks.push({
    label: 'Image storage bucket',
    ok: !bucket.error && Boolean(bucket.data),
    fix: 'Run supabase/setup.sql (it creates the "product-images" bucket), or upload one image — the portal creates it automatically.',
  });
  return checks;
}
