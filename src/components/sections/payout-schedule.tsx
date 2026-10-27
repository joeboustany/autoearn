'use client'

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Payout = {
  id: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  method: string;
  scheduledAt: string;
  createdAt: string;
};

export function PayoutSchedule() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/payouts");
        const json = await res.json();
        if (!cancelled && json.ok) {
          setPayouts(json.payouts);
        }
      } catch (err) {
        console.error("[payouts] failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const nextPayout = payouts.find((p) => p.status === "pending");
  const completed = payouts.filter((p) => p.status === "completed");
  const totalCompleted = completed.reduce((s, p) => s + p.amount, 0);

  const nextPayoutDate = nextPayout ? new Date(nextPayout.scheduledAt) : null;
  const daysUntil = nextPayoutDate
    ? Math.ceil((nextPayoutDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <section id="payouts" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Auto-payouts
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Money lands in your bank every Friday
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            All revenue is auto-aggregated weekly and deposited to your linked
            account. No invoices, no chasing payments.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Next payout card */}
          <Card className="border-emerald-500/30 bg-emerald-500/[0.04] lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Banknote className="h-4 w-4 text-emerald-500" />
                Next payout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : nextPayout ? (
                <>
                  <div>
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <div className="mt-1 text-4xl font-bold text-emerald-500 tabular-nums">
                      ${nextPayout.amount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="space-y-1.5 rounded-lg border border-border/60 bg-background/60 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Scheduled</span>
                      <span className="font-medium">
                        {nextPayoutDate?.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">
                        {nextPayoutDate?.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Method</span>
                      <span className="font-medium capitalize">
                        {nextPayout.method.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  {daysUntil !== null && (
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-lg p-3 text-sm",
                        daysUntil <= 2
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <Clock className="h-4 w-4" />
                      <span>
                        {daysUntil === 0
                          ? "Today!"
                          : daysUntil === 1
                          ? "Tomorrow"
                          : `in ${daysUntil} days`}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No payout scheduled</p>
              )}
            </CardContent>
          </Card>

          {/* Payout history */}
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">Payout history</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>
                  Total paid:{" "}
                  <span className="font-semibold text-foreground">
                    ${totalCompleted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-md bg-muted/40"
                    />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[280px] pr-3">
                  <div className="space-y-2">
                    {payouts.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No payouts yet.
                      </p>
                    ) : (
                      payouts.map((payout, i) => {
                        const date = new Date(payout.scheduledAt);
                        return (
                          <motion.div
                            key={payout.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.04 }}
                            className="flex items-center justify-between rounded-lg border border-border/40 p-3 hover:bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-9 w-9 items-center justify-center rounded-lg",
                                  payout.status === "completed"
                                    ? "bg-emerald-500/15 text-emerald-500"
                                    : payout.status === "pending"
                                    ? "bg-amber-500/15 text-amber-500"
                                    : "bg-red-500/15 text-red-500"
                                )}
                              >
                                {payout.status === "completed" ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : payout.status === "pending" ? (
                                  <Clock className="h-4 w-4" />
                                ) : (
                                  <Calendar className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium capitalize">
                                  {payout.method.replace("_", " ")}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {date.toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  payout.status === "completed"
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : payout.status === "pending"
                                    ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                                }
                              >
                                {payout.status}
                              </Badge>
                              <div className="w-20 text-right text-sm font-semibold tabular-nums">
                                ${payout.amount.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
