import type { Metadata } from 'next';
import { InfoPage } from '@/components/store/InfoPage';
import { getSettings } from '@/lib/commerce/catalog';

export const metadata: Metadata = { title: 'Contact' };

export default async function Contact() {
  const s = await getSettings();
  return (
    <InfoPage
      eyebrow="Client care // Contact"
      title="Contact"
      intro="We answer every message within one business day."
      sections={[
        { heading: 'Email', body: <p><a className="link-u" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></p> },
        ...(s.contact_phone ? [{ heading: 'Phone', body: <p>{s.contact_phone}</p> }] : []),
        ...(s.instagram_url ? [{ heading: 'Instagram', body: <p><a className="link-u" href={s.instagram_url} target="_blank" rel="noreferrer">{s.instagram_url.replace(/^https?:\/\/(www\.)?/, '')}</a></p> }] : []),
      ]}
    />
  );
}
