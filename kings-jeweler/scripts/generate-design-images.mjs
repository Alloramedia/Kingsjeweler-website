// One-time generator for the design builder's style reference images.
// Produces /public/images/design/{piece}-{style-slug}.webp — static assets,
// no runtime AI anywhere on the site.
//
// Two ways to use it:
//   1. Print the shot list (no key needed), generate images yourself in
//      ChatGPT / any image tool, and save them under the printed filenames:
//        node scripts/generate-design-images.mjs --prompts
//   2. Batch-generate everything in one run (key used once, locally only):
//        OPENAI_API_KEY=sk-... node scripts/generate-design-images.mjs
//
// Already-existing files are skipped, so you can re-run to fill gaps or
// delete a file you don't like and regenerate just that one.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public/images/design");
const SIZE = 800; // final webp width/height
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
const QUALITY = process.env.OPENAI_IMAGE_QUALITY || "medium";

/* Shot list — piece, style value (must match src/lib/builder.ts), subject. */
const SHOTS = [
  // Rings
  ["ring", "Solitaire engagement ring", "a 14K yellow gold solitaire engagement ring with a single prong-set round brilliant diamond on a slim polished band"],
  ["ring", "Halo engagement ring", "a 14K yellow gold halo engagement ring, round brilliant center diamond encircled by a ring of small pave diamonds"],
  ["ring", "Three-stone ring", "a 14K yellow gold three-stone diamond ring, a larger round center diamond flanked by two smaller round diamonds"],
  ["ring", "Wedding or stacking band", "a classic 14K yellow gold wedding band with a smooth high-polish finish, slightly domed profile"],
  ["ring", "Eternity band", "a 14K yellow gold eternity band channel-set with a continuous row of round diamonds around the entire band"],
  ["ring", "Signet ring", "a men's 14K yellow gold signet ring with a flat polished oval face engraved with a serif letter K"],
  ["ring", "Statement / cluster ring", "a bold 14K yellow gold statement cluster ring with a dome of closely set round diamonds"],
  ["ring", "Not sure yet", "three assorted 14K yellow gold rings leaning together: a solitaire, a plain band, and a diamond cluster ring"],
  // Necklaces
  ["necklace", "Cuban link chain", "a 14K yellow gold Miami Cuban link chain necklace with tightly interlocking flat bevelled links, draped in a gentle curve"],
  ["necklace", "Rope chain", "a 14K yellow gold rope chain necklace with a tightly twisted spiral pattern, draped in a gentle curve"],
  ["necklace", "Figaro chain", "a 14K yellow gold figaro chain necklace with a repeating pattern of three short round links followed by one elongated oval link, draped in a gentle curve"],
  ["necklace", "Franco chain", "a 14K yellow gold franco chain necklace with a dense square four-sided V-weave link pattern, draped in a gentle curve"],
  ["necklace", "Tennis necklace", "a diamond tennis necklace in 14K white gold, a continuous line of identical prong-set round brilliant diamonds, draped in a gentle curve"],
  ["necklace", "Pendant with chain", "a 14K yellow gold necklace with a small round diamond pendant hanging from a fine cable chain"],
  ["necklace", "Custom nameplate", "a 14K yellow gold script nameplate necklace reading \"Maria\" in flowing cursive letters on a fine cable chain"],
  ["necklace", "Not sure yet", "three 14K yellow gold chain necklaces of different link styles laid side by side"],
  // Bracelets
  ["bracelet", "Cuban link bracelet", "a 14K yellow gold Miami Cuban link bracelet with tightly interlocking flat bevelled links, coiled in a loose circle"],
  ["bracelet", "Tennis bracelet", "a diamond tennis bracelet in 14K white gold, a continuous flexible line of identical prong-set round diamonds, coiled in a loose circle"],
  ["bracelet", "Bangle", "a rigid 14K yellow gold bangle bracelet with a clean rounded high-polish profile"],
  ["bracelet", "Rope bracelet", "a 14K yellow gold rope bracelet with a tightly twisted spiral pattern, coiled in a loose circle"],
  ["bracelet", "Charm bracelet", "a 14K yellow gold charm bracelet, a cable chain carrying a small heart charm, a round disc charm, and a star charm"],
  ["bracelet", "ID bracelet", "a 14K yellow gold ID bracelet with a curved polished plate engraved \"Alex\" on a Cuban link chain"],
  ["bracelet", "Not sure yet", "three 14K yellow gold bracelets of different styles laid side by side"],
  // Charms
  ["charm", "Initial / letter", "a 14K yellow gold single letter initial pendant charm shaped as a bold serif letter A with a bail on top"],
  ["charm", "Cross / religious", "a 14K yellow gold cross pendant charm with clean bevelled edges and a bail on top"],
  ["charm", "Nameplate", "a 14K yellow gold nameplate pendant engraved \"Maria\" in flowing script on a polished plate with a bail"],
  ["charm", "Sports / team", "a 14K yellow gold pendant charm shaped like a basketball with engraved seams and a bail on top"],
  ["charm", "Animal / symbol", "a 14K yellow gold lion head pendant charm with detailed mane and a bail on top"],
  ["charm", "Photo / memorial", "a rectangular 14K yellow gold photo-engraved memorial pendant with a laser-engraved portrait area and a bail on top"],
  ["charm", "Custom shape — my own idea", "a jeweler's sketchbook page with a pencil drawing of a unique custom pendant next to a finished 14K yellow gold pendant"],
  ["charm", "Not sure yet", "an assortment of small 14K yellow gold pendant charms: a letter, a cross, and a heart, laid side by side"],
];

const SCENE =
  "Professional macro jewelry product photograph, shot on a seamless warm cream studio background " +
  "with soft diffused lighting and a gentle contact shadow, shallow depth of field, ultra realistic, " +
  "extremely detailed, luxury jewelry advertising photography, centered composition with generous " +
  "negative space. No hands, no people, no text, no watermarks, no logos, no props.";

function slug(piece, style) {
  return `${piece}-${style.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
}

const shots = SHOTS.map(([piece, style, subject]) => ({
  piece,
  style,
  file: `${slug(piece, style)}.webp`,
  prompt: `${SCENE.replace("Professional macro jewelry product photograph", `Professional macro jewelry product photograph of ${subject}`)}`,
}));

if (process.argv.includes("--prompts")) {
  for (const s of shots) {
    console.log(`── ${s.file}`);
    console.log(`${s.prompt}\n`);
  }
  console.log(`${shots.length} shots. Save finished images as public/images/design/<filename> (square, ~${SIZE}px).`);
  process.exit(0);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Set OPENAI_API_KEY for batch generation, or run with --prompts to print the shot list.");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let done = 0;
let skipped = 0;

for (const s of shots) {
  const out = path.join(OUT_DIR, s.file);
  if (fs.existsSync(out)) {
    skipped++;
    continue;
  }
  process.stdout.write(`Rendering ${s.file} ... `);
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: MODEL, prompt: s.prompt, n: 1, size: "1024x1024", quality: QUALITY }),
    });
    if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
    const json = await res.json();
    const b64 = json?.data?.[0]?.b64_json;
    if (!b64) throw new Error("no image in response");
    await sharp(Buffer.from(b64, "base64"))
      .resize(SIZE, SIZE, { fit: "cover" })
      .webp({ quality: 82 })
      .toFile(out);
    done++;
    console.log("ok");
  } catch (err) {
    console.log(`FAILED (${err.message})`);
  }
}

console.log(`\nDone: ${done} generated, ${skipped} already existed, ${shots.length - done - skipped} failed.`);
