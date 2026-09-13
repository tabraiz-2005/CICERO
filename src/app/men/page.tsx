import { getProducts } from '@/lib/commerce/api';
import { PLPTemplate } from '@/components/product/PLPTemplate';

export default async function MenPage() {
  const products = await getProducts({ gender: 'men' });

  return (
    <PLPTemplate
      title="Men's Collection"
      subtitle="AUTUMN / WINTER 2026"
      description="Deconstructed sartorial tailoring, seamless 4-ply cashmere crewnecks, and hand-burnished leather footwear."
      breadcrumbs={[{ label: 'Men', href: '/men' }]}
      products={products}
    />
  );
}
