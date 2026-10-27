import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Admin endpoint (lightweight password gate).
 *
 * The password is set via ADMIN_PASSWORD env var (default "autoearn-admin").
 * In production, replace with proper NextAuth.js authentication.
 *
 * ?token=xxx (or ?password=xxx in dev) grants access to:
 *  - subscriber count + recent subscribers
 *  - revenue event count + recent events
 *  - page view count + recent views
 *  - affiliate click count + recent clicks
 *  - payout count + recent payouts
 *  - current month goal + progress
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "autoearn-admin";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || url.searchParams.get("password");

  if (token !== ADMIN_PASSWORD) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized. Pass ?token=<ADMIN_PASSWORD> to access admin data.",
      },
      { status: 401 }
    );
  }

  try {
    const [
      subscriberCount,
      revenueCount,
      pageViewCount,
      clickCount,
      payoutCount,
      recentSubscribers,
      recentRevenue,
      recentViews,
      recentClicks,
      recentPayouts,
      currentGoal,
      revenueThisMonth,
    ] = await Promise.all([
      db.subscriber.count(),
      db.revenueEvent.count(),
      db.pageView.count(),
      db.affiliateClick.count(),
      db.payout.count(),
      db.subscriber.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.revenueEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.pageView.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.affiliateClick.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.payout.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      getCurrentGoal(),
      getRevenueThisMonth(),
    ]);

    const goalProgress =
      currentGoal && currentGoal.target > 0
        ? Math.min(100, (revenueThisMonth / currentGoal.target) * 100)
        : 0;

    return NextResponse.json({
      ok: true,
      counts: {
        subscribers: subscriberCount,
        revenue: revenueCount,
        pageViews: pageViewCount,
        clicks: clickCount,
        payouts: payoutCount,
      },
      recent: {
        subscribers: recentSubscribers,
        revenue: recentRevenue,
        views: recentViews,
        clicks: recentClicks,
        payouts: recentPayouts,
      },
      goal: currentGoal
        ? {
            month: currentGoal.month,
            target: currentGoal.target,
            current: revenueThisMonth,
            progress: goalProgress,
          }
        : null,
    });
  } catch (err) {
    console.error("[admin] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load admin data" },
      { status: 500 }
    );
  }
}

async function getCurrentGoal() {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return db.goal.findUnique({ where: { month: monthKey } });
}

async function getRevenueThisMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const events = await db.revenueEvent.findMany({
    where: { createdAt: { gte: startOfMonth } },
    select: { amount: true },
  });
  return events.reduce((sum, e) => sum + e.amount, 0);
}
