import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getSettings } from '@/lib/commerce/catalog';
import { evaluateDiscount, shippingCost, type ShippingMethod } from '@/lib/commerce/pricing';
import { ConfigError } from '@/lib/env';
import { normalisePkPhone } from '@/lib/phone';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Places an order. Payment: Cash on Delivery (EasyPaisa will be added as a second method).
 * Prices, stock and discounts are always re-checked here — never trusted from the browser.
 */
interface CheckoutRequest {
  items: Array<{ variantId: string; quantity: number }>;
  customer: { email?: string; firstName: string; lastName: string; phone: string };
  shippingAddress: { address: string; address2?: string; city: string; region?: string; postalCode?: string };
  shippingMethod: ShippingMethod;
  paymentMethod: 'cod';
  promoCode?: string;
  notes?: string;
  website?: string; // honeypot — real customers never fill this
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: NextRequest) {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (e) {
    console.error('[checkout] configuration error:', e);
    return bad(e instanceof ConfigError ? 'Checkout is not configured yet. Please try again later.' : 'Checkout unavailable.', 503);
  }

  let orderId: string | undefined;
  let placed = false;

  try {
    const body = (await request.json()) as CheckoutRequest;
    if (body.website) return bad('Could not place the order.');
    if (body.paymentMethod !== 'cod') return bad('Please choose a payment method.');
    if (!Array.isArray(body.items) || body.items.length === 0) return bad('Your bag is empty.');
    if (body.items.length > 30) return bad('Too many items in this order.');

    const firstName = str(body.customer?.firstName, 80);
    const lastName = str(body.customer?.lastName, 80);
    const email = str(body.customer?.email, 254).toLowerCase();
    const phone = normalisePkPhone(str(body.customer?.phone, 30));
    const addr = {
      address: str(body.shippingAddress?.address),
      address2: str(body.shippingAddress?.address2),
      city: str(body.shippingAddress?.city, 80),
      region: str(body.shippingAddress?.region, 80),
      postalCode: str(body.shippingAddress?.postalCode, 12),
      country: 'PK',
    };
    if (!firstName || !lastName) return bad('Please enter your full name.');
    if (!phone) return bad('Please enter a valid Pakistani mobile number, e.g. 0300 1234567.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Please enter a valid email address, or leave it empty.');
    if (addr.address.length < 5 || !addr.city) return bad('Please enter your full delivery address and city.');

    const method: ShippingMethod = body.shippingMethod === 'express' ? 'express' : 'standard';

    const requested = new Map<string, number>();
    for (const item of body.items) {
      if (!uuid.test(item?.variantId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10)
        return bad('Your bag contains an invalid item. Please remove it and try again.');
      requested.set(item.variantId, (requested.get(item.variantId) ?? 0) + item.quantity);
    }
    const variantIds = Array.from(requested.keys());

    const { data: variants, error: vErr } = await admin
      .from('product_variants')
      .select('id, product_id, sku, color, size, price, inventory_quantity, is_active, image_url')
      .in('id', variantIds);
    if (vErr) throw vErr;
    if (!variants || variants.length !== variantIds.length)
      return bad('One or more items are no longer available. Please refresh your bag.', 409);

    const { data: products, error: pErr } = await admin
      .from('products')
      .select('id, slug, title, currency, status, product_images ( url, is_primary, position )')
      .in('id', Array.from(new Set(variants.map((v) => v.product_id))));
    if (pErr) throw pErr;
    const productMap = new Map((products ?? []).map((p) => [p.id, p]));

    const lines = variants.map((variant) => {
      const product = productMap.get(variant.product_id);
      const quantity = requested.get(variant.id) ?? 0;
      if (!variant.is_active || !product || product.status !== 'active' || variant.inventory_quantity < quantity) {
        throw new Error('Insufficient inventory');
      }
      const unitAmount = Math.round(Number(variant.price) * 100); // paisa
      if (!Number.isSafeInteger(unitAmount) || unitAmount < 0) throw new Error('Invalid price');
      const imgs = [...((product.product_images as { url: string; is_primary: boolean; position: number }[]) ?? [])].sort(
        (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position
      );
      return { variant, product, quantity, unitAmount, image: variant.image_url || imgs[0]?.url || null };
    });

    const currency = 'PKR';
    if (lines.some((l) => l.product.currency !== currency)) return bad('Some items are not priced in Rupees yet. Please contact us.');

    const settings = await getSettings();
    const subtotal = lines.reduce((n, l) => n + l.unitAmount * l.quantity, 0);

    let discount = 0;
    let promo: string | null = null;
    if (body.promoCode?.trim()) {
      const result = await evaluateDiscount(admin, body.promoCode, subtotal);
      if ('error' in result) return bad(result.error);
      discount = result.amount;
      promo = result.code;
    }
    const shipping = shippingCost(settings, method, subtotal - discount);
    const total = Math.max(0, subtotal - discount + shipping);

    const { data: order, error: oErr } = await admin
      .from('orders')
      .insert({
        customer_email: email || null,
        customer_first_name: firstName,
        customer_last_name: lastName,
        customer_phone: phone,
        shipping_address: addr,
        shipping_method: method,
        payment_method: 'cod',
        currency,
        subtotal_amount: subtotal,
        discount_amount: discount,
        shipping_amount: shipping,
        tax_amount: 0,
        total_amount: total,
        promo_code: promo,
        gift_message: str(body.notes, 500) || null,
      })
      .select('id, order_number')
      .single();
    if (oErr || !order) throw oErr ?? new Error('Unable to create order');
    orderId = order.id;

    const { error: iErr } = await admin.from('order_items').insert(
      lines.map((l) => ({
        order_id: order.id,
        product_id: l.product.id,
        variant_id: l.variant.id,
        sku: l.variant.sku,
        product_slug: l.product.slug,
        title: l.product.title,
        color: l.variant.color,
        size: l.variant.size,
        image_url: l.image,
        unit_amount: l.unitAmount,
        quantity: l.quantity,
      }))
    );
    if (iErr) throw iErr;

    // Takes the stock and confirms the order in one database transaction.
    const { error: rErr } = await admin.rpc('place_cod_order', { p_order_id: order.id });
    if (rErr) throw rErr;
    placed = true;

    if (promo) await admin.rpc('count_discount_use', { p_code: promo });

    return NextResponse.json({ orderId: order.id, orderNumber: order.order_number });
  } catch (error) {
    if (orderId && !placed) await admin.from('orders').delete().eq('id', orderId);
    const inventory = error instanceof Error && error.message.toLowerCase().includes('inventory');
    console.error('[checkout] failed:', error);
    return bad(
      inventory ? 'One or more items are no longer available in the quantity requested.' : 'We could not place your order. Please try again.',
      inventory ? 409 : 500
    );
  }
}
