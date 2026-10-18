import type { Metadata } from 'next';
import { Catalogue, type CatalogueParams } from '@/components/store/Catalogue';

export const metadata: Metadata = { title: 'Women' };

export default async function WomenPage({ searchParams }: { searchParams: Promise<CatalogueParams> }) {
  return <Catalogue params={await searchParams} fixedGender="women" />;
}
