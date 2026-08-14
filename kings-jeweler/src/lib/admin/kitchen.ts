/**
 * Back-office "kitchen" data model: ingredient Inventory, per-serving dish
 * Recipes, and the cost / grocery-list math that ties them together.
 *
 * Client-safe — contains NO server-only imports — so both the admin UI and the
 * server API routes can share these types, the seed data, and the helpers.
 *
 * Money is stored in dollars (a plain number). Quantities are expressed in the
 * INVENTORY ITEM'S purchase unit (e.g. brisket is priced per "lb", so a recipe
 * asks for `0.5` lb per serving). Keeping recipe units identical to the item's
 * purchase unit avoids any unit-conversion guesswork — multiply and you're done.
 */

/** Purchase / pricing units used across the inventory. */
export const UNITS = [
  "lb",
  "oz",
  "each",
  "dozen",
  "qt",
  "gal",
  "bunch",
  "package",
] as const;
export type Unit = (typeof UNITS)[number];

/** Ingredient categories — used to group the inventory and grocery list. */
export const INVENTORY_CATEGORIES = [
  "Proteins",
  "Produce",
  "Dairy & Cheese",
  "Tortillas & Bread",
  "Pantry & Dry",
  "Drinks",
  "Other",
] as const;
export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number];

/**
 * Nutrition for ONE purchase unit of an ingredient (e.g. one whole `lb`, one
 * `each`, one `dozen`). Stored per purchase unit — exactly like price — so dish
 * math is a single multiply: `qtyPerServing * nutrition`. All editable estimates.
 */
export interface NutritionFacts {
  /** Calories (kcal) per purchase unit. */
  calories: number;
  /** Protein (g) per purchase unit. */
  protein: number;
  /** Carbohydrate (g) per purchase unit. */
  carbs: number;
  /** Total fat (g) per purchase unit. */
  fat: number;
  /** Dietary fiber (g) per purchase unit. */
  fiber: number;
  /** Sodium (mg) per purchase unit. */
  sodium: number;
}

/** The macro keys, in display order, with friendly labels and units. */
export const NUTRITION_FIELDS = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
  { key: "fiber", label: "Fiber", unit: "g" },
  { key: "sodium", label: "Sodium", unit: "mg" },
] as const satisfies readonly { key: keyof NutritionFacts; label: string; unit: string }[];

/** A zeroed nutrition record. */
export const emptyNutrition = (): NutritionFacts => ({
  calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0,
});

/** A single purchasable ingredient with its Stop & Shop unit price. */
export interface InventoryItem {
  /** Stable slug, referenced by recipes (e.g. "beef-brisket"). */
  id: string;
  name: string;
  category: InventoryCategory;
  /** The unit the price is quoted in. */
  unit: Unit;
  /** Cost of one `unit` in dollars (editable estimate). */
  unitPrice: number;
  /** Nutrition per one purchase `unit` (editable estimate). */
  nutrition?: NutritionFacts;
  /** Optional note, e.g. pack size or where it's bought. */
  notes?: string;
  /** Epoch ms of the last price edit (for "last updated" display). */
  updatedAt?: number;
}

/** One ingredient line inside a dish recipe. */
export interface RecipeIngredient {
  /** Matches an InventoryItem id. */
  inventoryId: string;
  /** Amount needed per single guest serving, in the item's purchase unit. */
  qtyPerServing: number;
}

/** A dish (or building block) broken down into per-serving ingredients. */
export interface DishRecipe {
  id: string;
  /** Display name, e.g. "Smoked brisket". */
  dish: string;
  category: string;
  /** Human note about the portion, e.g. "~6 oz cooked". */
  yieldNote?: string;
  ingredients: RecipeIngredient[];
}

/**
 * When the seeded prices were last reviewed. Shown in the admin so the cook
 * knows these are starting estimates to keep current.
 */
export const PRICE_AS_OF = "Estimated Stop & Shop retail · mid-2026";

/* ── Seed inventory ──────────────────────────────────────────────
 * Realistic editable estimates. Every price can be changed in the
 * Inventory tool — treat these as a starting point, not gospel.
 */
