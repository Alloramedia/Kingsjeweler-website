// Generates the diamond-plate texture used by the `.metal-texture` class on the
// site's dark sections (footer, catering, gallery, home bands).
//
// Source: public/images/Steel_.png (4000x4000 master). We DON'T tile it — the
// repeat is too obvious — so we just down-res the full frame to a web-friendly
// size and let CSS render it once with `background-size: cover`.
//
// Run: node scripts/generate-metal-texture.mjs
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const SRC = path.join(PUBLIC, "images/Steel_.png");
const OUT = path.join(PUBLIC, "images/diamond-plate.webp");

const SIZE = 1600; // full-frame, down-res'd for the web

await sharp(SRC)
  .resize(SIZE, SIZE, { fit: "cover" })
  .webp({ quality: 72 })
  .toFile(OUT);

const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${SIZE}px, ${kb} KB)`);
