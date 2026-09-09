import { NextRequest, NextResponse } from "next/server";
import {
  METAL_OPTIONS,
  KARAT_OPTIONS,
  STONE_OPTIONS,
  STONE_NONE,
  STONE_SHAPE_OPTIONS,
  STONE_AMOUNT_OPTIONS,
  getPiece,
} from "@/lib/builder";

/** Allow the function to run long enough for image generation. */
export const maxDuration = 60;

interface RenderRequest {
  piece: string;
  style?: string;
  metal?: string;
  karat?: string;
  stones?: string;
  stoneShape?: string;
  stoneAmount?: string;
  engraving?: string;
}

/* Image generation is expensive — keep the limit tight. */
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 6;
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

function isAllowed(value: string, options: readonly string[]): boolean {
  return !value || options.includes(value);
}

/* ── Prompt building — controlled vocabulary, jeweler-accurate ── */

const STYLE_PROMPTS: Record<string, string> = {
  // Rings
  "Solitaire engagement ring": "solitaire engagement ring with a single prong-set center stone on a slim polished band",
  "Halo engagement ring": "halo engagement ring, center stone encircled by a ring of small pave diamonds",
  "Three-stone ring": "three-stone ring with a larger center stone flanked by two smaller side stones",
  "Wedding or stacking band": "classic wedding band with a smooth polished finish",
  "Eternity band": "eternity band channel-set with a continuous row of stones around the entire band",
  "Signet ring": "signet ring with a flat polished face engraved with a single initial",
  "Statement / cluster ring": "bold statement cluster ring with a dome of closely set stones",
  // Necklaces
  "Cuban link chain": "Miami Cuban link chain necklace with tightly interlocking flat bevelled links",
  "Rope chain": "rope chain necklace with a tightly twisted spiral rope pattern",
  "Figaro chain": "figaro chain necklace with a repeating pattern of three short round links followed by one elongated oval link",
  "Franco chain": "franco chain necklace with a dense square four-sided V-weave link pattern",
  "Tennis necklace": "diamond tennis necklace, a continuous line of identical prong-set stones",
  "Pendant with chain": "pendant necklace, a single elegant pendant hanging from a fine cable chain",
  "Custom nameplate": "script nameplate necklace, a name in flowing cursive letters on a fine chain",
  // Bracelets
  "Cuban link bracelet": "Miami Cuban link bracelet with tightly interlocking flat bevelled links",
  "Tennis bracelet": "diamond tennis bracelet, a continuous flexible line of identical prong-set stones",
  "Bangle": "rigid polished bangle bracelet with a clean rounded profile",
  "Rope bracelet": "rope bracelet with a tightly twisted spiral rope pattern",
  "Charm bracelet": "charm bracelet, a cable chain carrying a few small dangling charms",
  "ID bracelet": "ID bracelet with a curved polished plate engraved with a name, on a Cuban link chain",
  // Charms
  "Initial / letter": "single letter initial pendant charm in a bold serif typeface",
  "Cross / religious": "cross pendant charm with clean bevelled edges",
  "Nameplate": "nameplate pendant, a name engraved in flowing script on a polished plate",
  "Sports / team": "sports-themed pendant charm shaped like a basketball",
  "Animal / symbol": "heart-shaped pendant charm with a high-polish finish",
  "Photo / memorial": "rectangular photo-engraved memorial pendant with a framed portrait area",
  "Custom shape — my own idea": "unique custom-shaped pendant charm, artistic and original",
};

const PIECE_PROMPTS: Record<string, string> = {
  ring: "ring",
  necklace: "chain necklace",
  bracelet: "bracelet",
  charm: "pendant charm with a bail",
};

const METAL_PROMPTS: Record<string, string> = {
  "Yellow gold": "yellow gold",
  "White gold": "white gold",
  "Rose gold": "rose gold",
  "Two-tone": "two-tone yellow and white gold",
  "Platinum": "platinum",
  "Sterling silver": "sterling silver",
};

const STONE_PROMPTS: Record<string, string> = {
  "Natural diamonds": "brilliant white diamonds",
  "Lab-grown diamonds": "brilliant white lab-grown diamonds",
  "Moissanite": "sparkling white moissanite stones",
  "Colored gemstone (sapphire, ruby, emerald...)": "a deep blue sapphire gemstone",
  "Birthstone": "a rich violet amethyst gemstone",
};

