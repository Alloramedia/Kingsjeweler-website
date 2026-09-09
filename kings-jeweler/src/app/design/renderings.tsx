"use client";

/**
 * Parametric SVG renderings for the design builder — "polished metal" pass.
 * Realism comes from layered light: multi-stop metal gradients, specular
 * highlight arcs, ambient shadows, faceted gems with radial depth and glints.
 */

import { useId } from "react";
import { STONE_NONE, type PieceType } from "@/lib/builder";

/* ── Palettes ─────────────────────────────────────────────── */

export interface MetalPalette {
  base: string;
  light: string;
  dark: string;
  deep: string;
  /** Second tone for two-tone pieces. */
  alt?: MetalPalette;
}

const YELLOW: MetalPalette = { base: "#D2A93F", light: "#F6E3A4", dark: "#A87914", deep: "#7A5407" };
const WHITE: MetalPalette = { base: "#C9CDD3", light: "#F4F6F8", dark: "#949AA3", deep: "#6C737D" };

export const METAL_PALETTES: Record<string, MetalPalette> = {
  "Yellow gold": YELLOW,
  "White gold": WHITE,
  "Rose gold": { base: "#D89F87", light: "#F7D9C9", dark: "#B06E52", deep: "#84492F" },
  "Two-tone": { ...YELLOW, alt: WHITE },
  "Platinum": { base: "#BEC4CB", light: "#EFF2F5", dark: "#8B939D", deep: "#646C77" },
  "Sterling silver": { base: "#C6CACF", light: "#F3F5F7", dark: "#8F959C", deep: "#686E76" },
};

/** Neutral champagne used before a metal is chosen (or "Not sure yet"). */
const NEUTRAL_METAL: MetalPalette = { base: "#CDBC90", light: "#EFE5C8", dark: "#A08D5D", deep: "#786740" };

/** Karat shifts the gold tone: lower karat is paler, higher is richer. */
const KARAT_YELLOW: Record<string, MetalPalette> = {
  "10K": { base: "#DBBE68", light: "#F8EBB9", dark: "#B28F3B", deep: "#836517" },
  "14K": YELLOW,
  "18K": { base: "#CB9827", light: "#F2D883", dark: "#9C7008", deep: "#714F03" },
};

export function resolveMetal(metal: string, karat?: string): MetalPalette {
  const p = METAL_PALETTES[metal];
  if (!p) return NEUTRAL_METAL;
  if (metal === "Yellow gold" && karat && KARAT_YELLOW[karat]) return KARAT_YELLOW[karat];
  return p;
}

export interface StonePalette {
  hi: string;
  base: string;
  deep: string;
  line: string;
}

export const STONE_PALETTES: Record<string, StonePalette> = {
  "Natural diamonds": { hi: "#FFFFFF", base: "#EDF3F7", deep: "#A5BECD", line: "#7E99A8" },
  "Lab-grown diamonds": { hi: "#FFFFFF", base: "#EAF4F0", deep: "#9CC2B5", line: "#74998D" },
  "Moissanite": { hi: "#FFFFFF", base: "#EFEBFA", deep: "#AFA1D4", line: "#8578AC" },
  "Colored gemstone (sapphire, ruby, emerald...)": { hi: "#9FC2EE", base: "#3D6CB4", deep: "#1B3560", line: "#142848" },
  "Birthstone": { hi: "#D2B5EE", base: "#8A5CB4", deep: "#49296B", line: "#361E50" },
};

const NEUTRAL_STONE: StonePalette = { hi: "#FFFFFF", base: "#EFF3F5", deep: "#B7C5CE", line: "#90A2AD" };
/** Faint outline used when a style needs stones but "metal only" was chosen. */
const GHOST_STONE: StonePalette = { hi: "#FDFCF8", base: "#F4F1E8", deep: "#DCD5C1", line: "#C2BAA2" };

export function resolveStone(stones: string): StonePalette {
  return STONE_PALETTES[stones] ?? NEUTRAL_STONE;
}

/* ── Geometry helpers ─────────────────────────────────────── */

interface Pt {
  x: number;
  y: number;
  /** Tangent angle in degrees. */
  a: number;
}

function quadPoints(
  x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, n: number,
): Pt[] {
  // Dense presample, then pick points at equal arc-length intervals so
  // links stay evenly spaced along the whole drape (uniform-t bunches
  // in the middle of a quadratic).
  const M = 160;
  const xs: number[] = [];
  const ys: number[] = [];
  const cum: number[] = [0];
  for (let i = 0; i <= M; i++) {
    const t = i / M;
    const u = 1 - t;
    xs.push(u * u * x0 + 2 * u * t * cx + t * t * x1);
    ys.push(u * u * y0 + 2 * u * t * cy + t * t * y1);
    if (i > 0) cum.push(cum[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]));
  }
  const total = cum[M];
  const pts: Pt[] = [];
  let i = 1;
  for (let k = 0; k < n; k++) {
    const target = (n === 1 ? 0.5 : k / (n - 1)) * total;
    while (i < M && cum[i] < target) i++;
    pts.push({
      x: xs[i],
      y: ys[i],
      a: (Math.atan2(ys[i] - ys[i - 1], xs[i] - xs[i - 1]) * 180) / Math.PI,
    });
  }
  return pts;
}

function ellipsePoints(
  cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n: number, endpoint = true,
): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = a0 + ((a1 - a0) * i) / (endpoint ? Math.max(n - 1, 1) : n);
    const rad = (t * Math.PI) / 180;
    pts.push({
      x: cx + rx * Math.cos(rad),
      y: cy + ry * Math.sin(rad),
      a: (Math.atan2(ry * Math.cos(rad), -rx * Math.sin(rad)) * 180) / Math.PI,
    });
  }
  return pts;
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  return ellipseArcPath(cx, cy, r, r, a0, a1);
}

