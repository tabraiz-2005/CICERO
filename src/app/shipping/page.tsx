import React from 'react';

export const metadata = { title: 'Express Delivery | LUCEVALIE' };

export default function ShippingPage() {
  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="space-y-3 border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-maison-taupe">CUSTOMER CARE</span>
          <h1 className="font-serif text-4xl font-normal">Complimentary Express Delivery</h1>
        </div>

        <div className="space-y-6 text-sm text-maison-charcoal leading-relaxed font-light">
          <p>
            LUCEVALIE provides complimentary white-glove global express shipping on all orders via DHL Express and FedEx International Priority.
          </p>

          <h3 className="font-serif text-2xl text-maison-obsidian pt-4">Delivery Timelines</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>European Union:</strong> 1–2 business days.</li>
            <li><strong>United States & Canada:</strong> 2–3 business days.</li>
            <li><strong>Asia-Pacific & Middle East:</strong> 2–4 business days.</li>
          </ul>

          <h3 className="font-serif text-2xl text-maison-obsidian pt-4">Packaging</h3>
          <p>
            Every order is dispatched in our signature LUCEVALIE magnetic box packaging with breathable linen garment covers and cedar wood hangers for tailoring.
          </p>
        </div>
      </div>
    </div>
  );
}
