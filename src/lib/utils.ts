import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a whole-currency amount (e.g. 34500 → "Rs 34,500"). */
export function formatPrice(amount: number, currency = 'PKR'): string {
  if (currency === 'PKR') return `Rs ${Math.round(amount).toLocaleString('en-US')}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format an amount stored in cents (orders, settings). */
export function formatCents(cents: number, currency = 'PKR'): string {
  return formatPrice(cents / 100, currency);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function primaryImage(images: { url: string; isPrimary?: boolean }[]): string {
  return images.find((i) => i.isPrimary)?.url || images[0]?.url || '';
}