function ellipseArcPath(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): string {
  const pt = (a: number) => {
    const rad = (a * Math.PI) / 180;
    return `${cx + rx * Math.cos(rad)} ${cy + ry * Math.sin(rad)}`;
  };
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${pt(a0)} A ${rx} ${ry} 0 ${large} 1 ${pt(a1)}`;
}

/* ── Shared defs: metal gradients + blur filters ──────────── */

interface ArtDefs {
  defs: React.ReactNode;
  /** Directional band gradient (polished cylinder look). */
  band: string;
  /** Radial gradient for plates and discs. */
  plate: string;
  /** Alternate metal (two-tone). */
  alt: string;
  altPlate: string;
  /** Soft blur filter for shadows. */
  blur: string;
  /** Tighter blur for highlights. */
  gleam: string;
}

function useArtDefs(metal: MetalPalette): ArtDefs {
  const uid = useId().replace(/[:]/g, "");
  const bandId = `b${uid}`;
  const plateId = `p${uid}`;
  const altId = `a${uid}`;
  const altPlateId = `ap${uid}`;
  const blurId = `bl${uid}`;
  const gleamId = `gl${uid}`;
  const stops = (m: MetalPalette) => (
    <>
      <stop offset="0" stopColor={m.deep} />
      <stop offset="0.2" stopColor={m.base} />
      <stop offset="0.42" stopColor={m.light} />
      <stop offset="0.62" stopColor={m.base} />
      <stop offset="0.85" stopColor={m.dark} />
      <stop offset="1" stopColor={m.deep} />
    </>
  );
  const plateStops = (m: MetalPalette) => (
    <>
      <stop offset="0" stopColor={m.light} />
      <stop offset="0.55" stopColor={m.base} />
      <stop offset="1" stopColor={m.dark} />
    </>
  );
  const defs = (
    <defs>
      <linearGradient id={bandId} x1="0" y1="0" x2="0.9" y2="1">{stops(metal)}</linearGradient>
      <radialGradient id={plateId} cx="0.32" cy="0.25" r="1">{plateStops(metal)}</radialGradient>
      {metal.alt && (
        <>
          <linearGradient id={altId} x1="0" y1="0" x2="0.9" y2="1">{stops(metal.alt)}</linearGradient>
          <radialGradient id={altPlateId} cx="0.32" cy="0.25" r="1">{plateStops(metal.alt)}</radialGradient>
        </>
      )}
      <filter id={blurId} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.6" />
      </filter>
      <filter id={gleamId} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="0.9" />
      </filter>
    </defs>
  );
  return {
    defs,
    band: `url(#${bandId})`,
    plate: `url(#${plateId})`,
    alt: metal.alt ? `url(#${altId})` : `url(#${bandId})`,
    altPlate: metal.alt ? `url(#${altPlateId})` : `url(#${plateId})`,
    blur: `url(#${blurId})`,
    gleam: `url(#${gleamId})`,
  };
}

/** Soft ground shadow under a piece. */
function GroundShadow({ cx, cy, rx, blur }: { cx: number; cy: number; rx: number; blur: string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.14} fill="#14141A" opacity="0.13" filter={blur} />;
}

/* ── Gem shapes ───────────────────────────────────────────── */

function gemPath(shape: string, w: number, h: number): string {
  const w2 = w / 2;
  const h2 = h / 2;
  switch (shape) {
    case "Oval":
      return `M 0 ${-h2} C ${w2 * 0.72} ${-h2}, ${w2 * 0.72} ${h2}, 0 ${h2} C ${-w2 * 0.72} ${h2}, ${-w2 * 0.72} ${-h2}, 0 ${-h2} Z`;
    case "Princess (square)":
      return `M ${-w2} ${-w2} H ${w2} V ${w2} H ${-w2} Z`;
    case "Cushion": {
      const r = w2 * 0.55;
      return `M ${-w2 + r} ${-w2} H ${w2 - r} Q ${w2} ${-w2}, ${w2} ${-w2 + r} V ${w2 - r} Q ${w2} ${w2}, ${w2 - r} ${w2} H ${-w2 + r} Q ${-w2} ${w2}, ${-w2} ${w2 - r} V ${-w2 + r} Q ${-w2} ${-w2}, ${-w2 + r} ${-w2} Z`;
    }
    case "Emerald cut": {
      const c = w2 * 0.32;
      return `M ${-w2 + c} ${-h2} H ${w2 - c} L ${w2} ${-h2 + c} V ${h2 - c} L ${w2 - c} ${h2} H ${-w2 + c} L ${-w2} ${h2 - c} V ${-h2 + c} Z`;
    }
    case "Pear":
      return `M 0 ${-h2} C ${w2 * 0.7} ${-h2 * 0.45}, ${w2} ${h2 * 0.05}, ${w2 * 0.62} ${h2 * 0.55} C ${w2 * 0.35} ${h2 * 0.95}, ${w2 * 0.28} ${h2}, 0 ${h2} C ${-w2 * 0.28} ${h2}, ${-w2 * 0.35} ${h2 * 0.95}, ${-w2 * 0.62} ${h2 * 0.55} C ${-w2} ${h2 * 0.05}, ${-w2 * 0.7} ${-h2 * 0.45}, 0 ${-h2} Z`;
    case "Marquise":
      return `M 0 ${-h2} C ${w2 * 1.1} ${-h2 * 0.35}, ${w2 * 1.1} ${h2 * 0.35}, 0 ${h2} C ${-w2 * 1.1} ${h2 * 0.35}, ${-w2 * 1.1} ${-h2 * 0.35}, 0 ${-h2} Z`;
    case "Radiant": {
      const c = w2 * 0.4;
      return `M ${-w2 + c} ${-h2} H ${w2 - c} L ${w2} ${-h2 + c} V ${h2 - c} L ${w2 - c} ${h2} H ${-w2 + c} L ${-w2} ${h2 - c} V ${-h2 + c} Z`;
    }
    case "Heart":
      return `M 0 ${h2} C ${-w2 * 1.15} ${h2 * 0.05}, ${-w2 * 0.85} ${-h2}, 0 ${-h2 * 0.35} C ${w2 * 0.85} ${-h2}, ${w2 * 1.15} ${h2 * 0.05}, 0 ${h2} Z`;
    case "Round":
    default:
      return `M 0 ${-h2} A ${w2} ${h2} 0 1 1 0 ${h2} A ${w2} ${h2} 0 1 1 0 ${-h2} Z`;
  }
}

/** Per-shape aspect ratio (height relative to width). */
function gemAspect(shape: string): number {
  switch (shape) {
    case "Oval": return 1.35;
    case "Emerald cut": return 1.3;
    case "Pear": return 1.4;
    case "Marquise": return 1.9;
    case "Radiant": return 1.2;
    default: return 1;
  }
}

const STEP_CUTS = new Set(["Emerald cut", "Radiant", "Princess (square)"]);

/**
 * A faceted gem. Brilliant cuts get radial crown facets; step cuts get
 * concentric tiers. Every gem gets a radial depth gradient and a glint.
 */
