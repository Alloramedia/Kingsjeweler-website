"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { siteConfig, BLUR_DATA_URL } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { FadeIn } from "@/components/animations";
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
    title: "Engagement Rings & Bridal",
    body: "Diamond engagement rings and wedding bands for every style and budget — with honest, pressure-free guidance from a real jeweler.",
    note: "Ask about financing",
  },
  {
    title: "Custom Jewelry Design",
    body: "Bring us an idea, a photo, or an heirloom stone. We design and craft one-of-a-kind pieces you won't find anywhere else.",
    note: "By consultation",
  },
  {
    title: "Jewelry Repair",
    body: "Ring sizing, chain soldering, prong re-tipping, stone setting, and restoration — done with care, often while you shop the mall.",
    note: "Many done same day",
  },
  {
    title: "Watch Repair & Batteries",
    body: "Watch batteries replaced on the spot, plus band adjustments and repairs for everyday and luxury watches.",
    note: "While you wait",
  },
  {
    title: "Gold Buying & Appraisals",
    body: "Fair, transparent offers on gold, silver, and diamonds — sell outright or trade toward something new. Appraisals available.",
    note: "Walk-ins welcome",
  },
  {
    title: "Fine Jewelry & Gifts",
    body: "Necklaces, bracelets, earrings, and chains in gold, silver, and platinum — for anniversaries, birthdays, and just because.",
    note: "In the case daily",
  },
] as const;

