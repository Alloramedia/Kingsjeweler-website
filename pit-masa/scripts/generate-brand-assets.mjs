// Generates the Pit & Masa brand logo + icon assets from the two master
// artworks delivered for the rebrand:
//   public/images/Pit and Masa Logo.png        (1000x1000 oval badge)
//   public/images/Pit and Masa Heart Icon.png  (781x1344 heart + taco mark)
//
// Outputs:
//   public/images/pit-masa-badge.webp / .png   — primary site logo
//   src/app/icon.png            (192x192)       — browser/PWA icon (heart)
//   src/app/apple-icon.png      (180x180)       — iOS home-screen icon (heart)
//   src/app/favicon.ico         (16/32/48)      — classic favicon (heart)
//   public/icon-512.png         (512x512)       — large PWA icon (heart)
//
// Run from the pit-masa/ directory: node scripts/generate-brand-assets.mjs
import path from "node:path";
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const SRC_APP = path.resolve("src/app");

const LOGO_SRC = path.join(PUBLIC, "images/Pit and Masa Logo.png");
const HEART_SRC = path.join(PUBLIC, "images/Pit and Masa Heart Icon.png");

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const BRAND_DARK = { r: 28, g: 28, b: 28, alpha: 1 }; // #1C1C1C

/** Fit the source artwork onto a square canvas with padding. */
async function squareIcon(src, size, { background = TRANSPARENT, padding = 0.1 } = {}) {
  const inner = Math.round(size * (1 - padding));
  const resized = await sharp(src)
    .resize(inner, inner, { fit: "contain", background: TRANSPARENT })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png();
}

// ── Primary logo (square oval badge) ───────────────────────────────
await sharp(LOGO_SRC)
  .resize(1000, 1000, { fit: "contain", background: TRANSPARENT })
  .webp({ quality: 92 })
  .toFile(path.join(PUBLIC, "images/pit-masa-badge.webp"));

await sharp(LOGO_SRC)
  .resize(1000, 1000, { fit: "contain", background: TRANSPARENT })
  .png({ compressionLevel: 9 })
  .toFile(path.join(PUBLIC, "images/pit-masa-badge.png"));

// ── Brand icons (heart + taco mark) ────────────────────────────────
await (await squareIcon(HEART_SRC, 192)).toFile(path.join(SRC_APP, "icon.png"));
await (await squareIcon(HEART_SRC, 512)).toFile(path.join(PUBLIC, "icon-512.png"));
await (await squareIcon(HEART_SRC, 180, { background: BRAND_DARK, padding: 0.14 })).toFile(
  path.join(SRC_APP, "apple-icon.png")
);

// ── favicon.ico (PNG-in-ICO container, 16/32/48) ───────────────────
async function buildIco(src, sizes) {
  const pngs = [];
  for (const s of sizes) {
    const buf = await (await squareIcon(src, s, { padding: 0.06 })).toBuffer();
    pngs.push({ size: s, buf });
  }
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  pngs.forEach((p, i) => {
    const b = dir.subarray(i * 16, i * 16 + 16);
    b.writeUInt8(p.size >= 256 ? 0 : p.size, 0); // width
    b.writeUInt8(p.size >= 256 ? 0 : p.size, 1); // height
    b.writeUInt8(0, 2); // palette
    b.writeUInt8(0, 3); // reserved
    b.writeUInt16LE(1, 4); // color planes
    b.writeUInt16LE(32, 6); // bits per pixel
    b.writeUInt32LE(p.buf.length, 8); // data size
    b.writeUInt32LE(offset, 12); // data offset
    offset += p.buf.length;
  });

  return Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]);
}

await writeFile(path.join(SRC_APP, "favicon.ico"), await buildIco(HEART_SRC, [16, 32, 48]));

console.log("Brand assets generated:");
console.log("  images/pit-masa-badge.webp, images/pit-masa-badge.png");
console.log("  src/app/icon.png (192), public/icon-512.png (512), src/app/apple-icon.png (180)");
console.log("  src/app/favicon.ico (16/32/48)");
