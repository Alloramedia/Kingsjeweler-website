import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Caravan,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  ArrowRight,
  ClipboardList,
  CalendarCheck,
  PartyPopper,
  Snowflake,
  Sparkles,
} from "lucide-react";
import { brandImages, serviceAreas, siteConfig } from "@/lib/constants";
import { getSiteContent, applySeo } from "@/lib/admin/schema";
import { VEHICLES, getVehicle } from "@/lib/vehicles";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { EmblemWatermark, TacoAccent, TacoWatermark } from "@/components/SectionTextures";
import { HeroSlideshow } from "@/components/HeroSlideshow";

const baseMetadata: Metadata = {
  title: "BBQ & Taco Catering in Connecticut",
  description:
    "Pit & Masa is a mobile BBQ and taco catering company serving all of Connecticut. We bring wood-fired smoked brisket, birria tacos, and full taco bars to weddings, parties, and corporate events.",
  alternates: { canonical: "https://www.pitandmasa.com/catering" },
  openGraph: {
    title: "BBQ & Taco Catering in Connecticut | Pit & Masa",
    description:
      "Mobile smoked BBQ and taco bar catering for weddings, parties, and corporate events across Connecticut.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.catering);
}

const services = [
  {
    icon: Flame,
    title: "Smoked BBQ Spreads",
    body: "Wood-fired brisket, pulled pork, ribs, and smoked chicken with house sides — served hot off the pit.",
  },
  {
    icon: UtensilsCrossed,
    title: "Build-Your-Own Taco Bars",
    body: "Birria, carne asada, and street-style tacos with handmade salsas, fresh fixings, and warm tortillas.",
  },
  {
    icon: Users,
    title: "Any Headcount",
    body: "From intimate backyard gatherings to 200+ guest celebrations, we scale the menu to fit your crowd.",
  },
  {
    icon: Caravan,
    title: "Fully Mobile Service",
    body: "We roll in the pit trailer, the comal, and the crew to your home, venue, or worksite — anywhere in CT.",
  },
];

const included = [
  "Custom menu built around your event and budget",
  "On-site cooking and chef-led service",
  "All serving equipment, utensils, and setup",
  "Smoked meats, tacos, sides, and fresh fixings",
  "Flexible packages for any headcount",
  "Cleanup of our service area when we're done",
];

const occasions = [
  {
    title: "Parties & Celebrations",
    body: "Birthdays, graduations, and backyard parties with a smoked BBQ spread or build-your-own taco bar.",
    image: brandImages.cards[0],
  },
  {
    title: "Weddings & Showers",
    body: "Rehearsal dinners, receptions, and bridal showers with chef-led service your guests will remember.",
    image: brandImages.cards[1],
  },
  {
    title: "Corporate Events",
    body: "Office lunches, team celebrations, and client events catered on-site, on time, anywhere in CT.",
    image: brandImages.cards[2],
  },
  {
    title: "Holiday Gatherings",
    body: "Family celebrations and ready-to-serve holiday meal packs that make hosting effortless.",
    image: brandImages.cards[3],
  },
  {
    title: "Fundraisers & Community",
    body: "Block parties, fundraisers, and community events fed with bold flavor and easy service.",
    image: brandImages.cards[4],
  },
  {
    title: "Game Days & Casual",
    body: "Tailgates, watch parties, and casual get-togethers with hot food brought straight to you.",
    image: brandImages.cards[5],
  },
];

const seasonal = [
  {
    icon: Snowflake,
    title: "Holiday Meal Packs",
    body: "Skip the all-day cooking. We deliver ready-to-serve smoked meats, tacos, and sides so you can host the holidays without missing the party.",
  },
  {
    icon: Flame,
    title: "Peak-Season Booking",
    body: "Graduation season, summer weddings, and the holidays book up fast. Lock your date early and we'll hold the pit just for you.",
  },
  {
    icon: Sparkles,
    title: "Custom Menus",
    body: "Every event is different. We tailor the spread, portions, and service style to match your crowd, your venue, and your budget.",
  },
];

const process = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Tell us the plan",
    body: "Share your date, headcount, location, and the vibe you're going for. We'll talk through menu ideas and budget — no pressure, no jargon.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "We build your menu",
    body: "You get a custom menu: smoked meats, taco bar, sides, and packages sized to your crowd. We lock in the details and the date.",
  },
  {
    icon: PartyPopper,
    step: "03",
    title: "We bring the party",
    body: "On the day, we roll up, fire the pit, cook on-site, serve your guests, and clean our station before we leave. You just enjoy it.",
  },
];

