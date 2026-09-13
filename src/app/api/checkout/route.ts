import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

interface CheckoutRequest {
    items: Array<{
        variantId: string;
        quantity: number;
    }>;
    customer: {
        email: string;
        firstName: string;
        lastName: string;
    };
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    shippingMethod: "express" | "same-day";
    promoCode?: string;
    isGiftWrapped?: boolean;
    giftMessage?: string;
}

const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
    let orderId: string | undefined;
    let sessionId: string | undefined;
    let inventoryReserved = false;

    try {
        const body = (await request.json()) as CheckoutRequest;

        if (!Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json(
                { error: "Your shopping bag is empty." },
                { status: 400 }
            );
        }

        if (body.items.length > 50) {
            return NextResponse.json(
                { error: "Too many items in this order." },
                { status: 400 }
            );
        }

        const requiredCustomerFields = [
            body.customer?.email,
            body.customer?.firstName,
            body.customer?.lastName,
            body.shippingAddress?.address,
            body.shippingAddress?.city,
            body.shippingAddress?.postalCode,
            body.shippingAddress?.country,
        ];

        if (
            requiredCustomerFields.some(
                (value) => typeof value !== "string" || !value.trim()
            )
        ) {
            return NextResponse.json(
                { error: "Please complete all customer and delivery fields." },
                { status: 400 }
            );
        }

        const email = body.customer.email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        if (!["express", "same-day"].includes(body.shippingMethod)) {
            return NextResponse.json(
                { error: "Invalid delivery method." },
                { status: 400 }
            );
        }

        const requestedItems = new Map<string, number>();

        for (const item of body.items) {
            if (
                !uuidPattern.test(item.variantId) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > 20
            ) {
                return NextResponse.json(
                    { error: "Invalid shopping-bag item." },
                    { status: 400 }
                );
            }

            requestedItems.set(
                item.variantId,
                (requestedItems.get(item.variantId) ?? 0) + item.quantity
            );
        }

        const variantIds = Array.from(requestedItems.keys());

        const { data: variants, error: variantsError } = await supabaseAdmin
            .from("product_variants")
            .select(
                "id, product_id, sku, color, size, price, inventory_quantity, is_active, image_url"
            )
            .in("id", variantIds);

        if (variantsError) {
            throw variantsError;
        }

        if (!variants || variants.length !== variantIds.length) {
            return NextResponse.json(
                { error: "One or more products are no longer available." },
                { status: 409 }
            );
        }

        const productIds = Array.from(
            new Set(variants.map((variant) => variant.product_id))
        );

        const { data: products, error: productsError } = await supabaseAdmin
            .from("products")
            .select("id, slug, title, currency, status")
            .in("id", productIds);

        if (productsError) {
            throw productsError;
        }

        const productMap = new Map(
            (products ?? []).map((product) => [product.id, product])
        );

        const validatedItems = variants.map((variant) => {
            const product = productMap.get(variant.product_id);
            const quantity = requestedItems.get(variant.id) ?? 0;

            if (
                !variant.is_active ||
                !product ||
                product.status !== "active" ||
                variant.inventory_quantity < quantity
            ) {
                throw new Error("Insufficient inventory");
            }

            const unitAmount = Math.round(Number(variant.price) * 100);

            if (!Number.isSafeInteger(unitAmount) || unitAmount < 0) {
                throw new Error("Invalid authoritative price");
            }

            return {
                variant,
                product,
                quantity,
                unitAmount,
            };
        });

        const currencies = new Set(
            validatedItems.map(({ product }) => product.currency)
        );

        if (currencies.size !== 1) {
            return NextResponse.json(
                { error: "All items must use the same currency." },
                { status: 400 }
            );
        }

        const currency = Array.from(currencies)[0];
        const subtotalAmount = validatedItems.reduce(
            (total, item) => total + item.unitAmount * item.quantity,
            0
        );

        const normalizedPromoCode = body.promoCode?.trim().toUpperCase() ?? "";

        if (normalizedPromoCode && normalizedPromoCode !== "LUCEVALIE2026") {
            return NextResponse.json(
                { error: "This promotional code is not valid." },
                { status: 400 }
            );
        }

        const discountAmount =
            normalizedPromoCode === "LUCEVALIE2026"
                ? Math.min(50000, subtotalAmount)
                : 0;

        const shippingAmount =
            body.shippingMethod === "same-day" ? 15000 : 0;

        const taxAmount = 0;
        const totalAmount = Math.max(
            0,
            subtotalAmount - discountAmount + shippingAmount + taxAmount
        );

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert({
                customer_email: email,
                customer_first_name: body.customer.firstName.trim(),
                customer_last_name: body.customer.lastName.trim(),
                shipping_address: {
                    address: body.shippingAddress.address.trim(),
                    city: body.shippingAddress.city.trim(),
                    postalCode: body.shippingAddress.postalCode.trim(),
                    country: body.shippingAddress.country.trim(),
                },
                shipping_method: body.shippingMethod,
                currency,
                subtotal_amount: subtotalAmount,
                discount_amount: discountAmount,
                shipping_amount: shippingAmount,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                promo_code: normalizedPromoCode || null,
                is_gift_wrapped: Boolean(body.isGiftWrapped),
                gift_message: body.giftMessage?.trim() || null,
                expires_at: expiresAt.toISOString(),
            })
            .select("id, order_number")
            .single();

        if (orderError || !order) {
            throw orderError ?? new Error("Unable to create order");
        }

        orderId = order.id;

        const { error: itemsError } = await supabaseAdmin
            .from("order_items")
            .insert(
                validatedItems.map(({ variant, product, quantity, unitAmount }) => ({
                    order_id: order.id,
                    product_id: product.id,
                    variant_id: variant.id,
                    sku: variant.sku,
                    product_slug: product.slug,
                    title: product.title,
                    color: variant.color,
                    size: variant.size,
                    image_url: variant.image_url,
                    unit_amount: unitAmount,
                    quantity,
                }))
            );

        if (itemsError) {
            throw itemsError;
        }

        const { error: reservationError } = await supabaseAdmin.rpc(
            "reserve_order_inventory",
            { p_order_id: order.id }
        );

        if (reservationError) {
            throw reservationError;
        }

        inventoryReserved = true;

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
            validatedItems.map(({ variant, product, quantity, unitAmount }) => ({
                quantity,
                price_data: {
                    currency: currency.toLowerCase(),
                    unit_amount: unitAmount,
                    product_data: {
                        name: `${product.title} — ${variant.color} / ${variant.size}`,
                        metadata: {
                            product_id: product.id,
                            variant_id: variant.id,
                            sku: variant.sku,
                        },
                        ...(variant.image_url?.startsWith("https://")
                            ? { images: [variant.image_url] }
                            : {}),
                    },
                },
            }));

        let discounts:
            | Stripe.Checkout.SessionCreateParams.Discount[]
            | undefined;

        if (discountAmount > 0) {
            const coupon = await stripe.coupons.create({
                amount_off: discountAmount,
                currency: currency.toLowerCase(),
                duration: "once",
                name: normalizedPromoCode,
                metadata: {
                    order_id: order.id,
                },
            });

            discounts = [{ coupon: coupon.id }];
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: email,
            client_reference_id: order.id,
            line_items: lineItems,
            discounts,
            billing_address_collection: "required",
            phone_number_collection: {
                enabled: true,
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: shippingAmount,
                            currency: currency.toLowerCase(),
                        },
                        display_name:
                            body.shippingMethod === "same-day"
                                ? "White-Glove Same-Day Courier"
                                : "Maison Global Express",
                    },
                },
            ],
            metadata: {
                order_id: order.id,
                order_number: order.order_number,
            },
            payment_intent_data: {
                metadata: {
                    order_id: order.id,
                    order_number: order.order_number,
                },
            },
            success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.nextUrl.origin}/checkout?cancelled=1`,
            expires_at: Math.floor(expiresAt.getTime() / 1000),
        });

        sessionId = session.id;

        if (!session.url) {
            throw new Error("Stripe did not return a checkout URL");
        }

        const { error: sessionUpdateError } = await supabaseAdmin
            .from("orders")
            .update({
                stripe_checkout_session_id: session.id,
            })
            .eq("id", order.id);

        if (sessionUpdateError) {
            throw sessionUpdateError;
        }

        return NextResponse.json({
            checkoutUrl: session.url,
        });
    } catch (error) {
        if (sessionId) {
            try {
                await stripe.checkout.sessions.expire(sessionId);
            } catch {
                // Continue cleanup even if Stripe expiration fails.
            }
        }

        if (orderId) {
            if (inventoryReserved) {
                await supabaseAdmin.rpc("release_order_inventory", {
                    p_order_id: orderId,
                });
            } else {
                await supabaseAdmin.from("orders").delete().eq("id", orderId);
            }
        }

        const isInventoryError =
            error instanceof Error &&
            error.message.toLowerCase().includes("inventory");

        console.error("Checkout creation failed:", error);

        return NextResponse.json(
            {
                error: isInventoryError
                    ? "One or more items are no longer available in the requested quantity."
                    : "We could not begin checkout. Please try again.",
            },
            { status: isInventoryError ? 409 : 500 }
        );
    }
}