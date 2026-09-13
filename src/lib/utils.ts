import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CurrencyCode } from './commerce/types';
import { CURRENCIES } from './commerce/mockCatalog';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInUSD: number, currencyCode: CurrencyCode = 'USD'): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = priceInUSD * config.rate;

  if (currencyCode === 'JPY') {
    return `${config.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  }

  return `${config.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
