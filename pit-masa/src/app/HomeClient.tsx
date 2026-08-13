"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Flame,
  ChefHat,
  MapPin,
  ArrowRight,
  Quote,
  Star,
  Caravan,
  HeartHandshake,
} from "lucide-react";
import {
  serviceAreas,
  siteConfig,
  BLUR_DATA_URL,
} from "@/lib/constants";
import { VEHICLES } from "@/lib/vehicles";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { DrivingTruck } from "@/components/animations";
import { EmblemWatermark, TacoWatermark } from "@/components/SectionTextures";
import type { HeroOverride } from "@/lib/admin/schema";
import type { BrandImages, Testimonial, FaqItem } from "@/lib/admin/types";
import type { Recipe, BlogPost } from "@/lib/content";

const signatureMenu = [
  "Wood-fired smoked brisket",
  "Birria tacos with consommé",
  "Build-your-own taco bar",
  "Pulled pork & smoked chicken",
  "House sides & street corn",
  "Signature cocktails & aguas frescas",
];

const whyUs = [
  {
    icon: Flame,
    title: "Cooked over real wood",
    body: "No shortcuts and no steam tables. Every brisket, butt, and bird is smoked low and slow over hardwood until it's tender enough to pull apart by hand.",
  },
  {
    icon: ChefHat,
    title: "Made-from-scratch masa",
    body: "Tortillas pressed fresh, salsas blended in-house, and birria simmered for hours. The taco bar tastes like a taquería, not a tray of leftovers.",
  },
  {
    icon: Caravan,
    title: "We come to you",
    body: "Backyard, barn, office, or banquet hall — we roll in the trailer, truck, or cocktail cart, fire up the comal, and bring the crew. You don't lift a finger and you never leave your guests.",
  },
  {
    icon: HeartHandshake,
    title: "Hosted, not just dropped off",
    body: "We plate, we serve, we refill, and we clean our station before we go. Catering should feel like a gift to yourself, not another job on the list.",
  },
];

// A wider spread of food photography for the home gallery teaser strip.
const galleryStrip = [
  "/images/food/food-102.webp", // al pastor tacos
  "/images/food/food-109.webp", // carne asada quesadilla
  "/images/food/food-095.webp", // grilled veggie taco
  "/images/food/food-108.webp", // birria quesadilla
  "/images/food/food-083.webp", // grilled shrimp
  "/images/food/food-110.webp", // street corn / esquites
  "/images/food/food-106.webp", // fish torta
  "/images/food/food-124.webp", // seared tuna taco close-up
];

