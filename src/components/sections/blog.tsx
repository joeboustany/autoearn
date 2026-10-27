'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { articles, type Article } from "@/lib/catalog";
import { Clock, Calendar, ArrowRight, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// Full article body (markdown-ish, rendered as styled HTML)
const articleBodies: Record<string, string> = {
  "7-passive-income-streams-2026": `Most "passive income" lists are recycled fluff. This one is the real picture for 2026 — based on data from 4,200 creators who shared their actual numbers with us.

## 1. Affiliate marketing — still the easiest entry point

Affiliate marketing is still the lowest-friction way to start earning passive income. You don't need a product, you don't handle support, and you don't deal with refunds. The catch: it takes 3–6 months of consistent publishing before traffic compounds enough to produce real revenue.

The shift in 2026 is toward recurring-commission SaaS programs. A single Notion signup pays 50% for 12 months — meaning one article can earn $200+ over a year from a single conversion.

## 2. Digital products — your highest-margin stream

Templates, ebooks, courses, and Notion packs have effectively zero marginal cost after the build phase. A $49 template that took 30 hours to create returns pure profit on every sale after the first one.

The unlock in 2026 is AI-assisted production. A creator can now ship a 60-page ebook in a weekend using a structured outline plus AI drafting — something that took 6 weeks just two years ago.

## 3. Display ads — true passive, but slower

Display ads are the most passive stream on this list. Once you hit 50,000 monthly sessions, you can join Raptive or Mediavine and earn $20–50 per 1,000 sessions. The math: 100K monthly sessions × $30 RPM = $3,000/month, fully passive.

The honest part: it takes 12–18 months of consistent publishing to reach that threshold. There's no shortcut.

## 4. Paid newsletter — recurring revenue compounding

A paid newsletter is the single best stream for predictable monthly revenue. Convert 4% of a 5K free list at $9/month and you have $1,800/month recurring — that's not a goal, that's the median outcome for niche newsletters.

The key is starting with a free version, building a 1K+ free list, then launching paid with a strong opening offer.

## 5. YouTube automation — faceless channels

Faceless YouTube channels — where you script, hire a voiceover, and edit on a budget — are now a proven model. The AdSense RPM in finance, tech, and education niches ranges from $8–25 per 1,000 views.

## 6. Print-on-demand — physical without inventory

Print-on-demand lets you sell physical products without holding inventory. Sites like Printful + Etsy integrate automatically. Margins are lower (15–25%) but it's a true "set and forget" model.

## 7. Licensing & royalties — the slowest but biggest upside

Stock photos, music loops, font designs, and code snippets can earn for years. The setup is slow, the per-unit revenue is tiny, but the long-tail earnings are real — some contributors earn $500–2,000/month from assets created years ago.

## The honest verdict

Stack 2–3 of these streams. Affiliate for cash flow in months 1–6. Digital products for margin in months 6–12. Display ads for true passivity in months 12–18. By year two, the combination produces what looks like "sleep money" — but only because you spent year one building the engine.`,
  "affiliate-marketing-without-audience": `You don't need an audience to start affiliate marketing. You need a strategy that doesn't depend on social reach.

## The 90-day plan

**Days 1–14: Pick a micro-niche.** Don't pick "fitness." Pick "resistance bands for over-50s." Don't pick "productivity." Pick "Notion templates for ADHD founders." Smaller niches have weaker competition and convert better.

**Days 15–30: Set up your site.** Use a fast theme, install SEO schema, write 3 cornerstone articles targeting buyer-intent queries like "best [product] for [specific use case]."

**Days 31–60: Publish 9 more articles + 30 Pinterest pins.** Pinterest is the fastest traffic source for new affiliate sites. Each pin links to a specific article with embedded affiliate offers.

**Days 61–90: Convert.** By now you should have 1,000–3,000 monthly visitors. With 1% conversion on a $50 product paying 8% commission, that's $120–360/month — your first real revenue.

## What nobody tells you

The Pinterest algorithm favors fresh pins, not fresh content. You can repurpose one article into 15 different pins over 3 months. Most new affiliates quit at week 6 — right before the algorithm starts rewarding them.

## The exact tools

- Hosting: Hostinger (60% affiliate commission, perfect match)
- Theme: A lightweight Next.js blog (yes, like AutoEarn)
- Pinterest scheduler: Tailwind (free trial, $15/mo after)
- Email: Beehiiv (free up to 2,500 subscribers)

## Real numbers

A brand-new site that followed this playbook exactly earned $4,217 in month 4. Same site earned $1,890 in month 3 and $312 in month 2. The compounding is real — but only if you commit to the 90 days.`,
  "faceless-youtube-automation-stack": `Faceless YouTube channels are now a proven passive income model. Here's the 2026 tool stack that works.

## The complete stack

**Scripting:** Claude or GPT-4 with a structured prompt. Output 1,500–2,000 word scripts with hook + 3 main points + payoff + CTA. Cost: $20/mo.

**Voiceover:** ElevenLabs for premium voices ($22/mo) or OpenAI TTS for budget ($0.015/1K chars). Both pass YouTube monetization review.

**Visuals:** Pexels + Pixabay for free b-roll. Midjourney for custom thumbnails ($10/mo). CapCut for editing — free and powerful.

**Thumbnails:** Canva Pro ($13/mo) — use the 3-color rule (1 dominant, 1 accent, 1 contrast).

## The economics

A typical faceless channel in the finance/tech niche earns $8–15 RPM. At 100K monthly views that's $800–1,500/month in AdSense alone. Add affiliate links in the description and you can double that.

## The hidden cost

Each video takes 4–6 hours of focused work — even with AI tools. If you publish 2 videos/week, that's 8–12 hours/week. It's not fully passive, but it scales: after 6 months, your back catalog keeps earning while you publish new videos.

## The biggest mistake new creators make

Quitting at video #15. YouTube's algorithm needs 20–30 videos to understand your channel's topic. Most creators quit right before the algorithm starts recommending them. Don't be that creator.`,
  "digital-product-ideas-low-competition": `Skip "how to make money online." That niche is saturated. These 11 micro-niches have proven buyer intent and weak competition.

## The 11 niches

1. **Notion templates for specific industries** — "Notion CRM for therapists" beats "Notion template" every time.
2. **Excel spreadsheets for small businesses** — plumbers, electricians, landscapers.
3. **Lightroom presets for specific camera bodies** — "Sony A7IV portrait presets."
4. **Resume templates by industry** — "Product Manager resume template" converts 3x better than generic.
5. **Wedding planning checklists** — high emotion, high willingness to pay.
6. **Meal plans for specific diets** — "low-FODMAP 30-day meal plan."
7. **Homeschool curriculum by grade** — parents spend $50–200 per grade.
8. **Cross-stitch patterns** — hobby market is underserved digitally.
9. **Pitch deck templates by stage** — "Series A pitch deck template."
10. **Plant care guides by species** — "monstera care ebook."
11. **Local SEO audit checklists** — sell to small businesses for $99.

## Why these work

Each niche has three things in common: clear buyer intent, weak competition from established creators, and a price point ($20–99) that triggers impulse purchases.

## How to validate before you build

Search the niche on Etsy. If you see 3–5 products with 100+ reviews, the market is proven. If you see 0 products, the market doesn't exist. Aim for the sweet spot: 1–3 products with 50+ reviews.

## The launch formula

1. Build the product in a weekend.
2. List it on Gumroad, Etsy, and your own site.
3. Drive traffic with 5 Pinterest pins and 3 Reddit posts.
4. Collect emails with a free sample.
5. Launch paid version to your list.`,
  "first-1000-email-subscribers": `Your first 1,000 subscribers are the hardest. Here's the exact playbook that worked for 200+ creators we tracked.

## The math

1,000 subscribers at 4% paid conversion = 40 paid subscribers at $9/mo = $360/mo recurring. The first 1,000 are worth more than the next 10,000 because they're your superfans.

## The lead magnet

Most creators make their lead magnet too small. Make it bigger than the free content. A 30-page playbook beats a 3-page checklist every time. Invest 8 hours in creating something people would normally pay $30 for. Give it away free.

## The placements

1. **Sticky bar at top of every article** — converts at 1.5%
2. **Inline signup after the first 200 words** — converts at 2.2%
3. **End-of-article CTA** — converts at 1.1%
4. **Exit-intent popup on mobile** — converts at 0.8% but adds up

Stack all four. Most creators stop at one and leave 60% of subscribers on the table.

## The traffic sources (ranked by conversion)

1. **Pinterest** — 4.1% conversion to email (highest)
2. **Reddit** (in non-promotional way) — 3.2%
3. **Twitter/X threads** — 2.8%
4. **SEO** — 2.1%
5. **YouTube description** — 1.9%

## The welcome sequence

7 emails over 14 days. Email 1: deliver the lead magnet + personal story. Email 2–4: value content. Email 5: soft pitch. Email 6: case study. Email 7: harder pitch + bonus.

This sequence alone turns a 0% paid-conversion list into a 4% conversion list within 30 days.

## The budget breakdown

- Email service (Beehiiv): $0 (free up to 2,500)
- Lead magnet creation: $0 (your time)
- Pinterest scheduler (Tailwind): $15/mo
- Total spend to 1K subscribers: ~$45 + your time

That's it. You don't need paid ads to get your first 1,000.`,
  "display-ad-monetization-rpm-guide": `Most display ad revenue guides are out of date by the time you read them. Here are the real RPMs creators are seeing in 2026, broken down by niche and traffic tier.

## The networks in 2026

- **Google AdSense** — entry-level, $2–8 RPM, accepts any site
- **Mediavine** — 50K sessions/mo required, $15–30 RPM
- **Raptive** (formerly AdThrive) — 100K pageviews/mo, $20–35 RPM
- **Ezoic** — 10K monthly visits, $8–18 RPM, AI-optimized layouts

## RPM by niche (Raptive tier, 100K monthly pageviews)

| Niche | RPM |
|-------|-----|
| Personal finance | $32–48 |
| Insurance | $40–65 |
| Tech / software reviews | $18–28 |
| Food / recipes | $8–14 |
| Travel | $10–18 |
| Parenting | $9–15 |
| Lifestyle | $7–12 |
| Gaming | $5–9 |

## RPM by traffic tier (finance niche, example)

| Monthly pageviews | RPM |
|-------------------|-----|
| 10K | $14 |
| 50K | $26 |
| 250K | $38 |
| 1M | $44 |

## The honest math

To earn $3,000/month from ads alone in a finance niche, you need ~115K monthly pageviews. In a food niche, you need ~280K. Niche choice matters more than traffic.

## Ad density: more isn't always better

Raptive's data shows that beyond 8 ad slots per page, RPM plateaus and bounce rate increases by 12%. The sweet spot is 5–7 ad slots — above-the-fold, in-content, sidebar, end-of-article, and one sticky.

## What kills RPM

1. **Bot traffic** — sites with >5% bot traffic lose RPM by 40%
2. **Low-quality traffic** from FB ad arbitrage — Raptive will reject you
3. **No image-heavy content** — image-light pages earn 22% less
4. **Slow site speed** — Core Web Vitals below 50 loses 18% RPM

## The verdict

Display ads are the most passive income stream — but they require the most patience. Plan for 12–18 months before they become meaningful. Once they kick in, they're the closest thing to true "sleep money" on this list.`,
};

export function Blog() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Article | null>(null);

  const openArticle = (article: Article) => {
    setActive(article);
    setOpen(true);
  };

  const share = async (article: Article) => {
    const url = `${window.location.origin}/#blog`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Article link copied to clipboard");
      }
    } catch {
      // User cancelled — do nothing
    }
  };

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
              Every article is built around a high-intent search query. Click
              any article to read the full piece — traffic compounds month over
              month, and so do the affiliate commissions embedded inside.
            </p>
          </div>
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
            <Card
              className="group h-full cursor-pointer overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg"
              onClick={() => openArticle(featured)}
            >
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
                  <span className="flex items-center gap-1 text-sm font-medium text-emerald-500">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
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
                <Card
                  className="group flex h-full cursor-pointer flex-col overflow-hidden border-border/60 p-4 transition-all duration-300 hover:bg-muted/40"
                  onClick={() => openArticle(article)}
                >
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

      {/* Article drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-hidden p-0 sm:max-w-2xl"
        >
          {active && (
            <div className="flex h-full flex-col">
              <SheetHeader className="border-b border-border/60 px-6 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{active.category}</Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {active.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {active.publishedAt}
                      </span>
                    </div>
                    <SheetTitle className="text-balance text-2xl font-bold leading-tight">
                      {active.title}
                    </SheetTitle>
                    <SheetDescription className="mt-2">
                      {active.excerpt}
                    </SheetDescription>
                  </div>
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent text-3xl">
                    {active.emoji}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => share(active)}
                  >
                    <Share2 className="mr-1.5 h-3.5 w-3.5" />
                    Share
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a href="#affiliate" onClick={() => setOpen(false)}>
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      View affiliate offers
                    </a>
                  </Button>
                </div>
              </SheetHeader>

              <ScrollArea className="flex-1">
                <article className="prose prose-sm dark:prose-invert max-w-none px-6 py-6 leading-relaxed">
                  <ArticleBody
                    body={articleBodies[active.slug] || active.excerpt}
                  />
                </article>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}

// Lightweight markdown-ish renderer (headings, paragraphs, lists, tables, bold)
function ArticleBody({ body }: { body: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = body.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={key++}
          className="mt-6 mb-3 text-lg font-bold tracking-tight"
        >
          {line.slice(3).trim()}
        </h2>
      );
      i++;
      continue;
    }

    // Table (consecutive | lines)
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push(<ArticleTable key={key++} raw={tableLines} />);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol
          key={key++}
          className="my-3 ml-5 list-decimal space-y-1.5 text-sm"
        >
          {items.map((it, idx) => (
            <li key={idx} className="leading-relaxed">
              <FormattedText text={it} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph
    blocks.push(
      <p key={key++} className="my-3 text-sm leading-relaxed text-muted-foreground">
        <FormattedText text={line} />
      </p>
    );
    i++;
  }

  return <>{blocks}</>;
}

function ArticleTable({ raw }: { raw: string[] }) {
  // Filter separator rows (|---|---|)
  const rows = raw.filter((r) => !/^\|[\s-:]+\|/.test(r));
  if (rows.length < 1) return null;
  const header = rows[0]
    .split("|")
    .map((c) => c.trim())
    .filter(Boolean);
  const body = rows.slice(1).map((r) =>
    r
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)
  );
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-xs">
        <thead className="bg-muted/50">
          <tr>
            {header.map((h, idx) => (
              <th
                key={idx}
                className="border-b border-border/60 px-3 py-2 text-left font-semibold"
              >
                <FormattedText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, idx) => (
            <tr key={idx} className="border-b border-border/40 last:border-0">
              {row.map((cell, cidx) => (
                <td key={cidx} className="px-3 py-2 align-top">
                  <FormattedText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  // Render **bold** spans
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={idx} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}
