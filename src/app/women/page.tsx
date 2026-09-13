import { getProducts } from '@/lib/commerce/api';
import { PLPTemplate } from '@/components/product/PLPTemplate';

export default async function WomenPage() {
  const products = await getProducts({ gender: 'women' });

  return (
    <PLPTemplate
      title="Women's Collection"
      subtitle="AUTUMN / WINTER 2026"
      description="Sculpted double-faced outerwear, fluid virgin wool tailoring, and featherlight Mongolian cashmere."
      breadcrumbs={[{ label: 'Women', href: '/women' }]}
      products={products}
    />
  );
}
