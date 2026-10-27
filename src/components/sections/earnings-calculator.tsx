'use client'

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Users,
  Percent,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

type StreamKey = "affiliate" | "digital" | "ads" | "subscription";

const streamConfig: Record<
  StreamKey,
  {
    label: string;
    emoji: string;
    color: string;
    // [minCR, maxCR, defaultCR] conversion rate percent
    cr: [number, number, number];
    // [minAOV, maxAOV, defaultAOV] average order value or monthly subscription
    aov: [number, number, number];
  }
> = {
  affiliate: {
    label: "Affiliate",
    emoji: "🤝",
    color: "#10b981",
    cr: [0.5, 5, 2],
    aov: [20, 200, 60],
  },
  digital: {
    label: "Digital Product",
    emoji: "📦",
    color: "#f59e0b",
    cr: [0.5, 4, 1.5],
    aov: [9, 199, 39],
  },
  ads: {
    label: "Display Ads",
    emoji: "📊",
    color: "#8b5cf6",
    cr: [0, 0, 0], // unused for ads
    aov: [5, 50, 18], // RPM
  },
  subscription: {
    label: "Paid Newsletter",
    emoji: "✉️",
    color: "#ec4899",
    cr: [1, 8, 4],
    aov: [5, 25, 9],
  },
};

