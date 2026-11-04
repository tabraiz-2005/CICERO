import { getImageProps } from 'next/image';
import { canOptimize } from '@/components/ui/Img';
import { cn } from '@/lib/utils';

const optimised = (src: string, alt: string) =>
  canOptimize(src) ? getImageProps({ src, alt, fill: true, sizes: '100vw', quality: 85 }).props.srcSet ?? src : src;

/**
 * Campaign hero with art direction: phones get the portrait photo, computers
 * the landscape one. Only the image for the current screen is downloaded.
 */
export function HeroImage({ desktop, mobile, alt }: { desktop: string; mobile?: string | null; alt: string }) {
  const desktopSet = optimised(desktop, alt);
  const mobileSet = mobile ? optimised(mobile, alt) : null;
  return (
    <picture>
      {mobileSet && <source media="(max-width: 1023px)" srcSet={mobileSet} sizes="100vw" />}
      <source media="(min-width: 1024px)" srcSet={desktopSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={desktop}
        alt={alt}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className={cn(
          'absolute inset-0 h-full w-full object-cover',
          mobile ? 'object-center' : 'object-[72%_center] lg:object-center'
        )}
      />
    </picture>
  );
}
