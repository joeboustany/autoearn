# AutoEarn — Deploy Checklist

Your code is now on GitHub at: https://github.com/joeboustany/autoearn

## ✅ What just happened
- 1,215 files pushed (real project, not just git commands)
- `.env` and `db/custom.db` removed from tracking (your secrets are safe)
- `.env.example` added so Vercel knows what env vars to set
- `.gitignore` properly excludes `node_modules`, `.next`, `.env`, `db/*.db`, screenshots, etc.
- Junk commit `45c0ebf` (the one with git commands pasted as text) was overwritten

## ⚠️ IMPORTANT — Delete your GitHub token now

You shared a GitHub token in chat. Tokens expire but should be revoked manually for safety:

1. Go to: https://github.com/settings/tokens
2. Find the token you generated (named `autoearn-deploy` or similar)
3. Click **Delete** next to it

## 🚀 Next step — Deploy to Vercel (5 minutes)

1. Go to: https://vercel.com → **Sign Up** → **Continue with GitHub**
2. Click **Add New Project** → import `joeboustany/autoearn`
3. Vercel auto-detects Next.js — leave all defaults
4. Expand **Environment Variables** and add these (copy values from your local `.env`):
   ```
   DATABASE_URL          file:/tmp/custom.db
   STRIPE_SECRET_KEY     sk_test_placeholder_replace_me
   STRIPE_WEBHOOK_SECRET whsec_placeholder_replace_me
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY pk_test_placeholder_replace_me
   NEXT_PUBLIC_SITE_URL  https://YOUR_VERCEL_DOMAIN.vercel.app
   ADMIN_PASSWORD        (use a strong password — generate one at https://bitwarden.com/password-generator)
   NEXT_PUBLIC_GA_MEASUREMENT_ID  (leave empty for now)
   ```
5. Click **Deploy** → wait 2 minutes
6. You'll get a URL like `autoearn-abc123.vercel.app` → click it → your site is LIVE

## ⚠️ Note about SQLite on Vercel

The local DB uses SQLite at `db/custom.db`. On Vercel's serverless environment,
the filesystem is read-only (except `/tmp`). Two options:

**Option A (fast, free):** Change `DATABASE_URL` to `file:/tmp/custom.db` on Vercel.
⚠️ Data won't persist across serverless function cold starts (subscribers will reset).

**Option B (recommended for production):** Switch to a real Postgres DB:
1. Get free Postgres at https://neon.tech (5GB free) or https://supabase.com (500MB free)
2. Copy the connection string
3. Replace `DATABASE_URL` on Vercel with the Postgres URL
4. Update `prisma/schema.prisma` line 11: `provider = "sqlite"` → `provider = "postgresql"`
5. Run `bun run db:push` locally to create tables in Postgres
6. Push to GitHub → Vercel auto-redeploys

## 🔴 What to do RIGHT NOW

1. **Delete your GitHub token** (link above)
2. **Open** https://github.com/joeboustany/autoearn — you should see ~50 folders/files
3. **Connect Vercel** — Option A above to get a live URL in 5 minutes
4. Reply here with your Vercel URL → I'll help wire Stripe + affiliate programs

Your code is safe. Now go delete that token. 🔐
