import { NextRequest, NextResponse } from "next/server";
import { appendMessage } from "@/lib/admin/store";
import {
  METAL_OPTIONS,
  KARAT_OPTIONS,
  STONE_OPTIONS,
  STONE_SHAPE_OPTIONS,
  STONE_AMOUNT_OPTIONS,
  TIMELINE_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  getPiece,
} from "@/lib/builder";
import { BUDGET_OPTIONS } from "@/lib/cta";

interface DesignFormData {
  piece: string;
  style: string;
  metal: string;
  karat?: string;
  stones: string;
  stoneShape?: string;
  stoneAmount?: string;
  size?: string;
  engraving?: string;
  budget?: string;
  timeline?: string;
  notes?: string;
  name: string;
  email: string;
  phone: string;
  contactMethod?: string;
  aiPreviewed?: boolean;
  confirm_url?: string; // honeypot field
}

// In-memory rate limiter — same tradeoffs as /api/contact (resets on
// serverless cold starts; guards against rapid-fire abuse per instance).
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MAX_ENTRIES = 10_000;

function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(key);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
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

/** Empty string or a member of the allowed list — rejects fabricated values. */
function isAllowed(value: string, options: readonly string[]): boolean {
  return !value || options.includes(value);
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

    // ── Rate limiting ──
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const data: DesignFormData = await request.json();

    // Honeypot check — return success so the bot isn't alerted
    if (data.confirm_url) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const sanitized = {
      piece: sanitize(data.piece, 40),
      style: sanitize(data.style, 100),
      metal: sanitize(data.metal, 40),
      karat: sanitize(data.karat, 20),
      stones: sanitize(data.stones, 80),
      stoneShape: sanitize(data.stoneShape, 40),
      stoneAmount: sanitize(data.stoneAmount, 60),
      size: sanitize(data.size, 60),
      engraving: sanitize(data.engraving, 120),
      budget: sanitize(data.budget, 40),
      timeline: sanitize(data.timeline, 60),
      notes: sanitize(data.notes, 2000),
      name: sanitize(data.name, 200),
      email: sanitize(data.email, 320),
      phone: sanitize(data.phone, 30),
      contactMethod: sanitize(data.contactMethod, 20),
    };

    if (!sanitized.name || !sanitized.email || !sanitized.phone || !sanitized.piece) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // ── Validate selections against the shared option lists ──
    const piece = getPiece(sanitized.piece);
    if (!piece) {
      return NextResponse.json({ error: "Invalid piece selection" }, { status: 400 });
    }
    const valid =
      isAllowed(sanitized.style, piece.styles.map((s) => s.value)) &&
      isAllowed(sanitized.metal, METAL_OPTIONS) &&
      isAllowed(sanitized.karat, KARAT_OPTIONS) &&
      isAllowed(sanitized.stones, STONE_OPTIONS) &&
      isAllowed(sanitized.stoneShape, STONE_SHAPE_OPTIONS) &&
      isAllowed(sanitized.stoneAmount, STONE_AMOUNT_OPTIONS) &&
      isAllowed(sanitized.size, piece.sizeOptions) &&
      isAllowed(sanitized.budget, BUDGET_OPTIONS) &&
      isAllowed(sanitized.timeline, TIMELINE_OPTIONS) &&
      isAllowed(sanitized.contactMethod, CONTACT_METHOD_OPTIONS);
    if (!valid) {
      return NextResponse.json({ error: "Invalid selection" }, { status: 400 });
    }

    // Structured log (no PII)
    console.log(
      JSON.stringify({
        event: "design_builder_submission",
        timestamp: new Date().toISOString(),
        piece: sanitized.piece,
        style: sanitized.style,
        metal: sanitized.metal,
        stones: sanitized.stones,
        budget: sanitized.budget,
      })
    );

    // ── Save the lead to the admin inbox (same pipeline as /api/contact) ──
    try {
      await appendMessage({
        name: sanitized.name,
        email: sanitized.email,
        phone: sanitized.phone,
        service: `Design Builder — ${piece.label}`,
        business: "",
        message: sanitized.notes,
        details: [
          ["Piece", piece.label],
          ["Style", sanitized.style],
          ["Metal", sanitized.metal],
          ["Karat", sanitized.karat],
          ["Stones", sanitized.stones],
          ["Stone shape", sanitized.stoneShape],
          ["Stone coverage", sanitized.stoneAmount],
          [piece.sizeLabel, sanitized.size],
          ["Engraving", sanitized.engraving],
          ["Budget", sanitized.budget],
          ["Timeline", sanitized.timeline],
          ["Preferred contact", sanitized.contactMethod],
          ["AI preview", data.aiPreviewed === true ? "Customer generated a photoreal preview" : ""],
        ]
          .filter(([, v]) => v)
          .map(([label, value]) => ({ label, value })),
      });
    } catch (saveError) {
      console.error("Failed to save design request to inbox:", saveError);
      return NextResponse.json(
        { error: "We couldn't save your design right now. Please try again, or call us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Design builder error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
