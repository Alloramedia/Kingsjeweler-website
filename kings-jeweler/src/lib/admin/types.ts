/**
 * Client-safe types, defaults, and merge logic for the site admin.
 * Contains NO server-only / filesystem imports so it can be used from
 * client components (e.g. the content provider and admin dashboard).
 */
import type { Metadata } from "next";
import { siteConfig, brandImages as defaultBrand, serviceAreas, defaultImageAlt } from "@/lib/constants";
import { blogPosts as defaultBlogPosts } from "@/lib/content";
import type { BlogPost } from "@/lib/content";

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  /** Google Business Profile link. */
  gmb: string;
}

export interface HoursRow {
  day: string;
  hours: string;
}

export interface MenuItem {
  name: string;
  desc: string;
  /** Free-form price, e.g. "$14" or "Starting at $45". Optional. */
  price?: string;
  /**
   * Optional chooser hint for "pick from a list" categories, e.g. "Choose two".
   * Renders as a small badge next to the item name.
   */
  choose?: string;
  /**
   * Optional list of selectable options for this category. When present, the
   * renderer shows these as a bulleted list instead of `desc`.
   */
  options?: string[];
}

export interface MenuSection {
  title: string;
  blurb: string;
  /**
   * Optional grouping for the services list, e.g. "Jewelry Services" or
   * "Watch Services". Sections sharing a group render together under one
   * heading. Blank groups fall under a generic heading.
   */
  group?: string;
  items: MenuItem[];
}

export interface HeroOverride {
  title?: string;
  subtitle?: string;
}

/** Sitewide banner for holiday hours, closures, or announcements. */
export interface Announcement {
  enabled: boolean;
  message: string;
  /** Optional auto-show window, "YYYY-MM-DD". Blank = no limit on that end. */
  startDate: string;
  endDate: string;
}

/** A customer review shown on the home page. */
export interface Testimonial {
  author: string;
  role: string;
  body: string;
}

/** A single question-and-answer shown in a page's FAQ accordion. */
export interface FaqItem {
  question: string;
  answer: string;
}

/** The pages whose FAQ list the client can edit. */
export const FAQ_PAGES = [
  { key: "home", label: "Home page", path: "/" },
  { key: "about", label: "About page", path: "/about" },
] as const;

export type FaqPageKey = (typeof FAQ_PAGES)[number]["key"];
export type Faqs = Record<FaqPageKey, FaqItem[]>;

/** Search-engine title & description for one page. */
export interface SeoEntry {
  title: string;
  description: string;
}

/** The pages whose search-engine text the client can edit. */
export const SEO_PAGES = [
  { key: "home", label: "Home page", path: "/" },
  { key: "services", label: "Services page", path: "/services" },
  { key: "sellGold", label: "We Buy Gold page", path: "/sell-gold" },
  { key: "gallery", label: "Gallery page", path: "/gallery" },
  { key: "about", label: "About page", path: "/about" },
  { key: "contact", label: "Contact page", path: "/contact" },
] as const;

export type SeoPageKey = (typeof SEO_PAGES)[number]["key"];
export type Seo = Record<SeoPageKey, SeoEntry>;

/** Lead pipeline stage for a contact-form submission. */
export type MessageStatus = "new" | "quoted" | "booked" | "archived";

/** A contact-form submission saved to the admin inbox. */
export interface ContactMessage {
  id: string;
  ts: number;
  read: boolean;
  status: MessageStatus;
  name: string;
  email: string;
  phone: string;
  service: string;
  business: string;
  message: string;
  /** All remaining form fields, label → value, for the full detail view. */
  details: { label: string; value: string }[];
}

/** Key site photos that appear across the marketing pages. */
export interface BrandImages {
  logo: string;
  heroHome: string;
  heroCatering: string;
  heroEvents: string;
  menuFeature: string;
  aboutFeature: string;
  owner: string;
  heroSlides: string[];
  cards: string[];
}

