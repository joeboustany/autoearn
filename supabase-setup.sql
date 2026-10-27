-- ============================================================
-- AutoEarn — Supabase Schema Setup
-- Run this in Supabase SQL Editor to create all 6 tables
-- ============================================================

-- Create schema (idempotent)
CREATE SCHEMA IF NOT EXISTS "public";

-- Drop existing tables if you want a fresh start (uncomment if needed)
-- DROP TABLE IF EXISTS "Payout" CASCADE;
-- DROP TABLE IF EXISTS "AffiliateClick" CASCADE;
-- DROP TABLE IF EXISTS "Goal" CASCADE;
-- DROP TABLE IF EXISTS "RevenueEvent" CASCADE;
-- DROP TABLE IF EXISTS "PageView" CASCADE;
-- DROP TABLE IF EXISTS "Subscriber" CASCADE;

-- ============================================
-- Tables
-- ============================================

-- 1. Newsletter subscribers
CREATE TABLE IF NOT EXISTS "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "source" TEXT NOT NULL DEFAULT 'organic',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- 2. Page view analytics
CREATE TABLE IF NOT EXISTS "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "source" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- 3. Revenue events (purchases, ad revenue, subscriptions)
CREATE TABLE IF NOT EXISTS "RevenueEvent" (
    "id" TEXT NOT NULL,
    "stream" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RevenueEvent_pkey" PRIMARY KEY ("id")
);

-- 4. Monthly revenue goals
CREATE TABLE IF NOT EXISTS "Goal" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- 5. Affiliate link click tracking
CREATE TABLE IF NOT EXISTS "AffiliateClick" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'organic',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

-- 6. Auto-payout history (Friday deposits)
CREATE TABLE IF NOT EXISTS "Payout" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'completed',
    "method" TEXT NOT NULL DEFAULT 'bank_transfer',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- Indexes (for fast lookups)
-- ============================================

-- Subscriber: unique email + sorted-by-createdAt
CREATE UNIQUE INDEX IF NOT EXISTS "Subscriber_email_key" ON "Subscriber"("email");
CREATE INDEX IF NOT EXISTS "Subscriber_createdAt_idx" ON "Subscriber"("createdAt");

-- PageView: indexed by createdAt for "recent views" queries
CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt");

-- RevenueEvent: indexed by createdAt + stream for dashboard queries
CREATE INDEX IF NOT EXISTS "RevenueEvent_createdAt_idx" ON "RevenueEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "RevenueEvent_stream_idx" ON "RevenueEvent"("stream");

-- Goal: unique month
CREATE UNIQUE INDEX IF NOT EXISTS "Goal_month_key" ON "Goal"("month");

-- AffiliateClick: indexed by createdAt + productName for click analytics
CREATE INDEX IF NOT EXISTS "AffiliateClick_createdAt_idx" ON "AffiliateClick"("createdAt");
CREATE INDEX IF NOT EXISTS "AffiliateClick_productName_idx" ON "AffiliateClick"("productName");

-- Payout: indexed by scheduledAt for "next payout" queries
CREATE INDEX IF NOT EXISTS "Payout_scheduledAt_idx" ON "Payout"("scheduledAt");

-- ============================================
-- Enable Row Level Security (RLS) — REQUIRED for production
-- ============================================
-- AutoEarn uses the service role key (server-side only), so RLS
-- policies can be permissive. Vercel serverless functions connect
-- with full access. No client-side direct DB access.

ALTER TABLE "Subscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PageView" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RevenueEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Goal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AffiliateClick" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payout" ENABLE ROW LEVEL SECURITY;

-- Permissive policies (service role bypasses RLS anyway, but these
-- make the tables usable if you ever query from the Supabase client)
CREATE POLICY "Enable all for authenticated" ON "Subscriber" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON "PageView" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON "RevenueEvent" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON "Goal" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON "AffiliateClick" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON "Payout" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- Done! 
-- Verify by running: SELECT table_name FROM information_schema.tables WHERE table_schema='public';
-- ============================================