export function Gem({
  shape = "Round",
  cx = 0,
  cy = 0,
  w = 20,
  colors,
  rotate = 0,
  facets = true,
}: {
  shape?: string;
  cx?: number;
  cy?: number;
  w?: number;
  colors: StonePalette;
  rotate?: number;
  facets?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const s = shape === "No preference" || !shape ? "Round" : shape;
  const h = w * gemAspect(s);
  const d = gemPath(s, w, h);
  const step = STEP_CUTS.has(s);
  const rays = 8;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <defs>
        <radialGradient id={`g${uid}`} cx="0.42" cy="0.32" r="0.85">
          {w < 12 ? (
            <>
              {/* Small stones need more edge contrast to read as cut gems */}
              <stop offset="0" stopColor={colors.hi} />
              <stop offset="0.3" stopColor={colors.base} />
              <stop offset="0.75" stopColor={colors.deep} />
              <stop offset="1" stopColor={colors.line} />
            </>
          ) : (
            <>
              <stop offset="0" stopColor={colors.hi} />
              <stop offset="0.4" stopColor={colors.base} />
              <stop offset="1" stopColor={colors.deep} />
            </>
          )}
        </radialGradient>
      </defs>
      {/* Bezel shadow seats the stone in the metal */}
      <path d={d} fill="#14141A" opacity="0.28" transform={`translate(${w * 0.045} ${w * 0.075}) scale(1.05)`} />
      <path d={d} fill={`url(#g${uid})`} stroke={colors.line} strokeWidth={Math.max(w * 0.035, 0.5)} strokeLinejoin="round" />
      {facets && w > 9 && (
        <>
          {step ? (
            <>
              <path d={d} fill="none" stroke={colors.hi} strokeWidth="0.8" opacity="0.75" transform="scale(0.72)" />
              <path d={d} fill="none" stroke={colors.deep} strokeWidth="0.7" opacity="0.6" transform="scale(0.46)" />
              <path
                d={`M ${-w / 2} ${-h / 2} L ${-w * 0.23} ${-h * 0.23} M ${w / 2} ${-h / 2} L ${w * 0.23} ${-h * 0.23} M ${w / 2} ${h / 2} L ${w * 0.23} ${h * 0.23} M ${-w / 2} ${h / 2} L ${-w * 0.23} ${h * 0.23}`}
                stroke={colors.deep} strokeWidth="0.6" opacity="0.5"
              />
            </>
          ) : (
            <>
              {/* Table */}
              <path d={d} fill={colors.hi} opacity="0.22" transform="scale(0.48)" />
              <path d={d} fill="none" stroke={colors.hi} strokeWidth="0.8" opacity="0.8" transform="scale(0.48)" />
              {/* Crown facet rays */}
              {Array.from({ length: rays }, (_, i) => {
                const a = (i * 360) / rays + 22.5;
                const rad = (a * Math.PI) / 180;
                const ex = Math.cos(rad) * (w / 2) * 0.96;
                const ey = Math.sin(rad) * (h / 2) * 0.96;
                return (
                  <line
                    key={i}
                    x1={Math.cos(rad) * (w / 2) * 0.48}
                    y1={Math.sin(rad) * (h / 2) * 0.48}
                    x2={ex}
                    y2={ey}
                    stroke={i % 2 ? colors.deep : colors.hi}
                    strokeWidth="0.75"
                    opacity={i % 2 ? 0.55 : 0.85}
                  />
                );
              })}
            </>
          )}
        </>
      )}
      {/* Small stones still sparkle: a fine facet cross */}
      {!facets && w > 3.5 && (
        <>
          <path
            d={`M 0 ${-h * 0.34} V ${h * 0.34} M ${-w * 0.34} 0 H ${w * 0.34}`}
            stroke={colors.deep} strokeWidth={Math.max(w * 0.045, 0.45)} opacity="0.5"
          />
          <path
            d={`M 0 ${-h * 0.34} V ${h * 0.34} M ${-w * 0.34} 0 H ${w * 0.34}`}
            stroke={colors.hi} strokeWidth={Math.max(w * 0.04, 0.4)} opacity="0.85" transform="rotate(45)"
          />
        </>
      )}
      {/* Specular glints */}
      {w > 6 && (
        <>
          <circle cx={-w * 0.17} cy={-h * 0.23} r={Math.max(w * 0.055, 0.6)} fill="#FFFFFF" opacity="0.95" />
          <circle cx={w * 0.21} cy={h * 0.14} r={Math.max(w * 0.032, 0.45)} fill="#FFFFFF" opacity="0.55" />
        </>
      )}
    </g>
  );
}

function Sparkle({ cx, cy, s, color, opacity = 0.85 }: { cx: number; cy: number; s: number; color: string; opacity?: number }) {
  const k = s * 0.16;
  return (
    <g opacity={opacity}>
      <path
        d={`M ${cx} ${cy - s} C ${cx + k * 0.4} ${cy - k}, ${cx + k} ${cy - k * 0.4}, ${cx + s} ${cy} C ${cx + k} ${cy + k * 0.4}, ${cx + k * 0.4} ${cy + k}, ${cx} ${cy + s} C ${cx - k * 0.4} ${cy + k}, ${cx - k} ${cy + k * 0.4}, ${cx - s} ${cy} C ${cx - k} ${cy - k * 0.4}, ${cx - k * 0.4} ${cy - k}, ${cx} ${cy - s} Z`}
        fill={color}
      />
      <circle cx={cx} cy={cy} r={s * 0.14} fill="#FFFFFF" />
    </g>
  );
}

/* ── Metal building blocks ────────────────────────────────── */

/** A torus link (ellipse with a hole) with sheen — the unit of every chain. */
function Link({
  x, y, rx, ry, angle, fill, deep,
}: {
  x: number; y: number; rx: number; ry: number; angle: number; fill: string; deep: string;
}) {
  const t = ry * 0.55; // tube thickness
  const hx = x - rx * 0.38;
  const hy = y - ry + t / 2;
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <ellipse cx={x + 0.8} cy={y + 1.4} rx={rx} ry={ry} fill="#14141A" opacity="0.16" />
      <path
        d={`M ${x - rx} ${y} A ${rx} ${ry} 0 1 1 ${x + rx} ${y} A ${rx} ${ry} 0 1 1 ${x - rx} ${y} Z
            M ${x - rx + t} ${y} A ${rx - t} ${ry - t} 0 1 0 ${x + rx - t} ${y} A ${rx - t} ${ry - t} 0 1 0 ${x - rx + t} ${y} Z`}
        fill={fill}
        fillRule="evenodd"
        stroke={deep}
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />
      {/* Sheen along the upper tube */}
      <ellipse
        cx={hx} cy={hy} rx={rx * 0.36} ry={t * 0.2}
        fill="#FFFFFF" opacity="0.55"
        transform={`rotate(-16 ${hx} ${hy})`}
      />
    </g>
  );
}

/** Engraved plate with beveled edges. */
function Plate({
  x, y, w, h, rx = 8, fill, metal, text, fontSize, italic = true, gleam,
}: {
  x: number; y: number; w: number; h: number; rx?: number; fill: string; metal: MetalPalette;
  text: string; fontSize: number; italic?: boolean; gleam: string;
}) {
  return (
    <g>
      <rect x={x + 1.5} y={y + 2.5} width={w} height={h} rx={rx} fill="#14141A" opacity="0.22" filter={gleam} />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={metal.deep} strokeWidth="1" />
      <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx={Math.max(rx - 2, 2)} fill="none" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.5" />
      {/* Engraving: light undercut below dark strike */}
      <text
        x={x + w / 2} y={y + h / 2 + fontSize * 0.36 + 0.8} textAnchor="middle"
        fontFamily="var(--font-playfair), 'Playfair Display', serif" fontStyle={italic ? "italic" : undefined}
        fontSize={fontSize} fontWeight="700" fill="#FFFFFF" opacity="0.55"
      >
        {text}
      </text>
      <text
        x={x + w / 2} y={y + h / 2 + fontSize * 0.36} textAnchor="middle"
        fontFamily="var(--font-playfair), 'Playfair Display', serif" fontStyle={italic ? "italic" : undefined}
        fontSize={fontSize} fontWeight="700" fill={metal.deep}
      >
        {text}
      </text>
    </g>
  );
}

