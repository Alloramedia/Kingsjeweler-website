"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Gem,
  Heart,
  Wrench,
  Watch,
  Scale,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Star,
} from "lucide-react";
import { siteConfig, BLUR_DATA_URL } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import type {
  HeroOverride,
  BrandImages,
  Testimonial,
  FaqItem,
  HoursRow,
} from "@/lib/admin/types";

interface HomeClientProps {
  hero: HeroOverride;
  brandImages: BrandImages;
  testimonials: Testimonial[];
  faqs: FaqItem[];
  serviceTowns: string[];
  hours: HoursRow[];
}

const SERVICES = [
  {
    icon: Heart,
    title: "Engagement Rings & Bridal",
    body: "Diamond engagement rings and wedding bands for every style and budget — with honest, pressure-free guidance from a real jeweler.",
  },
  {
    icon: Sparkles,
    title: "Custom Jewelry Design",
    body: "Bring us an idea, a photo, or an heirloom stone. We design and craft one-of-a-kind pieces you won't find anywhere else.",
  },
  {
    icon: Wrench,
    title: "Jewelry Repair",
    body: "Ring sizing, chain soldering, prong re-tipping, stone setting, and restoration — done with care, often while you shop the mall.",
  },
  {
    icon: Watch,
    title: "Watch Repair & Batteries",
    body: "Watch batteries replaced on the spot, plus band adjustments and repairs for everyday and luxury watches.",
  },
  {
    icon: Scale,
    title: "Gold Buying & Appraisals",
    body: "Fair, transparent offers on gold, silver, and diamonds — sell outright or trade toward something new. Appraisals available.",
  },
  {
    icon: Gem,
    title: "Fine Jewelry & Gifts",
    body: "Necklaces, bracelets, earrings, and chains in gold, silver, and platinum — for anniversaries, birthdays, and just because.",
  },
] as const;

const WHY_US = [
  {
    title: "Family owned & operated",
    body: "You deal directly with the jeweler — not a salesperson working a quota.",
  },
  {
    title: "On-site expertise",
    body: "Repairs, sizing, and batteries handled in-store, many while you wait.",
  },
  {
    title: "Honest pricing",
    body: "Straightforward quotes and fair offers, whether you're buying or selling.",
  },
  {
    title: "In the heart of Buckland Hills",
    body: "Easy to find inside the mall — free parking and no appointment needed.",
  },
] as const;

