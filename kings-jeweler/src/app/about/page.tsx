import { Metadata } from "next";
import Image from "next/image";
import { Gem, HeartHandshake, Wrench, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { EmblemWatermark } from "@/components/SectionTextures";

const baseMetadata: Metadata = {
  // Absolute — the brand is already in the title, so skip the template suffix.
  title: { absolute: "About King's Jeweler — Family Jewelers in Manchester, CT" },
  description:
    "King's Jeweler is a family-run jewelry store inside The Shoppes at Buckland Hills in Manchester, CT — every customer helped personally by a jeweler who cares.",
  alternates: {
    canonical: "https://www.kingsjewelerct.com/about",
  },
  openGraph: {
    title: "About King's Jeweler",
    description:
      "A family-run jewelry store inside The Shoppes at Buckland Hills in Manchester, Connecticut.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About King's Jeweler",
    description:
      "A family-run jewelry store inside The Shoppes at Buckland Hills in Manchester, Connecticut.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.about);
}

const values = [
  {
    icon: Gem,
    title: "Craftsmanship first",
    body: "Every sizing, setting, and custom piece is done with the care of a jeweler who puts their name on the work — because we do.",
  },
  {
    icon: HeartHandshake,
    title: "People over quotas",
    body: "No commissioned sales floor, no pressure. Just honest advice on what's right for your piece, your occasion, and your budget.",
  },
  {
    icon: Wrench,
    title: "Real work, done here",
    body: "Repairs and custom work happen with us — not shipped to a warehouse three states away. Many jobs are done while you shop.",
  },
  {
    icon: ShieldCheck,
    title: "Trust, earned daily",
    body: "Fair offers when you sell, transparent quotes when you buy, and heirlooms treated like they're our own family's.",
  },
];

export default async function AboutPage() {
  const { brandImages, faqs, serviceTowns } = await getSiteContent();
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <FAQSchema faqs={faqs.about} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white">
        <Image
          src={brandImages.aboutFeature}
          alt="Fine jewelry at King's Jeweler in Manchester, Connecticut"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#14141A]/60 via-[#14141A]/70 to-[#14141A]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-40 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#F0A92D]">
            Our Story
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.06] tracking-tight md:text-6xl">
            A family jeweler, in the heart of{" "}
            <em className="font-medium italic text-[#F0A92D]">Buckland Hills</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            We&apos;re a family-run jewelry store inside The Shoppes at Buckland
            Hills — helping Manchester and the Greater Hartford area celebrate
            life&apos;s biggest moments, one piece at a time.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden bg-[#FBF9F4] text-[#14141A]">
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-lg leading-relaxed text-[#14141A]/75">
            King's Jeweler was built on a simple idea: when you walk into a
            jewelry store, you should be talking to a jeweler. Not a rotating
            cast of salespeople — the actual person who will size your ring,
            set your stone, or design the piece you&apos;ve been imagining.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#14141A]/75">
            From our store inside The Shoppes at Buckland Hills, we&apos;ve
            helped generations of Connecticut families through engagements,
            weddings, anniversaries, and everything in between. Some customers
            come in for a five-minute watch battery; others come in with a
            grandmother&apos;s ring and a story. We treat both with the same
            care.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#14141A]/75">
            Whether you&apos;re buying your first piece of fine jewelry,
            restoring an heirloom, or selling gold you no longer wear, you can
            count on straight answers, fair prices, and work we&apos;re proud to
            put our name on.
          </p>
        </div>
      </section>

      {/* What we stand for */}
      <section className="relative isolate overflow-hidden bg-[#14141A] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#F0A92D]">
              What We Stand For
            </p>
            <h2 className="mt-3 text-3xl tracking-tight md:text-4xl">
              The standards behind every piece.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              These aren&apos;t marketing lines — they&apos;re the rules we work
              by, every single day.
            </p>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="border-t border-white/15 pt-6"
                >
                  <h3 className="flex items-center gap-2.5 font-heading text-lg font-bold">
                    <Icon size={18} className="shrink-0 text-[#F0A92D]" />
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {v.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Owner */}
      <section className="relative overflow-hidden bg-[#E5E1D8] text-[#14141A]">
        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 lg:grid-cols-[2fr_3fr] lg:px-8 lg:py-28">
          <div className="relative aspect-square overflow-hidden border border-[#14141A]/20 p-2">
            <div className="relative h-full w-full">
              <Image
                src={brandImages.owner}
                alt={`${siteConfig.owner.name}, ${siteConfig.owner.title} at King's Jeweler`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#C68A17]">
              Meet the Family
            </p>
            <h2 className="mt-3 text-3xl tracking-tight md:text-4xl">
              {siteConfig.owner.name}
            </h2>
            <p className="mt-1 font-semibold text-[#C68A17]">
              {siteConfig.owner.title}
            </p>
            <p className="mt-5 text-lg leading-relaxed text-[#14141A]/75">
              {siteConfig.owner.bio}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Engagement rings", "Custom design", "Expert repairs", "Gold buying"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="border border-[#14141A]/15 bg-[#FBF9F4] px-3 py-1.5 text-xs font-medium tracking-wide text-[#14141A]/75"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-[#FBF9F4]">
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="text-center">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#C68A17]">
              Good to Know
            </p>
            <h2 className="mt-3 text-3xl tracking-tight text-[#14141A] md:text-4xl">
              A few things people ask.
            </h2>
          </div>
          <div className="mt-10">
            <FAQAccordion items={faqs.about} variant="light" accentColor="#C68A17" />
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="bg-[#FBF9F4] text-[#14141A]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Proudly serving Greater Hartford
          </h2>
          <p className="mt-4 text-[#14141A]/65">
            {serviceTowns.slice(0, 12).join(" · ")} and every town in
            between.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