const seedInventoryBase: InventoryItem[] = [
  /* Proteins */
  { id: "beef-brisket", name: "Beef brisket (whole packer)", category: "Proteins", unit: "lb", unitPrice: 6.49 },
  { id: "beef-chuck", name: "Beef chuck (birria)", category: "Proteins", unit: "lb", unitPrice: 5.99 },
  { id: "beef-short-rib", name: "Beef short rib", category: "Proteins", unit: "lb", unitPrice: 8.99 },
  { id: "picanha", name: "Picanha (top sirloin cap)", category: "Proteins", unit: "lb", unitPrice: 9.99 },
  { id: "skirt-steak", name: "Skirt steak (carne asada)", category: "Proteins", unit: "lb", unitPrice: 11.99 },
  { id: "pork-shoulder", name: "Pork shoulder / butt", category: "Proteins", unit: "lb", unitPrice: 2.79 },
  { id: "pork-belly", name: "Pork belly", category: "Proteins", unit: "lb", unitPrice: 6.99 },
  { id: "bacon", name: "Bacon", category: "Proteins", unit: "lb", unitPrice: 6.49 },
  { id: "st-louis-ribs", name: "St. Louis spare ribs", category: "Proteins", unit: "lb", unitPrice: 4.49 },
  { id: "chicken-thighs", name: "Chicken thighs (bone-in)", category: "Proteins", unit: "lb", unitPrice: 2.49 },
  { id: "chicken-breast", name: "Chicken breast", category: "Proteins", unit: "lb", unitPrice: 3.99 },
  { id: "turkey-breast", name: "Turkey breast", category: "Proteins", unit: "lb", unitPrice: 4.49 },
  { id: "chorizo", name: "Mexican chorizo", category: "Proteins", unit: "lb", unitPrice: 5.49 },
  { id: "jalapeno-sausage", name: "Jalapeño-cheddar sausage", category: "Proteins", unit: "lb", unitPrice: 6.99 },
  { id: "eggs", name: "Eggs", category: "Proteins", unit: "dozen", unitPrice: 3.99 },

  /* Produce */
  { id: "onion-yellow", name: "Yellow onions", category: "Produce", unit: "lb", unitPrice: 1.29 },
  { id: "onion-red", name: "Red onions", category: "Produce", unit: "lb", unitPrice: 1.69 },
  { id: "cilantro", name: "Cilantro", category: "Produce", unit: "bunch", unitPrice: 0.99 },
  { id: "lime", name: "Limes", category: "Produce", unit: "each", unitPrice: 0.40 },
  { id: "avocado", name: "Avocados", category: "Produce", unit: "each", unitPrice: 1.25 },
  { id: "tomato", name: "Roma tomatoes", category: "Produce", unit: "lb", unitPrice: 1.99 },
  { id: "tomatillo", name: "Tomatillos", category: "Produce", unit: "lb", unitPrice: 2.49 },
  { id: "jalapeno", name: "Jalapeños", category: "Produce", unit: "lb", unitPrice: 1.99 },
  { id: "corn-ear", name: "Corn on the cob", category: "Produce", unit: "each", unitPrice: 0.69 },
  { id: "cabbage", name: "Green cabbage", category: "Produce", unit: "lb", unitPrice: 0.99 },
  { id: "potato", name: "Potatoes", category: "Produce", unit: "lb", unitPrice: 1.19 },
  { id: "fruit-mix", name: "Fresh fruit (mixed)", category: "Produce", unit: "lb", unitPrice: 3.49 },
  { id: "garlic", name: "Garlic", category: "Produce", unit: "lb", unitPrice: 4.99 },

  /* Dairy & Cheese */
  { id: "cotija", name: "Cotija cheese", category: "Dairy & Cheese", unit: "lb", unitPrice: 7.99 },
  { id: "queso-blanco", name: "Queso blanco", category: "Dairy & Cheese", unit: "lb", unitPrice: 6.49 },
  { id: "cheddar", name: "Shredded cheddar", category: "Dairy & Cheese", unit: "lb", unitPrice: 5.49 },
  { id: "monterey-jack", name: "Monterey jack", category: "Dairy & Cheese", unit: "lb", unitPrice: 5.99 },
  { id: "crema", name: "Mexican crema", category: "Dairy & Cheese", unit: "qt", unitPrice: 4.49 },
  { id: "sour-cream", name: "Sour cream", category: "Dairy & Cheese", unit: "qt", unitPrice: 3.49 },
  { id: "butter", name: "Butter", category: "Dairy & Cheese", unit: "lb", unitPrice: 4.49 },

  /* Tortillas & Bread */
  { id: "corn-tortilla", name: "Corn tortillas", category: "Tortillas & Bread", unit: "dozen", unitPrice: 1.49 },
  { id: "flour-tortilla", name: "Flour tortillas", category: "Tortillas & Bread", unit: "dozen", unitPrice: 2.99 },
  { id: "slider-bun", name: "Slider rolls", category: "Tortillas & Bread", unit: "dozen", unitPrice: 3.49 },
  { id: "cornbread-mix", name: "Cornbread mix", category: "Tortillas & Bread", unit: "package", unitPrice: 2.49 },

  /* Pantry & Dry */
  { id: "rice", name: "Long-grain rice", category: "Pantry & Dry", unit: "lb", unitPrice: 1.29 },
  { id: "pinto-beans", name: "Pinto beans (dry)", category: "Pantry & Dry", unit: "lb", unitPrice: 1.49 },
  { id: "black-beans", name: "Black beans (dry)", category: "Pantry & Dry", unit: "lb", unitPrice: 1.59 },
  { id: "elbow-pasta", name: "Elbow macaroni", category: "Pantry & Dry", unit: "lb", unitPrice: 1.29 },
  { id: "tortilla-chips", name: "Tortilla chips", category: "Pantry & Dry", unit: "lb", unitPrice: 3.49 },
  { id: "bbq-sauce", name: "BBQ sauce", category: "Pantry & Dry", unit: "qt", unitPrice: 3.99 },
  { id: "cooking-oil", name: "Cooking oil", category: "Pantry & Dry", unit: "qt", unitPrice: 3.49 },
  { id: "bbq-rub", name: "BBQ rub & spices", category: "Pantry & Dry", unit: "lb", unitPrice: 8.99 },
  { id: "chocolate", name: "Mexican chocolate", category: "Pantry & Dry", unit: "lb", unitPrice: 4.99 },
  { id: "churro-mix", name: "Churro / dough mix", category: "Pantry & Dry", unit: "lb", unitPrice: 2.99 },

  /* Drinks */
  { id: "horchata-mix", name: "Horchata mix", category: "Drinks", unit: "lb", unitPrice: 4.49 },
  { id: "hibiscus", name: "Hibiscus (jamaica)", category: "Drinks", unit: "lb", unitPrice: 6.99 },
  { id: "cold-brew", name: "Cold brew coffee", category: "Drinks", unit: "lb", unitPrice: 8.99 },

  /* Added ingredients (cocktail bites, brunch, condiments & desserts) */
  { id: "shrimp", name: "Shrimp (peeled)", category: "Proteins", unit: "lb", unitPrice: 9.99 },
  { id: "lobster", name: "Lobster meat", category: "Proteins", unit: "lb", unitPrice: 24.99 },
  { id: "lettuce", name: "Lettuce", category: "Produce", unit: "lb", unitPrice: 1.49 },
  { id: "bell-pepper", name: "Bell peppers", category: "Produce", unit: "lb", unitPrice: 1.99 },
  { id: "seasonal-veg", name: "Seasonal vegetables (mixed)", category: "Produce", unit: "lb", unitPrice: 2.49 },
  { id: "pineapple", name: "Pineapple", category: "Produce", unit: "lb", unitPrice: 1.79 },
  { id: "apples", name: "Apples", category: "Produce", unit: "lb", unitPrice: 1.99 },
  { id: "peaches", name: "Peaches (canned)", category: "Produce", unit: "lb", unitPrice: 1.69 },
  { id: "cream-cheese", name: "Cream cheese", category: "Dairy & Cheese", unit: "lb", unitPrice: 4.49 },
  { id: "white-bread", name: "Bread loaf (Texas toast)", category: "Tortillas & Bread", unit: "each", unitPrice: 2.99 },
  { id: "masa-harina", name: "Masa harina", category: "Pantry & Dry", unit: "lb", unitPrice: 1.29 },
  { id: "vinegar", name: "Vinegar", category: "Pantry & Dry", unit: "qt", unitPrice: 2.49 },
  { id: "pickles", name: "Pickles", category: "Pantry & Dry", unit: "qt", unitPrice: 3.49 },
  { id: "crackers", name: "Artisan crackers", category: "Pantry & Dry", unit: "lb", unitPrice: 4.49 },
  { id: "nuts", name: "Mixed smoked nuts", category: "Pantry & Dry", unit: "lb", unitPrice: 7.99 },
  { id: "salsa-macha", name: "Salsa macha", category: "Pantry & Dry", unit: "qt", unitPrice: 6.99 },
];

