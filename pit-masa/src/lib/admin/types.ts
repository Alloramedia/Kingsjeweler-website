/**
 * Client-safe types, defaults, and merge logic for the site admin.
 * Contains NO server-only / filesystem imports so it can be used from
 * client components (e.g. the content provider and admin dashboard).
 */
import type { Metadata } from "next";
import { siteConfig, brandImages as defaultBrand, serviceAreas } from "@/lib/constants";
import { recipes as defaultRecipes, blogPosts as defaultBlogPosts } from "@/lib/content";
import type { Recipe, BlogPost } from "@/lib/content";

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
}

export interface HoursRow {
  day: string;
  hours: string;
}

export interface MenuItem {
  name: string;
  desc: string;
  /** Free-form price, e.g. "$14" or "Market price". Optional. */
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
  /**
   * Optional links to back-office dish recipe ids (see lib/admin/kitchen.ts).
   * Used only in the admin to estimate this item's food cost & nutrition from
   * the Inventory — never rendered on the public site.
   */
  recipeIds?: string[];
}

export interface MenuSection {
  title: string;
  blurb: string;
  /**
   * Optional event-type grouping for the catering menu, e.g. "Weddings",
   * "Corporate & Private Parties", "Brunch & Daytime", or "Add-On Stations".
   * Sections sharing a group render together under one heading. Blank groups
   * fall under a generic "Menu" heading.
   */
  group?: string;
  /**
   * Which rig serves this package — "Food Truck", "Pit Trailer", or "Both".
   * Powers the truck/trailer filter on the menu page. Blank is treated as
   * "Both" (available from either setup).
   */
  service?: string;
  items: MenuItem[];
}

/**
 * A bundle deal that combines two or more vehicles (Trailer / Truck / Cocktail
 * Cart) into one package. `vehicles` holds vehicle slugs.
 */
