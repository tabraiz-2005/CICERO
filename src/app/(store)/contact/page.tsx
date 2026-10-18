import type { Metadata } from 'next';
import { InfoPage } from '@/components/store/InfoPage';
import { getSettings } from '@/lib/commerce/catalog';
import { formatPkPhone, whatsappLink } from '@/lib/phone';

export const metadata: Metadata = { title: 'Contact & store', description: 'Visit Cicero in Satellite Town, Gujranwala, or message us on WhatsApp.' };

export default async function Contact() {
  const s = await getSettings();
  const phones = [s.contact_phone, s.contact_phone_2].filter(Boolean) as string[];
  const maps = s.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.store_name}, ${s.address}`)}` : null;
  return (
    <InfoPage
      eyebrow="Client care // Contact"
      title="Contact"
      intro="Questions about sizing, an order or a return? Message us on WhatsApp — we usually reply within the hour during shop hours."
      sections={[
        ...(s.address
          ? [{ heading: 'Visit the store', body: <p>{s.address}{maps && <><br /><a className="link-u" href={maps} target="_blank" rel="noreferrer">Open in Google Maps</a></>}</p> }]
          : []),
        ...(phones.length
          ? [{
              heading: 'WhatsApp & phone',
              body: (
                <ul className="space-y-2">
                  {phones.map((p) => (
                    <li key={p}>
                      <a className="link-u" href={whatsappLink(p) ?? `tel:${p}`} target="_blank" rel="noreferrer">{formatPkPhone(p) || p}</a>{' '}
                      <span className="text-muted">· <a className="link-u" href={`tel:${p}`}>call</a></span>
                    </li>
                  ))}
                </ul>
              ),
            }]
          : []),
        ...(s.instagram_url ? [{ heading: 'Instagram', body: <p><a className="link-u" href={s.instagram_url} target="_blank" rel="noreferrer">{s.instagram_url.replace(/^https?:\/\/(www\.)?/, '')}</a></p> }] : []),
        { heading: 'Email', body: <p><a className="link-u" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></p> },
      ]}
    />
  );
}
