// Static content catalog used across the AutoEarn site.
// All product/article data is illustrative — replace with real inventory
// when wiring up a payment provider or affiliate network.

export type AffiliateProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  commission: number; // percent
  rating: number;
  reviews: number;
  vendor: string;
  emoji: string;
  blurb: string;
  tags: string[];
};

export type DigitalProduct = {
  id: string;
  title: string;
  type: "Ebook" | "Template" | "Course" | "Toolkit" | "Notion Pack";
  price: number;
  rating: number;
  sales: number;
  emoji: string;
  description: string;
  highlights: string[];
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  emoji: string;
};

export type Stream = {
  id: string;
  name: string;
  description: string;
  monthlyEstimate: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  setupTime: string;
  passiveScore: number; // 0-100
  emoji: string;
  color: string;
};

export const affiliateProducts: AffiliateProduct[] = [
  {
    id: "af-1",
    name: "AeroPress Coffee Maker",
    category: "Home & Kitchen",
    price: 39.95,
    commission: 8,
    rating: 4.8,
    reviews: 28412,
    vendor: "Amazon Associates",
    emoji: "☕",
    blurb: "Top-rated manual coffee press with a 7%–10% commission rate. Evergreen demand and high conversion in Q4.",
    tags: ["Evergreen", "High conv.", "Q4 spike"],
  },
  {
    id: "af-2",
    name: "Logitech MX Master 3S",
    category: "Electronics",
    price: 99.99,
    commission: 6,
    rating: 4.9,
    reviews: 18420,
    vendor: "Amazon Associates",
    emoji: "🖱️",
    blurb: "Premium productivity mouse. Strong recurring traffic from remote-work audiences and creators.",
    tags: ["Remote work", "Creators", "High AOV"],
  },
  {
    id: "af-3",
    name: "Notion Plus Plan",
    category: "SaaS",
    price: 96.0,
    commission: 50,
    rating: 4.7,
    reviews: 5230,
    vendor: "Notion Partners",
    emoji: "📓",
    blurb: "Recurring 50% commission for 12 months. One signup = passive income for a full year.",
    tags: ["Recurring", "B2B", "50% comm."],
  },
  {
    id: "af-4",
    name: "Blue Yeti X Microphone",
    category: "Electronics",
    price: 139.99,
    commission: 5,
    rating: 4.6,
    reviews: 9821,
    vendor: "Amazon Associates",
    emoji: "🎙️",
    blurb: "Podcast & streaming staple. Pairs perfectly with productivity and creator-niche content.",
    tags: ["Creators", "Podcasters", "Cross-sell"],
  },
  {
    id: "af-5",
    name: "Kindle Paperwhite",
    category: "Electronics",
    price: 149.99,
    commission: 4,
    rating: 4.8,
    reviews: 41290,
    vendor: "Amazon Associates",
    emoji: "📖",
    blurb: "Evergreen gift item. Reliable conversions all year, with massive spikes during Prime Day and Black Friday.",
    tags: ["Evergreen", "Gift", "Q4"],
  },
  {
    id: "af-6",
    name: "Hostinger Web Hosting",
    category: "SaaS",
    price: 119.88,
    commission: 60,
    rating: 4.5,
    reviews: 7320,
    vendor: "Hostinger Affiliates",
    emoji: "🌐",
    blurb: "Up to 60% commission on hosting plans. Perfect match for anyone reading a 'start a blog' article.",
    tags: ["Recurring", "B2B", "60% comm."],
  },
];

