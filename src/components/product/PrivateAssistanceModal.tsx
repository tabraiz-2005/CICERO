'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Check } from 'lucide-react';

interface PrivateAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

export const PrivateAssistanceModal: React.FC<PrivateAssistanceModalProps> = ({
  isOpen,
  onClose,
  productTitle,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSubmitted(false);
      }}
      title="Speak with a LUCEVALIE Advisor"
      subtitle={`PRIVATE CONSULTATION FOR: ${productTitle.toUpperCase()}`}
      maxWidth="md"
    >
      {submitted ? (
        <div className="text-center py-10 space-y-4 font-sans animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-maison-warm-white border border-maison-stone flex items-center justify-center mx-auto text-maison-obsidian">
            <Check className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="font-serif text-2xl text-maison-obsidian">Consultation Request Received</h3>
          <p className="text-xs text-maison-taupe max-w-sm mx-auto leading-relaxed">
            Thank you, {name}. A dedicated LUCEVALIE advisor will contact you within 2 hours to provide bespoke guidance on {productTitle}.
          </p>
          <div className="pt-4">
            <Button variant="primary" onClick={() => { onClose(); setSubmitted(false); }}>
              CLOSE WINDOW
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <p className="text-xs text-maison-charcoal leading-relaxed">
            Please share your contact details and preferred assistance format (fit advice, custom fabric questions, or private appointment).
          </p>

          <Input
            label="FULL NAME"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lord Julian Vance"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="EMAIL ADDRESS"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="julian@vance.com"
            />
            <Input
              label="PHONE / WHATSAPP (OPTIONAL)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7911 123456"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium tracking-[0.16em] uppercase text-maison-charcoal">
              YOUR SPECIFIC INQUIRY OR TIMING
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., I would like advice on coat sizing for layering over tailoring..."
              className="w-full text-xs bg-maison-surface/70 border border-maison-stone/70 p-3 text-maison-obsidian placeholder:text-maison-taupe-light focus:outline-none focus:border-maison-obsidian"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" variant="primary">
              SEND CONSULTATION REQUEST
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
