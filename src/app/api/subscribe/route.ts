import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const SubscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().default("organic"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address" },
        { status: 400 }
      );
    }
    const { email, name, source } = parsed.data;

    const existing = await db.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "You're already on the list — welcome back!",
        alreadySubscribed: true,
      });
    }

    await db.subscriber.create({
      data: { email, name, source },
    });

    return NextResponse.json({
      ok: true,
      message: "Subscribed! Check your inbox to confirm.",
    });
  } catch (err) {
    console.error("[subscribe] error", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await db.subscriber.count();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    console.error("[subscribe GET] error", err);
    return NextResponse.json({ ok: false, count: 0 });
  }
}
