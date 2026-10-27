'use client'

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/lib/catalog";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export function Blog() {
  const [featured, ...rest] = articles;
  return (
    <section id="blog" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              SEO blog
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Articles that pull traffic while you sleep
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Every article is built around a high-intent search query. The
              traffic compounds month over month — and so do the affiliate
              commissions embedded inside.
            </p>
          </div>
          <Link
            href="#blog"
            className="hidden items-center gap-1 text-sm font-medium text-emerald-500 hover:underline sm:flex"
          >
            View all articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Featured */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 lg:row-span-2"
          >
            <Card className="group h-full overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg">
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent text-6xl">
                {featured.emoji}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{featured.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featured.readTime}
                  </span>
                </div>
                <CardTitle className="mt-2 text-xl leading-snug">
                  {featured.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {featured.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {featured.publishedAt}
                  </span>
                  <Link
                    href="#blog"
                    className="text-sm font-medium text-emerald-500 hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Side list */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
            {rest.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border-border/60 p-4 transition-all duration-300 hover:bg-muted/40">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-muted/60 text-2xl">
                      {article.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">
                          {article.category}
                        </span>
                        <span>·</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="mt-1 line-clamp-2 font-semibold leading-snug group-hover:text-emerald-500">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto pt-3 text-[11px] text-muted-foreground">
                    {article.publishedAt}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
