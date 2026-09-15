/**
 * Meta (Facebook) Pixel — client-side helpers shared by the <MetaPixel />
 * loader and the lead-form submit handlers.
 */

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** Opt-out model — tracking is allowed unless the visitor clicked "Decline". */
export function hasMarketingConsent(): boolean {
  try {
    return localStorage.getItem("cookie-consent") !== "declined";
  } catch {
    // localStorage can throw SecurityError on iOS Safari (private browsing)
    return true;
  }
}

/**
 * Random id shared by the browser Pixel event and the server CAPI event so
 * Meta deduplicates the pair (event_id + event_name matching).
 */
export function newMetaEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/** Fire a standard Pixel event (no-op when the pixel isn't loaded or consent was declined). */
export function metaTrack(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  if (!hasMarketingConsent()) return;
  window.fbq("track", event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}
