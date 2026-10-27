'use client'

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ArrowUpRight,
  Globe2,
  Package,
  Users,
  Megaphone,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityEvent = {
  id: string;
  stream: string;
  label: string;
  amount: number;
  city: string;
  minutesAgo: number;
  timestamp: string;
};

const streamMeta: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  digital: {
    icon: <Package className="h-3.5 w-3.5" />,
    color: "#f59e0b",
    bg: "#f59e0b1a",
  },
  affiliate: {
    icon: <Handshake className="h-3.5 w-3.5" />,
    color: "#10b981",
    bg: "#10b9811a",
  },
  subscription: {
    icon: <Users className="h-3.5 w-3.5" />,
    color: "#ec4899",
    bg: "#ec48991a",
  },
  ads: {
    icon: <Megaphone className="h-3.5 w-3.5" />,
    color: "#8b5cf6",
    bg: "#8b5cf61a",
  },
};

function timeAgoLabel(minutes: number) {
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hr ago";
  return `${hours} hr ago`;
}

export function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/activity");
        const json = await res.json();
        if (!cancelled && json.ok) {
          setEvents(json.events);
          setLoading(false);
        }
      } catch (err) {
        console.error("[activity-feed] failed", err);
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live activity
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Real-time purchases, signups, and ad revenue
          </p>
        </div>
        <Badge variant="outline" className="hidden sm:flex">
          <Activity className="mr-1 h-3 w-3" />
          {events.length} events
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[280px] pr-3">
          <div className="space-y-2">
            {loading
              ? [...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border/40 p-2.5"
                  >
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-muted/60" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-muted/60" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted/40" />
                    </div>
                  </div>
                ))
              : events.map((event, i) => {
                  const meta = streamMeta[event.stream] || streamMeta.digital;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="group flex items-center gap-3 rounded-lg border border-border/40 p-2.5 transition-colors hover:bg-muted/40"
                    >
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: meta.bg,
                          color: meta.color,
                        }}
                      >
                        {meta.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium">
                          {event.label}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Globe2 className="h-2.5 w-2.5" />
                            {event.city}
                          </span>
                          <span>·</span>
                          <span>{timeAgoLabel(event.minutesAgo)}</span>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-0.5 font-semibold tabular-nums text-emerald-500">
                        <ArrowUpRight className="h-3 w-3" />$
                        {event.amount.toFixed(2)}
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
