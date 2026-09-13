import { getProducts } from '@/lib/commerce/supabaseApi';
import { HeroSection } from '@/components/home/HeroSection';
import { EditorialStory } from '@/components/home/EditorialStory';
import { FeaturedCollectionGrid } from '@/components/home/FeaturedCollectionGrid';
import { SignatureCraftSection } from '@/components/home/SignatureCraftSection';
import { CategoryBanners } from '@/components/home/CategoryBanners';
import { WorldOfLucevalie } from '@/components/home/WorldOfLucevalie';
import { ConciergeBanner } from '@/components/home/ConciergeBanner';

export const revalidate = 3600; // SSG revalidation

export default async function HomePage() {
  const womenProducts = await getProducts({ gender: 'women' });
  const menProducts = await getProducts({ gender: 'men' });

  return (
    <div className="space-y-0">
      {/* 01 — Cinematic Hero */}
      <HeroSection />

      {/* 02 — Seasonal Editorial Story */}
      <EditorialStory />

      {/* 03 — Women's New Arrivals */}
      <FeaturedCollectionGrid
        title="Women's New Arrivals"
        subtitle="AUTUMN / WINTER 2026 CAPSULE"
        gender="women"
        products={womenProducts}
        viewAllLink="/women"
      />

      {/* 04 — Men's New Arrivals */}
      <FeaturedCollectionGrid
        title="Men's Sartorial Arrivals"
        subtitle="DECONSTRUCTED TAILORING & FINE KNITWEAR"
        gender="men"
        products={menProducts}
        viewAllLink="/men"
      />

      {/* 05 — Signature Cashmere Atelier Feature */}
      <SignatureCraftSection />

      {/* 06 — Category Stories */}
      <CategoryBanners />

      {/* 07 — The World of LUCEVALIE */}
      <WorldOfLucevalie />

      {/* 08 — Private Client Concierge */}
      <ConciergeBanner />
    </div>
  );
}
