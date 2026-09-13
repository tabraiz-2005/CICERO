'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useLocalization } from '@/context/LocalizationContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeItem } = useWishlist();
  const { currency } = useLocalization();
  const { addItem } = useCart();

  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="space-y-3 text-center sm:text-left border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            SAVED SELECTIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-maison-obsidian">
            Your Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <h2 className="font-serif text-3xl font-normal text-maison-obsidian">No Saved Items</h2>
            <p className="text-xs text-maison-taupe max-w-sm mx-auto leading-relaxed">
              Explore our collections and tap the heart icon on any piece to save it to your personal selection.
            </p>
            <div>
              <Link href="/new-arrivals">
                <Button variant="primary" size="lg">EXPLORE COLLECTIONS</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div key={item.productId} className="group flex flex-col space-y-3 border border-maison-stone/40 p-4 bg-maison-surface">
                <Link href={`/products/${item.productSlug}`} className="relative aspect-[3/4] bg-maison-stone/30 overflow-hidden block">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="space-y-1 pt-1 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-maison-taupe">{item.category}</span>
                    <h3 className="font-serif text-lg font-normal text-maison-obsidian leading-snug">{item.title}</h3>
                    <div className="text-xs font-medium text-maison-obsidian mt-1">{formatPrice(item.price, currency)}</div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      fullWidth
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        addItem(
                          {
                            id: item.productId,
                            slug: item.productSlug,
                            title: item.title,
                            category: item.category,
                            price: item.price,
                            images: [{ url: item.image, alt: item.title, width: 800, height: 1000 }],
                          } as any,
                          { id: `${item.productId}-var`, color: item.selectedColor || 'Default', size: item.selectedSize || 'S', price: item.price, inventoryQuantity: 5 } as any,
                          1
                        );
                      }}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      MOVE TO BAG
                    </Button>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="w-full text-[11px] uppercase tracking-widest text-maison-taupe hover:text-red-700 transition-colors flex items-center justify-center space-x-1 py-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>REMOVE</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
