import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { env } from '@/lib/env';
import { Badge, Card, PageBody, statusTone } from '@/components/admin/Page';
import { OrderActions } from '@/components/admin/OrderActions';
import { GarmentArt } from '@/components/store/GarmentArt';
import { COUNTRIES } from '@/lib/countries';
import { formatCents } from '@/lib/utils';

export const metadata = { title: 'Order' };

const dt = (s: string | null) => (s ? new Date(s).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : null);

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: o } = await getSupabaseAdmin().from('orders').select('*, order_items(*)').eq('id', id).maybeSingle();
  if (!o) notFound();

  const a = (o.shipping_address ?? {}) as Record<string, string>;
  const country = COUNTRIES.find(([c]) => c === a.country)?.[1] ?? a.country;
  const stripeBase = `https://dashboard.stripe.com${env.stripeSecretKey.startsWith('sk_test') ? '/test' : ''}`;
  const timeline = [
    ['Created', o.created_at],
    ['Paid', o.paid_at],
    ['Shipped', o.shipped_at],
    ['Delivered', o.delivered_at],
    ['Cancelled', o.cancelled_at],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-line px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-1 text-muted hover:text-fg" aria-label="Back to orders"><ArrowLeft className="h-5 w-5" /></Link>
          <div>
            <h1 className="font-display text-2xl font-bold uppercase lg:text-3xl">{o.order_number}</h1>
            <p className="text-xs text-muted">{dt(o.created_at)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={statusTone(o.payment_status)}>{o.payment_status}</Badge>
          <Badge tone={statusTone(o.fulfillment_status)}>{o.fulfillment_status}</Badge>
          {o.shipping_method === 'express' && <Badge tone="amber">Express</Badge>}
        </div>
      </div>

      <PageBody>
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <Card title="Items" bodyClass="p-0">
              <ul className="divide-y divide-line">
                {(o.order_items ?? []).map((i: Record<string, string & number>) => (
                  <li key={i.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden border border-line">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {i.image_url ? <img src={i.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <GarmentArt />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{i.title}</p>
                      <p className="text-xs text-muted">{i.color} / {i.size} · {i.sku}</p>
                    </div>
                    <p className="text-sm text-muted">{formatCents(i.unit_amount)} × {i.quantity}</p>
                    <p className="w-24 text-right font-display">{formatCents(i.line_total_amount ?? i.unit_amount * i.quantity)}</p>
                  </li>
                ))}
              </ul>
              <dl className="space-y-2 border-t border-line px-5 py-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatCents(o.subtotal_amount)}</dd></div>
                {o.discount_amount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount {o.promo_code && `(${o.promo_code})`}</dt><dd>−{formatCents(o.discount_amount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-muted">Shipping ({o.shipping_method})</dt><dd>{o.shipping_amount ? formatCents(o.shipping_amount) : 'Free'}</dd></div>
                <div className="flex justify-between border-t border-line pt-2 font-display font-bold"><dt>Total</dt><dd>{formatCents(o.total_amount, o.currency)}</dd></div>
              </dl>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card title="Customer">
                <p className="font-medium">{o.customer_first_name} {o.customer_last_name}</p>
                <a href={`mailto:${o.customer_email}`} className="mt-1 block text-sm underline underline-offset-4">{o.customer_email}</a>
                {o.customer_phone && <a href={`tel:${o.customer_phone}`} className="mt-1 block text-sm text-muted">{o.customer_phone}</a>}
              </Card>
              <Card title="Ship to">
                <address className="text-sm not-italic leading-relaxed">
                  {o.customer_first_name} {o.customer_last_name}<br />
                  {a.address}{a.address2 && <>, {a.address2}</>}<br />
                  {a.city}{a.region && `, ${a.region}`} {a.postalCode}<br />
                  {country}
                </address>
              </Card>
            </div>

            <Card title="Timeline">
              <ol className="space-y-2 text-sm">
                {timeline.map(([label, v]) => (
                  <li key={label} className="flex justify-between"><span className="text-muted">{label}</span><span>{dt(v)}</span></li>
                ))}
              </ol>
              {(o.stripe_payment_intent_id || o.stripe_checkout_session_id) && (
                <a
                  href={o.stripe_payment_intent_id ? `${stripeBase}/payments/${o.stripe_payment_intent_id}` : `${stripeBase}/checkout/sessions/${o.stripe_checkout_session_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs text-muted underline underline-offset-4 hover:text-fg"
                >
                  Open in Stripe <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </Card>
          </div>

          <Card title={o.payment_status === 'paid' ? 'Fulfil order' : 'Order actions'} className="h-fit">
            {o.status === 'cancelled' || o.status === 'refunded' ? (
              <p className="text-sm text-muted">This order is {o.status}. No further actions.</p>
            ) : (
              <OrderActions
                id={o.id}
                paid={o.payment_status === 'paid'}
                pending={o.status === 'pending'}
                initial={{
                  fulfillmentStatus: o.fulfillment_status,
                  trackingNumber: o.tracking_number ?? '',
                  trackingUrl: o.tracking_url ?? '',
                  adminNotes: o.admin_notes ?? '',
                }}
              />
            )}
          </Card>
        </div>
      </PageBody>
    </>
  );
}