/* ── Seed nutrition (per ONE purchase unit) ──────────────────────
 * Editable estimates, keyed by inventory id. Values are for a whole purchase
 * unit (e.g. one lb, one dozen, one each, one qt). Raw/uncooked where relevant.
 * Keep them rough — they power "cool stats", not a medical label.
 */
const nf = (
  calories: number, protein: number, carbs: number, fat: number, fiber: number, sodium: number,
): NutritionFacts => ({ calories, protein, carbs, fat, fiber, sodium });

export const seedNutrition: Record<string, NutritionFacts> = {
  /* Proteins (per lb raw, eggs per dozen) */
  "beef-brisket": nf(1230, 82, 0, 100, 0, 320),
  "beef-chuck": nf(1110, 86, 0, 82, 0, 300),
  "beef-short-rib": nf(1400, 70, 0, 125, 0, 290),
  "picanha": nf(1010, 90, 0, 70, 0, 270),
  "skirt-steak": nf(1090, 95, 0, 77, 0, 360),
  "pork-shoulder": nf(1170, 80, 0, 95, 0, 290),
  "pork-belly": nf(2400, 45, 0, 245, 0, 140),
  "bacon": nf(2400, 65, 4, 220, 0, 6000),
  "st-louis-ribs": nf(1500, 80, 0, 130, 0, 380),
  "chicken-thighs": nf(850, 75, 0, 60, 0, 360),
  "chicken-breast": nf(750, 145, 0, 16, 0, 320),
  "turkey-breast": nf(680, 150, 0, 7, 0, 500),
  "chorizo": nf(2000, 110, 8, 170, 0, 3500),
  "jalapeno-sausage": nf(1450, 80, 6, 125, 0, 3200),
  "eggs": nf(840, 72, 6, 60, 0, 840),

  /* Produce (per lb, or per each/bunch as priced) */
  "onion-yellow": nf(180, 5, 42, 0, 8, 18),
  "onion-red": nf(180, 5, 42, 0, 8, 18),
  "cilantro": nf(12, 1, 2, 0, 1, 25),
  "lime": nf(20, 0.5, 7, 0, 2, 1),
  "avocado": nf(240, 3, 13, 22, 10, 11),
  "tomato": nf(82, 4, 18, 1, 5, 23),
  "tomatillo": nf(146, 4, 26, 5, 8, 5),
  "jalapeno": nf(130, 4, 30, 2, 12, 14),
  "corn-ear": nf(80, 3, 19, 1, 2, 13),
  "cabbage": nf(113, 6, 26, 0, 11, 82),
  "potato": nf(350, 9, 80, 0, 10, 27),
  "fruit-mix": nf(270, 3, 68, 1, 10, 5),
  "garlic": nf(675, 29, 150, 2, 9, 78),

  /* Dairy & Cheese (per lb, crema/sour cream per qt) */
  "cotija": nf(1750, 110, 18, 140, 0, 6500),
  "queso-blanco": nf(1500, 100, 12, 115, 0, 5000),
  "cheddar": nf(1820, 113, 6, 150, 0, 3100),
  "monterey-jack": nf(1700, 110, 3, 137, 0, 2700),
  "crema": nf(1900, 18, 30, 190, 0, 700),
  "sour-cream": nf(1860, 23, 40, 180, 0, 850),
  "butter": nf(3250, 4, 0, 368, 0, 50),

  /* Tortillas & Bread (per dozen, cornbread per package) */
  "corn-tortilla": nf(600, 16, 130, 8, 18, 120),
  "flour-tortilla": nf(1680, 44, 280, 40, 12, 3000),
  "slider-bun": nf(1440, 48, 270, 18, 12, 2400),
  "cornbread-mix": nf(1600, 24, 320, 24, 8, 2800),

  /* Pantry & Dry (per lb dry, sauces/oil per qt) */
  "rice": nf(1640, 30, 360, 4, 6, 25),
  "pinto-beans": nf(1560, 100, 280, 6, 70, 50),
  "black-beans": nf(1560, 100, 280, 6, 70, 25),
  "elbow-pasta": nf(1660, 58, 333, 8, 14, 30),
  "tortilla-chips": nf(2200, 30, 290, 100, 18, 1900),
  "bbq-sauce": nf(1100, 5, 270, 2, 5, 9000),
  "cooking-oil": nf(7800, 0, 0, 880, 0, 0),
  "bbq-rub": nf(1200, 20, 250, 10, 40, 20000),
  "chocolate": nf(2400, 30, 270, 150, 30, 80),
  "churro-mix": nf(1700, 40, 360, 20, 10, 1500),

  /* Drinks (per lb dry mix) */
  "horchata-mix": nf(1750, 10, 400, 5, 5, 200),
  "hibiscus": nf(220, 1, 50, 0, 5, 15),
  "cold-brew": nf(20, 2, 0, 0, 0, 50),

  /* Added ingredients */
  "shrimp": nf(480, 90, 4, 8, 0, 1400),
  "lobster": nf(400, 85, 6, 4, 0, 1700),
  "lettuce": nf(70, 5, 13, 1, 6, 130),
  "bell-pepper": nf(140, 5, 27, 1, 9, 18),
  "seasonal-veg": nf(160, 8, 32, 1, 12, 60),
  "pineapple": nf(230, 2, 60, 1, 7, 5),
  "apples": nf(240, 1, 64, 1, 11, 5),
  "peaches": nf(330, 2, 84, 0, 5, 30),
  "cream-cheese": nf(1580, 28, 25, 154, 0, 1450),
  "white-bread": nf(1200, 40, 230, 14, 10, 2200),
  "masa-harina": nf(1630, 38, 340, 16, 30, 20),
  "vinegar": nf(180, 0, 1, 0, 0, 20),
  "pickles": nf(80, 2, 16, 0, 4, 6000),
  "crackers": nf(2000, 36, 320, 60, 12, 2400),
  "nuts": nf(2600, 90, 90, 230, 35, 1800),
  "salsa-macha": nf(3200, 40, 80, 310, 30, 4000),
};

/**
 * Inventory seed with nutrition attached. Kept separate from the base array so
 * the (long) price list and the (long) nutrition list each stay readable.
 */
export const seedInventory: InventoryItem[] = seedInventoryBase.map((it) => ({
  ...it,
  nutrition: seedNutrition[it.id] ?? emptyNutrition(),
}));

