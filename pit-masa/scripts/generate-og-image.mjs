// Generates the social share image at /public/og-image.jpg (1200x630).
// Composites a food hero photo, a dark gradient for legibility, the Pit & Masa
// badge logo, and a tagline. Run: node scripts/generate-og-image.mjs
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const W = 1200;
const H = 630;

const BG = path.join(PUBLIC, "images/food/food-008.webp"); // street tacos
const BADGE = path.join(PUBLIC, "images/pit-masa-badge.png"); // primary badge logo
const OUT = path.join(PUBLIC, "og-image.jpg");

const BADGE_SIZE = 340;

// Dark gradient overlay for text legibility.
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c1413" stop-opacity="0.78"/>
      <stop offset="45%" stop-color="#0c1413" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0c1413" stop-opacity="0.86"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`);

// Tagline text rendered as SVG (so we don't depend on system fonts for layout).
const tagline = Buffer.from(`
<svg width="${W}" height="120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .t { font-family: Georgia, 'Times New Roman', serif; font-weight: 700;
         fill: #FF8C00; letter-spacing: 6px; }
    .s { font-family: Arial, Helvetica, sans-serif; font-weight: 600;
         fill: #f6f1e7; letter-spacing: 2px; }
  </style>
  <text x="${W / 2}" y="48" text-anchor="middle" font-size="40" class="t">MOBILE SMOKE &amp; TACO CATERING</text>
  <text x="${W / 2}" y="98" text-anchor="middle" font-size="30" class="s">Wood-fired BBQ &amp; Birria · Serving All of Connecticut</text>
</svg>`);

const bg = await sharp(BG)
  .resize({ width: W, height: H, fit: "cover", position: "centre" })
  .toBuffer();

const badge = await sharp(BADGE)
  .resize({ width: BADGE_SIZE, height: BADGE_SIZE, fit: "inside" })
  .toBuffer();

// Vertical layout, roughly centered.
const badgeTop = 80;
const taglineTop = badgeTop + BADGE_SIZE + 30;

await sharp(bg)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: badge, top: badgeTop, left: Math.round((W - BADGE_SIZE) / 2) },
    { input: tagline, top: taglineTop, left: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUT);

console.log(`Wrote ${OUT} (${W}x${H})`);
