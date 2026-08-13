# Animation System Integration Prompt

Use the following prompt verbatim when asking an AI assistant to integrate this animation system into an existing Next.js project.

---

## THE PROMPT

I need you to integrate a complete, production-grade animation and motion system into my existing Next.js (App Router) project. Do not replace or remove anything that already exists — this is purely additive. Follow each step exactly.

---

### STEP 1 — Install the dependency

Run:
```
npm install framer-motion
```

---

### STEP 2 — Create `src/app/template.tsx`

This file must be placed at the root of the `app/` directory alongside `layout.tsx`. It wraps every page in a fresh mount on navigation, which triggers the page-in animation on every route change.

```tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-page-in">
      {children}
    </div>
  );
}
```

---

### STEP 3 — Create `src/components/animations.tsx`

Create this file in full. It is a library of reusable Framer Motion animation primitives used throughout the app.

```tsx
"use client";

import { motion, useInView, useTransform, useScroll, type Variants } from "framer-motion";
import { useRef, useEffect, useState, type ReactNode } from "react";

/* ─── shared easing curves ─── */
const smoothOut = [0.33, 1, 0.68, 1] as const;   // gentle ease-out

/* ─────────────────────────────────────────────
   FADE-IN  — fade in once on scroll, stays visible
   ───────────────────────────────────────────── */
export function FadeIn({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const offsets = { up: [0, 24], down: [0, -24], left: [-40, 0], right: [40, 0], none: [0, 0] };
  const [xOff, yOff] = [offsets[direction][0], offsets[direction][1]];

  return (
    <motion.div
      initial={{ opacity: 0, y: yOff, x: xOff }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration, delay, ease: smoothOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SLIDE-IN  — slide in once from edges, stays visible
   ───────────────────────────────────────────── */
export function SlideIn({
  children,
  className = "",
  from = "left",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "left" | "right" | "top" | "bottom";
}) {
  const offsets = {
    left:   { x: -50, y: 0 },
    right:  { x: 50, y: 0 },
    top:    { x: 0, y: -40 },
    bottom: { x: 0, y: 40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: offsets[from].x, y: offsets[from].y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.85, delay, ease: smoothOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SCALE-IN  — scale in once on scroll, stays visible
   ───────────────────────────────────────────── */
export function ScaleIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, delay, ease: smoothOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   STAGGER CONTAINER + ITEM  — children cascade in
   ───────────────────────────────────────────── */
const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: smoothOut,
    },
  },
};

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.1 } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TEXT REVEAL  — words animate in one by one
   ───────────────────────────────────────────── */
export function TextReveal({
  text,
  className = "",
  delay = 0,
  tag: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14, filter: "blur(3px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: smoothOut,
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   COUNTER  — animated number counting
   ───────────────────────────────────────────── */
export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
  className = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={className}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   PARALLAX WRAPPER  — moves at different scroll speed
   ───────────────────────────────────────────── */
export function Parallax({
  children,
  className = "",
  speed = 0.3,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FLOATING ELEMENT  — gentle continuous float
   ───────────────────────────────────────────── */
export function FloatingElement({
  children,
  className = "",
  amplitude = 10,
  duration = 5,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude * 0.6, -amplitude * 0.8, amplitude, -amplitude],
        x: [0, amplitude * 0.3, -amplitude * 0.2, amplitude * 0.15, 0],
        rotate: [0, 1.5, -1, 0.5, 0],
      }}
      transition={{
        duration: duration * 1.2,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   GLOW CARD  — card with animated glow on hover
   ───────────────────────────────────────────── */
export function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, mass: 0.8 }}
      className={`relative group ${className}`}
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-[var(--primary)]/25 group-hover:via-[var(--primary)]/15 group-hover:to-transparent transition-all duration-600 blur-md opacity-0 group-hover:opacity-100" />
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   REVEAL LINE  — decorative animated line
   ───────────────────────────────────────────── */
export function RevealLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 1, ease: smoothOut }}
      className={`h-px origin-left bg-gradient-to-r from-[var(--primary)] to-transparent ${className}`}
    />
  );
}

/* ─────────────────────────────────────────────
   MAGNETIC HOVER  — spring-physics button lift
   ───────────────────────────────────────────── */
export function MagneticHover({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 280, damping: 20, mass: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED SECTION  — fade in once on scroll
   ───────────────────────────────────────────── */
export function AnimatedSection({
  children,
  className = "",
  id,
  variant = "fade",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "fade" | "slide-up" | "scale";
}) {
  const variants = {
    fade:       { hidden: { opacity: 0 },               visible: { opacity: 1 } },
    "slide-up": { hidden: { opacity: 0, y: 24 },        visible: { opacity: 1, y: 0 } },
    scale:      { hidden: { opacity: 0, scale: 0.95 },  visible: { opacity: 1, scale: 1 } },
  };
  const v = variants[variant];

  return (
    <motion.section
      id={id}
      initial={v.hidden}
      whileInView={v.visible}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, ease: smoothOut }}
      className={`py-20 md:py-28 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────
   BLUR-IN  — blur to clear once on scroll
   ───────────────────────────────────────────── */
