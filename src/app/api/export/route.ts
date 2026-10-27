import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * CSV export of subscribers or revenue events.
 * Pass ?type=subscribers|revenue|clicks|pageviews&payouts
 * Optional: ?token=<ADMIN_PASSWORD> for production (skipped in demo)
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "autoearn-admin";

function escapeCsv(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "subscribers";
  const token = url.searchParams.get("token");

  if (token !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let rows: Record<string, any>[] = [];
  let headers: string[] = [];

  try {
    switch (type) {
      case "subscribers": {
        rows = await db.subscriber.findMany({
          orderBy: { createdAt: "desc" },
        });
        headers = ["id", "email", "name", "source", "createdAt"];
        break;
      }
      case "revenue": {
        rows = await db.revenueEvent.findMany({
          orderBy: { createdAt: "desc" },
        });
        headers = ["id", "stream", "amount", "currency", "description", "createdAt"];
        break;
      }
      case "clicks": {
        rows = await db.affiliateClick.findMany({
          orderBy: { createdAt: "desc" },
        });
        headers = ["id", "productId", "productName", "vendor", "source", "createdAt"];
        break;
      }
      case "pageviews": {
        rows = await db.pageView.findMany({
          orderBy: { createdAt: "desc" },
        });
        headers = ["id", "path", "source", "country", "createdAt"];
        break;
      }
      case "payouts": {
        rows = await db.payout.findMany({
          orderBy: { createdAt: "desc" },
        });
        headers = ["id", "amount", "currency", "status", "method", "scheduledAt", "createdAt"];
        break;
      }
      default:
        return NextResponse.json(
          { ok: false, error: "Unknown export type" },
          { status: 400 }
        );
    }

    const csvLines = [headers.join(",")];
    for (const row of rows) {
      csvLines.push(headers.map((h) => escapeCsv(row[h])).join(","));
    }
    const csv = csvLines.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="autoearn-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("[export] error", err);
    return NextResponse.json(
      { ok: false, error: "Export failed" },
      { status: 500 }
    );
  }
}
