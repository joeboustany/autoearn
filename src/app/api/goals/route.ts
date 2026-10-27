import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const GoalSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/), // "2026-10"
  target: z.number().min(0),
});

export async function GET() {
  try {
    const goals = await db.goal.findMany({
      orderBy: { month: "desc" },
      take: 12,
    });

    // Calculate current progress for each goal
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthRevenue = await db.revenueEvent.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: { amount: true },
    });
    const currentTotal = monthRevenue.reduce((s, e) => s + e.amount, 0);

    const withProgress = goals.map((g) => {
      const progress =
        g.month === monthKey && g.target > 0
          ? Math.min(100, (currentTotal / g.target) * 100)
          : 0;
      return {
        ...g,
        current: g.month === monthKey ? currentTotal : 0,
        progress,
      };
    });

    return NextResponse.json({ ok: true, goals: withProgress });
  } catch (err) {
    console.error("[goals GET] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load goals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GoalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input" },
        { status: 400 }
      );
    }
    const { month, target } = parsed.data;

    const goal = await db.goal.upsert({
      where: { month },
      create: { month, target },
      update: { target },
    });

    return NextResponse.json({ ok: true, goal });
  } catch (err) {
    console.error("[goals POST] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save goal" },
      { status: 500 }
    );
  }
}
