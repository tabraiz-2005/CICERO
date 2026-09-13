import React from 'react';

export const metadata = { title: 'Cookie Policy | LUCEVALIE' };

export default function CookiesPage() {
  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="space-y-3 border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-maison-taupe">LEGAL DISCLOSURE</span>
          <h1 className="font-serif text-4xl font-normal">Cookie & Preference Policy</h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-maison-charcoal leading-relaxed font-light">
          <p>
            LUCEVALIE uses essential cookies to remember your currency selections, shopping bag items, and wishlist preferences across sessions.
          </p>

          <h3 className="font-serif text-2xl text-maison-obsidian pt-4">Managing Preferences</h3>
          <p>
            You can modify or disable non-essential cookies at any time through your browser settings or via our regional selector footer modal.
          </p>
        </div>
      </div>
    </div>
  );
}
