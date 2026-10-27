'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { digitalProducts } from "@/lib/catalog";
import {
  Check,
  Download,
  Star,
  Loader2,
  CreditCard,
  PartyPopper,
} from "lucide-react";
import { toast } from "sonner";

export function DigitalProducts() {
  const [buying, setBuying] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<string | null>(null);

  const handleBuy = async (productId: string, title: string, price: number) => {
    setBuying(productId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email: "customer@example.com" }),
      });
      const json = await res.json();
      if (!json.ok) {
        toast.error(json.error || "Checkout failed");
        return;
      }

      if (json.mode === "stripe") {
        // Real Stripe: redirect to hosted checkout
        window.location.href = json.url;
      } else {
        // Demo mode: simulate success
        setPurchased(productId);
        toast.success(
          `Demo purchase: ${title} · $${price.toFixed(2)} recorded in dashboard`
        );
        setTimeout(() => setPurchased(null), 4000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setBuying(null);
    }
  };

  return (
    <section
      id="products"
      className="scroll-mt-16 border-y border-border/40 bg-muted/20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Digital products
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Build once. Sell forever.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Zero marginal cost. Infinite inventory. Every sale after the first
            one is pure profit. These are the digital products our creators are
            selling right now — click <strong>Buy now</strong> to test the live
            checkout flow.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {digitalProducts.map((p, i) => {
            const isPurchased = purchased === p.id;
            const isBuying = buying === p.id;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="group flex h-full flex-col overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-muted/60 to-muted/20">
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">
                      {p.emoji}
                    </div>
                    <div className="absolute right-2 top-2">
                      <Badge variant="secondary" className="bg-background/80">
                        {p.type}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="text-base leading-snug">
                      {p.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {p.rating}
                      </span>
                      <span>{p.sales.toLocaleString()} sold</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      {p.description}
                    </p>

                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-1.5">
                          <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-500" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="text-lg font-bold tabular-nums">
                        ${p.price}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleBuy(p.id, p.title, p.price)}
                        disabled={isBuying || isPurchased}
                        variant={isPurchased ? "secondary" : "default"}
                      >
                        {isBuying ? (
                          <>
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            Processing…
                          </>
                        ) : isPurchased ? (
                          <>
                            <PartyPopper className="mr-1.5 h-3.5 w-3.5" />
                            Sold!
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                            Buy now
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CreditCard className="h-3.5 w-3.5" />
          <span>
            Demo checkout mode active — purchases are recorded in the live
            dashboard. Add a Stripe key in <code>.env</code> to enable real
            payments.
          </span>
        </div>
      </div>
    </section>
  );
}
