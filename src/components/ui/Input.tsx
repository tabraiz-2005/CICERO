'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-maison-charcoal">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full bg-maison-surface/70 border border-maison-stone/70 text-maison-obsidian px-4 py-3 text-xs tracking-wide placeholder:text-maison-taupe-light focus:outline-none focus:border-maison-obsidian focus:bg-maison-ivory transition-all duration-200',
            error && 'border-red-600 focus:border-red-600',
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-600 font-sans tracking-wide">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
