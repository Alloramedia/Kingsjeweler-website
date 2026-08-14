import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import {
  readInventory,
  writeInventory,
  readDishRecipes,
  writeDishRecipes,
} from "@/lib/admin/store";
import {
  INVENTORY_CATEGORIES,
  UNITS,
  emptyNutrition,
  type InventoryItem,
  type DishRecipe,
  type InventoryCategory,
  type Unit,
  type NutritionFacts,
} from "@/lib/admin/kitchen";

export const dynamic = "force-dynamic";

function str(v: unknown, max = 200): string {
  return String(v ?? "").slice(0, max).replace(/<[^>]*>/g, "").trim();
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function slug(v: string): string {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

/** Whitelist + clamp a per-unit nutrition record coming from the client. */
function cleanNutrition(raw: unknown): NutritionFacts {
  const o = (raw ?? {}) as Record<string, unknown>;
  const round = (v: unknown) => Math.round(num(v) * 100) / 100;
  return {
    calories: round(o.calories),
    protein: round(o.protein),
    carbs: round(o.carbs),
    fat: round(o.fat),
    fiber: round(o.fiber),
    sodium: round(o.sodium),
  };
}

/** Whitelist + clamp an inventory list coming from the client. */
function cleanInventory(raw: unknown): InventoryItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.slice(0, 500).map((r): InventoryItem => {
    const o = (r ?? {}) as Record<string, unknown>;
    let id = slug(str(o.id, 60) || str(o.name, 60));
    if (!id) id = `item-${Math.random().toString(36).slice(2, 8)}`;
    while (seen.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 4)}`;
    seen.add(id);
    const category = (INVENTORY_CATEGORIES as readonly string[]).includes(str(o.category))
      ? (str(o.category) as InventoryCategory)
      : "Other";
    const unit = (UNITS as readonly string[]).includes(str(o.unit))
      ? (str(o.unit) as Unit)
      : "lb";
    return {
      id,
      name: str(o.name, 80) || "Untitled item",
      category,
      unit,
      unitPrice: Math.round(num(o.unitPrice) * 100) / 100,
      nutrition: o.nutrition ? cleanNutrition(o.nutrition) : emptyNutrition(),
      notes: str(o.notes, 160) || undefined,
      updatedAt: Date.now(),
    };
  });
}

/** Whitelist + clamp a recipe list coming from the client. */
function cleanRecipes(raw: unknown): DishRecipe[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.slice(0, 500).map((r): DishRecipe => {
    const o = (r ?? {}) as Record<string, unknown>;
    let id = slug(str(o.id, 60) || str(o.dish, 60));
    if (!id) id = `dish-${Math.random().toString(36).slice(2, 8)}`;
    while (seen.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 4)}`;
    seen.add(id);
    const ingredients = Array.isArray(o.ingredients)
      ? o.ingredients
          .slice(0, 60)
          .map((g) => {
            const gi = (g ?? {}) as Record<string, unknown>;
            return {
              inventoryId: slug(str(gi.inventoryId, 60)),
              qtyPerServing: Math.round(num(gi.qtyPerServing) * 10000) / 10000,
            };
          })
          .filter((g) => g.inventoryId)
      : [];
    return {
      id,
      dish: str(o.dish, 80) || "Untitled dish",
      category: str(o.category, 40) || "Other",
      yieldNote: str(o.yieldNote, 80) || undefined,
      ingredients,
    };
  });
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const [inventory, recipes] = await Promise.all([
    readInventory(),
    readDishRecipes(),
  ]);
  return NextResponse.json({ inventory, recipes });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const kind = str(body.kind, 20);
  if (kind === "inventory") {
    const items = cleanInventory(body.items);
    await writeInventory(items);
    return NextResponse.json({ ok: true, inventory: items });
  }
  if (kind === "recipes") {
    const recipes = cleanRecipes(body.recipes);
    await writeDishRecipes(recipes);
    return NextResponse.json({ ok: true, recipes });
  }
  return NextResponse.json({ error: "Unknown kind." }, { status: 400 });
}