export interface Bundle {
  name: string;
  blurb: string;
  /** Vehicle slugs included in this bundle, e.g. ["trailer", "truck"]. */
  vehicles: string[];
  /** Short "what's included" lines. */
  highlights: string[];
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

/** A guest review shown on the home page. */
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

/** An upcoming festival / pop-up appearance. */
export interface EventItem {
  name: string;
  date: string;
  location: string;
  time: string;
  url: string;
}

/** The pages whose FAQ list the client can edit. */
export const FAQ_PAGES = [
  { key: "home", label: "Home page", path: "/" },
  { key: "about", label: "About page", path: "/about" },
  { key: "farmToTable", label: "Farm to Table page", path: "/farm-to-table" },
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
  { key: "menu", label: "Menu page", path: "/menu" },
  { key: "catering", label: "Catering page", path: "/catering" },
  { key: "about", label: "About page", path: "/about" },
  { key: "contact", label: "Contact page", path: "/contact" },
  { key: "festivals", label: "Festivals page", path: "/festivals" },
  { key: "farmToTable", label: "Farm to Table page", path: "/farm-to-table" },
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
  bundles: Bundle[];
  recipes: Recipe[];
  blog: BlogPost[];
  hero: { home: HeroOverride };
  brandImages: BrandImages;
  colors: BrandColors;
  announcement: Announcement;
  testimonials: Testimonial[];
  faqs: Faqs;
  serviceTowns: string[];
  gallery: string[];
  events: EventItem[];
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
  bundles?: Bundle[];
  recipes?: Recipe[];
  blog?: BlogPost[];
  hero?: { home?: HeroOverride };
  brandImages?: Partial<BrandImages>;
  colors?: Partial<BrandColors>;
  announcement?: Announcement;
  testimonials?: Testimonial[];
  faqs?: Partial<Record<FaqPageKey, FaqItem[]>>;
  serviceTowns?: string[];
  gallery?: string[];
  events?: EventItem[];
  imageAlt?: Record<string, string>;
  seo?: Partial<Record<SeoPageKey, Partial<SeoEntry>>>;
}

/* ── Defaults — derived from the existing hardcoded content ──────── */

export const defaultHours: HoursRow[] = [
  { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 8:00 PM" },
  { day: "Sunday", hours: "By event booking" },
];

/** Default festival schedule — admin-editable via the `events` content. */
export const defaultEvents: EventItem[] = [
  {
    name: "Berlin Fair",
    date: "Sep 17–20, 2026",
    location: "Berlin Fairgrounds, Berlin, CT",
    time: "Thu–Sun · fair hours",
    url: "",
  },
  {
    name: "Durham Fair",
    date: "Sep 24–27, 2026",
    location: "Durham Fairgrounds, Durham, CT",
    time: "Thu–Sun · fair hours",
    url: "",
  },
];

export const defaultMenu: MenuSection[] = [
  /* ── Weddings ───────────────────────────────────────────────── */
  {
    group: "Weddings",
    title: "P&M Wedding Buffet",
    service: "Food Truck",
    blurb:
      "Our signature reception spread — chef-led and full-service, built to feed the room in style. Wood-fired smoked meats alongside a fresh taco bar, served by our crew.",
    items: [
      { name: "Two wood-fired smoked meats", desc: "", price: "$16", choose: "Choose two", options: ["Smoked brisket", "Pulled pork", "Smoked chicken al carbon", "St. Louis ribs"] },
      { name: "Build-your-own taco bar", desc: "", price: "$20", options: ["Birria tacos", "Carne asada tacos", "Fresh tortillas", "Salsa roja", "Tomatillo salsa verde", "Pico de gallo", "Cotija", "Pickled red onion"] },
      { name: "Three signature sides", desc: "", price: "$18", choose: "Choose three", options: ["Street corn esquites", "Cilantro-lime rice", "Pit beans", "Vinegar slaw"] },
      { name: "Full chef-led service", desc: "On-site cooking, setup, serving staff, and cleanup of our station.", price: "$8" },
    ],
  },
  {
    group: "Weddings",
    title: "The Back Yard Feast",
    service: "Food Truck",
    blurb:
      "A relaxed, abundant spread for backyard weddings and rehearsal dinners — all the flavor of the pit without the white-glove formality.",
    items: [
      { name: "Welcome snacks", desc: "", price: "$10", options: ["House tortilla chips", "Smoked salsa roja", "Charred tomatillo salsa", "Smoked queso blanco"] },
      { name: "From the pit", desc: "", price: "$16", choose: "Choose two", options: ["Oak smoked pulled pork", "Smoked chicken al carbon", "Jalapeño cheddar sausage", "Smoked turkey breast"] },
      { name: "Sides", desc: "", price: "$18", choose: "Choose three", options: ["Street corn esquites", "Pit beans", "Cilantro-lime rice", "Vinegar slaw", "Masa fries", "Smoked mac & cheese"] },
      { name: "Dessert", desc: "", price: "$6", choose: "Choose one", options: ["Churro bites", "Mexican chocolate brownies", "Cinnamon sugar sopapillas"] },
    ],
  },
  {
    group: "Weddings",
    title: "The Pitmaster's Wedding",
    service: "Pit Trailer",
    blurb:
      "A low-and-slow reception straight off the smoker. Whole cuts cooked on-site through the night, then carved tableside by our pitmaster — bark set, smoke ring deep.",
    items: [
      { name: "Smoked centerpieces", desc: "", price: "$22", choose: "Choose two", options: ["Oak-smoked prime brisket", "St. Louis spare ribs", "Pulled pork shoulder", "Smoked half chicken al carbon"] },
      { name: "Live carving station", desc: "Our pitmaster slicing to order, with house BBQ sauce, Carolina vinegar, and salsa macha on the side.", price: "$12" },
      { name: "Sides", desc: "", price: "$18", choose: "Choose three", options: ["Smoked mac & cheese", "Pit beans with burnt ends", "Street corn esquites", "Cilantro-lime rice", "Vinegar slaw", "Honey-butter cornbread"] },
      { name: "Dessert", desc: "", price: "$6", choose: "Choose one", options: ["Churro bites", "Mexican chocolate brownies", "Peach cobbler with cinnamon crema"] },
    ],
  },
  {
    group: "Weddings",
    title: "Oak & Embers Reception",
    service: "Pit Trailer",
    blurb:
      "An elevated smokehouse for the couple who wants BBQ done formal — coastal-meets-Texas passed bites, premium smoked proteins, and seasonal Connecticut sides.",
    items: [
      { name: "Cocktail hour from the pit", desc: "", price: "$12", choose: "Choose three", options: ["Brisket burnt-end skewers — pineapple-chipotle glaze", "Smoked pork belly bites", "Bacon-wrapped jalapeño poppers", "Pulled pork sliders — vinegar slaw"] },
      { name: "Premium proteins", desc: "", price: "$22", choose: "Choose two", options: ["Smoked prime brisket", "Smoked beef short rib", "Maple-chipotle pork", "Citrus-herb smoked chicken"] },
      { name: "Sides", desc: "", price: "$18", choose: "Choose three", options: ["Smoked mac & cheese", "Pit beans", "Roasted seasonal vegetables", "Honey-butter cornbread", "Street corn"] },
      { name: "Dessert", desc: "", price: "$6", choose: "Choose one", options: ["Apple crisp with cinnamon crema", "Churro bites"] },
    ],
  },

  /* ── Corporate & Private Parties ────────────────────────────── */
  {
    group: "Corporate & Private Parties",
    title: "P&M Taco Fiesta",
    service: "Food Truck",
    blurb:
      "Our most popular party package — a build-your-own taco bar that covers every preference in the room.",
    items: [
      { name: "Meats", desc: "", price: "$24", choose: "Choose three", options: ["Smoked brisket", "Pulled pork", "Chicken tinga", "Carne asada", "Al pastor", "Smoked turkey"] },
      { name: "Toppings", desc: "", price: "$6", options: ["Pickled red onion", "Cilantro", "Cotija", "Lettuce", "Pico de gallo", "Jalapeños", "Crema"] },
      { name: "Sides", desc: "", price: "$10", options: ["Street corn", "Rice", "Pit beans"] },
      { name: "Dessert", desc: "", price: "$6", options: ["Churro bites"] },
    ],
  },
  {
    group: "Corporate & Private Parties",
    title: "Texas meets Mexico",
    service: "Food Truck",
    blurb:
      "The best of both pits — Texas-style smoked BBQ alongside a Mexican taco spread. The hybrid that wins every crowd.",
    items: [
      { name: "Appetizers", desc: "", price: "$10", options: ["Smoked queso", "House guacamole", "Fresh chips"] },
      { name: "Carving station", desc: "", price: "$22", choose: "Choose two", options: ["Brisket", "Picanha", "Pork shoulder", "Turkey breast"] },
      { name: "Accompaniments", desc: "", price: "$6", options: ["Fresh tortillas", "Pickled onions", "Cotija cheese", "Cilantro", "Salsa verde", "Salsa roja", "House BBQ sauce"] },
      { name: "Sides", desc: "", price: "$10", options: ["Street corn", "Pit beans", "Cilantro rice", "Slaw"] },
      { name: "Dessert", desc: "", price: "$6", options: ["Mexican chocolate cake"] },
    ],
  },
  {
    group: "Corporate & Private Parties",
    title: "New England Smokehouse",
    service: "Food Truck",
    blurb:
      "A menu built specifically for Connecticut weddings — coastal cocktail bites, prime smoked proteins, and seasonal sides for an elevated reception.",
    items: [
      { name: "Cocktail hour", desc: "", price: "$16", options: ["Lobster street corn cups", "Smoked brisket crostini", "Pork belly bites"] },
      { name: "Dinner proteins", desc: "", price: "$22", options: ["Smoked prime brisket", "Maple chipotle pork", "Citrus herb chicken"] },
      { name: "Sides", desc: "", price: "$10", options: ["Street corn", "Pit beans", "Smoked mac & cheese", "Roasted seasonal vegetables"] },
      { name: "Dessert", desc: "", price: "$6", options: ["Apple crisp with cinnamon crema", "Churro bites"] },
    ],
  },
  {
    group: "Corporate & Private Parties",
    title: "The Backyard Pit Party",
    service: "Pit Trailer",
    blurb:
      "Our classic smokehouse spread — heaping platters of wood-fired meat, all the sides, and zero fuss. Built to feed a hungry crowd backyard-style.",
    items: [
      { name: "From the smoker", desc: "", price: "$16", choose: "Choose two", options: ["Oak-smoked brisket", "Pulled pork", "St. Louis ribs", "Smoked chicken", "Jalapeño-cheddar sausage"] },
      { name: "Sides", desc: "", price: "$18", choose: "Choose three", options: ["Pit beans", "Smoked mac & cheese", "Vinegar slaw", "Street corn", "Potato salad", "Honey-butter cornbread"] },
      { name: "On the table", desc: "", price: "$6", options: ["House BBQ sauce", "Carolina vinegar sauce", "Salsa macha", "Pickles & onions", "Soft rolls"] },
      { name: "Dessert", desc: "", price: "$6", choose: "Choose one", options: ["Churro bites", "Peach cobbler"] },
    ],
  },
  {
    group: "Corporate & Private Parties",
    title: "Low & Slow Smokehouse",
    service: "Pit Trailer",
    blurb:
      "A Texas-style BBQ feast for offices, fundraisers, and big private parties — meat smoked by the pound off the pit and sliced to order at a live carving station.",
    items: [
      { name: "By-the-pound carving station", desc: "", price: "$24", choose: "Choose three", options: ["Oak-smoked brisket", "Pulled pork", "St. Louis ribs", "Smoked turkey breast", "Jalapeño-cheddar sausage", "Smoked chicken"] },
      { name: "Sides", desc: "", price: "$18", choose: "Choose three", options: ["Pit beans with burnt ends", "Smoked mac & cheese", "Street corn esquites", "Cilantro-lime rice", "Vinegar slaw", "Cornbread"] },
      { name: "Fixings", desc: "", price: "$6", options: ["House BBQ sauce", "Carolina vinegar", "Salsa macha", "Pickles", "Pickled red onion", "Texas toast"] },
      { name: "Dessert", desc: "", price: "$6", options: ["Churro bites", "Mexican chocolate brownies"] },
    ],
  },

  /* ── Brunch & Daytime ───────────────────────────────────────── */
  {
    group: "Brunch & Daytime",
    title: "P&M Brunch",
    service: "Food Truck",
    blurb:
      "A brunch buffet that bridges breakfast and lunch — smoked breakfast tacos, pulled pork sliders, and house drinks for showers, morning weddings, and daytime gatherings.",
    items: [
      { name: "Breakfast", desc: "", price: "$14", options: ["Breakfast burritos", "Chorizo breakfast tacos", "Smoked breakfast potatoes", "Scrambled eggs"] },
      { name: "Lunch", desc: "", price: "$10", options: ["Pulled pork sliders", "Smoked chicken tacos"] },
      { name: "Sides", desc: "", price: "$8", options: ["Fresh fruit", "Street corn salad"] },
      { name: "Drinks", desc: "", price: "$8", options: ["Horchata", "Hibiscus tea", "Cold brew coffee"] },
    ],
  },
  {
    group: "Brunch & Daytime",
    title: "Smokehouse Brunch",
    service: "Pit Trailer",
    blurb:
      "Brunch with a smoke ring. Brisket hash and smoked breakfast plates off the pit for morning weddings, showers, and daytime gatherings.",
    items: [
      { name: "From the pit", desc: "", price: "$16", options: ["Smoked brisket breakfast hash", "Brisket & egg breakfast tacos", "Pulled pork sliders"] },
      { name: "Griddle", desc: "", price: "$12", options: ["Chorizo breakfast tacos", "Smoked breakfast potatoes", "Scrambled eggs"] },
      { name: "Sides", desc: "", price: "$8", options: ["Fresh fruit", "Honey-butter cornbread", "Street corn salad"] },
      { name: "Drinks", desc: "", price: "$8", options: ["Horchata", "Hibiscus tea", "Cold brew coffee"] },
    ],
  },

  /* ── Add-On Stations ────────────────────────────────────────── */
  {
    group: "Add-On Stations",
    title: "Premium Live Stations",
    service: "Food Truck",
    blurb:
      "Chef-attended stations built to order in front of your guests. Add one or stack several to make the event yours.",
    items: [
      { name: "Live taco station", desc: "A chef pressing tortillas and building tacos to order, right in front of your guests.", price: "$16", options: ["Carne asada tacos", "Chicken tinga", "Al pastor tacos", "Fresh tortillas", "Pico de gallo", "Cotija", "Pickled red onion"] },
      { name: "Live street corn cart", desc: "Grilled elote and esquites cups dressed with crema, cotija, chili, and lime.", price: "$8", options: ["Street corn esquites", "Mini street corn cup"] },
      { name: "Brisket carving station", desc: "A chef carving fresh-sliced brisket and picanha to order.", price: "$16", options: ["Smoked brisket", "Picanha", "Fresh tortillas", "House BBQ sauce"] },
      { name: "Late night taco bar", desc: "A second-wind taco station to keep the party fed into the night — perfect for weddings.", price: "$14", options: ["Carne asada tacos", "Chicken tinga", "Fresh tortillas", "Pico de gallo", "Cotija"] },
      { name: "Mobile Cantina", desc: "Our bar-on-wheels serving margaritas, ranch water, palomas, and hibiscus margaritas.", price: "$16", options: ["Margaritas", "Ranch water", "Palomas", "Hibiscus margaritas"] },
    ],
  },
  {
    group: "Add-On Stations",
    title: "Cocktail Hour",
    service: "Food Truck",
    blurb:
      "Welcome guests with passed bites, grazing boards, and a chips-and-dips display before the main spread.",
    items: [
      { name: "Passed hors d'oeuvres", desc: "", price: "$16", choose: "Choose four", options: ["Smoked brisket tostada — charred salsa roja, cotija", "Pork belly burnt-end skewer — pineapple-chipotle glaze", "Chicken tinga flauta — avocado crema", "Mini street corn cup — lime, cotija, chili", "Smoked shrimp taco bite — cabbage slaw, chipotle aioli", "Birria quesadilla bite — consommé shooter", "Bacon-wrapped jalapeño — smoked cheddar", "Mini smoked chicken taco — pico de gallo"] },
      { name: "Smokehouse board", desc: "", price: "$12", options: ["Smoked sausage", "Smoked turkey", "House pickles", "Roasted peppers", "Cotija", "Artisan crackers", "Smoked nuts", "Fresh fruit"] },
      { name: "Chips & dips display", desc: "", price: "$10", options: ["House guacamole", "Smoked queso", "Salsa roja", "Salsa verde", "Pico de gallo", "Warm tortilla chips"] },
      { name: "Grazing tables", desc: "An abundant grazing spread of meats, cheeses, dips, and seasonal bites.", price: "$14", options: ["Smoked sausage", "Smoked turkey", "Cotija", "House pickles", "Smoked nuts", "Artisan crackers", "Fresh fruit"] },
    ],
  },
  {
    group: "Add-On Stations",
    title: "Pit Trailer Stations",
    service: "Pit Trailer",
    blurb:
      "Bolt-on smoker stations to round out any event. Add one or stack a few — all worked live off the pit by our crew.",
    items: [
      { name: "Brisket carving station", desc: "A pitmaster slicing oak-smoked brisket and beef short rib to order.", price: "$18", options: ["Smoked brisket", "Smoked beef short rib", "House BBQ sauce", "Texas toast"] },
      { name: "Burnt-ends bar", desc: "Caramelized brisket burnt ends tossed in house BBQ glaze, served by the cup.", price: "$12", options: ["Brisket burnt-end skewers", "House BBQ sauce"] },
      { name: "Rib & sausage smoke board", desc: "St. Louis ribs, jalapeño-cheddar sausage, and smoked pickles carved family-style.", price: "$16", options: ["St. Louis ribs", "Jalapeño-cheddar sausage", "House pickles"] },
      { name: "Loaded smoked-potato bar", desc: "Smoked baked potatoes piled with brisket, burnt ends, cheese, and all the fixings.", price: "$12", options: ["Smoked breakfast potatoes", "Smoked brisket", "Brisket burnt-end skewers", "Cotija"] },
      { name: "Late-night smoke snacks", desc: "Pulled pork sliders and brisket nachos to keep the party going into the night.", price: "$12", options: ["Pulled pork sliders", "Smoked brisket tostada"] },
    ],
  },
];

export const defaultBundles: Bundle[] = [
  {
    name: "The Full Spread",
    blurb:
      "Our complete experience — the Pit Trailer and Food Truck side by side for a feast that covers smoked BBQ and a live taco bar in one booking.",
    vehicles: ["trailer", "truck"],
    highlights: [
      "Smoked meat carving station",
      "Build-your-own taco bar",
      "Sides, salsas & fresh fixings",
      "Two crews, fully staffed",
    ],
  },
  {
    name: "Cocktail Hour + Feast",
    blurb:
      "Welcome guests with drinks from the Cocktail Cart, then roll into a full Pit Trailer dinner. One coordinated team, start to finish. (Cocktail Cart launching soon.)",
    vehicles: ["cocktail-cart", "trailer"],
    highlights: [
      "Signature cocktail hour",
      "Wood-fired BBQ dinner",
      "Seamless cocktails-to-dinner flow",
      "Perfect for weddings",
    ],
  },
  {
    name: "Truck & Cart Combo",
    blurb:
      "Tacos and drinks, all night. The Food Truck paired with the Cocktail Cart for a party that runs itself. (Cocktail Cart launching soon.)",
    vehicles: ["truck", "cocktail-cart"],
    highlights: [
      "Live taco bar",
      "Signature drinks & aguas frescas",
      "Late-night taco option",
      "Great for parties & corporate",
    ],
  },
];

export const defaultHeroHome: Required<HeroOverride> = {
  title: "Wood-Fired BBQ.\nLoaded Tacos.",
  subtitle:
    "From backyard parties to big celebrations, Pit & Masa brings smoked brisket, birria tacos, and a full taco bar straight to your event — anywhere in Connecticut. We also do holiday meal packs and weekly meal prep.",
};

export const defaultBrandImages: BrandImages = {
  logo: "/images/pit-masa-badge.webp",
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
  primary: "#FF8C00",
  primaryHover: "#E67E00",
  primaryLight: "#FFA733",
  secondary: "#008080",
  dark: "#1C1C1C",
  cream: "#FEFCF5",
  card: "#FFFCF7",
  sand: "#DEDEDE",
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

export const defaultTestimonials: Testimonial[] = [
  {
    author: "Marisa T.",
    role: "Backyard birthday \u00b7 West Hartford",
    body: "Pit & Masa catered our backyard party and the birria tacos were unreal. The smoked brisket disappeared in minutes \u2014 everyone asked who we hired.",
  },
  {
    author: "Devon R.",
    role: "Holiday gathering \u00b7 Glastonbury",
    body: "Booked them for a holiday gathering. The taco bar was a huge hit and the meal packs we ordered for leftovers were just as good the next day.",
  },
  {
    author: "Carlos M.",
    role: "Corporate event \u00b7 Stamford",
    body: "Hired Pit & Masa for a 75-person work event. Showed up on time, food was hot and incredible, and cleanup was effortless. First call for our next one.",
  },
];

export const defaultFaqs: Faqs = {
  home: [
    {
      question: "How far in advance should I book?",
      answer:
        "For weekends and holidays we recommend reaching out 3\u20134 weeks ahead, since prime dates fill fast. That said, we'll always try to make a last-minute event work \u2014 ask and we'll tell you straight.",
    },
    {
      question: "How many guests can you cater?",
      answer:
        "Anywhere from an intimate dinner of 15 to celebrations of 200+. We scale the menu, the equipment, and the crew to match your headcount so the food never runs short or sits too long.",
    },
    {
      question: "Can you handle dietary needs and vegetarians?",
      answer:
        "Absolutely. Vegetarian tacos, gluten-friendly options, and allergy accommodations are all on the table. Tell us what your guests need and we'll build it into the menu.",
    },
    {
      question: "What's included in a catering booking?",
      answer:
        "A custom menu, on-site cooking, all serving equipment and setup, chef-led service, and cleanup of our station. You bring the guests \u2014 we bring everything else.",
    },
    {
      question: "Do you travel across all of Connecticut?",
      answer:
        "Yes. We're fully mobile and serve all 8 CT counties \u2014 from Fairfield to Windham. If you're in Connecticut, we'll bring the smoke to you.",
    },
  ],
  about: [
    {
      question: "What makes Pit & Masa different from other caterers?",
      answer:
        "We cook everything over real wood and make our masa, salsas, and rubs from scratch \u2014 then we show up and host the meal, not just drop off a tray. It's the difference between catering and an experience.",
    },
    {
      question: "Who actually cooks the food at my event?",
      answer:
        "Ryan \"Buck\" Buchanan leads every cook personally, with a hands-on crew alongside him. The person who dialed in your brisket is the same person serving it.",
    },
    {
      question: "Where is Pit & Masa based?",
      answer:
        "We're a Connecticut-based mobile catering company serving all 8 counties. There's no storefront \u2014 we bring the whole operation to you.",
    },
  ],
  farmToTable: [
    {
      question: "Do you really source from local farms?",
      answer:
        "Yes \u2014 whenever the Connecticut growing season allows, we buy meat, produce, and masa ingredients from farms across the state. Some specialty items still come from trusted suppliers, but local sourcing is always our first choice.",
    },
    {
      question: "Does local sourcing cost more?",
      answer:
        "Buying from small farms can cost a little more than mass-distribution, but it means fresher, higher-quality food. We build it into our menus so you get the best flavor without surprises on your quote.",
    },
    {
      question: "What happens in the off-season?",
      answer:
        "Connecticut winters limit what's growing, so we lean on storage crops, preserved goods, and the closest regional sources we can find. We're transparent about what's local and what isn't on any given menu.",
    },
    {
      question: "Can you build a seasonal menu for my event?",
      answer:
        "Absolutely. Tell us your date and we'll plan around what's at its peak \u2014 8 counties of Connecticut farmland give us a lot to work with through the warmer months.",
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
    title: "Pit & Masa | Mobile Smoke & Taco Catering in Connecticut",
    description:
      "Pit & Masa is a Connecticut mobile BBQ & taco catering company — wood-fired smoked brisket, birria tacos, build-your-own taco bars, holiday meal packs, and weekly meal prep for parties, weddings, and corporate events.",
  },
  menu: {
    title: "Catering Packages — Weddings, Parties & Corporate",
    description:
      "Explore Pit & Masa catering packages built for your event — wedding buffets, taco fiestas, smokehouse feasts, and brunch — plus add-on live stations like taco bars, street corn, meat carving, and a mobile cantina across Connecticut.",
  },
  catering: {
    title: "BBQ & Taco Catering in Connecticut",
    description:
      "Pit & Masa is a mobile BBQ and taco catering company serving all of Connecticut. We bring wood-fired smoked brisket, birria tacos, and full taco bars to weddings, parties, and corporate events.",
  },
  about: {
    title: "About Pit & Masa — CT Mobile BBQ & Taco Catering",
    description:
      'Meet Pit & Masa, a Connecticut mobile BBQ & taco catering company led by owner & pitmaster Ryan "Buck" Buchanan — bringing wood-fired smoke, fresh masa, and chef-prepared meals to events across CT.',
  },
  contact: {
    title: "Contact Pit & Masa",
    description:
      "Contact Pit & Masa to request a catering proposal, schedule a tasting, or ask about event menu options.",
  },
  festivals: {
    title: "Festival Menu — Tacos, Masa & BBQ",
    description:
      "Catch Pit & Masa at festivals across Connecticut — smoked pork tacos, achiote chicken, crispy pork belly, the chile beef torta, pit burrito, pit burger, masa fries, esquites, and fresh aguas frescas. Smoke. Masa. Repeat.",
  },
  farmToTable: {
    title: "Farm to Table — Locally Sourced Ingredients",
    description:
      "Pit & Masa partners with Connecticut farms to source meat, produce, and masa ingredients close to home. Discover how local, seasonal sourcing shapes every plate we serve.",
  },
};

export const defaultSeo: Seo = {
  home: { title: "", description: "" },
  menu: { title: "", description: "" },
  catering: { title: "", description: "" },
  about: { title: "", description: "" },
  contact: { title: "", description: "" },
  festivals: { title: "", description: "" },
  farmToTable: { title: "", description: "" },
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
      linkedin: o.socials?.linkedin ?? siteConfig.socials.linkedin,
      youtube: o.socials?.youtube ?? siteConfig.socials.youtube,
      tiktok: o.socials?.tiktok ?? siteConfig.socials.tiktok,
    },
    hours: o.hours && o.hours.length > 0 ? o.hours : defaultHours,
    menu: o.menu && o.menu.length > 0 ? o.menu : defaultMenu,
    bundles: o.bundles && o.bundles.length > 0 ? o.bundles : defaultBundles,
    recipes: o.recipes && o.recipes.length > 0 ? o.recipes : defaultRecipes,
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
    events: o.events ?? defaultEvents,
    imageAlt: o.imageAlt ?? {},
    seo: mergeSeo(o.seo),
  };
}
