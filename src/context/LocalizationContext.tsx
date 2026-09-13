'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CurrencyConfig } from '@/lib/commerce/types';
import { CURRENCIES } from '@/lib/commerce/mockCatalog';

interface LocalizationContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  isCountryModalOpen: boolean;
  setIsCountryModalOpen: (open: boolean) => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lucevalie_currency') as CurrencyCode;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem('lucevalie_currency', code);
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        currencyConfig: CURRENCIES[currency] || CURRENCIES.USD,
        setCurrency,
        isCountryModalOpen,
        setIsCountryModalOpen,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
