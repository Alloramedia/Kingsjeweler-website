/**
 * Generates placeholder brand assets for Kings Jeweler until real
 * photography/logo files are supplied. Run: node scripts/generate-kings-assets.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMG = path.join(ROOT, "public/images");
const JEWEL = path.join(IMG, "jewelry");
mkdirSync(JEWEL, { recursive: true });

const GOLD = "#C9A961";
const GOLD_DEEP = "#8A6D2F";
const NAVY = "#1F3A5F";
const INK = "#14141A";

/** A few sparkle "diamond" glints scattered around. */
function sparkles(seed, w, h, count = 14) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 1 + rand() * 3.2;
    const o = 0.25 + rand() * 0.55;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="white" opacity="${o.toFixed(2)}"/>`;
    if (rand() > 0.5) {
      out += `<path d="M ${x} ${y - r * 4} L ${x + r} ${y} L ${x} ${y + r * 4} L ${x - r} ${y} Z" fill="white" opacity="${(o * 0.5).toFixed(2)}"/>`;
    }
  }
  return out;
}

const crownPath = (x, y, s, fill) => `
  <g transform="translate(${x},${y}) scale(${s})" fill="${fill}">
    <path d="M6 58 L14 20 L34 42 L50 8 L66 42 L86 20 L94 58 Z"/>
    <rect x="8" y="63" width="84" height="9" rx="3"/>
    <circle cx="14" cy="16" r="5"/>
    <circle cx="50" cy="5" r="5"/>
    <circle cx="86" cy="16" r="5"/>
  </g>`;

function scene(w, h, seed, { hueA = INK, hueB = NAVY, glow = GOLD, withCrown = false } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${hueA}"/>
        <stop offset="1" stop-color="${hueB}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.42" r="0.75">
        <stop offset="0" stop-color="${glow}" stop-opacity="0.55"/>
        <stop offset="0.55" stop-color="${glow}" stop-opacity="0.12"/>
        <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    ${sparkles(seed, w, h)}
    ${withCrown ? crownPath(w / 2 - 50, h / 2 - 42, 1, "rgba(255,255,255,0.9)") : ""}
  </svg>`;
}

async function writeWebp(svg, file, quality = 82) {
  await sharp(Buffer.from(svg)).webp({ quality }).toFile(file);
  console.log("wrote", path.relative(ROOT, file));
}
async function writePng(svg, file) {
  await sharp(Buffer.from(svg)).png().toFile(file);
  console.log("wrote", path.relative(ROOT, file));
}

/* ── Placeholder "photography" ─────────────────────────────── */
const variants = [
  { hueA: INK, hueB: NAVY },
  { hueA: NAVY, hueB: INK },
  { hueA: "#221F26", hueB: "#3A2F1B", glow: "#E8D5A4" },
  { hueA: "#101820", hueB: "#2C3E50" },
  { hueA: "#1B1B22", hueB: "#4A3B18", glow: "#D4B36A" },
  { hueA: "#0F1B2D", hueB: "#233A57" },
];
for (let i = 1; i <= 12; i++) {
  const v = variants[(i - 1) % variants.length];
  await writeWebp(
    scene(1600, 1200, i * 97 + 11, v),
    path.join(JEWEL, `jewel-${String(i).padStart(2, "0")}.webp`),
  );
}

/* ── Logo / badge ──────────────────────────────────────────── */
const badge = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <circle cx="256" cy="256" r="244" fill="${INK}" stroke="${GOLD}" stroke-width="10"/>
  <circle cx="256" cy="256" r="214" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.6"/>
  ${crownPath(156, 130, 2, GOLD)}
  <text x="256" y="356" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="52" fill="${GOLD}" letter-spacing="6">KINGS</text>
  <text x="256" y="408" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#F5EFE2" letter-spacing="8">JEWELER</text>
</svg>`;
await writeWebp(badge, path.join(IMG, "kings-jeweler-badge.webp"), 95);
await writePng(badge, path.join(IMG, "kings-jeweler-badge.png"));

/* ── OG image ──────────────────────────────────────────────── */
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${INK}"/>
      <stop offset="1" stop-color="${NAVY}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.4" r="0.8">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.4"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${sparkles(42, 1200, 630, 20)}
  ${crownPath(550, 120, 1.1, GOLD)}
  <text x="600" y="360" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="86" fill="${GOLD}" letter-spacing="14">KINGS JEWELER</text>
  <text x="600" y="430" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#F5EFE2" letter-spacing="6">THE SHOPPES AT BUCKLAND HILLS · MANCHESTER, CT</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 90 }).toFile(path.join(ROOT, "public/og-image.jpg"));
console.log("wrote public/og-image.jpg");

/* ── App icons ─────────────────────────────────────────────── */
const icon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${INK}"/>
  ${crownPath(size * 0.15, size * 0.22, size / 145, GOLD)}
</svg>`;
await writePng(icon(192), path.join(ROOT, "public/icon.png"));
await writePng(icon(512), path.join(ROOT, "public/icon-512.png"));
await writePng(icon(180), path.join(ROOT, "public/apple-icon.png"));

console.log("done — placeholders only; replace with real Kings Jeweler assets.");
void GOLD_DEEP;
