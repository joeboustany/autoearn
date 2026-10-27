import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const ClickSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  vendor: z.string(),
  source: z.string().default("organic"),
});

/**
 * Records an outbound affiliate link click.
 * Called when a visitor clicks "Promote this offer" or any affiliate CTA.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ClickSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }
    const { productId, productName, vendor, source } = parsed.data;

    await db.affiliateClick.create({
      data: { productId, productName, vendor, source },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[affiliate-click] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to track click" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const total = await db.affiliateClick.count();
    const byProduct = await db.affiliateClick.groupBy({
      by: ["productName"],
      _count: true,
      orderBy: { _count: { productName: "desc" } },
      take: 10,
    });
    return NextResponse.json({ ok: true, total, byProduct });
  } catch (err) {
    console.error("[affiliate-click GET] error", err);
    return NextResponse.json({ ok: false, total: 0, byProduct: [] });
  }
}
