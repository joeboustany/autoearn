import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * Generate an SEO-optimized affiliate article draft using Z.ai.
 *
 * Input: { topic: string, audience?: string, productNiche?: string }
 * Output: { ok: true, title, content, wordCount, suggestedAffiliateLinks }
 *
 * Falls back to a curated template if the SDK is unavailable.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const topic =
      typeof body.topic === "string" && body.topic.trim().length > 0
        ? body.topic.trim().slice(0, 200)
        : "7 passive income ideas for 2026";
    const audience =
      typeof body.audience === "string" && body.audience.trim().length > 0
        ? body.audience.trim().slice(0, 100)
        : "beginners looking to start a side income";
    const productNiche =
      typeof body.productNiche === "string" && body.productNiche.trim().length > 0
        ? body.productNiche.trim().slice(0, 100)
        : "SaaS and productivity tools";

    const systemPrompt = `You are a senior affiliate content writer who specializes in writing SEO-optimized, conversion-focused blog articles. Your articles rank on Google page 1 and convert readers into buyers. You write in a friendly, authoritative voice and always disclose affiliate relationships honestly.`;

    const userPrompt = `Write a complete, ready-to-publish affiliate blog article with the following parameters:

- Topic: ${topic}
- Target audience: ${audience}
- Affiliate niche: ${productNiche}

Requirements:
1. Output ONLY valid Markdown.
2. Start with an H1 title (using # ).
3. Write a compelling meta-description-style intro paragraph (2-3 sentences).
4. Include 4-6 H2 sections (## ).
5. Embed at least 3 places where an affiliate link would go, marked as: [AFFILIATE LINK: product name]
6. Add a "Pros and Cons" comparison table in markdown.
7. End with a "Final Verdict" section and an FAQ section with 3 Q&A pairs.
8. Target length: 700-1000 words.
9. No preamble, no commentary, no "Here is your article:" — start directly with the H1.`;

    let articleContent: string;
    try {
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        thinking: { type: "disabled" },
      });
      articleContent =
        completion.choices?.[0]?.message?.content?.trim() ||
        fallbackArticle(topic, audience, productNiche);
    } catch (sdkErr) {
      console.error("[ai/generate-article] SDK error, using fallback", sdkErr);
      articleContent = fallbackArticle(topic, audience, productNiche);
    }

    // Extract title from first H1
    const titleMatch = articleContent.match(/^#\s+(.+)$/m);
    const title = titleMatch
      ? titleMatch[1].trim()
      : topic;

    // Count affiliate link placeholders
    const affiliateLinkCount =
      articleContent.match(/\[AFFILIATE LINK:[^\]]+\]/g)?.length || 0;

    const wordCount = articleContent.split(/\s+/).length;

    return NextResponse.json({
      ok: true,
      title,
      content: articleContent,
      wordCount,
      affiliateLinkCount,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[ai/generate-article] fatal", err);
    return NextResponse.json(
      { ok: false, error: "Failed to generate article" },
      { status: 500 }
    );
  }
}

function fallbackArticle(topic: string, audience: string, niche: string): string {
  return `# ${topic}

If you've been searching for a realistic way to build passive income without quitting your day job, this guide is for ${audience}. We'll walk through the exact playbook — including the tools, the timelines, and the honest numbers — so you can decide whether this is the right stream for you.

## Why ${niche} is one of the best passive income niches right now

The ${niche} niche has exploded in the last 18 months. Three forces are driving it: a massive shift toward remote work, AI tools lowering the barrier to entry, and recurring commission programs that pay you for 12+ months per signup. Together, these forces make it one of the few niches where a brand-new blog can realistically earn $1,000–$5,000/month within 6 months.

[AFFILIATE LINK: ${niche} starter toolkit]

## The 4-step playbook

1. **Pick one micro-niche** — don't try to cover "productivity." Cover "Notion templates for ADHD founders" or "AI tools for freelance designers."
2. **Write 12 cornerstone articles** — each one targets a high-intent search query with clear buyer intent.
3. **Embed 2–3 affiliate links per article** — make them contextual, not promotional.
4. **Drive initial traffic via Pinterest + Reddit** — these channels work for brand-new sites while SEO compounds.

## The realistic revenue timeline

| Month | Traffic /mo | Revenue /mo | Notes |
|-------|-------------|-------------|-------|
| 1     | 200         | $0          | Building content |
| 3     | 1,800       | $80         | First affiliate clicks |
| 6     | 8,000       | $850        | SEO compounding |
| 9     | 18,000      | $2,400      | Display ads kick in |
| 12    | 35,000      | $4,800      | Multiple streams active |

[AFFILIATE LINK: ${niche} hosting plan]

## Pros and cons

| Pros | Cons |
|------|------|
| Low startup cost (~$50) | 3–6 months to first dollar |
| Scales without inventory | SEO traffic takes time |
| Recurring commissions | Need to write consistently |
| Works alongside full-time job | Income fluctuates month-to-month |

## Final Verdict

${topic} is one of the most realistic passive income streams available in 2026. The setup cost is low, the playbook is proven, and the ceiling is high — but only if you commit to writing 12 cornerstone articles before you expect revenue.

[AFFILIATE LINK: complete ${niche} starter kit]

## FAQ

**How long until I see my first dollar?**
Most creators see their first affiliate commission within 30–60 days of consistent publishing.

**Do I need a big audience?**
No. SEO-driven traffic converts better than social traffic because the intent is already there.

**Can I outsource the writing?**
Yes — but review every article personally for the first 6 months so you understand what converts.
`;
}
