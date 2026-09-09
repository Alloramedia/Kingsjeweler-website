import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { getSiteContent } from "@/lib/admin/schema";
import { BLUR_DATA_URL } from "@/lib/constants";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { EmblemWatermark } from "@/components/SectionTextures";

export const metadata: Metadata = {
  title: "Jewelry Blog: Buying Guides & Advice",
  description:
    "Honest jewelry advice from King's Jeweler in Manchester, CT: engagement ring guides, repair and resizing costs, gold selling tips, and jewelry care.",
  alternates: { canonical: "https://www.kingsjewelerct.com/blog" },
  openGraph: {
    title: "Jewelry Blog: Buying Guides & Expert Advice | King's Jeweler",
    description:
      "Engagement ring guides, repair costs, gold selling tips, and jewelry care advice from a family jeweler in Manchester, Connecticut.",
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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white">
        <EmblemWatermark
          className="-right-16 top-24 hidden md:block"
          opacity={0.06}
          size="clamp(260px, 32vw, 460px)"
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-36 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#F0A92D]">
            The King&apos;s Jeweler Blog
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.06] tracking-tight md:text-6xl">
            Honest jewelry <em className="font-medium italic text-[#F0A92D]">advice</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Buying guides, real repair prices, and care tips from the family
            jewelers at The Shoppes at Buckland Hills in Manchester,
            Connecticut, written the same way we explain things at the
            counter.
          </p>
        </div>
      </section>

      {/* ── Posts ────────────────────────────────────────────── */}
      <section className="bg-[#FBF9F4] text-[#14141A]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden border border-[#14141A]/15 bg-[#FFFDF8] transition-colors hover:border-[#C68A17]/50 lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <span className="inline-flex w-fit bg-[#C68A17] px-3 py-1 font-label text-xs font-medium uppercase tracking-[0.18em] text-white">
                  {featured.category}
                </span>
                <h2 className="mt-5 text-3xl font-bold leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-4 leading-relaxed text-[#14141A]/65">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm font-semibold text-[#14141A]/55">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={15} className="text-[#C68A17]" />
                    {formatDate(featured.date)}
                  </span>
                  <span>{featured.readTime}</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 font-bold text-[#A87310]">
                  Read article
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          )}

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden border border-[#14141A]/15 bg-[#FFFDF8] transition-colors hover:border-[#C68A17]/50"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 bg-[#C68A17] px-3 py-1 font-label text-xs font-medium uppercase tracking-[0.18em] text-white">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#14141A]/65">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-3 text-xs font-semibold text-[#14141A]/55">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-[#C68A17]" />
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
