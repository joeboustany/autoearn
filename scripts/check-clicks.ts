import { db } from "../src/lib/db";
async function main() {
  const clicks = await db.affiliateClick.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  console.log("Recent affiliate clicks:");
  for (const c of clicks) {
    console.log(`  - ${c.productName} (${c.vendor}) from ${c.source} at ${c.createdAt.toISOString()}`);
  }
  const total = await db.affiliateClick.count();
  console.log(`Total clicks: ${total}`);
}
main().catch(console.error).finally(() => process.exit(0));