export const digitalProducts: DigitalProduct[] = [
  {
    id: "dp-1",
    title: "Passive Income Blueprint",
    type: "Ebook",
    price: 29,
    rating: 4.9,
    sales: 3120,
    emoji: "📘",
    description:
      "A 142-page playbook that walks you through 12 proven passive income models with launch checklists, templates, and 90-day roadmaps.",
    highlights: ["12 income models", "Launch checklists", "Email templates"],
  },
  {
    id: "dp-2",
    title: "Affiliate Blog Starter Kit",
    type: "Template",
    price: 49,
    rating: 4.8,
    sales: 1870,
    emoji: "🧰",
    description:
      "Plug-and-play Next.js + MDX blog template pre-wired for affiliate links, SEO schema, analytics, and Stripe checkout.",
    highlights: ["Next.js 16", "SEO-ready", "Stripe wired"],
  },
  {
    id: "dp-3",
    title: "Faceless YouTube Automation",
    type: "Course",
    price: 149,
    rating: 4.7,
    sales: 612,
    emoji: "🎬",
    description:
      "8-hour video course on scripting, AI voiceovers, and editing workflows that have generated 6-figure channels.",
    highlights: ["8h video", "AI voiceover", "Editing templates"],
  },
  {
    id: "dp-4",
    title: "Notion Money OS",
    type: "Notion Pack",
    price: 39,
    rating: 4.9,
    sales: 2240,
    emoji: "🧠",
    description:
      "All-in-one Notion dashboard for tracking 7 income streams, expenses, content calendar, and affiliate performance.",
    highlights: ["7 dashboards", "Lifetime updates", "Mobile-ready"],
  },
  {
    id: "dp-5",
    title: "Email List Growth Toolkit",
    type: "Toolkit",
    price: 59,
    rating: 4.8,
    sales: 980,
    emoji: "✉️",
    description:
      "37 lead-magnet templates, 14 welcome-sequence scripts, and a deliverability audit checklist. Build a list that converts.",
    highlights: ["37 templates", "14 sequences", "Audit checklist"],
  },
  {
    id: "dp-6",
    title: "Sleep Money Newsletter",
    type: "Course",
    price: 99,
    rating: 4.9,
    sales: 410,
    emoji: "🌙",
    description:
      "Weekly paid newsletter breaking down new passive income case studies, affiliate offers, and emerging niches.",
    highlights: ["Weekly drops", "Case studies", "Private Discord"],
  },
];

export const articles: Article[] = [
  {
    id: "ar-1",
    slug: "7-passive-income-streams-2026",
    title: "7 Passive Income Streams That Still Work in 2026",
    excerpt:
      "A realistic breakdown of the seven income streams that actually compound — with current commission rates, setup time, and the hidden costs nobody mentions.",
    category: "Strategy",
    readTime: "9 min read",
    publishedAt: "Oct 22, 2026",
    emoji: "💡",
  },
  {
    id: "ar-2",
    slug: "affiliate-marketing-without-audience",
    title: "Affiliate Marketing Without an Audience: A 90-Day Plan",
    excerpt:
      "You don't need a million followers. Here's the exact Pinterest + SEO playbook that turned a brand-new blog into a $4,200/month affiliate engine.",
    category: "Affiliate",
    readTime: "12 min read",
    publishedAt: "Oct 18, 2026",
    emoji: "🎯",
  },
  {
    id: "ar-3",
    slug: "faceless-youtube-automation-stack",
    title: "The 2026 Faceless YouTube Automation Stack",
    excerpt:
      "Tools, prompts, and pricing for a fully automated faceless YouTube channel — from script generation to AI voiceover and final edit.",
    category: "YouTube",
    readTime: "8 min read",
    publishedAt: "Oct 14, 2026",
    emoji: "🎬",
  },
  {
    id: "ar-4",
    slug: "digital-product-ideas-low-competition",
    title: "11 Digital Product Ideas in Low-Competition Niches",
    excerpt:
      "Skip the saturated 'how to make money online' niche. These 11 micro-niches still have weak competition and proven buyer intent.",
    category: "Digital Products",
    readTime: "10 min read",
    publishedAt: "Oct 9, 2026",
    emoji: "📦",
  },
  {
    id: "ar-5",
    slug: "first-1000-email-subscribers",
    title: "How to Get Your First 1,000 Email Subscribers",
    excerpt:
      "The exact lead magnets, placements, and email flows that worked when starting from zero. Includes the budget breakdown.",
    category: "Newsletter",
    readTime: "7 min read",
    publishedAt: "Oct 4, 2026",
    emoji: "✉️",
  },
  {
    id: "ar-6",
    slug: "display-ad-monetization-rpm-guide",
    title: "Display Ads in 2026: A Real RPM Guide by Niche",
    excerpt:
      "What you can actually expect to earn from Mediavine, Raptive, and AdThrive in 2026 — organized by niche, traffic tier, and ad density.",
    category: "Ads",
    readTime: "11 min read",
    publishedAt: "Sep 28, 2026",
    emoji: "📊",
  },
];

