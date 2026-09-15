import {
  SERVICE_HELP_OPTIONS,
  EVENT_TYPE_OPTIONS,
  SERVICE_STYLE_OPTIONS,
  BUDGET_OPTIONS,
  MATERIAL_OPTIONS,
} from "@/lib/cta";

/**
 * Contact wizard configuration: one card per service, each with its own
 * preliminary follow-up questions (all optional — they qualify the lead,
 * they never block it).
 */

export type ServiceHelp = (typeof SERVICE_HELP_OPTIONS)[number];

export interface ServiceCard {
  value: ServiceHelp;
  desc: string;
  /** Rendered in brand gold to stand out (primary conversion path). */
  featured?: boolean;
}

export interface FollowUp {
  /** Payload key. "occasion" and "budget" map to dedicated API fields. */
  key: string;
  /** Question shown to the visitor and label saved to the admin inbox. */
  label: string;
  kind: "chips" | "multi" | "text";
  options?: readonly string[];
  placeholder?: string;
}

const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within a month",
  "1–3 months",
  "3+ months / just looking",
] as const;

export const SERVICE_CARDS: ServiceCard[] = [
  {
    value: "Gold Buying / Trade-In",
    desc: "Same-day cash offers on gold, silver, diamonds — or trade toward the case.",
    featured: true,
  },
  {
    value: "Engagement Rings & Bridal",
    desc: "Find the ring, or design it with us. Diamonds, settings, and honest guidance.",
  },
  {
    value: "Custom Jewelry Design",
    desc: "A one-of-a-kind piece made from your idea, photo, or old gold.",
  },
  {
    value: "Jewelry Repair",
    desc: "Chains, clasps, prongs, stones — most fixes done in days, not weeks.",
  },
  {
    value: "Watch Repair & Batteries",
    desc: "Batteries while you wait, bands, and service for most brands.",
  },
  {
    value: "Ring Sizing",
    desc: "Up or down, most sizings ready fast. We'll size you in the store.",
  },
  {
    value: "Appraisal",
    desc: "Written appraisals for insurance, estates, or peace of mind.",
  },
  {
    value: "Something Else / Not Sure",
    desc: "Tell us what's going on and we'll point you the right way.",
  },
];

export const FOLLOW_UPS: Record<ServiceHelp, FollowUp[]> = {
  "Engagement Rings & Bridal": [
    { key: "timeline", label: "When do you need it?", kind: "chips", options: TIMELINE_OPTIONS },
    { key: "budget", label: "Ballpark budget", kind: "chips", options: BUDGET_OPTIONS },
    { key: "materials", label: "Metal & stone preferences", kind: "multi", options: MATERIAL_OPTIONS },
    { key: "ringSize", label: "Do you know the ring size?", kind: "chips", options: ["Yes", "Roughly", "No — we can help"] },
  ],
  "Custom Jewelry Design": [
    { key: "pieceType", label: "What type of piece?", kind: "chips", options: SERVICE_STYLE_OPTIONS },
    { key: "materials", label: "Metals & stones", kind: "multi", options: MATERIAL_OPTIONS },
    { key: "budget", label: "Ballpark budget", kind: "chips", options: BUDGET_OPTIONS },
    { key: "timeline", label: "When do you need it?", kind: "chips", options: TIMELINE_OPTIONS },
  ],
  "Jewelry Repair": [
    { key: "pieceType", label: "What type of piece?", kind: "chips", options: SERVICE_STYLE_OPTIONS },
    {
      key: "repairIssue",
      label: "What's going on with it?",
      kind: "multi",
      options: [
        "Broken chain or clasp",
        "Loose or missing stone",
        "Worn or bent prongs",
        "Bent or cracked band",
        "Needs polishing / cleaning",
        "Something else",
      ],
    },
  ],
  "Watch Repair & Batteries": [
    {
      key: "watchNeeds",
      label: "What does it need?",
      kind: "multi",
      options: [
        "New battery",
        "Band adjustment or replacement",
        "Not running / needs service",
        "Crystal (glass) replacement",
        "Not sure",
      ],
    },
    { key: "watchBrand", label: "Brand & model (if known)", kind: "text", placeholder: "e.g. Seiko, Citizen, Rolex Datejust…" },
  ],
  "Ring Sizing": [
    { key: "ringCount", label: "How many rings?", kind: "chips", options: ["One", "Two", "Several"] },
    { key: "targetSize", label: "Do you know the new size?", kind: "chips", options: ["Yes", "No — size me at the store"] },
    { key: "timeline", label: "When do you need it?", kind: "chips", options: TIMELINE_OPTIONS },
  ],
  "Gold Buying / Trade-In": [
    {
      key: "selling",
      label: "What are you bringing in?",
      kind: "multi",
      options: [
        "Gold jewelry",
        "Silver or flatware",
        "Platinum",
        "Diamonds",
        "Coins or bullion",
        "Estate / mixed lot",
      ],
    },
    { key: "sellOrTrade", label: "Cash or trade?", kind: "chips", options: ["Cash sale", "Trade toward something in the case", "Not sure yet"] },
  ],
  Appraisal: [
    { key: "appraisalFor", label: "What's the appraisal for?", kind: "chips", options: ["Insurance", "Estate or inheritance", "Thinking of selling", "Just curious"] },
    { key: "pieceCount", label: "How many pieces?", kind: "chips", options: ["One", "2–5", "More than 5"] },
  ],
  "Something Else / Not Sure": [
    { key: "occasion", label: "Is there an occasion?", kind: "chips", options: EVENT_TYPE_OPTIONS },
  ],
};

/** Services where a reference / condition photo is especially useful. */
export const PHOTO_PROMPTS: Partial<Record<ServiceHelp, string>> = {
  "Engagement Rings & Bridal": "Have a screenshot or inspiration photo of the style? Add it here.",
  "Custom Jewelry Design": "A reference photo or sketch helps us quote your idea accurately.",
  "Jewelry Repair": "A quick photo of the damage helps us estimate before you come in.",
  "Watch Repair & Batteries": "A photo of the watch (front and back) speeds up the estimate.",
  "Gold Buying / Trade-In": "A photo of what you're selling helps us prep your offer.",
  Appraisal: "A photo of the piece helps us plan the appraisal.",
};

export const DEFAULT_PHOTO_PROMPT =
  "Optional — add a photo of the piece or an inspiration image.";
