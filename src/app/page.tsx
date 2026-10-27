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
import { AiContentGenerator } from "@/components/sections/ai-content-generator";
import { EarningsCalculator } from "@/components/sections/earnings-calculator";
import { UtmBuilder } from "@/components/sections/utm-builder";
import { PageViewTracker } from "@/components/page-view-tracker";
import { CheckoutNotifier } from "@/components/checkout-notifier";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageViewTracker />
      <CheckoutNotifier />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <IncomeStreams />
        <RevenueDashboard />
        <AdZone />
        <AffiliateStore />
        <DigitalProducts />
        <Blog />
        <AiContentGenerator />
        <EarningsCalculator />
        <UtmBuilder />
        <Newsletter />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
