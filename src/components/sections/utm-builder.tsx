'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const utmPresets = [
  {
    source: "newsletter",
    medium: "email",
    campaign: "weekly_blueprint",
    label: "Newsletter",
  },
  {
    source: "pinterest",
    medium: "social",
    campaign: "blog_promotion",
    label: "Pinterest pin",
  },
  {
    source: "youtube",
    medium: "video",
    campaign: "description_link",
    label: "YouTube description",
  },
  {
    source: "google",
    medium: "organic",
    campaign: "seo_traffic",
    label: "Organic search",
  },
];

export function UtmBuilder() {
  const [baseUrl, setBaseUrl] = useState(
    "https://yourstore.com/best-notion-templates"
  );
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("weekly_blueprint");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const buildUrl = () => {
    try {
      const url = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`);
      if (source) url.searchParams.set("utm_source", source);
      if (medium) url.searchParams.set("utm_medium", medium);
      if (campaign) url.searchParams.set("utm_campaign", campaign);
      if (term) url.searchParams.set("utm_term", term);
      if (content) url.searchParams.set("utm_content", content);
      return url.toString();
    } catch {
      return baseUrl + `?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
    }
  };

  const finalUrl = buildUrl();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      toast.success("Tracked link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const applyPreset = (preset: (typeof utmPresets)[number]) => {
    setSource(preset.source);
    setMedium(preset.medium);
    setCampaign(preset.campaign);
  };

  const clearAll = () => {
    setSource("");
    setMedium("");
    setCampaign("");
    setTerm("");
    setContent("");
  };

  return (
    <section id="utm-builder" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Tracked link builder
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Generate trackable affiliate links
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Add UTM parameters to any affiliate link so you can see exactly
            which blog post, Pinterest pin, or YouTube video drove each sale.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="h-4 w-4 text-emerald-500" />
                UTM link builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Presets */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Quick presets
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {utmPresets.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p)}
                      className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      <Plus className="mr-1 inline h-2.5 w-2.5" />
                      {p.label}
                    </button>
                  ))}
                  <button
                    onClick={clearAll}
                    className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="mr-1 inline h-2.5 w-2.5" />
                    Clear
                  </button>
                </div>
              </div>

              {/* Base URL */}
              <div className="space-y-1.5">
                <Label htmlFor="base-url" className="text-xs">
                  Destination URL
                </Label>
                <Input
                  id="base-url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://yourstore.com/affiliate-offer"
                />
              </div>

              {/* UTM fields */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="utm-source" className="text-xs">
                    utm_source <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="utm-source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="newsletter"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="utm-medium" className="text-xs">
                    utm_medium <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="utm-medium"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    placeholder="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="utm-campaign" className="text-xs">
                    utm_campaign <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="utm-campaign"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    placeholder="weekly_blueprint"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="utm-term" className="text-xs">
                    utm_term <span className="text-muted-foreground/60">(optional)</span>
                  </Label>
                  <Input
                    id="utm-term"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="notion+templates"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="utm-content" className="text-xs">
                  utm_content <span className="text-muted-foreground/60">(optional, A/B test)</span>
                </Label>
                <Input
                  id="utm-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="header_cta"
                />
              </div>

              {/* Result */}
              <div className="space-y-2">
                <Label className="text-xs text-emerald-600 dark:text-emerald-400">
                  Your tracked link
                </Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex-1 overflow-x-auto rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-3 font-mono text-xs text-foreground">
                    {finalUrl.length > 100
                      ? `${finalUrl.slice(0, 100)}…`
                      : finalUrl}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copy} variant="default">
                      {copied ? (
                        <>
                          <Check className="mr-1.5 h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button asChild variant="outline">
                      <a
                        href={finalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <strong className="text-foreground">How it works:</strong>{" "}
                UTM parameters are appended to your URL so analytics platforms
                (Google Analytics, Plausible, Fathom) can attribute every sale
                to the exact source. Always use lowercase, no spaces, hyphens
                instead of underscores.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
