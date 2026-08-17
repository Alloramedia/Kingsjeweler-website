// Generates the social share image at /public/og-image.jpg (1200x630).
// Centers the full King's Jeweler logo (crest + wordmark) on the brand
// dark background. Run: node scripts/generate-og-image.mjs <path-to-full-logo>
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const W = 1200;
const H = 630;

// Full logo source (crest + KINGS JEWELER wordmark, transparent background)
const SRC = process.argv[2] ?? path.resolve("../Kj logo.PNG");
const OUT = path.join(PUBLIC, "og-image.jpg");

const DARK = { r: 0x14, g: 0x14, b: 0x1a }; // brand "dark" #14141A

const logo = await sharp(SRC)
  .trim()
  .resize({ height: 470, kernel: "lanczos3" })
  .png()
  .toBuffer();
const { width: lw, height: lh } = await sharp(logo).metadata();

await sharp({ create: { width: W, height: H, channels: 3, background: DARK } })
  .composite([{ input: logo, left: Math.round((W - lw) / 2), top: Math.round((H - lh) / 2) }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(OUT);

console.log(`Wrote ${OUT} (${W}x${H})`);
