'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Gift, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    isGiftWrapped,
    setGiftWrapped,
    giftMessage,
    setGiftMessage,
    subtotal,
    itemCount,
  } = useCart();
  const { currency } = useLocalization();

  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="space-y-3 text-center sm:text-left border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            YOUR SELECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-maison-obsidian">
            Shopping Bag ({itemCount})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <h2 className="font-serif text-3xl font-normal text-maison-obsidian">Your Bag is Empty</h2>
            <p className="text-xs text-maison-taupe max-w-sm mx-auto leading-relaxed">
              Explore our latest European tailored outerwear and Mongolian cashmere atelier creations.
            </p>
            <div>
              <Link href="/new-arrivals">
                <Button variant="primary" size="lg">EXPLORE NEW ARRIVALS</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Items Column */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-5 p-8 bg-maison-surface border border-maison-stone/50 space-y-6 lg:sticky lg:top-28">
              <h3 className="font-serif text-2xl font-normal text-maison-obsidian">Order Summary</h3>

              {/* Complimentary Gift Box option */}
              <div className="p-4 bg-maison-ivory border border-maison-stone/40 space-y-3 text-xs">
                <label className="flex items-center space-x-2 font-medium cursor-pointer uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isGiftWrapped}
                    onChange={(e) => setGiftWrapped(e.target.checked)}
                    className="accent-maison-obsidian"
                  />
                  <Gift className="w-4 h-4 text-maison-taupe inline" />
                  <span>Complimentary Luxury Gift Box</span>
                </label>
                {isGiftWrapped && (
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Include a personalized handwritten card message..."
                    rows={2}
                    className="w-full text-xs bg-maison-surface border border-maison-stone/60 p-2.5 text-maison-obsidian focus:outline-none"
                  />
                )}
              </div>

              <div className="space-y-3 text-xs border-t border-maison-stone/40 pt-4">
                <div className="flex justify-between">
                  <span className="text-maison-charcoal">Subtotal</span>
                  <span className="font-medium text-maison-obsidian">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-maison-charcoal">Global Express Delivery</span>
                  <span className="text-maison-gold font-medium uppercase tracking-wider">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-maison-charcoal">Estimated Taxes & Duties</span>
                  <span className="text-maison-taupe">Calculated at Checkout</span>
                </div>
              </div>

              <div className="pt-4 border-t border-maison-stone/50 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-xl text-maison-obsidian">Estimated Total</span>
                  <span className="font-sans font-medium text-xl text-maison-obsidian">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                <Link href="/checkout" className="block pt-2">
                  <Button fullWidth variant="primary" size="lg">
                    <Lock className="w-4 h-4 mr-2" />
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-maison-taupe tracking-widest uppercase pt-2">
                  <ShieldCheck className="w-4 h-4 text-maison-taupe" />
                  <span>256-Bit Encrypted Secure Maison Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
