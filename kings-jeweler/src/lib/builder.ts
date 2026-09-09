/**
 * Design-your-own jewelry builder — option data.
 * Single source of truth shared by the /design wizard and the
 * /api/design lead-intake route (server-side validation).
 */

export type PieceType = "ring" | "necklace" | "bracelet" | "charm";

export interface PieceConfig {
  type: PieceType;
  label: string;
  tagline: string;
  image: string;
  /** Style choices shown in step 2 — value plus a one-line description. */
  styles: { value: string; description: string }[];
  /** Label for the fit question, e.g. "Ring size" or "Chain length". */
  sizeLabel: string;
  sizeOptions: string[];
}

export const PIECES: PieceConfig[] = [
  {
    type: "ring",
    label: "Ring",
    tagline: "Engagement rings, bands, signets, statement pieces",
    image: "/images/jewelry/kings-20.webp",
    styles: [
      { value: "Solitaire engagement ring", description: "One center stone, clean and classic" },
      { value: "Halo engagement ring", description: "Center stone framed by a ring of diamonds" },
      { value: "Three-stone ring", description: "Past, present, future — three stones across" },
      { value: "Wedding or stacking band", description: "Plain, diamond, or textured band" },
      { value: "Eternity band", description: "Stones all the way around" },
      { value: "Signet ring", description: "Flat face for initials, a crest, or a design" },
      { value: "Statement / cluster ring", description: "Bold men's or ladies' showpiece" },
      { value: "Not sure yet", description: "We'll figure out the style together" },
    ],
    sizeLabel: "Ring size",
    sizeOptions: [
      "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5",
      "9", "9.5", "10", "10.5", "11", "11.5", "12", "13",
      "Not sure — size me in store",
    ],
  },
  {
    type: "necklace",
    label: "Necklace / Chain",
    tagline: "Cuban links, rope chains, tennis necklaces, pendants",
    image: "/images/jewelry/kings-28.webp",
    styles: [
      { value: "Cuban link chain", description: "Flat interlocking links, plain or iced out" },
      { value: "Rope chain", description: "Classic twisted rope, any thickness" },
      { value: "Figaro chain", description: "Alternating long and short links" },
      { value: "Franco chain", description: "Tight V-pattern weave, sits solid" },
      { value: "Tennis necklace", description: "A continuous line of diamonds" },
      { value: "Pendant with chain", description: "A pendant on the chain of your choice" },
      { value: "Custom nameplate", description: "Your name or word in gold script or block" },
      { value: "Not sure yet", description: "We'll figure out the style together" },
    ],
    sizeLabel: "Chain length",
    sizeOptions: ["16\"", "18\"", "20\"", "22\"", "24\"", "26\"", "30\"", "Not sure yet"],
  },
  {
    type: "bracelet",
    label: "Bracelet",
    tagline: "Tennis bracelets, Cuban links, bangles, charm bracelets",
    image: "/images/jewelry/kings-25.webp",
    styles: [
      { value: "Cuban link bracelet", description: "Flat interlocking links, plain or iced out" },
      { value: "Tennis bracelet", description: "A continuous line of diamonds" },
      { value: "Bangle", description: "Solid or hinged circle, plain or set with stones" },
      { value: "Rope bracelet", description: "Classic twisted rope, any thickness" },
      { value: "Charm bracelet", description: "A base bracelet built to carry charms" },
      { value: "ID bracelet", description: "Flat plate for a name or engraving" },
      { value: "Not sure yet", description: "We'll figure out the style together" },
    ],
    sizeLabel: "Bracelet length",
    sizeOptions: ["6\"", "6.5\"", "7\"", "7.5\"", "8\"", "8.5\"", "9\"", "Not sure yet"],
  },
  {
    type: "charm",
    label: "Charm / Pendant",
    tagline: "Initials, crosses, nameplates, custom shapes",
    image: "/images/jewelry/kings-45.webp",
    styles: [
      { value: "Initial / letter", description: "A single letter, plain gold or iced out" },
      { value: "Cross / religious", description: "Crosses, saints, and religious pieces" },
      { value: "Nameplate", description: "A name or word in script or block letters" },
      { value: "Sports / team", description: "Numbers, balls, gloves, team pride" },
      { value: "Animal / symbol", description: "Lions, hearts, zodiac signs, and more" },
      { value: "Photo / memorial", description: "A picture or tribute engraved in metal" },
      { value: "Custom shape — my own idea", description: "Bring us anything, we'll build it" },
      { value: "Not sure yet", description: "We'll figure out the style together" },
    ],
    sizeLabel: "Approximate size",
    sizeOptions: [
      "Small (under 1 inch)",
      "Medium (1 to 1.5 inches)",
      "Large (over 1.5 inches)",
      "Not sure yet",
    ],
  },
];

export const METAL_OPTIONS = [
  "Yellow gold",
  "White gold",
  "Rose gold",
  "Two-tone",
  "Platinum",
  "Sterling silver",
  "Not sure yet",
] as const;

/** Karat only applies to the gold metals. */
export const GOLD_METALS = ["Yellow gold", "White gold", "Rose gold", "Two-tone"];

export const KARAT_OPTIONS = ["10K", "14K", "18K", "Not sure yet"] as const;

export const STONE_OPTIONS = [
  "No stones — metal only",
  "Natural diamonds",
  "Lab-grown diamonds",
  "Moissanite",
  "Colored gemstone (sapphire, ruby, emerald...)",
  "Birthstone",
  "Not sure yet",
] as const;

/** Choices that mean "this piece has stones" — unlocks shape and amount. */
export const STONE_NONE = "No stones — metal only";

export const STONE_SHAPE_OPTIONS = [
  "Round",
  "Oval",
  "Princess (square)",
  "Cushion",
  "Emerald cut",
  "Pear",
  "Marquise",
  "Radiant",
  "Heart",
  "No preference",
] as const;

export const STONE_AMOUNT_OPTIONS = [
  "One center stone",
  "Center stone with accents",
  "A few accent stones",
  "Fully iced out",
  "Not sure yet",
] as const;

export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 2 weeks",
  "Within a month",
  "1 to 3 months",
  "No rush",
  "Just exploring for now",
] as const;

export const CONTACT_METHOD_OPTIONS = ["Call", "Text", "Email"] as const;

export function getPiece(type: string): PieceConfig | undefined {
  return PIECES.find((p) => p.type === type);
}

/**
 * Filename slug for a style's pre-rendered image in /public/images/design/.
 * Generated once (scripts/generate-design-images.mjs) and shipped as static
 * assets — no runtime AI involved.
 */
export function styleSlug(piece: PieceType, style: string): string {
  const s = style.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${piece}-${s}`;
}
