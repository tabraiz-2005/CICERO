import type { Metadata } from 'next';
import { InfoPage } from '@/components/store/InfoPage';
import { getSettings } from '@/lib/commerce/catalog';

export const metadata: Metadata = { title: 'Privacy policy' };

export default async function Privacy() {
  const s = await getSettings();
  return (
    <InfoPage
      eyebrow="Legal // Privacy"
      title="Privacy"
      sections={[
        { heading: 'What we collect', body: <p>When you order, we collect your name, email, phone number and delivery address so we can fulfil and support your order.</p> },
        { heading: 'Payments', body: <p>Card details are entered on Stripe’s secure checkout and never reach our servers.</p> },
        { heading: 'On your device', body: <p>Your bag, wishlist and display preference (light or dark) are stored in your browser so they’re there when you come back.</p> },
        { heading: 'Your rights', body: <p>To access or delete your data, email <a className="link-u" href={`mailto:${s.contact_email}`}>{s.contact_email}</a>.</p> },
      ]}
    />
  );
}
