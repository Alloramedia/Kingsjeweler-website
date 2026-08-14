/**
 * Centralized CTA labels and hrefs.
 * Single source of truth so wording stays consistent across the site.
 */

export const CTA_PRIMARY = {
  label: "Visit or Contact Us",
  href: "/contact",
} as const;

export const CTA_SECONDARY_RESULTS = {
  label: "View Our Work",
  href: "/gallery",
} as const;

/**
 * Service options shown in the contact form — mirrors what the store
 * actually does day to day.
 */
export const CATERING_HELP_OPTIONS = [
  "Engagement Rings & Bridal",
  "Custom Jewelry Design",
  "Jewelry Repair",
  "Watch Repair & Batteries",
  "Ring Sizing",
  "Gold Buying / Trade-In",
  "Appraisal",
  "Something Else / Not Sure",
] as const;

/**
 * Requests that are typically handled same-day at the counter rather than
 * as a longer project. The contact wizard tones down project questions for these.
 */
export const MEAL_PROGRAM_OPTIONS = [
  "Watch Repair & Batteries",
  "Ring Sizing",
  "Gold Buying / Trade-In",
] as const;

/** Ballpark budget ranges shown in the contact form. */
export const GUEST_COUNT_OPTIONS = [
  "Under $250",
  "$250 – $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
] as const;

/** Occasion options shown in the contact form. */
export const EVENT_TYPE_OPTIONS = [
  "Engagement / proposal",
  "Wedding bands",
  "Anniversary",
  "Birthday gift",
  "Holiday gift",
  "Graduation",
  "Just because",
  "Repair or restoration",
  "Other / not sure yet",
] as const;

/** Type of piece the visit is about. */
export const SERVICE_STYLE_OPTIONS = [
  "Ring",
  "Necklace / pendant",
  "Bracelet",
  "Earrings",
  "Watch",
  "Chain",
  "Other / multiple pieces",
] as const;

/** Ballpark budget ranges shown in the contact form. */
export const BUDGET_OPTIONS = [
  "Under $250",
  "$250 – $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
] as const;

/** Metal / material preferences — multi-select. */
export const SETUP_NEEDS_OPTIONS = [
  "Yellow gold",
  "White gold",
  "Rose gold",
  "Platinum",
  "Sterling silver",
  "Diamonds",
  "Colored gemstones",
  "Not sure yet",
] as const;

/** How the customer heard about King's Jeweler. */
export const HOW_HEARD_OPTIONS = [
  "Google search",
  "Walked by in the mall",
  "Instagram",
  "Facebook",
  "Friend or family referral",
  "Past King's Jeweler customer",
  "Other",
] as const;
