import { Metadata } from "next";
import Image from "next/image";
import { Flame, ChefHat, HeartHandshake, Leaf } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { EmblemWatermark, TacoAccent, TacoWatermark } from "@/components/SectionTextures";

const baseMetadata: Metadata = {
  title: "About Pit & Masa — CT Mobile BBQ & Taco Catering",
  description:
    "Meet Pit & Masa, a Connecticut mobile BBQ & taco catering company led by owner & pitmaster Ryan \"Buck\" Buchanan — bringing wood-fired smoke, fresh masa, and chef-prepared meals to events across CT.",
  alternates: {
    canonical: "https://www.pitandmasa.com/about",
  },
  openGraph: {
    title: "About Pit & Masa",
    description:
      "A Connecticut mobile BBQ & taco catering company led by owner & pitmaster Ryan \"Buck\" Buchanan.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Pit & Masa",
    description:
      "A Connecticut mobile BBQ & taco catering company led by owner & pitmaster Ryan \"Buck\" Buchanan.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.about);
}

const values = [
  {
    icon: Flame,
    title: "Smoke takes time",
    body: "We don't rush the pit. Briskets go on the night before and come off when they're ready — never a minute sooner. Patience is the secret ingredient.",
  },
  {
    icon: ChefHat,
    title: "Everything from scratch",
    body: "Fresh-pressed tortillas, hand-blended salsas, and rubs we mix ourselves. If it can be made by hand, we make it by hand.",
  },
  {
    icon: HeartHandshake,
    title: "Hospitality first",
    body: "We treat your guests like our own family at the table. Warm plates, full trays, and a crew that's genuinely glad to be there.",
  },
  {
    icon: Leaf,
    title: "Sourced with care",
    body: "Quality cuts, fresh produce, and local ingredients whenever we can get them. Good food starts long before it hits the smoker.",
  },
];

const aboutGallery = [
  "/images/food/food-112.webp", // pitmaster on-site at event
  "/images/food/food-049.webp", // chef serving guests
  "/images/food/food-086.webp", // smoked & grilled meats board
  "/images/food/food-104.webp", // finished taco
];

export default async function AboutPage() {
  const { brandImages, faqs, serviceTowns } = await getSiteContent();
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <FAQSchema faqs={faqs.about} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <Image
          src={brandImages.aboutFeature}
          alt="Pit & Masa wood-fired BBQ and tacos"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-40 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <TacoAccent size={28} className="drop-shadow" />
            Our Story
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            Smoke, masa, and a whole lot of flavor.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            We&apos;re a Connecticut catering crew obsessed with two things done
            right: low-and-slow smoked meats and real, handmade tacos — brought
            straight to wherever you&apos;re gathering.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-16 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-lg leading-relaxed text-[#1C1C1C]/75">
            Pit &amp; Masa was born from two obsessions: low-and-slow smoked meats
            and real, handmade tacos. We&apos;re a mobile catering team that
            brings the pit and the comal straight to your event — so your guests
            get restaurant-quality BBQ and tacos without anyone leaving the party.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#1C1C1C]/75">
            It started the way most good food does — feeding friends and family,
            chasing that perfect bark on a brisket and the snap of a fresh
            tortilla off the comal. One backyard cook turned into a neighbor&apos;s
            graduation, then a wedding, then a 200-person company party. Word
            traveled the way smoke does: slowly, then all at once.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#1C1C1C]/75">
            From backyard parties and birthdays to holiday gatherings and work
            events, we cater all across Connecticut. And when you&apos;re not
            throwing a party, our holiday meal packs and weekly meal-prep plans
            keep great food on your table every day of the week.
          </p>
        </div>
      </section>

      {/* What we stand for */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              <TacoAccent size={26} />
              What We Stand For
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              The standards behind every plate.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              These aren&apos;t marketing lines — they&apos;re the rules we cook
              by, every single event.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {v.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Owner */}
      <section className="relative overflow-hidden bg-[#DEDEDE] text-[#1C1C1C]">
        <TacoWatermark className="-right-10 bottom-10" rotate={12} opacity={0.06} size="clamp(140px, 16vw, 260px)" />
        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 lg:grid-cols-[2fr_3fr] lg:px-8 lg:py-28">
          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={brandImages.owner}
              alt={`${siteConfig.owner.name}, ${siteConfig.owner.title} at Pit & Masa`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[50%_20%]"
            />
          </div>
          <div>
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              Meet the Pitmaster
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              {siteConfig.owner.name}
            </h2>
            <p className="mt-1 font-semibold text-[#FF8C00]">
              {siteConfig.owner.title}
            </p>
            <p className="mt-5 text-lg leading-relaxed text-[#1C1C1C]/75">
              Behind every Pit &amp; Masa event is {siteConfig.owner.name} — the
              hands on the pit and the heart of the kitchen. From dialing in the
              smoke on a brisket to building the perfect birria taco, Buck leads
              every cook personally, so the food that reaches your guests is made
              with real care.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#1C1C1C]/75">
              He&apos;ll be the first one up tending the fire and the last one
              packing up the rig — because to Buck, your event isn&apos;t a job on
              a schedule. It&apos;s a table full of people he wants to feed well.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Wood-fired BBQ", "Birria & street tacos", "Made-from-scratch masa", "Full-service hosting"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#1C1C1C]/15 bg-[#FEFCF5] px-4 py-2 text-sm font-medium text-[#1C1C1C]/75"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-[#FEFCF5]">
        <div className="mx-auto max-w-6xl px-6 pt-20 text-center lg:px-8 lg:pt-28">
          <p className="flex items-center justify-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
            <TacoAccent size={26} />
            From Our Events
          </p>
          <h2 className="mt-3 font-display! text-3xl font-normal! uppercase text-[#1C1C1C] md:text-4xl">
            Real smoke. Real plates. Real Connecticut.
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {aboutGallery.map((src) => (
            <div key={src} className="group relative aspect-square overflow-hidden">
              <Image
                src={src}
                alt="Smoked BBQ and tacos catered by Pit & Masa in Connecticut"
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
              A few things people ask.
            </h2>
          </div>
          <div className="mt-10">
            <FAQAccordion items={faqs.about} variant="light" accentColor="#FF8C00" />
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="bg-[#FEFCF5] text-[#1C1C1C]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="font-display! text-2xl font-normal! uppercase md:text-3xl">
            Proudly serving all of Connecticut
          </h2>
          <p className="mt-4 text-[#1C1C1C]/65">
            {serviceTowns.slice(0, 12).join(" · ")} and every town in
            between.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
