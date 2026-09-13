import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Customer Care & Advisors | LUCEVALIE',
  description: 'Unobtrusive luxury customer support via email, phone, and WhatsApp.',
};

export default function CustomerCarePage() {
  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            ALWAYS AT YOUR SERVICE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal">
            Customer Care & Assistance
          </h1>
          <p className="font-serif italic text-base text-maison-charcoal leading-relaxed font-light">
            Our private client advisors provide attentive assistance across global time zones.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-maison-surface border border-maison-stone/50 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-maison-warm-white border border-maison-stone/60 flex items-center justify-center mx-auto text-maison-obsidian">
              <Mail className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl">Email Correspondence</h3>
            <p className="text-xs text-maison-taupe leading-relaxed">
              For order inquiries, garment care advice, or atelier consultations.
            </p>
            <a href="mailto:concierge@lucevalie.com" className="text-xs font-semibold text-maison-obsidian underline block pt-2">
              concierge@lucevalie.com
            </a>
          </div>

          <div className="p-8 bg-maison-surface border border-maison-stone/50 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-maison-warm-white border border-maison-stone/60 flex items-center justify-center mx-auto text-maison-obsidian">
              <Phone className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl">Telephone Advisory</h3>
            <p className="text-xs text-maison-taupe leading-relaxed">
              Available Monday to Saturday, 9:00 AM – 8:00 PM CET.
            </p>
            <a href="tel:+390212345678" className="text-xs font-semibold text-maison-obsidian underline block pt-2">
              +39 (02) 1234 5678
            </a>
          </div>

          <div className="p-8 bg-maison-surface border border-maison-stone/50 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-maison-warm-white border border-maison-stone/60 flex items-center justify-center mx-auto text-maison-obsidian">
              <MessageCircle className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl">Direct WhatsApp</h3>
            <p className="text-xs text-maison-taupe leading-relaxed">
              Instant messaging assistance for fitting & urgent requests.
            </p>
            <a href="https://wa.me/390212345678" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-maison-obsidian underline block pt-2">
              Start WhatsApp Chat
            </a>
          </div>
        </div>

        {/* Directory Links */}
        <div className="p-8 bg-maison-warm-white border border-maison-stone/50 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs uppercase tracking-wider text-center">
          <Link href="/shipping" className="hover:text-maison-gold transition-colors py-2 border-b border-maison-stone/40">
            Shipping Policy
          </Link>
          <Link href="/returns" className="hover:text-maison-gold transition-colors py-2 border-b border-maison-stone/40">
            Returns & Exchanges
          </Link>
          <Link href="/size-guide" className="hover:text-maison-gold transition-colors py-2 border-b border-maison-stone/40">
            Atelier Size Guide
          </Link>
          <Link href="/faq" className="hover:text-maison-gold transition-colors py-2 border-b border-maison-stone/40">
            Maison FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