/* ── Piece renderings ─────────────────────────────────────── */

export interface RenderSpec {
  piece: PieceType | "";
  style?: string;
  metal?: string;
  karat?: string;
  stones?: string;
  stoneShape?: string;
  stoneAmount?: string;
  engraving?: string;
}

function stonesFor(spec: RenderSpec, required: boolean): StonePalette {
  if (spec.stones === STONE_NONE) return required ? GHOST_STONE : NEUTRAL_STONE;
  return resolveStone(spec.stones ?? "");
}

function hasStones(spec: RenderSpec): boolean {
  return !!spec.stones && spec.stones !== STONE_NONE;
}

function icedOut(spec: RenderSpec): boolean {
  return hasStones(spec) && spec.stoneAmount === "Fully iced out";
}

function plateText(spec: RenderSpec, fallback: string): string {
  const t = (spec.engraving ?? "").trim();
  return (t || fallback).slice(0, 10);
}

/* Ring — polished torus, specular arcs, parametric setting. */
function RingArt({ spec }: { spec: RenderSpec }) {
  const metal = resolveMetal(spec.metal ?? "", spec.karat);
  const art = useArtDefs(metal);
  const style = spec.style ?? "";
  const gem = stonesFor(spec, true);
  const shape = spec.stoneShape || "Round";
  const cx = 120;
  const cy = 146;
  // Slightly taller-than-wide ellipse plus an offset back rim = a band with
  // visible thickness instead of a flat circle.
  const rxO = 49;
  const ryO = 56;
  const rxI = 37;
  const ryI = 44;
  const rxM = (rxO + rxI) / 2;
  const ryM = (ryO + ryI) / 2;

  const torus = (dx: number, dy: number) =>
    `M ${cx - rxO + dx} ${cy + dy} A ${rxO} ${ryO} 0 1 1 ${cx + rxO + dx} ${cy + dy} A ${rxO} ${ryO} 0 1 1 ${cx - rxO + dx} ${cy + dy} Z
     M ${cx - rxI + dx} ${cy + dy} A ${rxI} ${ryI} 0 1 0 ${cx + rxI + dx} ${cy + dy} A ${rxI} ${ryI} 0 1 0 ${cx - rxI + dx} ${cy + dy} Z`;

  const paveDots = icedOut(spec) || style === "Eternity band"
    ? ellipsePoints(cx, cy, rxM, ryM, 195, 345, style === "Eternity band" ? 9 : 13)
    : [];

  const isBandOnly = style === "Wedding or stacking band" || style === "Eternity band";
  const isSignet = style === "Signet ring";

  /* Head: curved shoulders flowing out of the band into a slim collet. */
  const head = (colletHalf: number) => (
    <>
      <path d={`M ${cx - 23} 98 Q ${cx - 17} 78 ${cx - colletHalf + 2} 74`} fill="none" stroke={metal.deep} strokeWidth="8.5" strokeLinecap="round" />
      <path d={`M ${cx + 23} 98 Q ${cx + 17} 78 ${cx + colletHalf - 2} 74`} fill="none" stroke={metal.deep} strokeWidth="8.5" strokeLinecap="round" />
      <path d={`M ${cx - 23} 98 Q ${cx - 17} 78 ${cx - colletHalf + 2} 74`} fill="none" stroke={art.band} strokeWidth="7" strokeLinecap="round" />
      <path d={`M ${cx + 23} 98 Q ${cx + 17} 78 ${cx + colletHalf - 2} 74`} fill="none" stroke={art.band} strokeWidth="7" strokeLinecap="round" />
      <path
        d={`M ${cx - colletHalf} 71 L ${cx + colletHalf} 71 L ${cx + colletHalf - 3} 85 L ${cx - colletHalf + 3} 85 Z`}
        fill={art.plate} stroke={metal.deep} strokeWidth="1" strokeLinejoin="round"
      />
    </>
  );

  /* Four prongs gripping a stone's edges — drawn after the gem. */
  const prongs = (gx: number, gy: number, w: number, s: string) => {
    const px = w * 0.38;
    const py = (w * gemAspect(s)) * 0.32;
    return [[-px, -py], [px, -py], [-px, py], [px, py]].map(([dx, dy], i) => (
      <circle key={i} cx={gx + dx} cy={gy + dy} r={Math.max(w * 0.085, 1.8)} fill={art.plate} stroke={metal.deep} strokeWidth="0.7" />
    ));
  };

  const gemH2 = (w: number) => (w * gemAspect(shape)) / 2;

  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" role="img" aria-label="Ring rendering">
      {art.defs}
      <GroundShadow cx={cx} cy={cy + ryO + 6} rx={ryO * 0.88} blur={art.blur} />
      {/* Slight tilt gives the whole piece a natural product pose */}
      <g transform={`rotate(-7 ${cx} ${cy})`}>
      {/* Back rim, offset — reads as the band's thickness */}
      <path d={torus(7, -3)} fill={metal.dark} stroke={metal.deep} strokeWidth="0.8" fillRule="evenodd" />
      {/* Front band */}
      <path d={torus(0, 0)} fill={art.band} stroke={metal.deep} strokeWidth="0.8" fillRule="evenodd" />
      {/* Specular highlight (top-left) and core shadow (bottom-right) */}
      <path d={ellipseArcPath(cx, cy, rxM, ryM, 150, 250)} fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" filter={art.gleam} />
      <path d={ellipseArcPath(cx, cy, rxM, ryM, 15, 78)} fill="none" stroke={metal.deep} strokeWidth="5" strokeLinecap="round" opacity="0.45" filter={art.gleam} />
      {/* Two-tone inner sleeve */}
      {metal.alt && <ellipse cx={cx} cy={cy} rx={rxI + 2.5} ry={ryI + 2.5} fill="none" stroke={art.alt} strokeWidth="5" />}

      {/* Pave / eternity stones along the band */}
      {paveDots.map((p, i) => (
        <Gem key={i} shape="Round" cx={p.x} cy={p.y} w={style === "Eternity band" ? 9.5 : 7} colors={gem} facets={false} />
      ))}

      {/* Settings */}
      {isSignet && (
        <>
          {/* Shoulders widen out of the band into the face — one continuous piece */}
          <path
            d={`M ${cx - 30} 74 L ${cx + 30} 74 L ${cx + 13} 100 L ${cx - 13} 100 Z`}
            fill={art.band} stroke={metal.deep} strokeWidth="1" strokeLinejoin="round"
          />
          <ellipse cx={cx} cy={63} rx={26} ry={17} fill={art.plate} stroke={metal.deep} strokeWidth="1.2" />
          <ellipse cx={cx} cy={63} rx={20.5} ry={12} fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
          <text
            x={cx} y={71.5} textAnchor="middle" fontFamily="var(--font-playfair), 'Playfair Display', serif"
            fontStyle="italic" fontSize="22" fontWeight="700" fill="#FFFFFF" opacity="0.55"
          >
            {plateText(spec, "K").slice(0, 1).toUpperCase()}
          </text>
          <text
            x={cx} y={70.7} textAnchor="middle" fontFamily="var(--font-playfair), 'Playfair Display', serif"
            fontStyle="italic" fontSize="22" fontWeight="700" fill={metal.deep}
          >
            {plateText(spec, "K").slice(0, 1).toUpperCase()}
          </text>
        </>
      )}
      {!isBandOnly && !isSignet && (
        <>
          {style === "Three-stone ring" ? (
            <>
              {head(15)}
              {/* Side stones share the gallery line, tucked against the center */}
              <Gem shape={shape} cx={cx - 20} cy={73 - gemH2(16)} w={16} colors={gem} rotate={-8} />
              <Gem shape={shape} cx={cx + 20} cy={73 - gemH2(16)} w={16} colors={gem} rotate={8} />
              <Gem shape={shape} cx={cx} cy={73 - gemH2(25)} w={25} colors={gem} />
              {prongs(cx, 73 - gemH2(25), 25, shape)}
            </>
          ) : style === "Statement / cluster ring" ? (
            <>
              {head(12)}
              {/* Packed dome of stones */}
              {ellipsePoints(cx, 62, 10.5, 9, -90, 270, 6, false).map((p, i) => (
                <Gem key={i} shape="Round" cx={p.x} cy={p.y} w={12} colors={gem} facets={false} />
              ))}
              <Gem shape="Round" cx={cx} cy={61} w={14} colors={gem} />
            </>
          ) : style === "Halo engagement ring" ? (
            <>
              {head(13)}
              {/* Solid metal halo carrying the pave, hugging the center stone */}
              <ellipse cx={cx} cy={73 - gemH2(21) - 1} rx={10.5 + 6.5} ry={gemH2(21) + 6.5} fill="none" stroke={art.band} strokeWidth="7.5" />
              <ellipse cx={cx} cy={73 - gemH2(21) - 1} rx={10.5 + 10} ry={gemH2(21) + 10} fill="none" stroke={metal.deep} strokeWidth="0.8" opacity="0.6" />
              {ellipsePoints(cx, 73 - gemH2(21) - 1, 10.5 + 6.5, gemH2(21) + 6.5, -90, 270, 14, false).map((p, i) => (
                <Gem key={i} shape="Round" cx={p.x} cy={p.y} w={6} colors={gem} facets={false} />
              ))}
              <Gem shape={shape} cx={cx} cy={73 - gemH2(21) - 1} w={21} colors={gem} />
            </>
          ) : (
            <>
              {head(10)}
              <Gem shape={shape} cx={cx} cy={73 - gemH2(28) + 2} w={28} colors={gem} />
              {prongs(cx, 73 - gemH2(28) + 2, 28, shape)}
            </>
          )}
          {hasStones(spec) && (
            <>
              <Sparkle cx={cx + 29} cy={44} s={7} color="#FFFFFF" />
              <Sparkle cx={cx - 32} cy={52} s={4.5} color="#FFFFFF" opacity={0.55} />
            </>
          )}
        </>
      )}
      {isBandOnly && hasStones(spec) && style !== "Eternity band" &&
        ellipsePoints(cx, cy, rxM, ryM, 245, 295, 5).map((p, i) => (
          <Gem key={i} shape="Round" cx={p.x} cy={p.y} w={9.5} colors={gem} facets={false} />
        ))}
      </g>
    </svg>
  );
}

