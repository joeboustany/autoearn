/**
 * Analytics adapter — wraps Google Analytics 4 (gtag) with graceful fallbacks.
 *
 * HOW TO ENABLE REAL GA4:
 * 1. Create a GA4 property at https://analytics.google.com
 * 2. Copy your Measurement ID (starts with "G-")
 * 3. Add to .env: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 4. The Layout will automatically load gtag.js when the env var is set.
 *
 * Until then, events are logged to console + recorded in /api/track.
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export function isAnalyticsEnabled() {
  return (
    typeof window !== "undefined" &&
    !!GA_MEASUREMENT_ID &&
    GA_MEASUREMENT_ID.startsWith("G-")
  );
}

/**
 * Track a custom event. Works with GA4 when enabled; otherwise logs to console.
 */
export function trackEvent(
  name: string,
  params?: Record<string, any>
): void {
  if (typeof window === "undefined") return;

  if (isAnalyticsEnabled() && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", name, params);
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(`[analytics] event: ${name}`, params);
    }
  }
}

/**
 * Track an outbound affiliate link click.
 */
export function trackAffiliateClick(
  productName: string,
  vendor: string,
  source: string = "unknown"
): void {
  trackEvent("affiliate_click", {
    product_name: productName,
    vendor,
    source,
  });
}

/**
 * Track a purchase event.
 */
export function trackPurchase(
  productId: string,
  productName: string,
  amount: number,
  currency: string = "USD"
): void {
  trackEvent("purchase", {
    transaction_id: `${productId}_${Date.now()}`,
    value: amount,
    currency,
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: amount,
        quantity: 1,
      },
    ],
  });
}

/**
 * Returns the GA4 measurement ID if configured, otherwise null.
 * The Layout component uses this to conditionally render <script> tags.
 */
export function getGaMeasurementId(): string | null {
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith("G-")) {
    return GA_MEASUREMENT_ID;
  }
  return null;
}
