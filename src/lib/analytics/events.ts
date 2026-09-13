import { Product, CartItem } from '../commerce/types';

export function trackEvent(eventName: string, payload: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Global dataLayer / analytics hook push
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      ...payload,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[LUCEVALIE Analytics] ${eventName}:`, payload);
    }
  }
}

export function trackViewItem(product: Product) {
  trackEvent('view_item', {
    currency: product.currency,
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        item_brand: 'LUCEVALIE',
        price: product.price,
      },
    ],
  });
}

export function trackAddToCart(product: Product, quantity: number) {
  trackEvent('add_to_cart', {
    currency: product.currency,
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        price: product.price,
        quantity,
      },
    ],
  });
}

export function trackBeginCheckout(items: CartItem[], total: number) {
  trackEvent('begin_checkout', {
    value: total,
    items: items.map((i) => ({
      item_id: i.productId,
      item_name: i.title,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}

export function trackPurchase(orderId: string, total: number, items: CartItem[]) {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: total,
    items: items.map((i) => ({
      item_id: i.productId,
      item_name: i.title,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}
