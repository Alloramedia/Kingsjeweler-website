import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { blogPosts } from "@/lib/content";
import { getBlogPostBySlug } from "@/lib/admin/schema";
import { siteConfig, brandImages } from "@/lib/constants";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RichText } from "@/components/RichText";
import { EmblemWatermark, TacoAccent, TacoWatermark } from "@/components/SectionTextures";

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
    alternates: { canonical: `https://www.pitandmasa.com/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} | Pit & Masa Blog`,
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
      "@type": "Person",
      name: post.author,
      jobTitle: siteConfig.owner.title,
      url: `${siteConfig.url}/about`,
      knowsAbout: [
        "BBQ catering",
        "Wood-fired smoking",
        "Taco catering",
        "Birria",
        "Event catering in Connecticut",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
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

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/55 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-40 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-[#FFA733]"
          >
            <ArrowLeft size={16} /> Back to blog
          </Link>
          <p className="mt-6 flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <TacoAccent size={26} className="drop-shadow" />
            {post.category}
          </p>
          <h1 className="mt-3 font-display! text-4xl font-normal! uppercase leading-tight md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/75">
            <span>{post.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} className="text-[#FFA733]" />
              {formatDate(post.date)}
            </span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-16" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-20 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="space-y-10">
            {post.body.map((block, i) => (
              <div key={i}>
                {block.heading && (
                  <h2 className="font-heading text-2xl font-black">{block.heading}</h2>
                )}
                <div className={block.heading ? "mt-4 space-y-4" : "space-y-4"}>
                  {block.paragraphs.map((p, j) => (
                    <p key={j} className="text-lg leading-relaxed text-[#1C1C1C]/75">
                      <RichText text={p} />
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-black">
                Frequently asked questions
              </h2>
              <div className="mt-6">
                <FAQAccordion items={post.faqs} variant="light" accentColor="#008080" />
              </div>
            </div>
          )}

          {post.related && post.related.length > 0 && (
            <div className="mt-16 rounded-2xl border border-[#008080]/20 bg-[#008080]/5 p-8">
              <h2 className="font-heading text-xl font-black text-[#1C1C1C]">
                Related reading
              </h2>
              <ul className="mt-5 space-y-3">
                {post.related.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 font-semibold text-[#E67E00] transition hover:text-[#FF8C00]"
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
          <div className="mt-16 flex flex-col gap-5 rounded-2xl border border-[#FF8C00]/20 bg-white/70 p-7 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-[#FF8C00]/40">
              <Image
                src={brandImages.owner}
                alt={siteConfig.owner.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
                Written by
              </p>
              <p className="mt-1 font-heading text-lg font-black text-[#1C1C1C]">
                {siteConfig.owner.name}
                <span className="ml-2 align-middle text-sm font-semibold text-[#E67E00]">
                  {siteConfig.owner.title}
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#1C1C1C]/70">
                {siteConfig.owner.bio}{" "}
                <Link
                  href="/about"
                  className="font-semibold text-[#E67E00] underline decoration-[#FF8C00]/40 underline-offset-2 transition hover:text-[#FF8C00] hover:decoration-[#FF8C00]"
                >
                  More about Pit &amp; Masa
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-2xl border border-[#FF8C00]/20 bg-[#FF8C00]/5 p-8 text-center">
            <h3 className="font-heading text-2xl font-black">Let us handle the cooking.</h3>
            <p className="mx-auto mt-3 max-w-xl text-[#1C1C1C]/70">
              Planning an event in Connecticut? Tell us what you have in mind and
              we&apos;ll build a menu your guests will remember.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/20 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
            >
              Get a quote <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* More posts */}
      <section className="relative overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <h2 className="font-display! text-3xl font-normal! uppercase md:text-4xl">Keep reading</h2>
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
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#FFA733]">{p.category}</p>
                  <h3 className="mt-1.5 font-heading text-lg font-bold leading-snug">{p.title}</h3>
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
