import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ClearCartAfterPayment } from "@/components/checkout/ClearCartAfterPayment";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount / 100);
}

export default async function CheckoutSuccessPage({
    searchParams,
}: SuccessPageProps) {
    const { session_id: sessionId } = await searchParams;

    if (!sessionId || !sessionId.startsWith("cs_")) {
        return (
            <main className="min-h-screen bg-maison-ivory px-6 py-24 text-center">
                <h1 className="font-serif text-3xl text-maison-obsidian">
                    Invalid confirmation link
                </h1>
                <div className="mt-8">
                    <Link href="/">
                        <Button variant="primary">RETURN TO LUCEVALIE</Button>
                    </Link>
                </div>
            </main>
        );
    }

    let session;

    try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
        return (
            <main className="min-h-screen bg-maison-ivory px-6 py-24 text-center">
                <h1 className="font-serif text-3xl text-maison-obsidian">
                    Confirmation unavailable
                </h1>
                <p className="mt-4 text-sm text-maison-taupe">
                    Please contact client care if you completed a payment.
                </p>
            </main>
        );
    }

    const isPaid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required";

    const orderId = session.metadata?.order_id;

    const { data: order } = orderId
        ? await supabaseAdmin
            .from("orders")
            .select(
                "order_number, customer_email, customer_first_name, total_amount, currency, payment_status"
            )
            .eq("id", orderId)
            .eq("stripe_checkout_session_id", session.id)
            .maybeSingle()
        : { data: null };

    if (!isPaid) {
        return (
            <main className="min-h-screen bg-maison-ivory px-6 py-24">
                <div className="mx-auto max-w-xl border border-maison-stone/50 bg-maison-surface p-10 text-center">
                    <Clock className="mx-auto h-12 w-12 text-maison-gold" />
                    <h1 className="mt-6 font-serif text-3xl text-maison-obsidian">
                        Payment processing
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-maison-taupe">
                        Your payment has not yet been confirmed. We will update your order
                        after Stripe completes processing.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-maison-ivory px-6 py-24">
            <ClearCartAfterPayment />

            <div className="mx-auto max-w-xl border border-maison-stone/50 bg-maison-surface p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-maison-stone/60 bg-maison-warm-white">
                    <Check className="h-8 w-8 text-maison-obsidian" />
                </div>

                <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.25em] text-maison-gold">
                    Payment confirmed
                    {order?.order_number ? ` • ${order.order_number}` : ""}
                </p>

                <h1 className="mt-4 font-serif text-3xl text-maison-obsidian">
                    Thank you
                    {order?.customer_first_name
                        ? `, ${order.customer_first_name}`
                        : ""}
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-maison-taupe">
                    Your LUCEVALIE order has been received
                    {order?.customer_email
                        ? ` and a confirmation will be sent to ${order.customer_email}.`
                        : "."}
                </p>

                {order && (
                    <div className="mt-8 border-y border-maison-stone/40 py-5">
                        <div className="flex justify-between text-sm">
                            <span>Order total</span>
                            <span className="font-medium">
                                {formatAmount(order.total_amount, order.currency)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <Link href="/">
                        <Button variant="primary" size="lg">
                            RETURN TO MAISON FLAGSHIP
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}