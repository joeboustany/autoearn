'use client'

import { useEffect, useRef } from "react";

/**
 * Fires a single page view track event to /api/track on mount.
 * Respects the rule that every page view should be counted once.
 */
export function PageViewTracker() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const source =
      typeof document !== "undefined"
        ? new URLSearchParams(window.location.search).get("ref") ||
          document.referrer ||
          "direct"
        : "direct";

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname + window.location.hash,
        source,
      }),
    }).catch(() => {
      // silent fail — tracking should never break the page
    });
  }, []);

  return null;
}
