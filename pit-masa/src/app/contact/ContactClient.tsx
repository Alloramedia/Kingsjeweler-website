"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Flame,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Section } from "@/components/Section";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { HeroBanner } from "@/components/HeroBanner";
import {
  BUDGET_OPTIONS,
  CATERING_HELP_OPTIONS,
  EVENT_TYPE_OPTIONS,
  GUEST_COUNT_OPTIONS,
  MEAL_PROGRAM_OPTIONS,
  SERVICE_STYLE_OPTIONS,
  SETUP_NEEDS_OPTIONS,
  HOW_HEARD_OPTIONS,
} from "@/lib/cta";

const inputClasses =
  "w-full rounded-lg border border-[#1C1C1C]/15 bg-white px-4 py-3 text-base text-[#1C1C1C] placeholder:text-[#1C1C1C]/40 transition-all duration-300 focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 focus:outline-none";

/** Short helper text shown under each service option in step one. */
const HELP_SUBTITLES: Record<string, string> = {
  "Pit Trailer (Wood-Fired BBQ)": "Brisket, ribs & pulled pork smoked low-and-slow, carved on-site",
  "Food Truck (Live Taco Bar)": "Birria & carne asada off the comal, tortillas pressed to order",
  "The Full Spread (Trailer + Truck)": "Both rigs together — smoked BBQ and a live taco bar in one booking",
  "Holiday Meal Pack": "Ready-to-serve feasts you just heat and enjoy",
  "Weekly Meal Prep": "Chef-prepped meals delivered on a schedule",
  "Pre-Made Meals": "Grab-and-go meals ready when you are",
  "Not Sure Yet": "Tell us your vision — we'll help you build the menu",
};

/** Services delivered or picked up rather than catered on-site at an event. */
const MEAL_PROGRAMS: readonly string[] = MEAL_PROGRAM_OPTIONS;