const steps = [
  {
    n: "01",
    title: "Tell us about your event",
    body: "Share your date, headcount, and the vibe you're going for. We'll talk menu and budget.",
  },
  {
    n: "02",
    title: "We build your menu",
    body: "You get a custom menu — smoked meats, tacos, sides, and packages tailored to your crowd.",
  },
  {
    n: "03",
    title: "We bring the pit to you",
    body: "We roll up, fire up, and serve hot, fresh food anywhere in Connecticut. You just enjoy the party.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export function HomeClient({
  hero,
  recipes,
  blogPosts,
  brandImages,
  testimonials,
  faqs,
  serviceTowns,
}: {
  hero: HeroOverride;
  recipes: Recipe[];
  blogPosts: BlogPost[];
  brandImages: BrandImages;
  testimonials: Testimonial[];
  faqs: FaqItem[];
  serviceTowns: string[];
}) {
  return (
    <div className="bg-[#FEFCF5] text-[#1C1C1C]">
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <HeroSlideshow
          images={brandImages.heroSlides}
          alt="A spread of wood-fired tacos and smoked BBQ catered by Pit & Masa"
          className="opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-40 lg:px-8">
          <motion.p
            {...fadeUp}
            className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]"
          >
            Mobile BBQ · Tacos · Cocktails · Connecticut
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-4 max-w-3xl whitespace-pre-line font-display! text-4xl font-normal! uppercase leading-[1.1] tracking-wide md:text-6xl"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg text-white/75"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/25 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
            >
              Book Catering <ArrowRight size={18} />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 font-bold text-white transition hover:border-[#FFA733] hover:text-[#FFA733]"
            >
              Explore the Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------ Truck drives across */}
      <DrivingTruck />

      {/* ------------------------------------------- Choose your setup */}
      <section className="relative overflow-hidden">
        <TacoWatermark className="-right-10 top-10" rotate={-12} opacity={0.05} size="clamp(140px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-8 hidden md:block" rotate={14} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-6 lg:px-8 lg:pb-28 lg:pt-10">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              Choose Your Setup
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              One crew, three ways to roll up.
            </h2>
            <p className="mt-4 text-lg text-[#1C1C1C]/65">
              Wood-fired BBQ off the Pit Trailer, a live taco bar from the Food
              Truck, and hand-crafted drinks on the Cocktail Cart. Book one — or
              combine a few — anywhere in Connecticut.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {VEHICLES.map((v, i) => {
              const Icon = v.icon;
              const soon = v.status === "coming-soon";
              return (
                <motion.div
                  key={v.slug}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    href={`/catering/${v.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#008080]/20 bg-[#008080] text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-[#0A9B9B] via-[#008080] to-[#016A6A]">
                      <Image
                        src={v.iconImage}
                        alt={`${v.name} — Pit & Masa mobile catering setup`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={`object-contain transition-transform duration-500 group-hover:scale-105 ${
                          v.slug === "cocktail-cart" ? "p-14" : "p-5"
                        }`}
                      />
                      {soon && (
                        <span className="absolute right-4 top-4 rounded-full bg-[#FF8C00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col bg-[#1C1C1C] p-6">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
                        <Icon size={20} />
                      </span>
                      <h3 className="mt-4 font-heading text-xl font-bold">
                        {v.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-[#FFD9A8]">
                        {v.tagline}
                      </p>
                      <p className="mt-2 flex-1 text-sm text-white/75">
                        {v.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#FFA733]">
                        {soon
                          ? "Get on the list"
                          : `Explore the ${v.name.replace(/^The\s+/, "")}`}
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------- Why Pit & Masa */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              Why Pit &amp; Masa
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Cooked with care, start to finish.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Every plate starts with intention — food cooked the slow way and
              served with the kind of hospitality that makes guests remember your
              event long after the last taco.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- Signature menu */}
      <section className="relative overflow-hidden bg-[#DEDEDE]">
        <TacoWatermark className="-right-12 top-12" rotate={16} opacity={0.06} size="clamp(150px, 18vw, 300px)" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <motion.div {...fadeUp} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={brandImages.menuFeature}
                alt="Signature smoked meats and tacos from Pit & Masa"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }}>
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              Signature Menu
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Smoked low. Stacked high.
            </h2>
            <p className="mt-4 text-lg text-[#1C1C1C]/65">
              Every menu is built around slow-smoked meats, fresh masa, and
              drinks to match. Mix and match to feed any crowd.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {signatureMenu.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-3 text-[#1C1C1C]/85"
                >
                  <ChefHat size={18} className="shrink-0 text-[#FF8C00]" />
                  {m}
                </li>
              ))}
            </ul>
            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/20 transition hover:shadow-xl hover:shadow-[#FF8C00]/40"
            >
              See the full menu <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------ Festivals teaser */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <Image
          src={brandImages.heroHome}
          alt="Pit & Masa street tacos served walk-up at a festival"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#1C1C1C] via-[#1C1C1C]/85 to-[#1C1C1C]/40" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              <Caravan size={18} /> Out on the Road
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Catch us at a festival.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              When the pit trailer rolls out to a festival, it&apos;s walk-up
              service — smoked tacos, tortas, burritos, masa fries, and
              house-made aguas frescas. Smoke. Masa. Repeat.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/festivals"
                className="inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/20 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
              >
                See the festival menu <ArrowRight size={18} />
              </Link>
              <Link
                href="/festivals#schedule"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                Where to find us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------- How it works */}
      <section className="relative overflow-hidden">
        <TacoWatermark className="-left-10 top-8" rotate={-16} opacity={0.05} size="clamp(140px, 16vw, 260px)" />
        <TacoWatermark className="-right-10 bottom-10 hidden md:block" rotate={10} opacity={0.04} size="clamp(120px, 13vw, 200px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              How It Works
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Booking Connecticut catering is easy.
            </h2>
          </motion.div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-7 shadow-sm"
              >
                <div className="font-heading text-4xl font-black text-[#FF8C00]/30">
                  {step.n}
                </div>
                <h3 className="mt-3 font-heading text-xl font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#1C1C1C]/65">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------- Local SEO / areas */}
      <section className="bg-[#1C1C1C] text-white noise-texture metal-texture">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              <MapPin size={16} /> Serving All of Connecticut
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Mobile BBQ &amp; taco catering across CT.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Pit &amp; Masa is a fully mobile catering company — we bring
              wood-fired smoke and fresh tacos to your home, venue, or worksite
              throughout {serviceAreas.counties.length} Connecticut counties.
            </p>
          </motion.div>
          <motion.ul
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {serviceTowns.map((town) => (
              <li
                key={town}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80"
              >
                {town}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ------------------------------------------ Gallery strip */}
      <section className="bg-[#FEFCF5]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
                Straight Off the Pit
              </p>
              <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
                A look at what lands on the table.
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF8C00] transition hover:gap-2.5"
            >
              See the full gallery <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {galleryStrip.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5"
              >
                <Image
                  src={src}
                  alt="Smoked BBQ and tacos catered by Pit & Masa"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- From the Kitchen */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 top-1/2 hidden -translate-y-1/2 lg:block" opacity={0.05} size="clamp(260px, 26vw, 400px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
                From the Kitchen
              </p>
              <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
                Recipes &amp; stories from the pit.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                A little of what we cook and what we&apos;ve learned — bring our
                techniques home, or get inspired for your next gathering.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#FFA733] hover:text-[#FFA733]"
              >
                All recipes
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#FFA733] hover:text-[#FFA733]"
              >
                Read the blog
              </Link>
            </div>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[recipes[0], recipes[1], blogPosts[0]].map((item, i) => {
              const isRecipe = "ingredients" in item;
              const href = `${isRecipe ? "/recipes" : "/blog"}/${item.slug}`;
              return (
                <motion.div
                  key={item.slug}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    href={href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-[#FF8C00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                        {isRecipe ? "Recipe" : "Blog"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-heading text-lg font-black leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-white/65">
                        {item.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FFA733]">
                        {isRecipe ? "View recipe" : "Read article"}
                        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- Testimonials */}
      <section className="relative overflow-hidden">
        <TacoWatermark className="-right-10 top-12" rotate={-14} opacity={0.05} size="clamp(140px, 16vw, 260px)" />
        <TacoWatermark className="-left-12 bottom-10 hidden md:block" rotate={18} opacity={0.04} size="clamp(120px, 13vw, 200px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
            What Clients Say
          </p>
          <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
            Crowds keep asking who we hired.
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.author}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-7 shadow-sm"
            >
              <div className="flex items-center gap-1 text-[#FF8C00]">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={16} className="fill-current" />
                ))}
              </div>
              <Quote size={28} className="mt-4 text-[#FF8C00]/40" />
              <blockquote className="mt-3 flex-1 text-[#1C1C1C]/80">
                {t.body}
              </blockquote>
              <figcaption className="mt-5">
                <span className="block font-heading font-bold">{t.author}</span>
                <span className="mt-0.5 block text-sm text-[#1C1C1C]/55">
                  {t.role}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="mt-8 text-sm text-[#1C1C1C]/50">
          Catering led by {siteConfig.owner.name}, {siteConfig.owner.title}.
        </p>
        </div>
      </section>

      {/* --------------------------------------------------- FAQ */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture metal-texture">
        <EmblemWatermark className="-right-16 top-1/2 hidden -translate-y-1/2 lg:block" opacity={0.05} size="clamp(280px, 28vw, 420px)" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
          <motion.div {...fadeUp} className="text-center">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              Good to Know
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Questions, answered.
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Everything you need to know before you book. Don&apos;t see your
              question? Just ask — we answer fast.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }} className="mt-10">
            <FAQAccordion items={faqs} variant="dark" />
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------- CTA */}
      <CTASection />
    </div>
  );
}
