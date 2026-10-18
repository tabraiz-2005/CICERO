'use client';

import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { cancelUnpaidOrder, refundOrder, updateOrder } from '@/app/admin/_actions/orders';
import { Field, Notice } from './FormBits';

type F = 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

export function OrderActions({
  id,
  paid,
  pending: isPendingOrder,
  initial,
}: {
  id: string;
  paid: boolean;
  pending: boolean;
  initial: { fulfillmentStatus: F; trackingNumber: string; trackingUrl: string; adminNotes: string };
}) {
  const router = useRouter();
  const [f, setF] = useState(initial);
  const [restock, setRestock] = useState(true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, start] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; error?: string; message?: string }>) =>
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? { ok: true, text: r.message ?? 'Done.' } : { ok: false, text: r.error ?? 'Failed.' });
      router.refresh();
    });

  return (
    <div className="space-y-4">
      {msg && <Notice kind={msg.ok ? 'success' : 'error'}>{msg.text}</Notice>}
      {paid && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => updateOrder(id, f));
          }}
        >
          <Field label="Fulfilment">
            <select value={f.fulfillmentStatus} onChange={(e) => setF({ ...f, fulfillmentStatus: e.target.value as F })} className="field">
              <option value="unfulfilled">Unfulfilled</option>
              <option value="processing">Packing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
          <Field label="Tracking number">
            <input value={f.trackingNumber} onChange={(e) => setF({ ...f, trackingNumber: e.target.value })} className="field" />
          </Field>
          <Field label="Tracking link">
            <input value={f.trackingUrl} onChange={(e) => setF({ ...f, trackingUrl: e.target.value })} className="field" placeholder="https://…" />
          </Field>
          <Field label="Internal notes" hint="Only visible to admins.">
            <textarea rows={3} value={f.adminNotes} onChange={(e) => setF({ ...f, adminNotes: e.target.value })} className="field h-auto py-3" />
          </Field>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className="btn-primary h-10 px-5">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </button>
            {f.fulfillmentStatus !== 'shipped' && f.fulfillmentStatus !== 'delivered' && (
              <button type="button" disabled={busy} className="btn-outline h-10 px-4" onClick={() => run(() => updateOrder(id, { ...f, fulfillmentStatus: 'shipped' }))}>
                Mark shipped
              </button>
            )}
          </div>
        </form>
      )}

      {paid && (
        <div className="border-t border-line pt-4">
          <p className="field-label">Refund</p>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={restock} onChange={(e) => setRestock(e.target.checked)} className="h-4 w-4 accent-current" />
            Return items to stock
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => confirm('Refund the full amount to the customer through Stripe? This cannot be undone.') && run(() => refundOrder(id, restock))}
            className="btn h-10 border border-danger/50 px-4 text-danger hover:bg-danger/10"
          >
            Refund full amount
          </button>
        </div>
      )}

      {!paid && isPendingOrder && (
        <div>
          <p className="mb-3 text-sm text-muted">
            The customer started checkout but hasn’t paid. Stock is held for 40 minutes, then released automatically when Stripe expires the session.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => confirm('Cancel this unpaid order and release its stock?') && run(() => cancelUnpaidOrder(id))}
            className="btn-outline h-10 px-4"
          >
            Cancel & release stock
          </button>
        </div>
      )}
    </div>
  );
}
