"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, PencilLine, Sparkles } from "lucide-react";
import {
  PIECES,
  METAL_OPTIONS,
  GOLD_METALS,
  KARAT_OPTIONS,
  STONE_OPTIONS,
  STONE_NONE,
  STONE_SHAPE_OPTIONS,
  STONE_AMOUNT_OPTIONS,
  TIMELINE_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  getPiece,
  type PieceType,
} from "@/lib/builder";
import { BUDGET_OPTIONS } from "@/lib/cta";
import { BLUR_DATA_URL, siteConfig } from "@/lib/constants";
import {
  PieceRendering,
  MetalSwatch,
  StoneSwatch,
  ShapeSwatch,
  CoverageSwatch,
} from "./renderings";

/* ── Wizard state ─────────────────────────────────────────── */

interface Spec {
  piece: PieceType | "";
  style: string;
  metal: string;
  karat: string;
  stones: string;
  stoneShape: string;
  stoneAmount: string;
  size: string;
  engraving: string;
  budget: string;
  timeline: string;
  notes: string;
}

const EMPTY_SPEC: Spec = {
  piece: "",
  style: "",
  metal: "",
  karat: "",
  stones: "",
  stoneShape: "",
  stoneAmount: "",
  size: "",
  engraving: "",
  budget: "",
  timeline: "",
  notes: "",
};

const STEPS = ["Piece", "Style", "Metal", "Stones", "Details", "Send It"] as const;

const inputClass =
  "w-full rounded-xs border border-[#14141A]/15 bg-white px-4 py-3 text-sm text-[#14141A] placeholder:text-[#14141A]/40 focus:border-[#C68A17] focus:outline-none focus:ring-2 focus:ring-[#C68A17]/25";

const labelClass = "mb-1.5 block text-sm font-semibold text-[#14141A]";

/* ── Option cards ─────────────────────────────────────────── */

/** Card with a visual on top — used for styles, shapes, and coverage. */
function VisualCard({
  selected,
  onClick,
  title,
  description,
  visual,
  visualClass = "",
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  visual: ReactNode;
  visualClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex flex-col border bg-white text-left transition-all duration-200 ${
        selected
          ? "border-[#C68A17] ring-1 ring-[#C68A17] shadow-[0_6px_20px_-8px_rgba(198,138,23,0.35)]"
          : "border-[#14141A]/15 hover:-translate-y-0.5 hover:border-[#C68A17]/60 hover:shadow-[0_8px_24px_-12px_rgba(20,20,26,0.25)]"
      }`}
    >
      <span
        className={`absolute right-2.5 top-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
          selected ? "border-[#C68A17] bg-[#C68A17] text-white" : "border-[#14141A]/20 bg-white text-transparent"
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </span>
      <span className={`flex items-center justify-center bg-[#FFFDF8] ${visualClass}`}>{visual}</span>
      <span className="mt-auto border-t border-[#14141A]/10 px-3.5 py-2.5">
        <span className={`block text-sm font-semibold ${selected ? "text-[#A87310]" : "text-[#14141A]"}`}>
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs leading-snug text-[#14141A]/55">{description}</span>
        )}
      </span>
    </button>
  );
}

/** Swatch beside a label — used for metals, karats, and stones. */
function SwatchChip({
  selected,
  onClick,
  label,
  sublabel,
  visual,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string;
  visual: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-3 rounded-xs border bg-white px-4 py-3 text-left transition-all duration-200 ${
        selected
          ? "border-[#C68A17] ring-1 ring-[#C68A17]"
          : "border-[#14141A]/15 hover:-translate-y-0.5 hover:border-[#C68A17]/60"
      }`}
    >
      <span className="shrink-0">{visual}</span>
      <span className="min-w-0">
        <span className={`block truncate text-sm font-semibold ${selected ? "text-[#A87310]" : "text-[#14141A]"}`}>
          {label}
        </span>
        {sublabel && <span className="block text-xs text-[#14141A]/50">{sublabel}</span>}
      </span>
    </button>
  );
}

/** Plain text chip — budget and timeline. */
function TextChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xs border px-4 py-2.5 text-sm font-medium transition-colors ${
        selected
          ? "border-[#C68A17] bg-[#C68A17]/8 text-[#A87310] ring-1 ring-[#C68A17]"
          : "border-[#14141A]/15 bg-white text-[#14141A]/70 hover:border-[#C68A17]/50"
      }`}
    >
      {children}
    </button>
  );
}