export function EarningsCalculator() {
  const [traffic, setTraffic] = useState(10000);
  const [affiliateCR, setAffiliateCR] = useState(streamConfig.affiliate.cr[2]);
  const [affiliateAOV, setAffiliateAOV] = useState(
    streamConfig.affiliate.aov[2]
  );
  const [digitalCR, setDigitalCR] = useState(streamConfig.digital.cr[2]);
  const [digitalAOV, setDigitalAOV] = useState(streamConfig.digital.aov[2]);
  const [adRPM, setAdRPM] = useState(streamConfig.ads.aov[2]);
  const [subCR, setSubCR] = useState(streamConfig.subscription.cr[2]);
  const [subAOV, setSubAOV] = useState(streamConfig.subscription.aov[2]);

  const results = useMemo(() => {
    // Affiliate: monthly revenue = traffic × CR × AOV
    const affiliateRev = (traffic * (affiliateCR / 100) * affiliateAOV);
    // Digital products
    const digitalRev = (traffic * (digitalCR / 100) * digitalAOV);
    // Ads: monthly revenue = traffic / 1000 × RPM
    const adsRev = (traffic / 1000) * adRPM;
    // Subscriptions (monthly recurring)
    const subRev = (traffic * (subCR / 100) * subAOV);
    const total = affiliateRev + digitalRev + adsRev + subRev;
    const yearly = total * 12;
    const daily = total / 30;

    return [
      {
        key: "affiliate" as StreamKey,
        monthly: affiliateRev,
        ...streamConfig.affiliate,
      },
      {
        key: "digital" as StreamKey,
        monthly: digitalRev,
        ...streamConfig.digital,
      },
      {
        key: "ads" as StreamKey,
        monthly: adsRev,
        ...streamConfig.ads,
      },
      {
        key: "subscription" as StreamKey,
        monthly: subRev,
        ...streamConfig.subscription,
      },
    ].sort((a, b) => b.monthly - a.monthly);
  }, [
    traffic,
    affiliateCR,
    affiliateAOV,
    digitalCR,
    digitalAOV,
    adRPM,
    subCR,
    subAOV,
  ]);

  const total = results.reduce((s, r) => s + r.monthly, 0);
  const maxBar = Math.max(...results.map((r) => r.monthly), 1);

  return (
    <section
      id="calculator"
      className="scroll-mt-16 border-y border-border/40 bg-muted/20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Earnings calculator
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Project your monthly passive income
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Drag the sliders to model your traffic, conversion rate, and order
            value. Watch the projected revenue update in real time across all
            four streams.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Inputs */}
          <Card className="border-border/60 lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SliderInput
                label="Monthly visitors"
                icon={<Users className="h-4 w-4" />}
                value={traffic}
                min={500}
                max={500000}
                step={500}
                onChange={setTraffic}
                format={(v) => v.toLocaleString()}
                suffix="visitors"
              />

              <div className="border-t border-border/60 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="text-base">{streamConfig.affiliate.emoji}</span>
                  {streamConfig.affiliate.label}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SliderInput
                    label="Conversion rate"
                    icon={<Percent className="h-4 w-4" />}
                    value={affiliateCR}
                    min={streamConfig.affiliate.cr[0]}
                    max={streamConfig.affiliate.cr[1]}
                    step={0.1}
                    onChange={setAffiliateCR}
                    format={(v) => v.toFixed(1)}
                    suffix="%"
                  />
                  <SliderInput
                    label="Avg commission"
                    icon={<DollarSign className="h-4 w-4" />}
                    value={affiliateAOV}
                    min={streamConfig.affiliate.aov[0]}
                    max={streamConfig.affiliate.aov[1]}
                    step={1}
                    onChange={setAffiliateAOV}
                    format={(v) => v.toFixed(0)}
                    prefix="$"
                  />
                </div>
              </div>

              <div className="border-t border-border/60 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="text-base">{streamConfig.digital.emoji}</span>
                  {streamConfig.digital.label}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SliderInput
                    label="Conversion rate"
                    icon={<Percent className="h-4 w-4" />}
                    value={digitalCR}
                    min={streamConfig.digital.cr[0]}
                    max={streamConfig.digital.cr[1]}
                    step={0.1}
                    onChange={setDigitalCR}
                    format={(v) => v.toFixed(1)}
                    suffix="%"
                  />
                  <SliderInput
                    label="Product price"
                    icon={<DollarSign className="h-4 w-4" />}
                    value={digitalAOV}
                    min={streamConfig.digital.aov[0]}
                    max={streamConfig.digital.aov[1]}
                    step={1}
                    onChange={setDigitalAOV}
                    format={(v) => v.toFixed(0)}
                    prefix="$"
                  />
                </div>
              </div>

              <div className="border-t border-border/60 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="text-base">{streamConfig.ads.emoji}</span>
                  {streamConfig.ads.label}
                </h3>
                <SliderInput
                  label="RPM (revenue per 1,000 pageviews)"
                  icon={<DollarSign className="h-4 w-4" />}
                  value={adRPM}
                  min={streamConfig.ads.aov[0]}
                  max={streamConfig.ads.aov[1]}
                  step={1}
                  onChange={setAdRPM}
                  format={(v) => v.toFixed(0)}
                  prefix="$"
                />
              </div>

              <div className="border-t border-border/60 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="text-base">{streamConfig.subscription.emoji}</span>
                  {streamConfig.subscription.label}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SliderInput
                    label="Conversion rate"
                    icon={<Percent className="h-4 w-4" />}
                    value={subCR}
                    min={streamConfig.subscription.cr[0]}
                    max={streamConfig.subscription.cr[1]}
                    step={0.1}
                    onChange={setSubCR}
                    format={(v) => v.toFixed(1)}
                    suffix="%"
                  />
                  <SliderInput
                    label="Monthly subscription"
                    icon={<DollarSign className="h-4 w-4" />}
                    value={subAOV}
                    min={streamConfig.subscription.aov[0]}
                    max={streamConfig.subscription.aov[1]}
                    step={1}
                    onChange={setSubAOV}
                    format={(v) => v.toFixed(0)}
                    prefix="$"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="border-emerald-500/30 bg-emerald-500/[0.04] lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Projected revenue
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-background/60 p-4">
                <div className="text-xs text-muted-foreground">
                  Total monthly
                </div>
                <div className="mt-1 text-3xl font-bold text-emerald-500 tabular-nums">
                  ${total.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Daily</div>
                    <div className="mt-0.5 font-semibold tabular-nums">
                      ${(total / 30).toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Yearly</div>
                    <div className="mt-0.5 font-semibold tabular-nums">
                      ${(total * 12).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">
                      Per visitor
                    </div>
                    <div className="mt-0.5 font-semibold tabular-nums">
                      $
                      {traffic > 0
                        ? (total / traffic).toFixed(3)
                        : "0.000"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {results.map((r) => (
                  <motion.div
                    key={r.key}
                    layout
                    className="rounded-lg border border-border/40 bg-background/40 p-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span>{r.emoji}</span>
                        <span className="font-medium">{r.label}</span>
                      </span>
                      <span className="font-semibold tabular-nums">
                        ${r.monthly.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: r.color }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(r.monthly / maxBar) * 100}%`,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-background/40 p-3 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Projections assume steady traffic. Real results compound over
                  time as content ages and SEO improves.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function SliderInput({
  label,
  icon,
  value,
  min,
  max,
  step,
  onChange,
  format,
  prefix = "",
  suffix = "",
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {icon}
          {label}
        </Label>
        <span className="text-sm font-semibold tabular-nums">
          {prefix}
          {format(value)}
          {suffix && ` ${suffix}`}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
      />
    </div>
  );
}
