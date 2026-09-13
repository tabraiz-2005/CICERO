import { getProducts, getCategoryBySlug } from '@/lib/commerce/api';
import { PLPTemplate } from '@/components/product/PLPTemplate';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { category: string };
}

export default async function MenCategoryPage({ params }: PageProps) {
  const categoryInfo = await getCategoryBySlug(params.category);
  const products = await getProducts({ gender: 'men', category: params.category });

  if (!categoryInfo && products.length === 0) {
    notFound();
  }

  const categoryName = categoryInfo?.name || params.category.replace(/-/g, ' ');

  return (
    <PLPTemplate
      title={`Men's ${categoryName}`}
      subtitle="ATELIER CATEGORY STORY"
      description={categoryInfo?.description}
      heroImage={categoryInfo?.heroImage}
      breadcrumbs={[
        { label: 'Men', href: '/men' },
        { label: categoryName, href: `/men/${params.category}` },
      ]}
      products={products}
    />
  );
}
