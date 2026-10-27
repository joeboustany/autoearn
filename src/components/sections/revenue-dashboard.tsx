'use client'

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Globe2,
  Package,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type HourlyPoint = {
  hour: string;
  hourLabel: string;
  affiliate: number;
  digital: number;
  ads: number;
  subscription: number;
  total: number;
};

type AnalyticsData = {
  ok: boolean;
  subscriberCount: number;
  liveVisitors: number;
  today: {
    hourly: HourlyPoint[];
    total: number;
    changePct: number;
  };
  yesterdayTotal: number;
  last7: { date: string; label: string; total: number }[];
  streams: {
    affiliate: number;
    digital: number;
    ads: number;
    subscription: number;
  };
  lifetime: {
    totalRevenue: number;
    orders: number;
    subscribers: number;
    countries: number;
  };
};

const STREAM_COLORS = {
  affiliate: "#10b981",
  digital: "#f59e0b",
  ads: "#8b5cf6",
  subscription: "#ec4899",
};

const STREAM_META = [
  { key: "affiliate", label: "Affiliate", emoji: "🤝" },
  { key: "digital", label: "Digital", emoji: "📦" },
  { key: "ads", label: "Ads", emoji: "📊" },
  { key: "subscription", label: "Subs", emoji: "✉️" },
] as const;

export function RevenueDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error("[dashboard] failed", err);
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const todayTotal = data?.today.total ?? 0;
  const changePct = data?.today.changePct ?? 0;
  const liveVisitors = data?.liveVisitors ?? 0;
  const subscriberCount = data?.subscriberCount ?? 0;
  const lifetime = data?.lifetime;

  return (
    <section
      id="dashboard"
      className="scroll-mt-16 border-y border-border/40 bg-muted/20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              Live dashboard
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Watch the revenue tick up in real time
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              This is the same dashboard every AutoEarn creator gets. Numbers
              refresh every 30 seconds.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono tabular-nums">{clock || "--:--:--"}</span>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="Earned today"
            value={loading ? "—" : `$${todayTotal.toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4" />}
            delta={changePct}
            highlight
          />
          <KpiCard
            label="Live visitors"
            value={loading ? "—" : liveVisitors.toLocaleString()}
            icon={<Activity className="h-4 w-4" />}
            sublabel="right now"
          />
          <KpiCard
            label="Email subscribers"
            value={
              loading ? "—" : (1284 + subscriberCount).toLocaleString()
            }
            icon={<Users className="h-4 w-4" />}
            sublabel={`+${subscriberCount} from this page`}
          />
          <KpiCard
            label="Lifetime revenue"
            value={
              loading || !lifetime
                ? "—"
                : `$${lifetime.totalRevenue.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`
            }
            icon={<Globe2 className="h-4 w-4" />}
            sublabel={
              lifetime
                ? `${lifetime.orders.toLocaleString()} orders · ${lifetime.countries} countries`
                : ""
            }
          />
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">Today's revenue</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hourly earnings · {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <StreamLegend />
            </CardHeader>
            <CardContent className="pt-0">
              {loading || !data ? (
                <ChartSkeleton className="h-[260px]" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={data.today.hourly}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      {STREAM_META.map((s) => (
                        <linearGradient
                          key={s.key}
                          id={`grad-${s.key}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={STREAM_COLORS[s.key]}
                            stopOpacity={0.45}
                          />
                          <stop
                            offset="95%"
                            stopColor={STREAM_COLORS[s.key]}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.4}
                    />
                    <XAxis
                      dataKey="hourLabel"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      interval={2}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip content={<RevenueTooltip />} />
                    {STREAM_META.map((s) => (
                      <Area
                        key={s.key}
                        type="monotone"
                        dataKey={s.key}
                        stackId="1"
                        stroke={STREAM_COLORS[s.key]}
                        strokeWidth={1.5}
                        fill={`url(#grad-${s.key})`}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Revenue by stream</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Today's breakdown
              </p>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <ChartSkeleton className="h-[260px]" />
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie
                        data={STREAM_META.map((s) => ({
                          name: s.label,
                          value: Number(
                            (data.streams as any)[s.key]
                          ).toFixed(2),
                          color: STREAM_COLORS[s.key],
                        }))}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {STREAM_META.map((s) => (
                          <Cell
                            key={s.key}
                            fill={STREAM_COLORS[s.key]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: any) => [`$${value}`, "Revenue"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-1.5">
                    {STREAM_META.map((s) => {
                      const val = (data.streams as any)[s.key] as number;
                      const total = Object.values(data.streams).reduce(
                        (a, b) => a + b,
                        0
                      );
                      const pct = total > 0 ? (val / total) * 100 : 0;
                      return (
                        <div
                          key={s.key}
                          className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-sm"
                              style={{
                                backgroundColor: STREAM_COLORS[s.key],
                              }}
                            />
                            <span>
                              {s.emoji} {s.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">
                              {pct.toFixed(0)}%
                            </span>
                            <span className="font-semibold tabular-nums">
                              ${val.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Last 7 days bar chart */}
        <Card className="mt-4 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">Last 7 days</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Daily revenue totals
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span>
                Total:{" "}
                <span className="font-semibold text-foreground">
                  $
                  {data?.last7
                    .reduce((s, d) => s + d.total, 0)
                    .toFixed(0)
                    .toLocaleString() ?? "—"}
                </span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {loading || !data ? (
              <ChartSkeleton className="h-[180px]" />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={data.last7}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.4}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--accent) / 0.4)" }}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`$${value}`, "Revenue"]}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  icon,
  delta,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  delta?: number;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={cn(
        "border-border/60 transition-shadow hover:shadow-md",
        highlight && "border-emerald-500/30 bg-emerald-500/[0.04]"
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <div
          className={cn(
            "mt-2 text-2xl font-bold tabular-nums sm:text-3xl",
            highlight && "text-emerald-500"
          )}
        >
          {value}
        </div>
        {(delta !== undefined || sublabel) && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {delta !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-0.5 font-medium",
                  delta >= 0 ? "text-emerald-500" : "text-red-500"
                )}
              >
                {delta >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(delta).toFixed(1)}%
              </span>
            )}
            {sublabel && (
              <span className="text-muted-foreground">{sublabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60",
        className
      )}
    />
  );
}

function StreamLegend() {
  return (
    <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
      {STREAM_META.map((s) => (
        <span
          key={s.key}
          className="flex items-center gap-1 text-[11px] text-muted-foreground"
        >
          <span
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: STREAM_COLORS[s.key] }}
          />
          {s.label}
        </span>
      ))}
    </div>
  );
}

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
      <div className="mb-1.5 text-xs font-medium text-foreground">
        {label} · <span className="font-bold">${total.toFixed(2)}</span>
      </div>
      <div className="space-y-0.5">
        {payload
          .slice()
          .reverse()
          .map((p: any) => (
            <div
              key={p.dataKey}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: p.color }}
              />
              <span className="capitalize text-muted-foreground">
                {p.dataKey}
              </span>
              <span className="ml-auto font-semibold tabular-nums">
                ${p.value.toFixed(2)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
