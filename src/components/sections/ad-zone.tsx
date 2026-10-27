'use client'

import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";

export function AdZone() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Leaderboard ad */}
          <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 text-center">
            <span className="absolute left-2 top-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Advertisement · 728×90
            </span>
            <div className="flex flex-col items-center">
              <Megaphone className="h-5 w-5 text-muted-foreground/50" />
              <p className="mt-1 text-xs text-muted-foreground/70">
                Your display ad here · ~$1.20 RPM
              </p>
            </div>
          </div>

          {/* Sponsored */}
          <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 text-center">
            <span className="absolute left-2 top-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Sponsored · Native
            </span>
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="mb-1 text-[10px]">
                Partner content
              </Badge>
              <p className="text-xs text-muted-foreground/70">
                Earn $80–250 per sponsored placement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