/* ── Seed recipes (per single guest serving) ─────────────────────
 * Quantities are the raw amount purchased per serving, in each item's unit.
 * Smoked meats account for cook loss (e.g. ~0.5 lb raw brisket → ~6 oz cooked).
 */
export const seedRecipes: DishRecipe[] = [
  /* Proteins */
  {
    id: "smoked-brisket", dish: "Smoked brisket", category: "Proteins", yieldNote: "~6 oz cooked / serving",
    ingredients: [ { inventoryId: "beef-brisket", qtyPerServing: 0.5 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "pulled-pork", dish: "Pulled pork", category: "Proteins", yieldNote: "~6 oz cooked / serving",
    ingredients: [ { inventoryId: "pork-shoulder", qtyPerServing: 0.5 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "st-louis-ribs", dish: "St. Louis ribs", category: "Proteins", yieldNote: "~1/3 rack / serving",
    ingredients: [ { inventoryId: "st-louis-ribs", qtyPerServing: 0.6 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 }, { inventoryId: "bbq-sauce", qtyPerServing: 0.03 } ],
  },
  {
    id: "smoked-chicken", dish: "Smoked chicken al carbon", category: "Proteins", yieldNote: "~5 oz cooked / serving",
    ingredients: [ { inventoryId: "chicken-thighs", qtyPerServing: 0.45 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "smoked-turkey", dish: "Smoked turkey breast", category: "Proteins", yieldNote: "~5 oz cooked / serving",
    ingredients: [ { inventoryId: "turkey-breast", qtyPerServing: 0.4 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "beef-short-rib", dish: "Smoked beef short rib", category: "Proteins", yieldNote: "~6 oz cooked / serving",
    ingredients: [ { inventoryId: "beef-short-rib", qtyPerServing: 0.55 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "jalapeno-sausage", dish: "Jalapeño-cheddar sausage", category: "Proteins",
    ingredients: [ { inventoryId: "jalapeno-sausage", qtyPerServing: 0.33 } ],
  },

  /* Tacos */
  {
    id: "birria-taco", dish: "Birria tacos", category: "Tacos", yieldNote: "~3 tacos / serving",
    ingredients: [ { inventoryId: "beef-chuck", qtyPerServing: 0.33 }, { inventoryId: "corn-tortilla", qtyPerServing: 0.25 }, { inventoryId: "onion-yellow", qtyPerServing: 0.03 }, { inventoryId: "cilantro", qtyPerServing: 0.1 }, { inventoryId: "lime", qtyPerServing: 0.3 } ],
  },
  {
    id: "carne-asada-taco", dish: "Carne asada tacos", category: "Tacos", yieldNote: "~3 tacos / serving",
    ingredients: [ { inventoryId: "skirt-steak", qtyPerServing: 0.33 }, { inventoryId: "corn-tortilla", qtyPerServing: 0.25 }, { inventoryId: "onion-red", qtyPerServing: 0.03 }, { inventoryId: "cilantro", qtyPerServing: 0.1 }, { inventoryId: "lime", qtyPerServing: 0.3 } ],
  },
  {
    id: "al-pastor-taco", dish: "Al pastor tacos", category: "Tacos", yieldNote: "~3 tacos / serving",
    ingredients: [ { inventoryId: "pork-shoulder", qtyPerServing: 0.33 }, { inventoryId: "corn-tortilla", qtyPerServing: 0.25 }, { inventoryId: "onion-yellow", qtyPerServing: 0.03 }, { inventoryId: "cilantro", qtyPerServing: 0.1 } ],
  },
  {
    id: "chorizo-breakfast-taco", dish: "Chorizo breakfast tacos", category: "Tacos", yieldNote: "~2 tacos / serving",
    ingredients: [ { inventoryId: "chorizo", qtyPerServing: 0.1 }, { inventoryId: "eggs", qtyPerServing: 0.17 }, { inventoryId: "corn-tortilla", qtyPerServing: 0.17 } ],
  },

  /* Sides */
  {
    id: "street-corn", dish: "Street corn esquites", category: "Sides",
    ingredients: [ { inventoryId: "corn-ear", qtyPerServing: 1 }, { inventoryId: "cotija", qtyPerServing: 0.03 }, { inventoryId: "crema", qtyPerServing: 0.02 }, { inventoryId: "lime", qtyPerServing: 0.2 } ],
  },
  {
    id: "pit-beans", dish: "Pit beans", category: "Sides",
    ingredients: [ { inventoryId: "pinto-beans", qtyPerServing: 0.1 }, { inventoryId: "onion-yellow", qtyPerServing: 0.02 } ],
  },
  {
    id: "cilantro-lime-rice", dish: "Cilantro-lime rice", category: "Sides",
    ingredients: [ { inventoryId: "rice", qtyPerServing: 0.12 }, { inventoryId: "lime", qtyPerServing: 0.2 }, { inventoryId: "cilantro", qtyPerServing: 0.05 } ],
  },
  {
    id: "smoked-mac", dish: "Smoked mac & cheese", category: "Sides",
    ingredients: [ { inventoryId: "elbow-pasta", qtyPerServing: 0.1 }, { inventoryId: "cheddar", qtyPerServing: 0.06 }, { inventoryId: "butter", qtyPerServing: 0.02 } ],
  },
  {
    id: "vinegar-slaw", dish: "Vinegar slaw", category: "Sides",
    ingredients: [ { inventoryId: "cabbage", qtyPerServing: 0.15 }, { inventoryId: "sour-cream", qtyPerServing: 0.02 } ],
  },
  {
    id: "cornbread", dish: "Honey-butter cornbread", category: "Sides",
    ingredients: [ { inventoryId: "cornbread-mix", qtyPerServing: 0.08 }, { inventoryId: "butter", qtyPerServing: 0.01 } ],
  },
  {
    id: "potato-salad", dish: "Potato salad", category: "Sides",
    ingredients: [ { inventoryId: "potato", qtyPerServing: 0.15 }, { inventoryId: "sour-cream", qtyPerServing: 0.02 } ],
  },

  /* Apps & Stations */
  {
    id: "guacamole", dish: "House guacamole", category: "Apps & Stations",
    ingredients: [ { inventoryId: "avocado", qtyPerServing: 0.5 }, { inventoryId: "lime", qtyPerServing: 0.25 }, { inventoryId: "onion-red", qtyPerServing: 0.02 }, { inventoryId: "cilantro", qtyPerServing: 0.05 } ],
  },
  {
    id: "smoked-queso", dish: "Smoked queso", category: "Apps & Stations",
    ingredients: [ { inventoryId: "queso-blanco", qtyPerServing: 0.08 }, { inventoryId: "jalapeno", qtyPerServing: 0.02 } ],
  },
  {
    id: "chips-salsa", dish: "Chips & salsa", category: "Apps & Stations",
    ingredients: [ { inventoryId: "tortilla-chips", qtyPerServing: 0.1 }, { inventoryId: "tomato", qtyPerServing: 0.1 }, { inventoryId: "tomatillo", qtyPerServing: 0.05 } ],
  },

  /* Dessert */
  {
    id: "churros", dish: "Churro bites", category: "Dessert",
    ingredients: [ { inventoryId: "churro-mix", qtyPerServing: 0.08 }, { inventoryId: "cooking-oil", qtyPerServing: 0.02 }, { inventoryId: "chocolate", qtyPerServing: 0.02 } ],
  },
  {
    id: "mexican-brownie", dish: "Mexican chocolate brownies", category: "Dessert",
    ingredients: [ { inventoryId: "chocolate", qtyPerServing: 0.05 }, { inventoryId: "butter", qtyPerServing: 0.02 } ],
  },

  /* Drinks */
  {
    id: "horchata", dish: "Horchata", category: "Drinks",
    ingredients: [ { inventoryId: "horchata-mix", qtyPerServing: 0.05 } ],
  },
  {
    id: "hibiscus-tea", dish: "Hibiscus tea", category: "Drinks",
    ingredients: [ { inventoryId: "hibiscus", qtyPerServing: 0.04 } ],
  },
  {
    id: "cold-brew-coffee", dish: "Cold brew coffee", category: "Drinks",
    ingredients: [ { inventoryId: "cold-brew", qtyPerServing: 0.05 } ],
  },

  /* Extra proteins / carving */
  {
    id: "picanha", dish: "Picanha", category: "Proteins", yieldNote: "~5 oz cooked / serving",
    ingredients: [ { inventoryId: "picanha", qtyPerServing: 0.4 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "smoked-pork-shoulder", dish: "Smoked pork shoulder", category: "Proteins", yieldNote: "~6 oz cooked / serving",
    ingredients: [ { inventoryId: "pork-shoulder", qtyPerServing: 0.5 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "chicken-tinga", dish: "Chicken tinga", category: "Proteins", yieldNote: "~5 oz cooked / serving",
    ingredients: [ { inventoryId: "chicken-thighs", qtyPerServing: 0.4 }, { inventoryId: "tomato", qtyPerServing: 0.05 }, { inventoryId: "onion-yellow", qtyPerServing: 0.02 }, { inventoryId: "bbq-rub", qtyPerServing: 0.01 } ],
  },
  {
    id: "maple-chipotle-pork", dish: "Maple-chipotle pork", category: "Proteins", yieldNote: "~6 oz cooked / serving",
    ingredients: [ { inventoryId: "pork-shoulder", qtyPerServing: 0.5 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "citrus-herb-chicken", dish: "Citrus-herb smoked chicken", category: "Proteins", yieldNote: "~5 oz cooked / serving",
    ingredients: [ { inventoryId: "chicken-thighs", qtyPerServing: 0.45 }, { inventoryId: "lime", qtyPerServing: 0.2 }, { inventoryId: "bbq-rub", qtyPerServing: 0.02 } ],
  },
  {
    id: "smoked-sausage", dish: "Smoked sausage", category: "Proteins",
    ingredients: [ { inventoryId: "jalapeno-sausage", qtyPerServing: 0.3 } ],
  },

  /* Cocktail-hour bites & stations */
  {
    id: "pork-belly-bites", dish: "Pork belly bites", category: "Apps & Stations",
    ingredients: [ { inventoryId: "pork-belly", qtyPerServing: 0.3 }, { inventoryId: "bbq-rub", qtyPerServing: 0.015 } ],
  },
  {
    id: "brisket-burnt-ends", dish: "Brisket burnt-end skewers", category: "Apps & Stations",
    ingredients: [ { inventoryId: "beef-brisket", qtyPerServing: 0.35 }, { inventoryId: "pineapple", qtyPerServing: 0.05 }, { inventoryId: "bbq-sauce", qtyPerServing: 0.02 } ],
  },
  {
    id: "pork-belly-skewers", dish: "Pork belly burnt-end skewers", category: "Apps & Stations",
    ingredients: [ { inventoryId: "pork-belly", qtyPerServing: 0.3 }, { inventoryId: "pineapple", qtyPerServing: 0.05 }, { inventoryId: "bbq-sauce", qtyPerServing: 0.02 } ],
  },
  {
    id: "jalapeno-poppers", dish: "Bacon-wrapped jalapeño poppers", category: "Apps & Stations",
    ingredients: [ { inventoryId: "bacon", qtyPerServing: 0.1 }, { inventoryId: "jalapeno", qtyPerServing: 0.05 }, { inventoryId: "cream-cheese", qtyPerServing: 0.03 } ],
  },
  {
    id: "pulled-pork-sliders", dish: "Pulled pork sliders", category: "Apps & Stations",
    ingredients: [ { inventoryId: "pork-shoulder", qtyPerServing: 0.3 }, { inventoryId: "slider-bun", qtyPerServing: 0.25 }, { inventoryId: "cabbage", qtyPerServing: 0.05 }, { inventoryId: "bbq-sauce", qtyPerServing: 0.02 } ],
  },
  {
    id: "brisket-tostada", dish: "Smoked brisket tostada", category: "Apps & Stations",
    ingredients: [ { inventoryId: "beef-brisket", qtyPerServing: 0.3 }, { inventoryId: "tortilla-chips", qtyPerServing: 0.05 }, { inventoryId: "cotija", qtyPerServing: 0.01 } ],
  },
  {
    id: "chicken-tinga-flauta", dish: "Chicken tinga flauta", category: "Apps & Stations",
    ingredients: [ { inventoryId: "chicken-thighs", qtyPerServing: 0.3 }, { inventoryId: "tomato", qtyPerServing: 0.04 }, { inventoryId: "corn-tortilla", qtyPerServing: 0.17 }, { inventoryId: "avocado", qtyPerServing: 0.1 } ],
  },
  {
    id: "street-corn-cup", dish: "Mini street corn cup", category: "Apps & Stations",
    ingredients: [ { inventoryId: "corn-ear", qtyPerServing: 0.5 }, { inventoryId: "cotija", qtyPerServing: 0.02 }, { inventoryId: "crema", qtyPerServing: 0.015 }, { inventoryId: "lime", qtyPerServing: 0.1 } ],
  },
  {
    id: "shrimp-taco", dish: "Smoked shrimp taco", category: "Tacos",
    ingredients: [ { inventoryId: "shrimp", qtyPerServing: 0.25 }, { inventoryId: "corn-tortilla", qtyPerServing: 0.17 }, { inventoryId: "cabbage", qtyPerServing: 0.05 }, { inventoryId: "lime", qtyPerServing: 0.2 } ],
  },
  {
    id: "birria-quesadilla", dish: "Birria quesadilla", category: "Tacos",
    ingredients: [ { inventoryId: "beef-chuck", qtyPerServing: 0.3 }, { inventoryId: "flour-tortilla", qtyPerServing: 0.17 }, { inventoryId: "monterey-jack", qtyPerServing: 0.05 } ],
  },
  {
    id: "mini-chicken-taco", dish: "Mini smoked chicken taco", category: "Tacos",
    ingredients: [ { inventoryId: "chicken-thighs", qtyPerServing: 0.3 }, { inventoryId: "corn-tortilla", qtyPerServing: 0.17 }, { inventoryId: "onion-yellow", qtyPerServing: 0.02 } ],
  },
  {
    id: "lobster-corn-cups", dish: "Lobster street corn cups", category: "Apps & Stations",
    ingredients: [ { inventoryId: "lobster", qtyPerServing: 0.15 }, { inventoryId: "corn-ear", qtyPerServing: 0.5 }, { inventoryId: "cotija", qtyPerServing: 0.02 }, { inventoryId: "crema", qtyPerServing: 0.015 } ],
  },

  /* Salsas, sauces & toppings */
  {
    id: "salsa-roja-side", dish: "Salsa roja", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "tomato", qtyPerServing: 0.08 }, { inventoryId: "jalapeno", qtyPerServing: 0.008 }, { inventoryId: "onion-yellow", qtyPerServing: 0.01 }, { inventoryId: "garlic", qtyPerServing: 0.004 } ],
  },
  {
    id: "salsa-verde-side", dish: "Tomatillo salsa verde", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "tomatillo", qtyPerServing: 0.08 }, { inventoryId: "jalapeno", qtyPerServing: 0.008 }, { inventoryId: "onion-yellow", qtyPerServing: 0.01 }, { inventoryId: "cilantro", qtyPerServing: 0.02 } ],
  },
  {
    id: "pico-de-gallo", dish: "Pico de gallo", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "tomato", qtyPerServing: 0.06 }, { inventoryId: "onion-red", qtyPerServing: 0.02 }, { inventoryId: "cilantro", qtyPerServing: 0.02 }, { inventoryId: "lime", qtyPerServing: 0.2 }, { inventoryId: "jalapeno", qtyPerServing: 0.004 } ],
  },
  {
    id: "salsa-macha-side", dish: "Salsa macha", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "salsa-macha", qtyPerServing: 0.015 } ],
  },
  {
    id: "bbq-sauce-side", dish: "House BBQ sauce", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "bbq-sauce", qtyPerServing: 0.03 } ],
  },
  {
    id: "carolina-vinegar", dish: "Carolina vinegar sauce", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "vinegar", qtyPerServing: 0.02 } ],
  },
  {
    id: "pickled-onion", dish: "Pickled red onion", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "onion-red", qtyPerServing: 0.03 }, { inventoryId: "vinegar", qtyPerServing: 0.01 } ],
  },
  {
    id: "house-pickles", dish: "House pickles", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "pickles", qtyPerServing: 0.03 } ],
  },
  {
    id: "crema-topping", dish: "Crema", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "crema", qtyPerServing: 0.02 } ],
  },
  {
    id: "cotija-topping", dish: "Cotija", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "cotija", qtyPerServing: 0.02 } ],
  },
  {
    id: "jalapenos-topping", dish: "Jalapeños", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "jalapeno", qtyPerServing: 0.02 } ],
  },
  {
    id: "lettuce-topping", dish: "Lettuce", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "lettuce", qtyPerServing: 0.03 } ],
  },
  {
    id: "tortilla-chips-side", dish: "Tortilla chips", category: "Salsas & Toppings",
    ingredients: [ { inventoryId: "tortilla-chips", qtyPerServing: 0.1 } ],
  },
  {
    id: "fresh-tortillas", dish: "Fresh tortillas", category: "Tortillas & Bread",
    ingredients: [ { inventoryId: "flour-tortilla", qtyPerServing: 0.25 } ],
  },
  {
    id: "soft-rolls", dish: "Soft rolls", category: "Tortillas & Bread",
    ingredients: [ { inventoryId: "slider-bun", qtyPerServing: 0.5 } ],
  },
  {
    id: "texas-toast", dish: "Texas toast", category: "Tortillas & Bread",
    ingredients: [ { inventoryId: "white-bread", qtyPerServing: 0.15 }, { inventoryId: "butter", qtyPerServing: 0.01 } ],
  },

  /* Extra sides */
  {
    id: "roasted-peppers", dish: "Roasted peppers", category: "Sides",
    ingredients: [ { inventoryId: "bell-pepper", qtyPerServing: 0.1 } ],
  },
  {
    id: "roasted-veg", dish: "Roasted seasonal vegetables", category: "Sides",
    ingredients: [ { inventoryId: "seasonal-veg", qtyPerServing: 0.18 } ],
  },
  {
    id: "smoked-nuts", dish: "Smoked nuts", category: "Apps & Stations",
    ingredients: [ { inventoryId: "nuts", qtyPerServing: 0.06 } ],
  },
  {
    id: "artisan-crackers", dish: "Artisan crackers", category: "Apps & Stations",
    ingredients: [ { inventoryId: "crackers", qtyPerServing: 0.05 } ],
  },
  {
    id: "fresh-fruit", dish: "Fresh fruit", category: "Sides",
    ingredients: [ { inventoryId: "fruit-mix", qtyPerServing: 0.25 } ],
  },
  {
    id: "masa-fries", dish: "Masa fries", category: "Sides",
    ingredients: [ { inventoryId: "masa-harina", qtyPerServing: 0.12 }, { inventoryId: "cooking-oil", qtyPerServing: 0.02 } ],
  },

  /* Brunch & breakfast */
  {
    id: "breakfast-burrito", dish: "Breakfast burritos", category: "Breakfast",
    ingredients: [ { inventoryId: "eggs", qtyPerServing: 0.25 }, { inventoryId: "flour-tortilla", qtyPerServing: 0.25 }, { inventoryId: "potato", qtyPerServing: 0.08 }, { inventoryId: "cheddar", qtyPerServing: 0.03 } ],
  },
  {
    id: "breakfast-potatoes", dish: "Smoked breakfast potatoes", category: "Breakfast",
    ingredients: [ { inventoryId: "potato", qtyPerServing: 0.2 }, { inventoryId: "cooking-oil", qtyPerServing: 0.01 } ],
  },
  {
    id: "scrambled-eggs", dish: "Scrambled eggs", category: "Breakfast",
    ingredients: [ { inventoryId: "eggs", qtyPerServing: 0.33 } ],
  },
  {
    id: "brisket-hash", dish: "Smoked brisket breakfast hash", category: "Breakfast",
    ingredients: [ { inventoryId: "beef-brisket", qtyPerServing: 0.25 }, { inventoryId: "potato", qtyPerServing: 0.15 }, { inventoryId: "onion-yellow", qtyPerServing: 0.03 } ],
  },
  {
    id: "brisket-egg-taco", dish: "Brisket & egg breakfast tacos", category: "Breakfast",
    ingredients: [ { inventoryId: "beef-brisket", qtyPerServing: 0.2 }, { inventoryId: "eggs", qtyPerServing: 0.17 }, { inventoryId: "corn-tortilla", qtyPerServing: 0.17 } ],
  },

  /* Extra desserts */
  {
    id: "sopapillas", dish: "Cinnamon sugar sopapillas", category: "Dessert",
    ingredients: [ { inventoryId: "churro-mix", qtyPerServing: 0.07 }, { inventoryId: "cooking-oil", qtyPerServing: 0.02 } ],
  },
  {
    id: "peach-cobbler", dish: "Peach cobbler", category: "Dessert",
    ingredients: [ { inventoryId: "peaches", qtyPerServing: 0.2 }, { inventoryId: "cornbread-mix", qtyPerServing: 0.05 }, { inventoryId: "butter", qtyPerServing: 0.015 } ],
  },
  {
    id: "apple-crisp", dish: "Apple crisp", category: "Dessert",
    ingredients: [ { inventoryId: "apples", qtyPerServing: 0.2 }, { inventoryId: "churro-mix", qtyPerServing: 0.04 }, { inventoryId: "butter", qtyPerServing: 0.015 } ],
  },
  {
    id: "chocolate-cake", dish: "Mexican chocolate cake", category: "Dessert",
    ingredients: [ { inventoryId: "chocolate", qtyPerServing: 0.05 }, { inventoryId: "butter", qtyPerServing: 0.02 }, { inventoryId: "eggs", qtyPerServing: 0.08 } ],
  },
];

