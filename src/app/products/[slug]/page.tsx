import { getProductBySlug, getProducts } from '@/lib/commerce/supabaseApi';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { CompleteTheLook } from '@/components/product/CompleteTheLook';
import { generateProductSchema } from '@/lib/seo/jsonLd';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.title} | LUCEVALIE Maison`,
    description: product.seoDescription || product.description,
    openGraph: {
      title: `${product.title} | LUCEVALIE`,
      description: product.description,
      images: [{ url: product.images[0]?.url || '' }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const productSchema = generateProductSchema(product);

  return (
    <div className="py-10 sm:py-16 bg-maison-ivory text-maison-obsidian font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <nav
          className="flex items-center space-x-2 text-[11px] text-maison-taupe tracking-widest uppercase"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="hover:text-maison-obsidian transition-colors"
          >
            Home
          </Link>

          <ChevronRight className="w-3 h-3 text-maison-stone-dark" />

          <Link
            href={`/${product.gender}`}
            className="hover:text-maison-obsidian transition-colors"
          >
            {product.gender}
          </Link>

          <ChevronRight className="w-3 h-3 text-maison-stone-dark" />

          <Link
            href={`/${product.gender}/${product.category}`}
            className="hover:text-maison-obsidian transition-colors"
          >
            {product.category}
          </Link>

          <ChevronRight className="w-3 h-3 text-maison-stone-dark" />

          <span className="text-maison-obsidian font-medium">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              title={product.title}
            />
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <ProductInfo product={product} />
          </div>
        </div>

        <CompleteTheLook
          title="Complete the Look"
          subtitle="CURATED HARMONIOUS PIECES"
          products={relatedProducts}
        />
      </div>
    </div>
  );
}