/* One row of the running spec sheet — click to jump back and edit. */
function SpecRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  const inner = (
    <>
      <span className="shrink-0 font-semibold text-[#14141A]/70">{label}</span>
      <span className="dotted-leader" />
      <span className={`min-w-0 truncate text-right font-medium ${value ? "text-[#14141A]" : "text-[#14141A]/30"}`}>
        {value || "—"}
      </span>
    </>
  );
  if (!onEdit || !value) {
    return <div className="flex items-baseline text-sm">{inner}</div>;
  }
  return (
    <button
      type="button"
      onClick={onEdit}
      title={`Edit ${label.toLowerCase()}`}
      className="group flex w-full items-baseline text-sm transition-colors hover:text-[#A87310]"
    >
      {inner}
      <PencilLine
        size={11}
        className="ml-1.5 shrink-0 self-center text-[#14141A]/25 transition-colors group-hover:text-[#A87310]"
      />
    </button>
  );
}

const KARAT_SUBLABELS: Record<string, string> = {
  "10K": "Durable, everyday",
  "14K": "Most popular",
  "18K": "Richest color",
  "Not sure yet": "We'll advise",
};

/** Long option labels get trimmed for the narrow spec-sheet rows. */
function shortLabel(value: string): string {
  return value.split(" (")[0];
}

