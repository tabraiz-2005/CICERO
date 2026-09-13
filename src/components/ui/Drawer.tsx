'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  position?: 'right' | 'left';
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  position = 'right',
  children,
  footer,
  width = 'md',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  const positionClasses = {
    right: 'right-0 top-0 bottom-0 animate-slide-left',
    left: 'left-0 top-0 bottom-0 animate-slide-right',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-maison-obsidian/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          'fixed z-10 w-full h-full bg-maison-ivory shadow-2xl flex flex-col justify-between border-l border-maison-stone/50 transition-transform duration-300 ease-out',
          widths[width],
          positionClasses[position],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-maison-stone/40">
          <div>
            {title && (
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-maison-obsidian tracking-wide">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-sans text-[11px] text-maison-taupe uppercase tracking-[0.18em] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-maison-charcoal hover:text-maison-obsidian transition-colors duration-200"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">{children}</div>

        {/* Footer if provided */}
        {footer && (
          <div className="p-6 border-t border-maison-stone/40 bg-maison-surface">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
