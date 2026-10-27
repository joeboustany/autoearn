'use client'

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { affiliateProducts } from "@/lib/catalog";
import { Star, ExternalLink, TrendingUp } from "lucide-react";

export function AffiliateStore() {
  return (
    <section id="affiliate" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Affiliate store
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Curated products that pay you back
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Hand-picked affiliate offers with proven conversion rates. Drop
            these into your blog posts, videos, or newsletters and earn a
            commission on every sale.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {affiliateProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card className="group h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-3 p-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60 text-2xl">
                      {p.emoji}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {p.vendor}
                      </div>
                      <div className="text-[11px] text-muted-foreground/80">
                        {p.category}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-500">
                    {p.commission}% comm.
                  </div>
                </div>

                <CardContent className="space-y-3 p-5 pt-2">
                  <CardTitle className="text-base leading-snug">
                    {p.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{p.blurb}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="text-[10px] font-normal"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{p.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({p.reviews.toLocaleString()})
                      </span>
                    </div>
                    <div className="font-semibold tabular-nums">
                      ${p.price.toFixed(2)}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Promote this offer
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                Average creator earns $312/mo from just 3 promoted offers
              </div>
              <div className="text-xs text-muted-foreground">
                Based on 4,200 active AutoEarn affiliate accounts · last 90 days
              </div>
            </div>
          </div>
          <Button size="sm">Join affiliate program</Button>
        </div>
      </div>
    </section>
  );
}
