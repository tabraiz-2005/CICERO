import { getProducts, getCategoryBySlug } from '@/lib/commerce/api';
import { PLPTemplate } from '@/components/product/PLPTemplate';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function MenCategoryPage({ params }: PageProps) {
  const { category } = await params;

  const categoryInfo = await getCategoryBySlug(category);
  const products = await getProducts({
    gender: 'men',
    category,
  });

  if (!categoryInfo && products.length === 0) {
    notFound();
  }

  const categoryName =
    categoryInfo?.name || category.replace(/-/g, ' ');

  return (
    <PLPTemplate
      title={`Men's ${categoryName}`}
      subtitle="ATELIER CATEGORY STORY"
      description={categoryInfo?.description}
      heroImage={categoryInfo?.heroImage}
      breadcrumbs={[
        { label: 'Men', href: '/men' },
        {
          label: categoryName,
          href: `/men/${category}`,
        },
      ]}
      products={products}
    />
  );
}