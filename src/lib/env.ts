/**
 * Central place for environment variables.
 * Accepts the common alternative names Supabase/Vercel integrations use,
 * so a project configured with either naming scheme works.
 */
export const env = {
  supabaseUrl:
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  supabasePublicKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '',
  get supabaseSecretKey() {
    return (
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      ''
    );
  },
  get stripeSecretKey() {
    return process.env.STRIPE_SECRET_KEY || '';
  },
  get stripeWebhookSecret() {
    return process.env.STRIPE_WEBHOOK_SECRET || '';
  },
  get adminEmails(): string[] {
    return (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  },
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'),
};

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabasePublicKey);
}

export class ConfigError extends Error {
  constructor(missing: string[]) {
    super(
      `Missing environment variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}. ` +
        'Add them in Vercel → Project → Settings → Environment Variables, then redeploy.'
    );
    this.name = 'ConfigError';
  }
}
