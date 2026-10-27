import { db } from "../src/lib/db";

async function main() {
  const events = await db.revenueEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  console.log("Recent revenue events:");
  for (const e of events) {
    console.log(`  - $${e.amount} via ${e.stream} — ${e.description} (${e.createdAt.toISOString()})`);
  }
  const total = await db.revenueEvent.count();
  const subs = await db.subscriber.count();
  console.log(`\nTotal revenue events: ${total}`);
  console.log(`Total subscribers: ${subs}`);
}
main().catch(console.error).finally(() => process.exit(0));
