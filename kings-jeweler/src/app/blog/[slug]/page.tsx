import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { blogPosts } from "@/lib/content";
import { getBlogPostBySlug } from "@/lib/admin/schema";
import { siteConfig, brandImages, BLUR_DATA_URL } from "@/lib/constants";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RichText } from "@/components/RichText";
import { EmblemWatermark } from "@/components/SectionTextures";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Article Not Found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.kingsjewelerct.com/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${post.title} | King's Jeweler Blog`,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [`${siteConfig.url}${post.image}`],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: `${siteConfig.url}/about`,
      knowsAbout: [
        "Fine jewelry",
        "Engagement rings",
        "Jewelry repair",
        "Watch batteries",
        "Gold buying",
        "Jewelry appraisals",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/kings-jeweler-badge.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
  };

  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      {post.faqs && post.faqs.length > 0 && <FAQSchema faqs={post.faqs} />}

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#14141A]/60 via-[#14141A]/75 to-[#14141A]" />
        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-36 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-[#F0A92D]"
          >
            <ArrowLeft size={16} /> Back to blog
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#F0A92D]">
            {post.category}
          </p>
          <h1 className="font-display! mt-3 text-4xl font-normal! uppercase leading-tight md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/75">
            <span>{post.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} className="text-[#F0A92D]" />
              {formatDate(post.date)}
            </span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#FBF9F4] text-[#14141A]">
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="space-y-10">
            {post.body.map((block, i) => (
              <div key={i}>
                {block.heading && (
                  <h2 className="text-2xl font-bold">{block.heading}</h2>
                )}
                <div className={block.heading ? "mt-4 space-y-4" : "space-y-4"}>
                  {block.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className="text-lg leading-relaxed text-[#14141A]/75"
                    >
                      <RichText text={p} />
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold">
                Frequently asked questions
              </h2>
              <div className="mt-6">
                <FAQAccordion items={post.faqs} variant="light" />
              </div>
            </div>
          )}

          {post.related && post.related.length > 0 && (
            <div className="mt-16 rounded-2xl border border-[#C68A17]/25 bg-[#C68A17]/5 p-8">
              <h2 className="text-xl font-bold">Related reading</h2>
              <ul className="mt-5 space-y-3">
                {post.related.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 font-semibold text-[#A87310] transition hover:text-[#C68A17]"
                    >
                      <ArrowRight
                        size={17}
                        className="shrink-0 transition group-hover:translate-x-1"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author / E-E-A-T */}
          <div className="mt-16 flex flex-col gap-5 rounded-2xl border border-[#14141A]/10 bg-[#FFFDF8] p-7 shadow-sm sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-[#C68A17]/40">
              <Image
                src={brandImages.owner}
                alt={siteConfig.owner.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C68A17]">
                Written by
              </p>
              <p className="mt-1 text-lg font-bold">
                {siteConfig.owner.name}
                <span className="ml-2 align-middle text-sm font-semibold text-[#A87310]">
                  {siteConfig.owner.title}
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#14141A]/70">
                {siteConfig.owner.bio}{" "}
                <Link
                  href="/about"
                  className="font-semibold text-[#A87310] underline decoration-[#C68A17]/40 underline-offset-2 transition hover:text-[#C68A17] hover:decoration-[#C68A17]"
                >
                  More about King&apos;s Jeweler
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-2xl bg-[#14141A] p-8 text-center text-white">
            <h3 className="text-2xl font-bold">Have a question about your jewelry?</h3>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Bring it in — we&apos;ll take a look, explain your options, and
              give you an honest answer on the spot at The Shoppes at Buckland
              Hills in Manchester, CT.
            </p>
            <Link
              href="/contact"
              className="btn-gold mt-6 inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white"
            >
              Visit or Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── More posts ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#14141A] text-white">
        <EmblemWatermark
          className="-left-20 bottom-0 hidden lg:block"
          opacity={0.05}
          size="clamp(280px, 30vw, 440px)"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <h2 className="font-display! text-3xl font-normal! uppercase md:text-4xl">
            Keep reading
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#F0A92D]">
                    {p.category}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold leading-snug">
                    {p.title}
                  </h3>
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
