'use client';

import React from 'react';
import Link from 'next/link';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { CartItemRow } from './CartItemRow';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/utils';
import { Gift, Lock, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    isGiftWrapped,
    setGiftWrapped,
    giftMessage,
    setGiftMessage,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    itemCount,
  } = useCart();
  const { currency } = useLocalization();
  const { toggleWishlist } = useWishlist();

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title="Shopping Bag"
      subtitle={`${itemCount} ${itemCount === 1 ? 'ITEM' : 'ITEMS'} SELECTED`}
      width="md"
      footer={
        items.length > 0 ? (
          <div className="space-y-4 font-sans">
            {/* Complimentary Packaging Option */}
            <div className="p-4 bg-maison-warm-white border border-maison-stone/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs font-medium text-maison-obsidian uppercase tracking-wider cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftWrapped}
                    onChange={(e) => setGiftWrapped(e.target.checked)}
                    className="accent-maison-obsidian"
                  />
                  <Gift className="w-4 h-4 text-maison-taupe inline" />
                  <span>Complimentary Luxury Gift Packaging</span>
                </label>
              </div>

              {isGiftWrapped && (
                <div className="pt-2 animate-fade-in">
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Include a personalized handwritten card message..."
                    rows={2}
                    className="w-full text-xs bg-maison-ivory border border-maison-stone/60 p-2.5 text-maison-obsidian placeholder:text-maison-taupe-light focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Subtotal & Delivery Notes */}
            <div className="space-y-2 pt-2 border-t border-maison-stone/40">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-serif text-lg text-maison-obsidian">Subtotal</span>
                <span className="font-sans font-medium text-base text-maison-obsidian">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <p className="text-[11px] text-maison-taupe">
                Duties & taxes calculated at checkout. Express delivery included.
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                <Button fullWidth variant="primary" size="lg">
                  <Lock className="w-3.5 h-3.5 mr-2" />
                  PROCEED TO CHECKOUT
                </Button>
              </Link>

              <Link href="/cart" onClick={() => setIsCartOpen(false)} className="block">
                <Button fullWidth variant="outline" size="md">
                  VIEW FULL SHOPPING BAG
                </Button>
              </Link>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-maison-taupe tracking-widest uppercase pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-maison-taupe" />
              <span>256-Bit Encrypted Secure Maison Checkout</span>
            </div>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div className="text-center py-16 space-y-4 font-sans">
          <div className="w-16 h-16 rounded-full bg-maison-warm-white border border-maison-stone/50 flex items-center justify-center mx-auto text-maison-taupe">
            <Gift className="w-6 h-6 stroke-[1.2]" />
          </div>
          <h3 className="font-serif text-2xl font-normal text-maison-obsidian">
            Your Bag is Empty
          </h3>
          <p className="text-xs text-maison-taupe max-w-xs mx-auto leading-relaxed">
            Explore our latest collections and cashmere atelier creations to add items to your selection.
          </p>
          <div className="pt-4">
            <Link href="/new-arrivals" onClick={() => setIsCartOpen(false)}>
              <Button variant="primary">EXPLORE NEW ARRIVALS</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2 divide-y divide-maison-stone/30">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              onMoveToWishlist={(i) => {
                removeItem(i.id);
                // add mock product to wishlist
                toggleWishlist({
                  id: i.productId,
                  slug: i.productSlug,
                  title: i.title,
                  category: 'outerwear',
                  price: i.price,
                  images: [{ url: i.image, alt: i.title, width: 800, height: 1000 }],
                } as any);
              }}
            />
          ))}
        </div>
      )}
    </Drawer>
  );
};
