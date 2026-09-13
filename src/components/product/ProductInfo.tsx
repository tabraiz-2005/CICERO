'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/commerce/types';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { Toast } from '@/components/ui/Toast';
import { SizeGuideModal } from './SizeGuideModal';
import { PrivateAssistanceModal } from './PrivateAssistanceModal';
import { useLocalization } from '@/context/LocalizationContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingBag, MessageSquare, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product.availableSizes[0] || ''
  );
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { currency } = useLocalization();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const isLiked = isWishlisted(product.id);

  const handleAddToBag = () => {
    // Find matching variant or fallback
    const variant =
      product.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      ) || product.variants[0];

    if (variant) {
      addItem(product, variant, 1);
      setShowToast(true);
    }
  };

  const accordionItems = [
    {
      id: 'description',
      title: 'Description & Details',
      content: (
        <div className="space-y-3">
          <p>{product.description}</p>
          <ul className="list-disc pl-4 space-y-1 text-xs">
            <li>Unlined interior split construction</li>
            <li>Self-tie waist sash belt</li>
            <li>Deep welt side pockets</li>
            <li>Hand-finished seams throughout</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'materials',
      title: 'Materials & Craftsmanship',
      content: (
        <div className="space-y-3">
          <p>
            <span className="font-semibold uppercase tracking-wider text-maison-obsidian">Composition:</span> {product.material}
          </p>
          <p>{product.craftsmanshipNotes}</p>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Atelier Garment Care',
      content: (
        <ul className="list-disc pl-4 space-y-1 text-xs">
          {product.careInstructions.map((care, idx) => (
            <li key={idx}>{care}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'shipping',
      title: 'Complimentary Delivery & Returns',
      content: (
        <div className="space-y-2 text-xs">
          <p>{product.shippingInfo}</p>
          <p>All items are shipped in signature LUCEVALIE magnetic box packaging with garment covers.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header Meta */}
      <div className="space-y-2 border-b border-maison-stone/40 pb-6">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-maison-taupe">
          <span>{product.collection.replace(/-/g, ' ')}</span>
          <span>SKU: {product.sku}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-maison-obsidian leading-tight">
          {product.title}
        </h1>

        {product.subtitle && (
          <p className="font-serif italic text-sm text-maison-taupe">{product.subtitle}</p>
        )}

        <div className="pt-2 text-xl font-medium text-maison-obsidian">
          {formatPrice(product.price, currency)}
        </div>
      </div>

      {/* Color Selector */}
      {product.availableColors.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium uppercase tracking-[0.16em] text-maison-charcoal">
              Color: <span className="text-maison-obsidian font-normal">{selectedColor}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {product.availableColors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`flex items-center space-x-2 p-1.5 border transition-all ${
                  selectedColor === c.name
                    ? 'border-maison-obsidian bg-maison-warm-white'
                    : 'border-maison-stone/60 bg-transparent hover:border-maison-stone-dark'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-maison-stone/60"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs text-maison-charcoal tracking-wide px-1">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {product.availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium uppercase tracking-[0.16em] text-maison-charcoal">
              Select Size:
            </span>
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-[11px] uppercase tracking-[0.18em] text-maison-obsidian border-b border-maison-obsidian/60 hover:border-maison-obsidian pb-0.5"
            >
              Atelier Size Guide
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 text-xs uppercase tracking-widest font-medium border transition-all ${
                  selectedSize === size
                    ? 'border-maison-obsidian bg-maison-obsidian text-maison-ivory'
                    : 'border-maison-stone/60 bg-maison-surface/60 text-maison-obsidian hover:border-maison-obsidian'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-maison-taupe pt-1">{product.fitInfo}</p>
        </div>
      )}

      {/* Primary Actions (Add to Bag & Wishlist) */}
      <div className="space-y-3 pt-2">
        <Button fullWidth variant="primary" size="lg" onClick={handleAddToBag}>
          <ShoppingBag className="w-4 h-4 mr-2" />
          ADD TO BAG &bull; {formatPrice(product.price, currency)}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleWishlist(product, selectedColor, selectedSize)}
            className="flex items-center justify-center space-x-2 py-3 px-4 border border-maison-stone/70 text-xs tracking-[0.18em] uppercase text-maison-obsidian hover:bg-maison-warm-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-maison-obsidian' : ''}`} />
            <span>{isLiked ? 'IN WISHLIST' : 'SAVE TO WISHLIST'}</span>
          </button>

          <button
            onClick={() => setIsAssistanceOpen(true)}
            className="flex items-center justify-center space-x-2 py-3 px-4 border border-maison-stone/70 text-xs tracking-[0.18em] uppercase text-maison-obsidian hover:bg-maison-warm-white transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-maison-taupe" />
            <span>SPEAK WITH ADVISOR</span>
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-maison-stone/40 text-[10px] text-maison-taupe uppercase tracking-widest text-center">
        <div className="p-3 bg-maison-surface/60 border border-maison-stone/30 flex flex-col items-center space-y-1">
          <Truck className="w-4 h-4 text-maison-taupe" />
          <span>Complimentary Express Shipping</span>
        </div>
        <div className="p-3 bg-maison-surface/60 border border-maison-stone/30 flex flex-col items-center space-y-1">
          <RefreshCw className="w-4 h-4 text-maison-taupe" />
          <span>30-Day Easy Returns</span>
        </div>
        <div className="p-3 bg-maison-surface/60 border border-maison-stone/30 flex flex-col items-center space-y-1">
          <ShieldCheck className="w-4 h-4 text-maison-taupe" />
          <span>Certified Authenticity</span>
        </div>
      </div>

      {/* Accordion Info */}
      <div className="pt-4">
        <Accordion items={accordionItems} defaultOpenId="description" />
      </div>

      {/* Modals & Toast */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />

      <PrivateAssistanceModal
        isOpen={isAssistanceOpen}
        onClose={() => setIsAssistanceOpen(false)}
        productTitle={product.title}
      />

      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        title="Added to Bag"
        message={`${product.title} (${selectedSize}) is now in your bag.`}
        type="cart"
      />
    </div>
  );
};