const cateringFaqs = [
  {
    question: "How does pricing work?",
    answer:
      "Pricing is built around your menu and headcount — most clients land on a per-person rate once we know the spread. Tell us about your event and we'll send a clear, itemized quote with no surprises.",
  },
  {
    question: "Do you cook on-site or deliver?",
    answer:
      "Both are options. For most events we cook and serve on-site so the food comes off the pit hot and fresh. For smaller gatherings and holiday packs, ready-to-serve drop-off is available too.",
  },
  {
    question: "What do you need from me on event day?",
    answer:
      "A spot to set up — a driveway, yard, parking lot, or kitchen-adjacent space works great. We bring the pit, the comal, tables, serving gear, and the crew. Power and water access help but aren't always required.",
  },
  {
    question: "Is there a minimum headcount?",
    answer:
      "We cater everything from intimate dinners to 200+ guest events. Minimums vary by service style and date, so reach out and we'll let you know what works for your group.",
  },
  {
    question: "Can you accommodate dietary restrictions?",
    answer:
      "Yes — vegetarian tacos, gluten-friendly options, and allergy-aware prep are all available. Just flag it when we build your menu and we'll plan around it.",
  },
  {
    question: "Can you cater an outdoor or remote venue?",
    answer:
      "Yes — being fully mobile is our whole thing. Backyards, barns, parks, vineyards, and rooftop venues all work. As long as there's a safe spot to set up the pit, we'll be there.",
  },
  {
    question: "How early should I book a wedding or holiday event?",
    answer:
      "For weddings and holiday dates, 1–3 months ahead is ideal since prime weekends fill quickly. For smaller parties, a few weeks is usually plenty — but earlier is always safer.",
  },
  {
    question: "Can you match a theme or specific menu?",
    answer:
      "Absolutely. Whether it's a Tex-Mex taco bar, a low-country BBQ spread, or a mix of both, we'll build a menu that fits the occasion you're throwing.",
  },
];