export function DesignClient({ aiRenders = false }: { aiRenders?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [spec, setSpec] = useState<Spec>(EMPTY_SPEC);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Photoreal AI preview
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [aiRenderedKey, setAiRenderedKey] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const piece = spec.piece ? getPiece(spec.piece) : undefined;
  const isGold = GOLD_METALS.includes(spec.metal);
  const hasStones = !!spec.stones && spec.stones !== STONE_NONE;

  const set = (patch: Partial<Spec>) => setSpec((s) => ({ ...s, ...patch }));

  function goTo(target: number) {
    setError(null);
    setStep(target);
    setMaxStep((m) => Math.max(m, target));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const next = () => goTo(Math.min(step + 1, STEPS.length - 1));
  const back = () => goTo(Math.max(step - 1, 0));

  const canContinue =
    (step === 0 && !!spec.piece) ||
    (step === 1 && !!spec.style) ||
    (step === 2 && !!spec.metal) ||
    (step === 3 && !!spec.stones) ||
    step === 4;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const payload = {
      ...spec,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      contactMethod: String(fd.get("contactMethod") || ""),
      aiPreviewed: !!aiImage,
      confirm_url: String(fd.get("confirm_url") || ""), // honeypot
    };

    if (!payload.name || !payload.email || !payload.phone) {
      setError("Please fill in your name, email, and phone so we can reach you.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      router.push("/contact/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  /* Remount (crossfade) the sketch when the drawing changes shape. */
  const renderKey = `${spec.piece}|${spec.style}|${spec.stones}|${spec.stoneShape}|${spec.stoneAmount}`;
  /* The AI render also depends on metal and engraving. */
  const aiKey = `${renderKey}|${spec.metal}|${spec.karat}|${spec.engraving}`;
  const aiStale = !!aiImage && aiRenderedKey !== aiKey;
  const canRender = !!spec.piece && !!spec.style && !!spec.metal && !aiLoading;

  async function generatePreview() {
    if (!canRender) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/design/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          piece: spec.piece,
          style: spec.style,
          metal: spec.metal,
          karat: spec.karat,
          stones: spec.stones,
          stoneShape: spec.stoneShape,
          stoneAmount: spec.stoneAmount,
          engraving: spec.engraving,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || "We couldn't render the preview right now.");
      }
      setAiImage(body.image);
      setAiRenderedKey(aiKey);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "We couldn't render the preview right now.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white">
        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-36 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#F0A92D]">Design Your Own</p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.06] tracking-tight md:text-5xl">
            Build the piece.{" "}
            <em className="font-medium italic text-[#F0A92D]">We&apos;ll make it real.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">
            Pick the piece, style, metal, and stones — and watch your design take
            shape as you go. It lands straight on our jewelers&apos; bench: no
            commitment, no payment, just an honest quote.
          </p>
        </div>
      </section>

      {/* ── Wizard ───────────────────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-12 text-[#14141A] md:py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          {/* Step rail — visited steps are clickable */}
          <ol className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#14141A]/10 pb-5">
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              const reachable = i <= maxStep && i !== step;
              const body = (
                <>
                  <span className={`tabular-nums ${active ? "text-[#A87310]" : done ? "text-[#14141A]/70" : "text-[#14141A]/35"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={active ? "text-[#14141A]" : done ? "text-[#14141A]/70" : "text-[#14141A]/35"}>
                    {label}
                  </span>
                  {done && <Check size={12} className="text-[#C68A17]" />}
                </>
              );
              return (
                <li key={label} className="font-label text-xs font-medium uppercase tracking-[0.18em]">
                  {reachable ? (
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className="flex items-center gap-2 transition-opacity hover:opacity-70"
                    >
                      {body}
                    </button>
                  ) : (
                    <span className="flex items-center gap-2">{body}</span>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-10 grid gap-12 lg:grid-cols-[7fr_4fr]">
            {/* ── Step content ── */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Step 1 — Piece */}
                  {step === 0 && (
                    <>
                      <h2 className="text-2xl tracking-tight md:text-3xl">
                        What are we <em className="font-medium italic text-[#A87310]">building</em>?
                      </h2>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        {PIECES.map((p) => {
                          const selected = spec.piece === p.type;
                          return (
                            <button
                              key={p.type}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => {
                                // Changing piece resets style + size (they're piece-specific)
                                set(
                                  selected
                                    ? { piece: p.type }
                                    : { piece: p.type, style: "", size: "" }
                                );
                                next();
                              }}
                              className={`group border p-2 text-left transition-all duration-200 ${
                                selected
                                  ? "border-[#C68A17] ring-1 ring-[#C68A17]"
                                  : "border-[#14141A]/15 hover:-translate-y-0.5 hover:border-[#C68A17]/60 hover:shadow-[0_10px_28px_-14px_rgba(20,20,26,0.3)]"
                              }`}
                            >
                              <div className="relative aspect-4/3 overflow-hidden bg-[#14141A]">
                                <Image
                                  src={p.image}
                                  alt={p.label}
                                  fill
                                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                                  placeholder="blur"
                                  blurDataURL={BLUR_DATA_URL}
                                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                              </div>
                              <div className="flex items-center justify-between px-2 pb-2 pt-3">
                                <div>
                                  <span className="block font-heading text-lg font-bold">{p.label}</span>
                                  <span className="mt-0.5 block text-xs text-[#14141A]/55">{p.tagline}</span>
                                </div>
                                <ArrowRight
                                  size={18}
                                  className={selected ? "text-[#C68A17]" : "text-[#14141A]/30 transition-colors group-hover:text-[#C68A17]"}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Step 2 — Style, sketched live per option */}
                  {step === 1 && piece && (
                    <>
                      <h2 className="text-2xl tracking-tight md:text-3xl">
                        Pick a <em className="font-medium italic text-[#A87310]">style</em> for your {piece.label.toLowerCase()}.
                      </h2>
                      <p className="mt-2 text-sm text-[#14141A]/55">
                        Every sketch redraws in your metal and stones as you choose them.
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                        {piece.styles.map((s) => (
                          <VisualCard
                            key={s.value}
                            selected={spec.style === s.value}
                            onClick={() => set({ style: s.value })}
                            title={s.value}
                            description={s.description}
                            visualClass="aspect-square w-full p-1.5"
                            visual={<PieceRendering spec={{ ...spec, style: s.value }} />}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Step 3 — Metal */}
                  {step === 2 && (
                    <>
                      <h2 className="text-2xl tracking-tight md:text-3xl">
                        Choose your <em className="font-medium italic text-[#A87310]">metal</em>.
                      </h2>
                      <p className="mt-2 text-sm text-[#14141A]/55">
                        Watch the sketch take on the color you pick.
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {METAL_OPTIONS.map((m) => (
                          <SwatchChip
                            key={m}
                            selected={spec.metal === m}
                            onClick={() =>
                              set({ metal: m, karat: GOLD_METALS.includes(m) ? spec.karat : "" })
                            }
                            label={m}
                            visual={<MetalSwatch metal={m} size={40} />}
                          />
                        ))}
                      </div>
                      {isGold && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8"
                        >
                          <p className="text-sm font-semibold">Karat</p>
                          <p className="mt-0.5 text-xs text-[#14141A]/55">
                            Higher karat means richer color — the swatches show the difference.
                          </p>
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {KARAT_OPTIONS.map((k) => (
                              <SwatchChip
                                key={k}
                                selected={spec.karat === k}
                                onClick={() => set({ karat: k })}
                                label={k}
                                sublabel={KARAT_SUBLABELS[k]}
                                visual={<MetalSwatch metal={spec.metal || "Yellow gold"} karat={k} size={34} />}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Step 4 — Stones */}
                  {step === 3 && (
                    <>
                      <h2 className="text-2xl tracking-tight md:text-3xl">
                        Now the <em className="font-medium italic text-[#A87310]">stones</em>.
                      </h2>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {STONE_OPTIONS.map((s) => (
                          <SwatchChip
                            key={s}
                            selected={spec.stones === s}
                            onClick={() =>
                              set(
                                s === STONE_NONE
                                  ? { stones: s, stoneShape: "", stoneAmount: "" }
                                  : { stones: s }
                              )
                            }
                            label={s}
                            visual={<StoneSwatch stone={s} size={40} />}
                          />
                        ))}
                      </div>
                      {hasStones && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                          <div className="mt-10">
                            <p className="text-sm font-semibold">Stone shape</p>
                            <p className="mt-0.5 text-xs text-[#14141A]/55">
                              The classic cuts — pick the silhouette you love.
                            </p>
                            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                              {STONE_SHAPE_OPTIONS.map((o) => (
                                <VisualCard
                                  key={o}
                                  selected={spec.stoneShape === o}
                                  onClick={() => set({ stoneShape: o })}
                                  title={o}
                                  visualClass="pt-3"
                                  visual={<ShapeSwatch shape={o} stone={spec.stones} size={52} />}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="mt-10">
                            <p className="text-sm font-semibold">How much sparkle?</p>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                              {STONE_AMOUNT_OPTIONS.map((o) => (
                                <VisualCard
                                  key={o}
                                  selected={spec.stoneAmount === o}
                                  onClick={() => set({ stoneAmount: o })}
                                  title={o}
                                  visualClass="pt-3"
                                  visual={<CoverageSwatch amount={o} stone={spec.stones} size={52} />}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Step 5 — Details */}
                  {step === 4 && piece && (
                    <>
                      <h2 className="text-2xl tracking-tight md:text-3xl">
                        A few <em className="font-medium italic text-[#A87310]">details</em>.
                      </h2>
                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="size" className={labelClass}>
                            {piece.sizeLabel}
                          </label>
                          <select
                            id="size"
                            value={spec.size}
                            onChange={(e) => set({ size: e.target.value })}
                            className={inputClass}
                          >
                            <option value="">Select...</option>
                            {piece.sizeOptions.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="engraving" className={labelClass}>
                            Engraving <span className="font-normal text-[#14141A]/50">(optional)</span>
                          </label>
                          <input
                            id="engraving"
                            type="text"
                            maxLength={120}
                            value={spec.engraving}
                            onChange={(e) => set({ engraving: e.target.value })}
                            placeholder="A name, date, or message"
                            className={inputClass}
                          />
                          {spec.engraving && (
                            <p className="mt-1.5 text-xs text-[#A87310]">
                              It appears on the sketch for nameplates, signets, and ID pieces.
                            </p>
                          )}
                        </div>
                        <div className="sm:col-span-2">
                          <p className={labelClass}>Ballpark budget</p>
                          <div className="flex flex-wrap gap-2.5">
                            {BUDGET_OPTIONS.map((o) => (
                              <TextChip key={o} selected={spec.budget === o} onClick={() => set({ budget: o })}>
                                {o}
                              </TextChip>
                            ))}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <p className={labelClass}>When do you need it?</p>
                          <div className="flex flex-wrap gap-2.5">
                            {TIMELINE_OPTIONS.map((o) => (
                              <TextChip key={o} selected={spec.timeline === o} onClick={() => set({ timeline: o })}>
                                {o}
                              </TextChip>
                            ))}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="notes" className={labelClass}>
                            Anything else? <span className="font-normal text-[#14141A]/50">(optional)</span>
                          </label>
                          <textarea
                            id="notes"
                            rows={4}
                            maxLength={2000}
                            value={spec.notes}
                            onChange={(e) => set({ notes: e.target.value })}
                            placeholder="Describe your idea, mention a photo you've seen, or ask a question. If you have reference photos, we'll ask for them when we reply."
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 6 — Contact + review */}
                  {step === 5 && (
                    <>
                      <h2 className="text-2xl tracking-tight md:text-3xl">
                        Send it to <em className="font-medium italic text-[#A87310]">our jewelers</em>.
                      </h2>
                      <p className="mt-2 text-sm text-[#14141A]/60">
                        We&apos;ll review your design and get back to you with options and an
                        honest quote. No payment, no obligation.
                      </p>
                      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2" noValidate>
                        {/* Honeypot — hidden from real users */}
                        <input
                          type="text"
                          name="confirm_url"
                          tabIndex={-1}
                          autoComplete="off"
                          className="hidden"
                          aria-hidden="true"
                        />
                        <div>
                          <label htmlFor="name" className={labelClass}>Name *</label>
                          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="phone" className={labelClass}>Phone *</label>
                          <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="email" className={labelClass}>Email *</label>
                          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="contactMethod" className={labelClass}>Best way to reach you</label>
                          <select id="contactMethod" name="contactMethod" defaultValue="" className={inputClass}>
                            <option value="">No preference</option>
                            {CONTACT_METHOD_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>

                        {error && (
                          <p className="sm:col-span-2 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                            {error}
                          </p>
                        )}

                        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn-gold inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {submitting ? (
                              <>
                                <Loader2 size={16} className="animate-spin" /> Sending...
                              </>
                            ) : (
                              <>
                                Submit My Design <ArrowRight size={16} />
                              </>
                            )}
                          </button>
                          <p className="text-xs text-[#14141A]/50">
                            Or call us at{" "}
                            <a href={`tel:${siteConfig.phone.replace(/\D/g, "")}`} className="font-semibold text-[#A87310] hover:underline">
                              {siteConfig.phone}
                            </a>
                          </p>
                        </div>
                      </form>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Back / Continue */}
              {step > 0 && step < 5 && (
                <div className="mt-10 flex items-center justify-between border-t border-[#14141A]/10 pt-6">
                  <button
                    type="button"
                    onClick={back}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#14141A]/60 transition-colors hover:text-[#14141A]"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canContinue}
                    className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              )}
              {step === 5 && (
                <button
                  type="button"
                  onClick={back}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#14141A]/60 transition-colors hover:text-[#14141A]"
                >
                  <ArrowLeft size={16} /> Back to details
                </button>
              )}
            </div>

            {/* ── Live spec sheet ── */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-[#14141A]/15 bg-white p-6 md:p-7">
                <p className="eyebrow-rule font-heading text-[#A87310]">Your Design</p>

                {/* Live preview: AI render when available, sketch otherwise */}
                <div className="relative mt-4 aspect-square border border-[#14141A]/10 bg-[#FFFDF8]">
                  {aiLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#14141A] text-center">
                      <Loader2 size={26} className="animate-spin text-[#F0A92D]" />
                      <span className="px-8 text-xs leading-relaxed text-white/70">
                        Rendering your piece in the studio... this takes about
                        half a minute.
                      </span>
                    </div>
                  ) : aiImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL */}
                      <img
                        src={aiImage}
                        alt="AI preview of your custom design"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {aiStale && (
                        <span className="absolute inset-x-0 top-0 bg-[#14141A]/80 px-3 py-1.5 text-center font-label text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#F0A92D]">
                          Selections changed — re-render to update
                        </span>
                      )}
                    </>
                  ) : spec.piece ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={renderKey}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.22 }}
                        className="absolute inset-0 p-3"
                      >
                        <PieceRendering spec={spec} />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                      <span className="font-heading text-4xl italic text-[#C68A17]/40">?</span>
                      <span className="px-6 text-xs text-[#14141A]/45">
                        Choose a piece to start sketching your design.
                      </span>
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2.5 font-label text-[0.6rem] uppercase tracking-[0.18em] text-[#14141A]/35 mix-blend-difference">
                    {aiImage && !aiLoading ? "AI studio preview" : "Live sketch"}
                  </span>
                </div>

                {/* Photoreal render controls */}
                {aiRenders && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={generatePreview}
                      disabled={!canRender}
                      className={`inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 ${
                        aiImage && !aiStale ? "btn-outline-gold text-[#A87310]!" : "btn-gold"
                      }`}
                    >
                      <Sparkles size={15} />
                      {aiLoading
                        ? "Rendering..."
                        : aiImage
                          ? aiStale
                            ? "Re-render preview"
                            : "Render again"
                          : "See it photoreal"}
                    </button>
                    {!spec.metal && !aiImage && (
                      <p className="mt-1.5 text-center text-xs text-[#14141A]/45">
                        Pick a style and metal to unlock the studio render.
                      </p>
                    )}
                    {aiError && (
                      <p className="mt-1.5 text-center text-xs text-red-700" role="alert">
                        {aiError}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-5 space-y-2.5">
                  <SpecRow label="Piece" value={piece?.label ?? ""} onEdit={() => goTo(0)} />
                  <SpecRow label="Style" value={spec.style} onEdit={() => goTo(1)} />
                  <SpecRow
                    label="Metal"
                    value={isGold && spec.karat && spec.karat !== "Not sure yet" ? `${spec.karat} ${spec.metal.toLowerCase()}` : spec.metal}
                    onEdit={() => goTo(2)}
                  />
                  <SpecRow label="Stones" value={shortLabel(spec.stones)} onEdit={() => goTo(3)} />
                  {hasStones && <SpecRow label="Shape" value={spec.stoneShape} onEdit={() => goTo(3)} />}
                  {hasStones && <SpecRow label="Coverage" value={spec.stoneAmount} onEdit={() => goTo(3)} />}
                  <SpecRow label={piece?.sizeLabel ?? "Size"} value={spec.size} onEdit={() => goTo(4)} />
                  {spec.engraving && <SpecRow label="Engraving" value={`"${spec.engraving}"`} onEdit={() => goTo(4)} />}
                  <SpecRow label="Budget" value={spec.budget} onEdit={() => goTo(4)} />
                  <SpecRow label="Timeline" value={spec.timeline} onEdit={() => goTo(4)} />
                </div>
                <p className="mt-6 border-t border-[#14141A]/10 pt-4 text-xs leading-relaxed text-[#14141A]/55">
                  The sketch is illustrative, not to scale. A real jeweler reviews
                  every submission and replies with options and pricing.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
