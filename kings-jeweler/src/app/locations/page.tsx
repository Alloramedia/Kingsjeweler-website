import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { townPages, COUNTIES } from "@/lib/locations";
import { siteConfig } from "@/lib/constants";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Jeweler in Hartford County & Tolland County, CT",
  description:
    "King's Jeweler serves Hartford County and Tolland County, Connecticut from The Shoppes at Buckland Hills in Manchester. Jewelry repair, watch batteries, appraisals, gold buying, and engagement rings — minutes from a dozen CT towns.",
  keywords: [
    "jeweler Hartford County CT",
    "jeweler Tolland County CT",
    "jewelry store Connecticut",
    "jewelry repair Hartford County",
    "sell gold Connecticut",
  ],
  alternates: { canonical: `${siteConfig.url}/locations` },
  openGraph: {
    title: "Jeweler in Hartford County & Tolland County, CT | King's Jeweler",
    description:
      "Full-service family jeweler at Buckland Hills in Manchester — minutes from a dozen Hartford County and Tolland County towns.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function LocationsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Areas We Serve", href: "/locations" },
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white">
        <div className="relative mx-auto max-w-4xl px-6 pt-40 pb-20 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#F0A92D]">Areas We Serve</p>
          <h1 className="mt-5 text-4xl leading-[1.06] tracking-tight md:text-5xl lg:text-6xl">
            One store. Half of{" "}
            <em className="font-medium italic text-[#F0A92D]">Connecticut</em>{" "}
            within 20 minutes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            King&rsquo;s Jeweler sits at the crossroads of I-84 and I-384 inside
            The Shoppes at Buckland Hills — which puts most of Hartford County
            and Tolland County a short, easy drive from our counter. No
            appointment, free parking, seven days a week.
          </p>
        </div>
      </section>

      {/* ── Towns by county ──────────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {COUNTIES.map((county) => (
              <div key={county}>
                <h2 className="text-2xl tracking-tight text-[#A87310]">{county}</h2>
                <ul className="mt-6 divide-y divide-[#14141A]/10 border-y border-[#14141A]/10">
                  {county === "Hartford County" && (
                    <li>
                      <Link href="/" className="group flex items-center gap-3 py-4">
                        <MapPin size={16} className="shrink-0 text-[#C68A17]" />
                        <span className="font-semibold group-hover:text-[#A87310]">
                          Manchester
                        </span>
                        <span className="text-sm text-[#14141A]/55">— home base, at Buckland Hills</span>
                        <ArrowRight size={14} className="ml-auto shrink-0 text-[#C68A17] opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  )}
                  {townPages
                    .filter((t) => t.county === county)
                    .map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/locations/${t.slug}`}
                          className="group flex items-center gap-3 py-4"
                        >
                          <MapPin size={16} className="shrink-0 text-[#C68A17]" />
                          <span className="font-semibold group-hover:text-[#A87310]">
                            {t.town}
                          </span>
                          <span className="text-sm text-[#14141A]/55">— {t.driveTime}</span>
                          <ArrowRight size={14} className="ml-auto shrink-0 text-[#C68A17] opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-12 max-w-3xl text-[#14141A]/65">
            Farther out in Connecticut? Plenty of customers make the trip from
            beyond these towns for custom design work, appraisals, and gold
            buying — we&rsquo;re {""}
            right off I-84 Exit 62, an easy drive from most of the state.
          </p>
        </div>
      </section>

      <CTASection
        headline="Wherever you're driving from, it's worth it."
        subhead="Stop by The Shoppes at Buckland Hills, or send us a message and a jeweler will get back to you within one business day."
        primaryLabel="Visit or Contact Us"
        primaryHref="/contact"
        secondaryLabel="See Our Work"
        secondaryHref="/gallery"
      />
    </>
  );
}
