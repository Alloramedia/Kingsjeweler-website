import type { BrandColors } from "./types";

/**
 * The site's components use literal hex Tailwind utilities (e.g. `bg-[#FF8C00]`)
 * rather than CSS variables. To let the admin recolor the brand, we map each
 * editable token to the exact hex string used throughout the codebase, then
 * generate an override stylesheet that remaps those utility classes to the
 * chosen colors. Soft tints that bake in an opacity modifier (e.g.
 * `bg-[#FF8C00]/30`) are separate classes and keep their original hue.
 */
const TOKEN_HEX: Record<keyof BrandColors, string> = {
  primary: "#FF8C00",
  primaryHover: "#E67E00",
  primaryLight: "#FFA733",
  secondary: "#008080",
  dark: "#1C1C1C",
  cream: "#FEFCF5",
  card: "#FFFCF7",
  sand: "#DEDEDE",
};

// Escaped arbitrary-value selector fragment, e.g. "#FF8C00" -> "\[\#FF8C00\]".
const sel = (hex: string) => `\\[\\#${hex.replace(/^#/, "")}\\]`;

function rulesFor(hex: string, v: string): string {
  const s = sel(hex);
  return [
    `.bg-${s}{background-color:${v}!important}`,
    `.hover\\:bg-${s}:hover{background-color:${v}!important}`,
    `.group:hover .group-hover\\:bg-${s}{background-color:${v}!important}`,
    `.text-${s}{color:${v}!important}`,
    `.hover\\:text-${s}:hover{color:${v}!important}`,
    `.group:hover .group-hover\\:text-${s}{color:${v}!important}`,
    `.border-${s}{border-color:${v}!important}`,
    `.hover\\:border-${s}:hover{border-color:${v}!important}`,
    `.ring-${s}{--tw-ring-color:${v}!important}`,
    `.focus-visible\\:ring-${s}:focus-visible{--tw-ring-color:${v}!important}`,
    `.fill-${s}{fill:${v}!important}`,
    `.stroke-${s}{stroke:${v}!important}`,
    `.decoration-${s}{text-decoration-color:${v}!important}`,
    `.from-${s}{--tw-gradient-from:${v}!important}`,
    `.via-${s}{--tw-gradient-via:${v}!important}`,
    `.to-${s}{--tw-gradient-to:${v}!important}`,
  ].join("");
}

const isHex = (v: string) => /^#[0-9a-fA-F]{3,8}$/.test(v);

/**
 * Builds the injected theme stylesheet from the chosen brand colors. Returns an
 * empty string when every color matches its default (nothing to override).
 */
export function buildThemeCss(colors: BrandColors): string {
  let rules = "";
  (Object.keys(TOKEN_HEX) as (keyof BrandColors)[]).forEach((key) => {
    const v = colors[key];
    const def = TOKEN_HEX[key];
    if (!v || !isHex(v) || v.toLowerCase() === def.toLowerCase()) return;
    rules += rulesFor(def, v);
  });

  // Keep var()-based styles (focus ring, ::selection, etc.) in sync.
  const vars: string[] = [];
  const set = (token: keyof BrandColors, names: string[]) => {
    const v = colors[token];
    if (v && isHex(v) && v.toLowerCase() !== TOKEN_HEX[token].toLowerCase()) {
      names.forEach((n) => vars.push(`${n}:${v}`));
    }
  };
  set("primary", ["--primary", "--orange", "--ring", "--color-3"]);
  set("secondary", ["--secondary", "--accent", "--teal", "--color-4"]);
  set("dark", ["--foreground", "--espresso", "--card-foreground", "--color-1"]);
  set("cream", ["--background", "--cream", "--color-2"]);
  set("card", ["--card"]);
  set("sand", ["--muted", "--tan"]);

  if (!rules && !vars.length) return "";
  return `${vars.length ? `:root{${vars.join(";")}}` : ""}${rules}`;
}
