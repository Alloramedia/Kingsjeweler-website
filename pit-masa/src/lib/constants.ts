export const siteConfig = {
  name: "Kings Jeweler",
  description:
    "Kings Jeweler is a family jewelry store at The Shoppes at Buckland Hills in Manchester, Connecticut — fine jewelry, engagement rings, custom designs, watch batteries, and expert jewelry repair while you shop.",
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
    linkedin: "https://linkedin.com/company/kingsjeweler",
    youtube: "https://youtube.com/@kingsjeweler",
    tiktok: "https://www.tiktok.com/@kingsjeweler",
  },
  // TODO: replace with the real Google Business Profile share link.
  gmb: "https://maps.google.com/?q=Kings+Jeweler+Buckland+Hills+Manchester+CT",
  foundingDate: "2000",
  owner: {
    name: "The Kings Jeweler Family",
    title: "Owners & Master Jewelers",
    bio: "Kings Jeweler is a family-run jewelry store inside The Shoppes at Buckland Hills in Manchester, Connecticut. From engagement rings and custom pieces to same-day watch batteries and expert repairs, every customer is helped personally by a jeweler who cares about getting it right.",
  },
};

/* ------------------------------------------------------------------ */
/*  Brand imagery — swap these filenames to change site photography.   */
/*  Placeholder art lives in /public/images/jewelry/                   */
/* ------------------------------------------------------------------ */
export const brandImages = {
  heroHome: "/images/jewelry/jewel-01.webp",
  heroCatering: "/images/jewelry/jewel-02.webp",
  heroEvents: "/images/jewelry/jewel-03.webp",
  menuFeature: "/images/jewelry/jewel-04.webp",
  aboutFeature: "/images/jewelry/jewel-05.webp",
  owner: "/images/jewelry/jewel-06.webp",
  // Rotating hero/banner photos — used by the HeroSlideshow background.
  heroSlides: [
    "/images/jewelry/jewel-01.webp",
    "/images/jewelry/jewel-02.webp",
    "/images/jewelry/jewel-03.webp",
    "/images/jewelry/jewel-04.webp",
  ],
  // Curated set reused across home offerings and feature cards.
  cards: [
    "/images/jewelry/jewel-07.webp",
    "/images/jewelry/jewel-08.webp",
    "/images/jewelry/jewel-09.webp",
    "/images/jewelry/jewel-10.webp",
    "/images/jewelry/jewel-11.webp",
    "/images/jewelry/jewel-12.webp",
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Shared blurred placeholder (dark) for next/image                   */
/*  Improves perceived load speed — shown while photos stream in.      */
/* ------------------------------------------------------------------ */
export const BLUR_DATA_URL =
  "data:image/webp;base64,UklGRigAAABXRUJQVlA4IBwAAABwAQCdASoIAAYAA4BaJZwCdAFAAAD+8qi1OKAA";

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
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Visit Us", href: "/contact" },
];

export const footerLinks = {
  services: [
    { label: "Engagement Rings", href: "/services" },
    { label: "Custom Jewelry Design", href: "/services" },
    { label: "Jewelry Repair", href: "/services" },
    { label: "Watch Repair & Batteries", href: "/services" },
    { label: "Gold Buying & Appraisals", href: "/services" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  industries: [
    { label: "Engagements & Weddings", href: "/services" },
    { label: "Anniversaries & Gifts", href: "/services" },
    { label: "Ring Sizing & Restoration", href: "/services" },
  ],
  personal: [{ label: "Get in Touch", href: "/contact" }],
};
