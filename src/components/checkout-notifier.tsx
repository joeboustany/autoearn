'use client'

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

/**
 * Listens for Stripe checkout redirect params (?checkout=success|cancelled)
 * and shows a toast notification + banner if a purchase just completed.
 *
 * To avoid the setState-in-effect lint rule, we read the URL param at
 * mount (during initial useState), then perform the URL cleanup in a
 * separate effect.
 */
function readInitialStatus(): "success" | "cancelled" | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const status = params.get("checkout");
  if (status === "success" || status === "cancelled") return status;
  return null;
}

export function CheckoutNotifier() {
  const [banner, setBanner] = useState<"success" | "cancelled" | null>(() =>
    readInitialStatus()
  );

  // Fire toast + clean URL on mount if a status was set
  useEffect(() => {
    if (!banner) return;

    if (banner === "success") {
      toast.success("Payment successful! Your product is on its way.");
    } else if (banner === "cancelled") {
      toast.info("Checkout cancelled — your cart is still saved.");
    }

    // Clean the URL (remove ?checkout=success/product=)
    const params = new URLSearchParams(window.location.search);
    params.delete("checkout");
    params.delete("product");
    const qs = params.toString();
    const newUrl =
      window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
    window.history.replaceState({}, document.title, newUrl);

    const id = setTimeout(() => setBanner(null), 6000);
    return () => clearTimeout(id);
  }, [banner]);

  if (!banner) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 mx-auto flex justify-center px-4">
      <div
        className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
          banner === "success"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        }`}
      >
        {banner === "success" ? (
          <>
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">Payment successful!</div>
              <div className="text-xs opacity-90">
                Revenue recorded · dashboard updated
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm">Checkout cancelled</div>
        )}
      </div>
    </div>
  );
}
