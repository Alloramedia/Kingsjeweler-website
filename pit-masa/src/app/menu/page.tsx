import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, UtensilsCrossed, Leaf, Star } from "lucide-react";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { CateringMenuGroups } from "@/components/CateringMenuGroups";
import { EmblemWatermark, TacoAccent, TacoWatermark } from "@/components/SectionTextures";

const baseMetadata: Metadata = {
  title: "Catering Packages — Weddings, Parties & Corporate",
  description:
    "Explore Pit & Masa catering packages built for your event — wedding buffets, taco fiestas, smokehouse feasts, and brunch — plus add-on live stations like taco bars, street corn, meat carving, and a mobile cantina across Connecticut.",
  alternates: { canonical: "https://www.pitandmasa.com/menu" },
  openGraph: {
    title: "Catering Packages — Weddings, Parties & Corporate | Pit & Masa",
    description:
      "Wedding buffets, taco fiestas, smokehouse feasts, brunch, and add-on live stations — smoked BBQ and tacos tailored to your event.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.menu);
}

/** Reassurance cards shown below the packages. */
const customization = [
  {
    icon: Leaf,
    title: "Dietary-friendly",
    body: "Vegetarian fillings, gluten-friendly options, and allergy-aware prep — just tell us what your guests need.",
  },
  {
    icon: UtensilsCrossed,
    title: "Built to scale",
    body: "Portions and packages sized for 15 guests or 200+, so nobody leaves hungry and nothing goes to waste.",
  },
  {
    icon: Star,
    title: "Tailored to you",
    body: "Mix and match across the menu. We'll shape the final spread around your event, venue, and budget.",
  },
];

export default async function MenuPage() {
  const { menu, brandImages } = await getSiteContent();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Menu", href: "/menu" },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <Image
          src={brandImages.menuFeature}
          alt="A spread of smoked meats and tacos from Pit & Masa"
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
            Catering Packages
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            Smoked low. Stacked high.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Every Pit &amp; Masa catering package is built around wood-fired
            smoked meats and fresh masa, then tailored to your event. Pick a
            package built for your occasion — weddings, parties, corporate, or
            brunch — then add live stations to make it yours.
          </p>
        </div>
      </section>

      {/* Menu sections */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-16 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <CateringMenuGroups menu={menu} />

          <p className="mt-10 max-w-3xl text-[#1C1C1C]/65">
            Every package is fully customizable — vegetarian options, dietary
            needs, and headcount are all on the table. Menus also vary by setup:
            our food truck and pit trailer each serve a slightly different spread,
            so use the filter above to see what each rig brings — or let us match
            the right one to your venue.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/20 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
          >
            Build my menu <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Customization band */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              <TacoAccent size={26} />
              Make It Yours
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              No two menus are the same.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Think of the list above as a starting point. The real menu is the
              one we build with you.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {customization.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {c.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