/* Necklace — draped chain, links built from shaded toruses. */
function NecklaceArt({ spec }: { spec: RenderSpec }) {
  const metal = resolveMetal(spec.metal ?? "", spec.karat);
  const art = useArtDefs(metal);
  const style = spec.style ?? "";
  const gem = stonesFor(spec, style === "Tennis necklace");
  const shape = spec.stoneShape || "Round";
  const iced = icedOut(spec);

  const P = { x0: 34, y0: 40, cx: 120, cy: 210, x1: 206, y1: 40 };
  const curve = `M ${P.x0} ${P.y0} Q ${P.cx} ${P.cy} ${P.x1} ${P.y1}`;
  const pts = (n: number) => quadPoints(P.x0, P.y0, P.cx, P.cy, P.x1, P.y1, n);

  /* Fine cable chain used behind pendants and plates. */
  const cable = (
    <>
      <path d={curve} fill="none" stroke={metal.deep} strokeWidth="3.4" opacity="0.9" />
      <path d={curve} fill="none" stroke={art.band} strokeWidth="2.2" />
      {pts(30).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.9} fill="none" stroke={i % 2 ? metal.light : metal.dark} strokeWidth="0.8" opacity="0.8" />
      ))}
    </>
  );

  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" role="img" aria-label="Necklace rendering">
      {art.defs}
      <GroundShadow cx={120} cy={150} rx={70} blur={art.blur} />
      {style === "Cuban link chain" && (
        <>
          {pts(15).map((p, i) => (
            <Link key={i} x={p.x} y={p.y} rx={13.5} ry={9} angle={p.a} fill={i % 2 && metal.alt ? art.alt : art.band} deep={metal.deep} />
          ))}
          {iced &&
            pts(15).map((p, i) => (
              <Gem key={i} shape="Round" cx={p.x} cy={p.y} w={6} colors={gem} facets={false} />
            ))}
        </>
      )}
      {style === "Rope chain" &&
        pts(38).map((p, i) => (
          <ellipse
            key={i}
            cx={p.x} cy={p.y} rx={7.6} ry={4.2}
            transform={`rotate(${p.a + 52} ${p.x} ${p.y})`}
            fill={i % 2 && metal.alt ? art.altPlate : art.plate}
            stroke={metal.deep} strokeWidth="0.7" strokeOpacity="0.7"
          />
        ))}
      {style === "Figaro chain" &&
        pts(24).map((p, i) => (
          <Link
            key={i}
            x={p.x} y={p.y}
            rx={i % 4 === 3 ? 12 : 8} ry={i % 4 === 3 ? 6 : 5.5}
            angle={p.a}
            fill={i % 2 && metal.alt ? art.alt : art.band}
            deep={metal.deep}
          />
        ))}
      {style === "Franco chain" && (
        <>
          <path d={curve} fill="none" stroke={metal.deep} strokeWidth="13" strokeLinecap="round" />
          <path d={curve} fill="none" stroke={art.band} strokeWidth="11.5" strokeLinecap="round" />
          {pts(30).map((p, i) => (
            <line
              key={i}
              x1={p.x - 5.4} y1={p.y} x2={p.x + 5.4} y2={p.y}
              transform={`rotate(${p.a + (i % 2 ? 58 : 122)} ${p.x} ${p.y})`}
              stroke={i % 2 ? metal.deep : metal.light} strokeWidth="1.3" opacity="0.75"
            />
          ))}
          <path d={arcPath(120, -18, 116, 55, 88)} fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.4" filter={art.gleam} />
        </>
      )}
      {style === "Tennis necklace" && (
        <>
          <path d={curve} fill="none" stroke={metal.deep} strokeWidth="2.4" opacity="0.75" />
          {pts(19).map((p, i) => (
            <Gem key={i} shape={shape} cx={p.x} cy={p.y} w={10.5} colors={gem} rotate={p.a + 90} facets={false} />
          ))}
        </>
      )}
      {(style === "Pendant with chain" || style === "" || style === "Not sure yet") && (
        <>
          {cable}
          {/* Bail sits on the chain; the stone hangs from the bail */}
          <circle cx={120} cy={126} r={4.5} fill="none" stroke={metal.deep} strokeWidth="4.6" />
          <circle cx={120} cy={126} r={4.5} fill="none" stroke={art.band} strokeWidth="3" />
          <Gem
            shape={shape}
            cx={120}
            cy={126 + 4.5 + (32 * gemAspect(shape)) / 2 - 3}
            w={32}
            colors={hasStones(spec) ? gem : GHOST_STONE}
          />
          {hasStones(spec) && <Sparkle cx={143} cy={136} s={6.5} color="#FFFFFF" />}
        </>
      )}
      {style === "Custom nameplate" && (
        <>
          {cable}
          {/* Plate rides inline on the chain's lowest point */}
          <Plate x={62} y={108} w={116} h={36} rx={8} fill={art.plate} metal={metal}
            text={plateText(spec, "Your name")} fontSize={17} gleam={art.gleam} />
        </>
      )}
    </svg>
  );
}

