/**
 * Editorial content for the Recipes and Blog sections.
 * Single source of truth — index pages, detail pages ([slug]),
 * and the sitemap all read from here.
 */

export interface Recipe {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  /** Hands-on + total time, e.g. "8 hours". */
  time: string;
  difficulty: "Easy" | "Intermediate" | "Advanced";
  /** How many it serves. */
  serves: string;
  intro: string[];
  ingredients: string[];
  steps: { title: string; body: string }[];
  tip: string;
  /** ISO date used for sitemap lastModified + ordering. */
  date: string;
}

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

/* ════════════════════════════════════════════════════════════════
   RECIPES
   ════════════════════════════════════════════════════════════════ */
export const recipes: Recipe[] = [
  {
    slug: "wood-fired-smoked-brisket",
    title: "Wood-Fired Smoked Brisket",
    excerpt:
      "The centerpiece of every Pit & Masa spread — a low-and-slow brisket with a deep bark and a smoke ring worth bragging about.",
    category: "From the Pit",
    image: "/images/food/food-086.webp",
    time: "12 hours",
    difficulty: "Advanced",
    serves: "10–12",
    date: "2026-05-01",
    intro: [
      "A great brisket isn't about a secret sauce — it's about patience, temperature control, and trusting the smoke. This is the same method we use on the pit, scaled down for a backyard smoker.",
      "Give yourself the whole day. Brisket is done when it's done, not when the clock says so.",
    ],
    ingredients: [
      "1 whole packer brisket (12–14 lbs), trimmed",
      "1/4 cup coarse kosher salt",
      "1/4 cup coarse ground black pepper",
      "2 tbsp garlic powder",
      "Yellow mustard, for binder",
      "Oak or hickory wood chunks",
      "Butcher paper, for the wrap",
    ],
    steps: [
      {
        title: "Trim and season",
        body: "Trim the fat cap to about 1/4 inch. Coat the brisket in a thin layer of mustard, then rub generously with an even mix of salt, pepper, and garlic powder. Let it sit at room temperature for 45 minutes.",
      },
      {
        title: "Fire the smoker",
        body: "Bring your smoker to a steady 250°F with oak or hickory. Place the brisket fat-side up and close the lid. Resist the urge to peek — every time you open it, you add time.",
      },
      {
        title: "Smoke to the stall",
        body: "Smoke until the internal temperature reaches about 165°F (6–8 hours). The bark should be dark and set. This is the 'stall' — temperature plateaus as moisture evaporates.",
      },
      {
        title: "Wrap and push through",
        body: "Wrap tightly in butcher paper and return to the smoker. Continue until the thickest part of the flat reaches 203°F and a probe slides in like soft butter.",
      },
      {
        title: "Rest — really rest",
        body: "Rest the wrapped brisket in a cooler for at least 1 hour, ideally 2. This is non-negotiable. Slice against the grain, separating the flat from the point.",
      },
    ],
    tip: "If your bark feels soft after wrapping, unwrap and run it back over the smoke for the last 20 minutes to tighten it up.",
  },
  {
    slug: "birria-tacos-consomme",
    title: "Birria Tacos with Consommé",
    excerpt:
      "Slow-braised, chili-rich beef folded into crispy cheese tacos and served with a deeply savory dipping broth.",
    category: "Tacos & Masa",
    image: "/images/food/food-108.webp",
    time: "4 hours",
    difficulty: "Intermediate",
    serves: "6",
    date: "2026-05-08",
    intro: [
      "Birria is all about the braise. The chilies do the heavy lifting, building a deep, layered consommé that doubles as both cooking liquid and the dip that makes these tacos unforgettable.",
      "Make it a day ahead if you can — birria only gets better overnight.",
    ],
    ingredients: [
      "3 lbs beef chuck roast, cut into large chunks",
      "4 dried guajillo chilies, stemmed and seeded",
      "2 dried ancho chilies, stemmed and seeded",
      "1 white onion, halved",
      "5 garlic cloves",
      "2 roma tomatoes",
      "2 tsp ground cumin",
      "1 tsp Mexican oregano",
      "2 bay leaves, 1 cinnamon stick",
      "Corn tortillas, Oaxaca cheese, white onion, and cilantro to serve",
    ],
    steps: [
      {
        title: "Build the chili base",
        body: "Toast the dried chilies in a dry pan until fragrant, then soak in hot water for 15 minutes. Blend with tomatoes, half the onion, garlic, cumin, and oregano until smooth.",
      },
      {
        title: "Braise the beef",
        body: "Sear the beef, then add the chili sauce, bay leaves, cinnamon, and enough water to cover. Braise covered at a low simmer for 3 hours, until the beef shreds easily.",
      },
      {
        title: "Separate and skim",
        body: "Shred the beef and set aside. Strain the broth (the consommé) and skim some of the bright orange fat from the top — you'll use it to crisp the tacos.",
      },
      {
        title: "Build and crisp",
        body: "Dip each tortilla in the reserved fat, lay it on a hot griddle, add cheese and beef, fold, and fry until crispy and golden on both sides.",
      },
      {
        title: "Serve with the dip",
        body: "Plate the tacos with a bowl of warm consommé topped with diced onion and cilantro. Dip, bite, repeat.",
      },
    ],
    tip: "Don't toss the fat you skim — that's liquid gold for crisping the tortillas and gives birria tacos their signature color.",
  },
  {
    slug: "mexican-street-corn-elote",
    title: "Mexican Street Corn (Elote)",
    excerpt:
      "Charred corn slathered in a creamy, tangy, chili-lime sauce and showered with cotija. The side that disappears first.",
    category: "Sides & Fixings",
    image: "/images/food/food-015.webp",
    time: "25 minutes",
    difficulty: "Easy",
    serves: "6",
    date: "2026-05-15",
    intro: [
      "Elote is proof that a side dish can steal the show. The magic is in the contrast — sweet charred corn against a salty, tangy, spicy sauce.",
      "Grill the corn hot and fast so it chars without going mushy.",
    ],
    ingredients: [
      "6 ears of corn, husked",
      "1/2 cup mayonnaise",
      "1/2 cup Mexican crema (or sour cream)",
      "1 cup cotija cheese, crumbled",
      "1 tsp chili powder",
      "1 lime, cut into wedges",
      "Fresh cilantro, chopped",
    ],
    steps: [
      {
        title: "Char the corn",
        body: "Grill the corn over high heat, turning often, until charred in spots all around — about 10 minutes.",
      },
      {
        title: "Mix the sauce",
        body: "Whisk together the mayonnaise and crema. This is the glue that holds everything to the corn.",
      },
      {
        title: "Slather and dust",
        body: "Brush each ear generously with the sauce, then roll in cotija. Dust with chili powder.",
      },
      {
        title: "Finish bright",
        body: "Squeeze lime over the top and scatter with cilantro. Serve immediately while hot.",
      },
    ],
    tip: "No grill? A cast-iron pan over high heat or a few minutes under the broiler gives you the same char.",
  },
  {
    slug: "smoked-pulled-pork",
    title: "Smoked Pulled Pork",
    excerpt:
      "Forgiving, crowd-feeding, and endlessly versatile — a smoked pork shoulder that pulls apart into tender, smoky strands.",
    category: "From the Pit",
    image: "/images/food/food-042.webp",
    time: "10 hours",
    difficulty: "Intermediate",
    serves: "10–14",
    date: "2026-05-22",
    intro: [
      "If brisket is the showpiece, pulled pork is the workhorse. Pork shoulder is fatty and forgiving, which makes it the perfect first big smoke.",
      "It feeds a crowd, reheats beautifully, and works in tacos, sandwiches, or straight off the cutting board.",
    ],
    ingredients: [
      "1 bone-in pork shoulder (8–10 lbs)",
      "1/4 cup brown sugar",
      "2 tbsp kosher salt",
      "2 tbsp smoked paprika",
      "1 tbsp black pepper",
      "1 tbsp garlic powder",
      "1 tbsp onion powder",
      "Apple or cherry wood chunks",
    ],
    steps: [
      {
        title: "Rub it down",
        body: "Combine the dry rub ingredients and coat the shoulder on all sides. Wrap and refrigerate overnight for the deepest flavor.",
      },
      {
        title: "Low and slow",
        body: "Smoke at 250°F with apple or cherry wood, fat-side up, until the internal temperature hits 165°F (about 6 hours).",
      },
      {
        title: "Wrap to finish",
        body: "Wrap in foil with a splash of apple juice and return to the smoker until it reaches 203°F and feels probe-tender.",
      },
      {
        title: "Rest and pull",
        body: "Rest for at least an hour, then pull apart with forks or gloved hands, discarding any large fat pockets.",
      },
    ],
    tip: "Save the juices from the foil wrap and mix them back into the pulled pork — it's the easiest way to keep it moist and flavorful.",
  },
  {
    slug: "house-salsa-roja",
    title: "House Salsa Roja",
    excerpt:
      "A smoky, roasted red salsa with just enough heat. The all-purpose salsa we reach for on every taco bar.",
    category: "Sides & Fixings",
    image: "/images/food/food-083.webp",
    time: "20 minutes",
    difficulty: "Easy",
    serves: "8",
    date: "2026-05-29",
    intro: [
      "A good salsa roja is the backbone of a taco bar. Roasting the vegetables first gives it a smoky depth you simply can't get from raw.",
      "Adjust the heat by keeping or removing the chili seeds.",
    ],
    ingredients: [
      "6 roma tomatoes",
      "2 dried arbol chilies (or 1 fresh serrano)",
      "1/2 white onion",
      "3 garlic cloves, unpeeled",
      "Juice of 1 lime",
      "1/2 tsp salt, plus more to taste",
      "Small handful of cilantro",
    ],
    steps: [
      {
        title: "Char the vegetables",
        body: "Roast the tomatoes, onion, and garlic in a dry cast-iron pan until blistered and softened. Peel the garlic once cool.",
      },
      {
        title: "Toast the chilies",
        body: "Briefly toast the dried chilies until fragrant — just a few seconds per side so they don't turn bitter.",
      },
      {
        title: "Blend",
        body: "Combine everything in a blender with lime juice and salt. Pulse to your preferred texture — chunky or smooth.",
      },
      {
        title: "Rest and taste",
        body: "Let it sit 10 minutes for the flavors to marry, then adjust salt and lime before serving.",
      },
    ],
    tip: "Make a double batch — this salsa keeps for a week in the fridge and gets better after a day.",
  },
  {
    slug: "carne-asada-tacos",
    title: "Carne Asada Tacos",
    excerpt:
      "Citrus-marinated, char-grilled steak chopped into smoky, juicy tacos with onion, cilantro, and lime.",
    category: "Tacos & Masa",
    image: "/images/food/food-006.webp",
    time: "1 hour 30 minutes",
    difficulty: "Easy",
    serves: "6",
    date: "2026-06-05",
    intro: [
      "Carne asada is fast, bright, and built for a hot grill. The marinade does most of the work — citrus and garlic tenderize while the char brings the smoke.",
      "Keep the toppings simple. Great steak doesn't need much.",
    ],
    ingredients: [
      "2 lbs skirt or flank steak",
      "Juice of 2 oranges and 2 limes",
      "4 garlic cloves, minced",
      "1/4 cup chopped cilantro",
      "2 tbsp olive oil",
      "1 tsp cumin, 1 tsp salt",
      "Corn tortillas, diced onion, cilantro, and lime to serve",
    ],
    steps: [
      {
        title: "Marinate",
        body: "Whisk the citrus juice, garlic, cilantro, oil, cumin, and salt. Marinate the steak for 1–4 hours — no longer, or the citrus starts to 'cook' the meat.",
      },
      {
        title: "Grill hot",
        body: "Get the grill screaming hot. Grill the steak 3–4 minutes per side for a good char and a medium-rare center.",
      },
      {
        title: "Rest and chop",
        body: "Rest the steak for 5 minutes, then slice against the grain and chop into bite-sized pieces.",
      },
      {
        title: "Build",
        body: "Pile onto warm tortillas with onion, cilantro, and a squeeze of lime. Done.",
      },
    ],
    tip: "Warm your tortillas directly over the grill flame for 10 seconds a side — that little char makes all the difference.",
  },
  {
    slug: "smoked-baby-back-ribs",
    title: "Smoked Baby Back Ribs",
    excerpt:
      "Tender, glazed baby backs with a sticky bark and a clean bite — the 3-2-1 method made foolproof for the backyard.",
    category: "From the Pit",
    image: "/images/food/food-038.webp",
    time: "6 hours",
    difficulty: "Intermediate",
    serves: "4–6",
    date: "2026-06-12",
    intro: [
      "Ribs are where a lot of pitmasters earn their stripes. The 3-2-1 method takes the guesswork out: three hours of smoke, two wrapped, one to glaze.",
      "Pull the membrane and you're already halfway to better ribs than most restaurants.",
    ],
    ingredients: [
      "2 racks baby back ribs",
      "2 tbsp yellow mustard, for binder",
      "1/4 cup brown sugar",
      "2 tbsp paprika",
      "1 tbsp kosher salt",
      "1 tbsp black pepper",
      "1 tbsp garlic powder",
      "Apple juice and BBQ sauce, to finish",
    ],
    steps: [
      {
        title: "Prep the racks",
        body: "Peel the silver membrane off the bone side. Coat with mustard, then rub all over with the combined sugar and spices.",
      },
      {
        title: "Smoke (the 3)",
        body: "Smoke bone-side down at 225°F for 3 hours, until the bark sets and the color deepens to mahogany.",
      },
      {
        title: "Wrap (the 2)",
        body: "Wrap in foil with a splash of apple juice and a sprinkle of brown sugar. Return for 2 hours to tenderize.",
      },
      {
        title: "Glaze (the 1)",
        body: "Unwrap, brush with BBQ sauce, and smoke 45–60 minutes more until the glaze is tacky and set.",
      },
    ],
    tip: "Test for doneness with the bend test — lift a rack from one end and it should crack slightly on the surface without falling apart.",
  },
  {
    slug: "achiote-chicken-tacos",
    title: "Achiote Chicken Tacos",
    excerpt:
      "Earthy, citrusy achiote-marinated chicken thighs grilled and chopped into vibrant, juicy tacos.",
    category: "Tacos & Masa",
    image: "/images/food/food-036.webp",
    time: "2 hours",
    difficulty: "Easy",
    serves: "6",
    date: "2026-06-13",
    intro: [
      "Achiote — ground annatto seed — gives this chicken its signature brick-red color and earthy, slightly peppery flavor. Paired with citrus, it's bright and deeply savory at once.",
      "Thighs stay juicy on a hot grill, making them the forgiving choice for tacos.",
    ],
    ingredients: [
      "2 lbs boneless, skinless chicken thighs",
      "3 tbsp achiote paste",
      "Juice of 2 oranges and 1 lime",
      "3 garlic cloves, minced",
      "1 tsp cumin, 1 tsp oregano",
      "1 tsp salt",
      "Corn tortillas, pickled onion, and cilantro to serve",
    ],
    steps: [
      {
        title: "Loosen the paste",
        body: "Whisk the achiote paste with the citrus juice until smooth, then stir in garlic, cumin, oregano, and salt.",
      },
      {
        title: "Marinate",
        body: "Coat the chicken in the marinade and refrigerate for at least 1 hour, up to overnight.",
      },
      {
        title: "Grill",
        body: "Grill over medium-high heat 5–6 minutes per side, until charred at the edges and cooked through.",
      },
      {
        title: "Chop and serve",
        body: "Rest a few minutes, chop into bite-sized pieces, and pile onto warm tortillas with pickled onion and cilantro.",
      },
    ],
    tip: "Achiote paste stains everything it touches — use a glass or plastic bowl and gloves to keep your hands and counters clean.",
  },
  {
    slug: "smoked-beef-short-ribs",
    title: "Smoked Beef Short Ribs",
    excerpt:
      "Big, beefy, fall-off-the-bone short ribs — the 'brisket on a stick' that's pure pit royalty.",
    category: "From the Pit",
    image: "/images/food/food-018.webp",
    time: "8 hours",
    difficulty: "Advanced",
    serves: "4",
    date: "2026-06-14",
    intro: [
      "Beef short ribs are the most decadent thing on the pit — rich, marbled, and impossibly tender when given the time they need.",
      "Keep the seasoning simple. With beef this good, salt and pepper is all you need.",
    ],
    ingredients: [
      "1 plate of beef short ribs (3–4 bones)",
      "2 tbsp coarse kosher salt",
      "2 tbsp coarse black pepper",
      "1 tbsp garlic powder",
      "Yellow mustard, for binder",
      "Oak wood chunks",
    ],
    steps: [
      {
        title: "Season heavy",
        body: "Coat the ribs in a thin layer of mustard, then season aggressively with the salt, pepper, and garlic powder. Beef can take it.",
      },
      {
        title: "Smoke steady",
        body: "Smoke at 250°F over oak, meat-side up, letting a thick black bark develop without touching them.",
      },
      {
        title: "Push to tender",
        body: "Cook until the internal temperature reaches 203–205°F and a probe slides between the meat like warm butter — usually 7–8 hours.",
      },
      {
        title: "Rest and serve",
        body: "Rest 45 minutes, then serve whole on the bone or sliced into thick, jiggly slabs.",
      },
    ],
    tip: "Buy USDA Prime or Choice plate ribs if you can find them — the extra marbling is what makes short ribs melt in your mouth.",
  },
  {
    slug: "esquites-mexican-street-corn-cup",
    title: "Esquites (Street Corn in a Cup)",
    excerpt:
      "All the magic of elote in a spoonable cup — charred corn, lime, crema, and cotija with a chili kick.",
    category: "Sides & Fixings",
    image: "/images/food/food-110.webp",
    time: "20 minutes",
    difficulty: "Easy",
    serves: "6",
    date: "2026-06-15",
    intro: [
      "Esquites is the handheld cousin of elote — same flavors, no mess on the chin. It's the perfect side for a buffet because it travels and holds beautifully.",
      "Char the corn hard for that signature smoky-sweet depth.",
    ],
    ingredients: [
      "5 cups corn kernels (fresh or frozen)",
      "2 tbsp butter",
      "1/3 cup mayonnaise",
      "1/3 cup Mexican crema",
      "1/2 cup cotija cheese, crumbled",
      "1 tsp chili powder",
      "Juice of 1 lime",
      "Cilantro, chopped",
    ],
    steps: [
      {
        title: "Char the corn",
        body: "Melt the butter in a hot cast-iron skillet and cook the corn undisturbed until charred, stirring occasionally — about 8 minutes.",
      },
      {
        title: "Dress it",
        body: "Off the heat, stir in mayonnaise, crema, half the cotija, chili powder, and lime juice.",
      },
      {
        title: "Cup and top",
        body: "Spoon into cups and finish with the remaining cotija, more chili powder, and cilantro.",
      },
    ],
    tip: "Frozen corn works great here — just make sure it's fully dry before it hits the pan so it chars instead of steams.",
  },
  {
    slug: "chile-beef-torta",
    title: "Chile Beef Torta",
    excerpt:
      "A loaded Mexican sandwich stacked with saucy chile beef, refried beans, avocado, and pickled jalapeños on a crusty roll.",
    category: "Tacos & Masa",
    image: "/images/food/food-106.webp",
    time: "1 hour",
    difficulty: "Easy",
    serves: "4",
    date: "2026-06-16",
    intro: [
      "The torta is Mexico's answer to the deli sandwich — a sturdy roll packed with bold fillings and layers of texture. Our chile beef version is messy in the best way.",
      "Toast the bread so it can stand up to all that juicy filling.",
    ],
    ingredients: [
      "1.5 lbs ground beef or shredded chuck",
      "2 tbsp adobo from chipotles in adobo",
      "1 tsp cumin, 1 tsp garlic powder",
      "4 telera or bolillo rolls",
      "1 cup refried beans, warmed",
      "1 avocado, sliced",
      "Pickled jalapeños, lettuce, tomato, and crema",
    ],
    steps: [
      {
        title: "Cook the beef",
        body: "Brown the beef, then stir in the adobo, cumin, and garlic powder. Simmer until saucy and well-seasoned.",
      },
      {
        title: "Toast the rolls",
        body: "Split the rolls and toast the cut sides on a griddle until golden and crisp.",
      },
      {
        title: "Layer it up",
        body: "Spread refried beans on the bottom, pile on the beef, then add avocado, jalapeños, lettuce, tomato, and a drizzle of crema.",
      },
      {
        title: "Press and serve",
        body: "Close the torta and press gently so it holds together. Cut in half and serve right away.",
      },
    ],
    tip: "A quick smear of refried beans on the bread acts like glue — it keeps everything from sliding out with the first bite.",
  },
  {
    slug: "horchata-from-scratch",
    title: "Horchata from Scratch",
    excerpt:
      "Creamy, cinnamon-spiced rice milk that's the perfect cool-down for a plate of smoke and spice.",
    category: "Drinks & Aguas",
    image: "/images/food/food-097.webp",
    time: "4 hours",
    difficulty: "Easy",
    serves: "8",
    date: "2026-06-17",
    intro: [
      "Horchata is the ultimate foil to spicy food — sweet, creamy, and cooling. The secret is patience: a long soak draws all the flavor out of the rice and cinnamon.",
      "No cooking required, just a little planning ahead.",
    ],
    ingredients: [
      "1 cup long-grain white rice",
      "1 cinnamon stick",
      "4 cups warm water, for soaking",
      "1 can (12 oz) evaporated milk",
      "1/2 cup sweetened condensed milk",
      "1 tbsp vanilla extract",
      "Ground cinnamon, to finish",
    ],
    steps: [
      {
        title: "Soak",
        body: "Blend the rice and cinnamon stick with the warm water until gritty, then let it soak at least 4 hours or overnight.",
      },
      {
        title: "Blend smooth",
        body: "Blend the soaked mixture again until as smooth as possible, then strain through a fine sieve or cheesecloth.",
      },
      {
        title: "Sweeten",
        body: "Stir in the evaporated milk, condensed milk, and vanilla. Thin with cold water to your preferred consistency.",
      },
      {
        title: "Chill and serve",
        body: "Refrigerate until cold, then serve over ice with a dusting of cinnamon.",
      },
    ],
    tip: "Strain twice for the silkiest texture — a little grit settles to the bottom, so give it a stir before each pour.",
  },
  {
    slug: "smoked-chicken-quarters",
    title: "Smoked Chicken Quarters",
    excerpt:
      "Juicy, mahogany-skinned chicken quarters with deep smoke flavor and crispy skin — an easy, affordable crowd-pleaser.",
    category: "From the Pit",
    image: "/images/food/food-092.webp",
    time: "3 hours",
    difficulty: "Easy",
    serves: "6",
    date: "2026-06-18",
    intro: [
      "Chicken quarters are the unsung heroes of the pit — cheap, forgiving, and packed with flavor. The trick is a higher smoking temperature to render the skin so it isn't rubbery.",
      "A simple rub and patient smoke is all it takes.",
    ],
    ingredients: [
      "6 chicken leg quarters",
      "2 tbsp baking powder (for crisp skin)",
      "2 tbsp brown sugar",
      "1 tbsp paprika",
      "1 tbsp salt",
      "1 tbsp garlic powder",
      "1 tsp black pepper",
      "Cherry or apple wood",
    ],
    steps: [
      {
        title: "Dry and season",
        body: "Pat the quarters very dry. Mix the baking powder with the rub and coat all over, getting under the skin where you can.",
      },
      {
        title: "Smoke warm",
        body: "Smoke at 300°F — hotter than usual — to render and crisp the skin, about 2 hours.",
      },
      {
        title: "Check the temp",
        body: "Cook until the thickest part of the thigh reaches 175°F. Dark meat is best a little past 'done'.",
      },
      {
        title: "Rest and serve",
        body: "Rest 10 minutes so the juices redistribute, then serve whole or split into thighs and drumsticks.",
      },
    ],
    tip: "The baking powder is the secret to crackly skin — it raises the surface pH so the skin browns and crisps instead of staying flabby.",
  },
  {
    slug: "guacamole-the-right-way",
    title: "Guacamole the Right Way",
    excerpt:
      "Chunky, bright, and balanced — a classic guacamole with no shortcuts and no fillers.",
    category: "Sides & Fixings",
    image: "/images/food/food-046.webp",
    time: "15 minutes",
    difficulty: "Easy",
    serves: "6",
    date: "2026-06-19",
    intro: [
      "Great guacamole doesn't need much — just ripe avocados and a careful hand with the acid and salt. The biggest mistake is over-mashing.",
      "Keep it chunky and taste as you go.",
    ],
    ingredients: [
      "4 ripe avocados",
      "1/2 white onion, finely diced",
      "1 serrano or jalapeño, minced",
      "Juice of 1–2 limes",
      "1/4 cup cilantro, chopped",
      "1/2 tsp salt, plus more to taste",
    ],
    steps: [
      {
        title: "Mash lightly",
        body: "Halve the avocados and scoop into a bowl. Mash with a fork, leaving plenty of chunks for texture.",
      },
      {
        title: "Add the aromatics",
        body: "Fold in the onion, chili, cilantro, lime juice, and salt.",
      },
      {
        title: "Taste and adjust",
        body: "Taste and balance — more lime for brightness, more salt for depth. Serve immediately.",
      },
    ],
    tip: "Press plastic wrap directly onto the surface of leftover guac to keep air out — that's what stops it from browning, not the avocado pit.",
  },
  {
    slug: "crispy-pork-belly-tacos",
    title: "Crispy Pork Belly Tacos",
    excerpt:
      "Slow-cooked pork belly seared until shatteringly crisp, tucked into tortillas with sharp salsa verde.",
    category: "Tacos & Masa",
    image: "/images/food/food-005.webp",
    time: "3 hours",
    difficulty: "Intermediate",
    serves: "6",
    date: "2026-06-20",
    intro: [
      "Pork belly is all about contrast — luscious, melting fat against a crackling, crispy crust. Cook it low first, then sear it hard.",
      "A bright salsa verde cuts the richness perfectly.",
    ],
    ingredients: [
      "2 lbs skin-on pork belly",
      "1 tbsp salt",
      "1 tsp cumin",
      "1 tsp smoked paprika",
      "Corn tortillas",
      "Salsa verde, diced onion, and cilantro to serve",
    ],
    steps: [
      {
        title: "Season and slow-roast",
        body: "Rub the belly with salt, cumin, and paprika. Roast at 300°F for about 2.5 hours until fork-tender.",
      },
      {
        title: "Chill for the crisp",
        body: "Cool the belly, then refrigerate until firm. This makes it easy to cut and helps it crisp evenly.",
      },
      {
        title: "Cube and sear",
        body: "Cut into cubes and sear in a hot pan until deeply golden and crispy on all sides.",
      },
      {
        title: "Build the tacos",
        body: "Pile the crispy belly onto warm tortillas with salsa verde, onion, and cilantro.",
      },
    ],
    tip: "Chilling the cooked belly overnight is the single biggest trick to getting that audible crunch when you sear it.",
  },
  {
    slug: "salsa-verde-tomatillo",
    title: "Roasted Tomatillo Salsa Verde",
    excerpt:
      "Tangy, bright, and a little smoky — a roasted tomatillo salsa that wakes up everything it touches.",
    category: "Sides & Fixings",
    image: "/images/food/food-085.webp",
    time: "25 minutes",
    difficulty: "Easy",
    serves: "8",
    date: "2026-06-21",
    intro: [
      "Salsa verde is the bright, tangy counterpoint to rich, smoky meats. Roasting the tomatillos mellows their sharpness and adds depth.",
      "It comes together in one blender and keeps for days.",
    ],
    ingredients: [
      "1.5 lbs tomatillos, husked",
      "1–2 jalapeños or serranos",
      "1/2 white onion",
      "2 garlic cloves",
      "1/4 cup cilantro",
      "Juice of 1 lime",
      "Salt to taste",
    ],
    steps: [
      {
        title: "Roast",
        body: "Broil the tomatillos, chilies, and onion until blistered and softened, turning once.",
      },
      {
        title: "Blend",
        body: "Combine the roasted vegetables with garlic, cilantro, lime, and salt. Blend to a loose, pourable salsa.",
      },
      {
        title: "Taste",
        body: "Adjust salt and lime, then thin with a splash of water if needed.",
      },
    ],
    tip: "For a creamier salsa verde, blend in half an avocado — it turns the sauce silky and tames the heat.",
  },
  {
    slug: "smoked-mac-and-cheese",
    title: "Smoked Mac and Cheese",
    excerpt:
      "Creamy three-cheese mac kissed with smoke and finished with a crunchy top — the ultimate BBQ side.",
    category: "Sides & Fixings",
    image: "/images/food/food-061.webp",
    time: "1 hour 30 minutes",
    difficulty: "Intermediate",
    serves: "8",
    date: "2026-06-22",
    intro: [
      "Mac and cheese on the smoker picks up just enough wood flavor to make it unforgettable next to brisket or ribs.",
      "Build a proper cheese sauce first — no boxed shortcuts here.",
    ],
    ingredients: [
      "1 lb elbow macaroni",
      "4 tbsp butter",
      "1/4 cup flour",
      "3 cups whole milk",
      "2 cups sharp cheddar, shredded",
      "1 cup gruyère or smoked gouda, shredded",
      "1/2 cup parmesan",
      "1 cup panko, for the top",
    ],
    steps: [
      {
        title: "Cook the pasta",
        body: "Boil the macaroni one minute shy of al dente — it'll finish on the smoker. Drain and set aside.",
      },
      {
        title: "Make the sauce",
        body: "Melt the butter, whisk in flour to make a roux, then slowly add milk. Off the heat, stir in the cheeses until smooth.",
      },
      {
        title: "Combine and top",
        body: "Fold the pasta into the sauce, spread in a pan, and top with panko tossed in a little melted butter.",
      },
      {
        title: "Smoke",
        body: "Smoke at 250°F for about 1 hour, until bubbling and the top is golden and crisp.",
      },
    ],
    tip: "Shred your own cheese — the anti-caking agents on pre-shredded cheese keep the sauce from melting smooth.",
  },
  {
    slug: "agua-fresca-jamaica",
    title: "Agua Fresca de Jamaica (Hibiscus)",
    excerpt:
      "Tart, ruby-red hibiscus cooler that's as refreshing as it is beautiful — naturally caffeine-free.",
    category: "Drinks & Aguas",
    image: "/images/food/food-117.webp",
    time: "30 minutes",
    difficulty: "Easy",
    serves: "8",
    date: "2026-06-23",
    intro: [
      "Jamaica (pronounced ha-MY-kah) is dried hibiscus flower, and it makes a stunning, tart agua fresca that's a feast for the eyes and the palate.",
      "Steep it strong, then sweeten and dilute to taste.",
    ],
    ingredients: [
      "2 cups dried hibiscus flowers",
      "8 cups water, divided",
      "1/2 to 3/4 cup sugar",
      "1 lime, juiced",
      "Ice, to serve",
    ],
    steps: [
      {
        title: "Make the concentrate",
        body: "Bring 4 cups of water to a boil, add the hibiscus, and simmer 5 minutes. Steep off the heat for 15 minutes.",
      },
      {
        title: "Sweeten",
        body: "Strain out the flowers, stir in the sugar while warm until dissolved, then add the lime juice.",
      },
      {
        title: "Dilute and chill",
        body: "Add the remaining 4 cups of cold water, adjust sweetness, and refrigerate until cold. Serve over ice.",
      },
    ],
    tip: "Save the steeped hibiscus flowers — chopped and sweetened, they make a tangy taco filling all on their own.",
  },
  {
    slug: "smoked-turkey-breast",
    title: "Smoked Turkey Breast",
    excerpt:
      "A brined, juicy smoked turkey breast with crisp skin — a lighter centerpiece for the holiday table or a party spread.",
    category: "From the Pit",
    image: "/images/food/food-080.webp",
    time: "5 hours",
    difficulty: "Intermediate",
    serves: "8",
    date: "2026-06-24",
    intro: [
      "Turkey breast has a reputation for drying out, but a good brine and a watchful eye on temperature fix that completely.",
      "Smoked turkey is a leaner change of pace that still delivers big flavor.",
    ],
    ingredients: [
      "1 bone-in turkey breast (6–7 lbs)",
      "1/2 cup kosher salt + 1/2 cup sugar (for brine)",
      "1 gallon water",
      "2 tbsp softened butter",
      "1 tbsp poultry seasoning",
      "1 tsp black pepper",
      "Apple wood chunks",
    ],
    steps: [
      {
        title: "Brine overnight",
        body: "Dissolve the salt and sugar in the water and submerge the breast. Brine 8–12 hours, then rinse and pat dry.",
      },
      {
        title: "Butter and season",
        body: "Rub softened butter under and over the skin, then season with poultry seasoning and pepper.",
      },
      {
        title: "Smoke gently",
        body: "Smoke at 275°F with apple wood until the thickest part reaches 160°F, about 3 hours.",
      },
      {
        title: "Rest and carve",
        body: "Rest 20 minutes (carryover brings it to 165°F), then slice against the grain.",
      },
    ],
    tip: "Don't skip the brine — it's the difference between juicy turkey and sawdust. Even a few hours helps.",
  },
  {
    slug: "refried-beans-from-scratch",
    title: "Refried Beans from Scratch",
    excerpt:
      "Creamy, deeply savory refried pinto beans that beat the can every single time.",
    category: "Sides & Fixings",
    image: "/images/food/food-022.webp",
    time: "2 hours",
    difficulty: "Easy",
    serves: "8",
    date: "2026-06-25",
    intro: [
      "Homemade refried beans are humble magic — soft, rich, and the backbone of tacos, tortas, and full plates alike.",
      "Cook the beans low and don't rush the mash.",
    ],
    ingredients: [
      "1 lb dried pinto beans",
      "1/2 white onion",
      "3 garlic cloves",
      "3 tbsp lard or neutral oil",
      "1 tsp cumin",
      "Salt to taste",
    ],
    steps: [
      {
        title: "Simmer the beans",
        body: "Cover the beans with water along with the onion and garlic. Simmer gently 1.5–2 hours until very soft, adding water as needed.",
      },
      {
        title: "Season",
        body: "Discard the onion, stir in salt and cumin, and reserve some cooking liquid.",
      },
      {
        title: "Fry and mash",
        body: "Heat the lard in a skillet, add the beans with a splash of their liquid, and mash to your preferred texture as they fry.",
      },
      {
        title: "Adjust",
        body: "Loosen with more bean liquid if they thicken too much, and taste for salt.",
      },
    ],
    tip: "A spoonful of bacon fat or lard is the classic flavor base — but good olive oil makes a delicious vegetarian version.",
  },
  {
    slug: "smoked-sausage-and-peppers",
    title: "Smoked Sausage and Peppers",
    excerpt:
      "Snappy smoked sausage with sweet charred peppers and onions — a fast, smoky crowd-feeder.",
    category: "From the Pit",
    image: "/images/food/food-029.webp",
    time: "2 hours",
    difficulty: "Easy",
    serves: "6",
    date: "2026-06-26",
    intro: [
      "Sausage takes to smoke beautifully and cooks fast compared to the big cuts, making it a great choice when you want pit flavor without the all-day commitment.",
      "Smoke the peppers right alongside for a one-tray meal.",
    ],
    ingredients: [
      "2 lbs smoked or fresh sausage links",
      "3 bell peppers, sliced",
      "2 onions, sliced",
      "2 tbsp olive oil",
      "1 tsp salt, 1 tsp pepper",
      "Hoagie rolls, to serve (optional)",
    ],
    steps: [
      {
        title: "Toss the vegetables",
        body: "Toss the peppers and onions with oil, salt, and pepper in a smoker-safe pan.",
      },
      {
        title: "Smoke together",
        body: "Smoke the sausage and the pan of vegetables at 250°F until the sausage hits 160°F and the peppers soften, about 1.5 hours.",
      },
      {
        title: "Char to finish",
        body: "Sear the sausage briefly over direct heat for a crisp, snappy skin.",
      },
      {
        title: "Serve",
        body: "Slice the sausage and fold into the peppers and onions, or pile onto a roll.",
      },
    ],
    tip: "Smoke a mix of sweet and hot sausage so there's something for everyone, and let guests choose.",
  },
  {
    slug: "masa-fries-with-cotija",
    title: "Masa Fries with Cotija",
    excerpt:
      "Crispy, golden masa fries dusted with chili-lime salt and showered in cotija — the snack you'll make on repeat.",
    category: "Tacos & Masa",
    image: "/images/food/food-084.webp",
    time: "1 hour",
    difficulty: "Intermediate",
    serves: "6",
    date: "2026-06-27",
    intro: [
      "Masa fries are what happen when corn tortilla flavor meets the crunch of a great fry. Set the masa firm, cut into batons, and fry until shattering.",
      "They're addictive — make more than you think you need.",
    ],
    ingredients: [
      "2 cups masa harina",
      "1.5 cups warm water",
      "1 tsp salt",
      "Neutral oil, for frying",
      "Chili-lime salt and crumbled cotija, to finish",
    ],
    steps: [
      {
        title: "Make the masa",
        body: "Mix the masa harina, salt, and water into a smooth, firm dough. Press into an even slab and chill until firm.",
      },
      {
        title: "Cut",
        body: "Cut the chilled masa into thick fry-sized batons.",
      },
      {
        title: "Fry",
        body: "Fry in 350°F oil in batches until deep golden and crisp, then drain on a rack.",
      },
      {
        title: "Season hot",
        body: "Toss the hot fries with chili-lime salt and finish with crumbled cotija.",
      },
    ],
    tip: "Make sure the masa slab is well chilled before cutting and frying — warm dough falls apart in the oil.",
  },
  {
    slug: "churros-with-chocolate",
    title: "Churros with Chocolate Sauce",
    excerpt:
      "Crisp, cinnamon-sugar churros with a rich dark chocolate dip — the sweet finish to any smoke-and-masa feast.",
    category: "Sweet",
    image: "/images/food/food-113.webp",
    time: "1 hour",
    difficulty: "Intermediate",
    serves: "6",
    date: "2026-06-28",
    intro: [
      "Churros are pure celebration — crunchy on the outside, tender within, and rolled in cinnamon sugar while still hot.",
      "The dough comes together fast; the magic is in the frying temperature.",
    ],
    ingredients: [
      "1 cup water",
      "3 tbsp butter",
      "1 cup flour",
      "2 eggs",
      "1/2 cup sugar + 1 tbsp cinnamon (for coating)",
      "Neutral oil, for frying",
      "4 oz dark chocolate + 1/2 cup cream (for sauce)",
    ],
    steps: [
      {
        title: "Make the dough",
        body: "Bring the water and butter to a boil, stir in the flour until a ball forms, then beat in the eggs one at a time until smooth.",
      },
      {
        title: "Pipe and fry",
        body: "Pipe 5-inch lengths through a star tip into 350°F oil and fry until deep golden, about 2 minutes per side.",
      },
      {
        title: "Coat",
        body: "Drain briefly, then roll the hot churros in the cinnamon sugar.",
      },
      {
        title: "Make the dip",
        body: "Warm the cream and pour over the chopped chocolate, stirring until glossy and smooth. Serve alongside.",
      },
    ],
    tip: "A star-shaped tip isn't just for looks — the ridges create more surface area, which means more crunch and better cinnamon-sugar grip.",
  },
  {
    slug: "chipotle-bbq-sauce",
    title: "Chipotle BBQ Sauce",
    excerpt:
      "A smoky, sweet, and gently spicy barbecue sauce with a Mexican accent — perfect on ribs, pulled pork, or burgers.",
    category: "Sides & Fixings",
    image: "/images/food/food-087.webp",
    time: "40 minutes",
    difficulty: "Easy",
    serves: "12",
    date: "2026-06-29",
    intro: [
      "This is our house sauce — the bridge between the pit and the masa. Chipotle brings smoke and warmth without overwhelming heat.",
      "Simmer it low so the flavors meld and the sauce thickens naturally.",
    ],
    ingredients: [
      "1.5 cups ketchup",
      "1/4 cup apple cider vinegar",
      "1/4 cup brown sugar",
      "2 tbsp molasses",
      "2 chipotles in adobo, minced",
      "1 tbsp adobo sauce",
      "1 tsp garlic powder, 1 tsp smoked paprika",
    ],
    steps: [
      {
        title: "Combine",
        body: "Whisk all the ingredients together in a saucepan over medium heat.",
      },
      {
        title: "Simmer",
        body: "Bring to a gentle simmer and cook 20–25 minutes, stirring often, until thickened and glossy.",
      },
      {
        title: "Blend (optional)",
        body: "For a smooth sauce, blend it; leave it as-is for a little texture from the chipotle.",
      },
      {
        title: "Cool and store",
        body: "Cool completely and refrigerate. It keeps for two weeks and deepens in flavor.",
      },
    ],
    tip: "Adjust the heat by adding chipotles one at a time — they pack a punch, and you can always add more but can't take it back.",
  },
  {
    slug: "pit-smashed-burger",
    title: "The Pit Smash Burger",
    excerpt:
      "A craggy, lacy-edged smash burger with smoked-onion jam and chipotle crema — the burger that earns its name.",
    category: "From the Pit",
    image: "/images/food/food-055.webp",
    time: "40 minutes",
    difficulty: "Easy",
    serves: "4",
    date: "2026-06-30",
    intro: [
      "A great smash burger is all about the crust. Press the patty thin and hard on a screaming-hot surface to get those crispy, lacy edges.",
      "Our version leans on smoky-sweet onions and a quick chipotle crema.",
    ],
    ingredients: [
      "1 lb 80/20 ground beef",
      "4 potato buns",
      "4 slices American cheese",
      "1 onion, caramelized",
      "1/4 cup crema + 1 tsp adobo (for the sauce)",
      "Salt and pepper",
      "Pickles, to serve",
    ],
    steps: [
      {
        title: "Make the sauce",
        body: "Stir the crema with the adobo and a pinch of salt. Set aside.",
      },
      {
        title: "Form loose balls",
        body: "Divide the beef into 4 loose balls — don't pack them tight.",
      },
      {
        title: "Smash hard",
        body: "On a blazing-hot griddle, smash each ball flat with a spatula, season, and cook until the edges are lacy and crisp, about 2 minutes. Flip, add cheese, and cook 1 minute more.",
      },
      {
        title: "Build",
        body: "Stack on toasted buns with the caramelized onion, chipotle crema, and pickles.",
      },
    ],
    tip: "Smash within 30 seconds of the beef hitting the griddle — once it starts to cook, you lose the crispy edges that make a smash burger great.",
  },
];

