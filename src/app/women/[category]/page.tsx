import { getProducts, getCategoryBySlug } from '@/lib/commerce/api';
import { PLPTemplate } from '@/components/product/PLPTemplate';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { category: string };
}

export default async function WomenCategoryPage({ params }: PageProps) {
  const categoryInfo = await getCategoryBySlug(params.category);
  const products = await getProducts({ gender: 'women', category: params.category });

  if (!categoryInfo && products.length === 0) {
    notFound();
  }

  const categoryName = categoryInfo?.name || params.category.replace(/-/g, ' ');

  return (
    <PLPTemplate
      title={`Women's ${categoryName}`}
      subtitle="ATELIER CATEGORY STORY"
      description={categoryInfo?.description}
      heroImage={categoryInfo?.heroImage}
      breadcrumbs={[
        { label: 'Women', href: '/women' },
        { label: categoryName, href: `/women/${params.category}` },
      ]}
      products={products}
    />
  );
}
