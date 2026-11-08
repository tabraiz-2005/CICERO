import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { Card, PageBody, PageHeader, td, th } from '@/components/admin/Page';
import { cn, formatCents } from '@/lib/utils';

export const metadata = { title: 'Visitors' };
export const dynamic = 'force-dynamic';

const PERIODS = [
  { v: '1', label: 'Today' },
  { v: '7', label: 'Last 7 days' },
  { v: '30', label: 'Last 30 days' },
  { v: '90', label: 'Last 3 months' },
];

type View = {
  created_at: string;
  path: string;
  visitor_id: string;
  session_id: string;
  source: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  product_slug: string | null;
};

const SETUP_SQL = `create table if not exists public.page_views (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  path text not null,
  visitor_id text not null,
  session_id text not null,
  source text,
  device text,
  country text,
  city text,
  product_slug text
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);
alter table public.page_views enable row level security;
notify pgrst, 'reload schema';`;

const dayKey = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
const startOfTodayPk = () => new Date(`${dayKey(new Date().toISOString())}T00:00:00+05:00`);

function top<T extends string>(items: (T | null | undefined)[], n = 8) {
  const m = new Map<string, number>();
  for (const i of items) if (i) m.set(i, (m.get(i) ?? 0) + 1);
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, n);
}

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/men': 'Men',
  '/women': 'Women',
  '/sale': '999 Sale',
  '/new-arrivals': 'New arrivals',
  '/shop': 'Shop',
  '/checkout': 'Checkout',
  '/cart': 'Bag',
  '/about': 'Our story',
  '/contact': 'Contact',
};

