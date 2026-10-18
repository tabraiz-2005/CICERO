import { cn } from '@/lib/utils';

type Kind = 'coat' | 'jacket' | 'sweater' | 'cardigan' | 'generic';

export function garmentKind(category = ''): Kind {
  const c = category.toLowerCase();
  if (c.includes('coat') || c.includes('outer') || c.includes('parka') || c.includes('trench')) return 'coat';
  if (c.includes('jacket') || c.includes('bomber') || c.includes('blazer')) return 'jacket';
  if (c.includes('cardigan')) return 'cardigan';
  if (c.includes('sweater') || c.includes('knit') || c.includes('jumper') || c.includes('hood')) return 'sweater';
  return 'generic';
}

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Coat() {
  return (
    <g {...S}>
      <path d="M112 62 150 50l38 12 34 18 18 176-18 4-12-112v208H92V156L80 268l-18-4 18-176z" />
      <path d="M150 50l-24 22 14 84 10 10 10-10 14-84z" />
      <path d="M160 166l6 194M108 290l26-4M166 286l26 4" />
      {[196, 236, 276].map((y) => (
        <g key={y}>
          <circle cx="138" cy={y} r="3" />
          <circle cx="172" cy={y} r="3" />
        </g>
      ))}
    </g>
  );
}

function Jacket() {
  return (
    <g {...S}>
      <path d="M114 70 150 60l36 10 34 18 16 150-18 4-12-96v134H96V156l-12 96-18-4 16-150z" />
      <path d="M126 64q24 16 48 0M96 268h108M96 280h108M150 74v206" />
      <path d="M220 236l-2 16M80 236l2 16M110 196l28-4M162 192l28 4" />
      <path d="M200 120l10 26" />
    </g>
  );
}

function Sweater() {
  return (
    <g {...S}>
      <path d="M118 72 150 66l32 6 40 22 18 156-20 4-16-108v148H96V152l-16 108-20-4 18-156z" />
      <path d="M128 70q22 22 44 0M124 66q26 30 52 0" />
      <path d="M96 286h108M96 278h108M60 248l20 6M220 254l20-6" />
      <path d="M120 120c10 30 10 60 0 90M180 120c-10 30-10 60 0 90M150 110v170" strokeDasharray="3 5" />
    </g>
  );
}

function Cardigan() {
  return (
    <g {...S}>
      <path d="M118 72 150 66l32 6 40 22 18 156-20 4-16-108v156H96V152l-16 108-20-4 18-156z" />
      <path d="M128 70l22 74 22-74M150 144v150M96 286h108" />
      {[166, 196, 226, 256].map((y) => (
        <circle key={y} cx="156" cy={y} r="2.6" />
      ))}
      <path d="M104 230h32v32h-32zM164 230h32v32h-32z" />
    </g>
  );
}

function Generic() {
  return (
    <g {...S}>
      <path d="M116 74 150 66l34 8 38 22 16 150-18 4-14-104v148H98V154l-14 104-18-4 16-150z" />
      <path d="M130 70q20 18 40 0" />
    </g>
  );
}

/** Line-drawn garment shown wherever a product has no photo yet. */
export function GarmentArt({
  category,
  label,
  className,
}: {
  category?: string;
  label?: string;
  className?: string;
}) {
  const kind = garmentKind(category);
  return (
    <div className={cn('relative flex h-full w-full items-center justify-center overflow-hidden bg-surface-2', className)}>
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full text-line"
        viewBox="0 0 300 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="cicero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0v20" fill="none" stroke="currentColor" strokeWidth=".5" />
          </pattern>
        </defs>
        <rect width="300" height="400" fill="url(#cicero-grid)" opacity=".55" />
      </svg>
      <svg aria-hidden viewBox="0 0 300 400" className="relative h-[78%] w-[78%] text-fg/45">
        {kind === 'coat' && <Coat />}
        {kind === 'jacket' && <Jacket />}
        {kind === 'sweater' && <Sweater />}
        {kind === 'cardigan' && <Cardigan />}
        {kind === 'generic' && <Generic />}
      </svg>
      {label && (
        <span className="absolute bottom-4 left-4 right-4 truncate font-display text-[10px] uppercase tracking-label text-subtle">
          {label}
        </span>
      )}
    </div>
  );
}