const WHY_US = [
  {
    title: `Serving Manchester since ${siteConfig.foundingDate}`,
    body: "Decades in the same community, not a chain that opened last quarter.",
  },
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

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** Matches a printed hours label ("Monday – Friday", "Saturday") to a weekday index. */
function rowMatchesDay(label: string, dayIndex: number): boolean {
  const lower = label.toLowerCase();
  const found = DAY_NAMES.map((d, i) => (lower.includes(d.slice(0, 3)) ? i : -1)).filter(
    (i) => i >= 0
  );
  if (found.length === 0) return false;
  if (found.length === 1) return found[0] === dayIndex;
  const [start, end] = [found[0], found[found.length - 1]];
  return start <= end
    ? dayIndex >= start && dayIndex <= end
    : dayIndex >= start || dayIndex <= end;
}

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

  // Resolves on the client only, so SSR and hydration markup agree.
  const todayIndex = useSyncExternalStore(
    () => () => {},
    () => new Date().getDay(),
    () => null
  );

  const heroWords = heroTitle.trim().split(/\s+/);
  const heroLead = heroWords.slice(0, -1).join(" ");
  const heroLast = heroWords[heroWords.length - 1];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-[82vh] items-end overflow-hidden bg-[#14141A] text-white">
        <HeroSlideshow
          images={brandImages.heroSlides}
          alt="Fine jewelry at King's Jeweler in Manchester, Connecticut"
          className="opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#14141A]/55 via-transparent to-[#14141A]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-44 pb-16 lg:px-8 lg:pb-20">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow-rule font-heading text-[#F0A92D]"
            >
              The Shoppes at Buckland Hills · Manchester, CT
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 font-heading text-5xl font-bold leading-[1.04] tracking-tight text-shadow-hero md:text-6xl lg:text-7xl"
            >
              {heroLead && <>{heroLead} </>}
              <em className="font-medium italic text-[#F0A92D]">{heroLast}</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl"
            >
              {heroSubtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="btn-gold inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white"
              >
                Visit or Contact Us
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/services"
                className="btn-outline-gold inline-flex items-center gap-2 px-7 py-3.5 text-base font-medium text-white backdrop-blur-sm"
              >
                See What We Do
              </Link>
            </motion.div>

            {/* Trust line — one plain sentence, no badge row */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-10 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/65"
            >
              Family owned and in the mall since {siteConfig.foundingDate}.{" "}
              <a
                href={siteConfig.socials.gmb}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-1 text-white/85 underline decoration-white/30 underline-offset-2 transition hover:text-white"
              >
                <Star size={12} className="translate-y-px text-[#F0A92D]" fill="currentColor" />
                4.5 on Google
              </a>{" "}
              — and yes, we still do watch batteries while you wait.
            </motion.p>
          </div>
        </div>

        {/* Vertical marginalia — a printed-page flourish */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 xl:block"
        >
          <p
            className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-white/35"
            style={{ writingMode: "vertical-rl" }}
          >
            Est. {siteConfig.foundingDate} · The Shoppes at Buckland Hills · Manchester, Connecticut
          </p>
        </div>

        {/* Bottom gold hairline */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-[#C68A17]/50" />
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <Section variant="dark" id="services">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="What We Do"
              title={
                <>
                  The six things people <em className="text-[#A87310]">come in for</em>
                </>
              }
              description="From a once-in-a-lifetime engagement ring to a five-minute watch battery — it's all handled here, in person, by us."
            />
            <FadeIn>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C68A17] hover:underline"
              >
                See the full list of services
                <ArrowRight size={16} />
              </Link>
            </FadeIn>
          </div>
          <FadeIn>
            <ol className="border-t border-[#14141A]/15">
              {SERVICES.map((s, i) => (
                <li
                  key={s.title}
                  className="grid gap-x-6 gap-y-1 border-b border-[#14141A]/15 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]"
                >
                  <span className="pt-0.5 font-heading text-sm font-semibold text-[#C68A17]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#14141A]/65">
                      {s.body}
                    </p>
                  </div>
                  <span className="pt-1 text-xs italic text-[#14141A]/50 sm:text-right">
                    {s.note}
                  </span>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </Section>

      {/* ── Why us ───────────────────────────────────────────── */}
      <Section variant="green">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Why King's Jeweler"
              title={
                <>
                  A jeweler you can <em className="text-[#F0A92D]">actually talk to</em>
                </>
              }
              description="Big-box chains sell boxes. We build relationships — one ring, one repair, one family at a time."
              variant="green"
            />
            <dl className="divide-y divide-white/10">
              {WHY_US.map((item) => (
                <FadeIn key={item.title}>
                  <div className="py-4">
                    <dt className="font-heading font-bold text-white">
                      <span aria-hidden="true" className="mr-3 text-[#C68A17]">—</span>
                      {item.title}
                    </dt>
                    <dd className="mt-1 pl-7 text-sm leading-relaxed text-white/65">
                      {item.body}
                    </dd>
                  </div>
                </FadeIn>
              ))}
            </dl>
          </div>
          <FadeIn className="lg:sticky lg:top-32">
            <figure>
              <div className="relative border border-white/15 p-2">
                <div className="relative aspect-4/5">
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
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-xs text-white/50">
                <span>The case up front — stop by and try something on.</span>
                <a
                  href={siteConfig.socials.gmb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 underline decoration-white/30 underline-offset-2 transition hover:text-white/80"
                >
                  4.5 ★ on Google
                </a>
              </figcaption>
            </figure>
          </FadeIn>
        </div>
      </Section>

      {/* ── We Buy Gold ──────────────────────────────────────── */}
      <section
        id="we-buy-gold"
        className="relative overflow-hidden bg-[#C68A17] py-16 text-[#14141A] md:py-24"
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-[#14141A]/25" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <p className="eyebrow-rule font-heading text-[#14141A]/80">
                Top Prices Paid
              </p>
              <h2 className="mt-5 font-heading text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">
                We buy <em className="font-medium italic">gold</em>.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#14141A]/80">
                Bring in gold, silver, diamonds, or jewelry you no longer wear.
                We weigh it right in front of you and make a fair offer on the
                spot — sell outright or trade toward anything in the case.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xs bg-[#14141A] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-black"
                >
                  Get an Offer
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/sell-gold"
                  className="text-sm font-semibold text-[#14141A]/70 underline decoration-[#14141A]/30 underline-offset-2 transition-colors hover:text-[#14141A]"
                >
                  See what we buy &amp; how it works
                </Link>
              </div>
              <p className="mt-4 text-sm text-[#14141A]/70">
                No appointment needed — walk in any day we're open.
              </p>
            </FadeIn>
            <FadeIn>
              <ol className="border-t border-[#14141A]/25">
                {[
                  {
                    title: "Watch the weigh-in",
                    body: "Everything is weighed and evaluated in front of you — no back rooms, no games.",
                  },
                  {
                    title: "Fair, transparent offers",
                    body: "Honest market-based pricing on gold, silver, diamonds, and estate jewelry.",
                  },
                  {
                    title: "Flexible ways to pay & trade",
                    body: "Take cash, trade toward something new — and when you buy, we accept all major credit cards and offer no-credit-needed financing.",
                  },
                ].map((item, i) => (
                  <li
                    key={item.title}
                    className="grid gap-x-6 gap-y-1 border-b border-[#14141A]/25 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                  >
                    <span className="pt-0.5 font-heading text-sm font-semibold text-[#14141A]/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-heading font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#14141A]/75">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Gallery strip ────────────────────────────────────── */}
      <Section variant="dark" id="gallery">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="From the Showcase"
            title={
              <>
                A look at <em className="text-[#A87310]">our work</em>
              </>
            }
            description="Custom pieces, restorations, and favorites from the case."
          />
          <FadeIn className="mb-10 md:mb-12">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C68A17] hover:underline"
            >
              View the full gallery
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {brandImages.cards.slice(0, 5).map((src, i) => (
            <FadeIn
              key={src}
              delay={i * 0.05}
              className={i === 0 ? "col-span-2 row-span-2" : ""}
            >
              <div className="group relative aspect-square overflow-hidden border border-[#14141A]/12">
                <Image
                  src={src}
                  alt={`Jewelry from the King's Jeweler showcase ${i + 1}`}
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ── Visit us ─────────────────────────────────────────── */}
      <Section variant="light" id="visit">
        <SectionHeader
          eyebrow="Visit Us"
          title={
            <>
              Find us at <em className="text-[#A87310]">Buckland Hills</em>
            </>
          }
          description="No appointment needed — stop in during store hours, seven days a week."
        />
        <FadeIn>
          <div className="grid border-y border-[#14141A]/15 md:grid-cols-3 md:divide-x md:divide-[#14141A]/15">
            <div className="border-b border-[#14141A]/15 py-7 md:border-b-0 md:pr-8">
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#C68A17]">
                Location
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#14141A]/75">
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
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#C68A17] hover:underline"
              >
                Get directions
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="border-b border-[#14141A]/15 py-7 md:border-b-0 md:px-8">
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#C68A17]">
                Store Hours
              </h3>
              <ul className="mt-3 max-w-xs space-y-1.5 text-sm text-[#14141A]/75">
                {hours.map((row) => {
                  const isToday =
                    todayIndex !== null && rowMatchesDay(row.day, todayIndex);
                  return (
                    <li
                      key={row.day}
                      className={`flex items-baseline ${isToday ? "font-semibold text-[#14141A]" : ""}`}
                    >
                      <span className="font-medium">
                        {row.day}
                        {isToday && (
                          <span className="ml-2 font-heading text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#A87310]">
                            Today
                          </span>
                        )}
                      </span>
                      <span aria-hidden="true" className="dotted-leader" />
                      <span>{row.hours}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="py-7 md:pl-8">
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#C68A17]">
                Get in Touch
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#14141A]/75">
                Questions about a repair, a stone, or a surprise proposal? We're
                happy to help.
              </p>
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="mt-3 inline-block text-sm font-semibold text-[#C68A17] hover:underline"
              >
                {siteConfig.phone}
              </a>
              <p className="mt-3 text-xs text-[#14141A]/55">
                All major cards accepted · No credit needed financing
              </p>
            </div>
          </div>
        </FadeIn>
        {serviceTowns.length > 0 && (
          <FadeIn className="mt-8">
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
            eyebrow="In Their Words"
            title={
              <>
                What customers <em className="text-[#A87310]">tell us</em>
              </>
            }
          />
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <FadeIn key={t.author}>
                <figure className="flex h-full flex-col border-l-2 border-[#C68A17]/50 pl-6">
                  <blockquote className="flex-1 font-heading text-lg leading-relaxed text-[#14141A]/85">
                    &ldquo;{t.body}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-bold">{t.author}</span>
                    <span className="text-[#14141A]/55"> · {t.role}</span>
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-10">
            <p className="text-xs text-[#14141A]/50">
              Pulled from our Google reviews —{" "}
              <a
                href={siteConfig.socials.gmb}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[#14141A]"
              >
                read the rest here
              </a>
              .
            </p>
          </FadeIn>
        </Section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <Section variant="light">
          <SectionHeader
            eyebrow="Questions"
            title="Frequently asked questions"
          />
          <div className="max-w-3xl">
            <FAQAccordion items={faqs} variant="light" accentColor="#C68A17" />
          </div>
        </Section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <CTASection />
    </>
  );
}
