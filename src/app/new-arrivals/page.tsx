import { getProducts } from '@/lib/commerce/api';
import { PLPTemplate } from '@/components/product/PLPTemplate';

export default async function NewArrivalsPage() {
  const products = await getProducts({ sort: 'newest' });

  return (
    <PLPTemplate
      title="New Arrivals"
      subtitle="AUTUMN / WINTER 2026 EDITION"
      description="Discover the newest creations from our Italian ateliers, featuring handcrafted cashmere, soft tailoring, and Tuscan leather goods."
      breadcrumbs={[{ label: 'New Arrivals', href: '/new-arrivals' }]}
      products={products}
    />
  );
}
