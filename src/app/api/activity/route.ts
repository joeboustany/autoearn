import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Deterministic pseudo-random for stable activity within a minute window
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const cities = [
  "Austin, US",
  "London, UK",
  "Berlin, DE",
  "Toronto, CA",
  "Sydney, AU",
  "Mumbai, IN",
  "Singapore",
  "São Paulo, BR",
  "Tokyo, JP",
  "Amsterdam, NL",
  "Dubai, AE",
  "Lagos, NG",
  "Seoul, KR",
  "Paris, FR",
  "Mexico City, MX",
];

const products = [
  { name: "Passive Income Blueprint", amount: 29 },
  { name: "Affiliate Blog Starter Kit", amount: 49 },
  { name: "Notion Money OS", amount: 39 },
  { name: "Email List Growth Toolkit", amount: 59 },
  { name: "Faceless YouTube Course", amount: 149 },
  { name: "Sleep Money Newsletter", amount: 99 },
  { name: "AeroPress Coffee Maker", amount: 39.95 },
  { name: "MX Master 3S Mouse", amount: 99.99 },
  { name: "Notion Plus Plan", amount: 96 },
];

const streamLabels: Record<string, string> = {
  affiliate: "Affiliate sale",
  digital: "Digital product",
  ads: "Ad revenue",
  subscription: "New subscriber",
};

export async function GET() {
  try {
    const realSubscriberCount = await db.subscriber.count().catch(() => 0);

    // Generate 12 most-recent activity events based on a time-seeded slot
    // so the feed feels live but doesn't flicker on every refresh.
    const now = Date.now();
    const slot = Math.floor(now / 60000); // changes every minute

    const events = [];
    for (let i = 0; i < 12; i++) {
      const r1 = seededRandom(slot * 100 + i * 7);
      const r2 = seededRandom(slot * 100 + i * 13 + 1);
      const r3 = seededRandom(slot * 100 + i * 17 + 2);
      const r4 = seededRandom(slot * 100 + i * 23 + 3);

      const product = products[Math.floor(r1 * products.length)];
      const city = cities[Math.floor(r2 * cities.length)];
      const minutesAgo = Math.floor(r3 * 28) + 1;

      // Stream rotation: more affiliate/digital events, fewer ads/subscription
      const streamRoll = r4;
      let stream: string;
      if (streamRoll < 0.4) stream = "digital";
      else if (streamRoll < 0.7) stream = "affiliate";
      else if (streamRoll < 0.9) stream = "subscription";
      else stream = "ads";

      const amount =
        stream === "subscription"
          ? 9
          : stream === "ads"
          ? Number((0.5 + r3 * 4).toFixed(2))
          : product.amount;

      const label =
        stream === "subscription"
          ? "New paid subscriber"
          : stream === "ads"
          ? "Ad impression batch"
          : `${streamLabels[stream]} · ${product.name}`;

      events.push({
        id: `${slot}-${i}`,
        stream,
        label,
        amount: Number(amount.toFixed(2)),
        city,
        minutesAgo,
        timestamp: new Date(now - minutesAgo * 60000).toISOString(),
      });
    }

    // Sort by minutesAgo asc (most recent first)
    events.sort((a, b) => a.minutesAgo - b.minutesAgo);

    return NextResponse.json({
      ok: true,
      events,
      realSubscriberCount,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[activity] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load activity" },
      { status: 500 }
    );
  }
}
