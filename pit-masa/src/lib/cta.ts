/**
 * Centralized CTA labels and hrefs.
 * Single source of truth so wording stays consistent across the site.
 */

export const CTA_PRIMARY = {
  label: "Book Catering",
  href: "/contact",
} as const;

export const CTA_SECONDARY_RESULTS = {
  label: "View Event Gallery",
  href: "/gallery",
} as const;

/**
 * Catering inquiry service options shown in the contact form. These mirror the
 * real booking model: the three mobile setups (Pit Trailer, Food Truck,
 * Cocktail Cart), the Trailer + Truck bundle ("The Full Spread"), and the
 * off-event meal programs.
 */
export const CATERING_HELP_OPTIONS = [
  "Pit Trailer (Wood-Fired BBQ)",
  "Food Truck (Live Taco Bar)",
  "The Full Spread (Trailer + Truck)",
  "Holiday Meal Pack",
  "Weekly Meal Prep",
  "Pre-Made Meals",
  "Not Sure Yet",
] as const;

/**
 * Off-event offerings that are delivered or picked up rather than catered
 * on-site. The contact wizard adapts its event-specific questions for these.
 */
export const MEAL_PROGRAM_OPTIONS = [
  "Holiday Meal Pack",
  "Weekly Meal Prep",
  "Pre-Made Meals",
] as const;

/** Estimated guest-count ranges shown in the contact form. */
export const GUEST_COUNT_OPTIONS = [
  "Under 25 guests",
  "25–50 guests",
  "50–100 guests",
  "100–200 guests",
  "200+ guests",
  "Not sure yet",
] as const;

/** Occasion / event-type options shown in the contact form. */
export const EVENT_TYPE_OPTIONS = [
  "Wedding",
  "Birthday party",
  "Anniversary",
  "Graduation",
  "Family reunion",
  "Corporate / office event",
  "Holiday party",
  "Backyard BBQ / cookout",
  "Game day / tailgate",
  "Baby / bridal shower",
  "Memorial / celebration of life",
  "Fundraiser / community event",
  "Other / not sure yet",
] as const;

/** How the food is served — drives staffing, setup, and pricing. */
export const SERVICE_STYLE_OPTIONS = [
  "Drop-off (we deliver, you serve)",
  "Buffet / self-serve setup",
  "On-site cooking / live station",
  "Full-service (staff, setup & cleanup)",
  "Not sure yet",
] as const;

/** Ballpark budget ranges shown in the contact form. */
export const BUDGET_OPTIONS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
] as const;

/** On-site setup needs — multi-select. Helps us scope staffing & equipment. */
export const SETUP_NEEDS_OPTIONS = [
  "Tables & linens",
  "Plates, utensils & napkins",
  "Serving / wait staff",
  "Tent or shade cover",
  "Power / generator access on-site",
  "Add a Cocktail Cart / bar (coming soon)",
  "We've got setup covered",
] as const;

/** How the guest heard about Pit & Masa — helps us focus our outreach. */
export const HOW_HEARD_OPTIONS = [
  "Google search",
  "Instagram",
  "Facebook",
  "TikTok",
  "Friend or family referral",
  "Tasted us at a festival or pop-up",
  "Past Pit & Masa customer",
  "Other",
] as const;
