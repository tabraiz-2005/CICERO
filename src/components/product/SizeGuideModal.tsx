'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  category = 'outerwear',
}) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  const womenSizes = [
    { it: '38', us: '2', uk: '6', chest: unit === 'cm' ? '82-85' : '32-33', waist: unit === 'cm' ? '64-67' : '25-26', hips: unit === 'cm' ? '90-93' : '35-36' },
    { it: '40', us: '4', uk: '8', chest: unit === 'cm' ? '86-89' : '34-35', waist: unit === 'cm' ? '68-71' : '27-28', hips: unit === 'cm' ? '94-97' : '37-38' },
    { it: '42', us: '6', uk: '10', chest: unit === 'cm' ? '90-93' : '36-37', waist: unit === 'cm' ? '72-75' : '29-30', hips: unit === 'cm' ? '98-101' : '39-40' },
    { it: '44', us: '8', uk: '12', chest: unit === 'cm' ? '94-97' : '38-39', waist: unit === 'cm' ? '76-79' : '31-32', hips: unit === 'cm' ? '102-105' : '41-42' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Atelier Size & Measurement Guide"
      subtitle="INTERNATIONAL SIZING CONVERSIONS & ADVICE"
      maxWidth="lg"
    >
      <div className="space-y-6 font-sans">
        {/* Toggle Unit */}
        <div className="flex items-center justify-between border-b border-maison-stone/40 pb-4">
          <p className="text-xs text-maison-taupe">
            Measurements refer to body dimensions. All garments feature refined European tailoring.
          </p>
          <div className="flex items-center space-x-1 border border-maison-stone/60 p-0.5 bg-maison-surface">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs uppercase tracking-wider ${
                unit === 'cm' ? 'bg-maison-obsidian text-maison-ivory' : 'text-maison-charcoal'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs uppercase tracking-wider ${
                unit === 'in' ? 'bg-maison-obsidian text-maison-ivory' : 'text-maison-charcoal'
              }`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-maison-stone text-maison-obsidian uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">IT SIZING</th>
                <th className="py-3 px-3">US SIZING</th>
                <th className="py-3 px-3">UK SIZING</th>
                <th className="py-3 px-3">CHEST ({unit.toUpperCase()})</th>
                <th className="py-3 px-3">WAIST ({unit.toUpperCase()})</th>
                <th className="py-3 px-3">HIPS ({unit.toUpperCase()})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-maison-stone/30 text-maison-charcoal">
              {womenSizes.map((row, idx) => (
                <tr key={idx} className="hover:bg-maison-warm-white">
                  <td className="py-3 px-3 font-semibold text-maison-obsidian">{row.it}</td>
                  <td className="py-3 px-3">{row.us}</td>
                  <td className="py-3 px-3">{row.uk}</td>
                  <td className="py-3 px-3">{row.chest}</td>
                  <td className="py-3 px-3">{row.waist}</td>
                  <td className="py-3 px-3">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-maison-warm-white border border-maison-stone/50 space-y-1 text-xs text-maison-charcoal">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-maison-obsidian">Need Personal Assistance?</span>
          <p className="font-light text-maison-taupe">
            Our styling advisors can take your exact measurements and advise on coat layering and sleeve length adjustments.
          </p>
        </div>
      </div>
    </Modal>
  );
};
