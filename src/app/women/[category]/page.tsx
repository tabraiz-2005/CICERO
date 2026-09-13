import { getProducts, getCategoryBySlug } from '@/lib/commerce/api';
import { PLPTemplate } from '@/components/product/PLPTemplate';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function WomenCategoryPage({ params }: PageProps) {
  const { category } = await params;

  const categoryInfo = await getCategoryBySlug(category);
  const products = await getProducts({
    gender: 'women',
    category,
  });

  if (!categoryInfo && products.length === 0) {
    notFound();
  }

  const categoryName =
    categoryInfo?.name || category.replace(/-/g, ' ');

  return (
    <PLPTemplate
      title={`Women's ${categoryName}`}
      subtitle="ATELIER CATEGORY STORY"
      description={categoryInfo?.description}
      heroImage={categoryInfo?.heroImage}
      breadcrumbs={[
        { label: 'Women', href: '/women' },
        {
          label: categoryName,
          href: `/women/${category}`,
        },
      ]}
      products={products}
    />
  );
}