const AMOUNT_PROMPTS: Record<string, string> = {
  "One center stone": "with a single center stone",
  "Center stone with accents": "with a center stone and small accent stones",
  "A few accent stones": "with a few small accent stones",
  "Fully iced out": "fully iced out, every surface pave-set with small diamonds",
};

const ENGRAVE_STYLES = new Set([
  "Signet ring", "Custom nameplate", "Nameplate", "ID bracelet", "Initial / letter",
]);

function buildPrompt(data: RenderRequest): string {
  const piece = getPiece(data.piece);
  const parts: string[] = [];

  const karat = data.karat && data.karat !== "Not sure yet" ? `${data.karat} ` : "";
  const metal = METAL_PROMPTS[data.metal ?? ""] ?? "polished gold";
  const styleDesc =
    STYLE_PROMPTS[data.style ?? ""] ??
    `elegant ${PIECE_PROMPTS[data.piece] ?? "jewelry piece"}`;

  parts.push(`a ${karat}${metal} ${styleDesc}`);

  if (data.stones && data.stones !== STONE_NONE && STONE_PROMPTS[data.stones]) {
    let stoneDesc = `set with ${STONE_PROMPTS[data.stones]}`;
    if (data.stoneShape && data.stoneShape !== "No preference") {
      stoneDesc += `, ${data.stoneShape.split(" (")[0].toLowerCase()} cut`;
    }
    parts.push(stoneDesc);
    if (data.stoneAmount && AMOUNT_PROMPTS[data.stoneAmount]) {
      parts.push(AMOUNT_PROMPTS[data.stoneAmount]);
    }
  } else if (data.stones === STONE_NONE) {
    parts.push("polished metal only, no stones");
  }

  if (ENGRAVE_STYLES.has(data.style ?? "")) {
    const engraving = (data.engraving ?? "").replace(/[^a-zA-Z0-9 '&.-]/g, "").trim().slice(0, 18);
    if (engraving) parts.push(`engraved with "${engraving}"`);
  }

  return (
    `Professional macro jewelry product photograph: ${parts.join(", ")}. ` +
    `Shot on a seamless dark charcoal studio background with soft diffused lighting ` +
    `and gentle reflections, shallow depth of field, ultra realistic, extremely detailed, ` +
    `luxury ${piece?.label.toLowerCase() ?? "jewelry"} advertising photography. ` +
    `No hands, no people, no text, no watermarks, no logos.`
  );
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Preview rendering is not configured" }, { status: 503 });
    }

    // ── Origin validation ──
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
        { error: "You've hit the preview limit for now. Your selections are all saved — submit the design and we'll take it from here." },
        { status: 429 }
      );
    }

    const data: RenderRequest = await request.json();

    // ── Validate every selection against the shared option lists ──
    const piece = getPiece(data.piece ?? "");
    if (!piece || !data.style || !data.metal) {
      return NextResponse.json({ error: "Pick a piece, style, and metal first" }, { status: 400 });
    }
    const valid =
      isAllowed(data.style, piece.styles.map((s) => s.value)) &&
      isAllowed(data.metal, METAL_OPTIONS) &&
      isAllowed(data.karat ?? "", KARAT_OPTIONS) &&
      isAllowed(data.stones ?? "", STONE_OPTIONS) &&
      isAllowed(data.stoneShape ?? "", STONE_SHAPE_OPTIONS) &&
      isAllowed(data.stoneAmount ?? "", STONE_AMOUNT_OPTIONS);
    if (!valid) {
      return NextResponse.json({ error: "Invalid selection" }, { status: 400 });
    }

    const prompt = buildPrompt(data);

    console.log(
      JSON.stringify({
        event: "design_render_request",
        timestamp: new Date().toISOString(),
        piece: data.piece,
        style: data.style,
        metal: data.metal,
      })
    );

    const upstream = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: process.env.OPENAI_IMAGE_QUALITY || "medium",
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("Image generation failed:", upstream.status, detail.slice(0, 500));
      return NextResponse.json(
        { error: "We couldn't render the preview right now. Your design is still saved — you can submit it as-is." },
        { status: 502 }
      );
    }

    const result = await upstream.json();
    const b64 = result?.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json(
        { error: "We couldn't render the preview right now. Your design is still saved — you can submit it as-is." },
        { status: 502 }
      );
    }

    return NextResponse.json({ image: `data:image/png;base64,${b64}` }, { status: 200 });
  } catch (error: unknown) {
    console.error("Design render error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