/* Bracelet — shaded links around an oval. */
function BraceletArt({ spec }: { spec: RenderSpec }) {
  const metal = resolveMetal(spec.metal ?? "", spec.karat);
  const art = useArtDefs(metal);
  const style = spec.style ?? "";
  const gem = stonesFor(spec, style === "Tennis bracelet");
  const shape = spec.stoneShape || "Round";
  const cx = 120;
  const cy = 122;
  const rx = 72;
  const ry = 56;
  const iced = icedOut(spec);

  const around = (n: number) => ellipsePoints(cx, cy, rx, ry, -90, 270, n, false);

  const cableRound = (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={metal.deep} strokeWidth="3.6" opacity="0.9" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={art.band} strokeWidth="2.4" />
      {around(30).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2} fill="none" stroke={i % 2 ? metal.light : metal.dark} strokeWidth="0.8" opacity="0.8" />
      ))}
    </>
  );

  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" role="img" aria-label="Bracelet rendering">
      {art.defs}
      <GroundShadow cx={cx} cy={cy + ry + 26} rx={rx * 0.95} blur={art.blur} />
      {style === "Bangle" ? (
        <>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={metal.deep} strokeWidth="14" />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={art.band} strokeWidth="12" />
          {/* Far inner wall through the top of the opening */}
          <path d={ellipseArcPath(cx, cy, rx - 10, ry - 10, 203, 337)} fill="none" stroke={metal.dark} strokeWidth="6" opacity="0.8" />
          <path d={ellipseArcPath(cx, cy, rx, ry, 155, 250)} fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.55" filter={art.gleam} />
          {hasStones(spec) &&
            ellipsePoints(cx, cy, rx, ry, 240, 300, iced ? 9 : 5).map((p, i) => (
              <Gem key={i} shape="Round" cx={p.x} cy={p.y} w={9.5} colors={gem} facets={false} />
            ))}
        </>
      ) : style === "Tennis bracelet" ? (
        <>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={metal.deep} strokeWidth="2.2" opacity="0.75" />
          {around(20).map((p, i) => (
            <Gem key={i} shape={shape} cx={p.x} cy={p.y} w={11} colors={gem} rotate={p.a + 90} facets={false} />
          ))}
        </>
      ) : style === "Rope bracelet" ? (
        around(40).map((p, i) => (
          <ellipse
            key={i}
            cx={p.x} cy={p.y} rx={7.4} ry={4.1}
            transform={`rotate(${p.a + 52} ${p.x} ${p.y})`}
            fill={i % 2 && metal.alt ? art.altPlate : art.plate}
            stroke={metal.deep} strokeWidth="0.7" strokeOpacity="0.7"
          />
        ))
      ) : style === "Charm bracelet" ? (
        <>
          {cableRound}
          {/* Jump rings connect each dangle to the chain */}
          <circle cx={86} cy={cy + 51} r={2.6} fill="none" stroke={metal.deep} strokeWidth="1.4" />
          <line x1={86} y1={cy + 53} x2={86} y2={cy + 62} stroke={metal.deep} strokeWidth="1.6" />
          <path d={gemPath("Heart", 17, 17)} transform={`translate(86 ${cy + 70})`} fill={art.plate} stroke={metal.deep} strokeWidth="1" />
          <circle cx={120} cy={cy + 57} r={2.6} fill="none" stroke={metal.deep} strokeWidth="1.4" />
          <line x1={120} y1={cy + 59} x2={120} y2={cy + 65} stroke={metal.deep} strokeWidth="1.6" />
          <circle cx={120} cy={cy + 73} r={8.5} fill={art.plate} stroke={metal.deep} strokeWidth="1" />
          <circle cx={117.5} cy={cy + 70} r={2.2} fill="#FFFFFF" opacity="0.6" />
          <circle cx={154} cy={cy + 51} r={2.6} fill="none" stroke={metal.deep} strokeWidth="1.4" />
          <line x1={154} y1={cy + 53} x2={154} y2={cy + 62} stroke={metal.deep} strokeWidth="1.6" />
          <Sparkle cx={154} cy={cy + 69} s={9} color={metal.base} opacity={1} />
        </>
      ) : style === "ID bracelet" ? (
        <>
          {cableRound}
          <Plate x={cx - 47} y={cy + ry - 17} w={94} h={31} rx={14} fill={art.plate} metal={metal}
            text={plateText(spec, "Your name")} fontSize={15} gleam={art.gleam} />
        </>
      ) : (
        /* Cuban link (default) */
        <>
          {around(18).map((p, i) => (
            <Link key={i} x={p.x} y={p.y} rx={12.5} ry={8.5} angle={p.a} fill={i % 2 && metal.alt ? art.alt : art.band} deep={metal.deep} />
          ))}
          {iced &&
            around(18).map((p, i) => (
              <Gem key={i} shape="Round" cx={p.x} cy={p.y} w={5.5} colors={gem} facets={false} />
            ))}
        </>
      )}
    </svg>
  );
}

