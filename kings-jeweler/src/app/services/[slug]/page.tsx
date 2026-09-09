import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { servicePages, getServicePage } from "@/lib/services";
import { siteConfig, BLUR_DATA_URL } from "@/lib/constants";
import {
  BreadcrumbSchema,
  FAQSchema,
  ServiceSchema,
} from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) {
    return { title: "Service Not Found" };
  }
  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    keywords: [...service.keywords],
    alternates: {
      canonical: `${siteConfig.url}/services/${service.slug}`,
    },
    openGraph: {
      type: "website",
      title: service.metaTitle,
      description: service.metaDescription,
      images: [{ url: service.heroImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
      images: [{ url: service.heroImage, width: 1200, height: 630 }],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) {
    notFound();
  }

  const otherServices = servicePages.filter((s) => s.slug !== service.slug);

  return (
    <>
      <ServiceSchema
        name={service.schemaName}
        description={service.schemaDescription}
        priceRange={service.priceRange}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.label, href: `/services/${service.slug}` },
        ]}
      />
      <FAQSchema faqs={service.faqs} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white">
        <Image
          src={service.heroImage}
          alt={service.heroImageAlt}
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#14141A]/60 via-[#14141A]/40 to-[#14141A]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-6 pt-40 pb-20 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#F0A92D]">
            {service.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl leading-[1.06] tracking-tight md:text-5xl lg:text-6xl">
            {service.h1}{" "}
            <em className="font-medium italic text-[#F0A92D]">{service.h1Em}</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {service.intro}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              href="/contact"
              className="btn-gold inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white"
            >
              Visit or Contact Us
              <ArrowRight size={16} />
            </Link>
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-[#F0A92D]"
            >
              <Phone size={15} className="text-[#F0A92D]" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── Feature checklist ────────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <h2 className="text-2xl tracking-tight text-[#A87310] md:text-3xl">
            {service.featuresHeading}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {service.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xs border border-[#14141A]/15 bg-[#FFFDF8] p-6"
              >
                <div className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-[#C68A17]" />
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#14141A]/65">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body sections with photos ────────────────────────── */}
      <section className="bg-[#FFFDF8] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto max-w-6xl space-y-16 px-6 md:space-y-24 lg:px-8">
          {service.sections.map((section, i) => (
            <div
              key={section.heading}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={section.image && i % 2 === 1 ? "lg:order-2" : undefined}>
                <h2 className="text-2xl leading-snug tracking-tight md:text-3xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((para) => (
                  <p
                    key={para.slice(0, 40)}
                    className="mt-5 leading-relaxed text-[#14141A]/70"
                  >
                    {para}
                  </p>
                ))}
              </div>
              {section.image && (
                <figure className="relative border border-[#14141A]/15 p-2">
                  <div className="relative aspect-5/4 overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.imageAlt ?? section.heading}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </figure>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Location strip ───────────────────────────────────── */}
      <section className="border-y border-[#C68A17]/30 bg-[#14141A] py-10 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 px-6 sm:flex-row sm:items-center lg:px-8">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-[#F0A92D]" />
            <p className="text-sm leading-relaxed text-white/75">
              Find us inside {siteConfig.address.suite},{" "}
              {siteConfig.address.street}, {siteConfig.address.city},{" "}
              {siteConfig.address.region} {siteConfig.address.zip}. Serving{" "}
              {siteConfig.serviceArea}.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#F0A92D] transition-colors hover:text-white"
          >
            Directions and hours
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#A87310]">
            Common Questions
          </p>
          <h2 className="mt-5 text-3xl tracking-tight md:text-4xl">
            {service.label},{" "}
            <em className="font-medium italic text-[#A87310]">answered</em>
          </h2>
          <div className="mt-10">
            <FAQAccordion items={service.faqs} variant="light" accentColor="#C68A17" />
          </div>

          {service.relatedPosts.length > 0 && (
            <div className="mt-12 rounded-xs border border-[#14141A]/15 bg-[#FFFDF8] p-7">
              <h3 className="font-label text-xs font-medium uppercase tracking-[0.22em] text-[#A87310]">
                Keep reading
              </h3>
              <ul className="mt-4 space-y-3">
                {service.relatedPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group inline-flex items-center gap-2 font-medium text-[#14141A] transition-colors hover:text-[#A87310]"
                    >
                      {post.label}
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ── Other services ───────────────────────────────────── */}
      <section className="bg-[#FFFDF8] py-14 text-[#14141A]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <h2 className="text-xl font-bold tracking-tight">
            More from King&apos;s Jeweler
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-xs border border-[#14141A]/20 px-4 py-2 text-sm font-medium transition-colors hover:border-[#C68A17] hover:text-[#A87310]"
              >
                {s.label}
              </Link>
            ))}
            <Link
              href="/sell-gold"
              className="rounded-xs border border-[#14141A]/20 px-4 py-2 text-sm font-medium transition-colors hover:border-[#C68A17] hover:text-[#A87310]"
            >
              We Buy Gold
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        headline={
          <>
            {service.ctaHeadline.split(" ").slice(0, -1).join(" ")}{" "}
            <em className="font-medium italic text-[#F0A92D]">
              {service.ctaHeadline.split(" ").slice(-1)}
            </em>
          </>
        }
        subhead={service.ctaSubhead}
      />
    </>
  );
}
