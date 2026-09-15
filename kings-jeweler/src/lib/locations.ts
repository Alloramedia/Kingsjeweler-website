/* ------------------------------------------------------------------ */
/*  Local-SEO landing pages — "Jeweler near {Town}, CT".               */
/*  Rendered by src/app/locations/[slug]/page.tsx.                     */
/*  The store is IN Manchester (Buckland Hills); every page is honest  */
/*  "near you" copy with real routes, drive times, and local anchors.  */
/* ------------------------------------------------------------------ */

export interface TownFAQ {
  question: string;
  answer: string;
}

export interface TownPage {
  slug: string;
  town: string;
  county: "Hartford County" | "Tolland County";
  /** e.g. "about 10 minutes" */
  driveTime: string;
  /** Plain-language route from the town to Buckland Hills. */
  route: string;
  /** Two unique intro paragraphs. */
  intro: [string, string];
  /** One hand-written town-specific FAQ (two more are generated). */
  faq: TownFAQ;
  heroImage: string;
}

export const COUNTIES = ["Hartford County", "Tolland County"] as const;

export const townPages: TownPage[] = [
  {
    slug: "south-windsor",
    town: "South Windsor",
    county: "Hartford County",
    driveTime: "about 10 minutes",
    route: "Buckland Road (Route 30) south past Evergreen Walk — the mall is just over the town line",
    intro: [
      "If you shop at Evergreen Walk, you're already halfway to us. King's Jeweler sits inside The Shoppes at Buckland Hills, just across the South Windsor line — for most of town it's a shorter trip than driving to Hartford, with free mall parking when you arrive.",
      "South Windsor families come to us for the everyday jewelry needs that big-box stores don't handle well: watch batteries changed while you wait, ring sizing, chain repairs, and honest gold buying. When it's something bigger — an engagement ring or a custom piece — you'll sit with the same jeweler from first sketch to final polish.",
    ],
    faq: {
      question: "Is King's Jeweler closer to South Windsor than the Hartford jewelry stores?",
      answer:
        "For most of South Windsor, yes. The Shoppes at Buckland Hills is directly off Buckland Road at the Manchester line — usually a 10-minute drive — while downtown Hartford means highway traffic and paid parking. Many of our regulars are South Windsor customers who discovered us while shopping at the mall.",
    },
    heroImage: "/images/jewelry/kings-12.webp",
  },
  {
    slug: "vernon",
    town: "Vernon",
    county: "Tolland County",
    driveTime: "about 10 minutes",
    route: "I-84 West to Exit 62, then Buckland Street straight to the mall",
    intro: [
      "From Rockville to the Route 83 corridor, Vernon is one straight shot down I-84 from King's Jeweler — Exit 62 drops you practically at the mall entrance. That makes us the closest full-service jeweler for most of Vernon, without a trip into Hartford.",
      "We handle the work Vernon customers used to scatter across three different shops: watch batteries and band sizing while you wait, jewelry repair with the work done properly, appraisals, and same-day cash offers on gold. And when the occasion calls for it, our engagement ring and custom design cases are stocked deep.",
    ],
    faq: {
      question: "Do Vernon customers need an appointment for watch batteries or repairs?",
      answer:
        "No appointment, ever. Take Exit 62 off I-84, walk in any day of the week, and most watch batteries are done while you wait. Repairs get a same-day assessment and an honest timeline before you leave the piece with us.",
    },
    heroImage: "/images/jewelry/kings-58.webp",
  },
  {
    slug: "east-hartford",
    town: "East Hartford",
    county: "Hartford County",
    driveTime: "about 12 minutes",
    route: "I-84 East to Exit 62, or Route 44 through Manchester center",
    intro: [
      "King's Jeweler is an easy hop up I-84 from East Hartford — closer for most of town than crossing the river into Hartford, and with none of the downtown parking hassle. We're inside The Shoppes at Buckland Hills, steps from the food court entrance.",
      "East Hartford customers lean on us for repairs and gold buying most of all: broken chains, loose stones, rings that no longer fit, and drawers of old gold that turn into same-day cash. Everything is evaluated by a jeweler in the store — nothing is shipped out to a third party.",
    ],
    faq: {
      question: "Where can I sell gold near East Hartford without getting lowballed?",
      answer:
        "Drive the 12 minutes to King's Jeweler at Buckland Hills. As a retail jeweler we typically pay 70–90% of melt value — meaningfully more than pawn shops — and we'll walk you through the weight, karat, and day's gold price so you understand exactly how we reached your offer.",
    },
    heroImage: "/images/jewelry/kings-29.webp",
  },
  {
    slug: "glastonbury",
    town: "Glastonbury",
    county: "Hartford County",
    driveTime: "about 15 minutes",
    route: "Route 2 to I-84 East, or Hebron Avenue up through Manchester",
    intro: [
      "Glastonbury has no shortage of fine taste — what it doesn't have is a full-service jeweler with a bench. King's Jeweler is fifteen minutes up the road at The Shoppes at Buckland Hills, where repairs, sizing, and custom work are handled by the jeweler you actually talk to.",
      "Glastonbury customers tend to find us for the important pieces: engagement rings compared side-by-side without pressure, heirloom restorations, and insurance appraisals done with proper documentation. Once they've made the trip once, the watch batteries and cleanings follow.",
    ],
    faq: {
      question: "Is it worth driving from Glastonbury for a jewelry appraisal?",
      answer:
        "Yes — appraisals are one of the most common reasons Glastonbury customers make the trip. You get a written, insurer-ready appraisal from an experienced jeweler, usually with a faster turnaround than mail-away services, and you never let the piece out of your sight for weeks.",
    },
    heroImage: "/images/jewelry/kings-20.webp",
  },
  {
    slug: "hartford",
    town: "Hartford",
    county: "Hartford County",
    driveTime: "about 15 minutes",
    route: "I-84 East to Exit 62 — against traffic most of the day",
    intro: [
      "Fifteen minutes east on I-84 — against the commuter traffic — gets you from downtown Hartford to King's Jeweler at The Shoppes at Buckland Hills, with free parking at the door instead of a garage ramp. For a lot of Hartford, we're the most convenient serious jeweler around.",
      "We're a family-run store, not a chain counter: gold chains and Cuban links stocked deep, engagement rings at honest prices, repairs done on site, and same-day cash when you're selling gold. Come compare us to what you've been quoted downtown.",
    ],
    faq: {
      question: "Why do Hartford customers shop for gold chains at King's Jeweler?",
      answer:
        "Selection and straight talk. Our cases carry rope, Cuban, and Figaro chains in a full range of weights and karats, priced by what the gold is actually worth. It's a 15-minute drive from downtown Hartford with free parking — and you can have a chain sized or repaired at the same counter.",
    },
    heroImage: "/images/jewelry/kings-28.webp",
  },
  {
    slug: "west-hartford",
    town: "West Hartford",
    county: "Hartford County",
    driveTime: "about 20 minutes",
    route: "I-84 East straight through to Exit 62",
    intro: [
      "West Hartford Center has plenty of places to browse — but when the job calls for a jeweler's bench, many West Hartford customers head twenty minutes east on I-84 to King's Jeweler at Buckland Hills, where the person quoting your repair is the person doing it.",
      "That matters most for the sensitive work: resetting a stone from grandmother's ring, resizing a band without thinning it, or designing a custom piece around diamonds you already own. It's the kind of work that rewards talking to the jeweler directly, and that's the only way we operate.",
    ],
    faq: {
      question: "Does King's Jeweler do custom work for West Hartford clients?",
      answer:
        "All the time. Bring an inspiration photo, an heirloom to redesign, or just an idea — we'll sketch it together, quote it honestly, and build it. Start with the Design Your Own tool on this site or stop in; the I-84 drive from West Hartford runs about 20 minutes.",
    },
    heroImage: "/images/jewelry/kings-24.webp",
  },
  {
    slug: "bolton",
    town: "Bolton",
    county: "Tolland County",
    driveTime: "about 12 minutes",
    route: "I-384 West through Bolton Notch, then Spencer Street to Buckland",
    intro: [
      "From Bolton Notch it's one road, no lights: I-384 west drops you into Manchester and Buckland Hills in about twelve minutes. King's Jeweler has been the closest real jeweler for Bolton for a generation.",
      "Small-town customers get the same treatment as everyone else — which at King's means the owner-level attention of a family store. Watch batteries while you shop, honest repair quotes, and a gold-buying counter where the math is explained, not hidden.",
    ],
    faq: {
      question: "What's the closest jewelry repair shop to Bolton, CT?",
      answer:
        "King's Jeweler at The Shoppes at Buckland Hills in Manchester — roughly 12 minutes from Bolton Notch via I-384. Chain solders, stone tightening, resizing, and watch batteries are all handled in the store, most with same-week turnaround.",
    },
    heroImage: "/images/jewelry/kings-19.webp",
  },
  {
    slug: "ellington",
    town: "Ellington",
    county: "Tolland County",
    driveTime: "about 18 minutes",
    route: "Route 83 South through Vernon, then I-84 to Exit 62",
    intro: [
      "Route 83 runs straight from Ellington's farm country to Buckland Hills — about eighteen minutes door to door. For Ellington, King's Jeweler is the nearest place where an actual jeweler, not a sales associate, looks at your piece.",
      "We see a lot of inherited and estate jewelry from Ellington households: pieces that need appraising, restoring, or converting into something worn instead of stored. We'll tell you honestly which it should be — including when a piece is worth more than its melt value.",
    ],
    faq: {
      question: "Can King's Jeweler appraise estate jewelry from Ellington?",
      answer:
        "Yes. Bring the pieces to the store — about 18 minutes down Route 83 — and we'll assess them in front of you. You'll learn what's worth insuring, what's worth restoring, and what's worth selling, with written appraisals available for insurance or estate settlement.",
    },
    heroImage: "/images/jewelry/kings-55.webp",
  },
  {
    slug: "windsor",
    town: "Windsor",
    county: "Hartford County",
    driveTime: "about 18 minutes",
    route: "I-291 East to I-84, Exit 62",
    intro: [
      "I-291 makes Buckland Hills an easy run from Windsor and the Day Hill corridor — about eighteen minutes, most of it highway. King's Jeweler sits inside the mall with parking at the door, so a battery change or drop-off fits inside a lunch hour.",
      "Windsor customers use us as their bench jeweler: the store that fixes the clasp properly, sizes the ring without weakening it, and gives a straight answer on whether a repair is worth the cost. When it is something special, the engagement and custom design cases are here too.",
    ],
    faq: {
      question: "Is there a jeweler near Windsor, CT that changes watch batteries on the spot?",
      answer:
        "Yes — King's Jeweler at Buckland Hills replaces most watch batteries while you wait, no appointment needed, seven days a week. From Windsor take I-291 to I-84 Exit 62; it's about 18 minutes with free parking at the mall.",
    },
    heroImage: "/images/jewelry/kings-05.webp",
  },
  {
    slug: "coventry",
    town: "Coventry",
    county: "Tolland County",
    driveTime: "about 20 minutes",
    route: "Route 44 West to I-384, then into Buckland",
    intro: [
      "From the lake or the village, Coventry's route to a real jeweler runs west on Route 44 to I-384 — about twenty minutes to King's Jeweler at The Shoppes at Buckland Hills. We're the full-service counter Coventry doesn't have in town.",
      "That means everything under one roof: repairs and restorations, ring sizing, watch batteries while you shop, written appraisals, and a gold-buying counter that pays same-day cash at honest percentages of melt value.",
    ],
    faq: {
      question: "Where do Coventry residents go for jewelry repair?",
      answer:
        "Most head to Manchester — and King's Jeweler at Buckland Hills is the full-service option, about 20 minutes via Route 44 and I-384. Repairs are assessed by a jeweler in the store with a firm quote before any work starts.",
    },
    heroImage: "/images/jewelry/kings-33.webp",
  },
  {
    slug: "tolland",
    town: "Tolland",
    county: "Tolland County",
    driveTime: "about 15 minutes",
    route: "I-84 West from Exit 68 straight to Exit 62",
    intro: [
      "Tolland sits right on I-84, which makes King's Jeweler a fifteen-minute straight shot — on for six exits, off at Buckland Street, park at the door. For a town built around the Green and the highway, we're the closest serious jeweler by a wide margin.",
      "Tolland customers bring us the full mix: watches that need batteries or bands, rings that need sizing after decades of wear, gold that's ready to become cash, and once in a while the big one — an engagement ring chosen across our counter with no pressure and no games.",
    ],
    faq: {
      question: "What's the best jewelry store near Tolland, CT?",
      answer:
        "For full service — repairs, batteries, appraisals, gold buying, and engagement rings in one store — King's Jeweler at Buckland Hills in Manchester is the closest option, 15 minutes down I-84 from the Tolland Green. Family-run since 2000 with a 4.5★ Google rating.",
    },
    heroImage: "/images/jewelry/kings-16.webp",
  },
];

export function getTownPage(slug: string): TownPage | undefined {
  return townPages.find((t) => t.slug === slug);
}

/** The two generated FAQs every town page shares (route/time vary). */
export function commonTownFaqs(t: TownPage): TownFAQ[] {
  return [
    {
      question: `How far is King's Jeweler from ${t.town}, CT?`,
      answer: `${t.driveTime.charAt(0).toUpperCase()}${t.driveTime.slice(1)} — take ${t.route}. We're inside The Shoppes at Buckland Hills at 194 Buckland Hills Dr, Manchester, with free parking and no appointment needed.`,
    },
    {
      question: `Do you buy gold from ${t.town} customers?`,
      answer: `Yes — bring gold, silver, platinum, or diamonds any day during store hours. A jeweler weighs and evaluates everything in front of you and makes a same-day cash offer, typically 70–90% of melt value. You can also trade the value toward anything in the case.`,
    },
  ];
}
