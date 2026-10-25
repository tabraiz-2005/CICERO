import type { Metadata } from 'next';
import { Catalogue, type CatalogueParams } from '@/components/store/Catalogue';

export const metadata: Metadata = {
  title: '999 Sale',
  description: 'Every piece for Rs 999: hoodies, sweatshirts and fleece trousers for men and women. Cash on Delivery across Pakistan.',
};

export default async function SalePage({ searchParams }: { searchParams: Promise<CatalogueParams> }) {
  const params = await searchParams;
  return (
    <Catalogue
      params={{ ...params, sale: '999' }}
      description="Every piece here is Rs 999. Limited stock, while sizes last."
    />
  );
}
