import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock4 } from "lucide-react";
import { getSiteContent } from "@/lib/admin/schema";
import { VEHICLES, VEHICLE_SLUGS, getVehicle, contactHrefForVehicle } from "@/lib/vehicles";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { CateringMenuGroups } from "@/components/CateringMenuGroups";
import { EmblemWatermark, TacoWatermark } from "@/components/SectionTextures";

export function generateStaticParams() {
  return VEHICLE_SLUGS.map((vehicle) => ({ vehicle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vehicle: string }>;
}): Promise<Metadata> {
  const { vehicle: slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Setup Not Found" };
  const title = `${vehicle.name} — Mobile Catering`;
  const description = `${vehicle.tagline}. ${vehicle.description}`;
  return {
    title,
    description,
    alternates: { canonical: `https://www.pitandmasa.com/catering/${vehicle.slug}` },
    openGraph: {
      title: `${vehicle.name} | Pit & Masa Catering`,
      description,
      images: [{ url: vehicle.image, width: 1200, height: 630 }],
    },
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ vehicle: string }>;
}) {
  const { vehicle: slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const { menu } = await getSiteContent();
  const Icon = vehicle.icon;
  const comingSoon = vehicle.status === "coming-soon";
  const others = VEHICLES.filter((v) => v.slug !== vehicle.slug);
  // Pre-select this setup in the contact form via a deep link.
  const contactHref = contactHrefForVehicle(vehicle.slug);

  // Menus that apply to this rig: its own service plus any shared ("Both").
  const vehicleMenu = menu.filter((s) => {
    const svc = s.service?.trim() ? s.service.trim() : "Both";
    return svc === "Both" || svc === vehicle.service;
  });
  // An available vehicle with no menus yet gets a tailored "in the works"
  // teaser instead of an empty list (e.g. the trailer, whose focused menus
  // are still being finalized).
  const menusInWorks = !comingSoon && vehicleMenu.length === 0;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Catering", href: "/catering" },
          { name: vehicle.name, href: `/catering/${vehicle.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white">
        <Image
          src={vehicle.image}
          alt={`${vehicle.name} — Pit & Masa mobile catering`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/70 to-[#1C1C1C]" />
        <EmblemWatermark className="-right-16 top-24 hidden md:block" opacity={0.06} size="clamp(260px, 32vw, 460px)" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-40 lg:px-8">
          <Link
            href="/catering"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={16} /> All catering setups
          </Link>
          <p className="mt-6 flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
            <Icon size={22} className="drop-shadow" />
            {comingSoon ? "Coming Soon" : "Mobile Catering · Connecticut"}
          </p>
          <h1 className="mt-4 max-w-3xl font-display! text-4xl font-normal! uppercase leading-tight md:text-6xl">
            {vehicle.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{vehicle.description}</p>
          {!comingSoon && (
            <Link
              href={contactHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/25 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
            >
              Book the {vehicle.name.replace(/^The\s+/, "")} <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </section>

      {comingSoon || menusInWorks ? (
        /* Coming-soon teaser (launching soon) or focused-menus-in-the-works */
        <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
          <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center lg:px-8 lg:py-28">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF8C00]/10 px-4 py-2 text-sm font-bold text-[#E67E00]">
              <Clock4 size={16} /> {comingSoon ? "Launching soon" : "Menus in the works"}
            </span>
            <h2 className="mt-6 font-display! text-3xl font-normal! uppercase md:text-4xl">
              {comingSoon ? vehicle.tagline : `A focused menu, built for the ${vehicle.name.replace(/^The\s+/, "")}.`}
            </h2>
            <p className="mt-4 text-lg text-[#1C1C1C]/65">
              {comingSoon ? (
                <>
                  We&apos;re putting the finishing touches on the {vehicle.name.replace(/^The\s+/, "")}.
                  Want first dibs when it rolls out? Reach out and we&apos;ll keep you posted —
                  and pencil it into your event.
                </>
              ) : (
                <>
                  We&apos;re finalizing a tight, BBQ-forward menu built specifically for the{" "}
                  {vehicle.name.replace(/^The\s+/, "")} — smoked low and slow, carved on-site.
                  Tell us about your event and we&apos;ll craft a focused spread straight off the pit.
                </>
              )}
            </p>
            <Link
              href={contactHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/20 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
            >
              {comingSoon ? "Get on the list" : "Plan your event"} <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      ) : (
        /* Menus for this vehicle, grouped by event type */
        <section className="relative overflow-hidden bg-[#FEFCF5] text-[#1C1C1C]">
          <TacoWatermark className="-right-12 top-12" rotate={-14} opacity={0.05} size="clamp(150px, 18vw, 280px)" />
          <TacoWatermark className="-left-12 bottom-16 hidden md:block" rotate={16} opacity={0.04} size="clamp(120px, 14vw, 220px)" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="mb-12 max-w-2xl">
              <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FF8C00]">
                {vehicle.name} Menus
              </p>
              <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
                Menus for every kind of event.
              </h2>
              <p className="mt-4 text-lg text-[#1C1C1C]/65">
                Pick the package that fits your occasion — every menu below is
                served from the {vehicle.name.replace(/^The\s+/, "")} and fully
                customizable to your crowd.
              </p>
            </div>
            <CateringMenuGroups menu={menu} vehicle={vehicle.service} />
            <Link
              href={contactHref}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#008080] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#008080]/20 transition hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF8C00]/40"
            >
              Build my menu <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* Explore the other setups */}
      <section className="relative isolate overflow-hidden bg-[#1C1C1C] text-white noise-texture">
        <EmblemWatermark className="-left-20 bottom-0 hidden lg:block" opacity={0.05} size="clamp(280px, 30vw, 440px)" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-heading font-semibold uppercase tracking-[0.2em] text-[#FFA733]">
              Mix &amp; Match
            </p>
            <h2 className="mt-3 font-display! text-3xl font-normal! uppercase md:text-4xl">
              Explore our other setups.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Combine more than one for a bundle deal — see the full lineup on the
              catering page.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {others.map((v) => {
              const VIcon = v.icon;
              return (
                <Link
                  key={v.slug}
                  href={`/catering/${v.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-[#FF8C00]/50 hover:bg-white/10"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF8C00]/15 text-[#FFA733]">
                    <VIcon size={22} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-lg font-bold">{v.name}</h3>
                      {v.status === "coming-soon" && (
                        <span className="rounded-full bg-[#FF8C00]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#FFA733]">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-white/65">{v.tagline}</p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-[#FFA733]" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
