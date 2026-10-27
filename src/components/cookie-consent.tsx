'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, X, Check } from "lucide-react";

const CONSENT_KEY = "autoearn_cookie_consent";

function readStoredConsent(): "all" | "essential" | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === "all" || stored === "essential") return stored;
  return null;
}

export function CookieConsent() {
  // Initialize from localStorage so we don't call setState-in-effect.
  const [visible, setVisible] = useState<boolean>(() => readStoredConsent() === null);
  const pref = readStoredConsent();

  const accept = (level: "all" | "essential") => {
    localStorage.setItem(CONSENT_KEY, level);
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem(CONSENT_KEY, "essential");
    setVisible(false);
  };

  // If no consent is stored, show after a short delay (one-shot timer).
  useEffect(() => {
    if (!visible) return;
    // small delay so it doesn't appear immediately on first paint
    const id = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(id);
  }, [visible]);

  // The effect above is a no-op if the banner isn't already showing,
  // and setTimeout callbacks don't trigger setState-in-effect warnings
  // because they fire asynchronously.

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 p-4"
        >
          <div className="mx-auto max-w-3xl rounded-xl border border-border/60 bg-background/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">
                  We use cookies to improve your experience
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Essential cookies keep the site working. Analytics cookies
                  help us understand what content earns revenue. You can change
                  this any time in settings.{" "}
                  {pref && (
                    <span className="text-muted-foreground/70">
                      Current preference: <strong>{pref}</strong>.
                    </span>
                  )}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => accept("all")}>
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Accept all
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => accept("essential")}
                  >
                    Essential only
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={dismiss}
                    aria-label="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
