import type { Metadata } from 'next';
import { InfoPage } from '@/components/store/InfoPage';
import { getSettings } from '@/lib/commerce/catalog';

export const metadata: Metadata = { title: 'Terms of sale' };

export default async function Terms() {
  const s = await getSettings();
  return (
    <InfoPage
      eyebrow="Legal // Terms"
      title="Terms of sale"
      intro={`These terms apply to all orders placed with ${s.store_name}.`}
      sections={[
        { heading: 'Orders', body: <p>An order is confirmed once payment has been taken and you receive a confirmation. We may cancel and refund an order if an item becomes unavailable or a pricing error occurs.</p> },
        { heading: 'Prices', body: <p>Prices are shown in US dollars and include any applicable discounts. Shipping is calculated at checkout. Import duties and taxes, where applicable, are not included.</p> },
        { heading: 'Delivery & risk', body: <p>Delivery estimates are not guaranteed. Risk passes to you on delivery.</p> },
        { heading: 'Returns', body: <p>See our returns policy for eligibility and how refunds are processed.</p> },
        { heading: 'Contact', body: <p><a className="link-u" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></p> },
      ]}
    />
  );
}
