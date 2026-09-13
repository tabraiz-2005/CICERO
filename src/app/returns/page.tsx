import React from 'react';

export const metadata = { title: 'Complimentary Returns | LUCEVALIE' };

export default function ReturnsPage() {
  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="space-y-3 border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-maison-taupe">CUSTOMER CARE</span>
          <h1 className="font-serif text-4xl font-normal">30-Day Complimentary Returns & Exchanges</h1>
        </div>

        <div className="space-y-6 text-sm text-maison-charcoal leading-relaxed font-light">
          <p>
            Should a garment not meet your precise expectations, LUCEVALIE accepts returns and exchanges within 30 days of receipt in unworn condition with original tags intact.
          </p>

          <h3 className="font-serif text-2xl text-maison-obsidian pt-4">Return Procedure</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Log into your <strong>MY LUCEVALIE</strong> account or visit our Customer Care portal.</li>
            <li>Select the items you wish to return and generate your pre-paid DHL express return label.</li>
            <li>Schedule a complimentary home courier pickup or drop off at any authorized location.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
