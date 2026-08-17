import { NextRequest, NextResponse } from "next/server";
import { appendMessage } from "@/lib/admin/store";
import { SERVICE_HELP_OPTIONS } from "@/lib/cta";

interface ContactFormData {
  name: string;
  business: string;
  email: string;
  phone?: string;
  help: string;
  eventType?: string;
  serviceStyle?: string;
  guestCount?: string;
  setupNeeds?: string;
  eventDate?: string;
  eventLocation?: string;
  budget?: string;
  dietary?: string;
  howHeard?: string;
  message?: string;
  confirm_url?: string; // honeypot field
}

// In-memory rate limiter with automatic cleanup.
// Limitation: resets on serverless cold starts, so it only guards against
// rapid-fire abuse within a single instance lifetime. For stronger
// protection, consider a distributed store (e.g. Upstash Redis rate-limit).
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 submissions per window
const RATE_LIMIT_MAX_ENTRIES = 10_000; // prevent unbounded memory growth

function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(key);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Periodic cleanup to prevent memory leak
  if (rateLimit.size > RATE_LIMIT_MAX_ENTRIES) cleanupRateLimit();

  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function sanitize(value: string | undefined, maxLength = 1000): string {
  if (!value) return "";
  return value.slice(0, maxLength).replace(/<[^>]*>/g, "").trim();
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
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // ── Rate limiting ──
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const data: ContactFormData = await request.json();

    // Honeypot check — if this field has a value, it's a bot
    if (data.confirm_url) {
      // Return success to not alert the bot, but discard the submission
      return NextResponse.json(
        { success: true, message: "Inquiry received" },
        { status: 200 }
      );
    }

    // Sanitize inputs
    const sanitized = {
      name: sanitize(data.name, 200),
      business: sanitize(data.business, 200),
      email: sanitize(data.email, 320),
      phone: sanitize(data.phone, 30),
      help: sanitize(data.help, 200),
      eventType: sanitize(data.eventType, 60),
      serviceStyle: sanitize(data.serviceStyle, 80),
      guestCount: sanitize(data.guestCount, 60),
      setupNeeds: sanitize(data.setupNeeds, 300),
      eventDate: sanitize(data.eventDate, 120),
      eventLocation: sanitize(data.eventLocation, 200),
      budget: sanitize(data.budget, 40),
      dietary: sanitize(data.dietary, 300),
      howHeard: sanitize(data.howHeard, 80),
      message: sanitize(data.message, 2000),
    };

    // Validate required fields
    if (!sanitized.name || !sanitized.email || !sanitized.phone || !sanitized.help) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate help option matches allowed values (kept in sync with the
    // contact form via the shared SERVICE_HELP_OPTIONS source of truth).
    if (!(SERVICE_HELP_OPTIONS as readonly string[]).includes(sanitized.help)) {
      return NextResponse.json(
        { error: "Invalid service selection" },
        { status: 400 }
      );
    }

    // Structured log (no PII in production logs)
    console.log(
      JSON.stringify({
        event: "contact_form_submission",
        timestamp: new Date().toISOString(),
        help: sanitized.help,
        hasPhone: !!sanitized.phone,
        hasEventType: !!sanitized.eventType,
        hasServiceStyle: !!sanitized.serviceStyle,
        hasGuestCount: !!sanitized.guestCount,
        hasSetupNeeds: !!sanitized.setupNeeds,
        hasEventDate: !!sanitized.eventDate,
        hasEventLocation: !!sanitized.eventLocation,
        hasBudget: !!sanitized.budget,
        hasDietary: !!sanitized.dietary,
        hasHowHeard: !!sanitized.howHeard,
        hasMessage: !!sanitized.message,
      })
    );

    // ── Save the lead to the admin inbox. This is now the single source of
    //    truth for inquiries — the admin tool handles them end-to-end (no email
    //    is sent). If saving fails we surface an error so the guest can retry. ──
    try {
      await appendMessage({
        name: sanitized.name,
        email: sanitized.email,
        phone: sanitized.phone,
        service: sanitized.help,
        business: sanitized.business,
        message: sanitized.message,
        details: [
          ["Occasion", sanitized.eventType],
          ["Service style", sanitized.serviceStyle],
          ["Guest count", sanitized.guestCount],
          ["Setup needs", sanitized.setupNeeds],
          ["Event date", sanitized.eventDate],
          ["Location", sanitized.eventLocation],
          ["Budget", sanitized.budget],
          ["Dietary needs", sanitized.dietary],
          ["Heard about us", sanitized.howHeard],
        ]
          .filter(([, v]) => v)
          .map(([label, value]) => ({ label, value })),
      });
    } catch (saveError) {
      console.error("Failed to save contact message to inbox:", saveError);
      return NextResponse.json(
        { error: "We couldn't save your inquiry right now. Please try again, or call us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Inquiry received" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
