import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Flame, Gauge } from "lucide-react";
import { getSiteContent } from "@/lib/admin/schema";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { EmblemWatermark, TacoAccent, TacoWatermark } from "@/components/SectionTextures";

export const metadata: Metadata = {
  title: "Recipes — Smoke, Masa & Fixings",
  description:
    "Cook a little Pit & Masa at home. Wood-fired brisket, birria tacos, street corn, house salsa, and more — the recipes and techniques behind our Connecticut catering menu.",
  alternates: { canonical: "https://www.pitandmasa.com/recipes" },
  openGraph: {
    title: "Recipes — Smoke, Masa & Fixings | Pit & Masa",
    description:
      "Wood-fired brisket, birria tacos, elote, house salsa, and more — recipes from the Pit & Masa kitchen.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default async function RecipesPage() {
  const { recipes } = await getSiteContent();
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Recipes", href: "/recipes" },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <Image
          src="/images/food/food-015.webp"
          alt="Smoked meats and tacos from the Pit & Masa kitchen"
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
            From the Kitchen
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            Bring the pit home.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            We love feeding crowds — but we love good food even more. These are
            the BBQ and taco recipes and techniques behind our Connecticut
            catering menu, written so you can pull them off in your own backyard.
          </p>
        </div>
      </section>

      {/* Recipe grid */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-16 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/recipes/${recipe.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={`${recipe.title} — Pit & Masa recipe`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#FF8C00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                    {recipe.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-heading text-xl font-black leading-snug">
                    {recipe.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-[#1C1C1C]/65">
                    {recipe.excerpt}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#1C1C1C]/55">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} className="text-[#FF8C00]" /> {recipe.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Gauge size={14} className="text-[#FF8C00]" /> {recipe.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Flame size={14} className="text-[#FF8C00]" /> Serves {recipe.serves}
                    </span>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FF8C00]">
                    View recipe
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
