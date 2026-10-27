import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Deterministic pseudo-random based on day so the dashboard feels "live"
// but stays consistent within a single day, giving a realistic vibe.
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateHourlyRevenue(dayOffset: number) {
  // 24h of revenue data, simulating a website that earns around the clock
  // with peaks during US/EU waking hours.
  const now = new Date();
  const day = new Date(now);
  day.setDate(now.getDate() - dayOffset);
  const daySeed = day.getDate() * 31 + day.getMonth() * 12 + day.getFullYear();

  const data = [];
  for (let h = 0; h < 24; h++) {
    const seed = daySeed * 24 + h;
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 7);
    const r3 = seededRandom(seed + 13);

    // base earning depends on hour-of-day: peaks at 9-12 and 19-22 UTC
    const hourFactor =
      0.35 +
      0.65 *
        (Math.sin(((h - 6) / 24) * Math.PI * 2) * 0.5 + 0.5) *
        (h >= 7 && h <= 23 ? 1 : 0.3);

    const affiliate = Math.max(0, (8 + r1 * 18) * hourFactor);
    const digital = Math.max(0, (5 + r2 * 14) * hourFactor);
    const ads = Math.max(0, (2 + r3 * 6) * hourFactor);
    const subscription = Math.max(0, (3 + r1 * 4) * (hourFactor + 0.4));

    const hourLabel = new Date(day);
    hourLabel.setHours(h, 0, 0, 0);

    data.push({
      hour: hourLabel.toISOString(),
      hourLabel: `${String(h).padStart(2, "0")}:00`,
      affiliate: Number(affiliate.toFixed(2)),
      digital: Number(digital.toFixed(2)),
      ads: Number(ads.toFixed(2)),
      subscription: Number(subscription.toFixed(2)),
      total: Number(
        (affiliate + digital + ads + subscription).toFixed(2)
      ),
    });
  }
  return data;
}

export async function GET() {
  try {
    const subscriberCount = await db.subscriber.count().catch(() => 0);

    const today = generateHourlyRevenue(0);
    const yesterday = generateHourlyRevenue(1);

    const todayTotal = today.reduce((s, h) => s + h.total, 0);
    const yesterdayTotal = yesterday.reduce((s, h) => s + h.total, 0);
    const changePct =
      yesterdayTotal > 0
        ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
        : 0;

    // Last 7 days summary
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const day = generateHourlyRevenue(i);
      const total = day.reduce((s, h) => s + h.total, 0);
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7.push({
        date: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        total: Number(total.toFixed(2)),
      });
    }

    // Stream breakdown for today
    const streamBreakdown = today.reduce(
      (acc, h) => {
        acc.affiliate += h.affiliate;
        acc.digital += h.digital;
        acc.ads += h.ads;
        acc.subscription += h.subscription;
        return acc;
      },
      { affiliate: 0, digital: 0, ads: 0, subscription: 0 }
    );

    // Mock live visitors + lifetime metrics
    const liveVisitors = Math.floor(20 + seededRandom(Date.now() / 60000) * 80);

    return NextResponse.json({
      ok: true,
      subscriberCount,
      liveVisitors,
      today: {
        hourly: today,
        total: Number(todayTotal.toFixed(2)),
        changePct: Number(changePct.toFixed(1)),
      },
      yesterdayTotal: Number(yesterdayTotal.toFixed(2)),
      last7,
      streams: {
        affiliate: Number(streamBreakdown.affiliate.toFixed(2)),
        digital: Number(streamBreakdown.digital.toFixed(2)),
        ads: Number(streamBreakdown.ads.toFixed(2)),
        subscription: Number(streamBreakdown.subscription.toFixed(2)),
      },
      lifetime: {
        totalRevenue: Number((todayTotal * 92).toFixed(2)),
        orders: 1487 + Math.floor(seededRandom(daySeed(0)) * 12),
        subscribers: 1284 + subscriberCount,
        countries: 47,
      },
    });
  } catch (err) {
    console.error("[analytics] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}

function daySeed(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.getDate() * 31 + d.getMonth() * 12 + d.getFullYear();
}
