import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Returns payout history. Auto-creates a "next Friday" pending payout
 * based on current week's revenue if one doesn't exist.
 */
export async function GET() {
  try {
    let payouts = await db.payout.findMany({
      orderBy: { scheduledAt: "desc" },
      take: 12,
    });

    // If no pending upcoming payout, create one for next Friday
    const hasPending = payouts.some(
      (p) =>
        p.status === "pending" &&
        new Date(p.scheduledAt).getTime() > Date.now()
    );

    if (!hasPending) {
      const nextFriday = getNextFriday();
      // Sum this week's revenue
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekRevenue = await db.revenueEvent.findMany({
        where: { createdAt: { gte: weekAgo } },
        select: { amount: true },
      });
      const weekTotal = weekRevenue.reduce((s, e) => s + e.amount, 0);
      const payoutAmount = weekTotal > 0 ? weekTotal : 312.45;

      await db.payout.create({
        data: {
          amount: payoutAmount,
          currency: "USD",
          status: "pending",
          method: "bank_transfer",
          scheduledAt: nextFriday,
        },
      });

      payouts = await db.payout.findMany({
        orderBy: { scheduledAt: "desc" },
        take: 12,
      });
    }

    // Format for frontend
    const formatted = payouts.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      method: p.method,
      scheduledAt: p.scheduledAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, payouts: formatted });
  } catch (err) {
    console.error("[payouts] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load payouts" },
      { status: 500 }
    );
  }
}

function getNextFriday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 5=Fri
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const friday = new Date(now);
  friday.setDate(now.getDate() + daysUntilFriday);
  friday.setHours(9, 0, 0, 0); // 9 AM Friday
  return friday;
}