/* Charm — bail attached to the body, hanging from a taut chain. */
function CharmArt({ spec }: { spec: RenderSpec }) {
  const metal = resolveMetal(spec.metal ?? "", spec.karat);
  const art = useArtDefs(metal);
  const style = spec.style ?? "";
  const gem = stonesFor(spec, false);
  const iced = icedOut(spec);
  const cx = 120;

  /* Bail bottom must overlap each body's top edge — no floating hardware. */
  const BAIL_Y: Record<string, number> = {
    "Cross / religious": 70,
    "Nameplate": 103,
    "Sports / team": 75,
    "Animal / symbol": 79,
    "Photo / memorial": 76,
    "Custom shape — my own idea": 75,
  };
  const bailY = BAIL_Y[style] ?? 86;

  const bail = (
    <>
      {/* Chain running through the bail */}
      <path
        d={`M 14 22 L ${cx} ${bailY - 5.5} L 226 22`}
        fill="none" stroke={metal.deep} strokeWidth="2.6" strokeLinejoin="round" opacity="0.9"
      />
      <path
        d={`M 14 22 L ${cx} ${bailY - 5.5} L 226 22`}
        fill="none" stroke={art.band} strokeWidth="1.4" strokeLinejoin="round"
      />
      <circle cx={cx} cy={bailY} r={9} fill="none" stroke={metal.deep} strokeWidth="5.5" />
      <circle cx={cx} cy={bailY} r={9} fill="none" stroke={art.band} strokeWidth="4" />
    </>
  );

  const paveOn = (pts: { x: number; y: number }[]) =>
    iced && pts.map((p, i) => <Gem key={i} shape="Round" cx={p.x} cy={p.y} w={6} colors={gem} facets={false} />);

  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" role="img" aria-label="Charm rendering">
      {art.defs}
      <GroundShadow cx={cx} cy={208} rx={56} blur={art.blur} />
      {bail}
      {(style === "Initial / letter" || style === "" || style === "Not sure yet") && (
        <>
          <text
            x={cx + 2.5} y={176} textAnchor="middle" fontFamily="var(--font-playfair), 'Playfair Display', serif"
            fontSize="112" fontWeight="700" fill="#14141A" opacity="0.25" filter={art.gleam}
          >
            {plateText(spec, "A").slice(0, 1).toUpperCase()}
          </text>
          <text
            x={cx} y={173} textAnchor="middle" fontFamily="var(--font-playfair), 'Playfair Display', serif"
            fontSize="112" fontWeight="700" fill={art.plate} stroke={metal.deep} strokeWidth="1.4"
          >
            {plateText(spec, "A").slice(0, 1).toUpperCase()}
          </text>
          {iced && (
            <>
              <Sparkle cx={cx - 46} cy={102} s={7} color="#FFFFFF" />
              <Sparkle cx={cx + 47} cy={152} s={9} color="#FFFFFF" />
              <Sparkle cx={cx + 35} cy={98} s={5} color="#FFFFFF" opacity={0.55} />
            </>
          )}
        </>
      )}
      {style === "Cross / religious" && (
        <>
          <path
            d={`M ${cx - 11} 79 h 22 v 32 h 30 v 22 h -30 v 56 h -22 v -56 h -30 v -22 h 30 Z`}
            fill="#14141A" opacity="0.22" transform="translate(2 3)" filter={art.gleam}
          />
          <path
            d={`M ${cx - 11} 79 h 22 v 32 h 30 v 22 h -30 v 56 h -22 v -56 h -30 v -22 h 30 Z`}
            fill={art.plate} stroke={metal.deep} strokeWidth="1.4" strokeLinejoin="round"
          />
          <path d={`M ${cx - 8} 84 v 100 M ${cx - 27} 114 h 18`} stroke="#FFFFFF" strokeWidth="1.6" opacity="0.45" />
          {paveOn([
            { x: cx, y: 92 }, { x: cx, y: 116 }, { x: cx, y: 140 },
            { x: cx, y: 164 }, { x: cx - 24, y: 122 }, { x: cx + 24, y: 122 },
          ])}
        </>
      )}
      {style === "Nameplate" && (
        <Plate x={cx - 62} y={112} w={124} h={46} rx={10} fill={art.plate} metal={metal}
          text={plateText(spec, "Your name")} fontSize={20} gleam={art.gleam} />
      )}
      {style === "Sports / team" && (
        <>
          <circle cx={cx + 2} cy={139} r={52} fill="#14141A" opacity="0.22" filter={art.gleam} />
          <circle cx={cx} cy={136} r={52} fill={art.plate} stroke={metal.deep} strokeWidth="1.6" />
          <path
            d={`M ${cx - 52} 136 H ${cx + 52} M ${cx} 84 V 188
                M ${cx - 37} 99 Q ${cx} 136 ${cx - 37} 173 M ${cx + 37} 99 Q ${cx} 136 ${cx + 37} 173`}
            fill="none" stroke={metal.deep} strokeWidth="1.7" opacity="0.8"
          />
          <ellipse cx={cx - 18} cy={112} rx={13} ry={7} fill="#FFFFFF" opacity="0.4" transform={`rotate(-32 ${cx - 18} 112)`} filter={art.gleam} />
        </>
      )}
      {style === "Animal / symbol" && (
        <>
          <path d={gemPath("Heart", 104, 100)} transform={`translate(${cx + 2} 141)`} fill="#14141A" opacity="0.22" filter={art.gleam} />
          <path
            d={gemPath("Heart", 104, 100)}
            transform={`translate(${cx} 138)`}
            fill={art.plate} stroke={metal.deep} strokeWidth="1.6" strokeLinejoin="round"
          />
          <path
            d={`M ${cx - 34} 110 Q ${cx - 40} 128 ${cx - 30} 146`}
            fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.5" filter={art.gleam}
          />
          {paveOn(ellipsePoints(cx, 130, 30, 26, 0, 360, 8, false))}
        </>
      )}
      {style === "Photo / memorial" && (
        <>
          <rect x={cx - 44} y={88} width={92} height={112} rx={8} fill="#14141A" opacity="0.22" filter={art.gleam} />
          <rect x={cx - 46} y={85} width={92} height={112} rx={8} fill={art.plate} stroke={metal.deep} strokeWidth="1.4" />
          <rect x={cx - 35} y={96} width={70} height={90} fill="#E9DFC8" stroke={metal.deep} strokeWidth="0.9" />
          <circle cx={cx + 13} cy={118} r={9} fill="#D9B96A" opacity="0.85" />
          <path
            d={`M ${cx - 35} 172 L ${cx - 13} 142 L ${cx + 3} 160 L ${cx + 15} 148 L ${cx + 35} 172 L ${cx + 35} 186 L ${cx - 35} 186 Z`}
            fill="#B49A62" opacity="0.8"
          />
          <rect x={cx - 35} y={96} width={70} height={90} fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
        </>
      )}
      {style === "Custom shape — my own idea" && (
        <>
          <path
            d={`M ${cx} 84 C ${cx + 52} 94, ${cx + 50} 152, ${cx + 20} 180 C ${cx - 6} 202, ${cx - 54} 180, ${cx - 50} 138 C ${cx - 47} 102, ${cx - 28} 90, ${cx} 84 Z`}
            fill="none" stroke={metal.dark} strokeWidth="2.2" strokeDasharray="7 6" strokeLinecap="round"
          />
          <Sparkle cx={cx} cy={136} s={17} color={metal.base} opacity={1} />
          <Sparkle cx={cx + 27} cy={109} s={8} color={metal.base} opacity={0.7} />
          <Sparkle cx={cx - 25} cy={160} s={6} color={metal.base} opacity={0.5} />
        </>
      )}
    </svg>
  );
}

