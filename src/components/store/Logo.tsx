import { cn } from '@/lib/utils';

/** Cicero wordmark — letters follow the text colour, the "O" is always brand magenta. */
export function Logo({ className, title = 'Cicero', mono }: { className?: string; title?: string; mono?: boolean }) {
  return (
    <svg viewBox="-2 -22 566.5 116" role="img" aria-label={title} className={cn('h-auto', className)}>
      <g fill="none" stroke="currentColor" strokeWidth={10.5} strokeLinejoin="round">
        <path d="M94,5.25 H26 A20.75,20.75 0 0 0 5.25,26 V64 A20.75,20.75 0 0 0 26,84.75 H94" />
        <path d="M113.25,0 V90" />
        <path d="M226.5,5.25 H158.5 A20.75,20.75 0 0 0 137.75,26 V64 A20.75,20.75 0 0 0 158.5,84.75 H226.5" />
        <path d="M322.5,5.25 H266.5 A20.75,20.75 0 0 0 245.75,26 V64 A20.75,20.75 0 0 0 266.5,84.75 H322.5 M245.75,45 H318.5" />
        <path d="M341.75,90 V26 A20.75,20.75 0 0 1 362.5,5.25 H400.5 A20.75,20.75 0 0 1 421.25,26 V28.8 A12.75,12.75 0 0 1 408.5,46.8 H341.75" />
        <path d="M408.5,46.8 A12.75,12.75 0 0 1 421.25,64.8 V90" />
      </g>
      <rect x="445.75" y="5.25" width="89.5" height="79.5" rx="22" fill={mono ? 'none' : '#EC008B'} stroke="currentColor" strokeWidth={10.5} />
      <circle cx="550.5" cy="-10" r="10" fill="none" stroke="currentColor" strokeWidth={1.8} />
      <text x="550.5" y="-6.8" fontFamily="Arial, sans-serif" fontSize="9" textAnchor="middle" fill="currentColor">
        TM
      </text>
    </svg>
  );
}
