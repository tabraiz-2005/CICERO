'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Truck,
} from 'lucide-react';

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    isGiftWrapped,
    giftMessage,
  } = useCart();

  const { currency } = useLocalization();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  const [shippingMethod, setShippingMethod] =
    useState<'express' | 'same-day'>('express');

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();

    if (promoCode.trim().toUpperCase() === 'LUCEVALIE2026') {
      setDiscount(500);
      setCheckoutError('');
    } else {
      setDiscount(0);
      setCheckoutError('This promotional code is not valid.');
    }
  };

  const shippingCost =
    shippingMethod === 'same-day' ? 150 : 0;

  const finalTotal = Math.max(
    0,
    subtotal - discount + shippingCost
  );

  const handleCompletePayment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setCheckoutError('');

    if (items.length === 0) {
      setCheckoutError('Your shopping bag is empty.');
      return;
    }

    setIsRedirecting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          customer: {
            email,
            firstName,
            lastName,
          },
          shippingAddress: {
            address,
            city,
            postalCode,
            country,
          },
          shippingMethod,
          promoCode,
          isGiftWrapped,
          giftMessage,
        }),
      });

      const result = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !result.checkoutUrl) {
        throw new Error(
          result.error ||
          'Unable to begin secure checkout.'
        );
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : 'Unable to begin secure checkout.'
      );

      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-maison-ivory py-12 font-sans text-maison-obsidian sm:py-16">
      <div className="mx-auto max-w-6xl space-y-10 px-6 sm:px-12">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-maison-stone/40 pb-6 sm:flex-row">
          <Link
            href="/"
            className="font-serif text-2xl font-normal uppercase tracking-[0.28em]"
          >
            LUCEVALIE
          </Link>

          <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.16em]">
            <span
              className={
                step >= 1
                  ? 'font-semibold text-maison-obsidian'
                  : 'text-maison-stone-dark'
              }
            >
              1. Information
            </span>

            <ChevronRight className="h-3.5 w-3.5 text-maison-stone-dark" />

            <span
              className={
                step >= 2
                  ? 'font-semibold text-maison-obsidian'
                  : 'text-maison-stone-dark'
              }
            >
              2. Delivery
            </span>

            <ChevronRight className="h-3.5 w-3.5 text-maison-stone-dark" />

            <span
              className={
                step >= 3
                  ? 'font-semibold text-maison-obsidian'
                  : 'text-maison-stone-dark'
              }
            >
              3. Payment
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <div className="space-y-4 border border-maison-stone/60 bg-maison-warm-white p-6">
              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-maison-taupe">
                SECURE CHECKOUT
              </span>

              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-5 w-5 text-maison-gold" />

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    Payments protected by Stripe
                  </div>

                  <div className="mt-1 text-[11px] text-maison-taupe">
                    Card details are entered only on
                    Stripe&apos;s encrypted checkout.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
                <span className="border border-maison-stone/60 px-3 py-2">
                  Cards
                </span>
                <span className="border border-maison-stone/60 px-3 py-2">
                  Apple Pay
                </span>
                <span className="border border-maison-stone/60 px-3 py-2">
                  Google Pay
                </span>
              </div>
            </div>

            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCheckoutError('');
                  setStep(2);
                }}
                className="animate-fade-in space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-normal text-maison-obsidian">
                    1. Client Contact & Shipping Address
                  </h2>

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
                      onChange={(e) =>
                        setFirstName(e.target.value)
                      }
                      placeholder="Julian"
                    />

                    <Input
                      label="LAST NAME"
                      required
                      value={lastName}
                      onChange={(e) =>
                        setLastName(e.target.value)
                      }
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
                      onChange={(e) =>
                        setPostalCode(e.target.value)
                      }
                      placeholder="10021"
                    />
                  </div>

                  <Input
                    label="COUNTRY"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    fullWidth
                    variant="primary"
                    size="lg"
                  >
                    CONTINUE TO DELIVERY SELECTION &rarr;
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="animate-fade-in space-y-6">
                <h2 className="font-serif text-2xl font-normal text-maison-obsidian">
                  2. Global Express Delivery
                </h2>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShippingMethod('express')
                    }
                    className={`flex w-full items-center justify-between border p-4 text-left transition-all ${shippingMethod === 'express'
                      ? 'border-maison-obsidian bg-maison-warm-white'
                      : 'border-maison-stone/60 bg-transparent'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-maison-taupe" />

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider">
                          Maison Global Express
                        </div>

                        <div className="text-[11px] text-maison-taupe">
                          Delivery in 2–3 business days in
                          luxury presentation packaging
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wider text-maison-gold">
                      COMPLIMENTARY
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShippingMethod('same-day')
                    }
                    className={`flex w-full items-center justify-between border p-4 text-left transition-all ${shippingMethod === 'same-day'
                      ? 'border-maison-obsidian bg-maison-warm-white'
                      : 'border-maison-stone/60 bg-transparent'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-maison-taupe" />

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider">
                          White-Glove Same-Day Courier
                        </div>

                        <div className="text-[11px] text-maison-taupe">
                          Personal courier delivery with
                          garment fitting assistance
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-maison-obsidian">
                      {formatPrice(150, currency)}
                    </span>
                  </button>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    &larr; BACK TO INFO
                  </Button>

                  <Button
                    type="button"
                    fullWidth
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      setCheckoutError('');
                      setStep(3);
                    }}
                  >
                    CONTINUE TO PAYMENT &rarr;
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form
                onSubmit={handleCompletePayment}
                className="animate-fade-in space-y-6"
              >
                <h2 className="font-serif text-2xl font-normal text-maison-obsidian">
                  3. Secure Payment
                </h2>

                <div className="space-y-4 border border-maison-stone/50 bg-maison-surface p-5">
                  <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider">
                    <CreditCard className="h-4 w-4 text-maison-taupe" />
                    <span>Stripe Secure Checkout</span>
                  </div>

                  <p className="text-xs leading-relaxed text-maison-taupe">
                    Continue to Stripe to enter your card or
                    supported digital-wallet details. LUCEVALIE
                    never receives or stores your card number or
                    CVC.
                  </p>

                  <div className="flex items-center space-x-2 text-[11px] text-maison-charcoal">
                    <ShieldCheck className="h-4 w-4 text-maison-gold" />
                    <span>
                      Encrypted payment and server-verified pricing
                    </span>
                  </div>
                </div>

                {checkoutError && (
                  <div
                    role="alert"
                    className="border border-red-300 bg-red-50 p-4 text-xs text-red-800"
                  >
                    {checkoutError}
                  </div>
                )}

                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={isRedirecting}
                  >
                    &larr; BACK TO DELIVERY
                  </Button>

                  <Button
                    type="submit"
                    fullWidth
                    variant="primary"
                    size="lg"
                    disabled={
                      isRedirecting || items.length === 0
                    }
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isRedirecting
                      ? 'OPENING SECURE CHECKOUT...'
                      : `CONTINUE TO STRIPE • ${formatPrice(
                        finalTotal,
                        currency
                      )}`}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-6 border border-maison-stone/50 bg-maison-surface p-8 lg:col-span-5">
            <h3 className="font-serif text-xl font-normal text-maison-obsidian">
              Order Summary
            </h3>

            {items.length === 0 ? (
              <p className="text-xs text-maison-taupe">
                Your shopping bag is empty.
              </p>
            ) : (
              <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex space-x-3 border-b border-maison-stone/30 pb-3 text-xs"
                  >
                    <div className="relative h-16 w-12 flex-shrink-0 bg-maison-stone/30">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="font-medium text-maison-obsidian">
                        {item.title}
                      </div>

                      <div className="text-[11px] text-maison-taupe">
                        {item.color} &bull; {item.size} &bull;
                        Qty {item.quantity}
                      </div>

                      <div className="mt-1 text-maison-obsidian">
                        {formatPrice(
                          item.price * item.quantity,
                          currency
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={applyPromo}
              className="flex space-x-2 pt-2"
            >
              <input
                type="text"
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) =>
                  setPromoCode(e.target.value)
                }
                className="flex-1 border border-maison-stone/60 bg-maison-ivory p-2.5 text-xs uppercase tracking-wider"
              />

              <button
                type="submit"
                className="bg-maison-obsidian px-4 text-xs uppercase tracking-wider text-maison-ivory"
              >
                Apply
              </button>
            </form>

            <div className="space-y-2 border-t border-maison-stone/40 pt-4 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between font-medium text-green-800">
                  <span>Maison Courtesy Discount</span>
                  <span>
                    -{formatPrice(discount, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {shippingCost === 0
                    ? 'COMPLIMENTARY'
                    : formatPrice(shippingCost, currency)}
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between border-t border-maison-stone/50 pt-4">
              <span className="font-serif text-xl">Total</span>
              <span className="font-sans text-xl font-medium">
                {formatPrice(finalTotal, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}