"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, ArrowRight, Loader2 } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import {
  SERVICE_HELP_OPTIONS,
  EVENT_TYPE_OPTIONS,
  BUDGET_OPTIONS,
  HOW_HEARD_OPTIONS,
} from "@/lib/cta";

interface ContactClientProps {
  heroSlides: string[];
  heroImage: string;
}

const inputClass =
  "w-full rounded-xl border border-[#14141A]/15 bg-white px-4 py-3 text-sm text-[#14141A] placeholder:text-[#14141A]/40 focus:border-[#C68A17] focus:outline-none focus:ring-2 focus:ring-[#C68A17]/25";

const labelClass = "mb-1.5 block text-sm font-semibold text-[#14141A]";

export function ContactClient({ heroSlides }: ContactClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get("name") || ""),
      business: "",
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      help: String(fd.get("help") || ""),
      eventType: String(fd.get("eventType") || ""),
      budget: String(fd.get("budget") || ""),
      howHeard: String(fd.get("howHeard") || ""),
      message: String(fd.get("message") || ""),
      confirm_url: String(fd.get("confirm_url") || ""), // honeypot
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.help) {
      setError("Please fill in your name, email, phone, and what we can help with.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F0A92D]">
            Visit Us
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            Stop by, call, or send a message.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            No appointment needed — we&apos;re inside The Shoppes at Buckland
            Hills seven days a week. For anything else, the form below
            reaches us directly.
          </p>
        </div>
      </section>

      {/* ── Info + form ──────────────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[2fr_3fr] lg:px-8">
          {/* Store info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#14141A]/10 bg-white p-7 shadow-sm">
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

            <div className="rounded-2xl border border-[#14141A]/10 bg-white p-7 shadow-sm">
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

            <div className="rounded-2xl border border-[#14141A]/10 bg-white p-7 shadow-sm">
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
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#14141A]/10 bg-white p-7 shadow-sm md:p-9"
              noValidate
            >
              <h2 className="text-xl font-bold">Send us a message</h2>
              <p className="mt-1 text-sm text-[#14141A]/60">
                Tell us a little about what you need and we&apos;ll get back to
                you soon.
              </p>

              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                name="confirm_url"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name *
                  </label>
                  <input id="name" name="name" required className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone *
                  </label>
                  <input id="phone" name="phone" type="tel" required className={inputClass} placeholder="(860) 555-0100" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    Email *
                  </label>
                  <input id="email" name="email" type="email" required className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="help" className={labelClass}>
                    What can we help with? *
                  </label>
                  <select id="help" name="help" required className={inputClass} defaultValue="">
                    <option value="" disabled>
                      Choose one…
                    </option>
                    {SERVICE_HELP_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="eventType" className={labelClass}>
                    Occasion
                  </label>
                  <select id="eventType" name="eventType" className={inputClass} defaultValue="">
                    <option value="">Optional…</option>
                    {EVENT_TYPE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className={labelClass}>
                    Ballpark budget
                  </label>
                  <select id="budget" name="budget" className={inputClass} defaultValue="">
                    <option value="">Optional…</option>
                    {BUDGET_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="howHeard" className={labelClass}>
                    How did you hear about us?
                  </label>
                  <select id="howHeard" name="howHeard" className={inputClass} defaultValue="">
                    <option value="">Optional…</option>
                    {HOW_HEARD_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={labelClass}>
                    Your message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className={inputClass}
                    placeholder="Tell us about the piece, the repair, or the idea…"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold mt-6 inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
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
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
