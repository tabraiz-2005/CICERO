'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useLocalization } from '@/context/LocalizationContext';
import { CURRENCIES } from '@/lib/commerce/mockCatalog';
import { CurrencyCode } from '@/lib/commerce/types';
import { Check } from 'lucide-react';

export const CountryCurrencyModal: React.FC = () => {
  const { isCountryModalOpen, setIsCountryModalOpen, currency, setCurrency } = useLocalization();

  return (
    <Modal
      isOpen={isCountryModalOpen}
      onClose={() => setIsCountryModalOpen(false)}
      title="Regional & Currency Selection"
      subtitle="SELECT YOUR PREFERRED MARKET & CURRENCY"
      maxWidth="md"
    >
      <div className="space-y-6 font-sans">
        <p className="text-xs text-maison-charcoal leading-relaxed">
          Prices, duties, and local delivery estimates will automatically adjust based on your selected region.
        </p>

        <div className="space-y-2">
          <label className="text-[11px] font-medium tracking-[0.16em] uppercase text-maison-taupe">
            Available Currencies
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
              const item = CURRENCIES[code];
              const isSelected = currency === code;
              return (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code);
                    setIsCountryModalOpen(false);
                  }}
                  className={`flex items-center justify-between p-4 border text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-maison-obsidian bg-maison-warm-white text-maison-obsidian'
                      : 'border-maison-stone/60 bg-transparent text-maison-charcoal hover:border-maison-stone-dark hover:bg-maison-surface'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.flag}</span>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider">{item.label}</div>
                      <div className="text-[11px] text-maison-taupe">{item.code} ({item.symbol})</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-maison-obsidian stroke-[2]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-maison-stone/40 flex justify-end">
          <button
            onClick={() => setIsCountryModalOpen(false)}
            className="text-xs uppercase tracking-[0.18em] text-maison-obsidian border-b border-maison-obsidian/60 hover:border-maison-obsidian pb-0.5"
          >
            Confirm & Save Preferences
          </button>
        </div>
      </div>
    </Modal>
  );
};
