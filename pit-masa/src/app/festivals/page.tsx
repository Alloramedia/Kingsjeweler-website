import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sandwich,
  Salad,
  CupSoda,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import {
  EmblemWatermark,
  TacoAccent,
  TacoWatermark,
} from "@/components/SectionTextures";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { getSiteContent, applySeo } from "@/lib/admin/schema";

const baseMetadata: Metadata = {
  title: "Festival Menu — Tacos, Masa & BBQ",
  description:
    "Catch Pit & Masa at festivals across Connecticut — smoked pork tacos, achiote chicken, crispy pork belly, the chile beef torta, pit burrito, pit burger, masa fries, esquites, and fresh aguas frescas. Smoke. Masa. Repeat.",
  alternates: { canonical: "https://www.pitandmasa.com/festivals" },
  openGraph: {
    title: "Festival Menu — Tacos, Masa & BBQ | Pit & Masa",
    description:
      "Find us at festivals across Connecticut. Smoked tacos, tortas, burritos, masa fries, and house-made aguas frescas. Smoke. Masa. Repeat.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return applySeo(baseMetadata, seo.festivals);
}

/* ════════════════════════════════════════════════════════════════
   FESTIVAL MENU — served walk-up from the pit trailer.
   Prices are per item. Update here to change them everywhere.
   ════════════════════════════════════════════════════════════════ */
const menuSections = [
  {
    title: "Handhelds",
    icon: Sandwich,
    image: "/images/food/food-076.webp",
    blurb: "Built to eat on your feet — pressed tortillas, smoked fillings, house salsas.",
    items: [
      {
        name: "Smoked pork taco",
        price: "5.50",
        desc: "Hand-pulled smoked pork, salsa roja, pickled onion, cilantro, and lime on a house corn tortilla.",
      },
      {
        name: "Achiote chicken taco",
        price: "5.50",
        desc: "Smoked chicken thigh, salsa verde, crema, cabbage, and fresh lime on a house corn tortilla.",
      },
      {
        name: "Crispy pork belly taco",
        price: "6.00",
        desc: "Sticky pork belly, pineapple habanero salsa, shaved cabbage, herbs, and cotija on a house corn tortilla.",
      },
      {
        name: "Chile beef torta",
        price: "14.50",
        desc: "Sliced smoked beef, black bean spread, avocado, pickled onion, jalapeño, and crema on a telera roll.",
      },
      {
        name: "Pit burrito",
        price: "13.50",
        desc: "Choice of smoked beef, achiote chicken, or chile beef, pinto beans, queso fresco, rice, corn salsa, crema, and salsa roja.",
      },
      {
        name: "Pit burger",
        price: "13.50",
        desc: "Smoked beef patty, smoked onion bacon house jam, chipotle mayo, pickled jalapeños, Cooper American sharp, and shredded lettuce on a toasted bun.",
      },
    ],
  },
  {
    title: "Not Handhelds",
    icon: Salad,
    image: "/images/food/food-040.webp",
    blurb: "Sides and cups worth a fork — corn, beans, masa fries, and a crisp salad.",
    items: [
      {
        name: "Esquites cup",
        price: "6.50",
        desc: "Charred corn, chili mayo, cotija, lime, cilantro, and tajín.",
      },
      {
        name: "Pit beans",
        price: "5.50",
        desc: "Slow-smoked pinto beans with bacon, onion, and a touch of chipotle.",
      },
      {
        name: "Masa fries",
        price: "6.00",
        desc: "Crispy seasoned fries, tajín, roasted garlic aioli, cotija, cilantro, and lime.",
      },
      {
        name: "Cabbage salad",
        price: "6 / 11",
        desc: "Side or full — lime vinaigrette, pepitas, pickled onion, herbs, and fresh chile.",
      },
    ],
  },
  {
    title: "Beverages",
    icon: CupSoda,
    image: "/images/food/food-111.webp",
    blurb: "House-made aguas frescas and cold classics to cool the heat.",
    items: [
      {
        name: "House limeade",
        price: "4.50",
        desc: "Fresh lime, cane sugar, and soda.",
      },
      {
        name: "Agua fresca of the day",
        price: "4.50",
        desc: "A rotating fruit cooler made fresh daily.",
      },
      {
        name: "Hibiscus iced tea",
        price: "3.50",
        desc: "Jamaica tea, citrus, cane sugar, and mint.",
      },
      {
        name: "Mexican Coke",
        price: "4.00",
        desc: "Ice-cold, made with cane sugar.",
      },
      {
        name: "Jarritos",
        price: "4.00",
        desc: "Pick your flavor from the cooler.",
      },
      {
        name: "Sparkling water",
        price: "3.50",
        desc: "Chilled and bubbly.",
      },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────
   FESTIVAL SCHEDULE
   Add upcoming festivals as they're booked — soonest first.
   Example row:
     { date: "Jul 4, 2026", name: "Riverfront Summer Fest", location: "Hartford, CT", time: "12–8 PM" },
   Leave the array empty to show the "season coming soon" message.
   ──────────────────────────────────────────────────────────────── */
const schedule: { date: string; name: string; location: string; time: string }[] = [
  {
    date: "Sep 17–20, 2026",
    name: "Berlin Fair",
    location: "Berlin Fairgrounds, Berlin, CT",
    time: "Thu–Sun · fair hours",
  },
  {
    date: "Sep 24–27, 2026",
    name: "Durham Fair",
    location: "Durham Fairgrounds, Durham, CT",
    time: "Thu–Sun · fair hours",
  },
];

export default async function FestivalsPage() {
  const { brandImages, events } = await getSiteContent();
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Festivals", href: "/festivals" },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <HeroSlideshow
          images={brandImages.heroSlides}
          alt="Street tacos served fresh from the Pit & Masa trailer"
          className="opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark
          className="-right-16 top-24 hidden md:block"
          opacity={0.06}
          size="clamp(260px, 32vw, 460px)"
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-40 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <TacoAccent size={28} className="drop-shadow" />
            Find Us at Festivals
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            Smoke. Masa. Repeat.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            When the pit trailer rolls into a festival, this is what&apos;s on the
            board — smoked tacos, tortas, burritos, masa fries, and aguas frescas
            made fresh on site. Walk up, order, and dig in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#schedule"
              className="inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/20 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
            >
              Where to find us <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Book us for your event
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section id="schedule" className="bg-[#1C1C1C] text-white">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <CalendarDays size={20} /> Where to find us
          </p>
          <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
            Upcoming events
          </h2>
          {events.length > 0 ? (
            <ul className="mt-8 space-y-4">
              {events.map((ev, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-xl font-black">{ev.name}</p>
                    <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/70">
                      {ev.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={15} /> {ev.date}
                          {ev.time ? ` · ${ev.time}` : ""}
                        </span>
                      )}
                      {ev.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} /> {ev.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {ev.url && ev.url.startsWith("http") && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                    >
                      Details <ArrowRight size={16} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-2xl text-lg text-white/75">
              No festival dates on the calendar right now — follow us on social
              for the latest pop-ups, or{" "}
              <Link href="/contact" className="font-semibold text-[#FFA733] underline">
                book us for your own event
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* Menu */}
      <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
        <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
        <TacoWatermark className="-left-12 bottom-16 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-2">
            {menuSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className="overflow-hidden rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] shadow-sm"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={section.image}
                      alt={`${section.title} — Pit & Masa festival menu`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 flex items-center gap-3 p-6">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00] text-white shadow-lg">
                        <Icon size={20} />
                      </span>
                      <h2 className="font-heading text-2xl font-black text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="text-sm italic text-[#1C1C1C]/60">
                      {section.blurb}
                    </p>
                    <ul className="mt-5 grid gap-4">
                      {section.items.map((item) => (
                        <li
                          key={item.name}
                          className="border-b border-[#1C1C1C]/5 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-baseline gap-3">
                            <p className="font-semibold text-[#1C1C1C]">
                              {item.name}
                            </p>
                            <span
                              className="h-px flex-1 self-end border-b border-dotted border-[#1C1C1C]/25"
                              aria-hidden
                            />
                            <p className="shrink-0 font-bold text-[#FF8C00] tabular-nums">
                              {item.price}
                            </p>
                          </div>
                          <p className="mt-1 max-w-prose text-sm text-[#1C1C1C]/60">
                            {item.desc}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-10 max-w-3xl text-[#1C1C1C]/65">
            Prices are per item and may vary by event. Got a big group at the
            festival? Ask at the window about our daily specials.
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section
        id="schedule"
        className="relative isolate scroll-mt-24 overflow-hidden bg-[#1C1C1C] text-white noise-texture"
      >
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              <TacoAccent size={26} />
              On the Road
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Where to find us next.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Catch the pit trailer at festivals and events across Connecticut.
              Here&apos;s where we&apos;re headed.
            </p>
          </div>

          {schedule.length > 0 ? (
            <ul className="mt-12 grid gap-4">
              {schedule.map((stop) => (
                <li
                  key={`${stop.date}-${stop.name}`}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                      <CalendarDays size={20} />
                    </span>
                    <div>
                      <p className="font-heading text-lg font-bold">{stop.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/65">
                        <MapPin size={14} /> {stop.location}
                      </p>
                    </div>
                  </div>
                  <div className="pl-15 text-sm text-white/80 sm:pl-0 sm:text-right">
                    <p className="font-semibold text-[#FFA733]">{stop.date}</p>
                    <p className="mt-0.5">{stop.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                <CalendarDays size={24} />
              </span>
              <h3 className="mt-4 font-heading text-xl font-bold">
                Our festival season is coming together.
              </h3>
              <p className="mx-auto mt-2 max-w-md text-white/65">
                We&apos;re locking in dates now. Follow us on social or get in
                touch and we&apos;ll let you know where the pit trailer is headed
                next.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/20 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
              >
                Get event updates <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <CTASection
        headline="Want the trailer at your event?"
        subhead="Festivals, markets, fairs, and private parties — tell us the date and the spot, and we'll roll the pit trailer your way."
      />
    </>
  );
}
