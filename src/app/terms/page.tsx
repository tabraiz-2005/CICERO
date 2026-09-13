import React from 'react';

export const metadata = { title: 'Terms of Service | LUCEVALIE' };

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="space-y-3 border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-maison-taupe">LEGAL DISCLOSURE</span>
          <h1 className="font-serif text-4xl font-normal">Terms of Service</h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-maison-charcoal leading-relaxed font-light">
          <p>
            Welcome to LUCEVALIE. By accessing or shopping on our digital flagship, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h3 className="font-serif text-2xl text-maison-obsidian pt-4">Authenticity & Intellectual Property</h3>
          <p>
            All original designs, brand wordmarks, text, editorial essays, visual systems, and product descriptions are the exclusive intellectual property of LUCEVALIE Maison S.A.
          </p>
        </div>
      </div>
    </div>
  );
}
