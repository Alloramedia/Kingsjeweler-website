import { NextRequest, NextResponse } from "next/server";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

/**
 * CAPI mirror for browser-only conversions that have no form submission of
 * their own (currently just click-to-call "Contact" events). The browser
 * Pixel fires the same event with the same eventId, so Meta deduplicates.
 */

// Strict allowlist — this endpoint must not become an open event relay.
const ALLOWED_EVENTS = ["Contact"] as const;

// In-memory rate limiter — same tradeoffs as /api/contact (resets on
// serverless cold starts; guards against rapid-fire abuse per instance).
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_MAX_ENTRIES = 10_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (rateLimit.size > RATE_LIMIT_MAX_ENTRIES) {
    for (const [key, entry] of rateLimit) {
      if (now > entry.resetAt) rateLimit.delete(key);
    }
  }
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    // ── Origin validation (CSRF protection) ──
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      "https://www.kingsjewelerct.com",
      "https://kingsjewelerct.com",
      ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
    ];
    if (!origin || !allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const data: { eventName?: string; eventId?: string } = await request.json();

    const eventName = data.eventName ?? "";
    if (!(ALLOWED_EVENTS as readonly string[]).includes(eventName)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }
    const eventId = String(data.eventId ?? "").slice(0, 64).replace(/[^A-Za-z0-9-]/g, "");
    if (!eventId) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    await sendMetaCapiEvent({
      request,
      eventName,
      eventId,
      customData: { content_name: "Click to call" },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
