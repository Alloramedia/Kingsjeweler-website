import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeMedia } from "@/lib/admin/store";

/**
 * Public reference-photo upload for the contact form. One image per lead.
 * Every upload is re-encoded through sharp (strips EXIF/metadata and any
 * hostile payload) and stored under the same immutable key scheme the
 * /media/[key] route serves.
 */

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB raw upload cap
const MAX_WIDTH = 1600;

// In-memory rate limiter — same tradeoffs as /api/contact.
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
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
  // ── Origin validation (CSRF protection) ──
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "https://www.kingsjewelerct.com",
    "https://kingsjewelerct.com",
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ];
  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No photo was provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "That file isn't a photo." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That photo is too large. Please use one under 8 MB." },
      { status: 400 }
    );
  }

  let optimized: Buffer;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    optimized = await sharp(input)
      .rotate() // respect EXIF orientation from phone photos
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "We couldn't read that photo. Try a JPG, PNG, or HEIC." },
      { status: 400 }
    );
  }

  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  await writeMedia(key, optimized, "image/webp");

  return NextResponse.json({ url: `/media/${key}` });
}
