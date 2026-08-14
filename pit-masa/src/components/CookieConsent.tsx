"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already consented
    try {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        // Delay showing the banner slightly to avoid layout shift
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage can throw SecurityError on iOS Safari
    }
  }, []);

  // Focus the dialog when it becomes visible
  useEffect(() => {
    if (visible && dialogRef.current) {
      const firstButton = dialogRef.current.querySelector<HTMLButtonElement>("button");
      firstButton?.focus();
    }
  }, [visible]);

  // Trap focus inside the dialog
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem("cookie-consent", "accepted"); } catch { /* iOS Safari */ }
    setVisible(false);
    window.dispatchEvent(
      new CustomEvent("cookie-consent-change", { detail: "accepted" })
    );
  };

  const decline = () => {
    try { localStorage.setItem("cookie-consent", "declined"); } catch { /* iOS Safari */ }
    setVisible(false);
    window.dispatchEvent(
      new CustomEvent("cookie-consent-change", { detail: "declined" })
    );
    // Disable GA if it was already loaded
    (window as Record<string, unknown>)[`ga-disable-${process.env.NEXT_PUBLIC_GA_ID}`] = true;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={dialogRef}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl px-6 py-4 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie consent"
          onKeyDown={handleKeyDown}
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-white/70">
              We use cookies and analytics to improve your experience. By continuing
              to use this site, you agree to our{" "}
              <Link
                href="/website-policies#privacy-policy"
                className="text-[#B08D3E] underline hover:text-[#99782F]"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={decline}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/70 transition-all hover:border-white/40 hover:text-white hover:bg-white/5"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="rounded-full bg-[#B08D3E] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#99782F] hover:shadow-lg hover:shadow-[#B08D3E]/20"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
