'use client';

import React from 'react';
import { Accordion } from '@/components/ui/Accordion';

export default function FAQPage() {
  const faqItems = [
    {
      id: 'cashmere-provenance',
      title: 'Where is LUCEVALIE cashmere harvested & processed?',
      content: 'Our raw cashmere fibers are harvested exclusively from high-altitude Mongolian plateaus (fibers under 14.5 microns). Spinning and finishing take place in Biella and Solomeo, Italy.',
    },
    {
      id: 'shipping-times',
      title: 'How long does express global shipping take?',
      content: 'Express shipments arrive within 1-2 business days across Europe, 2-3 days in North America, and 2-4 days in Asia and the Middle East via DHL Express.',
    },
    {
      id: 'custom-packaging',
      title: 'What packaging is provided with orders?',
      content: 'All garments arrive in branded magnetic presentation boxes with breathable linen garment covers and cedar wood hangers for tailored jackets.',
    },
    {
      id: 'private-appointments',
      title: 'How can I schedule a personal styling appointment?',
      content: 'You can request an appointment through our Private Client page or by contacting our concierge directly at concierge@lucevalie.com.',
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="space-y-3 border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-maison-taupe">CUSTOMER CARE</span>
          <h1 className="font-serif text-4xl font-normal">Frequently Asked Questions</h1>
        </div>

        <Accordion items={faqItems} defaultOpenId="cashmere-provenance" />
      </div>
    </div>
  );
}
