import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Stripe webhook handler.
 *
 * In production, set STRIPE_WEBHOOK_SECRET and register this endpoint at
 * https://dashboard.stripe.com/webhooks. We listen for `checkout.session.completed`
 * and record the revenue in our DB so the live dashboard picks it up.
 *
 * In demo mode (no key), this endpoint is reachable but does nothing useful —
 * demo purchases are already recorded at /api/checkout time.
 */
export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (
    !stripeKey ||
    stripeKey.includes("placeholder") ||
    !webhookSecret ||
    webhookSecret.includes("placeholder")
  ) {
    // Acknowledge the request without doing anything in demo mode
    return NextResponse.json({ ok: true, mode: "demo", ignored: true });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-09-30.clover" as any,
    });

    const sig = req.headers.get("stripe-signature") || "";
    const rawBody = await req.text();

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const amountTotal = (session.amount_total || 0) / 100;
      const productId = session.metadata?.product_id || "unknown";
      const productType = session.metadata?.product_type || "digital";

      await db.revenueEvent.create({
        data: {
          stream: productType === "subscription" ? "subscription" : "digital",
          amount: amountTotal,
          currency: session.currency || "usd",
          description: `Stripe purchase: ${productId}`,
        },
      });
    }

    return NextResponse.json({ ok: true, received: true });
  } catch (err: any) {
    console.error("[stripe-webhook] error", err.message);
    return NextResponse.json(
      { ok: false, error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
}
