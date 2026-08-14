// One-off image optimizer: compresses /public/Images- Food originals into
// web-ready WebP files in /public/images/food. Run: node scripts/optimize-photos.mjs
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/Images- Food");
const OUT = path.resolve("public/images/food");
const MAX = 1600; // max edge in px
const QUALITY = 80;

const IMG_RE = /\.(jpe?g|png|webp)$/i;

function pad(n) {
  return String(n).padStart(3, "0");
}

const files = (await readdir(SRC))
  .filter((f) => IMG_RE.test(f) && !f.startsWith("."))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

await mkdir(OUT, { recursive: true });

let srcBytes = 0;
let outBytes = 0;
const landscape = [];
const portrait = [];
let i = 0;

for (const file of files) {
  i += 1;
  const srcPath = path.join(SRC, file);
  const outName = `food-${pad(i)}.webp`;
  const outPath = path.join(OUT, outName);

  srcBytes += (await stat(srcPath)).size;

  const img = sharp(srcPath).rotate(); // respect EXIF orientation
  const meta = await img.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  await img
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);

  outBytes += (await stat(outPath)).size;

  const entry = { name: outName, w, h };
  if (w >= h) landscape.push(entry);
  else portrait.push(entry);
}

const mb = (b) => (b / 1024 / 1024).toFixed(1) + "MB";
console.log(`Processed ${files.length} images`);
console.log(`Source: ${mb(srcBytes)}  ->  Output: ${mb(outBytes)}`);
console.log(`\nLANDSCAPE (${landscape.length}) — hero candidates:`);
landscape.forEach((e) => console.log(`  ${e.name}  ${e.w}x${e.h}`));
console.log(`\nPORTRAIT (${portrait.length}) — first 12:`);
portrait.slice(0, 12).forEach((e) => console.log(`  ${e.name}  ${e.w}x${e.h}`));
