import { getProducts, getCollectionBySlug } from '@/lib/commerce/supabaseApi';
import { PLPTemplate } from '@/components/product/PLPTemplate';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const collectionInfo = await getCollectionBySlug(slug);
  const products = await getProducts({ collection: slug });

  if (!collectionInfo && products.length === 0) {
    notFound();
  }

  const collectionName =
    collectionInfo?.name || slug.replace(/-/g, ' ');

  return (
    <PLPTemplate
      title={collectionName}
      subtitle={collectionInfo?.season.toUpperCase() || 'CURATED CAPSULE'}
      description={collectionInfo?.description}
      heroImage={collectionInfo?.heroImage}
      breadcrumbs={[
        { label: 'Collections', href: '/collections' },
        {
          label: collectionName,
          href: `/collections/${slug}`,
        },
      ]}
      products={products}
    />
  );
}