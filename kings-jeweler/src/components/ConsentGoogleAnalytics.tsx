"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

function subscribe(callback: () => void) {
  window.addEventListener("cookie-consent-change", callback);
  return () => window.removeEventListener("cookie-consent-change", callback);
}

function getSnapshot() {
  // Opt-out model: GA is enabled unless the user explicitly declines.
  try {
    return localStorage.getItem("cookie-consent") !== "declined";
  } catch {
    // localStorage can throw SecurityError on iOS Safari (private browsing / restricted storage)
    return true;
  }
}

function getServerSnapshot() {
  // Allow GA during SSR/initial load so the script tag is present immediately.
  return true;
}

/**
 * Renders GoogleAnalytics by default (opt-out model).
 * GA is only disabled when the user explicitly clicks "Decline" on the
 * cookie banner, which sets localStorage cookie-consent to "declined".
 * Listens for the custom "cookie-consent-change" event dispatched by
 * <CookieConsent />.
 */
export function ConsentGoogleAnalytics({ gaId }: { gaId: string }) {
  const allowed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!allowed) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
