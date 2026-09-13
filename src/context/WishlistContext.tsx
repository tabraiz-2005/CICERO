'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem, Product } from '@/lib/commerce/types';

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  isWishlisted: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lucevalie_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lucevalie_wishlist', JSON.stringify(wishlist));
    } catch {
      // fallback
    }
  }, [wishlist]);

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product: Product, selectedColor?: string, selectedSize?: string) => {
    if (isWishlisted(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
    } else {
      const primaryImage = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url || '';
      const newItem: WishlistItem = {
        productId: product.id,
        productSlug: product.slug,
        title: product.title,
        category: product.category,
        price: product.price,
        image: primaryImage,
        selectedColor,
        selectedSize,
        addedAt: new Date().toISOString(),
      };
      setWishlist((prev) => [newItem, ...prev]);
    }
  };

  const removeItem = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        removeItem,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