export function HomeClient({
  hero,
  brandImages,
  testimonials,
  faqs,
  serviceTowns,
  hours,
}: HomeClientProps) {
  const heroTitle = hero.title || "Manchester's Family Jeweler";
  const heroSubtitle =
    hero.subtitle ||
    "Fine jewelry, engagement rings, custom design, and expert repairs — inside The Shoppes at Buckland Hills.";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-[#14141A] text-white">
        <HeroSlideshow
          images={brandImages.heroSlides}
          alt="Fine jewelry at King's Jeweler in Manchester, Connecticut"
          className="opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#14141A]/60 via-transparent to-[#14141A]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-20 text-center lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F0A92D]"
          >
            The Shoppes at Buckland Hills · Manchester, CT
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display! mt-5 text-4xl font-normal! uppercase leading-tight text-shadow-hero md:text-6xl lg:text-7xl"
          >
            {heroTitle}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="ornament-divider mt-6"
            aria-hidden="true"
          >
            <span />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            {heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/contact"
              className="btn-gold inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white"
            >
              Visit or Contact Us
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:border-[#C68A17] hover:bg-[#C68A17]/10"
            >
              Explore Our Services
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/70"
          >
            <span className="inline-flex items-center gap-2">
              <span className="flex text-[#F0A92D]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </span>
              4.5 on Google
            </span>
            <span className="hidden h-3 w-px bg-white/25 sm:block" />
            <span>Family owned &amp; operated</span>
            <span className="hidden h-3 w-px bg-white/25 sm:block" />
            <span>Watch batteries while you wait</span>
          </motion.div>
        </div>

        {/* Bottom gold hairline */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#C68A17]/60 to-transparent" />
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <Section variant="dark" id="services">
        <SectionHeader
          eyebrow="What We Do"
          title="Everything a jeweler should be"
          description="From once-in-a-lifetime engagement rings to a five-minute watch battery — we handle it all, in person, with care."
        />
        <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <StaggerItem key={s.title}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-[#14141A]/8 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C68A17]/35 hover:shadow-lg hover:shadow-[#C68A17]/10">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-[#C68A17] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C68A17]/25 bg-[#C68A17]/8 text-[#C68A17] transition-colors duration-300 group-hover:bg-[#C68A17] group-hover:text-white">
                  <s.icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#14141A]/65">
                  {s.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <FadeIn className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C68A17] hover:underline"
          >
            See all services
            <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </Section>

      {/* ── Why us ───────────────────────────────────────────── */}
      <Section variant="green">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Why King's Jeweler"
              title="A jeweler you can actually talk to"
              description="Big-box chains sell boxes. We build relationships — one ring, one repair, one family at a time."
              center={false}
            />
            <div className="mt-8 space-y-6">
              {WHY_US.map((item) => (
                <FadeIn key={item.title}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0A92D]/15 text-[#F0A92D]">
                      <Star size={15} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/65">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
          <FadeIn className="relative">
            {/* Offset gold frame */}
            <div
              aria-hidden="true"
              className="absolute -right-3 -top-3 hidden h-full w-full rounded-2xl border border-[#C68A17]/40 lg:block"
            />
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src={brandImages.aboutFeature}
                alt="Inside the King's Jeweler showcase"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
            {/* Floating review card */}
            <div className="absolute -bottom-5 -left-3 rounded-xl border border-[#C68A17]/30 bg-[#14141A]/90 px-5 py-4 shadow-xl backdrop-blur-sm sm:-left-6">
              <div className="flex items-center gap-1 text-[#F0A92D]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="mt-1.5 text-sm font-semibold text-white">4.5 stars on Google</p>
              <p className="text-xs text-white/55">from real local customers</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ── Gallery strip ────────────────────────────────────── */}
      <Section variant="dark" id="gallery">
        <SectionHeader
          eyebrow="From the Showcase"
          title="A look at our work"
          description="Custom pieces, restorations, and favorites from the case."
        />
        <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {brandImages.cards.slice(0, 6).map((src, i) => (
            <StaggerItem key={src}>
              <div className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-[#14141A]/10 transition-all duration-300 hover:ring-2 hover:ring-[#C68A17]/60">
                <Image
                  src={src}
                  alt={`Jewelry from the King's Jeweler showcase ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#14141A]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <FadeIn className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C68A17] hover:underline"
          >
            View the full gallery
            <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </Section>

      {/* ── Visit us ─────────────────────────────────────────── */}
      <Section variant="light" id="visit">
        <SectionHeader
          eyebrow="Visit Us"
          title="Find us at Buckland Hills"
          description="No appointment needed — stop in during store hours, seven days a week."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          <FadeIn>
            <div className="relative h-full overflow-hidden rounded-2xl border border-[#14141A]/8 bg-white p-7 text-center shadow-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-[#C68A17]/70 to-transparent" />
              <MapPin size={26} className="mx-auto text-[#C68A17]" />
              <h3 className="mt-4 font-bold">Location</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#14141A]/65">
                {siteConfig.address.suite}
                <br />
                {siteConfig.address.street}
                <br />
                {siteConfig.address.city}, {siteConfig.address.region}{" "}
                {siteConfig.address.zip}
              </p>
              <a
                href={siteConfig.gmb}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#C68A17] hover:underline"
              >
                Get directions
                <ArrowRight size={14} />
              </a>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="relative h-full overflow-hidden rounded-2xl border border-[#14141A]/8 bg-white p-7 text-center shadow-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-[#C68A17]/70 to-transparent" />
              <Clock size={26} className="mx-auto text-[#C68A17]" />
              <h3 className="mt-4 font-bold">Store Hours</h3>
              <ul className="mt-2 space-y-1 text-sm text-[#14141A]/65">
                {hours.map((row) => (
                  <li key={row.day}>
                    <span className="font-medium">{row.day}:</span> {row.hours}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="relative h-full overflow-hidden rounded-2xl border border-[#14141A]/8 bg-white p-7 text-center shadow-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-[#C68A17]/70 to-transparent" />
              <Phone size={26} className="mx-auto text-[#C68A17]" />
              <h3 className="mt-4 font-bold">Get in Touch</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#14141A]/65">
                Questions about a repair, a stone, or a surprise proposal? We're
                happy to help.
              </p>
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="mt-3 inline-block text-sm font-semibold text-[#C68A17] hover:underline"
              >
                {siteConfig.phone}
              </a>
            </div>
          </FadeIn>
        </div>
        {serviceTowns.length > 0 && (
          <FadeIn className="mx-auto mt-10 max-w-3xl text-center">
            <p className="text-sm text-[#14141A]/55">
              Proudly serving {serviceTowns.slice(0, -1).join(", ")} and{" "}
              {serviceTowns[serviceTowns.length - 1]}.
            </p>
          </FadeIn>
        )}
      </Section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <Section variant="dark">
          <SectionHeader
            eyebrow="Kind Words"
            title="What our customers say"
          />
          <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <StaggerItem key={t.author}>
                <figure className="relative flex h-full flex-col rounded-2xl border border-[#14141A]/8 bg-white p-7 shadow-sm">
                  <span
                    aria-hidden="true"
                    className="font-display absolute right-6 top-3 text-6xl leading-none text-[#C68A17]/15"
                  >
                    ”
                  </span>
                  <div className="flex gap-1 text-[#C68A17]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[#14141A]/75">
                    &ldquo;{t.body}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-[#14141A]/8 pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C68A17]/12 text-sm font-bold text-[#C68A17]">
                      {t.author.charAt(0)}
                    </span>
                    <span>
                      <p className="text-sm font-bold">{t.author}</p>
                      <p className="text-xs text-[#14141A]/55">{t.role}</p>
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <Section variant="light">
          <SectionHeader
            eyebrow="Questions"
            title="Frequently asked questions"
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <FAQAccordion items={faqs} variant="light" accentColor="#C68A17" />
          </div>
        </Section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <CTASection />
    </>
  );
}
