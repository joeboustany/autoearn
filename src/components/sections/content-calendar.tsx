'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ScheduledPost = {
  id: string;
  day: string; // Mon, Tue, ...
  date: string;
  time: string;
  platform: "Pinterest" | "YouTube" | "Instagram" | "Newsletter" | "Twitter";
  title: string;
  type: "Pin" | "Short" | "Reel" | "Email" | "Thread";
  status: "scheduled" | "published" | "draft";
};

const week: ScheduledPost[] = [
  {
    id: "p1",
    day: "Mon",
    date: "Oct 27",
    time: "09:00",
    platform: "Pinterest",
    title: "Pin: 7 Passive Income Streams 2026",
    type: "Pin",
    status: "published",
  },
  {
    id: "p2",
    day: "Mon",
    date: "Oct 27",
    time: "14:00",
    platform: "Twitter",
    title: "Thread: Faceless YouTube stack",
    type: "Thread",
    status: "published",
  },
  {
    id: "p3",
    day: "Tue",
    date: "Oct 28",
    time: "10:00",
    platform: "Instagram",
    title: "Reel: 5 sec demo of Notion Money OS",
    type: "Reel",
    status: "scheduled",
  },
  {
    id: "p4",
    day: "Wed",
    date: "Oct 29",
    time: "16:00",
    platform: "YouTube",
    title: "Short: 'How I earn $3K while sleeping'",
    type: "Short",
    status: "scheduled",
  },
  {
    id: "p5",
    day: "Thu",
    date: "Oct 30",
    time: "11:00",
    platform: "Pinterest",
    title: "Pin: Best affiliate programs for beginners",
    type: "Pin",
    status: "scheduled",
  },
  {
    id: "p6",
    day: "Fri",
    date: "Oct 31",
    time: "08:00",
    platform: "Newsletter",
    title: "Weekly Sleep Money issue #47",
    type: "Email",
    status: "draft",
  },
  {
    id: "p7",
    day: "Fri",
    date: "Oct 31",
    time: "12:00",
    platform: "YouTube",
    title: "Long-form: Affiliate marketing case study",
    type: "Short",
    status: "scheduled",
  },
  {
    id: "p8",
    day: "Sat",
    date: "Nov 1",
    time: "10:00",
    platform: "Instagram",
    title: "Carousel: 11 digital product ideas",
    type: "Reel",
    status: "draft",
  },
];

const platformMeta: Record<
  ScheduledPost["platform"],
  { color: string; icon: React.ReactNode }
> = {
  Pinterest: { color: "#e60023", icon: <Plus className="h-3 w-3" /> },
  YouTube: { color: "#ff0000", icon: <Youtube className="h-3 w-3" /> },
  Instagram: { color: "#c13584", icon: <Instagram className="h-3 w-3" /> },
  Newsletter: { color: "#10b981", icon: <Calendar className="h-3 w-3" /> },
  Twitter: { color: "#1da1f2", icon: <Twitter className="h-3 w-3" /> },
};

export function ContentCalendar() {
  // Group by day
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const byDay = days.map((d) => ({
    day: d,
    posts: week.filter((p) => p.day === d),
  }));

  return (
    <section id="calendar" className="scroll-mt-16 border-y border-border/40 bg-muted/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Content calendar
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Schedule a week of content in 10 minutes
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Plan every pin, post, short, and email in one drag-and-drop
            calendar. Bulk-schedule via Tailwind, Buffer, or Notion.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs">
          {Object.entries(platformMeta).map(([platform, meta]) => (
            <div key={platform} className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: meta.color }}
              >
                {meta.icon}
              </span>
              <span className="font-medium">{platform}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {byDay.map(({ day, posts }) => (
            <div
              key={day}
              className="min-h-[200px] rounded-xl border border-border/60 bg-background/60 p-2"
            >
              <div className="mb-2 flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-sm font-semibold">{day}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  aria-label={`Add post for ${day}`}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {posts.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/40 p-3 text-center text-[10px] text-muted-foreground/60">
                    No posts
                  </div>
                ) : (
                  posts.map((post) => {
                    const meta = platformMeta[post.platform];
                    return (
                      <div
                        key={post.id}
                        className={cn(
                          "group cursor-pointer rounded-lg border p-2 transition-all hover:shadow-sm",
                          post.status === "published"
                            ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                            : post.status === "draft"
                            ? "border-amber-500/30 bg-amber-500/[0.04]"
                            : "border-border/60 bg-background"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px] font-medium">
                            <span
                              className="flex h-3 w-3 items-center justify-center rounded-full text-white"
                              style={{ backgroundColor: meta.color }}
                            >
                              {meta.icon}
                            </span>
                            {post.platform}
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                            <Clock className="h-2 w-2" />
                            {post.time}
                          </span>
                        </div>
                        <div className="mt-1 line-clamp-2 text-[11px] leading-snug">
                          {post.title}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                            {post.type}
                          </span>
                          {post.status === "published" ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : post.status === "draft" ? (
                            <Circle className="h-3 w-3 text-amber-500" />
                          ) : (
                            <Clock className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CalendarStat label="This week" value="8 posts" />
          <CalendarStat label="Published" value="2" highlight="emerald" />
          <CalendarStat label="Scheduled" value="5" highlight="default" />
          <CalendarStat label="Drafts" value="2" highlight="amber" />
        </div>
      </div>
    </section>
  );
}

function CalendarStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "emerald" | "amber" | "default";
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-3 text-center">
        <div
          className={cn(
            "text-xl font-bold",
            highlight === "emerald" && "text-emerald-500",
            highlight === "amber" && "text-amber-500"
          )}
        >
          {value}
        </div>
        <div className="mt-0.5 text-[10px] text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
