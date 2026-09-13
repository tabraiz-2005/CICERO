'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Check, Calendar, Shield, Sparkles } from 'lucide-react';

export default function PrivateClientPage() {
  const [submitted, setSubmitted] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [service, setService] = useState('personal-styling');
  const [contactMethod, setContactMethod] = useState('email');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 sm:py-24 bg-maison-ivory text-maison-obsidian font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-gold">
            BESPOKE CONCIERGE SERVICES
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-maison-obsidian">
            Private Client Appointments
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-maison-charcoal leading-relaxed font-light">
            Dedicated personal styling, private boutique viewings, and tailored gifting consultations.
          </p>
        </div>

        {submitted ? (
          <div className="p-12 bg-maison-surface border border-maison-stone/50 text-center space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-maison-warm-white border border-maison-stone/60 flex items-center justify-center mx-auto text-maison-obsidian">
              <Check className="w-8 h-8 stroke-[2]" />
            </div>
            <h2 className="font-serif text-3xl font-normal text-maison-obsidian">Appointment Requested</h2>
            <p className="text-xs text-maison-taupe leading-relaxed">
              Thank you, {name}. A senior LUCEVALIE private advisor will reach out via {contactMethod} within 2 hours to confirm your private appointment schedule.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 bg-maison-surface border border-maison-stone/50 space-y-8">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-normal border-b border-maison-stone/40 pb-4">
                Client Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="FULL NAME"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lord Julian Vance"
                />
                <Input
                  label="EMAIL ADDRESS"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="julian@vance.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="PHONE / WHATSAPP"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                />
                <Input
                  label="COUNTRY OF RESIDENCE"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-normal border-b border-maison-stone/40 pb-4">
                Service Selection & Preferences
              </h2>

              <div className="space-y-2">
                <label className="text-[11px] font-medium tracking-[0.16em] uppercase text-maison-charcoal block">
                  CHOOSE SERVICE TYPE
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'personal-styling', name: 'Personal Wardrobe Styling' },
                    { id: 'private-boutique-visit', name: 'Private Boutique Appointment' },
                    { id: 'gift-consultation', name: 'Bespoke Gift Consultation' },
                    { id: 'bespoke-tailoring', name: 'Artisanal Tailoring Fitting' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setService(s.id)}
                      className={`p-4 text-xs uppercase tracking-wider text-left border transition-all ${
                        service === s.id
                          ? 'border-maison-obsidian bg-maison-warm-white text-maison-obsidian font-semibold'
                          : 'border-maison-stone/60 bg-transparent text-maison-charcoal hover:border-maison-stone-dark'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium tracking-[0.16em] uppercase text-maison-charcoal block">
                  PREFERRED CONTACT METHOD
                </label>
                <div className="flex space-x-4">
                  {['email', 'phone', 'whatsapp'].map((m) => (
                    <label key={m} className="flex items-center space-x-2 text-xs uppercase tracking-wider cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value={m}
                        checked={contactMethod === m}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="accent-maison-obsidian"
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium tracking-[0.16em] uppercase text-maison-charcoal block">
                  SPECIAL REQUESTS OR PREFERRED DATES
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any preferred dates, sizing requirements, or specific pieces you would like presented..."
                  className="w-full text-xs bg-maison-ivory border border-maison-stone/70 p-3 text-maison-obsidian placeholder:text-maison-taupe-light focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 text-center">
              <Button type="submit" size="lg" className="w-full sm:w-auto px-12">
                SUBMIT CONCIERGE REQUEST &rarr;
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
