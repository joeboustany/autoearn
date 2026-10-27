'use client'

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Moon, Sparkles, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24"
    >
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute right-1/4 top-40 h-[260px] w-[260px] rounded-full bg-violet-500/10 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.18) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-500">
            <Sparkles className="h-3.5 w-3.5" />
            Live revenue engine — earning 24/7/365
          </div>

          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Your money works
            <br className="hidden sm:block" /> while you{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              sleep
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            AutoEarn builds automated income streams — affiliate marketing,
            digital products, display ads, and recurring subscriptions — then
            shows you the revenue compounding in real time on your own
            dashboard.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto group">
              <Link href="#dashboard">
                See live revenue
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href="#streams">Explore income streams</Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center sm:gap-8">
            <Stat value="4" label="Active streams" />
            <Stat value="$3,847" label="Earned today" highlight />
            <Stat value="92%" label="Passive score" />
          </div>
        </motion.div>

        {/* Floating "sleep mode" card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-14 max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Moon className="h-4 w-4 text-indigo-400" />
                Sleep mode active · 03:42 AM
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MiniRevenue
                emoji="🤝"
                label="Affiliate"
                amount="$1,284.20"
                delta="+12%"
              />
              <MiniRevenue
                emoji="📦"
                label="Digital"
                amount="$912.50"
                delta="+8%"
              />
              <MiniRevenue
                emoji="📊"
                label="Ads"
                amount="$418.30"
                delta="+3%"
              />
              <MiniRevenue
                emoji="✉️"
                label="Subs"
                amount="$1,232.00"
                delta="+15%"
              />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>
                Auto-deposited to your account every Friday. Last payout:
                $24,820.40.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div
        className={
          highlight
            ? "text-2xl font-bold text-emerald-500 sm:text-3xl"
            : "text-2xl font-bold sm:text-3xl"
        }
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
        {label}
      </div>
    </div>
  );
}

function MiniRevenue({
  emoji,
  label,
  amount,
  delta,
}: {
  emoji: string;
  label: string;
  amount: string;
  delta: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/60 p-3">
      <div className="text-lg">{emoji}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{amount}</div>
      <div className="mt-0.5 text-[10px] text-emerald-500">{delta} today</div>
    </div>
  );
}
