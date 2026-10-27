'use client'

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { streams } from "@/lib/catalog";
import { Clock, Gauge } from "lucide-react";

export function IncomeStreams() {
  return (
    <section id="streams" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Four pillars
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Four income streams. One automated engine.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Each stream runs on its own clock. Stacked together, they create
            revenue that compounds day and night — even when no one is at the
            keyboard.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {streams.map((stream, i) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="group h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div
                  className="h-1.5 w-full"
                  style={{ background: stream.color }}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                      style={{ backgroundColor: `${stream.color}1a` }}
                    >
                      {stream.emoji}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stream.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg">{stream.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {stream.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Gauge className="h-3 w-3" /> Passive score
                      </span>
                      <span className="font-semibold">
                        {stream.passiveScore}%
                      </span>
                    </div>
                    <Progress value={stream.passiveScore} className="h-1.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="rounded-md bg-muted/50 p-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" /> Setup
                      </div>
                      <div className="mt-0.5 font-medium">
                        {stream.setupTime}
                      </div>
                    </div>
                    <div className="rounded-md bg-muted/50 p-2">
                      <div className="text-muted-foreground">Monthly est.</div>
                      <div className="mt-0.5 font-medium">
                        {stream.monthlyEstimate}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
