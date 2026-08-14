import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { siteConfig } from "@/lib/constants";
import { CTASection } from "@/components/CTASection";

const baseMetadata: Metadata = {
  title: "Jewelry Services | Repairs, Custom Design & Gold Buying",
  description:
    "Explore Kings Jeweler services — engagement rings, custom jewelry design, ring sizing, chain repair, watch batteries while you wait, appraisals, and fair gold buying in Manchester, CT.",
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
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4B36A]">
            Our Services
          </p>
          <h1 className="font-display! mt-4 text-4xl font-normal! uppercase md:text-5xl lg:text-6xl">
            What we can do for you
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            From once-in-a-lifetime engagement rings to a five-minute watch
            battery — everything is handled in person, in the store, by a
            jeweler who cares about getting it right.
          </p>
        </div>
      </section>

      {/* ── Service groups ──────────────────────────────────── */}
      <section className="bg-[#FBF9F4] py-16 text-[#14141A] md:py-20">
        <div className="mx-auto max-w-5xl space-y-16 px-6 lg:px-8">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="font-display! text-2xl font-normal! uppercase text-[#B08D3E] md:text-3xl">
                {group.label}
              </h2>
              <div className="mt-6 space-y-6">
                {group.sections.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-2xl border border-[#14141A]/10 bg-[#FFFDF8] p-7 shadow-sm md:p-9"
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
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B08D3E]/10 text-[#B08D3E]">
                            <Check size={13} />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {item.name}
                              {item.price && (
                                <span className="ml-2 text-xs font-medium text-[#B08D3E]">
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
          <div className="rounded-2xl bg-[#14141A] p-8 text-center text-white md:p-10">
            <h2 className="text-xl font-bold">
              Not sure what your piece needs?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              Bring it in — we'll take a look, explain your options, and give
              you an honest quote on the spot. Find us inside{" "}
              {siteConfig.address.suite} in {siteConfig.address.city},{" "}
              {siteConfig.address.region}.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B08D3E] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#99782F]"
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
