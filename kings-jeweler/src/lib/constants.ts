export const siteConfig = {
  name: "King's Jeweler",
  description:
    "King's Jeweler is a family jewelry store at The Shoppes at Buckland Hills in Manchester, Connecticut, offering fine jewelry, engagement rings, custom designs, watch batteries, and expert jewelry repair while you shop.",
  // TODO: replace with the real domain before launch.
  url: "https://www.kingsjewelerct.com",
  ogImage: "/og-image.jpg",
  portalUrl: "/contact",
  // TODO: replace the placeholder email with the real public email before launch.
  email: "info@kingsjewelerct.com",
  phone: "(917) 596-6388",
  address: {
    street: "194 Buckland Hills Dr",
    suite: "The Shoppes at Buckland Hills",
    city: "Manchester",
    region: "CT",
    zip: "06042",
  },
  serviceArea: "Greater Hartford, Connecticut",
  region: "CT",
  socials: {
    facebook: "https://facebook.com/kingsjeweler",
    instagram: "https://instagram.com/kingsjeweler",
    tiktok: "https://www.tiktok.com/@kingsjeweler",
    // TODO: replace with the real Google Business Profile share link.
    gmb: "https://maps.google.com/?q=Kings+Jeweler+Buckland+Hills+Manchester+CT",
  },
  foundingDate: "2000",
  owner: {
    name: "The King's Jeweler Family",
    title: "Owners & Master Jewelers",
    bio: "King's Jeweler is a family-run jewelry store inside The Shoppes at Buckland Hills in Manchester, Connecticut. From engagement rings and custom pieces to same-day watch batteries and expert repairs, every customer is helped personally by a jeweler who cares about getting it right.",
  },
};

/* ------------------------------------------------------------------ */
/*  Brand imagery — swap these filenames to change site photography.   */
/*  Real store photos live in /public/images/jewelry/                  */
/* ------------------------------------------------------------------ */
export const brandImages = {
  heroHome: "/images/jewelry/kings-28.webp", // diamond Cuban chain on bust
  heroCatering: "/images/jewelry/kings-16.webp", // interior, crest wall
  heroEvents: "/images/jewelry/kings-12.webp", // storefront in the mall
  menuFeature: "/images/jewelry/kings-19.webp", // center showcase
  aboutFeature: "/images/jewelry/kings-13.webp", // storefront, wide
  owner: "/images/jewelry/kings-14.webp", // sign over the entrance
  // Rotating hero/banner photos — used by the HeroSlideshow background.
  heroSlides: [
    "/images/jewelry/kings-28.webp",
    "/images/jewelry/kings-20.webp",
    "/images/jewelry/kings-40.webp",
    "/images/jewelry/kings-16.webp",
  ],
  // Curated set reused across home offerings and feature cards.
  cards: [
    "/images/jewelry/kings-20.webp",
    "/images/jewelry/kings-28.webp",
    "/images/jewelry/kings-40.webp",
    "/images/jewelry/kings-35.webp",
    "/images/jewelry/kings-44.webp",
    "/images/jewelry/kings-25.webp",
  ],
} as const;

/* Home hero background video (muted loop) with a poster fallback. */
export const heroVideo = {
  src: "/video/hero-home.mp4",
  mobileSrc: "/video/hero-home-mobile.mp4", // portrait cut served below md
  poster: "/video/hero-poster.jpg",
} as const;

/* ------------------------------------------------------------------ */
/*  Shared blurred placeholder (dark) for next/image                   */
/*  Improves perceived load speed — shown while photos stream in.      */
/* ------------------------------------------------------------------ */
export const BLUR_DATA_URL =
  "data:image/webp;base64,UklGRigAAABXRUJQVlA4IBwAAABwAQCdASoIAAYAA4BaJZwCdAFAAAD+8qi1OKAA";

