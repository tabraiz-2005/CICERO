'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center tracking-[0.18em] uppercase transition-all duration-300 font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50';

    const variants = {
      primary:
        'bg-maison-obsidian text-maison-ivory hover:bg-maison-espresso border border-maison-obsidian active:scale-[0.99]',
      secondary:
        'bg-maison-warm-white text-maison-obsidian hover:bg-maison-stone border border-maison-stone/60',
      outline:
        'bg-transparent text-maison-obsidian border border-maison-obsidian/70 hover:border-maison-obsidian hover:bg-maison-obsidian hover:text-maison-ivory',
      ghost:
        'bg-transparent text-maison-obsidian hover:bg-maison-warm-white/60 border border-transparent',
      underline:
        'bg-transparent text-maison-obsidian hover:text-maison-taupe p-0 border-b border-maison-obsidian/40 hover:border-maison-taupe rounded-none tracking-[0.2em]',
    };

    const sizes = {
      sm: 'text-[11px] py-2 px-4',
      md: 'text-xs py-3.5 px-7',
      lg: 'text-xs py-4 px-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'underline' && sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center space-x-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