const WIZARD_STEPS = [
  { key: "service", label: "Service" },
  { key: "event", label: "Your event" },
  { key: "logistics", label: "Date & place" },
  { key: "details", label: "Your details" },
  { key: "review", label: "Review" },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** At least 7 digits — lenient enough for any real phone format. */
const PHONE_REGEX = /\d[\s\-().]*(?:\d[\s\-().]*){6,}/;

interface WizardForm {
  help: string;
  eventType: string;
  guestCount: string;
  serviceStyle: string;
  setupNeeds: string[];
  eventDate: string;
  eventLocation: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  dietary: string;
  howHeard: string;
  message: string;
}

const INITIAL_FORM: WizardForm = {
  help: "",
  eventType: "",
  guestCount: "",
  serviceStyle: "",
  setupNeeds: [],
  eventDate: "",
  eventLocation: "",
  budget: "",
  name: "",
  email: "",
  phone: "",
  business: "",
  dietary: "",
  howHeard: "",
  message: "",
};

export function ContactClient({
  heroSlides,
  heroImage,
}: {
  heroSlides: string[];
  heroImage: string;
}) {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof WizardForm>(key: K, value: WizardForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleSetupNeed(option: string) {
    setForm((f) => ({
      ...f,
      setupNeeds: f.setupNeeds.includes(option)
        ? f.setupNeeds.filter((s) => s !== option)
        : [...f.setupNeeds, option],
    }));
  }

  /**
   * Pick a service. Switching to a delivered/pickup meal program clears the
   * on-site-only answers so they never leak into the lead inbox or email.
   */
  function chooseHelp(option: string) {
    setForm((f) =>
      MEAL_PROGRAMS.includes(option)
        ? { ...f, help: option, serviceStyle: "", setupNeeds: [] }
        : { ...f, help: option },
    );
  }

  // Deep-link prefill: catering pages link in with ?service= (a setup) and/or
  // ?setup= (an add-on like the Cocktail Cart). Run once on mount, client-side,
  // so the static page still renders normally and there's no hydration mismatch.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const setup = params.get("setup");
    setForm((f) => {
      let next = f;
      if (
        service &&
        !next.help &&
        (CATERING_HELP_OPTIONS as readonly string[]).includes(service)
      ) {
        next = MEAL_PROGRAMS.includes(service)
          ? { ...next, help: service, serviceStyle: "", setupNeeds: [] }
          : { ...next, help: service };
      }
      if (
        setup &&
        (SETUP_NEEDS_OPTIONS as readonly string[]).includes(setup) &&
        !next.setupNeeds.includes(setup)
      ) {
        next = { ...next, setupNeeds: [...next.setupNeeds, setup] };
      }
      return next;
    });
  }, []);

  function isStepValid(index: number): boolean {
    if (index === 0) return form.help !== "";
    if (index === 3) {
      return (
        form.name.trim() !== "" &&
        EMAIL_REGEX.test(form.email.trim()) &&
        PHONE_REGEX.test(form.phone.trim())
      );
    }
    return true;
  }

  // Holiday packs, weekly meal prep, and pre-made meals are delivered or picked
  // up — not catered on-site — so the wizard tones down the event-specific
  // questions (service style, on-site setup) for them.
  const isMealProgram = MEAL_PROGRAMS.includes(form.help);

  const stepLabels = isMealProgram
    ? ["Order", "Your order", "When & where", "Your details", "Review"]
    : WIZARD_STEPS.map((s) => s.label);

  const canProceed = isStepValid(step);
  const isLastStep = step === WIZARD_STEPS.length - 1;

  function goNext() {
    if (!canProceed) {
      setError("Please complete the highlighted fields before continuing.");
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    // Honeypot check — bots fill this hidden field
    if (honeypotRef.current?.value) {
      router.push("/contact/thank-you");
      return;
    }

    setLoading(true);
    setError(null);

    const data = {
      name: form.name,
      business: form.business,
      email: form.email,
      phone: form.phone,
      help: form.help,
      eventType: form.eventType,
      serviceStyle: form.serviceStyle,
      guestCount: form.guestCount,
      setupNeeds: form.setupNeeds.join(", "),
      eventDate: form.eventDate,
      eventLocation: form.eventLocation,
      budget: form.budget,
      dietary: form.dietary,
      howHeard: form.howHeard,
      message: form.message,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
        router.push("/contact/thank-you");
        return;
      } else {
        const errData = await res.json().catch(() => null);
        setError(
          errData?.error ||
            "Something went wrong. Please try again or call us directly."
        );
      }
    } catch {
      setError(
        "Network error — please check your connection and try again, or call us directly."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <HeroBanner
        slides={heroSlides}
        imageSrc={heroImage}
        imageAlt="Pit & Masa mobile catering taco and BBQ spread"
        overlayOpacity={70}
        minHeight="min-h-[45vh]"
        cursorSpotlight
      >
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 16, letterSpacing: "0.3em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-sm font-bold uppercase text-balance text-[#FF8C00]"
          >
            Connecticut BBQ &amp; Taco Catering
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-display! font-normal! uppercase leading-tight text-pretty text-white md:text-5xl lg:text-6xl"
          >
            Let&apos;s cater your Connecticut event.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            Answer a few quick questions about your date, guest count, and what
            you&apos;re craving — wood-fired BBQ, birria tacos, or both. We build
            a custom menu and send a personalized quote within 72 hours.
          </motion.p>
        </div>
      </HeroBanner>

      <Section variant="dark">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* FORM */}
            <FadeIn direction="up" delay={0.1}>
              <div className="rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-6 shadow-sm md:p-8">
                {/* ── Progress ── */}
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FF8C00]">
                    Step {step + 1} of {WIZARD_STEPS.length}
                  </p>
                  <p className="text-xs font-medium text-[#1C1C1C]/55">
                    {stepLabels[step]}
                  </p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1C1C1C]/10">
                  <motion.div
                    className="h-full rounded-full bg-[#FF8C00]"
                    initial={false}
                    animate={{ width: `${((step + 1) / WIZARD_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <ol className="mt-4 hidden items-center justify-between sm:flex">
                  {WIZARD_STEPS.map((s, i) => (
                    <li key={s.key} className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          i < step
                            ? "bg-[#FF8C00] text-white"
                            : i === step
                              ? "bg-[#FF8C00]/15 text-[#FF8C00] ring-2 ring-[#FF8C00]"
                              : "bg-[#1C1C1C]/10 text-[#1C1C1C]/40"
                        }`}
                      >
                        {i < step ? <Check size={13} /> : i + 1}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          i === step ? "text-[#1C1C1C]" : "text-[#1C1C1C]/45"
                        }`}
                      >
                        {stepLabels[i]}
                      </span>
                    </li>
                  ))}
                </ol>

                {/* Honeypot — hidden from real users, traps bots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="confirm_url">Confirm URL</label>
                  <input
                    ref={honeypotRef}
                    type="text"
                    id="confirm_url"
                    name="confirm_url"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div
                    className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={(e) => e.preventDefault()} className="mt-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* ── STEP 1 · SERVICE ── */}
                      {step === 0 && (
                        <div className="space-y-5">
                          <div>
                            <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">
                              What can we cook for you?
                            </h2>
                            <p className="mt-1 text-sm text-[#1C1C1C]/60">
                              Pick the service that fits best — we&apos;ll fine-tune
                              the menu together from here.
                            </p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {CATERING_HELP_OPTIONS.map((opt) => {
                              const active = form.help === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => chooseHelp(opt)}
                                  aria-pressed={active}
                                  className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                                    active
                                      ? "border-[#FF8C00] bg-[#FF8C00]/6 ring-2 ring-[#FF8C00]/25"
                                      : "border-[#1C1C1C]/15 bg-white hover:border-[#FF8C00]/50 hover:bg-[#FF8C00]/4"
                                  }`}
                                >
                                  <span className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-[#1C1C1C]">
                                      {opt}
                                    </span>
                                    {active && (
                                      <Check size={16} className="shrink-0 text-[#FF8C00]" />
                                    )}
                                  </span>
                                  <span className="mt-1 block text-xs text-[#1C1C1C]/55">
                                    {HELP_SUBTITLES[opt]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ── STEP 2 · YOUR EVENT / ORDER ── */}
                      {step === 1 && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">
                              {isMealProgram
                                ? "Tell us about your order"
                                : "Tell us about your event"}
                            </h2>
                            <p className="mt-1 text-sm text-[#1C1C1C]/60">
                              {isMealProgram
                                ? "A few details help us size your meals and build the right plan."
                                : "The more we know, the sharper and faster your quote."}
                            </p>
                          </div>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <label htmlFor="eventType" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                {isMealProgram ? (
                                  <>
                                    What&apos;s it for?{" "}
                                    <span className="text-[#1C1C1C]/40">(optional)</span>
                                  </>
                                ) : (
                                  <>What&apos;s the occasion?</>
                                )}
                              </label>
                              <select
                                id="eventType"
                                value={form.eventType}
                                onChange={(e) => update("eventType", e.target.value)}
                                className={inputClasses}
                              >
                                <option value="">Select an occasion</option>
                                {EVENT_TYPE_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor="guestCount" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                {isMealProgram
                                  ? "How many people are you feeding?"
                                  : "How many guests?"}
                              </label>
                              <select
                                id="guestCount"
                                value={form.guestCount}
                                onChange={(e) => update("guestCount", e.target.value)}
                                className={inputClasses}
                              >
                                <option value="">Select a range</option>
                                {GUEST_COUNT_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {/* Service style & on-site setup only apply to catered,
                              on-site events — not delivered/pickup meal programs. */}
                          {!isMealProgram && (
                            <>
                              <div>
                                <label htmlFor="serviceStyle" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                  How should it be served?
                                </label>
                                <select
                                  id="serviceStyle"
                                  value={form.serviceStyle}
                                  onChange={(e) => update("serviceStyle", e.target.value)}
                                  className={inputClasses}
                                >
                                  <option value="">Select a style</option>
                                  {SERVICE_STYLE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <span className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                  What setup do you need?{" "}
                                  <span className="text-[#1C1C1C]/40">(optional — pick any)</span>
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {SETUP_NEEDS_OPTIONS.map((opt) => {
                                    const active = form.setupNeeds.includes(opt);
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => toggleSetupNeed(opt)}
                                        aria-pressed={active}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                          active
                                            ? "border-[#FF8C00] bg-[#FF8C00] text-white"
                                            : "border-[#1C1C1C]/15 bg-white text-[#1C1C1C]/70 hover:border-[#FF8C00]/50"
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* ── STEP 3 · DATE & PLACE ── */}
                      {step === 2 && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">
                              When and where?
                            </h2>
                            <p className="mt-1 text-sm text-[#1C1C1C]/60">
                              {isMealProgram
                                ? "Tell us when you need it and where it's headed — we deliver and offer pickup across Connecticut."
                                : "We're mobile and travel throughout Connecticut — backyards, venues, offices, and parks."}
                            </p>
                          </div>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <label htmlFor="eventDate" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                {isMealProgram ? "Start / needed-by date" : "Event date"}{" "}
                                <span className="text-[#1C1C1C]/40">(optional)</span>
                              </label>
                              <input
                                type="date"
                                id="eventDate"
                                value={form.eventDate}
                                onChange={(e) => update("eventDate", e.target.value)}
                                className={inputClasses}
                              />
                            </div>
                            <div>
                              <label htmlFor="eventLocation" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                {isMealProgram ? "Delivery town (or pickup)" : "Event location"}{" "}
                                <span className="text-[#1C1C1C]/40">(optional)</span>
                              </label>
                              <input
                                type="text"
                                id="eventLocation"
                                autoComplete="address-level2"
                                value={form.eventLocation}
                                onChange={(e) => update("eventLocation", e.target.value)}
                                className={inputClasses}
                                placeholder="Town or venue — e.g. Hartford, CT"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="budget" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                              Estimated budget{" "}
                              <span className="text-[#1C1C1C]/40">(optional)</span>
                            </label>
                            <select
                              id="budget"
                              value={form.budget}
                              onChange={(e) => update("budget", e.target.value)}
                              className={inputClasses}
                            >
                              <option value="">Select a range</option>
                              {BUDGET_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <p className="mt-1.5 text-xs text-[#1C1C1C]/50">
                              A ballpark is fine — it helps us tailor the right package.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* ── STEP 4 · YOUR DETAILS ── */}
                      {step === 3 && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">
                              How can we reach you?
                            </h2>
                            <p className="mt-1 text-sm text-[#1C1C1C]/60">
                              We&apos;ll only use this to send your quote and follow up
                              about your event.
                            </p>
                          </div>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                Full name <span className="text-[#FF8C00]">*</span>
                              </label>
                              <input
                                type="text"
                                id="name"
                                required
                                autoComplete="name"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                className={inputClasses}
                                placeholder="First and last name"
                              />
                            </div>
                            <div>
                              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                Email address <span className="text-[#FF8C00]">*</span>
                              </label>
                              <input
                                type="email"
                                id="email"
                                required
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value)}
                                className={inputClasses}
                                placeholder="you@email.com"
                              />
                            </div>
                          </div>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                Phone number <span className="text-[#FF8C00]">*</span>
                              </label>
                              <input
                                type="tel"
                                id="phone"
                                required
                                autoComplete="tel"
                                value={form.phone}
                                onChange={(e) => update("phone", e.target.value)}
                                className={inputClasses}
                                placeholder="(555) 123-4567"
                              />
                            </div>
                            <div>
                              <label htmlFor="business" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                Event or company name{" "}
                                <span className="text-[#1C1C1C]/40">(optional)</span>
                              </label>
                              <input
                                type="text"
                                id="business"
                                autoComplete="organization"
                                value={form.business}
                                onChange={(e) => update("business", e.target.value)}
                                className={inputClasses}
                                placeholder="e.g. Smith wedding, office party"
                              />
                            </div>
                          </div>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <label htmlFor="dietary" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                Dietary needs or allergies{" "}
                                <span className="text-[#1C1C1C]/40">(optional)</span>
                              </label>
                              <input
                                type="text"
                                id="dietary"
                                value={form.dietary}
                                onChange={(e) => update("dietary", e.target.value)}
                                className={inputClasses}
                                placeholder="e.g. vegetarian, gluten-free, nut allergy"
                              />
                            </div>
                            <div>
                              <label htmlFor="howHeard" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                                How did you hear about us?{" "}
                                <span className="text-[#1C1C1C]/40">(optional)</span>
                              </label>
                              <select
                                id="howHeard"
                                value={form.howHeard}
                                onChange={(e) => update("howHeard", e.target.value)}
                                className={inputClasses}
                              >
                                <option value="">Select one</option>
                                {HOW_HEARD_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#1C1C1C]">
                              Anything else?{" "}
                              <span className="text-[#1C1C1C]/40">(optional)</span>
                            </label>
                            <textarea
                              id="message"
                              rows={4}
                              value={form.message}
                              onChange={(e) => update("message", e.target.value)}
                              className={inputClasses}
                              placeholder="Theme, setup details, timing, or anything else you'd like us to know."
                            />
                          </div>
                        </div>
                      )}

                      {/* ── STEP 5 · REVIEW ── */}
                      {step === 4 && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">
                              Look good?
                            </h2>
                            <p className="mt-1 text-sm text-[#1C1C1C]/60">
                              Review your details below, then send it our way. Need to
                              change something? Just step back.
                            </p>
                          </div>
                          <dl className="divide-y divide-[#1C1C1C]/10 overflow-hidden rounded-xl border border-[#1C1C1C]/10 bg-white">
                            {(
                              [
                                ["Service", form.help],
                                [isMealProgram ? "What it's for" : "Occasion", form.eventType],
                                [isMealProgram ? "Feeding" : "Guests", form.guestCount],
                                ...(isMealProgram
                                  ? []
                                  : ([
                                      ["Service style", form.serviceStyle],
                                      ["Setup needs", form.setupNeeds.join(", ")],
                                    ] as [string, string][])),
                                [isMealProgram ? "Needed by" : "Event date", form.eventDate],
                                [isMealProgram ? "Delivery / pickup" : "Location", form.eventLocation],
                                ["Budget", form.budget],
                                ["Name", form.name],
                                ["Email", form.email],
                                ["Phone", form.phone],
                                ["Event / company", form.business],
                                ["Dietary needs", form.dietary],
                                ["Heard about us", form.howHeard],
                                ["Message", form.message],
                              ] as [string, string][]
                            ).map(([label, value]) => (
                              <div
                                key={label}
                                className="flex justify-between gap-4 px-4 py-3"
                              >
                                <dt className="text-sm font-medium text-[#1C1C1C]/55">
                                  {label}
                                </dt>
                                <dd className="max-w-[60%] text-right text-sm text-[#1C1C1C]">
                                  {value || "—"}
                                </dd>
                              </div>
                            ))}
                          </dl>
                          <p className="text-center text-xs text-[#1C1C1C]/55">
                            By submitting this form, you agree to our{" "}
                            <Link
                              href="/website-policies"
                              className="underline hover:text-[#1C1C1C]/80"
                            >
                              terms &amp; conditions
                            </Link>
                            . We respond within 72 hours. No spam, ever.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* ── Navigation ── */}
                  <div className="mt-8 flex items-center justify-between gap-4">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#1C1C1C]/20 px-5 py-3 text-sm font-bold text-[#1C1C1C] transition-colors hover:bg-[#1C1C1C]/5"
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {!isLastStep ? (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!canProceed}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#008080] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#008080]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                      >
                        Continue <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || submitted}
                        className="rounded-full bg-[#008080] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#008080]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {loading ? "Sending..." : submitted ? "Sent!" : "Send My Inquiry"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </FadeIn>

            {/* SIDEBAR — TRUST SIGNALS */}
            <SlideIn from="right" className="space-y-6">
              {/* What Happens Next */}
              <div className="rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-6 shadow-sm hover-lift">
                <h3 className="mb-4 font-heading text-lg font-bold text-[#1C1C1C]">
                  What happens next?
                </h3>
                <div className="space-y-4">
                  {[
                    { step: "1", text: "We review your event details and check our availability" },
                    { step: "2", text: "We reach out within 72 hours with menu ideas" },
                    { step: "3", text: "We finalize the menu, headcount, and pricing" },
                    { step: "4", text: "We show up, cook on-site, and your guests eat great" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF8C00]/10 text-xs font-bold text-[#FF8C00]">
                        {item.step}
                      </div>
                      <span className="text-sm text-[#1C1C1C]/65">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limited Spots */}
              <div className="rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-6 text-center shadow-sm border-glow">
                <Clock size={24} className="mx-auto mb-3 text-[#FF8C00]" />
                <p className="font-heading text-base font-bold text-[#1C1C1C]">
                  We book a limited number of events each week.
                </p>
                <p className="mt-2 text-sm text-[#1C1C1C]/65">
                  Weekends fill up fast, especially around the holidays. Reach
                  out early to lock in your date.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-6 shadow-sm hover-lift">
                <StaggerContainer className="space-y-4">
                  {[
                    { icon: <ShieldCheck size={16} />, text: "Fully insured & food-safe certified" },
                    { icon: <Flame size={16} />, text: "Cooked fresh on-site at your event" },
                  ].map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="flex items-center gap-3">
                        <span className="text-[#FF8C00]">{item.icon}</span>
                        <span className="text-sm text-[#1C1C1C]/65">{item.text}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>


            </SlideIn>
          </div>
        </div>
      </Section>
    </>
  );
}
