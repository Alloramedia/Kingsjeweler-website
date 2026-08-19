// One-off: convert curated Monthly Content Shoot picks into web-ready WebP.
// Run from kings-jeweler/: node scripts/import-monthly-shoot.mjs
import path from "node:path";
import { stat } from "node:fs/promises";
import sharp from "sharp";

const SRC_DIR = path.resolve("..");
const OUT_DIR = path.resolve("public/images/jewelry");
const MAX = 1600;
const QUALITY = 80;

// [shoot photo number, output name] — one strong shot per subject, no near-dupes
const PICKS = [
  [5, 12], [6, 13], [7, 14], [9, 16], [87, 18], [11, 19],
  [2, 20], [48, 23], [50, 24],
  [16, 25], [23, 27], [28, 28], [29, 29],
  [4, 32], [3, 33], [36, 34],
  [41, 35], [55, 37], [24, 38],
  [61, 40], [73, 42],
  [80, 44], [79, 45], [82, 46],
];

let out = 0;
for (const [src, n] of PICKS) {
  const srcPath = path.join(SRC_DIR, `King's Jeweler- Monthly Content Shoot-${src}.jpg`);
  const outPath = path.join(OUT_DIR, `kings-${n}.webp`);
  await sharp(srcPath)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);
  out += (await stat(outPath)).size;
  console.log(`kings-${n}.webp <- #${src}`);
}
console.log(`Total: ${(out / 1024 / 1024).toFixed(1)}MB across ${PICKS.length} images`);