/* ── Cost / grocery-list math ─────────────────────────────────── */

/** Index inventory items by id for fast lookup. */
export function inventoryById(items: InventoryItem[]): Record<string, InventoryItem> {
  const map: Record<string, InventoryItem> = {};
  for (const it of items) map[it.id] = it;
  return map;
}

/** Food cost of one serving of a dish, given current inventory prices. */
export function dishCostPerServing(
  recipe: DishRecipe,
  map: Record<string, InventoryItem>,
): number {
  return recipe.ingredients.reduce((sum, ing) => {
    const item = map[ing.inventoryId];
    if (!item) return sum;
    return sum + ing.qtyPerServing * item.unitPrice;
  }, 0);
}

/** A selected dish and how many servings of it are needed. */
export interface GrocerySelection {
  recipeId: string;
  servings: number;
}

/** One aggregated purchase line in a grocery list. */
export interface GroceryLine {
  inventoryId: string;
  name: string;
  category: InventoryCategory;
  unit: Unit;
  qty: number;
  unitPrice: number;
  cost: number;
}

export interface GroceryListResult {
  lines: GroceryLine[];
  byCategory: { category: InventoryCategory; lines: GroceryLine[]; subtotal: number }[];
  total: number;
}

/**
 * Aggregate a set of dish selections into a consolidated grocery list:
 * total quantity + cost per ingredient, grouped by category.
 */
