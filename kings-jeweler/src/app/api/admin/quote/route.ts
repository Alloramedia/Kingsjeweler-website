import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { isAuthenticated } from "@/lib/admin/auth";
import { getSiteContent } from "@/lib/admin/schema";
import { siteConfig } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface QuoteLineInput {
  label: string;
  detail?: string;
  qty: number;
  unitPrice: number;
}

interface NutritionInput {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

interface QuotePayload {
  quoteNumber?: string;
  date?: string;
  validUntil?: string;
  client?: {
    name?: string;
    email?: string;
    phone?: string;
    eventType?: string;
    eventDate?: string;
    eventLocation?: string;
    guestCount?: string;
  };
  lines?: QuoteLineInput[];
  notes?: string;
  depositPct?: number;
  taxPct?: number;
  nutrition?: {
    perServing?: Partial<NutritionInput>;
    total?: Partial<NutritionInput>;
    servings?: number;
  };
}

/** Convert a "#RRGGBB" string to a pdf-lib rgb() color, with a fallback. */
function hex(input: string | undefined, fallback: string) {
  const s = (input || fallback).replace("#", "");
  const v = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return hex(fallback, "#000000");
  }
  return rgb(r / 255, g / 255, b / 255);
}

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function clampStr(v: unknown, max = 300): string {
  return String(v ?? "").slice(0, max).replace(/[\u0000-\u001f\u007f]/g, " ");
}
function clampNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/** Wrap text to a max width, returning the lines that fit. */
function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Load a binary asset from /public/<folder>. Tries the local filesystem first
 * (works in dev and when the public dir is bundled), then falls back to
 * fetching it from the live site over HTTP (works on serverless).
 */
