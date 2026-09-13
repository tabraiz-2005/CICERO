'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { Lock, ShieldCheck, Check, CreditCard, ChevronRight, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, isGiftWrapped, giftMessage, clearCart } = useCart();
  const { currency } = useLocalization();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [shippingMethod, setShippingMethod] = useState<'express' | 'same-day'>('express');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'LUCEVALIE2026') {
      setDiscount(500);
    }
  };

  const shippingCost = shippingMethod === 'same-day' ? 150 : 0;
  const finalTotal = Math.max(0, subtotal - discount + shippingCost);

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
    clearCart();
  };

  return (
    <div className="py-12 sm:py-16 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-10">
        {/* Header Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-maison-stone/40 pb-6 gap-4">
          <Link href="/" className="font-serif text-2xl tracking-[0.28em] font-normal uppercase">
            LUCEVALIE
          </Link>

          {/* Stepper Progress */}
          <div className="flex items-center space-x-3 text-xs tracking-[0.16em] uppercase">
            <span className={step >= 1 ? 'text-maison-obsidian font-semibold' : 'text-maison-stone-dark'}>
              1. Information
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-maison-stone-dark" />
            <span className={step >= 2 ? 'text-maison-obsidian font-semibold' : 'text-maison-stone-dark'}>
              2. Delivery
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-maison-stone-dark" />
            <span className={step >= 3 ? 'text-maison-obsidian font-semibold' : 'text-maison-stone-dark'}>
              3. Payment
            </span>
          </div>
        </div>

        {/* Step 4: Confirmation Screen */}
        {step === 4 ? (
          <div className="max-w-2xl mx-auto text-center py-16 space-y-6 animate-fade-in bg-maison-surface p-12 border border-maison-stone/50">
            <div className="w-16 h-16 rounded-full bg-maison-warm-white border border-maison-stone/60 flex items-center justify-center mx-auto text-maison-obsidian">
              <Check className="w-8 h-8 stroke-[2]" />
            </div>
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-gold block">
              ORDER CONFIRMED &bull; #LV-98421
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-maison-obsidian">
              Thank You for Your Order, {firstName || 'Valued Client'}
            </h1>
            <p className="text-xs sm:text-sm text-maison-taupe max-w-md mx-auto leading-relaxed">
              We have received your order. A confirmation letter with white-glove tracking details has been sent to <span className="font-medium text-maison-obsidian">{email || 'your email'}</span>.
            </p>
            <div className="p-4 bg-maison-ivory border border-maison-stone/40 text-xs text-maison-charcoal space-y-1 text-left">
              <div className="font-semibold text-maison-obsidian uppercase tracking-wider text-[11px]">Delivery Address</div>
              <div>{firstName} {lastName}</div>
              <div>{address}, {city}, {postalCode}</div>
              <div>{country}</div>
            </div>
            <div className="pt-4">
              <Link href="/">
                <Button variant="primary" size="lg">RETURN TO MAISON FLAGSHIP</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Columns */}
            <div className="lg:col-span-7 space-y-8">
              {/* Express Payments Banner */}
              <div className="p-6 bg-maison-warm-white border border-maison-stone/60 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-maison-taupe block font-medium">
                  EXPRESS MAISON CHECKOUT
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="py-3 px-4 bg-maison-obsidian text-maison-ivory text-xs font-semibold uppercase tracking-wider hover:bg-maison-espresso transition-colors text-center"
                  >
                    Apple Pay
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="py-3 px-4 bg-[#4285F4] text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-colors text-center"
                  >
                    Google Pay
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="py-3 px-4 bg-[#5A31F4] text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-colors text-center"
                  >
                    Shop Pay
                  </button>
                </div>
              </div>

              {/* Step 1: Customer & Address Information */}
              {step === 1 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                  className="space-y-6 animate-fade-in"
                >
                  <div className="space-y-4">
                    <h2 className="font-serif text-2xl font-normal text-maison-obsidian">1. Client Contact & Shipping Address</h2>
                    <Input
                      label="EMAIL ADDRESS"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@maison.com"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="FIRST NAME"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Julian"
                      />
                      <Input
                        label="LAST NAME"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Vance"
                      />
                    </div>

                    <Input
                      label="STREET ADDRESS"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="740 Park Avenue, Suite 12B"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="CITY"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                      />
                      <Input
                        label="POSTAL / ZIP CODE"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="10021"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" fullWidth variant="primary" size="lg">
                      CONTINUE TO DELIVERY SELECTION &rarr;
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 2: Shipping Method Selection */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-serif text-2xl font-normal text-maison-obsidian">2. Global Express Delivery</h2>
                  
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setShippingMethod('express')}
                      className={`w-full p-4 border text-left flex items-center justify-between transition-all ${
                        shippingMethod === 'express'
                          ? 'border-maison-obsidian bg-maison-warm-white'
                          : 'border-maison-stone/60 bg-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-maison-taupe" />
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider">Maison Global Express</div>
                          <div className="text-[11px] text-maison-taupe">Delivery in 2-3 business days in luxury magnetic presentation boxes</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-maison-gold uppercase tracking-wider">COMPLIMENTARY</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingMethod('same-day')}
                      className={`w-full p-4 border text-left flex items-center justify-between transition-all ${
                        shippingMethod === 'same-day'
                          ? 'border-maison-obsidian bg-maison-warm-white'
                          : 'border-maison-stone/60 bg-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-maison-taupe" />
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider">White-Glove Same Day / Courier</div>
                          <div className="text-[11px] text-maison-taupe">Personal courier delivery with garment fitting assistance</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-maison-obsidian">{formatPrice(150, currency)}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      &larr; BACK TO INFO
                    </Button>
                    <Button type="button" fullWidth variant="primary" size="lg" onClick={() => setStep(3)}>
                      CONTINUE TO PAYMENT &rarr;
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <form onSubmit={handleCompletePayment} className="space-y-6 animate-fade-in">
                  <h2 className="font-serif text-2xl font-normal text-maison-obsidian">3. Certified Tokenized Payment</h2>

                  <div className="p-4 bg-maison-surface border border-maison-stone/50 space-y-4">
                    <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold">
                      <CreditCard className="w-4 h-4 text-maison-taupe" />
                      <span>Credit or Debit Card</span>
                    </div>

                    <Input
                      label="CARD NUMBER"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8921"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="EXPIRY DATE"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                      />
                      <Input
                        label="SECURITY CODE (CVC)"
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      &larr; BACK TO DELIVERY
                    </Button>
                    <Button type="submit" fullWidth variant="primary" size="lg">
                      <Lock className="w-4 h-4 mr-2" />
                      COMPLETE ORDER &bull; {formatPrice(finalTotal, currency)}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-5 p-8 bg-maison-surface border border-maison-stone/50 space-y-6">
              <h3 className="font-serif text-xl font-normal text-maison-obsidian">Order Summary</h3>

              {items.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <div key={i.id} className="flex space-x-3 text-xs border-b border-maison-stone/30 pb-3">
                      <div className="relative w-12 h-16 bg-maison-stone/30 flex-shrink-0">
                        <Image src={i.image} alt={i.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-maison-obsidian">{i.title}</div>
                        <div className="text-maison-taupe text-[11px]">{i.color} &bull; {i.size}</div>
                        <div className="text-maison-obsidian mt-1">{formatPrice(i.price * i.quantity, currency)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Promo Code Input */}
              <form onSubmit={applyPromo} className="flex space-x-2 pt-2">
                <input
                  type="text"
                  placeholder="PROMO CODE (e.g. LUCEVALIE2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 text-xs bg-maison-ivory border border-maison-stone/60 p-2.5 uppercase tracking-wider"
                />
                <button type="submit" className="px-4 bg-maison-obsidian text-maison-ivory text-xs uppercase tracking-wider">
                  Apply
                </button>
              </form>

              <div className="space-y-2 text-xs border-t border-maison-stone/40 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-800 font-medium">
                    <span>Maison Courtesy Discount</span>
                    <span>-{formatPrice(discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{shippingCost === 0 ? 'COMPLIMENTARY' : formatPrice(shippingCost, currency)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-maison-stone/50 flex justify-between items-baseline">
                <span className="font-serif text-xl">Total</span>
                <span className="font-sans font-medium text-xl">{formatPrice(finalTotal, currency)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