/** Editable brand colors, applied site-wide via an injected theme. */
export interface BrandColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  secondary: string;
  dark: string;
  cream: string;
  card: string;
  sand: string;
}

/** The fully-resolved content the public site renders. */
export interface SiteContent {
  contact: { phone: string; email: string };
  socials: SocialLinks;
  hours: HoursRow[];
  menu: MenuSection[];
  blog: BlogPost[];
  hero: { home: HeroOverride };
  brandImages: BrandImages;
  colors: BrandColors;
  announcement: Announcement;
  testimonials: Testimonial[];
  faqs: Faqs;
  serviceTowns: string[];
  gallery: string[];
  /** Per-photo alt text, keyed by image URL (accessibility + SEO). */
  imageAlt: Record<string, string>;
  seo: Seo;
}

/** Partial overrides as stored in Netlify Blobs. */
export interface Overrides {
  contact?: Partial<{ phone: string; email: string }>;
  socials?: Partial<SocialLinks>;
  hours?: HoursRow[];
  menu?: MenuSection[];
  blog?: BlogPost[];
  hero?: { home?: HeroOverride };
  brandImages?: Partial<BrandImages>;
  colors?: Partial<BrandColors>;
  announcement?: Announcement;
  testimonials?: Testimonial[];
  faqs?: Partial<Record<FaqPageKey, FaqItem[]>>;
  serviceTowns?: string[];
  gallery?: string[];
  imageAlt?: Record<string, string>;
  seo?: Partial<Record<SeoPageKey, Partial<SeoEntry>>>;
}

/* ── Defaults — King's Jeweler ─────────────────────────────────────── */

// Hours from the Google Business Profile.
export const defaultHours: HoursRow[] = [
  { day: "Monday – Friday", hours: "11:00 AM – 7:00 PM" },
  { day: "Saturday", hours: "11:00 AM – 8:00 PM" },
  { day: "Sunday", hours: "11:00 AM – 6:00 PM" },
];

export const defaultMenu: MenuSection[] = [
  {
    group: "Jewelry Services",
    title: "Engagement & Bridal",
    blurb:
      "Diamond engagement rings, wedding bands, and anniversary pieces, with honest, pressure-free guidance from a real jeweler.",
    items: [
      { name: "Engagement rings", desc: "Natural and lab-grown diamonds in every shape and setting style. We work with your budget, not against it." },
      { name: "Wedding bands", desc: "Classic, modern, and custom bands in gold, platinum, and alternative metals, for him and for her." },
      { name: "Custom bridal design", desc: "Design a one-of-a-kind ring from scratch, or reset a family stone into something new." },
    ],
  },
  {
    group: "Jewelry Services",
    title: "Repair & Restoration",
    blurb:
      "Expert repairs done with care, many completed the same day while you shop the mall.",
    items: [
      { name: "Ring sizing", desc: "Up or down, most sizings ready fast.", price: "Quoted in store" },
      { name: "Chain & clasp repair", desc: "Soldering, clasp replacement, and link repair for gold and silver chains." },
      { name: "Stone setting & prong re-tipping", desc: "Secure loose stones and rebuild worn prongs before a stone is lost." },
      { name: "Cleaning & polishing", desc: "Bring your jewelry back to life with professional cleaning and inspection." },
    ],
  },
  {
    group: "Watch Services",
    title: "Watch Repair & Batteries",
    blurb:
      "Fast, affordable watch services while you wait.",
    items: [
      { name: "Watch batteries", desc: "Replaced on the spot for most makes and models.", price: "Quoted in store" },
      { name: "Band sizing & replacement", desc: "Links added or removed, plus replacement bands and straps." },
      { name: "Watch repair", desc: "Movement, crystal, and stem repairs for everyday and luxury watches." },
    ],
  },
  {
    group: "Buying & Appraisals",
    title: "Gold Buying & Appraisals",
    blurb:
      "Fair, transparent offers. Sell outright or trade toward something new.",
    items: [
      { name: "Gold & silver buying", desc: "We buy gold, silver, and platinum in any condition: broken chains, old class rings, unmatched earrings." },
      { name: "Diamond buying", desc: "Honest evaluations and competitive offers on diamonds and estate jewelry." },
      { name: "Appraisals", desc: "Written appraisals for insurance and estate purposes.", price: "Quoted in store" },
    ],
  },
];