export default async function CateringPage() {
  const { bundles } = await getSiteContent();
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Catering", href: "/catering" },
        ]}
      />
      <FAQSchema faqs={cateringFaqs} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <HeroSlideshow
          images={brandImages.heroSlides}
          alt="Pit & Masa mobile BBQ and taco catering spread"
          className="opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-40 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <TacoAccent size={28} className="drop-shadow" />
            Mobile Catering · Connecticut
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            We bring the pit to the party.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Pit &amp; Masa rolls up to your event with smoked BBQ and a full taco
            bar ready to serve. We handle the menu, the cooking, and the setup so
            you can stay with your guests — anywhere in Connecticut, for groups
            big and small.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/25 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
          >
            Get a catering quote <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Choose your setup — vehicles */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              Choose Your Setup
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              One crew, three ways to roll up.
            </h2>
            <p className="mt-4 text-lg text-[#1C1C1C]/65">
              Every setup brings its own menus and options for your event. Pick
              one — or combine a few for a bundle deal.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {VEHICLES.map((v) => {
              const VIcon = v.icon;
              const soon = v.status === "coming-soon";
              return (
                <Link
                  key={v.slug}
                  href={`/catering/${v.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-[#FFFCF7] via-[#FBF5E9] to-[#F1E7D2]">
                    <Image
                      src={v.iconImage}
                      alt={`${v.name} — Pit & Masa mobile catering setup`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={`object-contain transition duration-300 group-hover:scale-105 ${
                        v.slug === "cocktail-cart" ? "p-14" : "p-5"
                      }`}
                    />
                    {soon && (
                      <span className="absolute right-4 top-4 rounded-full bg-[#FF8C00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF8C00] text-white shadow-lg">
                        <VIcon size={20} />
                      </span>
                      <h3 className="font-heading text-2xl font-black text-[#1C1C1C]">
                        {v.name}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm text-[#1C1C1C]/65">{v.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF8C00]">
                      {soon ? "Get on the list" : `Explore the ${v.name.replace(/^The\s+/, "")}`}
                      <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bundle deals */}
      {bundles.length > 0 && (
        <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture">
          <EmblemWatermark className="-right-20 top-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
                <Sparkles size={24} />
                Bundle Deals
              </p>
              <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
                Combine setups, save on the spread.
              </h2>
              <p className="mt-4 text-lg text-white/75">
                Pair the Trailer, Truck, and Cocktail Cart for a coordinated
                experience — one team, one quote, the whole party covered.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {bundles.map((bundle) => (
                <div
                  key={bundle.name}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
                >
                  {/* Grouped setup illustrations */}
                  <div className="relative mb-5 flex h-28 items-end justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#0A9B9B]/30 via-white/0 to-[#FF8C00]/25 ring-1 ring-white/10">
                    {bundle.vehicles.map((slug, i) => {
                      const v = getVehicle(slug);
                      if (!v) return null;
                      return (
                        <div
                          key={slug}
                          className="relative h-24 w-1/2"
                          style={{
                            zIndex: bundle.vehicles.length - i,
                            marginLeft: i === 0 ? 0 : "-14%",
                          }}
                        >
                          <Image
                            src={v.iconImage}
                            alt={`${v.name} setup`}
                            fill
                            sizes="220px"
                            className="object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)]"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {bundle.vehicles.map((slug) => {
                      const v = getVehicle(slug);
                      if (!v) return null;
                      const VIcon = v.icon;
                      return (
                        <span
                          key={slug}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#FF8C00]/15 px-3 py-1 text-xs font-bold text-[#FFA733]"
                          title={v.name}
                        >
                          <VIcon size={13} />
                          {v.name.replace(/^The\s+/, "")}
                        </span>
                      );
                    })}
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-black">
                    {bundle.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {bundle.blurb}
                  </p>
                  {bundle.highlights.length > 0 && (
                    <ul className="mt-5 grid gap-2 border-t border-white/10 pt-5">
                      {bundle.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-white/75">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#FFA733]" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#FFA733] transition hover:text-white"
                  >
                    Ask about this bundle <ArrowRight size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-12 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              How We Cater
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Restaurant-quality food, brought to you.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-7 shadow-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00]/10 text-[#FF8C00]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#1C1C1C]/65">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-[#DEDEDE] text-[#1C1C1C]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={brandImages.cards[3]}
              alt="Smoked meats and tacos served at a Pit & Masa event"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              Every Booking Includes
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Easy hosting, start to finish.
            </h2>
            <ul className="mt-6 grid gap-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#1C1C1C]/85">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#FF8C00]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              <TacoAccent size={26} />
              How Booking Works
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              From first message to last plate.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Booking a caterer shouldn&apos;t be the hard part of your event.
              Here&apos;s how simple we keep it.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {process.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.step}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
                >
                  <span className="absolute right-6 top-6 font-heading text-4xl font-black text-white/10">
                    {p.step}
                  </span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Occasions + service area */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-left-10 top-16" rotate={-16} opacity={0.05} size="clamp(140px, 16vw, 250px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              Occasions We Cater
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Good food for every event.
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {occasions.map((o) => (
              <div
                key={o.title}
                className="overflow-hidden rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={o.image}
                    alt={o.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold">{o.title}</h3>
                  <p className="mt-2 text-sm text-[#1C1C1C]/65">{o.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] p-8 shadow-sm">
            <h3 className="font-heading text-xl font-bold">
              Serving all of Connecticut
            </h3>
            <p className="mt-2 max-w-3xl text-[#1C1C1C]/65">
              As a fully mobile caterer, Pit &amp; Masa serves events across{" "}
              {serviceAreas.counties.length} Connecticut counties — including{" "}
              {serviceAreas.towns.slice(0, 8).join(", ")}, and surrounding towns.
              If you&apos;re in CT, we&apos;ll bring the smoke to you.
            </p>
            <p className="mt-4 text-sm text-[#1C1C1C]/50">
              Catering led by {siteConfig.owner.name}, {siteConfig.owner.title}.
            </p>
          </div>
        </div>
      </section>

      {/* Holiday & seasonal */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture metal-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              <TacoAccent size={26} />
              Plan Ahead
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Holidays and big dates, handled early.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              The best events are the ones you don&apos;t have to stress over.
              Here&apos;s how we help you stay ahead of the calendar.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {seasonal.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-[#DEDEDE] text-[#1C1C1C]">
        <TacoWatermark className="-right-10 bottom-10 hidden md:block" rotate={14} opacity={0.06} size="clamp(140px, 16vw, 250px)" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
              <TacoAccent size={26} />
              Catering Questions
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Everything you need to know.
            </h2>
          </div>
          <div className="mt-10">
            <FAQAccordion items={cateringFaqs} variant="light" accentColor="#FF8C00" />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
