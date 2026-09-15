import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Meta Conversions API (server-side events).
 *
 * Mirrors browser Pixel events from API routes so conversions still land when
 * the Pixel is blocked (ad blockers, ITP). Pass the same eventId the client
 * used with fbq(..., { eventID }) and Meta deduplicates the pair.
 *
 * No-ops unless NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_ACCESS_TOKEN are set.
 * Never throws — a tracking failure must not break a lead submission.
 */

const GRAPH_API_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function hashEmail(email: string): string {
  return sha256(email.trim().toLowerCase());
}

function hashPhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  // Meta wants digits with country code; assume US for 10-digit numbers.
  return sha256(digits.length === 10 ? `1${digits}` : digits);
}

interface MetaCapiEventOptions {
  request: NextRequest;
  eventName: "Lead" | "Contact" | (string & {});
  /** Shared dedup id — must match the browser event's eventID. */
  eventId?: string;
  email?: string;
  phone?: string;
  customData?: Record<string, string | number>;
}

export async function sendMetaCapiEvent({
  request,
  eventName,
  eventId,
  email,
  phone,
  customData,
}: MetaCapiEventOptions): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  try {
    const userData: Record<string, unknown> = {};

    const userAgent = request.headers.get("user-agent");
    if (userAgent) userData.client_user_agent = userAgent;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (ip) userData.client_ip_address = ip;

    if (email) userData.em = [hashEmail(email)];
    const ph = phone ? hashPhone(phone) : undefined;
    if (ph) userData.ph = [ph];

    // Browser-id cookies set by the Pixel — big match-quality boost.
    const fbp = request.cookies.get("_fbp")?.value;
    if (fbp) userData.fbp = fbp;
    const fbc = request.cookies.get("_fbc")?.value;
    if (fbc) userData.fbc = fbc;

    const event: Record<string, unknown> = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: userData,
    };
    if (eventId) event.event_id = eventId;
    const sourceUrl = request.headers.get("referer");
    if (sourceUrl) event.event_source_url = sourceUrl;
    if (customData) event.custom_data = customData;

    const body: Record<string, unknown> = {
      data: [event],
      // Token goes in the body, not the query string, to keep it out of logs.
      access_token: accessToken,
    };
    if (process.env.META_TEST_EVENT_CODE) {
      body.test_event_code = process.env.META_TEST_EVENT_CODE;
    }

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${encodeURIComponent(pixelId)}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Meta CAPI error:", res.status, detail.slice(0, 500));
    }
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
  }
}
