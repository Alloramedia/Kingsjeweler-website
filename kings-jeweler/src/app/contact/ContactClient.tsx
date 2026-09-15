"use client";

import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  ImagePlus,
  X,
} from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { hasMarketingConsent, metaTrack, newMetaEventId } from "@/lib/meta-pixel";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { HOW_HEARD_OPTIONS } from "@/lib/cta";
import {
  SERVICE_CARDS,
  FOLLOW_UPS,
  PHOTO_PROMPTS,
  DEFAULT_PHOTO_PROMPT,
  type ServiceHelp,
} from "@/lib/contact-form";

interface ContactClientProps {
  heroSlides: string[];
  heroImage: string;
  /** Pre-selects the service (deep links like /contact?help=Gold+Buying...). */
  initialHelp?: string;
}

const inputClass =
  "w-full rounded-xs border border-[#14141A]/15 bg-white px-4 py-3 text-sm text-[#14141A] placeholder:text-[#14141A]/40 focus:border-[#C68A17] focus:outline-none focus:ring-2 focus:ring-[#C68A17]/25";

const labelClass = "mb-1.5 block text-sm font-semibold text-[#14141A]";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

const STEP_LABELS = ["Service", "Details", "Send"] as const;

function isServiceHelp(value: string | undefined): value is ServiceHelp {
  return !!value && SERVICE_CARDS.some((c) => c.value === value);
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xs border px-3.5 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-[#C68A17] bg-[#C68A17] text-white"
          : "border-[#14141A]/20 bg-white text-[#14141A]/75 hover:border-[#C68A17]/60 hover:text-[#14141A]"
      }`}
    >
      {children}
    </button>
  );
}

export function ContactClient({ heroSlides, initialHelp }: ContactClientProps) {
  const router = useRouter();
  const presetHelp = isServiceHelp(initialHelp) ? initialHelp : undefined;

  const [step, setStep] = useState(presetHelp ? 1 : 0);
  const [help, setHelp] = useState<ServiceHelp | "">(presetHelp ?? "");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "", message: "", howHeard: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const followUps = help ? FOLLOW_UPS[help] : [];
  const photoPrompt = (help && PHOTO_PROMPTS[help]) || DEFAULT_PHOTO_PROMPT;

  function goTo(target: number) {
    setError(null);
    setStep(target);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pickService(value: ServiceHelp) {
    if (value !== help) setAnswers({});
    setHelp(value);
    goTo(1);
  }

  function setAnswer(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: a[key] === value ? "" : value }));
  }

  function toggleAnswer(key: string, value: string) {
    setAnswers((a) => {
      const current = Array.isArray(a[key]) ? (a[key] as string[]) : [];
      return {
        ...a,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  }

  function onPhotoChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't a photo. Please choose a JPG, PNG, or HEIC image.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("That photo is too large. Please use one under 8 MB.");
      return;
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step !== 2) {
      if (step === 0 && !help) {
        setError("Pick the option closest to what you need.");
        return;
      }
      goTo(step + 1);
      return;
    }

    setError(null);
    const fd = new FormData(e.currentTarget);

    if (!contact.name || !contact.email || !contact.phone) {
      setError("Please fill in your name, email, and phone so we can reach you.");
      return;
    }

    // Meta dedup id — only sent when the visitor hasn't declined cookies,
    // which also gates the server-side CAPI mirror of this lead.
    const eventId = hasMarketingConsent() ? newMetaEventId() : "";

    setSubmitting(true);
    try {
      // Upload the reference photo first (if any) so the lead links to it.
      let photoUrl = "";
      if (photoFile) {
        const uploadData = new FormData();
        uploadData.append("file", photoFile);
        const uploadRes = await fetch("/api/contact/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadBody = await uploadRes.json().catch(() => null);
        if (!uploadRes.ok) {
          throw new Error(uploadBody?.error || "We couldn't upload your photo. Try again or remove it.");
        }
        photoUrl = uploadBody?.url ?? "";
      }

      // Follow-up answers → label/value rows for the admin inbox.
      // "occasion" and "budget" ride in their dedicated API fields.
      const answerRows: { label: string; value: string }[] = [];
      let eventType = "";
      let budget = "";
      for (const q of followUps) {
        const raw = answers[q.key];
        const value = Array.isArray(raw) ? raw.join(", ") : (raw ?? "");
        if (!value) continue;
        if (q.key === "occasion") eventType = value;
        else if (q.key === "budget") budget = value;
        else answerRows.push({ label: q.label, value });
      }

      const payload = {
        name: contact.name,
        business: "",
        email: contact.email,
        phone: contact.phone,
        help,
        eventType,
        budget,
        howHeard: contact.howHeard,
        message: contact.message,
        answers: answerRows,
        photoUrl,
        eventId,
        confirm_url: String(fd.get("confirm_url") || ""), // honeypot
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      if (eventId) metaTrack("Lead", { content_name: help }, eventId);
      router.push("/contact/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white">
        <HeroSlideshow
          images={heroSlides}
          alt="Fine jewelry at King's Jeweler"
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#14141A]/60 via-[#14141A]/70 to-[#14141A]" />
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-40 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#F0A92D]">
            Visit Us
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.06] tracking-tight md:text-6xl">
            Stop by, call, or{" "}
            <em className="font-medium italic text-[#F0A92D]">send a message</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            No appointment needed. We&apos;re inside The Shoppes at Buckland
            Hills seven days a week. For anything else, the form below
            reaches us directly.
          </p>
        </div>
      </section>

      {/* ── Info + form ──────────────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[2fr_3fr] lg:px-8">
          {/* Store info — second on mobile so the form leads */}
          <div className="order-2 space-y-6 lg:order-1">
            <div className="border border-[#14141A]/15 bg-white p-7">
              <div className="flex items-start gap-4">
                <MapPin size={22} className="mt-0.5 shrink-0 text-[#C68A17]" />
                <div>
                  <h2 className="font-bold">Our Store</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#14141A]/65">
                    {siteConfig.address.suite}
                    <br />
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.city}, {siteConfig.address.region}{" "}
                    {siteConfig.address.zip}
                  </p>
                  <a
                    href={siteConfig.socials.gmb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#C68A17] hover:underline"
                  >
                    Get directions
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-[#14141A]/15 bg-white p-7">
              <div className="flex items-start gap-4">
                <Clock size={22} className="mt-0.5 shrink-0 text-[#C68A17]" />
                <div>
                  <h2 className="font-bold">Store Hours</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#14141A]/65">
                    Monday – Friday: 11:00 AM – 7:00 PM
                    <br />
                    Saturday: 11:00 AM – 8:00 PM
                    <br />
                    Sunday: 11:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-[#14141A]/15 bg-white p-7">
              <div className="flex items-start gap-4">
                <Phone size={22} className="mt-0.5 shrink-0 text-[#C68A17]" />
                <div>
                  <h2 className="font-bold">Call or Email</h2>
                  <p className="mt-1 text-sm text-[#14141A]/65">
                    <a
                      href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                      className="font-medium text-[#C68A17] hover:underline"
                    >
                      {siteConfig.phone}
                    </a>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#14141A]/65">
                    <Mail size={14} />
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-medium text-[#C68A17] hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-[#14141A]/15 bg-white p-7">
              <h2 className="font-bold">What happens next?</h2>
              <ol className="mt-3 space-y-3">
                {[
                  "We read your message the same day it arrives.",
                  "A jeweler calls or emails you within one business day.",
                  "Stop in whenever works — no appointment needed.",
                ].map((item, i) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#14141A]/65">
                    <span className="font-heading font-semibold text-[#A87310]">
                      0{i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Form — 3-step wizard */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 scroll-mt-28 lg:order-2"
          >
            <form
              onSubmit={handleSubmit}
              className="border border-[#14141A]/15 bg-white p-7 md:p-9"
              noValidate
            >
              {/* Progress */}
              <div className="flex items-center justify-between gap-4">
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-[#A87310]">
                  Step {step + 1} of 3 — {STEP_LABELS[step]}
                </p>
                <div className="flex gap-1.5" aria-hidden="true">
                  {STEP_LABELS.map((label, i) => (
                    <span
                      key={label}
                      className={`h-1 w-8 rounded-full ${i <= step ? "bg-[#C68A17]" : "bg-[#14141A]/10"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                name="confirm_url"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step-service"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="mt-5 text-xl font-bold">What can we help with?</h2>
                    <p className="mt-1 text-sm text-[#14141A]/60">
                      Choose the option closest to what you need — we&apos;ll tailor
                      the rest around it.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {SERVICE_CARDS.map((card) => {
                        const active = help === card.value;
                        return (
                          <button
                            key={card.value}
                            type="button"
                            onClick={() => pickService(card.value)}
                            aria-pressed={active}
                            className={`rounded-xs border p-4 text-left transition-colors ${
                              card.featured
                                ? `border-[#A87310] bg-[#C68A17] hover:bg-[#A87310] ${active ? "ring-2 ring-[#14141A]/40" : ""}`
                                : active
                                  ? "border-[#C68A17] bg-[#C68A17]/5 ring-1 ring-[#C68A17]"
                                  : "border-[#14141A]/15 hover:border-[#C68A17]/60"
                            }`}
                          >
                            <span className="flex items-start justify-between gap-2">
                              <span className={`font-semibold ${card.featured ? "text-white" : "text-[#14141A]"}`}>
                                {card.value}
                              </span>
                              {active && (
                                <Check size={16} className={`mt-0.5 shrink-0 ${card.featured ? "text-white" : "text-[#C68A17]"}`} />
                              )}
                            </span>
                            <span className={`mt-1 block text-sm leading-relaxed ${card.featured ? "text-white/85" : "text-[#14141A]/60"}`}>
                              {card.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 1 && help && (
                  <motion.div
                    key="step-details"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="mt-5 text-xl font-bold">{help}</h2>
                    <p className="mt-1 text-sm text-[#14141A]/60">
                      A few quick questions so the right jeweler can prep for you.
                      Everything here is optional.
                    </p>
                    <div className="mt-6 space-y-6">
                      {followUps.map((q) => (
                        <div key={q.key}>
                          <p className={labelClass}>{q.label}</p>
                          {q.kind === "text" ? (
                            <input
                              value={typeof answers[q.key] === "string" ? (answers[q.key] as string) : ""}
                              onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                              className={inputClass}
                              placeholder={q.placeholder}
                              maxLength={120}
                            />
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {q.options?.map((opt) => (
                                <Chip
                                  key={opt}
                                  active={
                                    q.kind === "multi"
                                      ? Array.isArray(answers[q.key]) && (answers[q.key] as string[]).includes(opt)
                                      : answers[q.key] === opt
                                  }
                                  onClick={() =>
                                    q.kind === "multi" ? toggleAnswer(q.key, opt) : setAnswer(q.key, opt)
                                  }
                                >
                                  {opt}
                                </Chip>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-send"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="mt-5 text-xl font-bold">How do we reach you?</h2>
                    <p className="mt-1 text-sm text-[#14141A]/60">
                      We&apos;ll get back to you within one business day.
                    </p>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          Name *
                        </label>
                        <input
                          id="name"
                          required
                          className={inputClass}
                          placeholder="Your name"
                          autoComplete="name"
                          value={contact.name}
                          onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelClass}>
                          Phone *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          className={inputClass}
                          placeholder="(860) 555-0100"
                          autoComplete="tel"
                          value={contact.phone}
                          onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="email" className={labelClass}>
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          className={inputClass}
                          placeholder="you@example.com"
                          autoComplete="email"
                          value={contact.email}
                          onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="message" className={labelClass}>
                          Anything else we should know?
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className={inputClass}
                          placeholder="Tell us about the piece, the repair, or the idea…"
                          value={contact.message}
                          onChange={(e) => setContact((c) => ({ ...c, message: e.target.value }))}
                        />
                      </div>

                      {/* Reference photo (optional, one image) */}
                      <div className="sm:col-span-2">
                        <p className={labelClass}>Add a photo</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onPhotoChange}
                        />
                        {photoPreview ? (
                          <div className="flex items-center gap-4 rounded-xs border border-[#14141A]/15 bg-[#FBF9F4] p-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photoPreview}
                              alt="Your reference photo"
                              className="h-16 w-16 rounded-xs border border-[#14141A]/10 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-[#14141A]">
                                {photoFile?.name}
                              </p>
                              <p className="text-xs text-[#14141A]/55">
                                Attached — we&apos;ll see it with your message.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="rounded-xs p-2 text-[#14141A]/50 transition-colors hover:bg-[#14141A]/5 hover:text-[#14141A]"
                              aria-label="Remove photo"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full items-center gap-3 rounded-xs border border-dashed border-[#14141A]/25 bg-[#FBF9F4] px-4 py-4 text-left transition-colors hover:border-[#C68A17]/70"
                          >
                            <ImagePlus size={20} className="shrink-0 text-[#C68A17]" />
                            <span className="text-sm text-[#14141A]/65">{photoPrompt}</span>
                          </button>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="howHeard" className={labelClass}>
                          How did you hear about us?
                        </label>
                        <select
                          id="howHeard"
                          className={inputClass}
                          value={contact.howHeard}
                          onChange={(e) => setContact((c) => ({ ...c, howHeard: e.target.value }))}
                        >
                          <option value="">Optional…</option>
                          {HOW_HEARD_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p className="mt-5 rounded-xs bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              {/* Navigation */}
              <div className="mt-7 flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14141A]/60 transition-colors hover:text-[#14141A]"
                  >
                    <ArrowLeft size={15} />
                    Back
                  </button>
                ) : (
                  <span />
                )}
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 0 && !help) {
                        setError("Pick the option closest to what you need.");
                        return;
                      }
                      goTo(step + 1);
                    }}
                    className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