export function BlurIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: smoothOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   DRAW LINE  — SVG line drawing animation
   ───────────────────────────────────────────── */
export function DrawLine({
  className = "",
  width = "100%",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <motion.svg
      viewBox="0 0 100 2"
      className={className}
      style={{ width }}
      preserveAspectRatio="none"
    >
      <motion.line
        x1="0"
        y1="1"
        x2="100"
        y2="1"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   MARQUEE  — infinite horizontal scroll
   ───────────────────────────────────────────── */
export function Marquee({
  children,
  className = "",
  speed = 25,
  direction = "left",
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 w-max"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR  — animated width on scroll
   ───────────────────────────────────────────── */
export function AnimatedProgressBar({
  value,
  label,
  className = "",
  delay = 0,
}: {
  value: number;
  label?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={className}>
      {label && <p className="mb-2 text-sm text-white/60">{label}</p>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: smoothOut }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light,#7acc09)]"
        />
      </div>
    </div>
  );
}
```

---

### STEP 4 — Add animation CSS to your global stylesheet

Append the following CSS block to your existing global CSS file (e.g. `globals.css`). Do not remove existing styles. Replace `YOUR_PRIMARY_COLOR` with your brand's primary hex color (e.g. `#65B207`) and `YOUR_PRIMARY_LIGHT` with a 10–15% lighter version of it (e.g. `#7acc09`).

```css
/* ═══════════════════════════════════════════════
   ANIMATION SYSTEM — append to existing globals
   ═══════════════════════════════════════════════ */

html {
  scroll-behavior: smooth;
}

/* ── Page transition ── */
@keyframes page-in {
  from { opacity: 0.95; transform: translateY(6px); }
  to   { opacity: 1;    transform: none; }
}
.animate-page-in {
  animation: page-in 0.45s cubic-bezier(0.33, 1, 0.68, 1) both;
}

/* ── Hover lift for cards ── */
.hover-lift {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.hover-lift:hover {
  will-change: transform;
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 24px 48px rgba(0,0,0,0.25);
}

/* ── Nav link underline ── */
.nav-link-animated {
  position: relative;
}
.nav-link-animated::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: YOUR_PRIMARY_COLOR;
  border-radius: 1px;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.nav-link-animated:hover::after,
.nav-link-animated[data-active="true"]::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* ── Body link underline ── */
.link-hover-underline {
  position: relative;
}
.link-hover-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 1px;
  background: YOUR_PRIMARY_COLOR;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.link-hover-underline:hover::after {
  width: 100%;
}

/* ── Border glow on hover ── */
.border-glow {
  transition: border-color 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow   0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.border-glow:hover {
  border-color: YOUR_PRIMARY_COLOR;
  box-shadow: 0 0 24px YOUR_PRIMARY_COLOR_RGBA_12, inset 0 0 16px YOUR_PRIMARY_COLOR_RGBA_04;
}

/* ── Pulse glow ── */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 transparent; }
  40%       { box-shadow: 0 0 24px 6px YOUR_PRIMARY_COLOR_RGBA_18; }
}
.animate-pulse-glow {
  animation: pulse-glow 3.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

/* ── Shimmer ── */
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  overflow: hidden;
  position: relative;
}
.animate-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  animation: shimmer 3.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

/* ── Gradient shift background ── */
@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

/* ── Breathe ── */
@keyframes breathe {
  0%, 100% { transform: scale(1);    opacity: 0.7; }
  50%       { transform: scale(1.04); opacity: 1; }
}
.animate-breathe {
  animation: breathe 4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

/* ── Slow spin ── */
@keyframes slow-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.animate-slow-spin {
  animation: slow-spin 20s linear infinite;
}

/* ── Marquee ── */
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}

/* ── Scroll progress bar ── */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, YOUR_PRIMARY_COLOR, YOUR_PRIMARY_LIGHT);
  z-index: 9999;
  transform-origin: left;
  will-change: transform;
}

/* ── Image shine on hover ── */
.image-shine {
  position: relative;
  overflow: hidden;
}
.image-shine::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  transform: skewX(-15deg);
  z-index: 2;
}
.image-shine:hover::after {
  left: 150%;
  transition: left 0.7s ease;
}

/* ── Frosted glass ── */
.glass-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(20px) saturate(1.3);
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid rgba(255,255,255,0.08);
}

/* ── Glow behind element ── */
.glow-behind {
  position: relative;
}
.glow-behind::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 60%; height: 60%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, YOUR_PRIMARY_COLOR_RGBA_12 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
  filter: blur(40px);
}

/* ── Social icon hover ── */
.social-icon-hover {
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.social-icon-hover:hover {
  color: YOUR_PRIMARY_COLOR;
  transform: translateY(-2px) scale(1.15);
  filter: drop-shadow(0 0 6px YOUR_PRIMARY_COLOR_RGBA_30);
}

/* ── Animated rotating border ── */
@property --border-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
@keyframes border-rotate {
  to { --border-angle: 360deg; }
}
.animated-border {
  position: relative;
  overflow: hidden;
}
.animated-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(from var(--border-angle), transparent 25%, YOUR_PRIMARY_COLOR 50%, transparent 75%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  animation: border-rotate 4s linear infinite;
}

/* ── Reduced motion safety net ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  html { scroll-behavior: auto; }
}
```

In the CSS above, replace these placeholders with your actual brand color values:
- `YOUR_PRIMARY_COLOR` → your primary hex, e.g. `#65B207`
- `YOUR_PRIMARY_LIGHT` → lighter variant, e.g. `#7acc09`
- `YOUR_PRIMARY_COLOR_RGBA_04` → `rgba(r,g,b,0.04)`
- `YOUR_PRIMARY_COLOR_RGBA_12` → `rgba(r,g,b,0.12)`
- `YOUR_PRIMARY_COLOR_RGBA_18` → `rgba(r,g,b,0.18)`
- `YOUR_PRIMARY_COLOR_RGBA_30` → `rgba(r,g,b,0.30)`

---

### STEP 5 — Usage patterns

Once the files are in place, use the components like this in any page or server component:

```tsx
import {
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  TextReveal,
  AnimatedCounter,
  Parallax,
  FloatingElement,
  GlowCard,
  RevealLine,
  MagneticHover,
  AnimatedSection,
  BlurIn,
  DrawLine,
  Marquee,
  AnimatedProgressBar,
} from "@/components/animations";

// Fade in a headline on scroll
<FadeIn direction="up" delay={0.1}>
  <h2>Your Heading</h2>
</FadeIn>

// Staggered card grid
<StaggerContainer className="grid grid-cols-3 gap-6">
  {items.map(item => (
    <StaggerItem key={item.id}>
      <YourCard {...item} />
    </StaggerItem>
  ))}
</StaggerContainer>

// Animated stat number
<AnimatedCounter target={250} suffix="+" prefix="$" />

// Word-by-word text reveal
<TextReveal text="We build things that move people." tag="h1" />

// Spring-physics hover on a button
<MagneticHover>
  <button>Get Started</button>
</MagneticHover>

// Parallax section background
<Parallax speed={0.2}>
  <img src="/hero-bg.jpg" alt="" />
</Parallax>

// Glow card
<GlowCard className="rounded-2xl bg-card p-6">
  <p>Card content</p>
</GlowCard>
```

Apply CSS utility classes directly on any element:
```html
<!-- Lift on hover -->
<div class="hover-lift">...</div>

<!-- Animated nav link underline -->
<a class="nav-link-animated" href="/about">About</a>

<!-- Border glow on hover -->
<div class="border-glow border border-white/10">...</div>

<!-- Frosted glass panel -->
<div class="glass-card rounded-2xl p-6">...</div>

<!-- Glow orb behind an element -->
<div class="glow-behind">...</div>

<!-- Image with shine on hover -->
<div class="image-shine">
  <img src="..." alt="..." />
</div>

<!-- Rotating gradient border -->
<div class="animated-border rounded-xl p-px">
  <div class="rounded-xl bg-card p-6">...</div>
</div>

<!-- Breathing accent element -->
<div class="animate-breathe">...</div>
```

---

### STEP 6 — Verify

After adding all files, run your dev server and confirm:
1. Navigating between pages shows a subtle fade+rise transition
2. Scrolling down reveals elements smoothly as they enter the viewport
3. Hovering cards shows the lift + glow effects
4. No console errors about missing Framer Motion imports
5. `prefers-reduced-motion` users see no animations (test via browser devtools → Rendering → Emulate prefers-reduced-motion)