export function buildGroceryList(
  selections: GrocerySelection[],
  recipes: DishRecipe[],
  items: InventoryItem[],
): GroceryListResult {
  const recipeMap: Record<string, DishRecipe> = {};
  for (const r of recipes) recipeMap[r.id] = r;
  const itemMap = inventoryById(items);

  // Sum required quantity per ingredient across all selected dishes.
  const qtyByItem: Record<string, number> = {};
  for (const sel of selections) {
    const recipe = recipeMap[sel.recipeId];
    if (!recipe || !sel.servings) continue;
    for (const ing of recipe.ingredients) {
      qtyByItem[ing.inventoryId] =
        (qtyByItem[ing.inventoryId] ?? 0) + ing.qtyPerServing * sel.servings;
    }
  }

  const lines: GroceryLine[] = Object.entries(qtyByItem)
    .map(([inventoryId, qty]) => {
      const item = itemMap[inventoryId];
      if (!item) return null;
      return {
        inventoryId,
        name: item.name,
        category: item.category,
        unit: item.unit,
        qty,
        unitPrice: item.unitPrice,
        cost: qty * item.unitPrice,
      } satisfies GroceryLine;
    })
    .filter((l): l is GroceryLine => l !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  const byCategory = INVENTORY_CATEGORIES.map((category) => {
    const catLines = lines.filter((l) => l.category === category);
    return {
      category,
      lines: catLines,
      subtotal: catLines.reduce((s, l) => s + l.cost, 0),
    };
  }).filter((g) => g.lines.length > 0);

  const total = lines.reduce((s, l) => s + l.cost, 0);
  return { lines, byCategory, total };
}

/** Format a dollar amount as USD, e.g. 1234.5 → "$1,234.50". */
export function money(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ── Nutrition math ───────────────────────────────────────────── */

/** Add `b` (optionally scaled) into `a`, returning a new NutritionFacts. */
export function addNutrition(a: NutritionFacts, b: NutritionFacts, scale = 1): NutritionFacts {
  return {
    calories: a.calories + b.calories * scale,
    protein: a.protein + b.protein * scale,
    carbs: a.carbs + b.carbs * scale,
    fat: a.fat + b.fat * scale,
    fiber: a.fiber + b.fiber * scale,
    sodium: a.sodium + b.sodium * scale,
  };
}

/** Nutrition of ONE serving of a dish, from current inventory nutrition. */
export function dishNutritionPerServing(
  recipe: DishRecipe,
  map: Record<string, InventoryItem>,
): NutritionFacts {
  return recipe.ingredients.reduce((total, ing) => {
    const item = map[ing.inventoryId];
    if (!item?.nutrition) return total;
    return addNutrition(total, item.nutrition, ing.qtyPerServing);
  }, emptyNutrition());
}

/**
 * Roll a set of dish selections (recipeId + servings) into the total nutrition
 * served and the average nutrition per serving.
 */
export function aggregateNutrition(
  selections: GrocerySelection[],
  recipes: DishRecipe[],
  items: InventoryItem[],
): { total: NutritionFacts; perServing: NutritionFacts; servings: number } {
  const recipeMap: Record<string, DishRecipe> = {};
  for (const r of recipes) recipeMap[r.id] = r;
  const itemMap = inventoryById(items);

  let total = emptyNutrition();
  let servings = 0;
  for (const sel of selections) {
    const recipe = recipeMap[sel.recipeId];
    if (!recipe || !sel.servings) continue;
    const per = dishNutritionPerServing(recipe, itemMap);
    total = addNutrition(total, per, sel.servings);
    servings = Math.max(servings, sel.servings);
  }
  const perServing = servings > 0
    ? {
        calories: total.calories / servings,
        protein: total.protein / servings,
        carbs: total.carbs / servings,
        fat: total.fat / servings,
        fiber: total.fiber / servings,
        sodium: total.sodium / servings,
      }
    : emptyNutrition();
  return { total, perServing, servings };
}

/** Round a nutrition value for display (sodium/calories whole, macros 1dp). */
export function fmtNutrient(key: keyof NutritionFacts, value: number): string {
  if (key === "calories" || key === "sodium") return Math.round(value).toLocaleString("en-US");
  return (Math.round(value * 10) / 10).toLocaleString("en-US");
}

/* ── Auto-matching menu items → dish recipes ──────────────────────
 * Menu items already name the dishes they offer (as the item name, or as a
 * list of options). Rather than hand-linking, we fuzzy-match those names to
 * dish recipes so ingredient cost & nutrition are accounted for automatically.
 */

/** Anything that names dishes: a menu item (name + optional options/choose). */
export interface DishMatchable {
  name: string;
  choose?: string;
  options?: string[];
}

/** Lowercase, drop punctuation and a few filler words for name comparison. */
export function normalizeDishName(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|with|our|house|fresh|style|served|whole|half|prime|premium)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    // light singular/plural stemming so "skewers"/"skewer", "bites"/"bite" match
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w))
    .filter(Boolean)
    .join(" ");
}

