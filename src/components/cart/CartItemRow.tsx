'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { CartItem } from '@/lib/commerce/types';
import { formatPrice } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onMoveToWishlist?: (item: CartItem) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
}) => {
  const { currency } = useLocalization();

  return (
    <div className="flex space-x-4 py-4 border-b border-maison-stone/40 font-sans">
      {/* Product Image Thumbnail */}
      <Link href={`/products/${item.productSlug}`} className="relative w-20 h-28 bg-maison-stone/30 flex-shrink-0 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Details & Actions */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex justify-between items-start">
            <Link
              href={`/products/${item.productSlug}`}
              className="font-serif text-base font-normal text-maison-obsidian hover:text-maison-taupe transition-colors leading-snug"
            >
              {item.title}
            </Link>
            <div className="text-xs font-medium text-maison-obsidian ml-2">
              {formatPrice(item.price * item.quantity, currency)}
            </div>
          </div>

          <div className="text-xs text-maison-taupe mt-1 space-x-2">
            <span>Color: {item.color}</span>
            <span>&bull;</span>
            <span>Size: {item.size}</span>
          </div>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center justify-between pt-1">
          {/* Quantity Counter */}
          <div className="flex items-center border border-maison-stone/60 bg-maison-surface">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1.5 text-maison-charcoal hover:text-maison-obsidian transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-3 text-xs font-medium text-maison-obsidian">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 text-maison-charcoal hover:text-maison-obsidian transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Action Links */}
          <div className="flex items-center space-x-3 text-[11px] text-maison-taupe">
            {onMoveToWishlist && (
              <button
                onClick={() => onMoveToWishlist(item)}
                className="hover:text-maison-obsidian transition-colors flex items-center space-x-1"
              >
                <Heart className="w-3 h-3" />
                <span>Save</span>
              </button>
            )}
            <button
              onClick={() => onRemove(item.id)}
              className="hover:text-red-700 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
