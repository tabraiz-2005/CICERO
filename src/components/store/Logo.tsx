import { cn } from '@/lib/utils';

/** Letter paths of the Cicero wordmark, drawn to match the shop signboard and bags. */
const LETTERS = [
  'M128.00,6.00 H30.00 A24.00,24.00 0 0 0 6.00,30.00 V60.00 A24.00,24.00 0 0 0 30.00,84.00 H128.00',
  'M160.00,0 V90',
  'M320.00,6.00 H222.00 A24.00,24.00 0 0 0 198.00,30.00 V60.00 A24.00,24.00 0 0 0 222.00,84.00 H320.00',
  'M474.00,6.00 H376.00 A24.00,24.00 0 0 0 352.00,30.00 V60.00 A24.00,24.00 0 0 0 376.00,84.00 H446.00 M352.00,45.00 H440.00',
  'M478.00,90 V30.00 A24.00,24.00 0 0 1 502.00,6.00 H564.00 A24.00,24.00 0 0 1 588.00,30.00 V28.50 A16.50,16.50 0 0 1 571.50,45.00 H478.00 M571.50,45.00 A16.50,16.50 0 0 1 588.00,61.50 V90',
];

/** Cicero wordmark — letters follow the text colour, the "O" is always brand magenta. */
export function Logo({ className, title = 'Cicero', mono }: { className?: string; title?: string; mono?: boolean }) {
  return (
    <svg viewBox="-8.0 -24 793.0 122.0" role="img" aria-label={title} className={cn('h-auto', className)}>
      <g fill="none" stroke="currentColor" strokeWidth={12} strokeLinejoin="round">
        {LETTERS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <rect x="626.00" y="6.00" width="119.00" height="78.00" rx="22.00" fill={mono ? 'none' : '#EC008B'} stroke="currentColor" strokeWidth={12} />
      <circle cx="766.0" cy="-11" r="11" fill="none" stroke="currentColor" strokeWidth={2} />
      <text x="766.0" y="-7.5" fontFamily="Arial, sans-serif" fontSize="10" textAnchor="middle" fill="currentColor">
        TM
      </text>
    </svg>
  );
}
