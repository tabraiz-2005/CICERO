'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, UserCheck, Gift, Headphones } from 'lucide-react';

export const ConciergeBanner: React.FC = () => {
  const services = [
    {
      icon: <Calendar className="w-5 h-5 stroke-[1.2] text-maison-gold" />,
      title: 'Private Boutique Appointments',
      desc: 'Reserve dedicated private styling sessions at our flagships or your personal residence.',
    },
    {
      icon: <UserCheck className="w-5 h-5 stroke-[1.2] text-maison-gold" />,
      title: 'Personal Styling Advisors',
      desc: 'Work 1-on-1 with a dedicated LUCEVALIE advisor for seasonal wardrobe curation.',
    },
    {
      icon: <Gift className="w-5 h-5 stroke-[1.2] text-maison-gold" />,
      title: 'Bespoke Gift Concierge',
      desc: 'Handwritten notes, branded wooden box packaging, and global express delivery.',
    },
    {
      icon: <Headphones className="w-5 h-5 stroke-[1.2] text-maison-gold" />,
      title: '24/7 VIP Assistance',
      desc: 'Direct contact via WhatsApp, phone, or private email correspondence.',
    },
  ];

  return (
    <section className="py-24 bg-maison-warm-white text-maison-obsidian font-sans border-b border-maison-stone/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            PRIVATE CLIENT SERVICES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-maison-obsidian tracking-wide">
            Attentive Human Concierge
          </h2>
          <p className="text-xs sm:text-sm text-maison-charcoal font-light leading-relaxed">
            Every client relationship is cultivated with discretion, warm care, and bespoke attention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="p-8 bg-maison-ivory border border-maison-stone/50 space-y-4 hover:border-maison-obsidian/40 transition-colors"
            >
              <div className="p-3 bg-maison-surface inline-block border border-maison-stone/40">
                {s.icon}
              </div>
              <h3 className="font-serif text-xl font-normal text-maison-obsidian">{s.title}</h3>
              <p className="text-xs text-maison-taupe leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/private-client"
            className="inline-block px-10 py-4 bg-maison-obsidian text-maison-ivory text-xs font-medium uppercase tracking-[0.2em] hover:bg-maison-espresso transition-all"
          >
            REQUEST PRIVATE APPOINTMENT
          </Link>
        </div>
      </div>
    </section>
  );
};