export const defaultHeroHome: Required<HeroOverride> = {
  title: "Jewelry fit for royalty, service that feels like family",
  subtitle:
    "Engagement rings, custom design, watch batteries, expert repairs, and fair gold buying, all handled in person at our counter inside The Shoppes at Buckland Hills.",
};

export const defaultBrandImages: BrandImages = {
  logo: "/images/kings-jeweler-logo.webp",
  heroHome: defaultBrand.heroHome,
  heroCatering: defaultBrand.heroCatering,
  heroEvents: defaultBrand.heroEvents,
  menuFeature: defaultBrand.menuFeature,
  aboutFeature: defaultBrand.aboutFeature,
  owner: defaultBrand.owner,
  heroSlides: [...defaultBrand.heroSlides],
  cards: [...defaultBrand.cards],
};

/** Default brand colors — the literal hex values used across the site. */
export const defaultBrandColors: BrandColors = {
  primary: "#C68A17",
  primaryHover: "#A87310",
  primaryLight: "#F0A92D",
  secondary: "#1F3A5F",
  dark: "#14141A",
  cream: "#FBF9F4",
  card: "#FFFDF8",
  sand: "#E5E1D8",
};

export const defaultAnnouncement: Announcement = {
  enabled: false,
  message: "",
  startDate: "",
  endDate: "",
};

/**
 * Whether the announcement banner should show right now — respects the
 * on/off switch, a non-empty message, and the optional date window.
 */
export function announcementVisible(
  a: Announcement,
  now: Date = new Date(),
): boolean {
  if (!a.enabled || !a.message.trim()) return false;
  const today = now.toISOString().slice(0, 10);
  if (a.startDate && today < a.startDate) return false;
  if (a.endDate && today > a.endDate) return false;
  return true;
}

// TODO: replace with real customer reviews (e.g. from the Google profile).
export const defaultTestimonials: Testimonial[] = [
  {
    author: "Sarah M.",
    role: "Engagement ring · Manchester",
    body: "They helped my fiancé design the perfect ring without any pressure. The whole experience felt personal, like family instead of a sales floor.",
  },
  {
    author: "James R.",
    role: "Watch battery & repair · South Windsor",
    body: "Stopped in for a watch battery and they had it done in minutes. Fair price, friendly service. I've been back three times since.",
  },
  {
    author: "Linda C.",
    role: "Heirloom restoration · Glastonbury",
    body: "They restored my grandmother's ring beautifully and resized it while keeping every original detail. I trust them with pieces I'd never hand to anyone else.",
  },
];

export const defaultFaqs: Faqs = {
  home: [
    {
      question: "Do I need an appointment?",
      answer:
        "No appointment needed. Just stop in during store hours, seven days a week. For custom design consultations, calling ahead helps us set aside time for you, but walk-ins are always welcome.",
    },
    {
      question: "Can you replace my watch battery while I wait?",
      answer:
        "Yes. Most watch batteries are replaced on the spot in just a few minutes, for most makes and models.",
    },
    {
      question: "Do you buy gold and old jewelry?",
      answer:
        "We do. Bring in gold, silver, platinum, or diamonds in any condition and we'll make a fair, transparent offer. Sell outright or trade the value toward something new.",
    },
    {
      question: "How long do jewelry repairs take?",
      answer:
        "Many repairs, like ring sizing and chain soldering, can be done quickly, often while you shop the mall. Bigger restorations take longer; we'll always give you an honest timeline up front.",
    },
    {
      question: "Do you make custom jewelry?",
      answer:
        "Yes. Bring us an idea, a photo, or an heirloom stone and we'll design and craft a one-of-a-kind piece. Custom work is one of our specialties.",
    },
  ],
  about: [
    {
      question: "What makes King's Jeweler different from chain jewelry stores?",
      answer:
        "We're family owned and operated. When you come in, you talk directly with the jeweler, not a salesperson working a quota. Repairs and custom work happen with us, not at a warehouse three states away.",
    },
    {
      question: "Where exactly is the store?",
      answer:
        "We're inside The Shoppes at Buckland Hills at 194 Buckland Hills Drive in Manchester, Connecticut, with free mall parking and no appointment needed.",
    },
    {
      question: "Do you work on heirloom and antique pieces?",
      answer:
        "Absolutely. Restoring family pieces, whether that's resizing, resetting stones, or rebuilding worn settings, is some of the most meaningful work we do, and we treat every heirloom like it's our own.",
    },
  ],
};

