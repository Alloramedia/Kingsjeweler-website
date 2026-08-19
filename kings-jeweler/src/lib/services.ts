/* ------------------------------------------------------------------ */
/*  Individual service pages — content, SEO metadata, and FAQs.        */
/*  Rendered by src/app/services/[slug]/page.tsx.                      */
/* ------------------------------------------------------------------ */

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceSection {
  heading: string;
  paragraphs: string[];
  /** Optional image shown beside this section */
  image?: string;
  imageAlt?: string;
}

export interface ServiceFeature {
  title: string;
  desc: string;
}

export interface ServicePage {
  slug: string;
  label: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  /** Headline, split so the closer renders in italic gold */
  h1: string;
  h1Em: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  /** Passed to ServiceSchema for structured data */
  schemaName: string;
  schemaDescription: string;
  priceRange?: string;
  features: ServiceFeature[];
  featuresHeading: string;
  sections: ServiceSection[];
  faqs: ServiceFAQ[];
  /** Blog slugs for internal linking */
  relatedPosts: { slug: string; label: string }[];
  ctaHeadline: string;
  ctaSubhead: string;
}

export const servicePages: ServicePage[] = [
  /* ── Engagement Rings ─────────────────────────────────────────── */
  {
    slug: "engagement-rings",
    label: "Engagement Rings",
    metaTitle: "Engagement Rings in Manchester, CT | King's Jeweler",
    metaDescription:
      "Shop natural and lab-grown diamond engagement rings at King's Jeweler in The Shoppes at Buckland Hills, Manchester, CT. Solitaires, halos, and fully custom designs with honest, pressure-free guidance.",
    keywords: [
      "engagement rings Manchester CT",
      "engagement rings Buckland Hills",
      "diamond rings Hartford County",
      "lab grown diamond engagement rings CT",
      "custom engagement rings Connecticut",
    ],
    eyebrow: "Engagement & Bridal",
    h1: "The ring she says yes to,",
    h1Em: "found together",
    intro:
      "This is the one purchase you want to get right. At King's Jeweler you sit down with a jeweler, not a commissioned salesperson, and compare real diamonds side by side under proper light until the choice is obvious. No pressure, no jargon, no games with the price tag.",
    heroImage: "/images/jewelry/kings-20.webp",
    heroImageAlt: "Engagement rings on display at King's Jeweler",
    schemaName: "Engagement Rings",
    schemaDescription:
      "Natural and lab-grown diamond engagement rings, solitaires, halos, and custom bridal designs in Manchester, Connecticut.",
    priceRange: "$$",
    featuresHeading: "Why couples choose us",
    features: [
      {
        title: "Natural and lab-grown diamonds",
        desc: "We stock both and explain the honest tradeoffs, so you decide with clear eyes and keep more of your budget.",
      },
      {
        title: "Compare in person, under real light",
        desc: "Photos hide everything that matters. See brilliance, color, and size on the hand before you commit.",
      },
      {
        title: "Custom without the markup",
        desc: "Bring a screenshot, a sketch, or just an idea. We design and build it, often for less than the designer version.",
      },
      {
        title: "Free lifetime cleaning",
        desc: "Every ring we sell gets free professional cleaning and inspection for life. Stop by any time.",
      },
    ],
    sections: [
      {
        heading: "Solitaires, halos, and everything between",
        paragraphs: [
          "Our bridal cases cover the full range: classic solitaires that never date, halo settings that make the center stone look a size bigger, vintage-inspired details, hidden halos, and matching bands in yellow, white, and rose gold. If you have seen it online, we can show you what it actually looks like on a hand.",
          "Every diamond we sell is inspected and graded honestly. We will put two stones next to each other and show you exactly why one costs more, and when the cheaper one is the smarter buy. That is the kind of advice you only get from a family jeweler with a reputation to protect.",
        ],
        image: "/images/jewelry/kings-52.webp",
        imageAlt: "Halo engagement rings in yellow and white gold",
      },
      {
        heading: "A budget is a starting point, not a judgment",
        paragraphs: [
          "Tell us the number you are comfortable with and we will show you the strongest ring that fits it. Because we buy diamonds directly and run one store instead of a national chain, the same stone routinely costs less here than at the mall chains a few doors down.",
          "We also make it easy to say yes: layaway plans, financing options, and free ring sizing so the surprise stays a surprise even if the fit is not perfect on the first try.",
        ],
        image: "/images/jewelry/kings-23.webp",
        imageAlt: "A diamond solitaire under the case lights",
      },
      {
        heading: "From proposal to wedding day",
        paragraphs: [
          "Once the answer is yes, we handle the rest of the journey: matching wedding bands for both of you, resizing, engraving, appraisal paperwork for insurance, and a professional cleaning right before the big day so everything photographs like it should.",
          "Couples from Manchester, South Windsor, Glastonbury, Vernon, and across Hartford County have trusted us with this moment. Come see why.",
        ],
        image: "/images/jewelry/kings-24.webp",
        imageAlt: "Bridal sets in yellow and white gold",
      },
    ],
    faqs: [
      {
        question: "How much should I spend on an engagement ring?",
        answer:
          "Whatever fits your life. The old salary rules were invented by advertisers. Most of our couples spend between $1,500 and $6,000, and we build beautiful rings well below and above that range. Tell us your number and we will maximize it.",
      },
      {
        question: "Lab-grown or natural diamond, which should I buy?",
        answer:
          "Lab-grown diamonds are chemically identical to natural ones and cost 50 to 70 percent less, so your budget buys a visibly bigger or higher-quality stone. Natural diamonds hold traditional and resale value. We stock both and will show you the same size in each so you can decide in person.",
      },
      {
        question: "Can you make a custom engagement ring?",
        answer:
          "Yes. Bring a photo, a Pinterest board, or an heirloom stone you want reset. We design the piece with you, show you a preview, and build it in the metal and stone of your choice, usually within a few weeks.",
      },
      {
        question: "Do you offer financing or layaway?",
        answer:
          "Yes, we offer both layaway and financing options so you can secure the ring now and pay over time. Ask in store and we will find the plan that fits.",
      },
      {
        question: "What if the ring does not fit?",
        answer:
          "Ring sizing on a ring purchased from us is free. Bring it in and most sizings are done within a few days, often sooner.",
      },
      {
        question: "Do I need an appointment?",
        answer:
          "No appointment needed. Walk into our store in The Shoppes at Buckland Hills any day of the week. If you want dedicated one-on-one time, call ahead and we will set it aside for you.",
      },
    ],
    relatedPosts: [
      { slug: "engagement-ring-buying-guide", label: "Engagement Ring Buying Guide" },
      { slug: "lab-grown-vs-natural-diamonds", label: "Lab-Grown vs. Natural Diamonds" },
    ],
    ctaHeadline: "Come try some on",
    ctaSubhead:
      "The right ring is obvious the moment it is on the hand. Visit us in The Shoppes at Buckland Hills and see for yourself, zero pressure.",
  },

  /* ── Custom Jewelry Design ────────────────────────────────────── */
  {
    slug: "custom-jewelry-design",
    label: "Custom Jewelry Design",
    metaTitle: "Custom Jewelry Design in Manchester, CT | King's Jeweler",
    metaDescription:
      "Turn your idea into one-of-a-kind gold and diamond jewelry at King's Jeweler in Manchester, CT. Custom pendants, rings, chains, and name pieces designed and built for you at Buckland Hills.",
    keywords: [
      "custom jewelry Manchester CT",
      "custom pendants Connecticut",
      "custom gold jewelry Hartford",
      "name pendant custom CT",
      "custom diamond jewelry Buckland Hills",
    ],
    eyebrow: "Custom Design",
    h1: "If you can picture it,",
    h1Em: "we can build it",
    intro:
      "A custom piece says something no showcase ever will. From diamond pendants and letter charms to signet rings and full iced-out builds, we take your idea from a screenshot or a sketch to a finished piece of real gold and real diamonds, made for you and no one else.",
    heroImage: "/images/jewelry/kings-38.webp",
    heroImageAlt: "A pave diamond lion pendant, custom work at King's Jeweler",
    schemaName: "Custom Jewelry Design",
    schemaDescription:
      "One-of-a-kind custom jewelry design and fabrication: pendants, rings, chains, and name pieces in gold and diamonds, made in Manchester, Connecticut.",
    priceRange: "$$",
    featuresHeading: "How custom works here",
    features: [
      {
        title: "Start with anything",
        desc: "A photo, a rough sketch, a logo, a name, or just a conversation. We will turn it into a workable design.",
      },
      {
        title: "See it before we build it",
        desc: "You approve the design and the quote up front. No surprises when it is time to pick up.",
      },
      {
        title: "Real materials, straight talk",
        desc: "Solid 10k, 14k, or 18k gold and genuine or lab-grown diamonds. We tell you exactly what goes into your piece.",
      },
      {
        title: "Heirloom resets",
        desc: "Grandma's stones deserve better than a drawer. We reset inherited diamonds into pieces you will actually wear.",
      },
    ],
    sections: [
      {
        heading: "Pendants, charms, and name pieces",
        paragraphs: [
          "Custom pendants are our most requested build: initials, names, numbers, crosses, portraits, logos, and symbols that mean something to you, in polished gold or fully iced with pave diamonds. If you can describe it, we can quote it.",
          "Every custom piece is built to be worn, with proper weight, secure settings, and a finish that holds up to daily life. This is jewelry made to outlast trends, not a 3D-printed novelty.",
        ],
        image: "/images/jewelry/kings-37.webp",
        imageAlt: "Gold letter and charm pendants at King's Jeweler",
      },
      {
        heading: "Rings and one-of-one statement pieces",
        paragraphs: [
          "From clean signet rings to championship-style statement pieces, we build rings around your story. Pick the metal, the stones, and the details, and we handle the engineering so it fits right and wears right.",
          "We also rework what you already own. An outdated ring can become a pendant. A broken chain can become a bracelet. Loose stones can anchor a completely new design. You keep the sentiment and lose the dust.",
        ],
        image: "/images/jewelry/kings-45.webp",
        imageAlt: "Gold pendants presented at the counter",
      },
      {
        heading: "Honest quotes, no deposit games",
        paragraphs: [
          "Custom does not have to mean expensive or mysterious. Once we agree on a design, you get a firm quote covering materials and labor before any work starts. Most custom builds are finished within two to four weeks.",
          "Customers drive to us from Hartford, West Hartford, Glastonbury, and across Connecticut because a custom piece is a leap of trust, and trust is what a 20-plus-year family business runs on.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does custom jewelry cost?",
        answer:
          "It depends on the gold weight, the stones, and the complexity. Simple custom pendants often start around a few hundred dollars, while heavier fully iced pieces run into the thousands. You approve a firm quote before we start any work.",
      },
      {
        question: "How long does a custom piece take?",
        answer:
          "Most custom builds are completed in two to four weeks depending on complexity. If you need it for a specific date, tell us up front and we will be straight about what is possible.",
      },
      {
        question: "Can I use my own gold or diamonds?",
        answer:
          "Yes. We regularly reset heirloom diamonds and can often use your existing gold in the new piece or credit its value toward the build.",
      },
      {
        question: "Do I need to know exactly what I want?",
        answer:
          "No. Most people walk in with a rough idea or a photo from Instagram. We will ask the right questions, sketch options, and refine it with you until it feels right.",
      },
      {
        question: "Will my design stay one of a kind?",
        answer:
          "Yes. Personal custom designs are built for you and are not reproduced for other customers.",
      },
      {
        question: "Can you match a piece I saw online for less?",
        answer:
          "Very often, yes. Big online retailers carry heavy markups. Bring us the link or screenshot and we will quote the same piece in real gold and diamonds, usually at a better price.",
      },
    ],
    relatedPosts: [
      { slug: "custom-jewelry-design-process", label: "The Custom Jewelry Design Process" },
      { slug: "lab-grown-vs-natural-diamonds", label: "Lab-Grown vs. Natural Diamonds" },
    ],
    ctaHeadline: "Bring us your idea",
    ctaSubhead:
      "Screenshot, sketch, or just a story. Stop by The Shoppes at Buckland Hills and let's design something nobody else will ever own.",
  },

  /* ── Jewelry Repair ───────────────────────────────────────────── */
  {
    slug: "jewelry-repair",
    label: "Jewelry Repair",
    metaTitle: "Jewelry Repair in Manchester, CT | Ring Sizing & Chain Repair",
    metaDescription:
      "Expert jewelry repair at King's Jeweler in Manchester, CT: ring resizing, chain and clasp repair, stone replacement, prong retipping, soldering, and polishing. Honest quotes, most repairs back fast.",
    keywords: [
      "jewelry repair Manchester CT",
      "ring resizing near me",
      "chain repair Connecticut",
      "prong repair Hartford County",
      "jewelry repair Buckland Hills",
    ],
    eyebrow: "Repair & Restoration",
    h1: "Broken today,",
    h1Em: "beautiful again",
    intro:
      "A snapped chain, a ring that no longer fits, a stone that rattles when you tap it. Whatever happened, bring it in. We inspect it in front of you, explain exactly what it needs, and quote the repair on the spot. No mailing your jewelry to a stranger, no mystery pricing.",
    heroImage: "/images/jewelry/kings-44.webp",
    heroImageAlt: "White-glove inspection of gold rings at King's Jeweler",
    schemaName: "Jewelry Repair",
    schemaDescription:
      "Professional jewelry repair including ring resizing, chain repair, stone setting, prong retipping, soldering, and polishing in Manchester, Connecticut.",
    priceRange: "$",
    featuresHeading: "What we repair",
    features: [
      {
        title: "Ring resizing",
        desc: "Up or down, gold, silver, or platinum, sized to fit exactly. Most sizings ready within days.",
      },
      {
        title: "Chain and clasp repair",
        desc: "Broken links, worn clasps, and stretched bracelets soldered and secured so they do not fail again.",
      },
      {
        title: "Stone setting and replacement",
        desc: "Lost a diamond or a colored stone? We match, replace, and secure it, and retip worn prongs before you lose the next one.",
      },
      {
        title: "Cleaning, polishing, and rhodium",
        desc: "Deep ultrasonic cleaning, scratch removal, and rhodium plating that makes white gold look brand new.",
      },
    ],
    sections: [
      {
        heading: "Repaired here, not shipped away",
        paragraphs: [
          "Many mall stores box up your jewelry and mail it to an out-of-state facility. We do not. Your piece stays with us, is worked on by hands you have met, and is ready faster because there is no shipping in either direction.",
          "Every repair starts with a free inspection. We will show you what we see under the loupe, tell you what is urgent and what can wait, and give you a firm price before you decide anything.",
        ],
        image: "/images/jewelry/kings-56.webp",
        imageAlt: "Diamond bands inspected at the counter",
      },
      {
        heading: "The repairs that save you money later",
        paragraphs: [
          "The cheapest repair is the one done before the stone falls out. Worn prongs, thinning shanks, and tired clasps give warning signs long before they fail. Our free inspection catches them early, when the fix costs a fraction of a replacement diamond.",
          "If you wear a piece daily, bring it by once a year. The inspection is free, the cleaning is fast, and the peace of mind is the whole point.",
        ],
        image: "/images/jewelry/kings-33.webp",
        imageAlt: "Gold rings in the showcase",
      },
      {
        heading: "Restoration and heirloom work",
        paragraphs: [
          "Older pieces deserve a careful hand. We restore heirloom rings, rebuild worn settings, replace missing stones with period-appropriate matches, and polish decades of wear without erasing the character that makes the piece yours.",
          "From Manchester to Vernon to East Hartford, families bring us the jewelry that matters most. We treat it that way.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does ring resizing cost?",
        answer:
          "Most gold ring sizings run between $40 and $150 depending on the metal, the width of the band, and how many sizes it moves. Sizing is free on rings purchased from us. You get an exact quote before we start.",
      },
      {
        question: "How long do repairs take?",
        answer:
          "Simple repairs like chain soldering or watch batteries are often same-day or next-day. Sizings and stone settings typically take a few days. We give you a real date when you drop off, and we hit it.",
      },
      {
        question: "Can you fix a broken chain?",
        answer:
          "Almost always, yes. Gold and silver chains are soldered so the repair is stronger than the link that failed. If a chain is beyond saving, we will tell you honestly and go over replacement options.",
      },
      {
        question: "My diamond fell out. Can you replace it?",
        answer:
          "Yes. We match the size, shape, and quality of the missing stone, secure it in a rebuilt setting, and check the remaining prongs so it does not happen again.",
      },
      {
        question: "Do you repair jewelry bought somewhere else?",
        answer:
          "Of course. Most of our repair work is on pieces bought elsewhere. Every repair gets the same care regardless of where the piece came from.",
      },
      {
        question: "Is the inspection really free?",
        answer:
          "Yes. Bring in any piece and we will examine it, explain its condition, and quote any recommended work at no charge and with no obligation.",
      },
    ],
    relatedPosts: [
      { slug: "signs-your-jewelry-needs-repair", label: "7 Signs Your Jewelry Needs Repair" },
      { slug: "how-much-does-ring-resizing-cost", label: "Ring Resizing Cost Guide" },
      { slug: "how-to-clean-gold-jewelry-at-home", label: "How to Clean Gold Jewelry at Home" },
    ],
    ctaHeadline: "Bring it in, we'll take a look",
    ctaSubhead:
      "Free inspection, honest quote, and your jewelry never leaves the store. Find us in The Shoppes at Buckland Hills.",
  },

  /* ── Watch Repair & Batteries ─────────────────────────────────── */
  {
    slug: "watch-repair-batteries",
    label: "Watch Repair & Batteries",
    metaTitle: "Watch Battery Replacement & Repair in Manchester, CT",
    metaDescription:
      "Watch batteries replaced while you wait at King's Jeweler in Manchester, CT. Band sizing, link adjustment, and watch repair for everyday and luxury watches at The Shoppes at Buckland Hills.",
    keywords: [
      "watch battery replacement Manchester CT",
      "watch battery near me",
      "watch band sizing CT",
      "watch repair Buckland Hills",
      "luxury watch service Hartford",
    ],
    eyebrow: "Watch Services",
    h1: "In and out,",
    h1Em: "ticking again",
    intro:
      "A dead watch battery should not cost you a week or a shipping label. Walk in, hand it over, and in most cases walk out minutes later with a fresh battery, a resealed case back, and a watch that fits your wrist the way it should.",
    heroImage: "/images/jewelry/kings-58.webp",
    heroImageAlt: "The watch counter at King's Jeweler",
    schemaName: "Watch Repair & Battery Replacement",
    schemaDescription:
      "Watch battery replacement while you wait, band sizing, link adjustment, and watch repair for everyday and luxury watches in Manchester, Connecticut.",
    priceRange: "$",
    featuresHeading: "Fast, careful watch service",
    features: [
      {
        title: "Batteries while you wait",
        desc: "Most watch batteries replaced in minutes with the correct cell and proper tools that will not scratch your case.",
      },
      {
        title: "Band sizing and adjustment",
        desc: "Metal links added or removed and clasps adjusted so the watch sits right, not sliding to your knuckle.",
      },
      {
        title: "Straps and bands",
        desc: "Worn leather or rubber strap? We will fit a quality replacement while you are here.",
      },
      {
        title: "Luxury watches welcome",
        desc: "Rolex, Omega, Cartier, and other fine watches handled with the correct tools and genuine respect.",
      },
    ],
    sections: [
      {
        heading: "The right way to change a battery",
        paragraphs: [
          "A watch battery swap looks trivial until a screwdriver slips or a case back goes on crooked and the watch is never water-resistant again. We open your watch with the proper case tools, install the correct battery, check the gasket, and reseal it the way the manufacturer intended.",
          "Kiosks and hardware stores treat your watch like a toy. We treat it like a watch.",
        ],
        image: "/images/jewelry/kings-09.webp",
        imageAlt: "A luxury chronograph in for service",
      },
      {
        heading: "Trusted with the watches that matter",
        paragraphs: [
          "From a daily beater to a Rolex Datejust handed down from your father, every watch on our counter gets the same careful hands. We will tell you plainly what we can service in-house and when a piece deserves a certified movement specialist, and we will point you to the right one instead of experimenting on your watch.",
          "That honesty is why watch owners from across Hartford County make the drive to Buckland Hills.",
        ],
        image: "/images/jewelry/kings-11.webp",
        imageAlt: "A Rolex Datejust, boxed and ready",
      },
    ],
    faqs: [
      {
        question: "How much does a watch battery cost?",
        answer:
          "Most standard watch batteries are replaced for around $10 to $20 including the battery and installation, while you wait. Watches with sealed or specialty case backs may cost slightly more, and we will tell you before we open anything.",
      },
      {
        question: "Do I need an appointment for a battery?",
        answer:
          "No. Walk in any time we are open. Most batteries are done in under ten minutes.",
      },
      {
        question: "Can you resize my watch band?",
        answer:
          "Yes. We add or remove links on metal bands and adjust clasps while you wait, so the watch leaves fitting the way it should.",
      },
      {
        question: "Do you work on Rolex and other luxury watches?",
        answer:
          "We handle batteries, band sizing, and straps for luxury watches in store with the correct tools. For internal movement work on fine Swiss watches, we will refer you honestly to a certified specialist rather than risk your watch.",
      },
      {
        question: "Will opening my watch void its water resistance?",
        answer:
          "Not when it is done right. We inspect and reseat the gasket and seal the case back properly. If a gasket is worn, we will tell you before it becomes a problem.",
      },
      {
        question: "My watch stopped but the battery is new. What now?",
        answer:
          "Bring it in. It could be the contact, the stem, or the movement itself. We will diagnose it for free and give you a straight answer about whether a repair is worth it.",
      },
    ],
    relatedPosts: [
      { slug: "watch-battery-replacement-guide", label: "Watch Battery Replacement Guide" },
    ],
    ctaHeadline: "Dead watch? Bring it by",
    ctaSubhead:
      "Most batteries replaced in minutes, while you wait, right in The Shoppes at Buckland Hills. No appointment needed.",
  },

  /* ── Jewelry Appraisals ───────────────────────────────────────── */
  {
    slug: "jewelry-appraisals",
    label: "Jewelry Appraisals",
    metaTitle: "Jewelry Appraisals in Manchester, CT | King's Jeweler",
    metaDescription:
      "Professional jewelry appraisals in Manchester, CT for insurance, estates, and resale. Diamonds, gold, and luxury pieces evaluated honestly at King's Jeweler in The Shoppes at Buckland Hills.",
    keywords: [
      "jewelry appraisal Manchester CT",
      "diamond appraisal near me",
      "estate jewelry appraisal Connecticut",
      "insurance appraisal jewelry Hartford",
      "gold appraisal Buckland Hills",
    ],
    eyebrow: "Buying & Appraisals",
    h1: "Know exactly",
    h1Em: "what it's worth",
    intro:
      "Whether you are insuring an engagement ring, settling an estate, or just curious about grandma's brooch, a proper appraisal turns guesswork into a number you can act on. We examine your piece in front of you and explain how we got to the value, in plain English.",
    heroImage: "/images/jewelry/kings-42.webp",
    heroImageAlt: "White-glove presentation at King's Jeweler",
    schemaName: "Jewelry Appraisals",
    schemaDescription:
      "Professional jewelry appraisals for insurance, estate, and resale purposes covering diamonds, gold, and fine jewelry in Manchester, Connecticut.",
    priceRange: "$",
    featuresHeading: "Appraisals for every purpose",
    features: [
      {
        title: "Insurance appraisals",
        desc: "Replacement-value documentation your insurer will accept, so a lost ring is a claim, not a tragedy.",
      },
      {
        title: "Estate and inheritance",
        desc: "Fair-market valuations that make dividing an estate simpler and disputes rarer.",
      },
      {
        title: "Resale guidance",
        desc: "Thinking of selling? We will tell you what it is realistically worth and what your best option is, even when that option is not us.",
      },
      {
        title: "Diamonds, gold, and luxury pieces",
        desc: "Engagement rings, chains, watches, and designer pieces evaluated with proper instruments, not a glance.",
      },
    ],
    sections: [
      {
        heading: "What happens during an appraisal",
        paragraphs: [
          "We test the metal, weigh the piece, measure and grade the stones under magnification, and factor in craftsmanship, brand, and condition. You watch the whole process, and we explain each step as we go. No disappearing into a back room with your jewelry.",
          "You leave with documentation that states what the piece is, what it contains, and what it is worth for the purpose you need, whether that is an insurance schedule or an estate file.",
        ],
        image: "/images/jewelry/kings-29.webp",
        imageAlt: "Gold Cuban link chains on display",
      },
      {
        heading: "Why an accurate appraisal matters",
        paragraphs: [
          "An inflated appraisal means you overpay insurance premiums for years. A lowball number means a loss never gets fully covered. Our job is the accurate number in the middle, backed by two decades of buying, selling, and building fine jewelry every single day.",
          "And because we also buy gold and diamonds, our valuations are grounded in what pieces actually trade for, not textbook theory.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does a jewelry appraisal cost?",
        answer:
          "Most single-piece appraisals run $50 to $150 depending on complexity. Multi-piece and estate appraisals are quoted up front based on the collection. Call or stop by for an exact price.",
      },
      {
        question: "How long does an appraisal take?",
        answer:
          "Simple pieces can often be evaluated the same day. Formal written appraisals for insurance are usually ready within a few days.",
      },
      {
        question: "Do I need an appraisal for insurance?",
        answer:
          "If a piece is worth more than your homeowner's policy covers by default, usually around $1,500 to $2,500, your insurer will want a current appraisal to schedule it. We provide documentation in the format insurers expect.",
      },
      {
        question: "How often should I update an appraisal?",
        answer:
          "Every three to five years. Gold and diamond prices move, and an outdated appraisal can leave you underinsured without knowing it.",
      },
      {
        question: "Will you appraise jewelry I want to sell you?",
        answer:
          "We keep those conversations separate and honest. If you want to sell, we make a transparent offer based on the same evaluation we show you. If you just want the number, that is fine too. There is never an obligation.",
      },
      {
        question: "Can you appraise antique or estate jewelry?",
        answer:
          "Yes. Estate and antique pieces are a regular part of our work, including identifying older cuts, testing unmarked metals, and valuing pieces with historical character.",
      },
    ],
    relatedPosts: [
      { slug: "jewelry-appraisals-explained", label: "Jewelry Appraisals Explained" },
      { slug: "how-to-sell-gold-jewelry", label: "How to Sell Gold Jewelry" },
    ],
    ctaHeadline: "Curious what it's worth?",
    ctaSubhead:
      "Bring it in. We will evaluate it in front of you and give you a number you can trust, at The Shoppes at Buckland Hills.",
  },

  /* ── Gold Chains & Jewelry ────────────────────────────────────── */
  {
    slug: "gold-chains-jewelry",
    label: "Gold Chains & Jewelry",
    metaTitle: "Gold Chains, Pendants & Jewelry in Manchester, CT",
    metaDescription:
      "Shop real gold chains, Cuban links, pendants, bracelets, and earrings at King's Jeweler in Manchester, CT. Solid 10k and 14k gold, iced-out pieces, and everyday classics at Buckland Hills.",
    keywords: [
      "gold chains Manchester CT",
      "Cuban link chain Connecticut",
      "gold pendants Hartford",
      "gold bracelets near me",
      "real gold jewelry Buckland Hills",
    ],
    eyebrow: "Gold & Diamonds",
    h1: "Real gold,",
    h1Em: "royal selection",
    intro:
      "Our showcases run deep: solid gold Cuban links, rope chains, pendants for every story, tennis bracelets, bangles, studs, and statement rings, in yellow, white, and rose gold. Everything is real, everything is tested, and everything is priced like we plan to see you again.",
    heroImage: "/images/jewelry/kings-28.webp",
    heroImageAlt: "A diamond Cuban link chain at King's Jeweler",
    schemaName: "Gold Chains & Fine Jewelry",
    schemaDescription:
      "Solid gold chains, Cuban links, pendants, bracelets, earrings, and diamond jewelry for sale in Manchester, Connecticut.",
    priceRange: "$$",
    featuresHeading: "What fills our cases",
    features: [
      {
        title: "Chains for every build",
        desc: "Cuban, rope, Franco, figaro, and herringbone in widths from everyday subtle to unmistakable.",
      },
      {
        title: "Pendants with meaning",
        desc: "Crosses, letters, zodiacs, sports, and custom symbols, plain gold or fully iced.",
      },
      {
        title: "Bracelets and bangles",
        desc: "Tennis bracelets, Cuban bracelets, and diamond bangles in every metal color.",
      },
      {
        title: "Earrings and studs",
        desc: "Diamond studs from first pair to showstopper, plus hoops and drops in solid gold.",
      },
    ],
    sections: [
      {
        heading: "Solid gold, tested and guaranteed",
        paragraphs: [
          "Every chain and pendant in our cases is real gold, stamped and verified. We will weigh any piece in front of you, explain karat and gram weight, and show you exactly what you are paying for. When you buy gold from a jeweler who also tests and buys gold every day, there is nowhere for nonsense to hide.",
          "Prefer it iced? Our diamond Cuban chains, pendants, and bracelets are set with genuine stones, not crystals, and priced well below the flagship-store equivalents.",
        ],
        image: "/images/jewelry/kings-50.webp",
        imageAlt: "Classic gold rope chains",
      },
      {
        heading: "From everyday classics to statement pieces",
        paragraphs: [
          "Some days call for a 2mm rope chain under a collar. Others call for a 15mm iced Cuban that ends conversations. We stock the full spectrum, along with matching bracelets, so you can build a look instead of buying a one-off.",
          "Gold crosses, letter pendants, sports charms, and gemstone rings round out the cases. If you do not see the exact piece, we will source it or build it custom.",
        ],
        image: "/images/jewelry/kings-53.webp",
        imageAlt: "Gold cross pendants at King's Jeweler",
      },
      {
        heading: "Buy smart, wear it for decades",
        paragraphs: [
          "Solid gold is not just style, it is stored value that does not expire. Unlike plated pieces that peel in months, a solid chain from our case can be worn daily, repaired forever, and one day passed down or traded in. We even buy back gold, so your jewelry keeps its exit ramp.",
          "Visit us in The Shoppes at Buckland Hills and let us put a few options on the counter. Gold looks different in person, and better on you.",
        ],
        image: "/images/jewelry/kings-51.webp",
        imageAlt: "Men's gold rings in the case",
      },
    ],
    faqs: [
      {
        question: "Is your jewelry real gold?",
        answer:
          "Yes. We sell solid 10k, 14k, and 18k gold, stamped and tested. We do not sell plated or filled pieces as anything other than what they are, and we will weigh and verify any piece in front of you.",
      },
      {
        question: "How much does a gold Cuban link chain cost?",
        answer:
          "It depends on karat, width, and length, since solid gold is priced largely by weight. Everyday chains start in the hundreds, while heavy or diamond-set Cubans run into the thousands. We will price options across your budget in minutes.",
      },
      {
        question: "10k or 14k gold, what is the difference?",
        answer:
          "14k contains more pure gold, giving a slightly richer color, while 10k is harder and more affordable. Both are solid gold that lasts decades. We will show you both side by side so you can judge with your own eyes.",
      },
      {
        question: "Do you offer layaway or financing on chains?",
        answer:
          "Yes, both. Lock in the piece you want and pay it off on a schedule that works for you.",
      },
      {
        question: "Can you adjust the length of a chain?",
        answer:
          "Yes. We shorten, lengthen, and repair chains in-house, and sizing is included with most purchases.",
      },
      {
        question: "Do you buy back gold jewelry?",
        answer:
          "We do. We buy gold, diamonds, and fine jewelry every day, so your purchase always holds trade-in or resale value. See our gold buying page for details.",
      },
    ],
    relatedPosts: [
      { slug: "how-to-clean-gold-jewelry-at-home", label: "How to Clean Gold Jewelry" },
      { slug: "how-to-sell-gold-jewelry", label: "How to Sell Gold Jewelry" },
    ],
    ctaHeadline: "Come see the cases",
    ctaSubhead:
      "Photos never do gold justice. Stop by The Shoppes at Buckland Hills and try a few pieces on, no pressure, ever.",
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((s) => s.slug === slug);
}
