'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  FileText,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

const sampleTopics = [
  "Best AI writing tools for solopreneurs 2026",
  "How to start a faceless YouTube channel",
  "Notion templates for ADHD founders",
  "Print-on-demand niches with low competition",
];

export function AiContentGenerator() {
  const [topic, setTopic] = useState(sampleTopics[0]);
  const [audience, setAudience] = useState("beginners starting a side income");
  const [niche, setNiche] = useState("SaaS and productivity tools");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    content: string;
    wordCount: number;
    affiliateLinkCount: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, productNiche: niche }),
      });
      const json = await res.json();
      if (json.ok) {
        setResult({
          title: json.title,
          content: json.content,
          wordCount: json.wordCount,
          affiliateLinkCount: json.affiliateLinkCount,
        });
        toast.success(
          `Generated ${json.wordCount}-word article in seconds`
        );
      } else {
        toast.error(json.error || "Generation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      toast.success("Article copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <section id="ai-tools" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            AI tools
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Generate your first affiliate article in seconds
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Powered by Z.ai. Enter a topic, audience, and niche — get a
            complete, ready-to-publish article with embedded affiliate link
            placeholders. Free while in beta.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Input panel */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Wand2 className="h-4 w-4 text-emerald-500" />
                Article brief
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="topic" className="text-xs">
                  Article topic
                </Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Best AI writing tools for solopreneurs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Try a sample topic</Label>
                <div className="flex flex-wrap gap-1.5">
                  {sampleTopics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                        topic === t
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                          : "border-border/60 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {t.length > 32 ? t.slice(0, 30) + "…" : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="audience" className="text-xs">
                    Target audience
                  </Label>
                  <Input
                    id="audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="beginners"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="niche" className="text-xs">
                    Affiliate niche
                  </Label>
                  <Input
                    id="niche"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="SaaS tools"
                  />
                </div>
              </div>

              <Button
                onClick={generate}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating article…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate article
                  </>
                )}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                Generated by Z.ai · ~700–1,000 words · 3 affiliate link
                placeholders
              </p>
            </CardContent>
          </Card>

          {/* Output panel */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-emerald-500" />
                Generated article
              </CardTitle>
              {result && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copy}
                  disabled={loading}
                >
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-[420px] flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                  <p className="text-sm text-muted-foreground">
                    Writing your article…
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Drafting 4–6 H2 sections, embedding affiliate links,
                    formatting tables…
                  </p>
                </div>
              ) : !result ? (
                <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">
                    Your generated article will appear here
                  </p>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    Fill in the brief on the left and click "Generate
                    article" to get a complete, ready-to-publish draft.
                  </p>
                </div>
              ) : (
                <div className="flex h-[420px] flex-col">
                  <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
                    <Badge variant="outline">{result.wordCount} words</Badge>
                    <Badge variant="outline">
                      {result.affiliateLinkCount} affiliate links
                    </Badge>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <ScrollArea className="flex-1">
                    <ArticlePreview content={result.content} />
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ArticlePreview({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2 pr-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-lg font-bold tracking-tight">
              {line.slice(2).trim()}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="mt-3 text-base font-semibold text-foreground"
            >
              {line.slice(3).trim()}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="mt-2 text-sm font-semibold text-foreground"
            >
              {line.slice(4).trim()}
            </h3>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div
              key={idx}
              className="ml-4 flex gap-2 text-muted-foreground"
            >
              <span className="text-emerald-500">•</span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          );
        }
        if (line.startsWith("|")) {
          return (
            <div key={idx} className="my-1 overflow-x-auto text-xs">
              <span className="font-mono text-muted-foreground">{line}</span>
            </div>
          );
        }
        if (line.trim() === "") {
          return <div key={idx} className="h-2" />;
        }
        return (
          <p key={idx} className="text-muted-foreground">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Highlight [AFFILIATE LINK: ...] placeholders
  const parts = text.split(/(\[AFFILIATE LINK:[^\]]+\])/g);
  return parts.map((part, idx) => {
    if (part.startsWith("[AFFILIATE LINK:")) {
      const name = part.replace("[AFFILIATE LINK:", "").replace("]", "").trim();
      return (
        <span
          key={idx}
          className="mx-0.5 inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
        >
          🔗 {name}
        </span>
      );
    }
    // Bold
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}
