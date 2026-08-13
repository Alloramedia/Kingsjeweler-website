import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Flame, Gauge, Lightbulb } from "lucide-react";
import { recipes } from "@/lib/content";
import { getSiteContent, getRecipeBySlug } from "@/lib/admin/schema";
import { siteConfig } from "@/lib/constants";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { EmblemWatermark, TacoAccent, TacoWatermark } from "@/components/SectionTextures";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

/** Convert a human-readable time string (e.g. "1 hour 30 minutes") to an
 *  ISO 8601 duration ("PT1H30M") so Google can parse it for recipe rich
 *  results. Returns undefined when no hours/minutes can be detected. */
function toISO8601Duration(time: string): string | undefined {
  const hours = time.match(/(\d+)\s*h(?:ou)?r/i);
  const minutes = time.match(/(\d+)\s*min/i);
  if (!hours && !minutes) return undefined;
  return `PT${hours ? `${hours[1]}H` : ""}${minutes ? `${minutes[1]}M` : ""}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) {
    return { title: "Recipe Not Found" };
  }
  return {
    title: `${recipe.title} — Recipe`,
    description: recipe.excerpt,
    alternates: { canonical: `https://www.pitandmasa.com/recipes/${recipe.slug}` },
    openGraph: {
      title: `${recipe.title} | Pit & Masa Recipes`,
      description: recipe.excerpt,
      images: [{ url: recipe.image, width: 1200, height: 630 }],
    },
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) {
    notFound();
  }

  const totalTime = toISO8601Duration(recipe.time);
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.excerpt,
    image: [`${siteConfig.url}${recipe.image}`],
    author: { "@type": "Organization", name: siteConfig.name },
    datePublished: recipe.date,
    recipeCategory: recipe.category,
    recipeYield: `${recipe.serves} servings`,
    ...(totalTime ? { totalTime } : {}),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step) => ({
      "@type": "HowToStep",
      name: step.title,
      text: step.body,
    })),
  };

  const more = recipes.filter((r) => r.slug !== recipe.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Recipes", href: "/recipes" },
          { name: recipe.title, href: `/recipes/${recipe.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/55 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-40 lg:px-8">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-[#FFA733]"
          >
            <ArrowLeft size={16} /> All recipes
          </Link>
          <p className="mt-6 flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <TacoAccent size={26} className="drop-shadow" />
            {recipe.category}
          </p>
          <h1 className="mt-3 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-5xl">
            {recipe.title}
          </h1>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/80">
            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-[#FFA733]" /> {recipe.time}
            </span>
            <span className="inline-flex items-center gap-2">
              <Gauge size={16} className="text-[#FFA733]" /> {recipe.difficulty}
            </span>
            <span className="inline-flex items-center gap-2">
              <Flame size={16} className="text-[#FFA733]" /> Serves {recipe.serves}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-16" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-20 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24">
          {/* Intro */}
          <div className="max-w-2xl space-y-4">
            {recipe.intro.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-[#1C1C1C]/75">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Ingredients */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-7 shadow-sm">
                <h2 className="font-heading text-2xl font-black">Ingredients</h2>
                <ul className="mt-5 space-y-3">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient} className="flex items-start gap-3 text-[#1C1C1C]/80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF8C00]" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Steps */}
            <div>
              <h2 className="font-heading text-2xl font-black">Method</h2>
              <ol className="mt-6 space-y-8">
                {recipe.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF8C00] font-heading text-lg font-black text-white shadow">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold">{step.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-[#1C1C1C]/70">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Tip */}
              <div className="mt-10 flex gap-4 rounded-2xl border border-[#FF8C00]/20 bg-[#FF8C00]/5 p-6">
                <Lightbulb size={22} className="mt-0.5 shrink-0 text-[#FF8C00]" />
                <div>
                  <p className="font-heading text-sm font-bold uppercase tracking-wide text-[#E67E00]">
                    Pitmaster tip
                  </p>
                  <p className="mt-1.5 leading-relaxed text-[#1C1C1C]/75">{recipe.tip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More recipes */}
      <section className="relative overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <h2 className="font-display! text-3xl font-normal! uppercase md:text-4xl">More from the kitchen</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((r) => (
              <Link
                key={r.slug}
                href={`/recipes/${r.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#FFA733]">{r.category}</p>
                  <h3 className="mt-1.5 font-heading text-lg font-bold leading-snug">{r.title}</h3>
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
