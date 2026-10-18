import type { Metadata } from 'next';
import { InfoPage } from '@/components/store/InfoPage';
import { getSettings } from '@/lib/commerce/catalog';
import { formatCents } from '@/lib/utils';

export const metadata: Metadata = { title: 'Shipping' };

export default async function ShippingPage() {
  const s = await getSettings();
  return (
    <InfoPage
      eyebrow="Client care // Shipping"
      title="Shipping"
      intro="Every order is dispatched with full tracking. You’ll get an email with your tracking link as soon as your parcel leaves us."
      sections={[
        {
          heading: 'Rates',
          body: (
            <>
              <p>Standard (3–5 business days): {formatCents(s.standard_shipping_amount)}{s.free_shipping_threshold !== null && <>, free on orders over {formatCents(s.free_shipping_threshold)}</>}.</p>
              <p>Express (1–2 business days in major cities): {formatCents(s.express_shipping_amount)}.</p>
            </>
          ),
        },
        { heading: 'Processing', body: <p>Orders placed before 2pm on a business day are usually dispatched the same day. Orders placed at weekends are dispatched the next business day.</p> },
        { heading: 'Cash on Delivery', body: <p>We deliver across Pakistan. Pay the courier in cash when your parcel arrives — we may call or WhatsApp you first to confirm your order.</p> },
        { heading: 'Questions', body: <p>Write to <a className="link-u" href={`mailto:${s.contact_email}`}>{s.contact_email}</a> with your order number.</p> },
      ]}
    />
  );
}