/* ════════════════════════════════════════════════════════════════
   BLOG
   ════════════════════════════════════════════════════════════════ */
export const blogPosts: BlogPost[] = [
  {
    slug: "planning-catering-backyard-party",
    title: "How to Plan Catering for a Backyard Party",
    excerpt:
      "From headcount to timing to leftovers — a simple framework for stress-free backyard catering that keeps you out of the kitchen and in the party.",
    category: "Planning",
    image: "/images/food/food-008.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-10",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "The best backyard parties feel effortless — but behind that ease is a little planning. After hundreds of events across Connecticut, here's the framework we walk every host through. Whether you cook it yourself or let our [catering team](/catering) handle it, the same fundamentals apply.",
        ],
      },
      {
        heading: "Start with the headcount",
        paragraphs: [
          "Everything flows from how many people you're feeding. A good rule of thumb for a casual BBQ is about a pound of cooked meat per three guests, plus two to three sides. When in doubt, round up — leftovers are a feature, not a bug.",
          "If you're not sure how many people will actually show, plan for 80% of your invite list for a casual event and 90% for anything with RSVPs. For a deeper look at how guest count drives your budget, see our breakdown of [what catering costs in Connecticut](/blog/how-much-does-catering-cost-connecticut).",
        ],
      },
      {
        heading: "Time the food, not just the party",
        paragraphs: [
          "Smoked meats run on their own clock. If you're cooking yourself, work backward from serving time and build in a rest window — a [wood-fired brisket](/recipes/wood-fired-smoked-brisket) and a [pork shoulder](/recipes/smoked-pulled-pork) both need at least an hour of rest before slicing. If we're catering, this is exactly the headache we take off your plate.",
          "Need a faster centerpiece that still delivers smoke? [Smoked chicken quarters](/recipes/smoked-chicken-quarters) cook in a fraction of the time and feed a crowd affordably.",
        ],
      },
      {
        heading: "Build a flexible spread",
        paragraphs: [
          "A build-your-own [taco bar](/blog/taco-bar-catering-perfect-spread) or a BBQ buffet lets guests serve themselves at their own pace, which keeps lines short and the vibe relaxed. Offer one crowd-pleasing protein, one lighter option, and a vegetarian-friendly choice so nobody's left out.",
          "Round out the table with sides that hold well in the heat — [Mexican street corn](/recipes/mexican-street-corn-elote), [smoked mac and cheese](/recipes/smoked-mac-and-cheese), and a bright [house salsa roja](/recipes/house-salsa-roja) all earn their place. Still deciding on a format? Our guide to [BBQ vs. a taco bar](/blog/bbq-vs-taco-bar) can help.",
        ],
      },
      {
        heading: "Don't forget drinks and dessert",
        paragraphs: [
          "A pitcher of [homemade horchata](/recipes/horchata-from-scratch) or ruby-red [agua fresca de jamaica](/recipes/agua-fresca-jamaica) cools the table and feels special without any booze. For the finish, a tray of warm [churros](/recipes/churros-with-chocolate) is the kind of thing guests still talk about a week later.",
        ],
      },
      {
        heading: "Don't forget the after",
        paragraphs: [
          "Cleanup is where most hosts lose the night. Plan disposables, a trash and recycling station, and to-go containers for leftovers before guests arrive. When we cater, we handle our own setup and breakdown — you just enjoy the party and wake up to a clean yard.",
          "Ready to hand it off? Tell us about your event on our [contact page](/contact) and we'll build a spread sized to your backyard.",
        ],
      },
      {
        heading: "Match the setup to your space",
        paragraphs: [
          "A small patio and a sprawling lawn call for different plans. For tight spaces, a stationed buffet or a build-your-own taco bar keeps the footprint small and the line orderly. For bigger yards, you have room to spread out food, drinks, and dessert into separate zones so guests aren't bunched around a single table.",
          "If parking or yard access is tight, our mobile rigs are sized for real neighborhoods — the compact [Food Truck](/catering/truck) slips into most driveways, while the [Pit Trailer](/catering/trailer) handles full smoked-BBQ service when you have the room. Either way, we scout the logistics ahead of time so there are no day-of surprises.",
        ],
      },
      {
        heading: "A sample backyard catering menu",
        paragraphs: [
          "Stuck on what to actually serve? Here's a crowd-tested template for around 25 guests: one rich centerpiece like [wood-fired brisket](/recipes/wood-fired-smoked-brisket) or [pulled pork](/recipes/smoked-pulled-pork), a lighter protein such as [achiote chicken tacos](/recipes/achiote-chicken-tacos), and a vegetarian-friendly option so nobody's left out.",
          "Round it out with two or three sides — [Mexican street corn](/recipes/mexican-street-corn-elote), [smoked mac and cheese](/recipes/smoked-mac-and-cheese), and [refried beans](/recipes/refried-beans-from-scratch) all hold beautifully outdoors — plus [house salsa roja](/recipes/house-salsa-roja) and [guacamole](/recipes/guacamole-the-right-way) for the table. Finish with [churros](/recipes/churros-with-chocolate) and a cooler of [horchata](/recipes/horchata-from-scratch), and you've covered every guest from the kids to the grandparents.",
        ],
      },
    ],
    related: [
      { label: "Compare BBQ vs. a taco bar", href: "/blog/bbq-vs-taco-bar" },
      { label: "What catering costs in Connecticut", href: "/blog/how-much-does-catering-cost-connecticut" },
      { label: "Our catering options", href: "/catering" },
      { label: "Browse all recipes", href: "/recipes" },
    ],
    faqs: [
      {
        question: "How far ahead should I book backyard catering?",
        answer:
          "For peak summer weekends across Connecticut, two to four weeks is ideal since popular dates fill up fast. For larger gatherings or holiday weekends, give yourself a little more lead time.",
      },
      {
        question: "How much food should I plan per person?",
        answer:
          "A good rule of thumb is about a pound of cooked meat per three guests, plus two to three sides. When in doubt, round up — leftovers are always welcome.",
      },
      {
        question: "Do you handle setup and cleanup?",
        answer:
          "Yes. Full-service catering includes delivery, setup, serving, and full breakdown, so you can stay at your own party from the first guest to the last.",
      },
      {
        question: "Can you accommodate dietary restrictions?",
        answer:
          "Absolutely. Vegetarian, gluten-friendly, and lighter options are easy to build into any taco bar or BBQ buffet without a separate menu.",
      },
    ],
  },
  {
    slug: "bbq-vs-taco-bar",
    title: "BBQ vs. Taco Bar: Which Is Right for Your Event?",
    excerpt:
      "Both crowd-pleasers, but they shine in different settings. Here's how to choose the right style for your guests and your space.",
    category: "Guides",
    image: "/images/food/food-045.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-12",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "It's the question we get most: should we go smoked BBQ or a taco bar? The honest answer is that both are fantastic — but the right pick depends on your crowd, your venue, and the feeling you want. Take a look at our full [catering menu](/menu) for the lay of the land, then read on.",
        ],
      },
      {
        heading: "Go BBQ when…",
        paragraphs: [
          "You want a hearty, comfort-forward meal that feels generous. [Smoked brisket](/recipes/wood-fired-smoked-brisket), [pulled pork](/recipes/smoked-pulled-pork), and [baby back ribs](/recipes/smoked-baby-back-ribs) plate beautifully for sit-down dinners and bigger celebrations where the food itself is part of the show.",
          "BBQ also scales gracefully for large headcounts and holds well on a buffet line. Not sure which smoked meat to anchor with? Our [brisket vs. pulled pork](/blog/smoked-brisket-vs-pulled-pork) guide breaks down the trade-offs.",
        ],
      },
      {
        heading: "Go taco bar when…",
        paragraphs: [
          "You want interaction and variety. A build-your-own taco bar gets guests up, moving, and customizing — perfect for mingling events, casual parties, and crowds with mixed tastes and dietary needs. Think [carne asada](/recipes/carne-asada-tacos), [achiote chicken](/recipes/achiote-chicken-tacos), and [crispy pork belly](/recipes/crispy-pork-belly-tacos), with [salsa roja](/recipes/house-salsa-roja) and [salsa verde](/recipes/salsa-verde-tomatillo) on the side.",
          "It's also one of the easiest formats to make vegetarian- and gluten-friendly without a separate menu. For the full playbook, see [how to build the perfect taco bar](/blog/taco-bar-catering-perfect-spread).",
        ],
      },
      {
        heading: "Think about your space and staff",
        paragraphs: [
          "BBQ buffets need table space for chafers and carving boards; a taco bar needs a little room for guests to assemble. Either way, our mobile setups — the [Pit Trailer](/catering/trailer) and the [Food Truck](/catering/truck) — bring the kitchen to your venue, indoors or out.",
        ],
      },
      {
        heading: "Why not both?",
        paragraphs: [
          "For larger events, our most popular setup is a hybrid: a smoked-meat station alongside a taco bar. Guests get the best of both, and you cover every preference in the room. When we [build your menu](/contact), we'll help you weigh the trade-offs for your specific event.",
        ],
      },
      {
        heading: "Budget: which costs more?",
        paragraphs: [
          "Dollar for dollar, a taco bar usually stretches further. Proteins like [pulled pork](/recipes/smoked-pulled-pork) and [achiote chicken](/recipes/achiote-chicken-tacos) feed a lot of people per pound, and guests build smaller, customized plates. A BBQ spread anchored by [brisket](/recipes/wood-fired-smoked-brisket) or [beef short ribs](/recipes/smoked-beef-short-ribs) tends to run higher because premium cuts lose weight over a long smoke.",
          "That said, both can flex to almost any budget once you dial in proteins, sides, and service style. Our [Connecticut catering cost guide](/blog/how-much-does-catering-cost-connecticut) walks through every lever in detail.",
        ],
      },
      {
        heading: "Dietary needs and picky eaters",
        paragraphs: [
          "A taco bar wins on flexibility. Because guests assemble their own, it's effortless to offer vegetarian fillings, skip the cheese, or go gluten-friendly with corn tortillas — no separate special-order plates required. Add [esquites](/recipes/esquites-mexican-street-corn-cup), [guacamole](/recipes/guacamole-the-right-way), and a couple of [salsas](/recipes/salsa-verde-tomatillo) and there's something for everyone.",
          "BBQ can absolutely accommodate restrictions too, but it usually takes a bit more planning to make sure lighter and meat-free guests feel just as well-fed as the brisket crowd.",
        ],
      },
      {
        heading: "Think about the season and venue",
        paragraphs: [
          "Warm-weather events lean naturally toward a lively, interactive taco bar, while cooler months and indoor venues are perfect for a hearty smoked-BBQ spread. For holiday gatherings, our [stress-free holiday hosting guide](/blog/stress-free-holiday-hosting) leans on smoked meats and make-ahead sides — and our mobile [Pit Trailer and Food Truck](/catering) work indoors and out across Connecticut.",
        ],
      },
    ],
    related: [
      { label: "Build the perfect taco bar", href: "/blog/taco-bar-catering-perfect-spread" },
      { label: "Brisket vs. pulled pork", href: "/blog/smoked-brisket-vs-pulled-pork" },
      { label: "The Pit Trailer", href: "/catering/trailer" },
      { label: "View the full menu", href: "/menu" },
    ],
  },
  {
    slug: "stress-free-holiday-hosting",
    title: "5 Tips for Hosting a Stress-Free Holiday Gathering",
    excerpt:
      "The holidays should be about the people, not the prep. Five hard-won tips for hosting a gathering you actually get to enjoy.",
    category: "Hosting",
    image: "/images/food/food-100.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-15",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "Every year, hosts spend the holidays trapped in the kitchen while the party happens without them. It doesn't have to be that way. Here are five tips we share with every holiday client — and if you'd rather skip the cooking entirely, our [holiday catering and meal packs](/catering) are built for exactly this.",
        ],
      },
      {
        heading: "1. Lock the menu early",
        paragraphs: [
          "Indecision is the enemy of a calm host. Decide your menu at least two weeks out so you can shop, prep, and delegate without last-minute scrambling. A [smoked turkey breast](/recipes/smoked-turkey-breast) or a [pork shoulder](/recipes/smoked-pulled-pork) makes a stress-free centerpiece you can largely cook ahead.",
        ],
      },
      {
        heading: "2. Prep what you can ahead",
        paragraphs: [
          "Sauces, salsas, rubs, and sides can almost all be made a day or two early. A batch of [refried beans](/recipes/refried-beans-from-scratch), [smoked mac and cheese](/recipes/smoked-mac-and-cheese), and [chipotle BBQ sauce](/recipes/chipotle-bbq-sauce) all reheat beautifully. The day-of should be about assembly and warming, not cooking from scratch.",
        ],
      },
      {
        heading: "3. Consider a meal pack",
        paragraphs: [
          "Our holiday meal packs exist for exactly this reason — ready-to-serve smoked meats and sides that let you skip the all-day cook and still put out a spread that feels homemade. Browse what's possible on the [menu](/menu) and we'll tailor it to your headcount.",
        ],
      },
      {
        heading: "4. Set up stations",
        paragraphs: [
          "Separate the food, drinks, and dessert into distinct stations to keep traffic flowing and prevent a single bottleneck around one table. Put the [horchata](/recipes/horchata-from-scratch) and [churros](/recipes/churros-with-chocolate) at their own end of the room so dessert lovers aren't blocking the buffet.",
        ],
      },
      {
        heading: "5. Build in a buffer",
        paragraphs: [
          "Plan to be fully ready 30 minutes before guests arrive. That buffer absorbs the inevitable hiccups and lets you greet the first knock with a drink in hand instead of an apron on. Want the whole night handled? [Get in touch](/contact) and we'll take care of the food, setup, and cleanup.",
        ],
      },
      {
        heading: "Build a simple day-of timeline",
        paragraphs: [
          "A loose schedule keeps the day calm. The morning is for warming and assembly, not cooking — that's the payoff of prepping ahead. Aim to have cold items plated, hot items in the warmer, and drinks on ice about half an hour before the first guest. If you're serving a smoked centerpiece like a [turkey breast](/recipes/smoked-turkey-breast) or [pork shoulder](/recipes/smoked-pulled-pork), build in its rest time so it's ready to slice right as everyone sits down.",
          "Write the timeline on a sticky note and hand off jobs — someone on drinks, someone on dessert, someone on the door. Delegation is the quiet secret of every relaxed host.",
        ],
      },
      {
        heading: "What to make ahead vs. day-of",
        paragraphs: [
          "Almost everything flavorful can be made in advance. [Refried beans](/recipes/refried-beans-from-scratch), [chipotle BBQ sauce](/recipes/chipotle-bbq-sauce), salsas, and rubs all keep for days and deepen in flavor. [Smoked mac and cheese](/recipes/smoked-mac-and-cheese) and braised dishes reheat without losing a thing.",
          "Save only the truly last-minute jobs — slicing meat, warming tortillas, dressing the [street corn](/recipes/mexican-street-corn-elote) — for the day itself. The shorter your day-of list, the more present you get to be.",
        ],
      },
      {
        heading: "When to call in a caterer",
        paragraphs: [
          "If your guest list creeps past 15–20, or you simply want to actually enjoy your own holiday, catering pays for itself in peace of mind. Our [holiday meal packs](/catering) deliver ready-to-serve smoked meats and sides, and full-service options add setup and cleanup. See how pricing works in our [Connecticut catering cost guide](/blog/how-much-does-catering-cost-connecticut).",
        ],
      },
    ],
    related: [
      { label: "Plan a backyard party", href: "/blog/planning-catering-backyard-party" },
      { label: "Smoked turkey breast recipe", href: "/recipes/smoked-turkey-breast" },
      { label: "Our catering & meal packs", href: "/catering" },
      { label: "Get a holiday quote", href: "/contact" },
    ],
  },
  {
    slug: "what-makes-real-birria-good",
    title: "What Makes Real Birria So Good",
    excerpt:
      "Birria is everywhere right now — but the great versions all share a few things. A look at what separates the real deal from the trend.",
    category: "Food Stories",
    image: "/images/food/food-119.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-18",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "Birria went from regional specialty to viral sensation seemingly overnight. But behind the cheese pulls and dipping shots, the dishes that actually deliver all respect the same fundamentals. Want to make it at home? Follow our [birria tacos with consommé recipe](/recipes/birria-tacos-consomme) alongside this read.",
        ],
      },
      {
        heading: "It starts with the chilies",
        paragraphs: [
          "Real birria is built on a base of dried chilies — guajillo, ancho, and sometimes arbol — toasted and blended into a deep, complex adobo. That layered chili flavor is the soul of the dish, and there's no shortcut for it. The same chili-forward approach powers our [house salsa roja](/recipes/house-salsa-roja).",
        ],
      },
      {
        heading: "The braise can't be rushed",
        paragraphs: [
          "Birria is a low-and-slow affair. The beef (or traditionally goat) needs hours to break down into tender, shreddable strands while the broth concentrates into a rich consommé. Rushing it is the most common mistake — the same patience that makes a great [smoked brisket](/recipes/wood-fired-smoked-brisket) makes great birria.",
        ],
      },
      {
        heading: "The consommé is the point",
        paragraphs: [
          "That dipping broth isn't a garnish — it's the heart of the experience. A great consommé is savory, slightly spicy, and glossy with the rendered fat that also crisps the tacos. If the dip is an afterthought, it isn't really birria.",
        ],
      },
      {
        heading: "Where birria fits on the menu",
        paragraphs: [
          "Birria is a star at any [taco bar](/blog/taco-bar-catering-perfect-spread) and a regular on our [festival and street menu](/festivals). It's also a great companion to lighter street-food classics — read our [guide to birria, esquites, and aguas frescas](/blog/mexican-street-food-guide-birria-esquites-aguas-frescas) for the full picture.",
        ],
      },
      {
        heading: "Respect over trend",
        paragraphs: [
          "We make our birria the long way because that's the only way it's worth making. When you taste a version that took its time, you understand why this dish has been loved for generations — long before it was a trend. Want it at your next event? [Reach out](/contact) and we'll bring it.",
        ],
      },
      {
        heading: "Birria, quesabirria, and consommé — what's the difference?",
        paragraphs: [
          "The terms get used loosely, so here's the quick map. Birria is the braised, chili-rich meat itself, traditionally goat but often beef. Quesabirria — the version that took over social media — adds melted cheese to a tortilla that's dipped in the rendered fat and crisped on the griddle. The consommé is the deep, savory braising broth served alongside for dipping.",
          "Put them together and you get the full experience: a crispy, cheesy taco you plunge into a glossy bowl of broth. Our [birria tacos with consommé recipe](/recipes/birria-tacos-consomme) walks through all three.",
        ],
      },
      {
        heading: "What to serve with birria",
        paragraphs: [
          "Birria is rich, so balance the plate. A bright [salsa verde](/recipes/salsa-verde-tomatillo), pickled onions, and a wedge of lime cut through the fat, while [esquites](/recipes/esquites-mexican-street-corn-cup) or [refried beans](/recipes/refried-beans-from-scratch) round out a meal. To drink, a cold [agua fresca de jamaica](/recipes/agua-fresca-jamaica) is the classic pairing.",
          "At an event, birria shines as one protein on a larger [taco bar](/blog/taco-bar-catering-perfect-spread) — read our guide to building one for the full lineup.",
        ],
      },
      {
        heading: "Making birria at home",
        paragraphs: [
          "The single biggest tip: make it a day ahead. Birria's flavor deepens overnight, the fat is easy to skim and reserve for crisping, and reheating is gentle. Don't rush the braise — the meat is done when it shreds with no resistance, usually after several hours low and slow, the same patience that rewards a great [smoked brisket](/recipes/wood-fired-smoked-brisket).",
        ],
      },
    ],
    related: [
      { label: "Birria tacos with consommé recipe", href: "/recipes/birria-tacos-consomme" },
      { label: "Mexican street food guide", href: "/blog/mexican-street-food-guide-birria-esquites-aguas-frescas" },
      { label: "Our festival & street menu", href: "/festivals" },
      { label: "Browse all recipes", href: "/recipes" },
    ],
  },
  {
    slug: "connecticut-wedding-catering-bbq-taco-bar",
    title: "Connecticut Wedding Catering Ideas: BBQ & Taco Bars",
    excerpt:
      "Skip the stuffy plated dinner. Here's how smoked BBQ and build-your-own taco bars are reshaping wedding catering across Connecticut — and how to plan one.",
    category: "Planning",
    image: "/images/food/food-072.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-20",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "Connecticut couples are moving away from the formal banquet plate and toward food that gets people talking. [Smoked brisket](/recipes/wood-fired-smoked-brisket), [pulled pork](/recipes/smoked-pulled-pork), and a build-your-own taco bar bring warmth, abundance, and a little fun to the reception — without sacrificing the wow factor. Start with our [catering options](/catering) and read on for the details.",
        ],
      },
      {
        heading: "Why couples are choosing BBQ and tacos",
        paragraphs: [
          "Wedding food should feel like you. For a lot of couples, that's not a rubber-chicken entrée — it's the food they actually crave. A smoked-meat station and a taco bar give guests choice, generosity, and a reason to mingle around the food instead of sitting and waiting for a plate.",
          "It also solves the dietary-restriction puzzle elegantly. With a flexible spread, vegetarians, gluten-free guests, and picky eaters all build a plate they're happy with — no separate special-order meals required. Our guide to [BBQ vs. a taco bar](/blog/bbq-vs-taco-bar) can help you pick a direction.",
        ],
      },
      {
        heading: "Plating it without losing the elegance",
        paragraphs: [
          "Casual food doesn't mean a casual presentation. Stationed buffets with carving boards, masa sides, fresh [salsas](/recipes/salsa-verde-tomatillo), and styled garnishes look stunning under string lights or in a barn venue. The food becomes part of the décor — see our [gallery](/gallery) for inspiration.",
          "For seated receptions, family-style platters down the center of each table strike the perfect balance between elegance and that homey, pass-the-plate feeling.",
        ],
      },
      {
        heading: "Cocktail hour and the late-night bite",
        paragraphs: [
          "Our [Cocktail Cart](/catering/cocktail-cart) keeps guests happy during photos with aguas frescas and passed bites, and a late-night taco or [smash burger](/recipes/pit-smashed-burger) run is the kind of detail your guests will remember long after the cake.",
        ],
      },
      {
        heading: "Planning headcount and timing",
        paragraphs: [
          "Weddings run on a tight schedule. We coordinate with your planner or venue so service lines up with toasts, the first dance, and sunset photos. Plan roughly a pound of cooked meat per three guests plus two to three sides, and always build in a little extra for the late-night crowd. For budgeting, our [catering cost guide](/blog/how-much-does-catering-cost-connecticut) lays out what drives the number.",
        ],
      },
      {
        heading: "Booking early matters",
        paragraphs: [
          "Connecticut wedding season fills fast, especially May through October. If you're eyeing a smoked-BBQ or taco-bar reception, [reach out early](/contact) to lock your date — and to leave time for a tasting so you can fine-tune the menu before the big day.",
        ],
      },
      {
        heading: "A sample wedding menu",
        paragraphs: [
          "Here's a reception spread that consistently wows: a smoked-meat station with [brisket](/recipes/wood-fired-smoked-brisket) and [pulled pork](/recipes/smoked-pulled-pork), a build-your-own taco bar featuring [carne asada](/recipes/carne-asada-tacos) and [achiote chicken](/recipes/achiote-chicken-tacos), and shared sides like [smoked mac and cheese](/recipes/smoked-mac-and-cheese) and [Mexican street corn](/recipes/mexican-street-corn-elote).",
          "Layer in fresh [guacamole](/recipes/guacamole-the-right-way), [salsa roja](/recipes/house-salsa-roja), and [salsa verde](/recipes/salsa-verde-tomatillo) at the table, finish with a [churro](/recipes/churros-with-chocolate) bar, and pour [aguas frescas](/recipes/agua-fresca-jamaica) all night. It feels generous, photographs beautifully, and gives every guest something they'll love.",
        ],
      },
      {
        heading: "Cocktail hour, late-night, and rehearsal dinner",
        paragraphs: [
          "A wedding is more than the reception. Our [Cocktail Cart](/catering/cocktail-cart) keeps guests happy during photos with passed bites and aguas frescas, and a late-night [smash burger](/recipes/pit-smashed-burger) or taco run is the detail people rave about. We also cater rehearsal dinners and welcome parties, so your whole weekend has one trusted kitchen behind it.",
        ],
      },
    ],
    related: [
      { label: "BBQ vs. taco bar", href: "/blog/bbq-vs-taco-bar" },
      { label: "What catering costs in Connecticut", href: "/blog/how-much-does-catering-cost-connecticut" },
      { label: "The Cocktail Cart", href: "/catering/cocktail-cart" },
      { label: "See the photo gallery", href: "/gallery" },
    ],
    faqs: [
      {
        question: "Do you travel to barn and outdoor wedding venues?",
        answer:
          "Yes. Our mobile Pit Trailer and Food Truck are built for venues without a full kitchen, indoors or out, so we can serve smoked BBQ and fresh tacos almost anywhere in Connecticut.",
      },
      {
        question: "Can you handle dietary restrictions for a large guest list?",
        answer:
          "Easily. A flexible BBQ-and-taco spread covers vegetarian, gluten-friendly, and lighter eaters without separate plated meals, so every guest builds a plate they love.",
      },
      {
        question: "How far ahead should we book wedding catering?",
        answer:
          "For peak-season Saturdays, the earlier the better — many couples lock us in six to twelve months out. Booking early also leaves time for a tasting to fine-tune the menu.",
      },
      {
        question: "Do you cater rehearsal dinners and welcome parties too?",
        answer:
          "We do. Many couples have us handle the rehearsal dinner, welcome party, and late-night bites so the whole wedding weekend runs through one trusted kitchen.",
      },
    ],
  },
  {
    slug: "how-much-does-catering-cost-connecticut",
    title: "How Much Does Catering Cost in Connecticut?",
    excerpt:
      "A straight-talking breakdown of what drives catering pricing in Connecticut — headcount, menu, service style, and the extras most quotes don't spell out.",
    category: "Guides",
    image: "/images/food/food-025.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-21",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "\"How much does catering cost?\" is the first question almost every host asks — and the honest answer is: it depends. But it doesn't have to be a mystery. Here's a clear look at what actually moves the price so you can budget with confidence. When you're ready for a real number, our [contact page](/contact) is the fastest path.",
        ],
      },
      {
        heading: "Headcount is the biggest lever",
        paragraphs: [
          "Most catering is priced per person, so your guest count is the single largest factor. Larger events often unlock better per-head pricing because the kitchen and travel costs spread across more plates, while very small gatherings carry a higher per-person rate. Our guide to [planning a backyard party](/blog/planning-catering-backyard-party) covers how to estimate your count.",
        ],
      },
      {
        heading: "Menu and ingredients",
        paragraphs: [
          "Slow-smoked [brisket](/recipes/wood-fired-smoked-brisket), hand-pressed masa, and from-scratch salsas cost more than mass-produced shortcuts — and they taste like it. Premium proteins, multiple protein choices, and add-ons like dessert or aguas frescas all nudge the number up. A focused menu of a couple of crowd-pleasers like [pulled pork](/recipes/smoked-pulled-pork) and [smoked chicken](/recipes/smoked-chicken-quarters) is the friendliest on a budget.",
          "Wondering which centerpiece gives you the most value? Our [brisket vs. pulled pork](/blog/smoked-brisket-vs-pulled-pork) comparison digs into cost per plate.",
        ],
      },
      {
        heading: "Service style",
        paragraphs: [
          "Drop-off catering, where we deliver ready-to-serve food, is the most affordable. Full-service with on-site staff, setup, and breakdown costs more because you're paying for labor and a hands-off experience. Build-your-own buffets and stationed [taco bars](/blog/taco-bar-catering-perfect-spread) land in the middle. Our mobile [Pit Trailer and Food Truck](/catering) bring the cook to your venue.",
        ],
      },
      {
        heading: "The extras that surprise people",
        paragraphs: [
          "Travel distance, rentals (tables, chafers, linens), disposables, gratuity, and any permits for a specific venue can all factor in. A good caterer itemizes these up front so there are no surprises on the final invoice.",
        ],
      },
      {
        heading: "Getting an accurate quote",
        paragraphs: [
          "The fastest way to a real number is to share your date, location, guest count, and the vibe you're after. From there we can build a menu that fits your budget instead of forcing your budget to fit a menu. [Reach out](/contact) and we'll put together a transparent quote — or browse the [full menu](/menu) first to get ideas.",
        ],
      },
      {
        heading: "Drop-off vs. full-service: a closer look",
        paragraphs: [
          "Drop-off catering is the budget-friendly choice: we deliver hot, ready-to-serve food and you handle the rest. It's perfect for casual [backyard parties](/blog/planning-catering-backyard-party) and office lunches. Full-service adds on-site staff, chafers and serving setup, and full breakdown — ideal for weddings, milestone events, and anytime you'd rather be a guest than a host.",
          "Our mobile setups sit in a sweet spot, too. The [Food Truck](/catering/truck) and [Pit Trailer](/catering/trailer) bring a working kitchen to your venue, so the food is fresh and made-to-order without the overhead of a rented commercial space.",
        ],
      },
      {
        heading: "How to save without cutting quality",
        paragraphs: [
          "You can trim the bill without trimming the experience. Choose a focused menu — one or two proteins like [pulled pork](/recipes/smoked-pulled-pork) and [smoked chicken quarters](/recipes/smoked-chicken-quarters) instead of four. Lean on generous, lower-cost crowd-pleasers and let smart sides like [refried beans](/recipes/refried-beans-from-scratch) and [Mexican street corn](/recipes/mexican-street-corn-elote) stretch the spread.",
          "A [taco bar](/blog/taco-bar-catering-perfect-spread) is often the most cost-effective format because guests build smaller, customized plates. And booking on an off-peak date or weekday can ease pricing, since demand is part of the equation.",
        ],
      },
      {
        heading: "Ballpark price ranges in Connecticut",
        paragraphs: [
          "Every event is quoted individually, but it helps to start with ballpark figures. As a rough guide for Connecticut catering, drop-off service typically runs about $15–$25 per person, a build-your-own taco bar or BBQ buffet about $25–$45 per person, and full-service catering with staff, setup, and breakdown around $45–$75+ per person.",
          "Where you land within those ranges depends on your protein choices, the number of sides, add-ons like dessert and [aguas frescas](/recipes/agua-fresca-jamaica), and your guest count. Smaller guest counts sit at the higher end per head, while larger events often come down. Treat these as a planning starting point, not a quote — [tell us your details](/contact) for an exact number.",
        ],
      },
      {
        heading: "What's typically included — and what's extra",
        paragraphs: [
          "A clear quote spells out the food, service style, and labor. Watch for line items that some caterers bury: travel and mileage, rentals (tables, linens, chafers), disposables, gratuity, and any venue or municipal permits. We itemize all of it up front so the final invoice matches the estimate — no surprises.",
        ],
      },
    ],
    related: [
      { label: "Plan a backyard party", href: "/blog/planning-catering-backyard-party" },
      { label: "Brisket vs. pulled pork", href: "/blog/smoked-brisket-vs-pulled-pork" },
      { label: "Our catering options", href: "/catering" },
      { label: "Request a quote", href: "/contact" },
    ],
    faqs: [
      {
        question: "How much does catering cost per person in Connecticut?",
        answer:
          "As a rough guide, drop-off service runs about $15–$25 per person, a taco bar or BBQ buffet about $25–$45 per person, and full-service catering with staff and setup around $45–$75 or more per person. Your final price depends on menu, headcount, and service style.",
      },
      {
        question: "Is there a minimum order for catering?",
        answer:
          "Most events have a minimum that varies by date and service style. Smaller gatherings carry a higher per-person rate because fixed kitchen and travel costs spread across fewer plates. Share your guest count and we'll let you know what works.",
      },
      {
        question: "What's the most affordable catering option?",
        answer:
          "Drop-off catering — where we deliver hot, ready-to-serve food and you handle serving — is the most budget-friendly. A focused taco bar with one or two proteins is another great value for larger crowds.",
      },
      {
        question: "Are gratuity and fees included in the quote?",
        answer:
          "We itemize everything up front: food, labor, travel, any rentals or disposables, and gratuity. A transparent quote means the final invoice matches the estimate with no surprises.",
      },
    ],
  },
  {
    slug: "corporate-catering-connecticut-office-events",
    title: "Corporate Catering in Connecticut: A Guide for Office Events",
    excerpt:
      "From team lunches to client galas, here's how to cater a corporate event in Connecticut that people actually look forward to.",
    category: "Guides",
    image: "/images/food/food-115.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-22",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "Office catering has a reputation for being forgettable — sad sandwich platters and lukewarm trays. It doesn't have to be. A well-run corporate spread boosts morale, impresses clients, and makes the whole company look like it has its act together. See what we offer on the [catering page](/catering) and read on.",
        ],
      },
      {
        heading: "Match the food to the occasion",
        paragraphs: [
          "A casual team lunch and a client-facing reception call for different energy. For everyday team meals, a build-your-own [taco bar](/blog/taco-bar-catering-perfect-spread) is fast, flexible, and accommodates every diet in the office. For client events and milestone celebrations, a smoked-BBQ station with [brisket](/recipes/wood-fired-smoked-brisket) or [beef short ribs](/recipes/smoked-beef-short-ribs) brings a sense of occasion.",
        ],
      },
      {
        heading: "Plan for dietary needs up front",
        paragraphs: [
          "Modern teams are diverse eaters. Offering at least one vegetarian and one gluten-friendly option isn't a nice-to-have anymore — it's expected. Our taco and masa menus make inclusive eating easy without a separate, second-tier menu — think [esquites](/recipes/esquites-mexican-street-corn-cup), [guacamole](/recipes/guacamole-the-right-way), and [salsa verde](/recipes/salsa-verde-tomatillo) that everyone can enjoy.",
        ],
      },
      {
        heading: "Logistics that keep work moving",
        paragraphs: [
          "Corporate events live and die by timing. We handle delivery windows, clean setup in lobbies or conference rooms, and tidy breakdown so your team gets back to work — not a mess. For recurring needs, we can build a repeatable menu you don't have to reinvent every quarter. Curious about pricing structure? See our [catering cost guide](/blog/how-much-does-catering-cost-connecticut).",
        ],
      },
      {
        heading: "Serving the Connecticut business corridor",
        paragraphs: [
          "We cater offices across Hartford, New Haven, Stamford, and the surrounding towns. Whether it's a 20-person team or a 200-guest company event, [reach out with your details](/contact) and we'll handle the food so you can focus on the meeting.",
        ],
      },
      {
        heading: "Catering for every kind of office event",
        paragraphs: [
          "Different occasions call for different formats. Weekly team lunches do well with an easy, repeatable [taco bar](/blog/taco-bar-catering-perfect-spread). Client meetings and board lunches feel polished with a smoked-BBQ spread anchored by [brisket](/recipes/wood-fired-smoked-brisket). Holiday parties and milestone celebrations are perfect for a full station with [pulled pork](/recipes/smoked-pulled-pork), sides, and dessert.",
          "Hosting a conference, training, or all-hands? A food truck on-site turns a working day into an event — see how our [festival and food-truck catering](/blog/food-truck-festival-catering-connecticut) works for larger crowds.",
        ],
      },
      {
        heading: "Keeping it easy on a corporate budget",
        paragraphs: [
          "Per-head pricing makes office catering simple to plan and expense. A focused menu of one or two proteins plus a couple of sides keeps costs predictable, and drop-off service is the most economical option for routine team meals. For the full breakdown, see our [Connecticut catering cost guide](/blog/how-much-does-catering-cost-connecticut).",
          "Need to feed the team every week? We can set up a recurring menu and delivery window so it runs on autopilot — no rebooking, no decision fatigue.",
        ],
      },
    ],
    related: [
      { label: "Build the perfect taco bar", href: "/blog/taco-bar-catering-perfect-spread" },
      { label: "What catering costs in Connecticut", href: "/blog/how-much-does-catering-cost-connecticut" },
      { label: "View the full menu", href: "/menu" },
      { label: "Book corporate catering", href: "/contact" },
    ],
    faqs: [
      {
        question: "Can you deliver to an office park or lobby?",
        answer:
          "Yes. We coordinate delivery windows and set up cleanly in conference rooms, lobbies, or break areas, then break down so your team gets right back to work.",
      },
      {
        question: "Do you provide everything needed to serve?",
        answer:
          "We bring serving setup, utensils, and disposables. Full-service catering adds on-site staff and full breakdown for larger or client-facing events.",
      },
      {
        question: "How much notice do you need for office catering?",
        answer:
          "A few days is usually enough for standard team lunches. Larger client events and holiday parties are best booked a couple of weeks out to lock in your date.",
      },
      {
        question: "Can you set up recurring team lunches?",
        answer:
          "Definitely. We can build a repeatable menu and a standing delivery window so feeding the team runs on autopilot — no rebooking or decision fatigue.",
      },
    ],
  },
  {
    slug: "taco-bar-catering-perfect-spread",
    title: "Taco Bar Catering: How to Build the Perfect Spread",
    excerpt:
      "The anatomy of a great build-your-own taco bar — proteins, masa, salsas, and toppings — plus how much to order so nobody leaves hungry.",
    category: "Guides",
    image: "/images/food/food-002.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-23",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "A build-your-own taco bar might be the most crowd-pleasing format in catering. It's interactive, endlessly customizable, and naturally friendly to every diet. But a great one is more than a pile of tortillas — here's how the pros build it. Still weighing your options? Compare it to a [smoked BBQ buffet](/blog/bbq-vs-taco-bar) first.",
        ],
      },
      {
        heading: "Start with the proteins",
        paragraphs: [
          "Offer two to three proteins so there's range without overwhelming the line. A [smoked pork](/recipes/smoked-pulled-pork), an [achiote chicken](/recipes/achiote-chicken-tacos), and a bold option like [carne asada](/recipes/carne-asada-tacos) or [crispy pork belly](/recipes/crispy-pork-belly-tacos) cover nearly every guest. One bold choice, one familiar choice, one meat-free choice is the magic formula.",
        ],
      },
      {
        heading: "Respect the masa",
        paragraphs: [
          "The tortilla is not an afterthought. Fresh, warm tortillas — corn for the traditionalists, flour for the rest — make or break the whole experience. Keep them warm and covered on the line so they stay soft and pliable. A side of [masa fries with cotija](/recipes/masa-fries-with-cotija) is a fun way to show off the masa, too.",
        ],
      },
      {
        heading: "Salsas and toppings",
        paragraphs: [
          "This is where guests make the taco theirs. Set out a [mild salsa roja](/recipes/house-salsa-roja), a tangy [salsa verde](/recipes/salsa-verde-tomatillo), and [guacamole](/recipes/guacamole-the-right-way), plus diced onion, cilantro, lime, crema, cheese, and pickled jalapeños. A little variety here makes a simple bar feel abundant.",
        ],
      },
      {
        heading: "Don't forget sides and drinks",
        paragraphs: [
          "Round out the bar with [esquites](/recipes/esquites-mexican-street-corn-cup), [refried beans](/recipes/refried-beans-from-scratch), and a pitcher of [horchata](/recipes/horchata-from-scratch). These hold well and keep the line moving while guests assemble.",
        ],
      },
      {
        heading: "How much to order",
        paragraphs: [
          "Plan on roughly three tacos per guest for a main meal, with a little extra protein for the heavy hitters. Order tortillas at about 1.5 times your taco count — they're cheap insurance against the bottom of the warmer running dry mid-party. Our [catering cost guide](/blog/how-much-does-catering-cost-connecticut) helps you translate that into a budget.",
        ],
      },
      {
        heading: "Let us run the line",
        paragraphs: [
          "When we cater a taco bar, we handle the quantities, the warming, the restocking, and the flow so the line never stalls. You get to actually eat at your own party. [Reach out](/contact) and we'll build a taco bar sized exactly to your crowd, on our [Food Truck](/catering/truck) or as a buffet.",
        ],
      },
      {
        heading: "Set up the line for speed",
        paragraphs: [
          "Order matters. Arrange the bar so guests move in one direction: plates and tortillas first, then proteins, then toppings and salsas, with drinks at the far end so the line doesn't bottleneck. For bigger crowds, run a double-sided station so two lines move at once.",
          "Keep tortillas warm and covered, set proteins in chafers or warmers, and place cold toppings on ice. A little setup discipline is the difference between a relaxed flow and a 20-minute wait.",
        ],
      },
      {
        heading: "Make it vegetarian- and gluten-friendly",
        paragraphs: [
          "A taco bar is one of the easiest formats to make inclusive. Offer a meat-free protein — roasted vegetables, [crispy masa](/recipes/masa-fries-with-cotija), or beans — and keep corn tortillas on hand for gluten-free guests. Toppings like [guacamole](/recipes/guacamole-the-right-way), [esquites](/recipes/esquites-mexican-street-corn-cup), and [salsa verde](/recipes/salsa-verde-tomatillo) please everyone without a separate menu.",
        ],
      },
      {
        heading: "Sides, drinks, and dessert",
        paragraphs: [
          "A few smart additions turn a taco bar into a full feast. [Refried beans](/recipes/refried-beans-from-scratch) and [Mexican street corn](/recipes/mexican-street-corn-elote) hold well and add heft; [horchata](/recipes/horchata-from-scratch) and [agua fresca de jamaica](/recipes/agua-fresca-jamaica) cool the spice; and a tray of [churros](/recipes/churros-with-chocolate) closes the night on a high note.",
        ],
      },
      {
        heading: "Taco bar vs. a BBQ spread",
        paragraphs: [
          "Not sure a taco bar is right for your event? It's hard to beat for mingling, variety, and budget, but a smoked-BBQ buffet brings its own comfort-forward appeal. Our [BBQ vs. taco bar guide](/blog/bbq-vs-taco-bar) compares them side by side so you can choose with confidence — or do both.",
        ],
      },
    ],
    related: [
      { label: "BBQ vs. taco bar", href: "/blog/bbq-vs-taco-bar" },
      { label: "Carne asada tacos recipe", href: "/recipes/carne-asada-tacos" },
      { label: "The Food Truck", href: "/catering/truck" },
      { label: "Browse all recipes", href: "/recipes" },
    ],
  },
  {
    slug: "smoked-brisket-vs-pulled-pork",
    title: "Smoked Brisket vs. Pulled Pork: Which Should You Serve?",
    excerpt:
      "Two BBQ legends, two very different personalities. Here's how to choose between brisket and pulled pork for your next event — or serve both.",
    category: "Food Stories",
    image: "/images/food/food-038.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-24",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "Ask ten pitmasters which is king — brisket or pulled pork — and you'll get ten passionate answers. The truth is they shine in different situations. Here's how to pick the right one for your event. Want to cook along? We've got recipes for both [brisket](/recipes/wood-fired-smoked-brisket) and [pulled pork](/recipes/smoked-pulled-pork).",
        ],
      },
      {
        heading: "Brisket: the showstopper",
        paragraphs: [
          "[Smoked brisket](/recipes/wood-fired-smoked-brisket) is the centerpiece protein. Sliced into thick, peppery slabs with a dark bark and a rosy smoke ring, it photographs beautifully and feels like an occasion. It's the move when you want the meat itself to be the star of a sit-down dinner or a milestone celebration.",
          "The trade-off: brisket is less forgiving and pricier per pound, since a packer brisket loses significant weight as it renders down over a 12-hour cook. If you love big beef, [smoked beef short ribs](/recipes/smoked-beef-short-ribs) are a worthy cousin.",
        ],
      },
      {
        heading: "Pulled pork: the workhorse",
        paragraphs: [
          "[Pulled pork](/recipes/smoked-pulled-pork) is generous, budget-friendly, and almost impossible to dislike. It holds beautifully on a buffet, stretches across big headcounts, and slides onto a bun, a taco, or a plate of nachos with equal ease. For large casual gatherings — like a [graduation party](/blog/graduation-party-catering-ideas) — it's hard to beat.",
        ],
      },
      {
        heading: "Pairing and crowd size",
        paragraphs: [
          "For smaller, more formal events, brisket carries the table. For big backyard parties, picnics, and graduations, pulled pork feeds the masses without breaking the budget. Many of our most popular spreads feature both — brisket for the wow, pork for the volume. Either pairs perfectly with [smoked mac and cheese](/recipes/smoked-mac-and-cheese) and [chipotle BBQ sauce](/recipes/chipotle-bbq-sauce).",
        ],
      },
      {
        heading: "Why not both?",
        paragraphs: [
          "When the headcount and budget allow, a two-meat spread covers every craving and gives guests a choice. When we [build your menu](/contact), we'll help you weigh cost, crowd, and vibe to land on the right mix — and the [catering cost guide](/blog/how-much-does-catering-cost-connecticut) explains how that affects your budget.",
        ],
      },
      {
        heading: "Cook time and difficulty",
        paragraphs: [
          "Both are low-and-slow, but brisket is the bigger commitment. A packer [brisket](/recipes/wood-fired-smoked-brisket) runs 10–14 hours and rewards careful temperature control, which is why it's rated advanced. A [pork shoulder](/recipes/smoked-pulled-pork) is far more forgiving — its higher fat content means it shrugs off small mistakes and still pulls into tender, juicy strands, making it the better first big smoke.",
          "Short on time? [Smoked chicken quarters](/recipes/smoked-chicken-quarters) or [baby back ribs](/recipes/smoked-baby-back-ribs) deliver real pit flavor in a fraction of the hours.",
        ],
      },
      {
        heading: "Flavor and texture",
        paragraphs: [
          "Brisket is beefy, peppery, and built around contrast — a dark, crusty bark against a tender, sliceable interior with a rosy smoke ring. Pulled pork is sweeter and more mellow, all soft strands and rendered fat that soak up sauce and rub. One is a knife-and-fork showpiece; the other is the ultimate sandwich and taco filler.",
        ],
      },
      {
        heading: "Serving, sauces, and leftovers",
        paragraphs: [
          "Brisket shines sliced and served simply, letting the meat speak. Pulled pork loves a sauce — a tangy [chipotle BBQ sauce](/recipes/chipotle-bbq-sauce) is a perfect match — and reheats beautifully for days, sliding into tacos, nachos, or breakfast hash. Both pair naturally with [smoked mac and cheese](/recipes/smoked-mac-and-cheese) and [refried beans](/recipes/refried-beans-from-scratch).",
        ],
      },
    ],
    related: [
      { label: "Wood-fired smoked brisket recipe", href: "/recipes/wood-fired-smoked-brisket" },
      { label: "Smoked pulled pork recipe", href: "/recipes/smoked-pulled-pork" },
      { label: "BBQ vs. taco bar", href: "/blog/bbq-vs-taco-bar" },
      { label: "What catering costs", href: "/blog/how-much-does-catering-cost-connecticut" },
    ],
  },
  {
    slug: "graduation-party-catering-ideas",
    title: "Graduation Party Catering Ideas for a Crowd",
    excerpt:
      "Feeding a graduation party means feeding all ages at once. Here's how to plan a menu that satisfies grandparents and teenagers alike.",
    category: "Planning",
    image: "/images/food/food-051.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-25",
    readTime: "8 min read",
    body: [
      {
        paragraphs: [
          "Graduation parties are a special kind of catering challenge: you're feeding a wide-open mix of ages, a fluid guest count, and a long afternoon of drop-ins. The goal is food that's easy, abundant, and loved by everyone from grandma to the graduate's friends. Our [backyard party guide](/blog/planning-catering-backyard-party) pairs well with this read.",
        ],
      },
      {
        heading: "Choose a format that handles drop-ins",
        paragraphs: [
          "Grad parties rarely have a single sit-down moment — people arrive across hours. A buffet or [taco bar](/blog/taco-bar-catering-perfect-spread) that holds well over time is ideal, letting late arrivals eat just as well as the early crowd without you firing up the kitchen again.",
        ],
      },
      {
        heading: "Crowd-pleasers that bridge generations",
        paragraphs: [
          "[Pulled pork](/recipes/smoked-pulled-pork), [smoked chicken quarters](/recipes/smoked-chicken-quarters), and a taco bar are universal hits. They give teenagers the fun, customizable food they love while still delivering the hearty, comforting plates older guests appreciate. Add familiar sides like [smoked mac and cheese](/recipes/smoked-mac-and-cheese) and [Mexican street corn](/recipes/mexican-street-corn-elote) and you've covered the whole family tree.",
        ],
      },
      {
        heading: "A sweet, easy finish",
        paragraphs: [
          "Dessert doesn't need to be complicated. A platter of warm [churros with chocolate](/recipes/churros-with-chocolate) and a cooler of [agua fresca de jamaica](/recipes/agua-fresca-jamaica) keep the younger crowd thrilled and the grown-ups refreshed.",
        ],
      },
      {
        heading: "Plan for an uncertain headcount",
        paragraphs: [
          "Grad party RSVPs are famously loose. Plan for the higher end of your estimate and lean on formats that scale gracefully — running short on food is the one thing guests remember. Our [catering cost guide](/blog/how-much-does-catering-cost-connecticut) helps you budget for that buffer. Leftovers, on the other hand, become the graduate's dinner all week.",
        ],
      },
      {
        heading: "Let the family enjoy the day",
        paragraphs: [
          "This is your kid's milestone — you shouldn't spend it refilling trays. When we cater, we handle setup, restocking, and cleanup so the whole family can actually be present. [Reach out early](/contact); late spring books up fast across Connecticut.",
        ],
      },
      {
        heading: "A graduation party menu that works",
        paragraphs: [
          "Here's a reliable spread for a graduation crowd: [pulled pork](/recipes/smoked-pulled-pork) and [smoked chicken quarters](/recipes/smoked-chicken-quarters) as the anchors, a build-your-own [taco bar](/blog/taco-bar-catering-perfect-spread) for the younger guests, and shareable sides like [smoked mac and cheese](/recipes/smoked-mac-and-cheese), [Mexican street corn](/recipes/mexican-street-corn-elote), and [refried beans](/recipes/refried-beans-from-scratch).",
          "Add [house salsa roja](/recipes/house-salsa-roja) and [guacamole](/recipes/guacamole-the-right-way) at the table, [churros](/recipes/churros-with-chocolate) for dessert, and a cooler of [horchata](/recipes/horchata-from-scratch) and [agua fresca de jamaica](/recipes/agua-fresca-jamaica). It scales easily and pleases every age at the party.",
        ],
      },
      {
        heading: "Timing around the ceremony",
        paragraphs: [
          "Graduation days are busy — ceremonies, photos, and travel all compete for the schedule. Choose food that's ready when you are. Buffets and taco bars hold well for hours, so guests arriving straight from the school eat just as well as those who came early. If you're cooking yourself, lean on make-ahead dishes and a smoked centerpiece that rests happily while you're out for the cap-and-gown moment.",
        ],
      },
      {
        heading: "Indoor, outdoor, or on the move",
        paragraphs: [
          "Late-spring weather in Connecticut is unpredictable, so plan for both. A backyard setup is classic, but have a covered or indoor backup. Our mobile [Food Truck and Pit Trailer](/catering) work in either setting, and a food truck on the lawn turns the party into the event of the season — see how [food-truck catering](/blog/food-truck-festival-catering-connecticut) works.",
        ],
      },
    ],
    related: [
      { label: "Plan a backyard party", href: "/blog/planning-catering-backyard-party" },
      { label: "Build the perfect taco bar", href: "/blog/taco-bar-catering-perfect-spread" },
      { label: "Smoked pulled pork recipe", href: "/recipes/smoked-pulled-pork" },
      { label: "Book your party", href: "/contact" },
    ],
  },
  {
    slug: "mexican-street-food-guide-birria-esquites-aguas-frescas",
    title: "A Guide to Mexican Street Food: Birria, Esquites & Aguas Frescas",
    excerpt:
      "New to the menu beyond tacos? Here's a friendly guide to the street-food classics we serve — what they are, how they're made, and why you'll love them.",
    category: "Food Stories",
    image: "/images/food/food-117.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-26",
    readTime: "7 min read",
    body: [
      {
        paragraphs: [
          "Mexican street food is a whole universe beyond the taco. If you've spotted birria, esquites, or aguas frescas on our [menu](/menu) and weren't sure what you were ordering, here's your friendly field guide to the classics. You'll find many of these at our [festival appearances](/festivals), too.",
        ],
      },
      {
        heading: "Birria: the rich, dippable braise",
        paragraphs: [
          "Birria is meat — traditionally goat, often beef — slow-braised in a deep adobo of dried chilies until it shreds into tender strands. The real magic is the consommé, a savory, glossy broth you dip the tacos into. It's comfort food with serious depth, and it's earned every bit of its recent fame. Learn more in [what makes real birria so good](/blog/what-makes-real-birria-good), or make it with our [birria tacos recipe](/recipes/birria-tacos-consomme).",
        ],
      },
      {
        heading: "Esquites: street corn in a cup",
        paragraphs: [
          "[Esquites](/recipes/esquites-mexican-street-corn-cup) is the cup-and-spoon cousin of [elote](/recipes/mexican-street-corn-elote). Charred corn kernels are tossed with crema, cotija cheese, lime, and chili powder for a creamy, tangy, slightly spicy bite. It's the perfect handheld side that travels well on any buffet line.",
        ],
      },
      {
        heading: "Aguas frescas: the original refresher",
        paragraphs: [
          "Aguas frescas — \"fresh waters\" — are light, fruit-forward drinks made from blended fruit, water, and a touch of sweetness. [Horchata](/recipes/horchata-from-scratch), [hibiscus (jamaica)](/recipes/agua-fresca-jamaica), and tamarind are the classics. They're non-alcoholic crowd-pleasers that cut through smoke and spice beautifully.",
        ],
      },
      {
        heading: "Masa fries, tortas, and more",
        paragraphs: [
          "Our festival and street menu also leans on [masa fries](/recipes/masa-fries-with-cotija), the [chile-beef torta](/recipes/chile-beef-torta), and [crispy pork belly](/recipes/crispy-pork-belly-tacos) — the kind of food meant to be eaten standing up, hand to mouth, with friends. It's joyful, generous, and unfussy by design.",
        ],
      },
      {
        heading: "Taste it for yourself",
        paragraphs: [
          "The best way to understand street food is to eat it. Catch us at a [festival or pop-up](/festivals) across Connecticut, or [bring these classics to your next event](/contact). Smoke. Masa. Repeat.",
        ],
      },
      {
        heading: "The role of masa",
        paragraphs: [
          "Masa — nixtamalized corn dough — is the foundation of Mexican street food, and it's where the 'Masa' in our name comes from. It becomes the tortillas that cradle [carne asada](/recipes/carne-asada-tacos) and [achiote chicken](/recipes/achiote-chicken-tacos), the base for crispy [masa fries](/recipes/masa-fries-with-cotija), and the backbone of countless antojitos. Fresh masa has a sweet, toasty corn flavor that pre-packaged tortillas simply can't match — it's worth seeking out.",
        ],
      },
      {
        heading: "Tacos vs. tortas vs. burritos",
        paragraphs: [
          "Street food comes in many vessels. Tacos are small, soft, and meant to be eaten two or three at a time. A [torta](/recipes/chile-beef-torta) is the hearty sandwich cousin, stacked on a crusty roll with beans, avocado, and pickled chiles. The burrito wraps it all into one handheld meal. Each shines with the same fillings — it's really about how much you want in one bite.",
        ],
      },
      {
        heading: "How to build a street-food spread",
        paragraphs: [
          "Want to bring this energy to an event? Pair a couple of proteins with handheld sides like [esquites](/recipes/esquites-mexican-street-corn-cup) and [guacamole](/recipes/guacamole-the-right-way), set out [salsa roja](/recipes/house-salsa-roja) and [salsa verde](/recipes/salsa-verde-tomatillo), and pour [aguas frescas](/recipes/agua-fresca-jamaica) to drink. Our [taco bar guide](/blog/taco-bar-catering-perfect-spread) lays out the full blueprint, and our [festival menu](/festivals) shows how we serve it on the move.",
        ],
      },
    ],
    related: [
      { label: "What makes real birria so good", href: "/blog/what-makes-real-birria-good" },
      { label: "Esquites recipe", href: "/recipes/esquites-mexican-street-corn-cup" },
      { label: "Our festival & street menu", href: "/festivals" },
      { label: "Browse all recipes", href: "/recipes" },
    ],
  },
  {
    slug: "food-truck-festival-catering-connecticut",
    title: "Booking a Food Truck for Festivals & Events in Connecticut",
    excerpt:
      "Thinking about a food truck for your festival, market, or private party? Here's how mobile catering works and how to book Pit & Masa.",
    category: "Planning",
    image: "/images/food/food-074.webp",
    author: 'Ryan "Buck" Buchanan',
    date: "2026-06-27",
    readTime: "9 min read",
    body: [
      {
        paragraphs: [
          "There's something about a food truck that turns an event into an occasion. The smoke, the line, the smell of fresh masa on the griddle — it's an attraction as much as a meal. Here's how mobile catering works and how to bring it to your next event. Meet our rigs on the [catering page](/catering).",
        ],
      },
      {
        heading: "Where food trucks shine",
        paragraphs: [
          "Festivals, farmers markets, breweries, corporate campuses, and large outdoor parties are perfect fits. A truck handles big, flowing crowds without a formal buffet, and the made-to-order experience keeps the food fresh and the line moving. See where we'll be next on our [festivals page](/festivals).",
        ],
      },
      {
        heading: "Meet the rigs",
        paragraphs: [
          "We run two mobile setups: the [Food Truck](/catering/truck) for fast, made-to-order street food, and the [Pit Trailer](/catering/trailer) for full smoked-BBQ service. For weddings and upscale events, the [Cocktail Cart](/catering/cocktail-cart) rounds out the fleet.",
        ],
      },
      {
        heading: "Festival and street menu",
        paragraphs: [
          "Our street setup is built for speed and flavor — smoked pork tacos, [achiote chicken](/recipes/achiote-chicken-tacos), [crispy pork belly](/recipes/crispy-pork-belly-tacos), the [chile-beef torta](/recipes/chile-beef-torta), the pit burrito, the [pit burger](/recipes/pit-smashed-burger), [masa fries](/recipes/masa-fries-with-cotija), [esquites](/recipes/esquites-mexican-street-corn-cup), and aguas frescas. It's designed to plate fast without cutting a single corner. New to these dishes? Read our [Mexican street food guide](/blog/mexican-street-food-guide-birria-esquites-aguas-frescas).",
        ],
      },
      {
        heading: "What to know before you book",
        paragraphs: [
          "Mobile catering needs a few logistics nailed down: space for the truck, power or generator access, the expected crowd size, and any venue or municipal permits. We'll walk you through all of it so there are no day-of surprises.",
        ],
      },
      {
        heading: "How to book us",
        paragraphs: [
          "Whether you're a festival organizer, a brewery, or a host planning a backyard blowout, [reach out](/contact) with your date, location, and estimated headcount. We serve towns across Connecticut and book popular dates early — so the sooner you start the conversation, the better.",
        ],
      },
      {
        heading: "Food truck vs. drop-off vs. buffet",
        paragraphs: [
          "A food truck is an experience as much as a meal — the smoke, the line, the made-to-order plates. It's ideal for festivals, breweries, and large outdoor events where you want energy and flow. Drop-off catering suits smaller, budget-conscious gatherings, while a staffed buffet fits seated events like weddings. Our [catering cost guide](/blog/how-much-does-catering-cost-connecticut) compares what each tends to run.",
        ],
      },
      {
        heading: "Logistics: power, space, and permits",
        paragraphs: [
          "A few practical details keep service smooth. The truck needs a roughly level spot with room to open the service window and, for longer events, access to power or space for our generator. Public events may require a municipal permit or proof of insurance — we're happy to provide documentation and coordinate with organizers. We confirm all of this before the date so there are zero day-of surprises.",
        ],
      },
      {
        heading: "How many guests can a truck serve?",
        paragraphs: [
          "More than most people expect. With a streamlined [street menu](/festivals) and a smart line setup, our [Food Truck](/catering/truck) keeps hundreds of guests moving over a service window. For very large or multi-hour events, we scale staff and prep accordingly, and the [Pit Trailer](/catering/trailer) can run full smoked-BBQ service alongside it.",
        ],
      },
      {
        heading: "Where we serve",
        paragraphs: [
          "We're a mobile operation built to travel — from Hartford and New Haven to Stamford, Danbury, and the smaller towns in between. If you're planning an event anywhere in Connecticut, [tell us where and when](/contact) and we'll let you know how we can make it happen.",
        ],
      },
    ],
    related: [
      { label: "Mexican street food guide", href: "/blog/mexican-street-food-guide-birria-esquites-aguas-frescas" },
      { label: "The Food Truck", href: "/catering/truck" },
      { label: "Upcoming festivals", href: "/festivals" },
      { label: "Book the truck", href: "/contact" },
    ],
  },
];

/* ──────── Lookup helpers ──────── */
export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