/* ------------------------------------------------------------------ */
/*  Default gallery captions, keyed by image path — shown on hover in  */
/*  the gallery grid. Editable from the admin dashboard.               */
/* ------------------------------------------------------------------ */
export const defaultImageAlt: Record<string, string> = {
  "/images/jewelry/kings-05.webp": "Rolex Submariner on a customer's wrist",
  "/images/jewelry/kings-09.webp": "A luxury chronograph in for service",
  "/images/jewelry/kings-11.webp": "A Rolex Datejust, boxed and ready",
  "/images/jewelry/kings-12.webp": "Our storefront at The Shoppes at Buckland Hills",
  "/images/jewelry/kings-13.webp": "King's Jeweler, inside The Shoppes at Buckland Hills",
  "/images/jewelry/kings-14.webp": "The King's Jeweler sign over our entrance",
  "/images/jewelry/kings-16.webp": "Inside the store: showcases and the crest wall",
  "/images/jewelry/kings-18.webp": "Showcases stocked and ready for the day",
  "/images/jewelry/kings-19.webp": "The center showcase",
  "/images/jewelry/kings-20.webp": "Engagement rings on display",
  "/images/jewelry/kings-23.webp": "A solitaire under the case lights",
  "/images/jewelry/kings-24.webp": "Bridal sets in yellow and white gold",
  "/images/jewelry/kings-25.webp": "Iced-out Cuban link bracelets",
  "/images/jewelry/kings-27.webp": "Gold tennis bracelets",
  "/images/jewelry/kings-28.webp": "A diamond Cuban link chain",
  "/images/jewelry/kings-29.webp": "Gold Cuban link chains",
  "/images/jewelry/kings-32.webp": "Iced-out statement rings",
  "/images/jewelry/kings-33.webp": "Gold rings in the case",
  "/images/jewelry/kings-34.webp": "Diamond and gold statement rings",
  "/images/jewelry/kings-35.webp": "Diamond stud earrings",
  "/images/jewelry/kings-37.webp": "Gold letter and charm pendants",
  "/images/jewelry/kings-38.webp": "A pave diamond lion pendant",
  "/images/jewelry/kings-40.webp": "Diamond bangles on the counter",
  "/images/jewelry/kings-42.webp": "A tray of Cartier frames",
  "/images/jewelry/kings-44.webp": "Cuban link rings, white-glove service",
  "/images/jewelry/kings-45.webp": "Gold pendants, presented at the counter",
  "/images/jewelry/kings-46.webp": "Diamond solitaire earrings",
  "/images/jewelry/kings-48.webp": "Necklace showcases on the sales floor",
  "/images/jewelry/kings-49.webp": "Bracelets in yellow, white, and rose gold",
  "/images/jewelry/kings-50.webp": "Classic gold rope chains",
  "/images/jewelry/kings-51.webp": "Men's gold rings in the case",
  "/images/jewelry/kings-52.webp": "Halo engagement rings in yellow and white gold",
  "/images/jewelry/kings-53.webp": "Gold cross pendants",
  "/images/jewelry/kings-54.webp": "Gold sports charms and pendants",
  "/images/jewelry/kings-55.webp": "Ladies' gold rings with opals and gemstones",
  "/images/jewelry/kings-56.webp": "Diamond bands, tried on at the counter",
  "/images/jewelry/kings-57.webp": "A pair of diamond studs, presented",
  "/images/jewelry/kings-58.webp": "The watch counter at King's Jeweler",
};

/* ------------------------------------------------------------------ */
/*  Local SEO — Greater Hartford / North-Central Connecticut           */
/* ------------------------------------------------------------------ */
export const serviceAreas = {
  counties: ["Hartford County", "Tolland County"],
  towns: [
    "Manchester",
    "South Windsor",
    "East Hartford",
    "Vernon",
    "Glastonbury",
    "Hartford",
    "West Hartford",
    "Bolton",
    "Ellington",
    "Windsor",
    "Coventry",
    "Tolland",
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
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Engagement Rings", href: "/services/engagement-rings" },
      { label: "Custom Jewelry Design", href: "/services/custom-jewelry-design" },
      { label: "Jewelry Repair", href: "/services/jewelry-repair" },
      { label: "Watch Repair & Batteries", href: "/services/watch-repair-batteries" },
      { label: "Jewelry Appraisals", href: "/services/jewelry-appraisals" },
      { label: "Gold Chains & Jewelry", href: "/services/gold-chains-jewelry" },
    ],
  },
  { label: "Design Your Own", href: "/design" },
  { label: "We Buy Gold", href: "/sell-gold" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const footerLinks = {
  services: [
    { label: "Design Your Own Jewelry", href: "/design" },
    { label: "Engagement Rings", href: "/services/engagement-rings" },
    { label: "Custom Jewelry Design", href: "/services/custom-jewelry-design" },
    { label: "Jewelry Repair", href: "/services/jewelry-repair" },
    { label: "Watch Repair & Batteries", href: "/services/watch-repair-batteries" },
    { label: "Jewelry Appraisals", href: "/services/jewelry-appraisals" },
    { label: "Gold Chains & Jewelry", href: "/services/gold-chains-jewelry" },
    { label: "We Buy Gold", href: "/sell-gold" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "We Buy Gold", href: "/sell-gold" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  industries: [
    { label: "Engagement Ring Buying Guide", href: "/blog/engagement-ring-buying-guide" },
    { label: "Ring Resizing Cost Guide", href: "/blog/how-much-does-ring-resizing-cost" },
    { label: "How to Sell Gold Jewelry", href: "/blog/how-to-sell-gold-jewelry" },
  ],
  personal: [{ label: "Get in Touch", href: "/contact" }],
};