/** The live rendering — dispatches by piece type. */
export function PieceRendering({ spec }: { spec: RenderSpec }) {
  switch (spec.piece) {
    case "ring":
      return <RingArt spec={spec} />;
    case "necklace":
      return <NecklaceArt spec={spec} />;
    case "bracelet":
      return <BraceletArt spec={spec} />;
    case "charm":
      return <CharmArt spec={spec} />;
    default:
      return null;
  }
}

/* ── Option swatches ──────────────────────────────────────── */

/** Polished metal disc — split for two-tone. */
export function MetalSwatch({ metal, karat, size = 44 }: { metal: string; karat?: string; size?: number }) {
  const p = resolveMetal(metal, karat);
  const uid = useId().replace(/[:]/g, "");
  const grad = (m: MetalPalette, id: string) => (
    <radialGradient id={id} cx="0.33" cy="0.28" r="0.95">
      <stop offset="0" stopColor={m.light} />
      <stop offset="0.5" stopColor={m.base} />
      <stop offset="0.85" stopColor={m.dark} />
      <stop offset="1" stopColor={m.deep} />
    </radialGradient>
  );
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <defs>
        {grad(p, `m${uid}`)}
        {p.alt && grad(p.alt, `n${uid}`)}
        <filter id={`f${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      <ellipse cx="24" cy="43" rx="16" ry="2.6" fill="#14141A" opacity="0.18" filter={`url(#f${uid})`} />
      {p.alt ? (
        <>
          <path d="M 24 2 A 21 21 0 0 0 24 44 Z" fill={`url(#m${uid})`} />
          <path d="M 24 2 A 21 21 0 0 1 24 44 Z" fill={`url(#n${uid})`} />
          <circle cx="24" cy="23" r="21" fill="none" stroke={p.deep} strokeWidth="1" />
        </>
      ) : (
        <circle cx="24" cy="23" r="21" fill={`url(#m${uid})`} stroke={p.deep} strokeWidth="1" />
      )}
      <path d={arcPath(24, 23, 16.5, 150, 245)} fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" filter={`url(#f${uid})`} />
    </svg>
  );
}

/** Stone swatch — a faceted gem, or a plain polished band for "no stones". */
export function StoneSwatch({ stone, size = 44 }: { stone: string; size?: number }) {
  const uid = useId().replace(/[:]/g, "");
  if (stone === STONE_NONE) {
    const p = NEUTRAL_METAL;
    return (
      <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={`b${uid}`} x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor={p.deep} />
            <stop offset="0.35" stopColor={p.light} />
            <stop offset="0.7" stopColor={p.base} />
            <stop offset="1" stopColor={p.deep} />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="15" fill="none" stroke={`url(#b${uid})`} strokeWidth="7" />
        <circle cx="24" cy="24" r="18.5" fill="none" stroke={p.deep} strokeWidth="0.8" opacity="0.6" />
        <circle cx="24" cy="24" r="11.5" fill="none" stroke={p.deep} strokeWidth="0.8" opacity="0.6" />
      </svg>
    );
  }
  const colors = resolveStone(stone);
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <Gem shape="Round" cx={24} cy={25} w={27} colors={colors} />
      <Sparkle cx={39} cy={10} s={5} color="#FFFFFF" />
    </svg>
  );
}

/** Gem-cut icon for the shape picker. */
export function ShapeSwatch({ shape, stone, size = 48 }: { shape: string; stone?: string; size?: number }) {
  const colors = stone && stone !== STONE_NONE ? resolveStone(stone) : NEUTRAL_STONE;
  if (shape === "No preference") {
    return (
      <svg viewBox="0 0 56 56" width={size} height={size} aria-hidden="true">
        <Sparkle cx={28} cy={28} s={16} color={colors.deep} />
        <Sparkle cx={44} cy={13} s={7} color={colors.deep} opacity={0.5} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 56 56" width={size} height={size} aria-hidden="true">
      <Gem shape={shape} cx={28} cy={28} w={shape === "Marquise" ? 22 : 28} colors={colors} />
    </svg>
  );
}

/** Coverage diagram — how much of the piece is set with stones. */
export function CoverageSwatch({ amount, stone, size = 48 }: { amount: string; stone?: string; size?: number }) {
  const colors = stone && stone !== STONE_NONE ? resolveStone(stone) : NEUTRAL_STONE;
  const uid = useId().replace(/[:]/g, "");
  const m = NEUTRAL_METAL;
  return (
    <svg viewBox="0 0 56 56" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id={`c${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={m.light} />
          <stop offset="0.5" stopColor={m.base} />
          <stop offset="1" stopColor={m.deep} />
        </linearGradient>
      </defs>
      <rect x="5" y="37" width="46" height="5.5" rx="2.75" fill={`url(#c${uid})`} stroke={m.deep} strokeWidth="0.6" />
      {amount === "One center stone" && <Gem shape="Round" cx={28} cy={30} w={17} colors={colors} />}
      {amount === "Center stone with accents" && (
        <>
          <Gem shape="Round" cx={14} cy={34} w={7.5} colors={colors} facets={false} />
          <Gem shape="Round" cx={42} cy={34} w={7.5} colors={colors} facets={false} />
          <Gem shape="Round" cx={28} cy={30} w={15} colors={colors} />
        </>
      )}
      {amount === "A few accent stones" && (
        <>
          <Gem shape="Round" cx={16} cy={33} w={8.5} colors={colors} facets={false} />
          <Gem shape="Round" cx={28} cy={33} w={8.5} colors={colors} facets={false} />
          <Gem shape="Round" cx={40} cy={33} w={8.5} colors={colors} facets={false} />
        </>
      )}
      {amount === "Fully iced out" &&
        [8, 16, 24, 32, 40, 48].map((x) => (
          <Gem key={x} shape="Round" cx={x} cy={33.5} w={8} colors={colors} facets={false} />
        ))}
      {amount === "Not sure yet" && <Sparkle cx={28} cy={29} s={11} color={colors.deep} />}
    </svg>
  );
}
