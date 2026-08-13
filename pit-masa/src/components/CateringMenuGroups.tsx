"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  UtensilsCrossed,
  Heart,
  Building2,
  Coffee,
  PlusCircle,
  Truck,
  Caravan,
  type LucideIcon,
} from "lucide-react";
import type { MenuSection } from "@/lib/admin/types";
import { VEHICLES, type VehicleInfo } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

/** Visual meta for each event-type group, with a resilient fallback. */
const groupMeta: Record<string, { icon: LucideIcon; image: string }> = {
  Weddings: { icon: Heart, image: "/images/food/food-071.webp" },
  "Corporate & Private Parties": { icon: Building2, image: "/images/food/food-028.webp" },
  "Brunch & Daytime": { icon: Coffee, image: "/images/food/food-067.webp" },
  "Add-On Stations": { icon: PlusCircle, image: "/images/food/food-040.webp" },
};

const fallbackGroupMeta = { icon: UtensilsCrossed, image: "/images/food/food-076.webp" };

/** Per-package banner image, keyed by package name, falling back to its group image. */
const packageImages: Record<string, string> = {
  "P&M Wedding Buffet": "/images/food/food-071.webp",
  "The Back Yard Feast": "/images/food/food-028.webp",
  "P&M Taco Fiesta": "/images/food/food-111.webp",
  "Texas meets Mexico": "/images/food/food-038.webp",
  "New England Smokehouse": "/images/food/food-086.webp",
  "P&M Brunch": "/images/food/food-067.webp",
  "Premium Live Stations": "/images/food/food-040.webp",
  "Cocktail Hour": "/images/food/food-076.webp",
  // Pit Trailer packages
  "The Pitmaster's Wedding": "/images/food/food-072.webp",
  "Oak & Embers Reception": "/images/food/food-035.webp",
  "The Backyard Pit Party": "/images/food/food-042.webp",
  "Low & Slow Smokehouse": "/images/food/food-045.webp",
  "Smokehouse Brunch": "/images/food/food-050.webp",
  "Pit Trailer Stations": "/images/food/food-055.webp",
};

const ALL = "All";

/** Normalize a service label; blank counts as "Both". */
const serviceOf = (s?: string) => (s?.trim() ? s.trim() : "Both");

/** Pick a rig icon from a service label. */
function rigIcon(service: string): LucideIcon {
  const s = service.toLowerCase();
  if (s.includes("truck")) return Truck;
  if (s.includes("trailer")) return Caravan;
  return UtensilsCrossed;
}

/**
 * Map a "Served from" service label to the setup illustration(s) shown on a
 * package card. "Both" combines the Trailer and the Food Truck.
 */
function vehiclesForService(service: string): VehicleInfo[] {
  if (service === "Both") {
    return VEHICLES.filter((v) => v.slug === "trailer" || v.slug === "truck");
  }
  const matches = VEHICLES.filter((v) => v.service === service);
  return matches.length > 0 ? matches : VEHICLES.filter((v) => v.slug === "truck");
}

