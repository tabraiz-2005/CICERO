import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getSettings } from '@/lib/commerce/catalog';
import { formatPkPhone, whatsappLink } from '@/lib/phone';
import { formatCents } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Order placed', robots: { index: false } };

/** The order id is a random UUID, so only the person who placed the order has this link. */
export default async function OrderConfirmed({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [{ data: o }, settings] = await Promise.all([
    getSupabaseAdmin()
      .from('orders')
      .select('order_number, customer_first_name, customer_phone, shipping_address, shipping_method, subtotal_amount, discount_amount, shipping_amount, total_amount, payment_method, created_at, order_items(title, color, size, quantity, unit_amount)')
      .eq('id', id)
      .maybeSingle(),
    getSettings(),
  ]);
  if (!o) notFound();
  // Only show this page for recent orders.
  if (Date.now() - new Date(o.created_at).getTime() > 7 * 864e5) notFound();

  const a = (o.shipping_address ?? {}) as Record<string, string>;
  const shopWhatsapp = whatsappLink(settings.contact_phone, `Hi ${settings.store_name}, about my order ${o.order_number}`);

  return (
    <div className="site-x py-14 lg:py-20">
      <div className="mx-auto max-w-2xl border border-line bg-surface p-8 sm:p-12">
        <div className="flex h-14 w-14 items-center justify-center border border-line-strong">
          <Check className="h-6 w-6" />
        </div>
        <p className="eyebrow mt-8">Order placed // {o.order_number}</p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">Thank you, {o.customer_first_name}</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-fg/85">
          We’ve received your order. We’ll call or WhatsApp you on <b>{formatPkPhone(o.customer_phone)}</b> to confirm it, then send it
          out. You’ll pay <b>{formatCents(o.total_amount)}</b> in cash when it arrives.
        </p>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {(o.order_items ?? []).map((i: { title: string; color: string; size: string; quantity: number; unit_amount: number }, n: number) => (
            <li key={n} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {i.quantity} × {i.title} <span className="text-muted">— {i.color} / {i.size}</span>
              </span>
              <span className="font-display">{formatCents(i.unit_amount * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatCents(o.subtotal_amount)}</dd></div>
          {o.discount_amount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount</dt><dd>−{formatCents(o.discount_amount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">Delivery ({o.shipping_method})</dt><dd>{o.shipping_amount ? formatCents(o.shipping_amount) : 'Free'}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 font-display text-base font-bold uppercase tracking-[0.12em]"><dt>Pay on delivery</dt><dd>{formatCents(o.total_amount)}</dd></div>
        </dl>

        <div className="mt-8 text-sm text-muted">
          <p className="label mb-2 text-fg">Delivering to</p>
          <p>
            {a.address}
            {a.address2 && `, ${a.address2}`}
            <br />
            {a.city}
            {a.region && `, ${a.region}`}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">Continue shopping</Link>
          {shopWhatsapp && (
            <a href={shopWhatsapp} target="_blank" rel="noreferrer" className="btn-outline">
              Message us on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
