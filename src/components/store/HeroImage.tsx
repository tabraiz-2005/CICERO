'use client';

import { getImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { canOptimize } from '@/components/ui/Img';
import { cn } from '@/lib/utils';

const optimised = (src: string, alt: string) =>
  canOptimize(src) ? getImageProps({ src, alt, fill: true, sizes: '100vw', quality: 85 }).props.srcSet ?? src : src;

/**
 * Campaign hero that fits its photo: the block takes the shape of the image
 * (portrait on phones, landscape on computers), so the whole picture is shown
 * instead of being cropped. Phones get the portrait photo when one is set.
 */
export function HeroSection({
  desktop,
  mobile,
  alt,
  children,
}: {
  desktop: string;
  mobile?: string | null;
  alt: string;
  children: React.ReactNode;
}) {
  const img = useRef<HTMLImageElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const measure = () => {
    const el = img.current;
    if (el && el.naturalWidth && el.naturalHeight) setRatio(el.naturalWidth / el.naturalHeight);
  };
  useEffect(measure, []);

  const desktopSet = optimised(desktop, alt);
  const mobileSet = mobile ? optimised(mobile, alt) : null;

  return (
    <section
      style={ratio ? { aspectRatio: String(ratio) } : undefined}
      className={cn(
        'relative w-full overflow-hidden bg-black',
        // Before the photo loads: a sensible shape. After: the photo's own shape.
        !ratio && (mobile ? 'aspect-[2/3] lg:aspect-[16/9]' : 'aspect-[3/4] lg:aspect-[16/9]'),
        // Never taller than the screen, never too short to hold the headline.
        'max-h-[calc(100svh-var(--header-h)-36px)] min-h-[600px] lg:max-h-[calc(100svh-var(--header-h)-64px)] lg:min-h-[540px]'
      )}
    >
      <picture>
        {mobileSet && <source media="(max-width: 1023px)" srcSet={mobileSet} sizes="100vw" />}
        <source media="(min-width: 1024px)" srcSet={desktopSet} sizes="100vw" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={img}
          src={desktop}
          alt={alt}
          onLoad={measure}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className={cn('absolute inset-0 h-full w-full object-cover', mobile ? 'object-center' : 'object-[72%_center] lg:object-center')}
        />
      </picture>
      {/* Keep the centred headline readable on any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 via-[50%] to-transparent" />
      {children}
    </section>
  );
}