/** Overlapping setup illustrations used as a per-package "served from" badge. */
function SetupBadge({ service, label }: { service: string; label: string }) {
  const rigs = vehiclesForService(service);
  return (
    <span className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-[#FFFCF7]/95 py-1.5 pl-2.5 pr-3.5 shadow-md ring-1 ring-[#1C1C1C]/5 backdrop-blur-sm">
      <span className="flex -space-x-4">
        {rigs.map((v) => (
          <span key={v.slug} className="relative h-7 w-12 shrink-0">
            <Image
              src={v.iconImage}
              alt={v.name}
              fill
              sizes="48px"
              className="object-contain drop-shadow-sm"
            />
          </span>
        ))}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#1C1C1C]/70">
        {label}
      </span>
    </span>
  );
}

export function CateringMenuGroups({
  menu,
  vehicle,
}: {
  menu: MenuSection[];
  /**
   * When set to a vehicle's service value (e.g. "Pit Trailer"), the list is
   * locked to that vehicle: the rig tabs and per-card rig badge are hidden.
   */
  vehicle?: string;
}) {
  // Distinct specific rigs (anything that isn't "Both"), preserving order.
  const rigs = useMemo(() => {
    const seen: string[] = [];
    for (const section of menu) {
      const s = serviceOf(section.service);
      if (s !== "Both" && !seen.includes(s)) seen.push(s);
    }
    return seen;
  }, [menu]);

  const [activeRig, setActiveRig] = useState<string>(ALL);

  // Effective rig: a locked vehicle wins over the tab selection.
  const effectiveRig = vehicle ?? activeRig;

  // Filter by rig: "Both"/blank packages show under every rig.
  const visible = useMemo(() => {
    if (effectiveRig === ALL) return menu;
    return menu.filter((s) => {
      const svc = serviceOf(s.service);
      return svc === "Both" || svc === effectiveRig;
    });
  }, [menu, effectiveRig]);

  // Group visible sections by event-type label, preserving first-seen order.
  const groups = useMemo(() => {
    const out: { name: string; sections: MenuSection[] }[] = [];
    for (const section of visible) {
      const name = section.group?.trim() || "Menu";
      let group = out.find((g) => g.name === name);
      if (!group) {
        group = { name, sections: [] };
        out.push(group);
      }
      group.sections.push(section);
    }
    return out;
  }, [visible]);

  const tabs = rigs.length > 0 ? [ALL, ...rigs] : [];
  // Only show the rig filter when there's a real choice (2+ distinct rigs).
  const showTabs = !vehicle && rigs.length > 1;

  return (
    <div>
      {showTabs && (
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-sm font-heading font-semibold uppercase tracking-[0.15em] text-[#1C1C1C]/55">
            Served from
          </span>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter packages by setup">
            {tabs.map((tab) => {
              const isActive = tab === activeRig;
              const TabIcon = tab === ALL ? UtensilsCrossed : rigIcon(tab);
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveRig(tab)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00]",
                    isActive
                      ? "bg-[#FF8C00] text-white shadow-md shadow-[#FF8C00]/20"
                      : "border border-[#1C1C1C]/15 bg-white text-[#1C1C1C]/70 hover:border-[#FF8C00] hover:text-[#1C1C1C]",
                  )}
                >
                  <TabIcon size={16} />
                  {tab === ALL ? "All setups" : tab}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {groups.map((group) => {
        const meta = groupMeta[group.name] ?? fallbackGroupMeta;
        const GroupIcon = meta.icon;
        return (
          <div key={group.name} className="mb-16 last:mb-0">
            <div className="mb-8 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00] text-white shadow-lg">
                <GroupIcon size={20} />
              </span>
              <h2 className="font-display! text-3xl font-normal! uppercase text-[#1C1C1C] md:text-4xl">
                {group.name}
              </h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {group.sections.map((section, idx) => {
                const image = packageImages[section.title] ?? meta.image;
                const svc = serviceOf(section.service);
                const rigLabel = svc === "Both" ? "Truck & Trailer" : svc;
                return (
                  <div
                    key={`${group.name}-${idx}`}
                    className="overflow-hidden rounded-2xl border border-[#1C1C1C]/10 bg-[#FFFCF7] shadow-sm"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={image}
                        alt={`${section.title} — Pit & Masa catering package`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/10 to-transparent" />
                      <SetupBadge service={svc} label={rigLabel} />
                      <div className="absolute bottom-0 left-0 flex items-center gap-3 p-6">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FF8C00] text-white shadow-lg">
                          <GroupIcon size={20} />
                        </span>
                        <h3 className="font-heading text-2xl font-black text-white">
                          {section.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-7">
                      <p className="text-sm italic text-[#1C1C1C]/60">{section.blurb}</p>
                      <ul className="mt-5 grid gap-4">
                        {section.items.map((item) => (
                          <li
                            key={item.name}
                            className="border-b border-[#1C1C1C]/5 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF8C00]" />
                              <div className="flex-1">
                                <div className="flex items-baseline justify-between gap-3">
                                  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-semibold text-[#1C1C1C]">
                                    {item.name}
                                    {item.choose && (
                                      <span className="rounded-full bg-[#FF8C00]/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#FF8C00]">
                                        {item.choose}
                                      </span>
                                    )}
                                  </p>
                                  {item.price && (
                                    <p className="shrink-0 font-bold text-[#FF8C00]">{item.price}</p>
                                  )}
                                </div>
                                {item.desc ? (
                                  <p className="mt-0.5 text-sm text-[#1C1C1C]/60">{item.desc}</p>
                                ) : null}
                                {item.options && item.options.length > 0 ? (
                                  <ul className="mt-2 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
                                    {item.options.map((opt) => (
                                      <li
                                        key={opt}
                                        className="flex items-start gap-2 text-sm text-[#1C1C1C]/65"
                                      >
                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#FF8C00]/50" />
                                        <span>{opt}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {groups.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[#1C1C1C]/15 bg-[#FFFCF7] p-8 text-center text-[#1C1C1C]/55">
          Menus for this setup are on the way. Reach out and we&apos;ll build a
          custom spread for your event.
        </p>
      )}
    </div>
  );
}