async function loadPublicBytes(folder: string, file: string): Promise<Uint8Array | null> {
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const p = path.join(process.cwd(), "public", folder, file);
    return new Uint8Array(await fs.readFile(p));
  } catch {
    /* fall through to HTTP */
  }
  try {
    const base = siteConfig.url.replace(/\/+$/, "");
    const res = await fetch(`${base}/${folder}/${encodeURIComponent(file)}`);
    if (res.ok) return new Uint8Array(await res.arrayBuffer());
  } catch {
    /* give up gracefully */
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let payload: QuotePayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const content = await getSiteContent();
  const colors = content.colors;
  const phone = content.contact?.phone || siteConfig.phone;
  const email = content.contact?.email || siteConfig.email;
  const website = siteConfig.url.replace(/^https?:\/\//, "");

  // Brand palette mirrors the website: cream page, dark ink bands with
  // navy accents and gold highlights (matching the crown logo).
  const teal = hex(colors?.secondary, "#1F3A5F");
  const espresso = hex(colors?.dark, "#14141A");
  const ink = espresso;
  const cream = rgb(0.996, 0.988, 0.961); // #FBF9F4
  const creamSoft = rgb(0.972, 0.957, 0.925);
  const muted = rgb(0.42, 0.38, 0.33);
  const faint = rgb(0.58, 0.54, 0.49);
  const onDark = rgb(0.93, 0.91, 0.86); // cream text on dark bands
  const hairline = rgb(0.84, 0.8, 0.74);
  const white = rgb(1, 1, 1);

  const lines = (Array.isArray(payload.lines) ? payload.lines : [])
    .slice(0, 60)
    .map((l) => ({
      label: clampStr(l.label, 120) || "Item",
      detail: clampStr(l.detail, 160),
      qty: clampNum(l.qty),
      unitPrice: clampNum(l.unitPrice),
    }))
    .filter((l) => l.label || l.qty || l.unitPrice);

  const subtotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const taxPct = Math.min(100, clampNum(payload.taxPct));
  const depositPct = Math.min(100, clampNum(payload.depositPct));
  const tax = (subtotal * taxPct) / 100;
  const total = subtotal + tax;
  const deposit = (total * depositPct) / 100;

  const client = payload.client ?? {};
  const quoteNumber =
    clampStr(payload.quoteNumber, 40) ||
    `PM-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
  const dateStr = clampStr(payload.date, 40) || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const validUntil = clampStr(payload.validUntil, 40);
  const notes = clampStr(payload.notes, 1200);

  /* Optional per-guest nutrition stats (estimated in the admin). */
  const cleanFacts = (raw: Partial<NutritionInput> | undefined) => ({
    calories: clampNum(raw?.calories),
    protein: clampNum(raw?.protein),
    carbs: clampNum(raw?.carbs),
    fat: clampNum(raw?.fat),
    fiber: clampNum(raw?.fiber),
    sodium: clampNum(raw?.sodium),
  });
  const nutritionServings = clampNum(payload.nutrition?.servings);
  const nutrition = payload.nutrition && nutritionServings > 0
    ? { perServing: cleanFacts(payload.nutrition.perServing), total: cleanFacts(payload.nutrition.total), servings: nutritionServings }
    : null;

  /* ── Build the document ── */
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${siteConfig.name} Catering Quote ${quoteNumber}`);
  pdf.setAuthor(siteConfig.name);
  pdf.setCreator(siteConfig.name);

  pdf.registerFontkit(fontkit);
  const [interReg, interSemi, zillaSemi, zillaBold, badgeBytes] = await Promise.all([
    loadPublicBytes("fonts", "Inter-Regular.ttf"),
    loadPublicBytes("fonts", "Inter-SemiBold.ttf"),
    loadPublicBytes("fonts", "ZillaSlab-SemiBold.ttf"),
    loadPublicBytes("fonts", "ZillaSlab-Bold.ttf"),
    loadPublicBytes("images", "kings-jeweler-badge.png"),
  ]);

  // Body type = Inter, headings = Zilla Slab — matching the website. Falls back
  // to the built-in standard fonts if a file can't be loaded.
  const font = interReg
    ? await pdf.embedFont(interReg, { subset: true })
    : await pdf.embedFont(StandardFonts.Helvetica);
  const bold = interSemi
    ? await pdf.embedFont(interSemi, { subset: true })
    : await pdf.embedFont(StandardFonts.HelveticaBold);
  const serifSemi = zillaSemi ? await pdf.embedFont(zillaSemi, { subset: true }) : bold;
  const serif = zillaBold ? await pdf.embedFont(zillaBold, { subset: true }) : bold;

  const badgeImg = badgeBytes ? await pdf.embedPng(badgeBytes).catch(() => null) : null;
  const steelImg = null;

  const PAGE_W = 612;
  const PAGE_H = 792;
  const MARGIN = 48;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H;

  const text = (
    p: PDFPage,
    s: string,
    x: number,
    yPos: number,
    size: number,
    f: PDFFont = font,
    color = ink,
  ) => p.drawText(s, { x, y: yPos, size, font: f, color });

  const textRight = (
    p: PDFPage,
    s: string,
    rightX: number,
    yPos: number,
    size: number,
    f: PDFFont = font,
    color = ink,
  ) => {
    const w = f.widthOfTextAtSize(s, size);
    p.drawText(s, { x: rightX - w, y: yPos, size, font: f, color });
  };

  /* ── Page furniture: cream background + dark metal header/footer bands ── */
  const paintBg = (p: PDFPage) =>
    p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: cream });

  const drawHeaderBand = (p: PDFPage, compact = false): number => {
    const h = compact ? 66 : 152;
    const yb = PAGE_H - h;
    if (steelImg) {
      p.drawImage(steelImg, { x: 0, y: yb, width: PAGE_W, height: h });
      p.drawRectangle({ x: 0, y: yb, width: PAGE_W, height: h, color: espresso, opacity: 0.64 });
    } else {
      p.drawRectangle({ x: 0, y: yb, width: PAGE_W, height: h, color: espresso });
    }
    p.drawRectangle({ x: 0, y: yb, width: PAGE_W, height: 4, color: teal });

    if (badgeImg) {
      const lh = compact ? 46 : 116;
      const lw = (badgeImg.width / badgeImg.height) * lh;
      p.drawImage(badgeImg, { x: MARGIN, y: yb + (h - lh) / 2, width: lw, height: lh });
    } else {
      text(p, siteConfig.name.toUpperCase(), MARGIN, yb + h / 2 - 6, compact ? 16 : 26, serif, onDark);
    }

    if (compact) {
      textRight(p, "CATERING QUOTE  ·  continued", PAGE_W - MARGIN, yb + h / 2 - 4, 11, serif, onDark);
    } else {
      textRight(p, "CATERING QUOTE", PAGE_W - MARGIN, yb + h - 54, 17, serif, onDark);
      textRight(p, "FINE JEWELRY  ·  REPAIRS  ·  MANCHESTER, CT", PAGE_W - MARGIN, yb + h - 70, 7.5, bold, teal);
      textRight(p, `Quote  ${quoteNumber}`, PAGE_W - MARGIN, yb + 42, 9.5, bold, onDark);
      textRight(p, dateStr, PAGE_W - MARGIN, yb + 27, 9, font, rgb(0.74, 0.72, 0.68));
    }
    return yb;
  };

  const drawFooterBand = (p: PDFPage) => {
    const h = 48;
    if (steelImg) {
      p.drawImage(steelImg, { x: 0, y: 0, width: PAGE_W, height: h });
      p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: h, color: espresso, opacity: 0.72 });
    } else {
      p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: h, color: espresso });
    }
    p.drawRectangle({ x: 0, y: h - 3, width: PAGE_W, height: 3, color: teal });
    const line1 = `${phone}    ·    ${email}    ·    ${website}`;
    const w1 = font.widthOfTextAtSize(line1, 8.5);
    p.drawText(line1, { x: (PAGE_W - w1) / 2, y: 20, size: 8.5, font, color: onDark });
    const line2 = `${siteConfig.name}  ·  Fine Jewelry & Repairs  ·  Manchester, CT`;
    const w2 = bold.widthOfTextAtSize(line2, 7.5);
    p.drawText(line2, { x: (PAGE_W - w2) / 2, y: 9, size: 7.5, font: bold, color: teal });
  };

  /* ── Page 1 ── */
  paintBg(page);
  y = drawHeaderBand(page) - 32;

  /* Prepared-for + Event details, two columns */
  const colGap = 26;
  const colW = (CONTENT_W - colGap) / 2;
  const leftX = MARGIN;
  const rcolX = MARGIN + colW + colGap;

  text(page, "PREPARED FOR", leftX, y, 8.5, serifSemi, teal);
  text(page, "EVENT DETAILS", rcolX, y, 8.5, serifSemi, teal);
  page.drawLine({ start: { x: leftX, y: y - 6 }, end: { x: leftX + colW, y: y - 6 }, thickness: 1, color: teal });
  page.drawLine({ start: { x: rcolX, y: y - 6 }, end: { x: rcolX + colW, y: y - 6 }, thickness: 1, color: teal });
  y -= 20;

  const leftRows = [
    client.name && clampStr(client.name, 80),
    client.email && clampStr(client.email, 120),
    client.phone && clampStr(client.phone, 40),
  ].filter(Boolean) as string[];

  const rightRows = [
    client.eventType && `Occasion:  ${clampStr(client.eventType, 60)}`,
    client.guestCount && `Guests:  ${clampStr(client.guestCount, 40)}`,
    client.eventDate && `Date:  ${clampStr(client.eventDate, 60)}`,
    client.eventLocation && `Location:  ${clampStr(client.eventLocation, 120)}`,
  ].filter(Boolean) as string[];

  const blockRows = Math.max(leftRows.length, rightRows.length, 1);
  let ry = y;
  for (let i = 0; i < blockRows; i++) {
    if (leftRows[i]) text(page, leftRows[i], leftX, ry, i === 0 ? 11.5 : 10, i === 0 ? bold : font, ink);
    if (rightRows[i]) text(page, rightRows[i], rcolX, ry, 10, font, ink);
    ry -= 15;
  }
  y = ry - 14;

  /* Line-items table */
  const amtR = PAGE_W - MARGIN;
  const unitR = amtR - 92;
  const qtyR = unitR - 70;
  const itemL = MARGIN + 12;
  const itemMaxW = qtyR - 60 - itemL;

  const ROW_PAD_TOP = 8;
  const ITEM_LH = 14;
  const DETAIL_LH = 11;
  const ROW_PAD_BOT = 9;

  // Draws the dark table header starting at top edge `topY`; returns the
  // bottom edge (= top of the first row) so rows stack on a shared grid.
  const drawTableHead = (p: PDFPage, topY: number): number => {
    const h = 22;
    p.drawRectangle({ x: MARGIN, y: topY - h, width: CONTENT_W, height: h, color: espresso });
    p.drawRectangle({ x: MARGIN, y: topY - h, width: 4, height: h, color: teal });
    const tb = topY - 15;
    text(p, "ITEM", itemL, tb, 8.5, serifSemi, onDark);
    textRight(p, "QTY", qtyR, tb, 8.5, serifSemi, onDark);
    textRight(p, "UNIT", unitR, tb, 8.5, serifSemi, onDark);
    textRight(p, "AMOUNT", amtR - 12, tb, 8.5, serifSemi, onDark);
    return topY - h;
  };

  const qtyStr = (n: number) =>
    n ? (Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100)) : "—";

  let rowTop = drawTableHead(page, y);

  let zebraToggle = true;
  for (const l of lines) {
    const detailLines = l.detail ? wrap(l.detail, font, 8.5, itemMaxW) : [];
    const rowH = ROW_PAD_TOP + ITEM_LH + detailLines.length * DETAIL_LH + ROW_PAD_BOT;
    if (rowTop - rowH < 132) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      paintBg(page);
      rowTop = drawTableHead(page, drawHeaderBand(page, true) - 28);
      zebraToggle = true;
    }
    const rowBottom = rowTop - rowH;
    if (zebraToggle) {
      page.drawRectangle({ x: MARGIN, y: rowBottom, width: CONTENT_W, height: rowH, color: creamSoft });
    }
    zebraToggle = !zebraToggle;

    const itemBaseline = rowTop - ROW_PAD_TOP - 8;
    const amount = l.qty * l.unitPrice;
    text(page, l.label, itemL, itemBaseline, 10.5, bold, ink);
    textRight(page, qtyStr(l.qty), qtyR, itemBaseline, 10, font, ink);
    textRight(page, l.unitPrice ? usd(l.unitPrice) : "—", unitR, itemBaseline, 10, font, ink);
    textRight(page, usd(amount), amtR - 12, itemBaseline, 10.5, bold, amount ? ink : faint);

    let dy = itemBaseline - ITEM_LH;
    for (const dl of detailLines) {
      text(page, dl, itemL, dy, 8.5, font, faint);
      dy -= DETAIL_LH;
    }

    // Separator sits exactly on the shared bottom edge of the row.
    page.drawLine({
      start: { x: MARGIN, y: rowBottom },
      end: { x: amtR, y: rowBottom },
      thickness: 0.5,
      color: hairline,
    });
    rowTop = rowBottom;
  }
  y = rowTop;

  if (lines.length === 0) {
    text(page, "No items added yet.", itemL, rowTop - 18, 10, font, faint);
    y = rowTop - 30;
  }

  /* Totals card + booking terms, side by side */
  if (y < 210) {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    paintBg(page);
    y = drawHeaderBand(page, true) - 28;
  }
  const blockTop = y - 24;

  const cardW = 248;
  const cardX = PAGE_W - MARGIN - cardW;
  const tRows: [string, string][] = [["Subtotal", usd(subtotal)]];
  if (taxPct > 0) tRows.push([`Tax (${taxPct}%)`, usd(tax)]);
  const padV = 14;
  const rowH = 18;
  const totalBarH = 26;
  const hasDeposit = depositPct > 0;
  const cardH = padV * 2 + tRows.length * rowH + totalBarH + (hasDeposit ? 22 : 0);

  page.drawRectangle({ x: cardX, y: blockTop - cardH, width: cardW, height: cardH, color: creamSoft });
  page.drawRectangle({ x: cardX, y: blockTop - cardH, width: 4, height: cardH, color: teal });

  let cy = blockTop - padV - 6;
  for (const [lab, val] of tRows) {
    text(page, lab, cardX + 16, cy, 10, font, muted);
    textRight(page, val, cardX + cardW - 14, cy, 10, font, ink);
    cy -= rowH;
  }
  cy -= 1;
  page.drawRectangle({ x: cardX + 8, y: cy - 7, width: cardW - 16, height: totalBarH - 4, color: teal });
  text(page, "TOTAL", cardX + 16, cy, 12, serif, white);
  textRight(page, usd(total), cardX + cardW - 14, cy, 12, bold, white);
  cy -= totalBarH;
  if (hasDeposit) {
    text(page, `Deposit to reserve (${depositPct}%)`, cardX + 16, cy, 9, font, muted);
    textRight(page, usd(deposit), cardX + cardW - 14, cy, 10, bold, ink);
    cy -= 22;
  }

  /* Booking terms fill the left column so the page reads balanced */
  const leftBlockW = cardX - MARGIN - 28;
  let ly = blockTop;
  text(page, "WHAT'S INCLUDED & NEXT STEPS", MARGIN, ly, 8.5, serifSemi, teal);
  page.drawLine({ start: { x: MARGIN, y: ly - 6 }, end: { x: MARGIN + leftBlockW, y: ly - 6 }, thickness: 1, color: teal });
  ly -= 20;
  const terms = [
    `A ${hasDeposit ? depositPct : 50}% deposit reserves your date; the balance is due the week of your event.`,
    "Pricing covers setup, on-site cooking, serving, and full breakdown of our station.",
    "Final headcount and menu selections are locked 14 days before the event.",
    validUntil
      ? `This quote is valid through ${validUntil}.`
      : "Pricing is held for 14 days from the date above.",
  ];
  for (const t of terms) {
    text(page, "•", MARGIN, ly, 10, bold, teal);
    const tl = wrap(t, font, 9, leftBlockW - 14);
    let by = ly;
    for (const line of tl) {
      text(page, line, MARGIN + 12, by, 9, font, ink);
      by -= 12;
    }
    ly = by - 6;
  }

  y = Math.min(ly, blockTop - cardH) - 22;

  /* Estimated per-guest nutrition stats (optional) */
  if (nutrition) {
    const blockH = 96;
    if (y < 120 + blockH) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      paintBg(page);
      y = drawHeaderBand(page, true) - 28;
    }
    text(page, "ESTIMATED NUTRITION PER GUEST", MARGIN, y, 8.5, serifSemi, teal);
    page.drawLine({ start: { x: MARGIN, y: y - 6 }, end: { x: PAGE_W - MARGIN, y: y - 6 }, thickness: 1, color: teal });
    y -= 18;

    const g1 = (v: number) => `${Math.round(v * 10) / 10} g`;
    const cells: [string, string][] = [
      [`${Math.round(nutrition.perServing.calories)}`, "Calories"],
      [g1(nutrition.perServing.protein), "Protein"],
      [g1(nutrition.perServing.carbs), "Carbs"],
      [g1(nutrition.perServing.fat), "Fat"],
      [g1(nutrition.perServing.fiber), "Fiber"],
      [`${Math.round(nutrition.perServing.sodium)} mg`, "Sodium"],
    ];
    const cellGap = 8;
    const cellW = (CONTENT_W - cellGap * (cells.length - 1)) / cells.length;
    const cellH = 42;
    const cellTop = y;
    cells.forEach(([val, lab], i) => {
      const cx = MARGIN + i * (cellW + cellGap);
      page.drawRectangle({ x: cx, y: cellTop - cellH, width: cellW, height: cellH, color: creamSoft });
      page.drawRectangle({ x: cx, y: cellTop - cellH, width: cellW, height: 3, color: teal });
      const vw = serif.widthOfTextAtSize(val, 14);
      page.drawText(val, { x: cx + (cellW - vw) / 2, y: cellTop - 22, size: 14, font: serif, color: ink });
      const lw = bold.widthOfTextAtSize(lab.toUpperCase(), 7);
      page.drawText(lab.toUpperCase(), { x: cx + (cellW - lw) / 2, y: cellTop - 34, size: 7, font: bold, color: muted });
    });
    y = cellTop - cellH - 16;

    const protLb = Math.round((nutrition.total.protein / 453.6) * 10) / 10;
    const statLine = `Across ~${Math.round(nutrition.servings)} guests: ${nutrition.total.calories.toLocaleString("en-US", { maximumFractionDigits: 0 })} total calories cooked  ·  about ${protLb} lb of protein served.`;
    for (const sl of wrap(statLine, font, 9, CONTENT_W)) {
      text(page, sl, MARGIN, y, 9, font, faint);
      y -= 12;
    }
    text(page, "Estimated from typical recipes; not a certified nutrition label.", MARGIN, y, 7.5, font, faint);
    y -= 24;
  }

  /* Optional custom note from the team */
  if (notes) {
    if (y < 110) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      paintBg(page);
      y = drawHeaderBand(page, true) - 28;
    }
    text(page, "A NOTE FROM THE TEAM", MARGIN, y, 8.5, serifSemi, teal);
    page.drawLine({ start: { x: MARGIN, y: y - 6 }, end: { x: PAGE_W - MARGIN, y: y - 6 }, thickness: 1, color: teal });
    y -= 20;
    for (const nl of wrap(notes, font, 9.5, CONTENT_W)) {
      text(page, nl, MARGIN, y, 9.5, font, ink);
      y -= 13;
    }
    y -= 24;
  }

  /* Closing line + brand flourish anchored toward the bottom */
  if (y > 118) {
    const msg = `Thank you for considering ${siteConfig.name} — we look forward to serving you!`;
    const wMsg = serif.widthOfTextAtSize(msg, 12.5);
    const msgY = Math.min(y - 12, 240);
    if (wMsg <= CONTENT_W) {
      page.drawText(msg, { x: (PAGE_W - wMsg) / 2, y: msgY, size: 12.5, font: serif, color: ink });
    }
    const cx = PAGE_W / 2;
    page.drawRectangle({ x: cx - 26, y: 98, width: 52, height: 2.4, color: teal });
    const tag = "FINE JEWELRY   ·   REPAIRS   ·   MANCHESTER, CT";
    const wTag = bold.widthOfTextAtSize(tag, 8);
    page.drawText(tag, { x: cx - wTag / 2, y: 82, size: 8, font: bold, color: muted });
  }

  /* Footer band on every page */
  for (const p of pdf.getPages()) {
    drawFooterBand(p);
  }

  const bytes = await pdf.save();
  const fileName = `kings-jeweler-quote-${quoteNumber}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
