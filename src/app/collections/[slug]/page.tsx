import { getProducts, getCollectionBySlug } from '@/lib/commerce/api';
import { PLPTemplate } from '@/components/product/PLPTemplate';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const collectionInfo = await getCollectionBySlug(params.slug);
  const products = await getProducts({ collection: params.slug });

  if (!collectionInfo && products.length === 0) {
    notFound();
  }

  return (
    <PLPTemplate
      title={collectionInfo?.name || params.slug.replace(/-/g, ' ')}
      subtitle={collectionInfo?.season.toUpperCase() || 'CURATED CAPSULE'}
      description={collectionInfo?.description}
      heroImage={collectionInfo?.heroImage}
      breadcrumbs={[
        { label: 'Collections', href: '/collections' },
        { label: collectionInfo?.name || params.slug, href: `/collections/${params.slug}` },
      ]}
      products={products}
    />
  );
}
