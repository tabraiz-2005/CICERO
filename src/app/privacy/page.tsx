import React from 'react';

export const metadata = { title: 'Privacy Policy | LUCEVALIE' };

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="space-y-3 border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-maison-taupe">LEGAL DISCLOSURE</span>
          <h1 className="font-serif text-4xl font-normal">Privacy & Data Policy</h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-maison-charcoal leading-relaxed font-light">
          <p>
            LUCEVALIE Maison S.A. values your privacy and handles personal client data with absolute discretion and strict compliance under the EU General Data Protection Regulation (GDPR).
          </p>

          <h3 className="font-serif text-2xl text-maison-obsidian pt-4">Data Collection & Use</h3>
          <p>
            We collect personal details (name, shipping address, email, telephone) solely for fulfilling orders, managing private appointments, and delivering requested private correspondence.
          </p>

          <h3 className="font-serif text-2xl text-maison-obsidian pt-4">Security</h3>
          <p>
            Payment transactions are processed using certified PCI-DSS Level 1 tokenized encryption. Raw credit card data is never stored on LUCEVALIE servers.
          </p>
        </div>
      </div>
    </div>
  );
}
