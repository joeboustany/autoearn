'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "hero-section" }),
      });
      const json = await res.json();
      if (json.ok) {
        setDone(true);
        toast.success(json.message);
      } else {
        toast.error(json.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="subscribe" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-background to-background p-8 sm:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                <Mail className="h-3.5 w-3.5" />
                Free weekly newsletter
              </div>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Get the weekly blueprint for{" "}
                <span className="text-emerald-500">sleep money</span>
              </h2>
              <p className="mt-4 max-w-md text-pretty text-muted-foreground">
                One email every Sunday. New income streams, real revenue
                breakdowns, and the exact tools our creators are using this
                week. No fluff. Unsubscribe anytime.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  12,840+ subscribers
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Avg open rate 64%
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Free forever
                </span>
              </div>
            </div>

            <div className="flex items-center">
              {done ? (
                <div className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-8 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  <div className="text-lg font-semibold">
                    You're in. Welcome aboard!
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox — your first issue lands in a few minutes.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={submit}
                  className="w-full space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="nl-name" className="text-xs">
                      Your name (optional)
                    </Label>
                    <Input
                      id="nl-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex"
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="nl-email" className="text-xs">
                      Email address
                    </Label>
                    <Input
                      id="nl-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subscribing…
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Get the weekly blueprint
                      </>
                    )}
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    By subscribing you agree to receive marketing emails. No
                    spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
