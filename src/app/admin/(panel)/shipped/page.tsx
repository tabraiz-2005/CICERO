import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { Badge, Card, Empty, PageBody, PageHeader, td, th } from '@/components/admin/Page';
import { cn, formatCents } from '@/lib/utils';

export const metadata = { title: 'Shipped items' };
export const dynamic = 'force-dynamic';

const PERIODS = [
  { v: '7', label: 'Last 7 days' },
  { v: '30', label: 'Last 30 days' },
  { v: '90', label: 'Last 3 months' },
  { v: 'all', label: 'All time' },
];

type Row = {
  id: string;
  order_number: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  shipping_address: { city?: string } | null;
  fulfillment_status: string;
  shipped_at: string;
  tracking_number: string | null;
  order_items: { id: string; title: string; color: string; size: string; quantity: number; image_url: string | null; line_total_amount: number }[];
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Karachi' });

/**
 * A plain record of every piece that has left the store: one line per item,
 * from orders marked Shipped (or later Delivered / Returned). Separate from
 * Inventory; nothing here changes stock.
 */
export default async function ShippedPage({ searchParams }: { searchParams: Promise<{ period?: string; q?: string }> }) {
  const sp = await searchParams;
  const period = PERIODS.some((p) => p.v === sp.period) ? sp.period! : '30';

  let q = getSupabaseAdmin()
    .from('orders')
    .select(
      'id, order_number, customer_first_name, customer_last_name, shipping_address, fulfillment_status, shipped_at, tracking_number, order_items(id, title, color, size, quantity, image_url, line_total_amount)'
    )
    .not('shipped_at', 'is', null)
    .order('shipped_at', { ascending: false })
    .limit(500);
  if (period !== 'all') q = q.gte('shipped_at', new Date(Date.now() - Number(period) * 86_400_000).toISOString());
  const { data, error } = await q;
  const orders = (data ?? []) as unknown as Row[];

  const term = (sp.q ?? '').trim().toLowerCase();
  const lines = orders
    .flatMap((o) => o.order_items.map((it) => ({ o, it })))
    .filter(({ o, it }) => !term || `${it.title} ${it.color} ${it.size} ${o.order_number} ${o.customer_first_name ?? ''} ${o.customer_last_name ?? ''}`.toLowerCase().includes(term));

  const pieces = lines.reduce((n, l) => n + l.it.quantity, 0);
  const value = lines.reduce((n, l) => n + l.it.line_total_amount, 0);
  const byProduct = new Map<string, number>();
  for (const l of lines) byProduct.set(l.it.title, (byProduct.get(l.it.title) ?? 0) + l.it.quantity);
  const top = Array.from(byProduct.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const link = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ period, q: sp.q, ...patch })) if (v) p.set(k, v);
    return `/admin/shipped?${p}`;
  };

  return (
    <>
      <PageHeader
        eyebrow="Sales"
        title="Shipped items"
        description="Every piece that has been sent to a customer, one line per item. Orders appear here when you mark them Shipped. This list is a record only; it doesn't change stock."
      />
      <PageBody>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1">
            {PERIODS.map((p) => (
              <Link
                key={p.v}
                href={link({ period: p.v })}
                className={cn('px-3 py-2 font-display text-[11px] uppercase tracking-[0.16em]', period === p.v ? 'bg-fg font-semibold text-bg' : 'text-muted hover:text-fg')}
              >
                {p.label}
              </Link>
            ))}
          </div>
          <form>
            <input type="hidden" name="period" value={period} />
            <input name="q" defaultValue={sp.q} placeholder="Product, colour, order or customer" className="field h-10 w-72" />
          </form>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="Pieces shipped"><p className="font-display text-3xl">{pieces}</p></Card>
          <Card title="Value shipped"><p className="font-display text-3xl">{formatCents(value)}</p></Card>
          <Card title="Most shipped">
            {top.length ? (
              <ol className="space-y-1 text-sm">
                {top.map(([t, n]) => (
                  <li key={t} className="flex justify-between gap-3"><span className="truncate">{t}</span><span className="text-muted">{n}</span></li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted">Nothing yet</p>
            )}
          </Card>
        </div>

        {error ? (
          <p className="mt-6 text-sm text-danger">{error.message}</p>
        ) : lines.length === 0 ? (
          <div className="mt-6">
            <Empty title="No shipped items yet">When you mark an order as Shipped, its items show up here.</Empty>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto border border-line">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr>
                  <th className={th}>Shipped</th>
                  <th className={th}>Product</th>
                  <th className={th}>Colour / size</th>
                  <th className={th}>Qty</th>
                  <th className={th}>Order</th>
                  <th className={th}>Customer</th>
                  <th className={th}>Tracking</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lines.map(({ o, it }) => (
                  <tr key={it.id}>
                    <td className={cn(td, 'whitespace-nowrap text-muted')}>{fmtDate(o.shipped_at)}</td>
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        {it.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.image_url} alt="" className="h-12 w-10 shrink-0 object-cover" />
                        ) : (
                          <span className="h-12 w-10 shrink-0 bg-surface-2" />
                        )}
                        <span>{it.title}</span>
                      </div>
                    </td>
                    <td className={cn(td, 'text-muted')}>{it.color} · {it.size}</td>
                    <td className={td}>{it.quantity}</td>
                    <td className={td}>
                      <Link href={`/admin/orders/${o.id}`} className="underline underline-offset-4">#{o.order_number}</Link>
                    </td>
                    <td className={td}>
                      {[o.customer_first_name, o.customer_last_name].filter(Boolean).join(' ')}
                      {o.shipping_address?.city && <span className="block text-xs text-muted">{o.shipping_address.city}</span>}
                    </td>
                    <td className={cn(td, 'text-muted')}>{o.tracking_number || '—'}</td>
                    <td className={td}>
                      <Badge tone={o.fulfillment_status === 'delivered' ? 'green' : o.fulfillment_status === 'returned' ? 'red' : 'blue'}>
                        {o.fulfillment_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageBody>
    </>
  );
}
