/**
 * Import the real King's Jeweler wordmark logo and regenerate brand assets:
 *   - public/images/kings-jeweler-logo.png/.webp   (full wordmark)
 *   - public/images/kings-jeweler-badge.png/.webp  (square crown crop for tight spots)
 *   - public/icon.png, public/icon-512.png, public/apple-icon.png (crown on navy)
 *   - public/og-image.jpg                          (wordmark on navy)
 *
 * Usage: node scripts/import-logo.mjs "/path/to/logo.png"
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error("Pass the path to the logo PNG");
  process.exit(1);
}

const pub = path.join(process.cwd(), "public");
const img = path.join(pub, "images");
const NAVY = { r: 20, g: 20, b: 26, alpha: 1 }; // #14141A

const meta = await sharp(src).metadata();
console.log(`Source: ${meta.width}x${meta.height}`);

// ── Full wordmark, trimmed ──
const trimmed = await sharp(src).trim().toBuffer();
const tMeta = await sharp(trimmed).metadata();

await sharp(trimmed)
  .resize({ width: 1600, withoutEnlargement: true })
  .png()
  .toFile(path.join(img, "kings-jeweler-logo.png"));
await sharp(trimmed)
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 90 })
  .toFile(path.join(img, "kings-jeweler-logo.webp"));
console.log("wrote kings-jeweler-logo.png/.webp");

// ── Crown crop (top-center of the trimmed wordmark) for square badge/icons ──
// The crown sits roughly in the middle 30% horizontally, top 53% vertically.
const cw = Math.round(tMeta.width * 0.3);
const ch = Math.round(tMeta.height * 0.53);
const cx = Math.round((tMeta.width - cw) / 2);
const crown = await sharp(trimmed)
  .extract({ left: cx, top: 0, width: cw, height: ch })
  .trim()
  .toBuffer();

// Square badge with padding, transparent background
const badge = await sharp(crown)
  .resize(840, 840, { fit: "inside" })
  .extend({
    top: 80, bottom: 80, left: 80, right: 80,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .resize(1000, 1000, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
await sharp(badge).png().toFile(path.join(img, "kings-jeweler-badge.png"));
await sharp(badge).webp({ quality: 90 }).toFile(path.join(img, "kings-jeweler-badge.webp"));
console.log("wrote kings-jeweler-badge.png/.webp (crown)");

// ── Icons: crown centered on navy square ──
async function icon(size, file) {
  const mark = await sharp(crown)
    .resize(Math.round(size * 0.78), Math.round(size * 0.78), { fit: "inside" })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: NAVY } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(path.join(pub, file));
  console.log(`wrote ${file}`);
}
await icon(512, "icon-512.png");
await icon(180, "apple-icon.png");
await icon(96, "icon.png");

// ── OG image: wordmark centered on navy 1200x630 ──
const ogMark = await sharp(trimmed)
  .resize(880, 420, { fit: "inside" })
  .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: NAVY } })
  .composite([{ input: ogMark, gravity: "center" }])
  .jpeg({ quality: 88 })
  .toFile(path.join(pub, "og-image.jpg"));
console.log("wrote og-image.jpg");
