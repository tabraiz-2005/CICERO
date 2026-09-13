'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Package, MapPin, Heart, Shield, LogOut } from 'lucide-react';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState('julian.vance@lucevalie-client.com');
  const [password, setPassword] = useState('••••••••••••');
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  if (!isLoggedIn) {
    return (
      <div className="py-20 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
        <div className="max-w-md mx-auto px-6 space-y-8 bg-maison-surface p-8 border border-maison-stone/50">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-maison-taupe">MY LUCEVALIE</span>
            <h1 className="font-serif text-3xl font-normal">
              {mode === 'signin' ? 'Sign In to Your Account' : 'Register Private Client Account'}
            </h1>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <Input
              label="EMAIL ADDRESS"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="PASSWORD"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" fullWidth variant="primary" size="lg">
              {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </Button>
          </form>

          <div className="text-center text-xs text-maison-taupe pt-2">
            {mode === 'signin' ? (
              <span>
                New to LUCEVALIE?{' '}
                <button onClick={() => setMode('register')} className="text-maison-obsidian underline">
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button onClick={() => setMode('signin')} className="text-maison-obsidian underline">
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-maison-stone/40 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-gold">
              PRIVATE CLIENT PORTAL
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-maison-obsidian">
              Welcome Back, Lord Vance
            </h1>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center space-x-2 text-xs uppercase tracking-[0.18em] text-maison-taupe hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recent Orders Box */}
          <div className="p-8 bg-maison-surface border border-maison-stone/50 space-y-4">
            <div className="flex items-center space-x-3 text-maison-obsidian">
              <Package className="w-5 h-5 text-maison-taupe" />
              <h3 className="font-serif text-xl">Order History</h3>
            </div>
            <p className="text-xs text-maison-taupe leading-relaxed">
              Track active shipments, view past receipts, and manage return requests.
            </p>
            <div className="pt-2">
              <Link
                href="/account/orders"
                className="text-xs uppercase tracking-[0.18em] text-maison-obsidian border-b border-maison-obsidian pb-0.5"
              >
                VIEW ORDERS (2) &rarr;
              </Link>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="p-8 bg-maison-surface border border-maison-stone/50 space-y-4">
            <div className="flex items-center space-x-3 text-maison-obsidian">
              <MapPin className="w-5 h-5 text-maison-taupe" />
              <h3 className="font-serif text-xl">Saved Addresses</h3>
            </div>
            <p className="text-xs text-maison-taupe leading-relaxed">
              Manage your default primary shipping address and private residence locations.
            </p>
            <div className="text-xs text-maison-charcoal pt-1">
              <strong>Primary:</strong> 740 Park Avenue, NY 10021
            </div>
          </div>

          {/* Private Styling Preferences */}
          <div className="p-8 bg-maison-surface border border-maison-stone/50 space-y-4">
            <div className="flex items-center space-x-3 text-maison-obsidian">
              <Shield className="w-5 h-5 text-maison-gold" />
              <h3 className="font-serif text-xl">Styling Preferences</h3>
            </div>
            <p className="text-xs text-maison-taupe leading-relaxed">
              Assigned Advisor: <strong>Elena Vance</strong> (Biella Atelier)
            </p>
            <div className="pt-2">
              <Link
                href="/private-client"
                className="text-xs uppercase tracking-[0.18em] text-maison-obsidian border-b border-maison-obsidian pb-0.5"
              >
                CONTACT ADVISOR &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
