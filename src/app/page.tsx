'use client'

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { IncomeStreams } from "@/components/sections/income-streams";
import { RevenueDashboard } from "@/components/sections/revenue-dashboard";
import { AffiliateStore } from "@/components/sections/affiliate-store";
import { DigitalProducts } from "@/components/sections/digital-products";
import { Blog } from "@/components/sections/blog";
import { Newsletter } from "@/components/sections/newsletter";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { AdZone } from "@/components/sections/ad-zone";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <IncomeStreams />
        <RevenueDashboard />
        <AdZone />
        <AffiliateStore />
        <DigitalProducts />
        <Blog />
        <Newsletter />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
