'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/** v2: the store moved to a light, Brunello-style default; older saved choices are ignored. */
export const THEME_KEY = 'cicero_theme_v2';

/** Inline script for <head>: applies the saved theme before first paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark')t='light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme');
    setTheme(t === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex h-9 w-9 items-center justify-center border border-line transition-colors hover:border-line-strong',
        className
      )}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-fg" strokeWidth={1.5} />
      ) : (
        <Moon className="h-4 w-4 text-fg" strokeWidth={1.5} />
      )}
    </button>
  );
}
