'use client'

import { motion } from "framer-motion";
import { testimonials } from "@/lib/catalog";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Real creators. Real revenue.
          </h2>
          <p className="mt-2 text-muted-foreground">
            Numbers from creators who started with the AutoEarn blueprint in
            the last 12 months.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-muted-foreground/15" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-foreground">
                "{t.quote}"
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatBlock value="$3.8M+" label="Paid to creators" />
          <StatBlock value="12,840" label="Active accounts" />
          <StatBlock value="47" label="Countries" />
          <StatBlock value="4.8/5" label="Avg. satisfaction" />
        </div>
      </div>
    </section>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center">
      <div className="text-xl font-bold text-emerald-500 sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
