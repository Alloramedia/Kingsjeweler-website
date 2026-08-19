/**
 * Editorial content for King's Jeweler.
 * Blog posts target high-intent local + informational jewelry keywords
 * (repairs, engagement rings, gold buying, watch batteries, appraisals).
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  body: { heading?: string; paragraphs: string[] }[];
  /** Curated internal links shown in a "Related reading" block. */
  related?: { label: string; href: string }[];
  /** Q&A pairs rendered as an accordion and emitted as FAQPage schema. */
  faqs?: { question: string; answer: string }[];
}

const AUTHOR = "The King's Jeweler Family";

export const blogPosts: BlogPost[] = [
  /* ── 1. Ring resizing cost — high-intent repair keyword ─────────── */
  {
    slug: "how-much-does-ring-resizing-cost",
    title: "How Much Does Ring Resizing Cost? A Jeweler's 2026 Price Guide",
    excerpt:
      "Ring resizing typically costs $30–$150 depending on the metal, style, and how many sizes you move. A Manchester, CT jeweler breaks down real prices, timelines, and when a ring can't be resized.",
    category: "Jewelry Repair",
    image: "/images/jewelry/kings-03.webp",
    author: AUTHOR,
    date: "2026-08-12",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "\"How much does it cost to resize a ring?\" is the question we hear most at the counter, usually from someone holding an engagement ring that's a half size off, or a family heirloom that needs to fit a new hand. The honest answer: most ring resizing costs between $30 and $150, and the price depends on three things: the metal, the style of the ring, and how far up or down you're going.",
          "This guide walks through real-world pricing the way we quote it in our store at The Shoppes at Buckland Hills in Manchester, Connecticut, so you know what to expect before you walk into any jeweler.",
        ],
      },
      {
        heading: "Average ring resizing costs by metal",
        paragraphs: [
          "Sizing down is almost always cheaper than sizing up, because sizing down removes a sliver of metal while sizing up requires adding new precious metal to the band. Here's what typical jobs run: sterling silver $30–$50, 10k–14k yellow gold $40–$80, 18k gold $60–$100, white gold $50–$100 (it usually needs rhodium re-plating afterward, which adds $25–$40), and platinum $75–$150 because it has a higher melting point and takes more bench time.",
          "Moving more than one size adds cost: roughly $10–$25 per additional size in gold, more in platinum. If a quote sounds dramatically higher or lower than these ranges, ask why. A good jeweler will show you exactly what the job involves.",
        ],
      },
      {
        heading: "What makes a resize more expensive",
        paragraphs: [
          "Plain bands are the simplest and cheapest to resize. Cost climbs when the ring has stones set around the band. Channel-set and pavé diamonds can shift when the band is reshaped, so the jeweler has to check and re-tighten every stone. That's real labor, and it's why an eternity-style ring can cost $100+ to size even one step.",
          "Engraved bands may need the pattern re-cut where the ring was joined. Tension-set rings and rings with interior milgrain or filigree also take extra care. None of this means you shouldn't resize; it just means the quote should come from a jeweler who has actually looked at your ring, not a price list.",
        ],
      },
      {
        heading: "Rings that can't (or shouldn't) be resized",
        paragraphs: [
          "Full eternity bands, with stones all the way around, generally can't be resized because there's no bare metal to cut. Tungsten, titanium, and stainless steel rings can't be resized at all; those metals can't be soldered like gold or platinum, so the fix is usually exchanging for the correct size.",
          "For rings that can't be cut, there are workarounds: sizing beads soldered inside the band (great for stopping a top-heavy ring from spinning), a sizing bar, or a snap-in ring guard. These run $20–$60 and are completely reversible, a nice option for heirlooms you don't want to alter.",
        ],
      },
      {
        heading: "How long does ring resizing take?",
        paragraphs: [
          "A straightforward gold resize takes 20–45 minutes at the bench, and many jewelers, including us, can do simple jobs the same day or while you shop the mall. Complex jobs with stone work, rhodium plating, or platinum typically take 3–7 days.",
          "Beware of anyone quoting weeks for a plain band, and equally beware of kiosks promising instant resizes on stone-set rings. Fast is good; careless is not.",
        ],
      },
      {
        heading: "How to get an accurate quote",
        paragraphs: [
          "Bring the ring in. Sizing over the phone is guesswork; a jeweler needs to see the metal stamp, the setting style, and the wear on the band. At our counter we measure your finger, check every prong under magnification, and give you a firm price before any work starts. There's never a fee to look.",
          "If you're in the Greater Hartford area, stop by King's Jeweler inside The Shoppes at Buckland Hills in Manchester, where most simple resizes are done while you shop. See everything we handle on our [jewelry services page](/services), or [contact us](/contact) with a photo of your ring for a ballpark estimate.",
        ],
      },
    ],
    related: [
      { label: "7 signs your jewelry needs repair", href: "/blog/signs-your-jewelry-needs-repair" },
      { label: "How to choose a wedding band that fits right the first time", href: "/blog/how-to-choose-a-wedding-band" },
      { label: "All jewelry repair services we offer", href: "/services" },
    ],
    faqs: [
      {
        question: "How much does it cost to resize a ring smaller?",
        answer:
          "Sizing a ring down usually costs $30–$80 for gold and silver, since the jeweler removes a small section of the band and solders it back together. Platinum runs $75–$150. Rings with stones around the band cost more because each stone must be checked and tightened afterward.",
      },
      {
        question: "How much does it cost to resize a ring bigger?",
        answer:
          "Sizing up typically costs $40–$150 because new precious metal is added to the band. Expect the higher end for 18k gold, platinum, or moving more than one full size.",
      },
      {
        question: "Can all rings be resized?",
        answer:
          "No. Full eternity bands, tungsten, titanium, and stainless steel rings can't be resized. For those, jewelers use alternatives like sizing beads, ring guards, or an exchange for the correct size.",
      },
      {
        question: "How long does it take a jeweler to resize a ring?",
        answer:
          "A simple gold resize takes under an hour at the bench and is often done same-day. Rings needing stone tightening, rhodium plating, or platinum work usually take 3–7 days.",
      },
      {
        question: "Does resizing damage or weaken a ring?",
        answer:
          "Not when done properly. A skilled jeweler solders the joint so it's as strong as the original band and polishes it invisible. Repeated resizing of the same ring, however, is best avoided, so get your size measured professionally first.",
      },
    ],
  },

  /* ── 2. Engagement ring buying guide — cornerstone content ──────── */
  {
    slug: "engagement-ring-buying-guide",
    title: "How to Buy an Engagement Ring: A Step-by-Step Guide from a Jeweler",
    excerpt:
      "Everything first-time engagement ring buyers need: how much to spend, the 4Cs in plain English, choosing a setting and metal, finding her ring size secretly, and mistakes to avoid.",
    category: "Engagement Rings",
    image: "/images/jewelry/kings-06.webp",
    author: AUTHOR,
    date: "2026-08-05",
    readTime: "11 min read",
    body: [
      {
        paragraphs: [
          "Buying an engagement ring is one of the biggest purchases most people make before a house, and most buyers walk in knowing almost nothing about diamonds. That's normal. After decades helping nervous first-time buyers at our store in Manchester, Connecticut, we've distilled the process into the steps below. Follow them in order and you'll buy with confidence instead of guesswork.",
        ],
      },
      {
        heading: "Step 1: Set a budget you're actually comfortable with",
        paragraphs: [
          "Ignore the old \"three months' salary\" rule; it was invented by a diamond ad campaign, not by couples. The right budget is whatever you can spend without debt stress. In 2026, most engagement rings sell between $2,000 and $8,000, but beautiful rings exist well below that range and the average is skewed by big-city purchases.",
          "Decide your ceiling before you shop, and tell the jeweler. A good one will show you the best ring at your number, not push you past it. At an independent store you're also not paying mall-chain markup or national ad budgets, so the same stone often costs meaningfully less than at a big-box brand.",
        ],
      },
      {
        heading: "Step 2: Learn the 4Cs, but know which ones matter most",
        paragraphs: [
          "Diamonds are graded on Cut, Color, Clarity, and Carat. Here's the insider ranking: Cut matters most. It's what makes a diamond sparkle, and no other C can compensate for a poorly cut stone. Always prioritize an Excellent or Very Good cut.",
          "Color and clarity are where smart buyers save. Color grades G–I look white to the naked eye at a fraction of the cost of D–F. For clarity, VS2 or SI1 stones are usually \"eye-clean,\" meaning inclusions are invisible without magnification. Paying for flawless clarity buys you bragging rights, not visible beauty.",
          "Carat is pure preference and budget. Pro tip: buy just under the popular weights. A 0.9ct stone looks nearly identical to a 1.0ct but costs 10–20% less, because prices jump at the round numbers.",
        ],
      },
      {
        heading: "Step 3: Natural or lab-grown?",
        paragraphs: [
          "Lab-grown diamonds are chemically identical to mined diamonds and cost 50–70% less at the same size and grade. They're real diamonds; the trade-off is resale value, which is minimal for lab stones. Natural diamonds hold value better and carry the traditional appeal.",
          "There's no wrong answer; there's only what matters to the two of you. We wrote a full breakdown in our [lab-grown vs. natural diamond comparison](/blog/lab-grown-vs-natural-diamonds). Read it before you decide.",
        ],
      },
      {
        heading: "Step 4: Choose the setting and metal",
        paragraphs: [
          "The setting drives the ring's personality. Solitaires are timeless and show off the center stone; halo settings make the center diamond look bigger; three-stone rings symbolize past, present, and future; hidden halos and pavé bands add sparkle without stealing focus.",
          "For metal: 14k white gold is today's most popular choice, yellow gold is surging back, rose gold flatters warm skin tones, and platinum is the most durable (and most expensive) for people who are hard on their hands. If your partner wears mostly silver-toned jewelry, stay white; mostly gold, stay yellow. Their existing jewelry box is your cheat sheet.",
        ],
      },
      {
        heading: "Step 5: Find the ring size without ruining the surprise",
        paragraphs: [
          "Borrow a ring they wear on the correct finger (left ring finger) and trace the inside circle on paper, or press it into a bar of soap. Ask their friends or family; someone usually knows. When all else fails, buy a size 6.5–7 (the most common range) and plan on a resize; [resizing is inexpensive](/blog/how-much-does-ring-resizing-cost) and we often do it same-day.",
        ],
      },
      {
        heading: "Step 6: Buy from someone who will stand behind the ring",
        paragraphs: [
          "Wherever you buy, insist on a grading report from GIA or IGI for the center stone, a written receipt describing the ring, and clear policies on sizing, service, and returns. Then get the ring [appraised and insured](/blog/jewelry-appraisals-explained); it takes one afternoon and protects a five-figure purchase.",
          "If you're anywhere near Hartford, come talk to us at King's Jeweler in The Shoppes at Buckland Hills. We'll put real diamonds side by side under the light, explain the differences in plain English, and never rush you. Browse our [engagement ring services](/services) or [book a visit](/contact). Bringing your questions costs nothing.",
        ],
      },
    ],
    related: [
      { label: "Lab-grown vs. natural diamonds: an honest comparison", href: "/blog/lab-grown-vs-natural-diamonds" },
      { label: "How to choose a wedding band", href: "/blog/how-to-choose-a-wedding-band" },
      { label: "Custom jewelry design: how it works", href: "/blog/custom-jewelry-design-process" },
    ],
    faqs: [
      {
        question: "How much should I spend on an engagement ring?",
        answer:
          "Spend what fits your finances; the \"three months' salary\" rule is marketing, not math. Most couples spend $2,000–$8,000, but stunning rings exist at every price point, especially with lab-grown diamonds or slightly-under-carat stones.",
      },
      {
        question: "Which of the 4Cs is most important?",
        answer:
          "Cut. A well-cut diamond sparkles more and can make color and clarity flaws invisible. Prioritize Excellent or Very Good cut, then save money with G–I color and VS2–SI1 eye-clean clarity.",
      },
      {
        question: "Is a lab-grown diamond a real diamond?",
        answer:
          "Yes. Lab-grown diamonds are chemically and optically identical to mined diamonds. They cost 50–70% less but have minimal resale value, so the choice comes down to budget and personal meaning.",
      },
      {
        question: "How do I find my partner's ring size without them knowing?",
        answer:
          "Borrow a ring they wear on their left ring finger and trace its inside circle, ask a friend or family member, or buy a size 6.5–7 and resize after the proposal. Most resizes are quick and inexpensive.",
      },
      {
        question: "Should I buy an engagement ring online or in person?",
        answer:
          "See diamonds in person at least once; two stones with identical paper grades can look noticeably different in real light. An in-person jeweler also handles sizing, service, and repairs for the life of the ring.",
      },
    ],
  },

  /* ── 3. Lab-grown vs natural — high-volume comparison keyword ───── */
  {
    slug: "lab-grown-vs-natural-diamonds",
    title: "Lab-Grown vs. Natural Diamonds: An Honest Jeweler's Comparison",
    excerpt:
      "Lab-grown diamonds cost 50–70% less than natural, but are they worth it? A jeweler compares price, resale value, durability, and how to tell them apart before you buy.",
    category: "Diamonds",
    image: "/images/jewelry/kings-09.webp",
    author: AUTHOR,
    date: "2026-07-29",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "Ten years ago lab-grown diamonds were a curiosity. Today they're roughly half of the engagement ring market, and \"should I buy lab or natural?\" has become the first question at our counter. Because we sell both, we don't have a horse in this race. Here's the comparison we give customers face to face.",
        ],
      },
      {
        heading: "They are the same stone, chemically",
        paragraphs: [
          "A lab-grown diamond is carbon crystallized into a diamond, exactly like a mined stone: same hardness (10 on the Mohs scale), same brilliance, same fire. It is not cubic zirconia or moissanite, which are different materials entirely. Even a trained jeweler can't tell lab from natural by eye; it takes specialized testing equipment that reads the stone's growth structure.",
          "Both types are graded by the same labs (GIA, IGI) on the same 4Cs scale, and every reputable lab stone is laser-inscribed on the girdle identifying it as lab-grown.",
        ],
      },
      {
        heading: "Price: the 50–70% difference",
        paragraphs: [
          "This is the headline. A 1-carat natural diamond of good quality typically runs $4,000–$6,000; a lab-grown equivalent runs $800–$2,000. That gap means a lab-diamond budget buys either a dramatically bigger stone or the same stone with thousands left over.",
          "For couples prioritizing size and sparkle per dollar, lab wins decisively. There's no visual sacrifice whatsoever.",
        ],
      },
      {
        heading: "Resale value: where natural wins",
        paragraphs: [
          "Natural diamonds hold meaningful resale and trade-in value, typically 25–50% of retail and more for exceptional stones, because supply is finite. Lab-grown prices have fallen steadily as production scales, and their resale value is minimal. Buy a lab diamond for its beauty, not as a store of value.",
          "One nuance we tell customers: most people never sell their engagement diamond. If you're certain this ring stays in the family forever, resale value is theoretical. If you like the option of upgrading the stone later, many jewelers (us included) give trade-in credit on natural stones they sold.",
        ],
      },
      {
        heading: "Ethics and environment",
        paragraphs: [
          "Lab-grown diamonds avoid mining entirely, which appeals to many buyers, though growing diamonds is energy-intensive; the greenest lab stones come from producers using renewable power. Natural diamonds from reputable channels are certified conflict-free under the Kimberley Process, and mining economies in Botswana and Canada depend heavily on responsible diamond revenue. Neither side is a caricature; ask your jeweler where their stones come from and expect a straight answer.",
        ],
      },
      {
        heading: "Our honest recommendation",
        paragraphs: [
          "Choose natural if tradition, rarity, and long-term value matter to you, or if this stone is meant to become a multi-generation heirloom. Choose lab-grown if maximizing beauty per dollar is the goal, or if it means buying the ring without financing it.",
          "The best way to decide is to look at both side by side. Visit us at King's Jeweler in The Shoppes at Buckland Hills in Manchester, CT and we'll put a lab and a natural stone under the same light; most people are stunned that they can't tell the difference. Start with our [engagement ring guide](/blog/engagement-ring-buying-guide) or [come see us](/contact).",
        ],
      },
    ],
    related: [
      { label: "How to buy an engagement ring: step-by-step", href: "/blog/engagement-ring-buying-guide" },
      { label: "Jewelry appraisals explained", href: "/blog/jewelry-appraisals-explained" },
      { label: "Browse our jewelry and diamond services", href: "/services" },
    ],
    faqs: [
      {
        question: "Can a jeweler tell if a diamond is lab-grown?",
        answer:
          "Not by eye. Lab and natural diamonds are visually and chemically identical. Jewelers use specialized testing machines that read growth patterns, and certified lab stones carry a microscopic laser inscription on the girdle.",
      },
      {
        question: "Do lab-grown diamonds lose their sparkle or get cloudy?",
        answer:
          "No. Lab-grown diamonds are real diamonds with the same hardness and optical properties as mined stones. They never fade, cloud, or yellow; that's a myth confused with cubic zirconia.",
      },
      {
        question: "Are lab-grown diamonds worth anything for resale?",
        answer:
          "Very little. Lab-grown prices keep falling as production scales, so treat a lab diamond as a purchase for beauty, not an investment. Natural diamonds typically retain 25–50% of retail value.",
      },
      {
        question: "How much cheaper are lab-grown diamonds?",
        answer:
          "Typically 50–70% less than natural diamonds of the same size and grade. A 1-carat lab-grown stone often costs $800–$2,000 versus $4,000–$6,000 for a comparable natural diamond.",
      },
      {
        question: "Is a lab-grown diamond good for an engagement ring?",
        answer:
          "Absolutely. It's a real diamond that will last forever and survive daily wear identically to a mined stone. Half of today's engagement rings feature lab-grown centers.",
      },
    ],
  },

  /* ── 4. Selling gold — high-intent local commercial keyword ─────── */
  {
    slug: "how-to-sell-gold-jewelry",
    title: "How to Sell Gold Jewelry for the Best Price (Without Getting Lowballed)",
    excerpt:
      "Selling old gold? Learn how gold buyers calculate offers, what your karat stamps mean, current payout expectations, and why a local jeweler usually beats mail-in buyers and pawn shops.",
    category: "Gold & Appraisals",
    image: "/images/jewelry/kings-01.webp",
    author: AUTHOR,
    date: "2026-07-22",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "With gold trading near record highs, the broken chains and single earrings in your drawer may be worth real money. But payouts for identical gold vary wildly, from 40% of melt value at some mail-in operations to 90%+ at honest local buyers. We buy gold every day at our Manchester, CT store, so here's exactly how the process works and how to walk away with the most cash.",
        ],
      },
      {
        heading: "Step 1: Know what you have",
        paragraphs: [
          "Look inside rings and on chain clasps for karat stamps: 10k means 41.7% pure gold, 14k is 58.3%, 18k is 75%, and 24k is pure. European pieces may read 417, 585, or 750, which mean the same thing. \"GF\" or \"GP\" means gold-filled or gold-plated, which has little melt value.",
          "Weight matters too. A kitchen scale in grams gives you a rough idea, though buyers use calibrated jeweler's scales. A typical man's 14k wedding band weighs 4–7 grams; a substantial chain can be 20–50 grams.",
        ],
      },
      {
        heading: "Step 2: Calculate melt value before you shop offers",
        paragraphs: [
          "Melt value = weight in grams × purity × today's gold price per gram. Example: a 10-gram 14k chain at $85/gram spot gold is 10 × 0.583 × $85 ≈ $495 melt value. That number is your negotiating anchor.",
          "No buyer pays 100% of melt, since refining costs and margin are real, but reputable local buyers pay 70–90% of melt for common gold. If someone offers you $200 for that $495 chain, walk out.",
        ],
      },
      {
        heading: "Step 3: Check whether it's worth more than melt",
        paragraphs: [
          "Not everything should be melted. Signed pieces (Tiffany, Cartier, David Yurman), antique and Victorian jewelry, and anything with quality diamonds or gemstones can be worth far more intact. A good jeweler will tell you when a piece deserves resale pricing instead of scrap pricing. That honesty is the biggest reason to sell to a jeweler rather than a \"we buy gold\" storefront that only knows melt.",
          "Diamonds over about a quarter carat have independent value; make sure any offer itemizes stones separately rather than lumping everything as \"scrap.\"",
        ],
      },
      {
        heading: "Where to sell: comparing your options",
        paragraphs: [
          "Local independent jewelers generally pay the most, 70–90% of melt, because they refine in bulk and also resell better pieces. Pawn shops typically pay 40–60%. Mail-in TV buyers are consistently the worst, often 30–50%, and you've mailed away your leverage. Gold parties and traveling hotel buyers rely on sellers not knowing melt value.",
          "Whoever you choose: get the weighing done in front of you, get offers itemized by karat, and never leave items \"for later evaluation\" without a detailed receipt.",
        ],
      },
      {
        heading: "Selling gold in the Hartford area",
        paragraphs: [
          "At King's Jeweler in The Shoppes at Buckland Hills, we test and weigh your gold right at the counter, explain the math, and make a same-day cash offer. No appointment needed, no obligation to sell. If a piece is worth more as jewelry than as metal, we'll say so.",
          "Gather your pieces and [stop in or contact us](/contact). If you're deciding between selling and insuring, read our guide to [jewelry appraisals](/blog/jewelry-appraisals-explained) first; some \"scrap\" turns out to be worth protecting.",
        ],
      },
    ],
    related: [
      { label: "Jewelry appraisals explained: cost and process", href: "/blog/jewelry-appraisals-explained" },
      { label: "7 signs your jewelry needs repair", href: "/blog/signs-your-jewelry-needs-repair" },
      { label: "Gold buying at King's Jeweler", href: "/services" },
    ],
    faqs: [
      {
        question: "How much do jewelers pay for gold?",
        answer:
          "Reputable local jewelers typically pay 70–90% of melt value for scrap gold. Pawn shops usually pay 40–60% and mail-in buyers often 30–50%, which is why comparing local offers first almost always nets you more.",
      },
      {
        question: "How do I calculate what my gold jewelry is worth?",
        answer:
          "Multiply weight in grams × purity × the current gold price per gram. A 10-gram 14k chain (58.3% pure) at $85/gram is worth about $495 in melt value. Expect honest offers of 70–90% of that figure.",
      },
      {
        question: "Is it better to sell gold to a jeweler or a pawn shop?",
        answer:
          "A jeweler, in almost every case. Jewelers pay higher percentages of melt value and can recognize when a piece is worth more intact: designer names, antiques, and diamond-set items that a scrap-only buyer would undervalue.",
      },
      {
        question: "What karat gold is worth the most?",
        answer:
          "Higher karat means more pure gold: 24k is pure, 18k is 75%, 14k is 58.3%, and 10k is 41.7%. An 18k piece is worth nearly twice as much per gram as a 10k piece of the same weight.",
      },
      {
        question: "Should I sell broken gold jewelry or repair it?",
        answer:
          "It depends on the piece. Sentimental or high-quality items are usually worth repairing, and many fixes cost under $100. Mismatched earrings, kinked hollow chains, and dated pieces you'll never wear are ideal candidates to sell for melt value.",
      },
    ],
  },

  /* ── 5. Watch battery — local same-day intent ───────────────────── */
  {
    slug: "watch-battery-replacement-guide",
    title: "Watch Battery Replacement: Cost, How Long It Takes & Why a Jeweler Beats the Kiosk",
    excerpt:
      "Watch battery replacement costs $10–$45 at a jeweler and takes about five minutes. Learn what affects the price, water-resistance resealing, and when a dead watch isn't the battery.",
    category: "Watches",
    image: "/images/jewelry/kings-02.webp",
    author: AUTHOR,
    date: "2026-07-15",
    readTime: "7 min read",
    body: [
      {
        paragraphs: [
          "A stopped watch is one of those errands people put off for months, and then the fix takes five minutes. We replace watch batteries all day at our store in The Shoppes at Buckland Hills, so here's everything worth knowing: what it costs, how long batteries last, and why where you go matters more than people think.",
        ],
      },
      {
        heading: "What watch battery replacement costs in 2026",
        paragraphs: [
          "At most jewelers, a standard battery replacement runs $10–$25 installed. Watches with screw-down casebacks, chronographs with multiple batteries, or watches needing a pressure reseal for water resistance run $25–$45. Luxury watches (TAG Heuer, Omega, Breitling quartz models) may cost more because they should be opened with the proper case tools and gaskets.",
          "Compare that with mailing your watch to a service center: $50+ and two weeks without it. For everyday watches, a competent local jeweler is the obvious answer.",
        ],
      },
      {
        heading: "Why a jeweler instead of a kiosk or DIY",
        paragraphs: [
          "Opening a watch case wrong is the most common way watches get ruined outside of water damage. Snap-back cases scratch and dent when pried with the wrong tool; screw-backs get chewed threads; and cheap replacement batteries can leak and corrode the movement, a repair that costs more than the watch.",
          "A jeweler uses case presses and proper wrenches, installs name-brand Swiss or Japanese cells, checks the gasket, and wipes the movement area clean. We also test the old battery first; sometimes the \"dead battery\" is actually a loose hand or a worn stem, and you shouldn't pay for a battery that won't fix the problem.",
        ],
      },
      {
        heading: "How long do watch batteries last?",
        paragraphs: [
          "Most quartz watches run 2–4 years per battery; small ladies' watches and watches with chronograph functions drain faster, sometimes 12–18 months. If a fresh battery dies within months, the movement is drawing too much current, a sign it needs cleaning or service, not another battery.",
          "One important habit: replace a dead battery promptly. Dead cells left in a watch for years are the ones that leak, and leaked electrolyte destroys circuit boards.",
        ],
      },
      {
        heading: "Water resistance: the step everyone skips",
        paragraphs: [
          "Every time a watch case is opened, its factory water seal is compromised. If you swim or shower with your watch, ask for the gasket to be inspected or replaced and the caseback properly seated. Kiosks almost never do this; it's routine for a watch-savvy jeweler.",
        ],
      },
      {
        heading: "Same-day watch batteries in Manchester, CT",
        paragraphs: [
          "Bring your watch to King's Jeweler at The Shoppes at Buckland Hills and we'll replace the battery while you wait, usually in about five minutes with no appointment. We handle everything from Timex to TAG, plus [watch repair, band sizing, and link adjustments](/services). Multiple dead watches in the drawer? Bring them all; we'll sort out which need batteries and which need more. [Find our hours and location here](/contact).",
        ],
      },
    ],
    related: [
      { label: "7 signs your jewelry needs repair", href: "/blog/signs-your-jewelry-needs-repair" },
      { label: "All watch services we offer", href: "/services" },
      { label: "How to sell gold jewelry for the best price", href: "/blog/how-to-sell-gold-jewelry" },
    ],
    faqs: [
      {
        question: "How much does it cost to replace a watch battery?",
        answer:
          "Standard watch battery replacement costs $10–$25 at a jeweler, installed. Screw-down casebacks, chronographs, and watches needing water-resistance resealing run $25–$45. Luxury watches may cost more due to specialized case tools.",
      },
      {
        question: "How long does a watch battery replacement take?",
        answer:
          "About five minutes for most watches. A jeweler with the right case tools can open, replace, test, and reseal a standard watch while you wait, no appointment needed.",
      },
      {
        question: "How long should a watch battery last?",
        answer:
          "Typically 2–4 years. Chronographs and small ladies' watches may drain in 12–18 months. If a new battery dies within a few months, the movement likely needs cleaning or service.",
      },
      {
        question: "Will replacing a watch battery ruin its water resistance?",
        answer:
          "It can if done carelessly. Opening the case disturbs the gasket seal, so ask for the gasket to be checked or replaced and the caseback properly pressed or torqued. That's standard practice at a good jeweler and rare at kiosks.",
      },
      {
        question: "Why did my watch stop even with a new battery?",
        answer:
          "Common causes include a corroded battery contact, a worn stem or loose hands, or a movement that needs cleaning. A jeweler can test the battery and movement separately to find the real fault before you pay for anything.",
      },
    ],
  },

  /* ── 6. Appraisals — commercial + informational hybrid ──────────── */
  {
    slug: "jewelry-appraisals-explained",
    title: "Jewelry Appraisals Explained: Cost, Process & When You Actually Need One",
    excerpt:
      "A jewelry appraisal costs $50–$150 per piece and is essential for insurance, estates, and divorce settlements. Learn what appraisers check, appraisal types, and how often to update yours.",
    category: "Gold & Appraisals",
    image: "/images/jewelry/kings-07.webp",
    author: AUTHOR,
    date: "2026-07-08",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "Most people only think about jewelry appraisals after something goes wrong: a lost ring, an estate to settle, an insurance claim denied for lack of documentation. An appraisal is a formal written valuation of your jewelry by a qualified professional, and for anything you'd be upset to lose, it's one of the cheapest pieces of protection you can buy.",
        ],
      },
      {
        heading: "When you actually need an appraisal",
        paragraphs: [
          "Insurance is the big one: homeowner's and renter's policies typically cap jewelry coverage at $1,000–$2,500 total unless you schedule pieces individually, and scheduling requires a current appraisal. If your engagement ring cost $6,000 and it's not scheduled, you're mostly uninsured.",
          "You'll also need appraisals for estate settlement after a death (courts and the IRS require documented values), divorce proceedings, charitable donations over $5,000, and any time you inherit jewelry and genuinely don't know what it's worth. That last one produces surprises constantly; grandma's \"costume\" brooch is sometimes platinum and old European-cut diamonds.",
        ],
      },
      {
        heading: "The three types of appraisal value",
        paragraphs: [
          "Insurance replacement value is the highest figure: what it would cost to replace the piece new at retail today. Fair market value, used for estates and taxes, is what the piece would sell for between willing parties, usually much lower. Liquidation value is the quick-sale floor.",
          "This is why an insurance appraisal is not an offer to buy, and why the number on your appraisal isn't what a buyer will pay. Knowing which value you need prevents both disappointment and paperwork problems, so tell the appraiser the purpose up front.",
        ],
      },
      {
        heading: "What happens during an appraisal",
        paragraphs: [
          "The appraiser examines each piece under magnification: testing metal purity, measuring and grading stones (dimensions, color, clarity, cut quality), noting brand marks, checking condition, and photographing the piece. You receive a signed document with full descriptions, photos, and the stated value: everything an insurer needs to write a policy or settle a claim.",
          "A thorough appraisal on a single ring takes 20–45 minutes. Be wary of drive-by valuations without magnification or documentation; a number scribbled on a business card protects nothing.",
        ],
      },
      {
        heading: "What appraisals cost, and how often to update",
        paragraphs: [
          "Expect $50–$150 per piece depending on complexity; multi-piece discounts are common. Never agree to appraisal fees charged as a percentage of value; that's a conflict of interest reputable appraisers refuse.",
          "Update appraisals every 3–5 years. Gold has roughly doubled over the past decade and diamond prices shift constantly; an insurance payout based on a 2015 appraisal will not replace your ring in 2026.",
        ],
      },
      {
        heading: "Getting an appraisal in the Hartford area",
        paragraphs: [
          "King's Jeweler provides written appraisals for insurance, estates, and personal knowledge at our store in The Shoppes at Buckland Hills in Manchester. Bring any paperwork you have, such as old receipts, grading reports, or prior appraisals, and we'll handle the rest. [See our appraisal services](/services) or [get in touch](/contact) to plan a visit. Thinking of selling instead of insuring? Read our [guide to selling gold](/blog/how-to-sell-gold-jewelry) first.",
        ],
      },
    ],
    related: [
      { label: "How to sell gold jewelry for the best price", href: "/blog/how-to-sell-gold-jewelry" },
      { label: "How to buy an engagement ring", href: "/blog/engagement-ring-buying-guide" },
      { label: "Appraisal & gold buying services", href: "/services" },
    ],
    faqs: [
      {
        question: "How much does a jewelry appraisal cost?",
        answer:
          "Typically $50–$150 per piece, with discounts for multiple items. Avoid any appraiser who charges a percentage of the jewelry's value; that's a conflict of interest.",
      },
      {
        question: "Do I need an appraisal to insure my engagement ring?",
        answer:
          "Almost always, yes. Standard homeowner's and renter's policies cap jewelry coverage around $1,000–$2,500, so insurers require a current appraisal to schedule (individually insure) a valuable ring.",
      },
      {
        question: "How often should jewelry be reappraised?",
        answer:
          "Every 3–5 years. Precious metal and diamond prices move significantly, and an outdated appraisal can leave you underinsured when you need to file a claim.",
      },
      {
        question: "Is an appraisal the same as what my jewelry would sell for?",
        answer:
          "No. Insurance appraisals state retail replacement cost, which is the highest value. Resale (fair market) value is typically much lower. Tell the appraiser the purpose so the right value type is documented.",
      },
      {
        question: "What should I bring to a jewelry appraisal?",
        answer:
          "The jewelry itself plus any documentation: receipts, diamond grading reports (GIA/IGI), prior appraisals, or brand paperwork. Existing certificates speed the process and strengthen the appraisal.",
      },
    ],
  },

  /* ── 7. Cleaning gold — evergreen how-to traffic ────────────────── */
  {
    slug: "how-to-clean-gold-jewelry-at-home",
    title: "How to Clean Gold Jewelry at Home (and What Never to Do)",
    excerpt:
      "Clean gold jewelry safely with warm water, dish soap, and a soft brush, and skip toothpaste, bleach, and boiling. A jeweler explains at-home care, stone-by-stone rules, and when to get professional cleaning.",
    category: "Jewelry Care",
    image: "/images/jewelry/kings-04.webp",
    author: AUTHOR,
    date: "2026-06-24",
    readTime: "7 min read",
    body: [
      {
        paragraphs: [
          "Gold doesn't tarnish the way silver does, but it collects a film of skin oils, lotion, soap scum, and everyday grime that steals its shine, especially on rings. The good news: safe cleaning takes ten minutes with things already in your kitchen. The bad news: several popular internet \"hacks\" genuinely damage jewelry. Here's the method we recommend to customers, plus the warnings we wish more people heard in time.",
        ],
      },
      {
        heading: "The safe method: dish soap and a soft brush",
        paragraphs: [
          "Fill a bowl with warm (not hot) water and add a few drops of plain dish soap like Dawn. Soak your gold pieces for 15–20 minutes to loosen buildup. Then scrub gently with the softest toothbrush you can find, paying attention to the underside of ring settings where grime cakes up against the skin.",
          "Rinse in a second bowl of clean water, never over an open drain, and pat dry with a lint-free cloth. Let pieces air-dry fully before storing. That's it. Done monthly, this keeps gold looking 90% as good as a professional cleaning.",
        ],
      },
      {
        heading: "What never to use on gold jewelry",
        paragraphs: [
          "Toothpaste is the most common mistake; it's abrasive and leaves fine scratches, especially on high-polish gold and softer stones. Baking soda pastes do the same. Bleach and chlorine are worse: chlorine attacks the alloy metals in gold and can make prongs brittle enough to snap (this is also why you should never wear gold rings in a pool or hot tub).",
          "Skip boiling water, which can crack stones through thermal shock, and be careful with ultrasonic cleaners at home; they're great for plain gold and diamonds but can destroy emeralds, opals, pearls, and any stone with fractures or filling.",
        ],
      },
      {
        heading: "Know your stones before you clean",
        paragraphs: [
          "Diamonds, sapphires, and rubies are durable and handle soapy scrubbing easily. Softer or porous gems need gentler care: pearls should only be wiped with a slightly damp cloth (never soaked, since it degrades the silk stringing and nacre), opals hate heat and dryness, and emeralds are usually oil-treated, so hot water and ultrasonics can leave them looking dull and dry.",
          "If you're unsure what a stone is, treat it like it's fragile, or ask a jeweler to identify it. Identification takes us seconds and prevents expensive mistakes.",
        ],
      },
      {
        heading: "When to get a professional cleaning and inspection",
        paragraphs: [
          "Twice a year, let a jeweler clean your most-worn pieces professionally. It's not just about shine: while cleaning, we inspect prongs under magnification, catch loose stones before they fall out, and spot [wear that needs repair](/blog/signs-your-jewelry-needs-repair) while the fix is still cheap. Many jewelers, including us, clean and inspect for free or nearly free, and it takes minutes.",
          "If you're near Manchester, CT, bring your rings by King's Jeweler at The Shoppes at Buckland Hills anytime and we'll clean and check them while you shop. See all our [care and repair services](/services) or [plan a visit](/contact).",
        ],
      },
    ],
    related: [
      { label: "7 signs your jewelry needs repair", href: "/blog/signs-your-jewelry-needs-repair" },
      { label: "How much does ring resizing cost?", href: "/blog/how-much-does-ring-resizing-cost" },
      { label: "Jewelry repair services", href: "/services" },
    ],
    faqs: [
      {
        question: "What is the best homemade jewelry cleaner for gold?",
        answer:
          "Warm water with a few drops of plain dish soap. Soak for 15–20 minutes, scrub gently with a soft toothbrush, rinse in clean water, and pat dry. Avoid toothpaste, baking soda, and bleach, all of which can damage gold or stones.",
      },
      {
        question: "Can I clean gold jewelry with toothpaste?",
        answer:
          "No. Toothpaste is abrasive and leaves micro-scratches on gold and soft gemstones. Dish soap and warm water clean just as effectively without any damage.",
      },
      {
        question: "Does chlorine damage gold jewelry?",
        answer:
          "Yes. Chlorine attacks the alloy metals in gold and can make prongs brittle enough to break. Always remove gold rings before pools, hot tubs, and cleaning with bleach.",
      },
      {
        question: "How do I clean a diamond ring so it sparkles?",
        answer:
          "Soak in warm soapy water, then brush gently under the stone; grime on a diamond's underside is what kills sparkle. Rinse away from the drain and dry with a lint-free cloth. For maximum brilliance, get a professional ultrasonic and steam cleaning twice a year.",
      },
      {
        question: "How often should jewelry be professionally cleaned?",
        answer:
          "Every six months for daily-wear pieces like engagement rings. Professional cleanings include a magnified prong inspection that catches loose stones before they're lost, often free at your local jeweler.",
      },
    ],
  },

  /* ── 8. Custom design — service-adjacent content ────────────────── */
  {
    slug: "custom-jewelry-design-process",
    title: "Custom Jewelry Design: How It Works, What It Costs & Where to Start",
    excerpt:
      "Custom jewelry is more accessible than most people think. A jeweler walks through the design process step by step: consultations, CAD previews, pricing, timelines, and redesigning heirloom stones.",
    category: "Custom Design",
    image: "/images/jewelry/kings-05.webp",
    author: AUTHOR,
    date: "2026-06-10",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "\"Can you make something like this, but…\" is how most custom jewelry projects begin: a screenshot, an inherited stone, or an idea that doesn't exist in any showcase. Custom design sounds intimidating and expensive; in reality it's a friendly, step-by-step process, and it often costs less than people expect. Here's how it works from first conversation to finished piece.",
        ],
      },
      {
        heading: "Step 1: The consultation (bring your inspiration)",
        paragraphs: [
          "Everything starts with a conversation. Bring photos, Pinterest boards, sketches on napkins, or just a description. A good designer asks about the wearer, the occasion, budget, and lifestyle: a nurse who works with her hands needs a lower-set stone than someone who wears rings occasionally.",
          "This is also where heirloom projects begin. Inherited diamonds and gemstones can be reset into completely new designs; one grandmother's ring frequently becomes two or three new pieces for different family members. The stones carry the sentiment; the design becomes yours.",
        ],
      },
      {
        heading: "Step 2: Design and CAD preview",
        paragraphs: [
          "Modern custom work uses CAD (computer-aided design) to model your piece in 3D before any metal is touched. You'll see photorealistic renders, and often a printed resin model you can physically try on. This is the stage to change anything: band width, stone height, prong style, hidden details like engraving or birthstones set inside the band.",
          "Nothing goes to casting until you approve the design, which removes the biggest fear about custom work: surprise. You see exactly what you're getting.",
        ],
      },
      {
        heading: "Step 3: Casting, setting & finishing",
        paragraphs: [
          "Once approved, the design is cast in your chosen metal: 14k or 18k gold, or platinum. Then a bench jeweler hand-sets the stones, refines the details, and polishes the piece to final finish. From approved design to finished jewelry typically takes 2–4 weeks; full projects run 3–6 weeks from first consultation. Planning a proposal or anniversary? Start at least six weeks out.",
        ],
      },
      {
        heading: "What custom jewelry actually costs",
        paragraphs: [
          "The honest answer: usually 10–30% more than a comparable ready-made piece, and sometimes less, especially when you're supplying your own stones. Simple custom bands start around $500–$900; custom engagement ring settings commonly run $1,200–$3,500 plus the center stone; fully bespoke statement pieces scale from there.",
          "What drives cost is metal weight, stone count, and design complexity, not the word \"custom\" itself. Resetting your own heirloom diamond into a new setting is one of the most cost-effective projects in jewelry: you get an essentially new ring for the price of the setting alone.",
        ],
      },
      {
        heading: "Starting a custom project in Connecticut",
        paragraphs: [
          "King's Jeweler designs and builds custom pieces for customers across Greater Hartford from our store in The Shoppes at Buckland Hills in Manchester. Consultations are free and no-pressure. Bring your ideas or your heirloom stones and we'll talk through options and give you a real quote. Browse [our services](/services), get inspired in [our gallery](/gallery), or [book a design consultation](/contact). If it's an engagement project, our [engagement ring guide](/blog/engagement-ring-buying-guide) is a great primer.",
        ],
      },
    ],
    related: [
      { label: "How to buy an engagement ring", href: "/blog/engagement-ring-buying-guide" },
      { label: "Lab-grown vs. natural diamonds", href: "/blog/lab-grown-vs-natural-diamonds" },
      { label: "See custom work in our gallery", href: "/gallery" },
    ],
    faqs: [
      {
        question: "How much does custom jewelry cost?",
        answer:
          "Typically 10–30% more than comparable ready-made jewelry, and sometimes less if you supply your own stones. Custom bands start around $500–$900; custom engagement ring settings usually run $1,200–$3,500 plus the center stone.",
      },
      {
        question: "How long does it take to make a custom ring?",
        answer:
          "Most projects take 3–6 weeks from first consultation to finished piece: design and CAD approval, then 2–4 weeks for casting, setting, and finishing. Start at least six weeks before a proposal date.",
      },
      {
        question: "Can I use diamonds from old jewelry in a new design?",
        answer:
          "Yes. Resetting inherited or old stones into new designs is one of the most popular and cost-effective custom projects. Your jeweler checks each stone for chips or wear before designing around it.",
      },
      {
        question: "Will I see the design before it's made?",
        answer:
          "Yes. Modern custom work uses 3D CAD renders, and often a printed try-on model, so you approve exactly what the finished piece will look like before any metal is cast.",
      },
      {
        question: "Is custom jewelry worth it?",
        answer:
          "If you want something meaningful that doesn't exist in a showcase, or want heirloom stones brought back to life, custom is absolutely worth it. You get one-of-a-kind jewelry, built to your budget, with input at every step.",
      },
    ],
  },

  /* ── 9. Wedding bands — seasonal evergreen ──────────────────────── */
  {
    slug: "how-to-choose-a-wedding-band",
    title: "How to Choose a Wedding Band: Metals, Widths & Matching Your Engagement Ring",
    excerpt:
      "A jeweler's complete wedding band guide: comparing gold, platinum, and alternative metals, choosing comfort-fit widths, matching (or contrasting) your engagement ring, and when to buy.",
    category: "Wedding Bands",
    image: "/images/jewelry/kings-10.webp",
    author: AUTHOR,
    date: "2026-05-27",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "The engagement ring gets the spotlight, but the wedding band is the ring you'll actually wear every day for the rest of your life, through work, workouts, dishes, and everything else. That makes comfort and durability just as important as looks. Here's how we walk couples through the choice at our counter.",
        ],
      },
      {
        heading: "Choosing the metal: the decision that matters most",
        paragraphs: [
          "For traditional metals: 14k gold is the everyday workhorse: durable, repairable, and available in yellow, white, and rose. 18k gold is richer in color but softer, better for people who aren't hard on their hands. Platinum is the premium choice: denser, naturally white forever (no re-plating), and hypoallergenic. It costs more upfront but wears for generations.",
          "Alternative metals like tungsten, titanium, and cobalt are popular for men's bands because they're inexpensive and scratch-resistant. Two big caveats: they [can never be resized](/blog/how-much-does-ring-resizing-cost), and they can't be repaired if damaged. Fingers change size over decades; a gold or platinum band adapts with you, an alternative-metal band gets replaced.",
        ],
      },
      {
        heading: "Width and comfort fit",
        paragraphs: [
          "Most women's bands run 1.5–3mm; most men's run 4–8mm. Wider bands fit tighter than narrow ones on the same finger, so a 8mm band often needs a quarter-size up. If you've never worn a ring daily, choose \"comfort fit,\" a rounded interior dome that slides over the knuckle easier and disappears on your hand within a week.",
          "Try widths on in person. The band that looks right on a chart frequently feels wrong on your hand, and this ring is a decades-long commitment.",
        ],
      },
      {
        heading: "Matching your engagement ring, or intentionally not",
        paragraphs: [
          "The classic route matches the band's metal and style to the engagement ring, sitting flush against it. If your engagement ring has a low-set or protruding stone, you may need a contoured or notched band shaped to nest around the setting; many of our custom projects are exactly this.",
          "Mixing is also fully in style: a pavé diamond band under a solitaire, mixed metals, or a stack that grows with anniversaries. The only real rule: bring the engagement ring when you shop so you can see the pairing on your hand, not in your imagination.",
        ],
      },
      {
        heading: "When to buy and what to spend",
        paragraphs: [
          "Buy bands 2–3 months before the wedding; that leaves time for sizing, engraving, and any custom contouring without rush fees. Budget-wise: plain 14k gold bands typically run $300–$900, platinum $600–$1,500, diamond-set bands $700 and up, and alternative metals $100–$400.",
          "Don't forget engraving: a date, coordinates, or a private joke inside the band costs little and becomes the detail you treasure most. If you're in the Hartford area, come try widths and metals side by side at King's Jeweler in The Shoppes at Buckland Hills in Manchester. We size while you wait, engrave, and [custom-fit bands to your engagement ring](/blog/custom-jewelry-design-process). [Stop in or say hello](/contact).",
        ],
      },
    ],
    related: [
      { label: "How to buy an engagement ring", href: "/blog/engagement-ring-buying-guide" },
      { label: "How much does ring resizing cost?", href: "/blog/how-much-does-ring-resizing-cost" },
      { label: "Custom jewelry design: how it works", href: "/blog/custom-jewelry-design-process" },
    ],
    faqs: [
      {
        question: "How much should a wedding band cost?",
        answer:
          "Plain 14k gold bands typically cost $300–$900, platinum bands $600–$1,500, diamond-set bands from $700, and alternative metals like tungsten $100–$400. Spend based on daily-wear durability, not just looks.",
      },
      {
        question: "Should my wedding band match my engagement ring?",
        answer:
          "It's personal preference. Matching metal and style is classic, but mixed metals and stacked contrast bands are fully in style. If your engagement ring has a protruding setting, you may need a contoured band shaped to nest against it.",
      },
      {
        question: "What is a comfort fit wedding band?",
        answer:
          "A band with a rounded, domed interior that slides over the knuckle more easily and feels better for all-day wear, highly recommended for anyone who hasn't worn a ring daily before.",
      },
      {
        question: "Are tungsten and titanium good wedding band choices?",
        answer:
          "They're affordable and extremely scratch-resistant, but they can never be resized or repaired. Since finger size changes over decades, gold or platinum is the better lifetime choice; alternative metals work well as budget or backup bands.",
      },
      {
        question: "When should we buy our wedding bands?",
        answer:
          "About 2–3 months before the wedding. That allows time for correct sizing, engraving, and any custom contouring to fit your engagement ring without rush charges.",
      },
    ],
  },

  /* ── 10. Repair signs — repair funnel content ───────────────────── */
  {
    slug: "signs-your-jewelry-needs-repair",
    title: "7 Signs Your Jewelry Needs Repair (Before You Lose a Diamond)",
    excerpt:
      "A spinning stone, a snagging prong, a stiff clasp: jewelers explain 7 warning signs that a ring, chain, or bracelet needs repair now, and what each fix typically costs.",
    category: "Jewelry Repair",
    image: "/images/jewelry/kings-11.webp",
    author: AUTHOR,
    date: "2026-05-13",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "Almost every lost diamond we've ever replaced gave its owner a warning first: a tick against the tooth, a snag on a sweater, a stone that spun a little too freely. Jewelry rarely fails without notice; people just don't know what the notices look like. Here are the seven signs we check for at the counter, what each one means, and roughly what the fix costs.",
        ],
      },
      {
        heading: "1. A stone that moves, rattles, or clicks",
        paragraphs: [
          "Tap your ring gently against your front teeth or hold it by the band and shake it next to your ear. Any tick, rattle, or visible wiggle means a stone is loose in its setting. This is the single most urgent repair in jewelry; a loose diamond can hold on for months or fall out tomorrow.",
          "The fix is stone tightening, usually $20–$50, done in minutes. Compare that to the cost of replacing the diamond itself.",
        ],
      },
      {
        heading: "2. Prongs that snag on fabric",
        paragraphs: [
          "If your ring keeps catching on sweaters and towels, a prong has lifted or worn thin. Prongs wear down like tire tread; after 10–20 years of daily wear, the tips can be half their original thickness. Re-tipping worn prongs runs $25–$60 per prong; a full re-prong or new head for a heavily worn ring runs $150–$400. Either is far cheaper than a lost center stone.",
        ],
      },
      {
        heading: "3. A chain with kinks, stretch, or a weak spot",
        paragraphs: [
          "Chains fail at predictable points: the links beside the clasp, kinked sections, and soldered joints from prior repairs. If a chain hangs unevenly or you can see a stretched, brighter link, it's telling you where it will break. Chain soldering typically costs $25–$75. Hollow chains (light for their size) are the exception; they often can't be invisibly repaired, and a jeweler should tell you honestly when replacement makes more sense.",
        ],
      },
      {
        heading: "4. A clasp that's stiff, loose, or won't spring back",
        paragraphs: [
          "Lobster and spring-ring clasps contain a tiny spring that wears out. If the clasp doesn't snap shut crisply, it can open on its own. That's how bracelets get lost. Clasp replacement runs $20–$80 depending on style, and adding a safety chain to a valuable bracelet is cheap insurance.",
        ],
      },
      {
        heading: "5. A ring that spins, digs in, or leaves marks",
        paragraphs: [
          "A ring that rotates constantly is too big; one that leaves deep marks or won't pass the knuckle is too small. Both cause real problems: spinning rings wear unevenly and knock stones against hard surfaces, and tight rings can become emergencies. [Resizing costs $30–$150](/blog/how-much-does-ring-resizing-cost), and sizing beads can fix a spinner for even less.",
        ],
      },
      {
        heading: "6. White gold that's turning yellow",
        paragraphs: [
          "White gold is yellow gold alloyed pale and finished with rhodium plating. When the plating wears, typically every 1–3 years on a daily-wear ring, the piece takes on a yellowish cast, most visibly on the band's underside. Rhodium re-plating costs $40–$90 and makes a white gold ring look brand new. It's maintenance, not damage.",
        ],
      },
      {
        heading: "7. Earring backs that slide on too easily",
        paragraphs: [
          "Friction backs loosen with use; when a back slides on without resistance, the earring is one bump from gone. Replacement backs cost a few dollars, and upgrading valuable studs to screw-backs or locking backs runs $20–$60, the cheapest insurance in this whole article.",
          "The overall lesson: small repairs are cheap, and lost stones are not. Get your daily-wear jewelry [professionally cleaned and inspected](/blog/how-to-clean-gold-jewelry-at-home) twice a year. If you're near Manchester, CT, bring your pieces to King's Jeweler at The Shoppes at Buckland Hills. We'll inspect everything under magnification, usually while you wait, and quote any repair honestly before touching it. [See our repair services](/services) or [plan a visit](/contact).",
        ],
      },
    ],
    related: [
      { label: "How much does ring resizing cost?", href: "/blog/how-much-does-ring-resizing-cost" },
      { label: "How to clean gold jewelry at home", href: "/blog/how-to-clean-gold-jewelry-at-home" },
      { label: "Watch battery replacement guide", href: "/blog/watch-battery-replacement-guide" },
    ],
    faqs: [
      {
        question: "How do I know if a diamond is loose in my ring?",
        answer:
          "Hold the ring near your ear and tap or gently shake it; any tick or rattle means a loose stone. You can also touch the stone with a fingertip and check for movement. Stop wearing the ring and have it tightened; the repair usually costs $20–$50.",
      },
      {
        question: "How much does it cost to fix a prong on a ring?",
        answer:
          "Re-tipping a worn prong costs about $25–$60 per prong. Replacing an entire worn setting head runs $150–$400, still far cheaper than replacing a lost center diamond.",
      },
      {
        question: "How much does it cost to repair a broken chain?",
        answer:
          "Most chain solder repairs cost $25–$75 depending on the chain style and metal. Hollow chains are the exception; they often can't be invisibly repaired and may be better replaced.",
      },
      {
        question: "Why is my white gold ring turning yellow?",
        answer:
          "The rhodium plating that gives white gold its bright finish wears off every 1–3 years with daily wear. Re-plating costs $40–$90 and restores the ring to like-new white. It's routine maintenance, not damage.",
      },
      {
        question: "How often should jewelry be inspected?",
        answer:
          "Every six months for daily-wear pieces like engagement rings. A jeweler's magnified inspection catches loose stones, thinning prongs, and worn clasps while the fix is still small and inexpensive, and it's often free.",
      },
    ],
  },
];
