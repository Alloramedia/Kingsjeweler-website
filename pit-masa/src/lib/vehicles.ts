import { Caravan, Truck, Martini, type LucideIcon } from "lucide-react";
import { CATERING_HELP_OPTIONS, SETUP_NEEDS_OPTIONS } from "@/lib/cta";

/**
 * The three mobile "setups" Pit & Masa rolls out. Each vehicle has its own
 * menus (pulled from the admin `menu` content by matching `service`) and its
 * own dedicated page at /catering/[slug]. Marketing meta lives here in code;
 * the per-event menus are admin-editable.
 */
export interface VehicleInfo {
  slug: "trailer" | "truck" | "cocktail-cart";
  name: string;
  /** Value matched against `MenuSection.service` to pull this vehicle's menus. */
  service: string;
  tagline: string;
  description: string;
  status: "available" | "coming-soon";
  image: string;
  /** Illustrated setup graphic used on the "Choose Your Setup" cards. */
  iconImage: string;
  icon: LucideIcon;
}

export const VEHICLES: VehicleInfo[] = [
  {
    slug: "trailer",
    name: "The Pit Trailer",
    service: "Pit Trailer",
    tagline: "Wood-fired BBQ, rolled to your venue",
    description:
      "The heart of the operation. Our smoker trailer brings brisket, pulled pork, ribs, and smoked chicken cooked low and slow on-site — bark set, smoke ring deep, carved to order in front of your guests.",
    status: "available",
    image: "/images/food/food-038.webp",
    iconImage: "/images/setup-trailer.png",
    icon: Caravan,
  },
  {
    slug: "truck",
    name: "The Food Truck",
    service: "Food Truck",
    tagline: "Fresh masa and a live taco bar",
    description:
      "A rolling taqueria. Tortillas pressed to order, birria and carne asada off the comal, and a build-your-own bar of house salsas and fixings — the life of any party.",
    status: "available",
    image: "/images/food/food-111.webp",
    iconImage: "/images/setup-truck.png",
    icon: Truck,
  },
  {
    slug: "cocktail-cart",
    name: "The Cocktail Cart",
    service: "Cocktail Cart",
    tagline: "Hand-crafted drinks on wheels",
    description:
      "Our newest setup, launching soon. A mobile cantina pouring signature cocktails, palomas, and house-made aguas frescas to welcome your guests in style.",
    status: "coming-soon",
    image: "/images/food/food-076.webp",
    iconImage: "/images/setup-cocktail-cart-v2.png",
    icon: Martini,
  },
];

export const VEHICLE_SLUGS = VEHICLES.map((v) => v.slug);

export const getVehicle = (slug: string): VehicleInfo | undefined =>
  VEHICLES.find((v) => v.slug === slug);

/** Display name for a vehicle slug, e.g. "trailer" → "The Pit Trailer". */
export const vehicleName = (slug: string): string =>
  getVehicle(slug)?.name ?? slug;

/**
 * Contact-form prefill for each setup. `service` matches a CATERING_HELP_OPTIONS
 * value; `setup` matches a SETUP_NEEDS_OPTIONS value (used for the coming-soon
 * Cocktail Cart, which is booked as an add-on alongside another setup). The
 * literal types below keep these in sync with cta.ts at compile time.
 */
type HelpOption = (typeof CATERING_HELP_OPTIONS)[number];
type SetupOption = (typeof SETUP_NEEDS_OPTIONS)[number];
const VEHICLE_CONTACT: Record<
  VehicleInfo["slug"],
  { service?: HelpOption; setup?: SetupOption }
> = {
  trailer: { service: "Pit Trailer (Wood-Fired BBQ)" },
  truck: { service: "Food Truck (Live Taco Bar)" },
  "cocktail-cart": { setup: "Add a Cocktail Cart / bar (coming soon)" },
};

/** Deep-link to the contact form with this setup pre-selected. */
export const contactHrefForVehicle = (slug: string): string => {
  const map = VEHICLE_CONTACT[slug as VehicleInfo["slug"]];
  if (map?.service) return `/contact?service=${encodeURIComponent(map.service)}`;
  if (map?.setup) return `/contact?setup=${encodeURIComponent(map.setup)}`;
  return "/contact";
};
