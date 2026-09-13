'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '@/lib/commerce/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isGiftWrapped: boolean;
  setGiftWrapped: (wrapped: boolean) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isGiftWrapped, setGiftWrapped] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lucevalie_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lucevalie_cart', JSON.stringify(items));
    } catch {
      // fallback
    }
  }, [items]);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.variantId === variant.id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(
          updated[existingIndex].quantity + quantity,
          variant.inventoryQuantity || 10
        );
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        setLastAddedItem(updated[existingIndex]);
        return updated;
      }

      const primaryImage = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url || '';

      const newItem: CartItem = {
        id: `${product.id}-${variant.id}`,
        productId: product.id,
        productSlug: product.slug,
        variantId: variant.id,
        title: product.title,
        color: variant.color,
        size: variant.size,
        price: variant.price || product.price,
        image: primaryImage,
        quantity,
        maxQuantity: variant.inventoryQuantity || 10,
      };

      setLastAddedItem(newItem);
      return [...prevItems, newItem];
    });

    setIsCartOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isGiftWrapped,
        setGiftWrapped,
        giftMessage,
        setGiftMessage,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
