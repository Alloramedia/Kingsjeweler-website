import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { townPages, getTownPage, commonTownFaqs } from "@/lib/locations";
import { servicePages } from "@/lib/services";
import { siteConfig, BLUR_DATA_URL } from "@/lib/constants";
import { getSiteContent } from "@/lib/admin/schema";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";

export function generateStaticParams() {
  return townPages.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTownPage(slug);
  if (!t) return { title: "Location Not Found" };
  const title = `Jeweler Near ${t.town}, CT | King's Jeweler`;
  const description = `King's Jeweler is ${t.driveTime} from ${t.town} at The Shoppes at Buckland Hills. Engagement rings, jewelry repair, watch batteries, appraisals, and gold buying for ${t.town} and ${t.county}.`;
  return {
    title: { absolute: title },
    description,
    keywords: [
      `jeweler near ${t.town} CT`,
      `jewelry store near ${t.town} Connecticut`,
      `jewelry repair ${t.town} CT`,
      `sell gold near ${t.town} CT`,
      `jeweler ${t.county} CT`,
    ],
    alternates: { canonical: `${siteConfig.url}/locations/${t.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: t.heroImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getTownPage(slug);
  if (!t) notFound();

  const { hours } = await getSiteContent();
  const faqs = [t.faq, ...commonTownFaqs(t)];
  const phoneHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;
  const mapQuery = encodeURIComponent(
    `King's Jeweler, ${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.zip}`
  );
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const nearby = townPages.filter((o) => o.slug !== t.slug && o.county === t.county);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Areas We Serve", href: "/locations" },
          { name: t.town, href: `/locations/${t.slug}` },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white">
        <Image
          src={t.heroImage}
          alt={`Fine jewelry at King's Jeweler, serving ${t.town}, CT`}
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-[#14141A]/60 via-[#14141A]/40 to-[#14141A]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-6 pt-40 pb-20 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#F0A92D]">
            Serving {t.town} · {t.county}
          </p>
          <h1 className="mt-5 text-4xl leading-[1.06] tracking-tight md:text-5xl lg:text-6xl">
            Your jeweler near{" "}
            <em className="font-medium italic text-[#F0A92D]">{t.town}, CT</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            King&rsquo;s Jeweler is {t.driveTime} from {t.town}, inside The
            Shoppes at Buckland Hills in Manchester. Family-run since{" "}
            {siteConfig.foundingDate} — repairs, batteries, appraisals, gold
            buying, and engagement rings, all at one counter.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white"
            >
              <MapPin size={16} />
              Get Directions
            </a>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-[#F0A92D]"
            >
              <Phone size={15} className="text-[#F0A92D]" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── Intro + getting here ─────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:px-8">
          <div>
            {t.intro.map((p) => (
              <p key={p.slice(0, 32)} className="mt-5 text-lg leading-relaxed text-[#14141A]/75 first:mt-0">
                {p}
              </p>
            ))}
            <h2 className="mt-10 text-2xl tracking-tight text-[#A87310]">
              What {t.town} customers come in for
            </h2>
            <ul className="mt-6 divide-y divide-[#14141A]/10 border-y border-[#14141A]/10">
              {servicePages.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-baseline gap-4 py-3.5"
                  >
                    <span className="font-heading text-sm font-semibold text-[#A87310]">
                      0{i + 1}
                    </span>
                    <span className="font-semibold group-hover:text-[#A87310]">
                      {s.label}
                    </span>
                    <ArrowRight size={14} className="ml-auto shrink-0 self-center text-[#C68A17] opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sell-gold" className="group flex items-baseline gap-4 py-3.5">
                  <span className="font-heading text-sm font-semibold text-[#A87310]">07</span>
                  <span className="font-semibold group-hover:text-[#A87310]">We Buy Gold</span>
                  <ArrowRight size={14} className="ml-auto shrink-0 self-center text-[#C68A17] opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            </ul>
          </div>

          <aside className="space-y-6">
            <div className="border border-[#14141A]/15 bg-white p-7">
              <div className="flex items-start gap-4">
                <MapPin size={22} className="mt-0.5 shrink-0 text-[#C68A17]" />
                <div>
                  <h2 className="font-bold">Getting here from {t.town}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#14141A]/65">
                    Take {t.route}. Plan on {t.driveTime} — free parking at the
                    mall, no appointment needed.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[#14141A]">
                    {siteConfig.address.suite}
                    <br />
                    {siteConfig.address.street}, {siteConfig.address.city},{" "}
                    {siteConfig.address.region} {siteConfig.address.zip}
                  </p>
                </div>
              </div>
            </div>
            <div className="border border-[#14141A]/15 bg-white p-7">
              <div className="flex items-start gap-4">
                <Clock size={22} className="mt-0.5 shrink-0 text-[#C68A17]" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold">Store Hours</h2>
                  <ul className="mt-2 space-y-1.5">
                    {hours.map((row) => (
                      <li key={row.day} className="dotted-leader flex items-baseline gap-2 text-sm text-[#14141A]/65">
                        <span>{row.day}</span>
                        <span className="ml-auto">{row.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-[#FFFDF8] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-2xl tracking-tight text-[#A87310] md:text-3xl">
            {t.town} customers ask us
          </h2>
          <div className="mt-8">
            <FAQAccordion items={faqs} variant="light" />
          </div>
          {nearby.length > 0 && (
            <p className="mt-10 text-sm text-[#14141A]/60">
              Also serving {t.county}:{" "}
              {nearby.map((o, i) => (
                <span key={o.slug}>
                  {i > 0 && " · "}
                  <Link href={`/locations/${o.slug}`} className="font-semibold text-[#A87310] hover:underline">
                    {o.town}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      <CTASection
        headline={`Worth the drive from ${t.town}.`}
        subhead="Stop by The Shoppes at Buckland Hills seven days a week, or send us a message and a jeweler will get back to you within one business day."
        primaryLabel="Visit or Contact Us"
        primaryHref="/contact"
        secondaryLabel="See Our Work"
        secondaryHref="/gallery"
      />
    </>
  );
}
