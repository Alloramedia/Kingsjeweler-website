"use client";

import { useEffect } from "react";
import { hasMarketingConsent, metaTrack, newMetaEventId } from "@/lib/meta-pixel";

/**
 * Fires a Meta "Contact" event on any click-to-call (tel:) link via a
 * delegated document listener, and mirrors it to CAPI through
 * /api/meta-event with a shared eventId for deduplication.
 */
export function MetaCallTracking() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (!anchor || !hasMarketingConsent()) return;

      const eventId = newMetaEventId();
      metaTrack("Contact", { content_name: "Click to call" }, eventId);
      // keepalive lets the request finish even if the tap backgrounds the page.
      fetch("/api/meta-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: "Contact", eventId }),
        keepalive: true,
      }).catch(() => {});
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
