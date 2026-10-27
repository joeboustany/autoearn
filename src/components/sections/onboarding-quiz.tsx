'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

type Answers = {
  time?: "1-2h" | "5-10h" | "20+h";
  budget?: "0-50" | "50-200" | "200+";
  audience?: "no" | "small" | "medium";
};

const questions = [
  {
    id: "time" as const,
    q: "How many hours per week can you commit during setup?",
    sub: "Be honest — this determines which streams are realistic for you.",
    options: [
      {
        value: "1-2h" as const,
        label: "1–2 hours",
        desc: "Weekend casual — I have a full-time job + family",
      },
      {
        value: "5-10h" as const,
        label: "5–10 hours",
        desc: "Some focused evenings + one weekend day",
      },
      {
        value: "20+h" as const,
        label: "20+ hours",
        desc: "I'm all-in — this is my main focus",
      },
    ],
  },
  {
    id: "budget" as const,
    q: "What's your starting budget?",
    sub: "Total you can spend in the first 90 days. Excludes living expenses.",
    options: [
      {
        value: "0-50" as const,
        label: "Under $50",
        desc: "Domain + hosting only. Bootstrap mode.",
      },
      {
        value: "50-200" as const,
        label: "$50–$200",
        desc: "Tools + paid traffic experiments possible",
      },
      {
        value: "200+" as const,
        label: "$200+",
        desc: "Premium tools, paid ads, outsourcing budget",
      },
    ],
  },
  {
    id: "audience" as const,
    q: "Do you already have an audience?",
    sub: "Followers, email list, or any existing reach.",
    options: [
      {
        value: "no" as const,
        label: "No audience",
        desc: "Starting from zero — need to build reach",
      },
      {
        value: "small" as const,
        label: "Small (under 1K)",
        desc: "Some followers on 1–2 platforms",
      },
      {
        value: "medium" as const,
        label: "Medium (1K+)",
        desc: "Real audience I can leverage immediately",
      },
    ],
  },
];

type Recommendation = {
  stream: string;
  emoji: string;
  color: string;
  title: string;
  why: string;
  firstStep: string;
  href: string;
  ctaLabel: string;
};

function recommend(answers: Answers): Recommendation {
  const { time, budget, audience } = answers;

  // Beginner / no audience / no budget → affiliate marketing
  if (audience === "no" && budget === "0-50" && (time === "1-2h" || time === "5-10h")) {
    return {
      stream: "Affiliate marketing",
      emoji: "🤝",
      color: "#10b981",
      title: "Affiliate marketing is your fastest path",
      why: "With limited time and budget, affiliate marketing has the lowest entry barrier. You can start with just a domain + hosting and write review articles targeting buyer-intent search queries. No audience needed — SEO drives the traffic.",
      firstStep: "Pick a micro-niche (like 'Notion templates for therapists'), buy a domain + Hostinger hosting, and write your first cornerstone article this weekend.",
      href: "#ai-tools",
      ctaLabel: "Generate your first article",
    };
  }

  // Some time + small budget + small audience → digital products
  if ((time === "5-10h" || time === "20+h") && budget === "50-200") {
    return {
      stream: "Digital products",
      emoji: "📦",
      color: "#f59e0b",
      title: "Digital products will compound fastest for you",
      why: "With some focused time and a real budget, you can build a $39–$99 product in 3–8 weeks. Each sale is pure profit after the build. Your existing audience gives you a built-in launch list.",
      firstStep: "Pick a product type (Notion template, ebook, or course outline) and start with a 14-day MVP. Launch to your existing audience first.",
      href: "#products",
      ctaLabel: "See digital product examples",
    };
  }

  // All-in + audience → faceless YouTube
  if (time === "20+h" && audience !== "no") {
    return {
      stream: "Faceless YouTube",
      emoji: "🎬",
      color: "#ec4899",
      title: "Faceless YouTube automation is your highest-leverage play",
      why: "With 20+ hours and an audience to seed views, you can ship 2 videos/week and reach monetization threshold within 3–4 months. AdSense + affiliate + sponsorships compound together.",
      firstStep: "Pick a niche, script your first 3 videos this week, use AI voiceover (ElevenLabs), and edit with CapCut. Publish your first video in 7 days.",
      href: "#blog",
      ctaLabel: "Read the YouTube stack guide",
    };
  }

  // Default → paid newsletter
  return {
    stream: "Paid newsletter",
    emoji: "✉️",
    color: "#8b5cf6",
    title: "A paid newsletter is your recurring-revenue machine",
    why: "Even with limited time, you can publish one issue per week. Subscribers compound monthly — meaning each new signup adds to your recurring revenue forever.",
    firstStep: "Pick a niche you can write 50 issues about, set up a free Beehiiv account, write your first 3 issues, and announce a launch date to your network.",
    href: "#subscribe",
    ctaLabel: "Get the weekly blueprint",
  };
}

export function OnboardingQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Recommendation | null>(null);

  const handleAnswer = (key: keyof Answers, value: any) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        setResult(recommend(next));
      }
    }, 200);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const current = questions[step];
  const progressPct = result ? 100 : (step / questions.length) * 100;

  return (
    <section id="onboarding" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-3">
            30-second onboarding
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Find your perfect income stream
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Answer 3 quick questions. We'll recommend the stream that fits your
            time, budget, and starting point — plus the exact first step to
            take.
          </p>
        </div>

        <Card className="mt-10 border-border/60">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Question {step + 1} of {questions.length}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(progressPct)}% complete
                    </span>
                  </div>
                  <Progress value={progressPct} className="mb-6 h-1.5" />

                  <h3 className="text-balance text-xl font-bold leading-snug">
                    {current.q}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {current.sub}
                  </p>

                  <div className="mt-6 space-y-2.5">
                    {current.options.map((opt) => {
                      const isSelected = answers[current.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswer(current.id, opt.value)}
                          className={`group flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                            isSelected
                              ? "border-emerald-500/60 bg-emerald-500/10 shadow-md"
                              : "border-border/60 bg-background hover:border-emerald-500/30"
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{opt.label}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {opt.desc}
                            </div>
                          </div>
                          <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-border text-transparent group-hover:border-emerald-500/40"
                            }`}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => step > 0 && setStep(step - 1)}
                      disabled={step === 0}
                    >
                      <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                      Back
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      💡 Tip: be honest — overestimating time/budget leads to
                      failed streams
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                    style={{
                      backgroundColor: `${result.color}1a`,
                    }}
                  >
                    {result.emoji}
                  </div>
                  <div className="mt-4">
                    <Badge
                      variant="outline"
                      style={{ color: result.color, borderColor: `${result.color}40` }}
                    >
                      Recommended: {result.stream}
                    </Badge>
                  </div>
                  <h3 className="mx-auto mt-3 max-w-md text-balance text-2xl font-bold">
                    {result.title}
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-pretty text-sm text-muted-foreground">
                    {result.why}
                  </p>

                  <div className="mx-auto mt-6 max-w-md rounded-xl border border-border/60 bg-muted/30 p-4 text-left">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Sparkles
                        className="h-3.5 w-3.5"
                        style={{ color: result.color }}
                      />
                      Your first step
                    </div>
                    <p className="text-sm">{result.firstStep}</p>
                  </div>

                  <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
                    <Button asChild size="lg">
                      <Link href={result.href}>
                        {result.ctaLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" onClick={reset}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake quiz
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
