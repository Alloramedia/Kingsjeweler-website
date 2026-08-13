export const siteConfig = {
  name: "Pit & Masa",
  description:
    "Pit & Masa is a mobile smoke & taco catering company serving all of Connecticut — wood-fired BBQ, birria tacos, and chef-prepared meal prep for events, parties, holidays, and everyday meals.",
  url: "https://www.pitandmasa.com",
  ogImage: "/og-image.jpg",
  portalUrl: "/contact",
  email: "info@pitandmasa.com",
  // TODO: replace the placeholder with the real public phone number before launch.
  phone: "(000) 000-0000",
  // Mobile food business — no public storefront. Serves all of Connecticut.
  serviceArea: "Connecticut",
  region: "CT",
  socials: {
    facebook: "https://facebook.com/pitandmasa",
    instagram: "https://instagram.com/pitandmasa",
    linkedin: "https://linkedin.com/company/pitandmasa",
    youtube: "https://youtube.com/@pitandmasa",
    tiktok: "https://www.tiktok.com/@pitandmasa",
  },
  gmb: "https://www.pitandmasa.com",
  foundingDate: "2020",
  owner: {
    name: 'Ryan "Buck" Buchanan',
    title: "Owner & Pitmaster",
    bio: "Buck is the owner and pitmaster behind Pit & Masa, a mobile BBQ and taco catering company serving events across Connecticut since 2020. He leads every cook personally — from dialing in wood-fired smoke on a brisket to pressing fresh masa for birria tacos — drawing on years of hands-on experience catering weddings, corporate events, festivals, and backyard parties throughout the state.",
  },
};

/* ------------------------------------------------------------------ */
/*  Brand imagery — swap these filenames to change site photography.   */
/*  Photos live in /public/images/food/                                */
/* ------------------------------------------------------------------ */
export const brandImages = {
  heroHome: "/images/food/food-008.webp", // street tacos
  heroCatering: "/images/food/food-111.webp", // birria tacos
  heroEvents: "/images/food/food-028.webp", // catering taco spread
  menuFeature: "/images/food/food-076.webp", // street tacos on board
  aboutFeature: "/images/food/food-038.webp", // smoked pit BBQ ribs board
  owner: "/images/food/food-070.webp", // pitmaster portrait
  // Rotating hero/banner photos — used by the HeroSlideshow background.
  heroSlides: [
    "/images/food/food-008.webp", // street tacos
    "/images/food/food-111.webp", // birria tacos
    "/images/food/food-028.webp", // catering taco spread
    "/images/food/food-038.webp", // smoked pit BBQ ribs board
    "/images/food/food-071.webp", // catering buffet spread
  ],
  // Curated set reused across home offerings, events, and catering cards.
  cards: [
    "/images/food/food-025.webp", // taco bar spread — parties
    "/images/food/food-086.webp", // grilled & smoked meats — holiday meats / weddings
    "/images/food/food-115.webp", // ready-to-eat meal box — meal prep / corporate
    "/images/food/food-071.webp", // catering buffet spread — gatherings
    "/images/food/food-108.webp", // birria quesadilla — community
    "/images/food/food-116.webp", // loaded meal box & fries — game day / casual
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Shared blurred placeholder (warm dark) for next/image             */
/*  Improves perceived load speed — shown while photos stream in.     */
/* ------------------------------------------------------------------ */
export const BLUR_DATA_URL =
  "data:image/webp;base64,UklGRigAAABXRUJQVlA4IBwAAABwAQCdASoIAAYAA4BaJZwCdAFAAAD+8qi1OKAA";

/* ------------------------------------------------------------------ */
/*  Local SEO — Connecticut service area                               */
/* ------------------------------------------------------------------ */
export const serviceAreas = {
  counties: [
    "Hartford County",
    "New Haven County",
    "Fairfield County",
    "Middlesex County",
    "Litchfield County",
    "Tolland County",
    "New London County",
    "Windham County",
  ],
  towns: [
    "Hartford",
    "New Haven",
    "Stamford",
    "Bridgeport",
    "Waterbury",
    "Danbury",
    "New Britain",
    "West Hartford",
    "Manchester",
    "Meriden",
    "Middletown",
    "Bristol",
    "Southington",
    "Glastonbury",
    "Farmington",
    "Cheshire",
  ],
} as const;

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
  /** When true, rendered as a non-clickable section header in dropdowns */
  isHeader?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Menu", href: "/menu" },
  { label: "Festivals", href: "/festivals" },
  {
    label: "Catering",
    href: "/catering",
    children: [
      { label: "Catering Overview", href: "/catering" },
      { label: "The Pit Trailer", href: "/catering/trailer" },
      { label: "The Food Truck", href: "/catering/truck" },
      { label: "The Cocktail Cart", href: "/catering/cocktail-cart" },
    ],
  },
  {
    label: "Recipes",
    href: "/recipes",
    children: [
      { label: "All Recipes", href: "/recipes" },
      { label: "From the Blog", href: "/blog" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "Farm to Table", href: "/farm-to-table" },
    ],
  },
];

export const footerLinks = {
  services: [
    { label: "Smoked BBQ Catering", href: "/menu" },
    { label: "Festival & Street Menu", href: "/festivals" },
    { label: "Taco Bar & Birria", href: "/catering" },
    { label: "Holiday Meal Packs", href: "/catering" },
    { label: "Meal Prep & Pre-Made Meals", href: "/menu" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Farm to Table", href: "/farm-to-table" },
    { label: "Menu", href: "/menu" },
    { label: "Catering", href: "/catering" },
    { label: "Recipes", href: "/recipes" },
    { label: "Blog", href: "/blog" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  industries: [
    { label: "Party & Event Catering", href: "/catering" },
    { label: "Holiday Catering", href: "/catering" },
    { label: "Weekly Meal Prep", href: "/menu" },
    { label: "Pre-Made Meals", href: "/menu" },
  ],
  personal: [
    { label: "Get in Touch", href: "/contact" },
  ],
};
