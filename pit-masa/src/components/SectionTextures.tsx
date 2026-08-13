/* ═══════════════════════════════════════════════════════════
   Decorative Section Elements
   
   Layered section overlays, wave dividers, edge accent stripes,
   and branded silhouettes — inspired by JP Carroll Roofing's
   Elementor-based layered design system, adapted for Pit & Masa.
   ═══════════════════════════════════════════════════════════ */

/* eslint-disable @next/next/no-img-element */

/* ──────── Emblem Watermark ────────
   The Pit & Masa badge emblem rendered very faintly as a large
   background watermark. Great on dark bands for a subtle, premium
   branded texture. Position with the `className`. */
export function EmblemWatermark({
  className = "",
  opacity = 0.05,
  size = "clamp(220px, 40vw, 520px)",
}: {
  className?: string;
  opacity?: number;
  size?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{ width: size, height: size, opacity }}
      aria-hidden="true"
    >
      <img
        src="/images/pit-masa-badge.webp"
        alt=""
        width={520}
        height={520}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

/* ──────── Taco Accent ────────
   The hand-drawn taco-with-heart brand mark used as a small
   decorative flourish beside headings or section eyebrows. */
export function TacoAccent({
  className = "",
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/images/pit-masa-taco.webp"
      alt=""
      width={size}
      height={size}
      loading="lazy"
      aria-hidden="true"
      className={`pointer-events-none inline-block select-none object-contain ${className}`}
      style={{ width: size, height: "auto" }}
    />
  );
}

/* ──────── Taco Watermark ────────
   The taco-with-heart mark rendered faintly as a large background
   symbol. Use one or two per section, positioned via `className`,
   for a subtle, on-brand decorative texture. Add `rotate` for a
   scattered, hand-placed feel. */
export function TacoWatermark({
  className = "",
  opacity = 0.05,
  size = "clamp(120px, 16vw, 260px)",
  rotate = 0,
}: {
  className?: string;
  opacity?: number;
  size?: string;
  rotate?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{ width: size, height: size, opacity, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <img
        src="/images/pit-masa-heart.webp"
        alt=""
        width={260}
        height={260}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

/* ──────── Angle Section Divider ────────
   Sharp diagonal/angled cuts between sections.
   Two complementary shapes: `from` (outgoing section above)
   and `fill` (incoming section below). No CSS transforms —
   flip bakes mirrored geometry directly into the SVG.
   Uses negative margins + shape-rendering to eliminate seams. */
export function AngleDivider({
  variant = "steep",
  fill = "#008080",
  from = "transparent",
  className = "",
  flip = false,
}: {
  variant?: "steep" | "shallow" | "notch" | "split";
  fill?: string;
  from?: string;
  className?: string;
  flip?: boolean;
}) {
  const defs: Record<string, { vb: string; path: string; pathFlip: string }> = {
    steep:   { vb: "0 0 1440 80", path: "M0,-1 L1440,59 L1440,81 L0,81 Z",            pathFlip: "M0,59 L1440,-1 L1440,81 L0,81 Z" },
    shallow: { vb: "0 0 1440 50", path: "M0,29 L1440,-1 L1440,51 L0,51 Z",            pathFlip: "M0,-1 L1440,29 L1440,51 L0,51 Z" },
    notch:   { vb: "0 0 1440 70", path: "M0,71 L720,-1 L1440,71 Z",                   pathFlip: "M0,-1 L720,71 L1440,-1 L1440,71 L0,71 Z" },
    split:   { vb: "0 0 1440 60", path: "M0,-1 L960,49 L1440,19 L1440,61 L0,61 Z",    pathFlip: "M0,19 L480,49 L1440,-1 L1440,61 L0,61 Z" },
  };

  const d = defs[variant] ?? defs.steep;

  return (
    <div
      className={`pointer-events-none relative z-10 ${className}`}
      style={{ lineHeight: 0, marginTop: "-3px", marginBottom: "-3px", backgroundColor: from }}
      aria-hidden="true"
    >
      <svg
        viewBox={d.vb}
        preserveAspectRatio="none"
        className="block w-full h-auto"
        style={{ display: "block", transform: "scaleY(1.02)" }}
      >
        <path d={flip ? d.pathFlip : d.path} fill={fill} shapeRendering="geometricPrecision" />
      </svg>
    </div>
  );
}

/* ──────── Edge Accent Stripe ────────
   JP Carroll uses linear-gradient(270deg, secondary 93%, copper 93%)
   to create a hard vertical stripe on the side of sections. 
   On mobile it switches to a horizontal bottom stripe. */
export function EdgeAccentStripe({
  color = "#FF8C00",
  side = "left",
  width = "7%",
  className = "",
}: {
  color?: string;
  side?: "left" | "right";
  width?: string;
  className?: string;
}) {
  const gradient = side === "left"
    ? `linear-gradient(90deg, ${color} 0%, ${color} 100%)`
    : `linear-gradient(270deg, ${color} 0%, ${color} 100%)`;

  return (
    <div
      className={`pointer-events-none absolute top-0 bottom-0 z-0 hidden lg:block ${
        side === "left" ? "left-0" : "right-0"
      } ${className}`}
      style={{
        width,
        background: gradient,
        opacity: 0.08,
      }}
      aria-hidden="true"
    />
  );
}

/* ──────── Section Gradient Overlay ────────
   JP Carroll uses linear-gradient(180deg, color1 0%, color2 100%)
   within sections for depth. This creates a subtle vertical gradient
   overlay across the whole section. */
export function GradientOverlay({
  from = "rgba(0,0,0,0.3)",
  to = "transparent",
  direction = "to bottom",
  className = "",
}: {
  from?: string;
  to?: string;
  direction?: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{
        background: `linear-gradient(${direction}, ${from}, ${to})`,
      }}
      aria-hidden="true"
    />
  );
}

/* ──────── Concentric Arcs ────────
   Nested partial-circle arcs — abstract, geometric, premium feel.
   Used as large background element on green/dark sections. */
export function ConcentricArcs({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute z-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M400 450 A200 200 0 0 0 400 50" stroke="currentColor" strokeWidth="1" opacity="0.06" fill="none" />
        <path d="M380 430 A180 180 0 0 0 380 70" stroke="currentColor" strokeWidth="1" opacity="0.05" fill="none" />
        <path d="M360 410 A160 160 0 0 0 360 90" stroke="currentColor" strokeWidth="1" opacity="0.045" fill="none" />
        <path d="M340 390 A140 140 0 0 0 340 110" stroke="currentColor" strokeWidth="1" opacity="0.04" fill="none" />
        <path d="M320 370 A120 120 0 0 0 320 130" stroke="currentColor" strokeWidth="0.75" opacity="0.035" fill="none" />
        <path d="M300 350 A100 100 0 0 0 300 150" stroke="currentColor" strokeWidth="0.75" opacity="0.03" fill="none" />
        <path d="M280 330 A80 80 0 0 0 280 170" stroke="currentColor" strokeWidth="0.5" opacity="0.025" fill="none" />
      </svg>
    </div>
  );
}

/* ──────── Geometric Grid ────────
   Fine intersecting lines with small node circles — 
   architectural/technical drawing aesthetic. */
export function GeometricGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute z-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Diagonal cross lines */}
        <line x1="0" y1="0" x2="400" y2="400" stroke="currentColor" strokeWidth="0.5" opacity="0.04" />
        <line x1="400" y1="0" x2="0" y2="400" stroke="currentColor" strokeWidth="0.5" opacity="0.04" />
        <line x1="100" y1="0" x2="400" y2="300" stroke="currentColor" strokeWidth="0.5" opacity="0.03" />
        <line x1="0" y1="100" x2="300" y2="400" stroke="currentColor" strokeWidth="0.5" opacity="0.03" />
        <line x1="300" y1="0" x2="0" y2="300" stroke="currentColor" strokeWidth="0.5" opacity="0.03" />
        <line x1="400" y1="100" x2="100" y2="400" stroke="currentColor" strokeWidth="0.5" opacity="0.03" />
        {/* Intersection nodes */}
        <circle cx="200" cy="200" r="3" fill="currentColor" opacity="0.05" />
        <circle cx="100" cy="100" r="2" fill="currentColor" opacity="0.04" />
        <circle cx="300" cy="300" r="2" fill="currentColor" opacity="0.04" />
        <circle cx="300" cy="100" r="2" fill="currentColor" opacity="0.03" />
        <circle cx="100" cy="300" r="2" fill="currentColor" opacity="0.03" />
        <circle cx="150" cy="250" r="1.5" fill="currentColor" opacity="0.03" />
        <circle cx="250" cy="150" r="1.5" fill="currentColor" opacity="0.03" />
      </svg>
    </div>
  );
}