function dishTokens(s: string): string[] {
  return normalizeDishName(s).split(" ").filter(Boolean);
}

/** Similarity 0–1 between two dish names: exact > containment > token overlap. */
function dishScore(a: string, b: string): number {
  const na = normalizeDishName(a);
  const nb = normalizeDishName(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  const ta = new Set(dishTokens(a));
  const tb = new Set(dishTokens(b));
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const union = new Set([...ta, ...tb]).size;
  return union ? inter / union : 0;
}

/** Best-matching dish recipe for a free-text dish/option name, if confident. */
export function matchRecipe(
  name: string,
  recipes: DishRecipe[],
  threshold = 0.5,
): DishRecipe | undefined {
  // Options often read "Dish name — garnish, garnish"; match on the lead phrase.
  const head = name.split(/[—–]|,/)[0] ?? name;
  let best: DishRecipe | undefined;
  let bestScore = 0;
  for (const r of recipes) {
    const sc = dishScore(head, r.dish);
    if (sc > bestScore) {
      bestScore = sc;
      best = r;
    }
  }
  return bestScore >= threshold ? best : undefined;
}

/** The dish/option names a menu item offers (its options, else its own name). */
export function menuItemDishNames(item: DishMatchable): string[] {
  if (item.options && item.options.length) return item.options.filter(Boolean);
  return item.name ? [item.name] : [];
}

/** Parse "Choose two" / "Choose 3" → a number, or null if not a chooser. */
export function parseChooseCount(choose?: string): number | null {
  if (!choose) return null;
  const lower = choose.toLowerCase();
  const digit = lower.match(/\d+/);
  if (digit) return parseInt(digit[0], 10);
  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 };
  for (const [w, num] of Object.entries(words)) if (lower.includes(w)) return num;
  return null;
}

