import type { Metadata } from 'next';
import { InfoPage } from '@/components/store/InfoPage';
import { getSettings } from '@/lib/commerce/catalog';
import { mapsEmbed, mapsLink } from '@/lib/commerce/local';
import { formatPkPhone, whatsappLink } from '@/lib/phone';

export const metadata: Metadata = {
  title: 'Contact & store',
  description: 'Visit the Cicero shop in Satellite Town, Gujranwala, or order online with Cash on Delivery across Pakistan. WhatsApp us for sizes and orders.',
};

export default async function Contact() {
  const s = await getSettings();
  const phones = [s.contact_phone, s.contact_phone_2].filter(Boolean) as string[];
  const maps = mapsLink(s);
  const embed = mapsEmbed(s);
  return (
    <InfoPage
      eyebrow="Client care // Contact"
      title="Contact"
      intro="Questions about sizing, an order or a return? Message us on WhatsApp — we usually reply within the hour during shop hours."
      sections={[
        ...(s.address
          ? [{
              heading: 'Visit the store',
              body: (
                <>
                  <p>
                    {s.address}
                    {maps && (
                      <>
                        <br />
                        <a className="link-u" href={maps} target="_blank" rel="noreferrer">Open in Google Maps</a>
                      </>
                    )}
                  </p>
                  {s.opening_hours && <p className="text-muted">{s.opening_hours}</p>}
                  {embed && (
                    <div className="mt-2 aspect-[4/3] w-full overflow-hidden border border-line sm:aspect-[16/9]">
                      <iframe
                        src={embed}
                        title={`Map of ${s.store_name}`}
                        className="h-full w-full grayscale-[30%]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                </>
              ),
            }]
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
        ...(s.contact_email ? [{ heading: 'Email', body: <p><a className="link-u" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></p> }] : []),
      ]}
    />
  );
}
