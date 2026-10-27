import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digitalProducts } from "@/lib/catalog";

/**
 * Create a Stripe Checkout Session for a digital product.
 *
 * If STRIPE_SECRET_KEY is configured (starts with "sk_"), we create a real
 * Stripe Checkout Session. Otherwise, we fall back to "demo mode" — we record
 * the order directly in the DB so the dashboard updates immediately. Demo
 * mode lets you click "Buy now" and watch the analytics tick up without a
 * real Stripe account.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const productId = typeof body.productId === "string" ? body.productId : null;
    const email =
      typeof body.email === "string"
        ? body.email
        : "demo-customer@example.com";

    const product = digitalProducts.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Unknown product" },
        { status: 404 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const hasRealStripe = !!stripeKey && !stripeKey.includes("placeholder");

    // ---- REAL STRIPE MODE ----
    if (hasRealStripe) {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey!, {
        apiVersion: "2025-09-30.clover" as any,
      });

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: Math.round(product.price * 100),
              product_data: {
                name: product.title,
                description: product.description.slice(0, 200),
              },
            },
          },
        ],
        metadata: {
          product_id: product.id,
          product_type: product.type,
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?checkout=success&product=${product.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?checkout=cancelled`,
      });

      return NextResponse.json({
        ok: true,
        mode: "stripe",
        url: session.url,
        sessionId: session.id,
      });
    }

    // ---- DEMO MODE ----
    await db.revenueEvent.create({
      data: {
        stream: "digital",
        amount: product.price,
        currency: "USD",
        description: `Demo purchase: ${product.title}`,
      },
    });

    return NextResponse.json({
      ok: true,
      mode: "demo",
      message: "Demo purchase recorded. Revenue updated.",
      amount: product.price,
      product: product.title,
    });
  } catch (err) {
    console.error("[checkout] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