/* ──────── Abstract Sweep Lines ────────
   Long sweeping curves — like luxury/premium brand backgrounds.
   Creates motion and sophistication without literal objects. */
export function AbstractLines({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute z-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M-50 400 Q150 100 350 250 T750 50" stroke="currentColor" strokeWidth="1" opacity="0.05" fill="none" />
        <path d="M-50 430 Q150 130 350 280 T750 80" stroke="currentColor" strokeWidth="0.75" opacity="0.04" fill="none" />
        <path d="M-50 460 Q150 160 350 310 T750 110" stroke="currentColor" strokeWidth="0.5" opacity="0.03" fill="none" />
        <path d="M-30 150 Q200 350 500 200 T750 400" stroke="currentColor" strokeWidth="0.75" opacity="0.035" fill="none" />
        <path d="M-30 170 Q200 370 500 220 T750 420" stroke="currentColor" strokeWidth="0.5" opacity="0.025" fill="none" />
      </svg>
    </div>
  );
}

/* ──────── Halftone Gradient ────────
   Dots that fade from dense to sparse — editorial/print aesthetic.
   More sophisticated than a uniform dot grid. */
export function HalftoneGradient({
  direction = "bottom-right",
  className = "",
}: {
  direction?: "bottom-right" | "top-left" | "bottom-left" | "top-right";
  className?: string;
}) {
  const dirMap: Record<string, string> = {
    "bottom-right": "bottom-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-left": "bottom-0 left-0",
    "top-right": "top-0 right-0",
  };

  return (
    <div className={`pointer-events-none absolute z-0 ${dirMap[direction]} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Dense region */}
        <circle cx="260" cy="260" r="2.5" fill="currentColor" opacity="0.06" />
        <circle cx="240" cy="270" r="2.2" fill="currentColor" opacity="0.055" />
        <circle cx="275" cy="240" r="2" fill="currentColor" opacity="0.055" />
        <circle cx="250" cy="245" r="2" fill="currentColor" opacity="0.05" />
        <circle cx="270" cy="255" r="1.8" fill="currentColor" opacity="0.05" />
        <circle cx="230" cy="255" r="2" fill="currentColor" opacity="0.05" />
        <circle cx="285" cy="270" r="1.8" fill="currentColor" opacity="0.05" />
        {/* Medium region */}
        <circle cx="220" cy="230" r="1.8" fill="currentColor" opacity="0.04" />
        <circle cx="240" cy="220" r="1.5" fill="currentColor" opacity="0.04" />
        <circle cx="260" cy="215" r="1.5" fill="currentColor" opacity="0.04" />
        <circle cx="210" cy="250" r="1.5" fill="currentColor" opacity="0.04" />
        <circle cx="280" cy="225" r="1.2" fill="currentColor" opacity="0.035" />
        <circle cx="225" cy="270" r="1.5" fill="currentColor" opacity="0.035" />
        <circle cx="265" cy="285" r="1.2" fill="currentColor" opacity="0.035" />
        {/* Sparse region */}
        <circle cx="200" cy="200" r="1.2" fill="currentColor" opacity="0.03" />
        <circle cx="180" cy="240" r="1" fill="currentColor" opacity="0.025" />
        <circle cx="220" cy="195" r="1" fill="currentColor" opacity="0.025" />
        <circle cx="250" cy="190" r="1" fill="currentColor" opacity="0.025" />
        <circle cx="195" cy="220" r="1" fill="currentColor" opacity="0.02" />
        <circle cx="170" cy="260" r="0.8" fill="currentColor" opacity="0.02" />
        {/* Fading out */}
        <circle cx="160" cy="210" r="0.8" fill="currentColor" opacity="0.015" />
        <circle cx="190" cy="180" r="0.8" fill="currentColor" opacity="0.015" />
        <circle cx="150" cy="240" r="0.6" fill="currentColor" opacity="0.012" />
      </svg>
    </div>
  );
}

/* ──────── Brand Watermark ────────
   Large faint "A" letterform as a section watermark.
   Abstract enough to feel premium, branded enough to reinforce identity. */
export function BrandWatermark({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute z-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Stylized "A" — geometric, minimal */}
        <path
          d="M200 40L60 400H120L150 310H250L280 400H340L200 40Z M170 260L200 160L230 260H170Z"
          fill="currentColor"
          opacity="0.03"
        />
        {/* Outer frame lines — architectural feel */}
        <line x1="50" y1="410" x2="350" y2="410" stroke="currentColor" strokeWidth="0.5" opacity="0.025" />
        <line x1="190" y1="30" x2="190" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.02" />
      </svg>
    </div>
  );
}

/* ──────── Dollar Sign Decorative Elements ────────
   Rotated dollar signs at low opacity — kept because it's contextually relevant
   for the "Cost of Doing Nothing" section, not a generic illustration. */
export function FloatingDollarSigns({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute z-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <g transform="rotate(-15, 100, 120)">
          <text x="40" y="140" fontSize="140" fontWeight="900" fontFamily="Red Hat Display, sans-serif" fill="currentColor" opacity="0.07">$</text>
        </g>
        <g transform="rotate(20, 220, 250)">
          <text x="170" y="280" fontSize="90" fontWeight="900" fontFamily="Red Hat Display, sans-serif" fill="currentColor" opacity="0.05">$</text>
        </g>
        <g transform="rotate(-8, 60, 280)">
          <text x="20" y="310" fontSize="50" fontWeight="900" fontFamily="Red Hat Display, sans-serif" fill="currentColor" opacity="0.035">$</text>
        </g>
      </svg>
    </div>
  );
}

/* ──────── Fine Line Accent ────────
   Thin architectural accent lines — clean and minimal. */
export function FineLineAccent({
  position = "top-right",
  className = "",
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}) {
  const posMap: Record<string, string> = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0 -scale-x-100",
    "bottom-right": "bottom-0 right-0 -scale-y-100",
    "bottom-left": "bottom-0 left-0 -scale-x-100 -scale-y-100",
  };

  return (
    <div className={`pointer-events-none absolute z-0 ${posMap[position]} ${className}`} aria-hidden="true">
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="200" y1="0" x2="200" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <line x1="200" y1="0" x2="120" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <line x1="190" y1="10" x2="190" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.035" />
        <line x1="190" y1="10" x2="140" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.035" />
      </svg>
    </div>
  );
}

/* ──────── Dotted Grid Pattern ──────── */
export function DotGridOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        opacity: 0.03,
      }}
      aria-hidden="true"
    />
  );
}

/* ──────── Radial Glow ────────
   Positioned radial gradient glow for visual depth,
   like JP Carroll's motion effects layer color overlays. */
export function RadialGlow({
  color = "#FF8C00",
  position = "center",
  size = "600px",
  opacity = 0.06,
  className = "",
}: {
  color?: string;
  position?: string;
  size?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{
        background: `radial-gradient(${size} circle at ${position}, ${color}, transparent 70%)`,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}
