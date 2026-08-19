import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { siteConfig, BLUR_DATA_URL } from "@/lib/constants";
import { servicePages } from "@/lib/services";
import { CTASection } from "@/components/CTASection";

const baseMetadata: Metadata = {
  title: "Jewelry Repair, Custom Design & Gold Buying",
  description:
    "Engagement rings, custom jewelry design, ring sizing, chain repair, watch batteries, appraisals, and fair gold buying at King's Jeweler in Manchester, CT.",
  alternates: {
    canonical: "https://www.kingsjewelerct.com/services",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.services);
}

export default async function ServicesPage() {
  const { menu } = await getSiteContent();

  // Group sections by their `group` label, preserving order.
  const groups: { label: string; sections: typeof menu }[] = [];
  for (const section of menu) {
    const label = section.group || "Services";
    const existing = groups.find((g) => g.label === label);
    if (existing) existing.sections.push(section);
    else groups.push({ label, sections: [section] });
  }

  return (
    <>
      {/* ── Page header ─────────────────────────────────────── */}
      <section className="bg-[#14141A] pt-36 pb-16 text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#F0A92D]">
            Our Services
          </p>
          <h1 className="mt-5 text-4xl leading-[1.06] tracking-tight md:text-5xl lg:text-6xl">
            What we can <em className="font-medium italic text-[#F0A92D]">do for you</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            From once-in-a-lifetime engagement rings to a five-minute watch
            battery, everything is handled in person, in the store, by a
            jeweler who cares about getting it right.
          </p>
        </div>
      </section>
      {/* ── Service cards ────────────────────────────────── */}
      <section className="bg-[#FFFDF8] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="text-2xl tracking-tight text-[#A87310] md:text-3xl">
            Explore our services
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicePages.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group block border border-[#14141A]/15 bg-[#FBF9F4] transition-colors hover:border-[#C68A17]"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={service.heroImage}
                    alt={service.heroImageAlt}
                    fill
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <p className="font-heading text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#A87310]">
                    {service.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-bold">{service.label}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#14141A]/60">
                    {service.metaDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#A87310]">
                    Learn more
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* ── Service groups ──────────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto max-w-5xl space-y-16 px-6 lg:px-8">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="text-2xl tracking-tight text-[#A87310] md:text-3xl">
                {group.label}
              </h2>
              <div className="mt-6 space-y-6">
                {group.sections.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-xs border border-[#14141A]/15 bg-[#FFFDF8] p-7 md:p-9"
                  >
                    <h3 className="text-xl font-bold">{section.title}</h3>
                    {section.blurb && (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#14141A]/65">
                        {section.blurb}
                      </p>
                    )}
                    <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <li key={item.name} className="flex items-start gap-3">
                          <Check size={15} className="mt-1 shrink-0 text-[#C68A17]" />
                          <div>
                            <p className="font-semibold">
                              {item.name}
                              {item.price && (
                                <span className="ml-2 text-xs font-medium text-[#C68A17]">
                                  {item.price}
                                </span>
                              )}
                            </p>
                            {item.desc && (
                              <p className="mt-1 text-sm leading-relaxed text-[#14141A]/60">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom note */}
          <div className="rounded-xs bg-[#14141A] p-8 text-white md:p-10">
            <h2 className="text-xl font-bold">
              Not sure what your piece needs?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              Bring it in and we’ll take a look, explain your options, and give
              you an honest quote on the spot. Find us inside{" "}
              {siteConfig.address.suite} in {siteConfig.address.city},{" "}
              {siteConfig.address.region}.
            </p>
            <Link
              href="/contact"
              className="btn-gold mt-6 inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white"
            >
              Visit or Contact Us
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