function Bars({ rows, total }: { rows: [string, number][]; total: number }) {
  if (!rows.length) return <p className="text-sm text-muted">No data yet</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map(([label, n]) => (
        <li key={label} className="text-sm">
          <div className="flex justify-between gap-3">
            <span className="truncate">{label}</span>
            <span className="text-muted">{n}</span>
          </div>
          <div className="mt-1 h-1.5 bg-surface-2">
            <div className="h-full bg-fg/70" style={{ width: `${Math.max(3, (n / Math.max(1, total)) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-line bg-surface p-5">
      <p className="font-display text-[11px] uppercase tracking-label text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const sp = await searchParams;
  const period = PERIODS.some((p) => p.v === sp.period) ? sp.period! : '7';
  const since = period === '1' ? startOfTodayPk() : new Date(Date.now() - Number(period) * 86_400_000);
  const db = getSupabaseAdmin();

  // Supabase returns at most 1,000 rows per request, so read in pages.
  const views: View[] = [];
  let missing = false;
  for (let from = 0; from < 60_000; from += 1000) {
    const { data, error } = await db
      .from('page_views')
      .select('created_at, path, visitor_id, session_id, source, device, country, city, product_slug')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .range(from, from + 999);
    if (error) {
      missing = true;
      break;
    }
    views.push(...((data ?? []) as View[]));
    if (!data || data.length < 1000) break;
  }

  if (missing) {
    return (
      <>
        <PageHeader eyebrow="Store" title="Visitors" description="See how many people visit the store, where they come from and what they look at." />
        <PageBody>
          <Card title="One-time setup">
            <p className="text-sm leading-relaxed text-muted">
              Open <strong className="text-fg">Supabase → SQL Editor → New query</strong>, paste the text below, click <strong className="text-fg">Run</strong>, then refresh this page.
              Visits are counted from that moment on.
            </p>
            <pre className="mt-4 overflow-x-auto bg-surface-2 p-4 text-xs leading-relaxed">{SETUP_SQL}</pre>
          </Card>
        </PageBody>
      </>
    );
  }

  const live = new Set(
    (
      (await db.from('page_views').select('visitor_id').gte('created_at', new Date(Date.now() - 5 * 60_000).toISOString()).limit(1000)).data ?? []
    ).map((r: { visitor_id: string }) => r.visitor_id)
  ).size;

  const visitors = new Set(views.map((v) => v.visitor_id));
  const sessions = new Set(views.map((v) => v.session_id));
  const sourceBySession = new Map<string, string>();
  for (const v of views) if (v.source) sourceBySession.set(v.session_id, v.source);
  const sessionSources = Array.from(sessions).map((s) => sourceBySession.get(s) ?? 'direct');

  const deviceByVisitor = new Map<string, string>();
  const placeByVisitor = new Map<string, string>();
  for (const v of views) {
    if (v.device) deviceByVisitor.set(v.visitor_id, v.device);
    if (v.city || v.country) placeByVisitor.set(v.visitor_id, [v.city, v.country].filter(Boolean).join(', '));
  }

  // Product names for the most-viewed products.
  const topSlugs = top(views.map((v) => v.product_slug), 10);
  const { data: prodRows } = topSlugs.length
    ? await db.from('products').select('slug, title').in('slug', topSlugs.map(([s]) => s))
    : { data: [] as { slug: string; title: string }[] };
  const nameOf = new Map((prodRows ?? []).map((p: { slug: string; title: string }) => [p.slug, p.title]));

  const pages = top(
    views.filter((v) => !v.product_slug).map((v) => PAGE_NAMES[v.path] ?? v.path),
    8
  );

  // Orders in the same period, for the conversion rate.
  const { data: orderRows } = await db.from('orders').select('total_amount, status').gte('created_at', since.toISOString()).limit(5000);
  const orders = (orderRows ?? []).filter((o: { status: string }) => o.status !== 'cancelled');
  const revenue = orders.reduce((n: number, o: { total_amount: number }) => n + o.total_amount, 0);
  const conversion = visitors.size ? ((orders.length / visitors.size) * 100).toFixed(1) : '0.0';

  // Daily visitors (or hourly for "Today").
  const buckets = new Map<string, Set<string>>();
  for (const v of views) {
    const k =
      period === '1'
        ? new Date(v.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Asia/Karachi' })
        : dayKey(v.created_at);
    if (!buckets.has(k)) buckets.set(k, new Set());
    buckets.get(k)!.add(v.visitor_id);
  }
  // Every hour / day in the period, including empty ones.
  const keys: string[] = [];
  if (period === '1') {
    const nowHour = Number(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Asia/Karachi' }));
    for (let h = 0; h <= nowHour; h++) keys.push(String(h).padStart(2, '0'));
  } else {
    for (let i = Number(period) - 1; i >= 0; i--) keys.push(dayKey(new Date(Date.now() - i * 86_400_000).toISOString()));
  }
  const series = keys.map((k) => [k, buckets.get(k)?.size ?? 0] as const);
  const peak = Math.max(1, ...series.map(([, n]) => n));

  return (
    <>
      <PageHeader
        eyebrow="Store"
        title="Visitors"
        description="Who visits the store, where they come from and what they look at. Counts real shoppers only (no bots, no admin pages)."
      />
      <PageBody>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {PERIODS.map((p) => (
              <Link
                key={p.v}
                href={`/admin/analytics?period=${p.v}`}
                className={cn('px-3 py-2 font-display text-[11px] uppercase tracking-[0.16em]', period === p.v ? 'bg-fg font-semibold text-bg' : 'text-muted hover:text-fg')}
              >
                {p.label}
              </Link>
            ))}
          </div>
          <p className="flex items-center gap-2 text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <strong>{live}</strong> on the site right now
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Stat label="Visitors" value={visitors.size} hint="Unique people" />
          <Stat label="Visits" value={sessions.size} hint="Browsing sessions" />
          <Stat label="Page views" value={views.length} hint={sessions.size ? `${(views.length / sessions.size).toFixed(1)} pages per visit` : undefined} />
          <Stat label="Orders" value={orders.length} hint={formatCents(revenue)} />
          <Stat label="Conversion" value={`${conversion}%`} hint="Orders per visitor" />
        </div>

        <Card title={period === '1' ? 'Visitors by hour' : 'Visitors per day'} className="mt-6">
          {views.length ? (
            <div className="flex h-44 items-end gap-1">
              {series.map(([k, n]) => (
                <div key={k} className="group relative flex h-full min-w-0 max-w-[64px] flex-1 flex-col justify-end" title={`${k}: ${n}`}>
                  <span className="mb-1 hidden text-center text-[10px] text-muted group-hover:block">{n}</span>
                  <div className="w-full bg-fg/75 transition-colors group-hover:bg-brand" style={{ height: `${(n / peak) * 100}%`, minHeight: 2 }} />
                  <span className="mt-1 truncate text-center text-[9px] text-muted">{period === '1' ? k : period === '90' ? '' : k.slice(8)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No visits in this period yet.</p>
          )}
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card title="Where visitors come from">
            <Bars rows={top(sessionSources)} total={sessions.size} />
          </Card>
          <Card title="Devices">
            <Bars rows={top(Array.from(deviceByVisitor.values()))} total={visitors.size} />
          </Card>
          <Card title="Cities">
            <Bars rows={top(Array.from(placeByVisitor.values()))} total={visitors.size} />
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card title="Most viewed products" bodyClass="p-0">
            {topSlugs.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className={th}>Product</th>
                    <th className={cn(th, 'text-right')}>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topSlugs.map(([slug, n]) => (
                    <tr key={slug}>
                      <td className={td}>
                        <Link href={`/products/${slug}`} target="_blank" className="hover:underline">
                          {nameOf.get(slug) ?? slug}
                        </Link>
                      </td>
                      <td className={cn(td, 'text-right')}>{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-5 text-sm text-muted">No product views yet.</p>
            )}
          </Card>
          <Card title="Most visited pages">
            <Bars rows={pages} total={views.length} />
          </Card>
        </div>
      </PageBody>
    </>
  );
}
