'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/commerce/types';
import { formatPrice } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Toast } from '@/components/ui/Toast';

interface ProductCardProps {
  product: Product;
  aspectRatio?: 'portrait' | 'square';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = 'portrait',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors[0]?.name || ''
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { currency } = useLocalization();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || '';
  const hoverImage =
    product.images.find((img) => img.isHover)?.url ||
    product.images[1]?.url ||
    primaryImage;

  const isLiked = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants[0];
    if (variant) {
      addItem(product, variant, 1);
      setToastMessage(`${product.title} added to your shopping bag.`);
      setShowToast(true);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product, selectedColor);
  };

  const aspectClasses =
    aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <>
      <div
        className="group relative flex flex-col space-y-3 font-sans transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Visual Media Container */}
        <div className={`relative w-full ${aspectClasses} bg-maison-stone/20 overflow-hidden`}>
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={isHovered ? hoverImage : primaryImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 bg-maison-ivory/80 backdrop-blur-xs rounded-full border border-maison-stone/40 text-maison-obsidian hover:bg-maison-ivory transition-all duration-200 shadow-sm z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-4 h-4 stroke-[1.5] transition-colors ${
                isLiked ? 'fill-maison-obsidian text-maison-obsidian' : 'text-maison-obsidian'
              }`}
            />
          </button>

          {/* Quick Add Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-maison-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center z-10">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 px-4 bg-maison-ivory text-maison-obsidian hover:bg-maison-warm-white text-[10px] font-medium tracking-[0.2em] uppercase transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>QUICK ADD &bull; {product.availableSizes[0] || 'S'}</span>
            </button>
          </div>
        </div>

        {/* Product Meta */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.18em] text-maison-taupe">
              {product.category}
            </span>
            {product.isNewArrival && (
              <span className="text-[9px] uppercase tracking-[0.18em] text-maison-gold font-medium">
                New Arrival
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif text-base text-maison-obsidian group-hover:text-maison-taupe transition-colors leading-snug line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-medium text-maison-obsidian tracking-wide">
              {formatPrice(product.price, currency)}
            </span>

            {/* Color Swatches */}
            {product.availableColors.length > 0 && (
              <div className="flex items-center space-x-1.5">
                {product.availableColors.slice(0, 3).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-3 h-3 rounded-full border transition-transform ${
                      selectedColor === c.name
                        ? 'scale-125 border-maison-obsidian'
                        : 'border-maison-stone/60'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        title="Bag Updated"
        message={toastMessage}
        type="cart"
      />
    </>
  );
};
