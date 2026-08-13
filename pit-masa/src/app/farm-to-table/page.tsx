import { Metadata } from "next";
import Image from "next/image";
import {
  Sprout,
  Tractor,
  MapPin,
  HeartHandshake,
  Sun,
  Leaf,
} from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { EmblemWatermark, TacoAccent, TacoWatermark } from "@/components/SectionTextures";
import { HeroSlideshow } from "@/components/HeroSlideshow";

const baseMetadata: Metadata = {
  title: "Farm to Table — Locally Sourced Ingredients",
  description:
    "Pit & Masa partners with Connecticut farms to source meat, produce, and masa ingredients close to home. Discover how local, seasonal sourcing shapes every plate we serve.",
  alternates: {
    canonical: "https://www.pitandmasa.com/farm-to-table",
  },
  openGraph: {
    title: "Farm to Table | Pit & Masa",
    description:
      "How Pit & Masa sources from Connecticut farms — local meat, seasonal produce, and fresh masa for every event we cater.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farm to Table | Pit & Masa",
    description:
      "How Pit & Masa sources from Connecticut farms — local meat, seasonal produce, and fresh masa for every event we cater.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.farmToTable);
}

const principles = [
  {
    icon: MapPin,
    title: "Sourced close to home",
    body: "Whenever the season allows, our ingredients come from farms right here in Connecticut — not a distribution center halfway across the country.",
  },
  {
    icon: Sun,
    title: "Cooked in season",
    body: "We build menus around what the fields are actually growing. When produce is at its peak, it tastes better and travels less to reach your plate.",
  },
  {
    icon: HeartHandshake,
    title: "Real relationships",
    body: "We know our growers and ranchers by name. Buying direct means we can trust how the animals were raised and how the produce was grown.",
  },
  {
    icon: Leaf,
    title: "Less distance, more flavor",
    body: "Shorter supply chains mean fresher food and a smaller footprint. Good for your guests, good for the farms, good for Connecticut.",
  },
];

const sourcing = [
  {
    icon: Tractor,
    title: "Pasture-raised meats",
    body: "Brisket, pork, and chicken from regional farms that raise their animals on pasture — the foundation of everything that hits the smoker.",
  },
  {
    icon: Sprout,
    title: "Seasonal produce",
    body: "Tomatoes, peppers, onions, and herbs for our salsas and slaws, picked from nearby fields and brought to the comal at their freshest.",
  },
  {
    icon: Sun,
    title: "Fresh masa & corn",
    body: "Corn and masa milled close to home, so our tortillas have the flavor and snap you only get from grain that hasn't sat in storage for months.",
  },
];

const farmGallery = [
  "/images/food/food-025.webp",
  "/images/food/food-071.webp",
  "/images/food/food-108.webp",
  "/images/food/food-084.webp",
];

export default async function FarmToTablePage() {
  const { brandImages, faqs, serviceTowns } = await getSiteContent();
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Farm to Table", href: "/farm-to-table" },
        ]}
      />
      <FAQSchema faqs={faqs.farmToTable} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <HeroSlideshow
          images={brandImages.heroSlides}
          alt="Locally sourced ingredients prepared by Pit & Masa"
          className="opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-40 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <TacoAccent size={28} className="drop-shadow" />
            Farm to Table
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            Great food starts at the farm.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            We partner with Connecticut farms to source the meat, produce, and
            masa we cook with — so the flavor on your plate is grown close to
            home and never travels far to get there.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-16 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-lg leading-relaxed text-[#1C1C1C]/75">
            At Pit &amp; Masa, we believe the best meal starts long before it
            hits the smoker. That&apos;s why we work with local farms across
            Connecticut to source as much of our food as the season allows —
            pasture-raised meats, fresh produce, and corn for our masa, grown by
            people we actually know.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#1C1C1C]/75">
            Buying local isn&apos;t just a buzzword for us. It means our
            ingredients spend less time in transit and more time at their peak.
            It means we can trace where our food comes from and trust how it was
            raised and grown. And it means every dollar we spend helps keep
            Connecticut&apos;s farms thriving for the next season.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#1C1C1C]/75">
            From the brisket on the pit to the salsa on your taco, sourcing close
            to home is how we deliver the kind of flavor you simply can&apos;t
            get from a distribution truck.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              <TacoAccent size={26} />
              Why Local Matters
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              The thinking behind every ingredient.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              These are the values that guide how we shop, plan menus, and feed
              your guests.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What we source */}
      <section className="relative overflow-hidden bg-[#DEDEDE] text-[#1C1C1C]">
        <TacoWatermark className="-right-10 bottom-10" rotate={12} opacity={0.06} size="clamp(140px, 16vw, 260px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              <TacoAccent size={26} />
              From the Farm
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              What we source locally.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {sourcing.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="rounded-2xl border border-[#1C1C1C]/10 bg-[#FEFCF5] p-7 shadow-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FF8C00]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1C1C1C]/70">
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-[#FEFCF5]">
        <div className="mx-auto max-w-6xl px-6 pt-20 text-center lg:px-8 lg:pt-28">
          <p className="flex items-center justify-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
            <TacoAccent size={26} />
            On the Plate
          </p>
          <h2 className="mt-3 font-display! text-3xl font-normal! uppercase text-[#1C1C1C] md:text-4xl">
            Local ingredients, Connecticut flavor.
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {farmGallery.map((src) => (
            <div key={src} className="group relative aspect-square overflow-hidden">
              <Image
                src={src}
                alt="Dishes made with locally sourced ingredients by Pit & Masa in Connecticut"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-[#FEFCF5]">
        <TacoWatermark className="-left-10 top-10 hidden md:block" rotate={-12} opacity={0.05} size="clamp(130px, 15vw, 230px)" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="text-center">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              Good to Know
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase text-[#1C1C1C] md:text-4xl">
              Questions about our sourcing.
            </h2>
          </div>
          <div className="mt-10">
            <FAQAccordion items={faqs.farmToTable} variant="light" accentColor="#FF8C00" />
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="bg-[#FEFCF5] text-[#1C1C1C]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="font-display! text-2xl font-normal! uppercase md:text-3xl">
            Rooted in Connecticut, served across the state
          </h2>
          <p className="mt-4 text-[#1C1C1C]/65">
            {serviceTowns.slice(0, 12).join(" · ")} and every town in
            between — {siteConfig.name} brings locally sourced food to your table.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
