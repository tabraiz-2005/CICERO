'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

export default function AccountOrdersPage() {
  const { currency } = useLocalization();

  const mockOrders = [
    {
      id: 'LV-98421',
      date: 'September 12, 2026',
      status: 'In Transit via DHL Express',
      total: 4850,
      trackingNumber: 'DHL-9812401829',
      items: [
        {
          title: 'Double-Faced Cashmere Belted Coat',
          color: 'Oatmeal Vicuña',
          size: 'M',
          price: 4850,
          image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600&auto=format&fit=crop',
        },
      ],
    },
    {
      id: 'LV-84190',
      date: 'August 14, 2026',
      status: 'Delivered',
      total: 3200,
      trackingNumber: 'FEDEX-771829012',
      items: [
        {
          title: 'Artisanal Calfskin Weekender Bag',
          color: 'Saddle Tan',
          size: 'One Size',
          price: 3200,
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
        },
      ],
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="space-y-3 border-b border-maison-stone/40 pb-6">
          <nav className="flex items-center space-x-2 text-[11px] text-maison-taupe tracking-widest uppercase">
            <Link href="/account">My Account</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-maison-obsidian font-medium">Orders</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-maison-obsidian">
            Order History & Tracking
          </h1>
        </div>

        <div className="space-y-8">
          {mockOrders.map((order) => (
            <div key={order.id} className="p-8 bg-maison-surface border border-maison-stone/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-maison-stone/40 pb-4 gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-maison-taupe">ORDER {order.id}</span>
                  <div className="text-xs text-maison-charcoal mt-0.5">Placed on {order.date}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-maison-gold" />
                  <span className="text-xs font-semibold text-maison-obsidian uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="relative w-16 h-20 bg-maison-stone/30 flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-maison-obsidian">{item.title}</h4>
                      <p className="text-xs text-maison-taupe">{item.color} &bull; Size {item.size}</p>
                    </div>
                    <div className="text-sm font-medium text-maison-obsidian">
                      {formatPrice(item.price, currency)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-maison-stone/30 text-xs">
                <div className="text-maison-taupe">
                  Tracking Code: <span className="font-mono text-maison-obsidian">{order.trackingNumber}</span>
                </div>
                <div className="font-serif text-xl font-normal text-maison-obsidian">
                  Total: {formatPrice(order.total, currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
