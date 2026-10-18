import type { Metadata } from 'next';
import { InfoPage } from '@/components/store/InfoPage';
import { getSettings } from '@/lib/commerce/catalog';

export const metadata: Metadata = { title: 'FAQ' };

export default async function FAQ() {
  const s = await getSettings();
  return (
    <InfoPage
      eyebrow="Client care // FAQ"
      title="FAQ"
      sections={[
        { heading: 'Which payment methods do you accept?', body: <p>All major credit and debit cards, plus Apple Pay and Google Pay where available. Payments are processed securely by Stripe.</p> },
        { heading: 'Can I change or cancel my order?', body: <p>Contact us as soon as possible. If your order hasn’t been dispatched we can usually change or cancel it.</p> },
        { heading: 'How do I know my size?', body: <p>See the size guide, and the fit notes on each product page. Still unsure? Email us your height and usual size.</p> },
        { heading: 'How should I care for wool and cashmere?', body: <p>Brush coats after wear, rest knitwear between wears, fold rather than hang knits, and dry clean or hand wash cold. Each product lists specific care.</p> },
        { heading: 'How do I contact you?', body: <p><a className="link-u" href={`mailto:${s.contact_email}`}>{s.contact_email}</a>{s.contact_phone && <> · {s.contact_phone}</>}</p> },
      ]}
    />
  );
}
