import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { getSiteContent } from "@/lib/admin/schema";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { EmblemWatermark, TacoAccent, TacoWatermark } from "@/components/SectionTextures";

export const metadata: Metadata = {
  title: "Blog — Catering Tips & Food Stories",
  description:
    "Catering tips, hosting guides, and food stories from the Pit & Masa kitchen. Plan a better party, choose the right menu, and cook with more confidence across Connecticut.",
  alternates: { canonical: "https://www.pitandmasa.com/blog" },
  openGraph: {
    title: "Blog — Catering Tips & Food Stories | Pit & Masa",
    description:
      "Catering tips, hosting guides, and food stories from the Pit & Masa kitchen.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const { blog: blogPosts } = await getSiteContent();
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <Image
          src="/images/food/food-045.webp"
          alt="Pit & Masa catering spread"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-40 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <TacoAccent size={28} className="drop-shadow" />
            The Pit & Masa Blog
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            Tips, guides &amp; food stories.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Everything we&apos;ve learned feeding crowds across Connecticut —
            from planning a stress-free party to what makes great birria worth
            the wait.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] shadow-sm transition hover:shadow-lg lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <span className="inline-flex w-fit rounded-full bg-[#FF8C00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {featured.category}
              </span>
              <h2 className="mt-5 font-heading text-3xl font-black leading-tight">
                {featured.title}
              </h2>
              <p className="mt-4 text-[#1C1C1C]/65">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-sm font-semibold text-[#1C1C1C]/55">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} className="text-[#FF8C00]" />
                  {formatDate(featured.date)}
                </span>
                <span>{featured.readTime}</span>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-bold text-[#FF8C00]">
                Read article
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Rest */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#FF8C00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-xl font-black leading-snug">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-[#1C1C1C]/65">{post.excerpt}</p>
                  <div className="mt-5 flex items-center gap-3 text-xs font-semibold text-[#1C1C1C]/55">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-[#FF8C00]" />
                      {formatDate(post.date)}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
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