export const defaultServiceTowns: string[] = [...serviceAreas.towns];

function mergeFaqs(o?: Partial<Record<FaqPageKey, FaqItem[]>>): Faqs {
  const out = {} as Faqs;
  for (const p of FAQ_PAGES) {
    const list = o?.[p.key];
    out[p.key] = list && list.length > 0 ? list : defaultFaqs[p.key];
  }
  return out;
}

/**
 * The current/default search-engine text for each page. Shown in the editor
 * as the live value; leaving a field blank falls back to these.
 */
export const seoDefaults: Seo = {
  home: {
    title: "King's Jeweler | Jewelry Store at Buckland Hills in Manchester, CT",
    description:
      "King's Jeweler is a family jewelry store at The Shoppes at Buckland Hills in Manchester, CT offering fine jewelry, engagement rings, custom design, watch batteries, jewelry repair, and gold buying.",
  },
  services: {
    title: "Jewelry Services: Repairs, Custom Design & Gold Buying",
    description:
      "Explore King's Jeweler services: engagement rings, custom jewelry design, ring sizing, chain repair, watch batteries while you wait, appraisals, and fair gold buying in Manchester, CT.",
  },
  sellGold: {
    title: "We Buy Gold in Manchester, CT",
    description:
      "Sell gold, silver, diamonds, and estate jewelry at King's Jeweler in The Shoppes at Buckland Hills. We weigh everything in front of you and pay 70–90% of melt value. No appointment needed.",
  },
  gallery: {
    title: "Gallery: Custom Jewelry & Work From Our Showcase",
    description:
      "Browse custom pieces, restorations, and favorites from the King's Jeweler showcase at The Shoppes at Buckland Hills in Manchester, CT.",
  },
  about: {
    title: "About King's Jeweler | Family Jewelers in Manchester, CT",
    description:
      "Meet King's Jeweler, a family-run jewelry store inside The Shoppes at Buckland Hills in Manchester, Connecticut, where every customer is helped personally by a jeweler who cares.",
  },
  contact: {
    title: "Visit or Contact King's Jeweler",
    description:
      "Visit King's Jeweler at The Shoppes at Buckland Hills in Manchester, CT, or send us a message about repairs, custom design, engagement rings, or gold buying.",
  },
};

export const defaultSeo: Seo = {
  home: { title: "", description: "" },
  services: { title: "", description: "" },
  sellGold: { title: "", description: "" },
  gallery: { title: "", description: "" },
  about: { title: "", description: "" },
  contact: { title: "", description: "" },
};

function mergeSeo(o?: Partial<Record<SeoPageKey, Partial<SeoEntry>>>): Seo {
  const out = {} as Seo;
  for (const p of SEO_PAGES) {
    out[p.key] = {
      title: o?.[p.key]?.title ?? "",
      description: o?.[p.key]?.description ?? "",
    };
  }
  return out;
}

/**
 * Apply a client-edited SEO override on top of a page's base metadata.
 * Blank fields keep the page's existing (default) text.
 */
