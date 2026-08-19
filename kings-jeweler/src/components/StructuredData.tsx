import { siteConfig } from "@/lib/constants";
import { getSiteContent } from "@/lib/admin/schema";

const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function to24h(time: string): string | null {
  const m = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  const h = (Number(m[1]) % 12) + (/pm/i.test(m[3]) ? 12 : 0);
  return `${String(h).padStart(2, "0")}:${m[2] ?? "00"}`;
}

// Freeform admin hours row ("Monday – Friday", "11:00 AM – 7:00 PM") →
// OpeningHoursSpecification; unparseable rows (e.g. "Closed") are skipped.
function parseHoursRow(row: { day: string; hours: string }) {
  const names = row.day
    .match(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/gi)
    ?.map((d) => d[0].toUpperCase() + d.slice(1).toLowerCase());
  if (!names || names.length === 0) return null;
  let dayOfWeek = names;
  if (names.length === 2) {
    const [a, b] = [WEEK.indexOf(names[0]), WEEK.indexOf(names[1])];
    if (a !== -1 && b !== -1 && a < b) dayOfWeek = WEEK.slice(a, b + 1);
  }
  const [opens, closes] = row.hours.split(/[–—-]/).map(to24h);
  if (!opens || !closes) return null;
  return { "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes };
}

/** Social profile URLs only — the GMB map link belongs in hasMap, not sameAs. */
function socialProfiles(socials: object) {
  return Object.entries(socials)
    .filter(([key, url]) => key !== "gmb" && url)
    .map(([, url]) => url);
}

export async function LocalBusinessSchema() {
  const { contact, socials, hours } = await getSiteContent();
  const schema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: contact.phone,
    email: contact.email,
    foundingDate: siteConfig.foundingDate,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.zip,
      addressCountry: "US",
    },
    hasMap: socials.gmb,
    sameAs: socialProfiles(socials),
    image: [
      `${siteConfig.url}/og-image.jpg`,
      `${siteConfig.url}/images/jewelry/kings-13.webp`,
    ],
    // TODO: verify against the Google Business Profile pin before launch.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.8046,
      longitude: -72.5533,
    },
    openingHoursSpecification: hours.map(parseHoursRow).filter(Boolean),
    areaServed: {
      "@type": "State",
      name: siteConfig.serviceArea,
    },
    priceRange: "$$",
    founder: {
      "@type": "Person",
      name: siteConfig.owner.name,
      jobTitle: siteConfig.owner.title,
    },
    knowsAbout: [
      "Fine Jewelry",
      "Engagement Rings",
      "Wedding Bands",
      "Custom Jewelry Design",
      "Jewelry Repair",
      "Ring Sizing",
      "Watch Repair",
      "Watch Batteries",
      "Gold Buying",
      "Jewelry Appraisals",
      "Diamonds",
      "Gemstones",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Jewelry Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Engagement Rings & Fine Jewelry",
          description: "Diamond engagement rings, wedding bands, and fine jewelry in gold, silver, and platinum.",
        },
        {
          "@type": "OfferCatalog",
          name: "Jewelry & Watch Repair",
          description: "Ring sizing, chain soldering, stone setting, watch repair, and same-day watch batteries.",
        },
        {
          "@type": "OfferCatalog",
          name: "Gold Buying & Appraisals",
          description: "Fair offers on gold, silver, and diamonds, plus written appraisals for insurance and estates.",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export async function OrganizationSchema() {
  const { contact, socials } = await getSiteContent();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/kings-jeweler-badge.png`,
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    founder: {
      "@type": "Person",
      name: siteConfig.owner.name,
      jobTitle: siteConfig.owner.title,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contact.phone,
      contactType: "customer service",
      email: contact.email,
      areaServed: "US",
      availableLanguage: ["English"],
    },
    sameAs: socialProfiles(socials),
    knowsAbout: [
      "Fine Jewelry",
      "Engagement Rings",
      "Custom Jewelry Design",
      "Jewelry Repair",
      "Watch Repair",
      "Watch Batteries",
      "Gold Buying",
      "Jewelry Appraisals",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({
  name,
  description,
  priceRange,
}: {
  name: string;
  description: string;
  priceRange?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "JewelryStore",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "State",
      name: siteConfig.serviceArea,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        description: priceRange ?? "Contact for pricing",
      },
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ReviewSchema({
  reviews,
}: {
  reviews: { author: string; body: string; rating: number }[];
}) {
  /* Emit reviews as an ItemList to avoid a second competing LocalBusiness
     entity alongside the global LocalBusinessSchema in the layout. */
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} Client Reviews`,
    itemListElement: reviews.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewBody: r.body,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: "5",
        },
        itemReviewed: {
          "@type": "LocalBusiness",
          name: siteConfig.name,
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  publishedAt,
  modifiedAt,
  author,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  modifiedAt?: string;
  author: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: `${siteConfig.url}${image}`,
    url: `${siteConfig.url}${url}`,
    datePublished: publishedAt,
    dateModified: modifiedAt ?? publishedAt,
    abstract: description,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable='headline']", "[data-speakable='summary']"],
    },
    author: {
      "@type": "Person",
      name: author,
      url: `${siteConfig.url}/about`,
      jobTitle: siteConfig.owner.title,
      worksFor: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/kings-jeweler-badge.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebApplicationSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${siteConfig.url}${url}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function DigitalDocumentSchema({
  name,
  description,
  url,
  datePublished,
}: {
  name: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name,
    description,
    url: `${siteConfig.url}${url}`,
    datePublished,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    hasDigitalDocumentPermission: {
      "@type": "DigitalDocumentPermission",
      permissionType: "https://schema.org/ReadPermission",
    },
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PersonSchema({
  name,
  jobTitle,
  description,
  image,
  sameAs,
  knowsAbout,
}: {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    url: `${siteConfig.url}/about`,
    image: image ? `${siteConfig.url}${image}` : undefined,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    sameAs: sameAs ?? Object.values(siteConfig.socials),
    knowsAbout: knowsAbout ?? [
      "Engagement Rings",
      "Custom Jewelry Design",
      "Jewelry Repair",
      "Watch Repair",
      "Watch Batteries",
      "Gold Buying",
      "Diamonds",
      "Fine Jewelry",
      "Jewelry Appraisals",
      "Ring Resizing",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function VideoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  duration,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  duration?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `${siteConfig.url}${thumbnailUrl}`,
    uploadDate,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/kings-jeweler-badge.png`,
      },
    },
  };

  if (contentUrl) schema.contentUrl = contentUrl;
  if (duration) schema.duration = duration;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CaseStudySchema({
  title,
  description,
  url,
  image,
  publishedAt,
  author,
  relatedServices,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  author: string;
  relatedServices?: { name: string; url: string }[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: `${siteConfig.url}${image}`,
    url: `${siteConfig.url}${url}`,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Organization",
      name: author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/kings-jeweler-badge.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${url}`,
    },
  };

  if (relatedServices && relatedServices.length > 0) {
    schema.relatedLink = relatedServices.map(
      (s) => `${siteConfig.url}${s.url}`
    );
    schema.about = relatedServices.map((s) => ({
      "@type": "Service",
      name: s.name,
      url: `${siteConfig.url}${s.url}`,
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  if (totalTime) schema.totalTime = totalTime;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