/** Per-guest servings of each matched recipe for one menu item. */
function menuItemWeights(item: DishMatchable, recipes: DishRecipe[]): Map<string, number> {
  const weights = new Map<string, number>();
  const matched = menuItemDishNames(item)
    .map((nm) => matchRecipe(nm, recipes))
    .filter((r): r is DishRecipe => !!r);
  if (matched.length === 0) return weights;
  const hasOptions = !!(item.options && item.options.length);
  const choose = parseChooseCount(item.choose);
  // A guest gets `pick` of the matched dishes; spread evenly across them.
  const pick = hasOptions ? Math.min(choose ?? matched.length, matched.length) : matched.length;
  const factor = matched.length > 0 ? pick / matched.length : 0;
  for (const r of matched) weights.set(r.id, (weights.get(r.id) ?? 0) + (hasOptions ? factor : 1));
  return weights;
}

/** Per-guest servings of each recipe across a whole package's items. */
export function packageDishWeights(items: DishMatchable[], recipes: DishRecipe[]): Map<string, number> {
  const total = new Map<string, number>();
  for (const item of items) {
    for (const [id, w] of menuItemWeights(item, recipes)) {
      total.set(id, (total.get(id) ?? 0) + w);
    }
  }
  return total;
}

/** Auto cost & nutrition estimate for a single menu item. */
export interface MenuItemEstimate {
  matched: DishRecipe[];
  unmatched: string[];
  perGuestCost: number;
  perGuestNutrition: NutritionFacts;
}

export function estimateMenuItem(
  item: DishMatchable,
  recipes: DishRecipe[],
  map: Record<string, InventoryItem>,
): MenuItemEstimate {
  const pairs = menuItemDishNames(item).map((nm) => ({ nm, recipe: matchRecipe(nm, recipes) }));
  const matched = pairs.filter((p) => p.recipe).map((p) => p.recipe!) as DishRecipe[];
  const unmatched = pairs.filter((p) => !p.recipe).map((p) => p.nm);
  const weights = menuItemWeights(item, recipes);
  let perGuestCost = 0;
  let perGuestNutrition = emptyNutrition();
  for (const [id, w] of weights) {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) continue;
    perGuestCost += dishCostPerServing(recipe, map) * w;
    perGuestNutrition = addNutrition(perGuestNutrition, dishNutritionPerServing(recipe, map), w);
  }
  return { matched, unmatched, perGuestCost, perGuestNutrition };
}
