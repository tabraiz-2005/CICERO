import type { Metadata } from 'next';
import { getSettings } from '@/lib/commerce/catalog';
import { CheckoutForm } from './CheckoutForm';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const [settings, sp] = await Promise.all([getSettings(), searchParams]);
  return (
    <CheckoutForm
      cancelled={sp.cancelled === '1'}
      shipping={{
        standard: settings.standard_shipping_amount,
        express: settings.express_shipping_amount,
        freeThreshold: settings.free_shipping_threshold,
      }}
    />
  );
}
