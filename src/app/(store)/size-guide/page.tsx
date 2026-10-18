import type { Metadata } from 'next';
import { InfoPage } from '@/components/store/InfoPage';

export const metadata: Metadata = { title: 'Size guide' };

const MEN = [['S', '36–38', '30–32', '38'], ['M', '38–40', '32–34', '40'], ['L', '40–42', '34–36', '42'], ['XL', '42–44', '36–38', '44']];
const WOMEN = [['XS', '31–32', '24–25', '34'], ['S', '33–34', '26–27', '36'], ['M', '35–36', '28–29', '38'], ['L', '37–39', '30–32', '40']];

function Table({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border border-line text-left font-display text-sm">
        <thead className="bg-surface text-[11px] uppercase tracking-label text-muted">
          <tr>{['Size', 'Chest (in)', 'Waist (in)', 'EU'].map((h) => <th key={h} className="border-b border-line px-4 py-3 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-line last:border-0">
              {r.map((c, i) => <td key={i} className={`px-4 py-3 ${i === 0 ? 'font-bold' : 'text-fg/85'}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuide() {
  return (
    <InfoPage
      eyebrow="Client care // Fit"
      title="Size guide"
      intro="Body measurements in inches. Each product page also describes how that piece fits."
      sections={[
        { heading: 'Men', body: <Table rows={MEN} /> },
        { heading: 'Women', body: <Table rows={WOMEN} /> },
        { heading: 'Layering', body: <p>Our coats are cut with room for a knit underneath. If you plan to wear heavy layers and are between sizes, size up.</p> },
      ]}
    />
  );
}