export function applySeo(base: Metadata, o?: SeoEntry): Metadata {
  if (!o || (!o.title && !o.description)) return base;
  const next: Metadata = { ...base };
  if (o.title) {
    next.title = { absolute: o.title };
    if (next.openGraph) next.openGraph = { ...next.openGraph, title: o.title };
    if (next.twitter) next.twitter = { ...next.twitter, title: o.title };
  }
  if (o.description) {
    next.description = o.description;
    if (next.openGraph) next.openGraph = { ...next.openGraph, description: o.description };
    if (next.twitter) next.twitter = { ...next.twitter, description: o.description };
  }
  return next;
}

/* ── Merge — defaults + saved overrides → resolved content ───────── */

export function mergeContent(o: Overrides): SiteContent {
  return {
    contact: {
      phone: o.contact?.phone ?? siteConfig.phone,
      email: o.contact?.email ?? siteConfig.email,
    },
    socials: {
      facebook: o.socials?.facebook ?? siteConfig.socials.facebook,
      instagram: o.socials?.instagram ?? siteConfig.socials.instagram,
      tiktok: o.socials?.tiktok ?? siteConfig.socials.tiktok,
      gmb: o.socials?.gmb ?? siteConfig.socials.gmb,
    },
    hours: o.hours && o.hours.length > 0 ? o.hours : defaultHours,
    menu: o.menu && o.menu.length > 0 ? o.menu : defaultMenu,
    blog: o.blog && o.blog.length > 0 ? o.blog : defaultBlogPosts,
    hero: {
      home: {
        title: o.hero?.home?.title ?? defaultHeroHome.title,
        subtitle: o.hero?.home?.subtitle ?? defaultHeroHome.subtitle,
      },
    },
    brandImages: {
      logo: o.brandImages?.logo || defaultBrandImages.logo,
      heroHome: o.brandImages?.heroHome || defaultBrandImages.heroHome,
      heroCatering: o.brandImages?.heroCatering || defaultBrandImages.heroCatering,
      heroEvents: o.brandImages?.heroEvents || defaultBrandImages.heroEvents,
      menuFeature: o.brandImages?.menuFeature || defaultBrandImages.menuFeature,
      aboutFeature: o.brandImages?.aboutFeature || defaultBrandImages.aboutFeature,
      owner: o.brandImages?.owner || defaultBrandImages.owner,
      heroSlides:
        o.brandImages?.heroSlides && o.brandImages.heroSlides.length > 0
          ? o.brandImages.heroSlides
          : defaultBrandImages.heroSlides,
      cards:
        o.brandImages?.cards && o.brandImages.cards.length > 0
          ? o.brandImages.cards
          : defaultBrandImages.cards,
    },
    colors: {
      primary: o.colors?.primary || defaultBrandColors.primary,
      primaryHover: o.colors?.primaryHover || defaultBrandColors.primaryHover,
      primaryLight: o.colors?.primaryLight || defaultBrandColors.primaryLight,
      secondary: o.colors?.secondary || defaultBrandColors.secondary,
      dark: o.colors?.dark || defaultBrandColors.dark,
      cream: o.colors?.cream || defaultBrandColors.cream,
      card: o.colors?.card || defaultBrandColors.card,
      sand: o.colors?.sand || defaultBrandColors.sand,
    },
    announcement: {
      enabled: o.announcement?.enabled ?? defaultAnnouncement.enabled,
      message: o.announcement?.message ?? defaultAnnouncement.message,
      startDate: o.announcement?.startDate ?? defaultAnnouncement.startDate,
      endDate: o.announcement?.endDate ?? defaultAnnouncement.endDate,
    },
    testimonials:
      o.testimonials && o.testimonials.length > 0
        ? o.testimonials
        : defaultTestimonials,
    faqs: mergeFaqs(o.faqs),
    serviceTowns:
      o.serviceTowns && o.serviceTowns.length > 0
        ? o.serviceTowns
        : defaultServiceTowns,
    gallery: o.gallery && o.gallery.length > 0 ? o.gallery : [],
    imageAlt: { ...defaultImageAlt, ...(o.imageAlt ?? {}) },
    seo: mergeSeo(o.seo),
  };
}
