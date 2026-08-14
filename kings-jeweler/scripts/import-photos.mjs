/**
 * Import real store photos (small 141px thumbnails) into the site library.
 * Upscales 4x with lanczos3 + gentle sharpen, writes WebP to public/images/jewelry.
 *
 * Usage: node scripts/import-photos.mjs /path/to/dir-with-kingsN.jpg
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const srcDir = process.argv[2] || "../";
const outDir = path.join(process.cwd(), "public", "images", "jewelry");

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /^kings\d+\.jpe?g$/i.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

if (!files.length) {
  console.error("No kingsN.jpg files found in", srcDir);
  process.exit(1);
}

for (const f of files) {
  const n = String(parseInt(f.match(/\d+/)[0])).padStart(2, "0");
  const img = sharp(path.join(srcDir, f));
  const { width, height } = await img.metadata();
  await img
    .resize(width * 4, height * 4, { kernel: "lanczos3" })
    .sharpen({ sigma: 1.2, m1: 0.6, m2: 0.4 })
    .webp({ quality: 82 })
    .toFile(path.join(outDir, `kings-${n}.webp`));
  console.log(`kings-${n}.webp  (${width * 4}x${height * 4})`);
}
