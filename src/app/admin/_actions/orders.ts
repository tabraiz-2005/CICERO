'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe/server';
import { assertAdmin, fail, type ActionResult } from '@/lib/admin/auth';

const FULFILMENT = ['unfulfilled', 'processing', 'shipped', 'delivered', 'returned', 'cancelled'] as const;

export async function updateOrder(
  id: string,
  patch: { fulfillmentStatus: (typeof FULFILMENT)[number]; trackingNumber: string; trackingUrl: string; adminNotes: string }
): Promise<ActionResult> {
  try {
    await assertAdmin();
    if (!FULFILMENT.includes(patch.fulfillmentStatus)) return { ok: false, error: 'Unknown status.' };
    const admin = getSupabaseAdmin();
    const { data: order, error: getErr } = await admin.from('orders').select('shipped_at, delivered_at, payment_status').eq('id', id).single();
    if (getErr) throw getErr;
    if (order.payment_status !== 'paid' && ['shipped', 'delivered'].includes(patch.fulfillmentStatus))
      return { ok: false, error: 'This order hasn’t been paid — don’t ship it.' };
    const url = patch.trackingUrl.trim();
    const row: Record<string, unknown> = {
      fulfillment_status: patch.fulfillmentStatus,
      tracking_number: patch.trackingNumber.trim() || null,
      tracking_url: url ? (/^https?:\/\//.test(url) ? url : `https://${url}`) : null,
      admin_notes: patch.adminNotes.trim() || null,
    };
    if (patch.fulfillmentStatus === 'shipped' && !order.shipped_at) row.shipped_at = new Date().toISOString();
    if (patch.fulfillmentStatus === 'delivered') {
      if (!order.delivered_at) row.delivered_at = new Date().toISOString();
      if (!order.shipped_at) row.shipped_at = new Date().toISOString();
    }
    const { error } = await admin.from('orders').update(row).eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { ok: true, message: 'Order updated.' };
  } catch (e) {
    return fail(e);
  }
}

/** Cancel an unpaid order and put its reserved stock back. */
export async function cancelUnpaidOrder(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const admin = getSupabaseAdmin();
    const { data: order, error } = await admin.from('orders').select('payment_status, stripe_checkout_session_id').eq('id', id).single();
    if (error) throw error;
    if (order.payment_status === 'paid') return { ok: false, error: 'This order is paid — refund it instead.' };
    if (order.stripe_checkout_session_id) {
      try {
        await getStripe().checkout.sessions.expire(order.stripe_checkout_session_id);
      } catch {
        /* already expired or completed */
      }
    }
    const { error: rErr } = await admin.rpc('release_order_inventory', { p_order_id: id });
    if (rErr) throw rErr;
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { ok: true, message: 'Order cancelled and stock released.' };
  } catch (e) {
    return fail(e);
  }
}

/** Full refund through Stripe; optionally put the items back into stock. */
export async function refundOrder(id: string, restock: boolean): Promise<ActionResult> {
  try {
    await assertAdmin();
    const admin = getSupabaseAdmin();
    const { data: order, error } = await admin
      .from('orders')
      .select('payment_status, stripe_payment_intent_id, order_items(variant_id, quantity)')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (order.payment_status !== 'paid') return { ok: false, error: 'Only paid orders can be refunded.' };
    if (!order.stripe_payment_intent_id) return { ok: false, error: 'No Stripe payment found for this order — refund it in the Stripe dashboard.' };

    await getStripe().refunds.create({ payment_intent: order.stripe_payment_intent_id, metadata: { order_id: id } });

    const { error: uErr } = await admin
      .from('orders')
      .update({ payment_status: 'refunded', status: 'refunded', fulfillment_status: 'cancelled' })
      .eq('id', id);
    if (uErr) throw uErr;

    if (restock) {
      for (const item of order.order_items ?? []) {
        if (!item.variant_id) continue;
        const { data: v } = await admin.from('product_variants').select('inventory_quantity').eq('id', item.variant_id).maybeSingle();
        if (v) await admin.from('product_variants').update({ inventory_quantity: v.inventory_quantity + item.quantity }).eq('id', item.variant_id);
      }
    }
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/', 'layout');
    return { ok: true, message: `Refunded in Stripe${restock ? ' and items returned to stock' : ''}.` };
  } catch (e) {
    return fail(e);
  }
}
