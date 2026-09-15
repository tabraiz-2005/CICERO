'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocalization } from '@/context/LocalizationContext';
import { Globe, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currency, setIsCountryModalOpen } = useLocalization();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-maison-espresso text-maison-ivory border-t border-maison-charcoal/60 font-sans">
      {/* Private Correspondence Newsletter Section */}
      <div className="border-b border-maison-charcoal/50 py-16 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-maison-parchment">
            PRIVATE CORRESPONDENCE
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-normal text-maison-ivory tracking-wide">
            Invitations to New Collections & Maison Stories
          </h3>
          <p className="text-xs sm:text-sm text-maison-stone-dark font-light max-w-xl mx-auto leading-relaxed">
            Receive private preview access, seasonal campaign literature, and bespoke concierge invitations from LUCEVALIE.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center space-x-3 text-xs tracking-[0.16em] uppercase text-maison-parchment bg-maison-charcoal/60 border border-maison-stone/30 px-6 py-4">
              <Check className="w-4 h-4 text-maison-gold stroke-[2]" />
              <span>You are now subscribed to Private Correspondence.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex items-center border-b border-maison-stone/50 pb-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent text-xs text-maison-ivory placeholder:text-maison-taupe focus:outline-none tracking-wide"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-[0.2em] text-maison-ivory hover:text-maison-parchment transition-colors flex items-center space-x-2 pl-4"
              >
                <span>JOIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Multi-Column Directory */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-6 border-b md:border-b-0 pb-8 md:pb-0 border-maison-charcoal/50">
          <Link href="/" className="font-serif text-2xl tracking-[0.28em] font-normal uppercase text-maison-ivory">
            LUCEVALIE
          </Link>
          <p className="text-xs text-maison-stone-dark font-light leading-relaxed max-w-sm">
            An emerging European luxury maison devoted to quiet refinement, unyielding craftsmanship, and timeless human artistry.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsCountryModalOpen(true)}
              className="inline-flex items-center space-x-2 text-xs tracking-[0.16em] uppercase text-maison-stone hover:text-maison-ivory transition-colors border border-maison-charcoal px-4 py-2.5"
            >
              <Globe className="w-4 h-4 text-maison-taupe" />
              <span>REGION: UNITED STATES ({currency})</span>
            </button>
          </div>
        </div>

        {/* Collections Links */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-maison-parchment">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs text-maison-stone-dark">
            <li><Link href="/women" className="hover:text-maison-ivory transition-colors">Women&apos;s Maison</Link></li>
            <li><Link href="/men" className="hover:text-maison-ivory transition-colors">Men&apos;s Maison</Link></li>
            <li><Link href="/collections/autumn-winter-2026" className="hover:text-maison-ivory transition-colors">Autumn / Winter 2026</Link></li>
            <li><Link href="/collections/cashmere-atelier" className="hover:text-maison-ivory transition-colors">Cashmere Atelier</Link></li>
            <li><Link href="/collections/heritage-tailoring" className="hover:text-maison-ivory transition-colors">Heritage Tailoring</Link></li>
          </ul>
        </div>

        {/* The Maison Links */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-maison-parchment">
            The Maison
          </h4>
          <ul className="space-y-2.5 text-xs text-maison-stone-dark">
            <li><Link href="/maison" className="hover:text-maison-ivory transition-colors">Maison Ethos</Link></li>
            <li><Link href="/maison/craftsmanship" className="hover:text-maison-ivory transition-colors">Artisanal Ateliers</Link></li>
            <li><Link href="/journal" className="hover:text-maison-ivory transition-colors">Maison Journal</Link></li>
            <li><Link href="/private-client" className="hover:text-maison-ivory transition-colors">Private Client Concierge</Link></li>
          </ul>
        </div>

        {/* Customer Care Links */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-maison-parchment">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs text-maison-stone-dark">
            <li><Link href="/customer-care" className="hover:text-maison-ivory transition-colors">Advisors & Contact</Link></li>
            <li><Link href="/shipping" className="hover:text-maison-ivory transition-colors">Express Delivery</Link></li>
            <li><Link href="/returns" className="hover:text-maison-ivory transition-colors">Complimentary Returns</Link></li>
            <li><Link href="/size-guide" className="hover:text-maison-ivory transition-colors">Atelier Size Guide</Link></li>
            <li><Link href="/faq" className="hover:text-maison-ivory transition-colors">Frequently Asked Questions</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar & Legal Terms */}
      <div className="border-t border-maison-charcoal/50 py-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-maison-taupe tracking-widest space-y-4 md:space-y-0">
          <div className="text-center md:text-left space-y-2">
            <div>
              &copy; {new Date().getFullYear()} LUCEVALIE MAISON S.A. ALL RIGHTS RESERVED.
            </div>

            <div className="text-[10px] tracking-[0.16em]">
              Website designed and developed by{' '}
              <a
                href="https://digitalgravitas.ai/website-development/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-maison-stone hover:text-maison-ivory transition-colors"
              >
                Digital Gravitas
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-maison-ivory transition-colors">PRIVACY POLICY</Link>
            <Link href="/terms" className="hover:text-maison-ivory transition-colors">TERMS OF SERVICE</Link>
            <Link href="/cookies" className="hover:text-maison-ivory transition-colors">COOKIE PREFERENCES</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
