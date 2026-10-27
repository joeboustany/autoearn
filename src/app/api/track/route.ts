import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
    const source =
      typeof body.source === "string" ? body.source.slice(0, 50) : null;

    await db.pageView.create({ data: { path, source: source ?? undefined } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[track] error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
