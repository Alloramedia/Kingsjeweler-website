import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, BadgeCheck, CreditCard, Coins, Gem, Search } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { applySeo, getSiteContent } from "@/lib/admin/schema";
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { EmblemWatermark } from "@/components/SectionTextures";

const baseMetadata: Metadata = {
  title: "We Buy Gold in Manchester, CT",
  description:
    "Sell gold, silver, diamonds, and estate jewelry at King's Jeweler in Manchester, CT. We weigh everything in front of you and pay 70–90% of melt value.",
  alternates: {
    canonical: "https://www.kingsjewelerct.com/sell-gold",
  },
  openGraph: {
    title: "We Buy Gold | King's Jeweler",
    description:
      "Fair, transparent cash offers on gold, silver, and diamonds — weighed and evaluated right in front of you at our Manchester, CT store.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Buy Gold | King's Jeweler",
    description:
      "Fair, transparent cash offers on gold, silver, and diamonds in Manchester, CT.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.sellGold);
}

const STEPS = [
  {
    icon: Search,
    title: "We test & weigh it in front of you",
    body: "Karat stamps checked, weight taken on a calibrated scale, right at the counter — no back room, no waiting.",
  },
  {
    icon: Scale,
    title: "We explain the math",
    body: "We'll walk you through melt value and how we arrived at your offer, so you know exactly what you're being paid for.",
  },
  {
    icon: Coins,
    title: "You get a same-day offer",
    body: "Take cash on the spot, or trade the value toward anything in the case. No obligation to sell.",
  },
];

const WHAT_WE_BUY = [
  "Gold jewelry — any karat, broken or not",
  "Silver jewelry and flatware",
  "Platinum jewelry",
  "Loose and mounted diamonds",
  "Estate and antique jewelry",
  "Class rings and dental gold",
  "Unmatched earrings and odd pieces",
  "Designer pieces (Tiffany, Cartier, David Yurman, and more)",
];

const COMPARISON = [
  { buyer: "King's Jeweler", pays: "70–90% of melt value", note: "Weighed in front of you, same-day cash" },
  { buyer: "Pawn shops", pays: "40–60% of melt value", note: "Often structured as a loan, not a sale" },
  { buyer: "Mail-in TV buyers", pays: "30–50% of melt value", note: "You ship first, lose your leverage to negotiate" },
];

export default async function SellGoldPage() {
  const pageFaqs = [
    {
      question: "How much do jewelers pay for gold?",
      answer:
        "Reputable local jewelers typically pay 70–90% of melt value for scrap gold. Pawn shops usually pay 40–60% and mail-in buyers often 30–50%, which is why comparing local offers first almost always nets you more.",
    },
    {
      question: "How do I calculate what my gold jewelry is worth?",
      answer:
        "Multiply weight in grams × purity × the current gold price per gram. A 10-gram 14k chain (58.3% pure) at $85/gram is worth about $495 in melt value. Expect honest offers of 70–90% of that figure.",
    },
    {
      question: "Is it better to sell gold to a jeweler or a pawn shop?",
      answer:
        "A jeweler, in almost every case. Jewelers pay higher percentages of melt value and can recognize when a piece is worth more intact — designer names, antiques, and diamond-set items that a scrap-only buyer would undervalue.",
    },
    {
      question: "What karat gold is worth the most?",
      answer:
        "Higher karat means more pure gold: 24k is pure, 18k is 75%, 14k is 58.3%, and 10k is 41.7%. An 18k piece is worth nearly twice as much per gram as a 10k piece of the same weight.",
    },
    {
      question: "Should I sell broken gold jewelry or repair it?",
      answer:
        "It depends on the piece. Sentimental or high-quality items are usually worth repairing — many fixes cost under $100. Mismatched earrings, kinked hollow chains, and dated pieces you'll never wear are ideal candidates to sell for melt value.",
    },
    {
      question: "Do I need an appointment to sell gold?",
      answer:
        "No — walk in any day during store hours. Most evaluations take just a few minutes, and you'll get a same-day offer.",
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "We Buy Gold", href: "/sell-gold" },
        ]}
      />
      <ServiceSchema
        name="Gold Buying"
        description="We buy gold, silver, platinum, and diamonds — weighed and evaluated in person with fair, transparent offers."
      />
      <FAQSchema faqs={pageFaqs} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#C68A17] text-[#14141A]">
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.07} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-36 lg:px-8">
          <p className="eyebrow-rule font-heading text-[#14141A]/80">
            Top Prices Paid
          </p>
          <h1 className="mt-5 text-4xl leading-[1.06] tracking-tight md:text-6xl">
            We Buy <em className="font-medium italic">Gold</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#14141A]/80 md:text-xl">
            Bring in gold, silver, diamonds, or jewelry you no longer wear.
            We weigh it right in front of you and make a fair, same-day offer
            — sell outright or trade toward anything in the case.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xs bg-[#14141A] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-black"
            >
              Get an Offer
              <ArrowRight size={18} />
            </Link>
            <p className="text-sm text-[#14141A]/70">
              No appointment needed — walk in any day.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#14141A] text-white metal-texture">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#F0A92D]">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl tracking-tight md:text-4xl">
              No games, no back rooms.
            </h2>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="border-t border-white/15 pt-6"
              >
                <span className="font-heading text-sm font-semibold text-[#F0A92D]/80">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 font-heading text-lg font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we buy */}
      <section className="bg-[#FBF9F4] text-[#14141A]">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#C68A17]">
                What We Buy
              </p>
              <h2 className="mt-3 text-3xl tracking-tight md:text-4xl">
                If it&apos;s gold, silver, or set with a stone, bring it in.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#14141A]/70">
                Broken chains, single earrings, old class rings, dated pieces
                you&apos;ll never wear again — condition doesn&apos;t matter,
                and signed or antique pieces are often worth more than melt.
                We&apos;ll tell you when that&apos;s the case.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {WHAT_WE_BUY.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Gem size={15} className="mt-0.5 shrink-0 text-[#C68A17]" />
                    <span className="text-[#14141A]/75">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xs border border-[#14141A]/15 bg-[#FFFDF8] p-7 md:p-9">
              <h3 className="text-xl font-bold">
                What your karat stamp means
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#14141A]/65">
                Look inside rings or on chain clasps. European pieces may read
                417, 585, or 750 — same purity, different stamp.
              </p>
              <dl className="mt-6 space-y-3">
                {[
                  ["10k", "41.7% pure gold"],
                  ["14k", "58.3% pure gold"],
                  ["18k", "75% pure gold"],
                  ["24k", "Pure gold"],
                ].map(([karat, desc]) => (
                  <div
                    key={karat}
                    className="flex items-center justify-between border-b border-[#14141A]/8 pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="font-heading font-bold text-[#C68A17]">
                      {karat}
                    </dt>
                    <dd className="text-sm text-[#14141A]/70">{desc}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs text-[#14141A]/50">
                &quot;GF&quot; or &quot;GP&quot; markings mean gold-filled or
                gold-plated, which carry little melt value — we&apos;ll
                explain the difference when you bring a piece in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why us / comparison */}
      <section className="bg-[#14141A] text-white">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#F0A92D]">
              Why Sell Local
            </p>
            <h2 className="mt-3 text-3xl tracking-tight md:text-4xl">
              Local jewelers pay more than you&apos;d think.
            </h2>
            <p className="mt-4 text-white/70">
              Payouts for the same gold vary wildly by buyer. Here&apos;s
              roughly how it breaks down.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-xs border border-white/10">
            {COMPARISON.map((row, i) => (
              <div
                key={row.buyer}
                className={`grid grid-cols-1 gap-2 border-white/10 px-6 py-5 sm:grid-cols-3 sm:items-center sm:gap-4 ${
                  i === 0 ? "bg-[#C68A17]/12" : "bg-white/5"
                } ${i < COMPARISON.length - 1 ? "border-b" : ""}`}
              >
                <p className="font-heading font-bold">
                  {row.buyer}
                  {i === 0 && (
                    <span className="ml-2 rounded-full bg-[#C68A17] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#14141A]">
                      Us
                    </span>
                  )}
                </p>
                <p className="font-semibold text-[#F0A92D]">{row.pays}</p>
                <p className="text-sm text-white/60">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-white/40">
            Figures are general industry ranges based on melt value, not a
            quoted offer. Bring your piece in for an exact evaluation.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Scale,
                title: "Watch the weigh-in",
                body: "Everything is weighed and evaluated in front of you — no back rooms, no games.",
              },
              {
                icon: BadgeCheck,
                title: "Fair, transparent offers",
                body: "Honest market-based pricing on gold, silver, diamonds, and estate jewelry.",
              },
              {
                icon: CreditCard,
                title: "Flexible ways to pay & trade",
                body: "Take cash, or trade toward something new — no credit needed financing available on purchases.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-t border-white/15 pt-5"
              >
                <h3 className="flex items-center gap-2.5 font-bold">
                  <item.icon size={17} className="shrink-0 text-[#F0A92D]" />
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FBF9F4]">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#C68A17]">
              Good to Know
            </p>
            <h2 className="mt-3 text-3xl tracking-tight text-[#14141A] md:text-4xl">
              Questions about selling gold.
            </h2>
          </div>
          <div className="mt-10">
            <FAQAccordion items={pageFaqs} variant="light" accentColor="#C68A17" />
          </div>
          <p className="mt-8 text-center text-sm text-[#14141A]/55">
            Want the full walkthrough? Read our{" "}
            <Link
              href="/blog/how-to-sell-gold-jewelry"
              className="font-semibold text-[#A87310] underline decoration-[#C68A17]/40 underline-offset-2 hover:text-[#C68A17]"
            >
              guide to selling gold jewelry for the best price
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Bottom note */}
      <section className="bg-[#FBF9F4] pb-16 text-[#14141A] lg:pb-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-xs bg-[#14141A] p-8 text-white md:p-10">
            <h2 className="text-xl font-bold">Ready to find out what it&apos;s worth?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              Bring your gold, silver, or diamonds by King&apos;s Jeweler inside{" "}
              {siteConfig.address.suite} in {siteConfig.address.city},{" "}
              {siteConfig.address.region}. No appointment needed.
            </p>
            <Link
              href="/contact"
              className="btn-gold mt-6 inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white"
            >
              Get an Offer
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        headline="Have gold sitting in a drawer?"
        subhead="Stop by The Shoppes at Buckland Hills — we'll weigh it, explain the offer, and pay you the same day."
        primaryLabel="Get an Offer"
        primaryHref="/contact"
        secondaryLabel="Read Our Gold Selling Guide"
        secondaryHref="/blog/how-to-sell-gold-jewelry"
      />
    </>
  );
}
