import React from 'react';

export const metadata = { title: 'Atelier Size Guide | LUCEVALIE' };

export default function SizeGuidePage() {
  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="space-y-3 border-b border-maison-stone/40 pb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-maison-taupe">CUSTOMER CARE</span>
          <h1 className="font-serif text-4xl font-normal">Atelier Sizing & Conversions</h1>
        </div>

        <div className="space-y-6 text-sm text-maison-charcoal leading-relaxed font-light">
          <p>
            LUCEVALIE garments follow Italian contemporary sizing. All coats and tailored blazers are designed with ergonomic shoulder lines allowing subtle layering.
          </p>

          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left text-xs border border-maison-stone/50">
              <thead className="bg-maison-surface uppercase font-semibold">
                <tr>
                  <th className="p-3 border">IT</th>
                  <th className="p-3 border">US</th>
                  <th className="p-3 border">UK</th>
                  <th className="p-3 border">EU</th>
                  <th className="p-3 border">CHEST (CM)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-3 border">38 / S</td><td className="p-3 border">2</td><td className="p-3 border">6</td><td className="p-3 border">34</td><td className="p-3 border">82 - 85</td></tr>
                <tr><td className="p-3 border">40 / M</td><td className="p-3 border">4</td><td className="p-3 border">8</td><td className="p-3 border">36</td><td className="p-3 border">86 - 89</td></tr>
                <tr><td className="p-3 border">42 / L</td><td className="p-3 border">6</td><td className="p-3 border">10</td><td className="p-3 border">38</td><td className="p-3 border">90 - 93</td></tr>
                <tr><td className="p-3 border">48 / S (Men)</td><td className="p-3 border">38</td><td className="p-3 border">38</td><td className="p-3 border">48</td><td className="p-3 border">96 - 99</td></tr>
                <tr><td className="p-3 border">50 / M (Men)</td><td className="p-3 border">40</td><td className="p-3 border">40</td><td className="p-3 border">50</td><td className="p-3 border">100 - 103</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
