'use client';

import React, { useEffect } from 'react';
import { Check, ShoppingBag, Heart, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type?: 'cart' | 'wishlist' | 'success';
}

export const Toast: React.FC<ToastProps> = ({
  isVisible,
  onClose,
  title,
  message,
  type = 'success',
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icons = {
    cart: <ShoppingBag className="w-4 h-4 text-maison-obsidian stroke-[1.5]" />,
    wishlist: <Heart className="w-4 h-4 text-maison-obsidian fill-maison-obsidian stroke-[1.5]" />,
    success: <Check className="w-4 h-4 text-maison-obsidian stroke-[1.5]" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-maison-ivory border border-maison-stone shadow-2xl p-4 transition-all transform duration-300 animate-slide-up font-sans">
      <div className="flex items-start justify-between space-x-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-maison-warm-white border border-maison-stone/40">
            {icons[type]}
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-maison-obsidian">
              {title}
            </h4>
            {message && <p className="text-xs text-maison-taupe mt-0.5">{message}</p>}
          </div>
        </div>
        <button onClick={onClose} className="text-maison-charcoal hover:text-maison-obsidian p-1">
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
};