export const streams: Stream[] = [
  {
    id: "st-1",
    name: "Affiliate Marketing",
    description:
      "Promote other people's products and earn a commission on every sale. Recurring-commission SaaS programs compound into real passive income.",
    monthlyEstimate: "$2.4K – $14K",
    difficulty: "Beginner",
    setupTime: "2–4 weeks",
    passiveScore: 78,
    emoji: "🤝",
    color: "#10b981",
  },
  {
    id: "st-2",
    name: "Digital Products",
    description:
      "Sell templates, ebooks, courses, or Notion packs. Build once, sell infinitely — perfect for compounding revenue with zero marginal cost.",
    monthlyEstimate: "$1.8K – $22K",
    difficulty: "Intermediate",
    setupTime: "3–8 weeks",
    passiveScore: 86,
    emoji: "📦",
    color: "#f59e0b",
  },
  {
    id: "st-3",
    name: "Display Ads",
    description:
      "Get paid for every pageview. Join Raptive or Mediavine once you hit 50K monthly sessions and watch ad revenue drip in 24/7.",
    monthlyEstimate: "$600 – $8K",
    difficulty: "Beginner",
    setupTime: "1 week",
    passiveScore: 92,
    emoji: "📊",
    color: "#8b5cf6",
  },
  {
    id: "st-4",
    name: "Paid Newsletter",
    description:
      "Recurring monthly revenue from a paid email list. With a 4% conversion rate on 5K subscribers at $9/mo, that's $1,800/mo on autopilot.",
    monthlyEstimate: "$900 – $18K",
    difficulty: "Intermediate",
    setupTime: "6–12 weeks",
    passiveScore: 71,
    emoji: "✉️",
    color: "#ec4899",
  },
];

export const testimonials = [
  {
    name: "Maya R.",
    role: "Affiliate blogger",
    quote:
      "I started with one review article a week. Eight months later, that blog earns $3,800/mo on autopilot while I focus on a second site.",
    avatar: "M",
  },
  {
    name: "Daniel K.",
    role: "Digital product creator",
    quote:
      "Sold 612 copies of a $49 Notion template in the first 60 days. Build once, sell forever — the model just works.",
    avatar: "D",
  },
  {
    name: "Priya S.",
    role: "Faceless YouTube creator",
    quote:
      "My channel crossed $4K/mo in AdSense alone. I write scripts on Sunday, automate the rest, and the views keep coming.",
    avatar: "P",
  },
];

export const faqs = [
  {
    q: "Is this really passive? Do I have to do anything?",
    a: "Honest answer: every income stream has a setup phase. Affiliate sites take 2–4 weeks of focused writing. Digital products take 3–8 weeks to create. After that, revenue compounds while you sleep — but you should still publish fresh content monthly to keep traffic and conversions growing.",
  },
  {
    q: "How much money do I need to start?",
    a: "You can start with under $50: a domain ($12), hosting ($8/mo), and an email service (free up to 1,000 subscribers). Optional tools like Canva Pro, AI writers, and ad-free themes add another $30–80/mo once you have some revenue coming in.",
  },
  {
    q: "How long until I see my first dollar?",
    a: "Most creators see their first affiliate commission within 30–60 days of consistent publishing. Display ads typically kick in once you cross 10K monthly sessions. Paid newsletter revenue starts the day your first subscriber pays.",
  },
  {
    q: "Can I run this alongside a full-time job?",
    a: "Yes — that's exactly the point. Allocate 6–10 hours per week during setup, then 2–4 hours per week for maintenance once systems are in place. The whole model is designed to be built in the margins of a busy life.",
  },
  {
    q: "What if I don't have an audience yet?",
    a: "Most of the streams on this site work starting from zero. SEO traffic compounds over months. Pinterest can drive traffic within weeks. Paid newsletters can launch with a free lead magnet and a waitlist — no existing audience required.",
  },
  {
    q: "How is this different from a get-rich-quick scheme?",
    a: "It isn't quick. Every stream listed here has a real setup phase, real failure modes, and real numbers. The 'passive' part only kicks in after you've built the system. Anyone promising overnight income is selling you something — not a real income stream.",
  },
];
