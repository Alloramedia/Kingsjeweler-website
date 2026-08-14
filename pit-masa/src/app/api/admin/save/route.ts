import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { readRawOverrides, readRawDraft, writeRawDraft } from "@/lib/admin/store";
import {
  type Overrides,
  type HoursRow,
  type MenuSection,
  type Bundle,
  type Announcement,
  type Testimonial,
  type FaqItem,
  type FaqPageKey,
  type EventItem,
  type SeoPageKey,
  type SeoEntry,
  SEO_PAGES,
  FAQ_PAGES,
} from "@/lib/admin/schema";
import type { Recipe, BlogPost } from "@/lib/content";

const SECTIONS = ["contact", "socials", "hours", "menu", "bundles", "recipes", "blog", "hero", "images", "colors", "announcement", "testimonials", "faqs", "serviceTowns", "gallery", "events", "seo"] as const;
type Section = (typeof SECTIONS)[number];

const str = (v: unknown, max = 400): string =>
  typeof v === "string" ? v.slice(0, max) : "";

const strArr = (v: unknown, max = 400): string[] =>
  Array.isArray(v) ? v.map((x) => str(x, max)).filter(Boolean) : [];

function cleanContact(v: unknown): Overrides["contact"] {
  const o = (v ?? {}) as Record<string, unknown>;
  return { phone: str(o.phone, 40), email: str(o.email, 120) };
}

function cleanSocials(v: unknown): Overrides["socials"] {
  const o = (v ?? {}) as Record<string, unknown>;
  return {
    facebook: str(o.facebook, 300),
    instagram: str(o.instagram, 300),
    tiktok: str(o.tiktok, 300),
    gmb: str(o.gmb, 300),
  };
}

function cleanHours(v: unknown): HoursRow[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((r) => ({ day: str((r as HoursRow)?.day, 80), hours: str((r as HoursRow)?.hours, 120) }))
    .filter((r) => r.day || r.hours);
}

function cleanMenu(v: unknown): MenuSection[] {
  if (!Array.isArray(v)) return [];
  return v.map((s) => {
    const sec = s as MenuSection;
    return {
      title: str(sec?.title, 120),
      group: str(sec?.group, 120),
      service: str(sec?.service, 60),
      blurb: str(sec?.blurb, 400),
      items: Array.isArray(sec?.items)
        ? sec.items.map((i) => ({
            name: str(i?.name, 160),
            desc: str(i?.desc, 400),
            price: str(i?.price, 60),
            choose: str(i?.choose, 60),
            options: Array.isArray(i?.options)
              ? i.options.map((o) => str(o, 160)).filter(Boolean).slice(0, 30)
              : [],
            recipeIds: Array.isArray(i?.recipeIds)
              ? i.recipeIds.map((r) => str(r, 60)).filter(Boolean).slice(0, 30)
              : [],
          }))
        : [],
    };
  });
}

function cleanBundles(v: unknown): Bundle[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((b) => {
      const bundle = b as Bundle;
      return {
        name: str(bundle?.name, 120),
        blurb: str(bundle?.blurb, 600),
        vehicles: strArr(bundle?.vehicles, 60),
        highlights: strArr(bundle?.highlights, 200),
      };
    })
    .filter((b) => b.name || b.blurb);
}

function cleanRecipes(v: unknown): Recipe[] {
  if (!Array.isArray(v)) return [];
  const allowed = ["Easy", "Intermediate", "Advanced"];
  return v.map((r) => {
    const rec = r as Recipe;
    const difficulty = allowed.includes(rec?.difficulty) ? rec.difficulty : "Easy";
    return {
      slug: str(rec?.slug, 120).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
      title: str(rec?.title, 160),
      excerpt: str(rec?.excerpt, 400),
      category: str(rec?.category, 80),
      image: str(rec?.image, 300),
      time: str(rec?.time, 80),
      difficulty: difficulty as Recipe["difficulty"],
      serves: str(rec?.serves, 80),
      date: str(rec?.date, 40),
      intro: strArr(rec?.intro, 1200),
      ingredients: strArr(rec?.ingredients, 300),
      steps: Array.isArray(rec?.steps)
        ? rec.steps.map((s) => ({ title: str(s?.title, 160), body: str(s?.body, 1200) }))
        : [],
      tip: str(rec?.tip, 600),
    };
  });
}

function cleanBlog(v: unknown): BlogPost[] {
  if (!Array.isArray(v)) return [];
  return v.map((p) => {
    const post = p as BlogPost;
    return {
      slug: str(post?.slug, 120).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
      title: str(post?.title, 160),
      excerpt: str(post?.excerpt, 400),
      category: str(post?.category, 80),
      image: str(post?.image, 300),
      author: str(post?.author, 120),
      date: str(post?.date, 40),
      readTime: str(post?.readTime, 40),
      body: Array.isArray(post?.body)
        ? post.body.map((b) => ({ heading: str(b?.heading, 200), paragraphs: strArr(b?.paragraphs, 2000) }))
        : [],
    };
  });
}

function cleanHero(v: unknown): Overrides["hero"] {
  const o = (v ?? {}) as { home?: { title?: unknown; subtitle?: unknown } };
  return { home: { title: str(o.home?.title, 160), subtitle: str(o.home?.subtitle, 400) } };
}

function cleanBrandImages(v: unknown): Overrides["brandImages"] {
  const o = (v ?? {}) as Record<string, unknown>;
  const img = (x: unknown) => str(x, 300);
  const imgArr = (x: unknown) => strArr(x, 300);
  return {
    heroHome: img(o.heroHome),
    heroCatering: img(o.heroCatering),
    heroEvents: img(o.heroEvents),
    menuFeature: img(o.menuFeature),
    aboutFeature: img(o.aboutFeature),
    owner: img(o.owner),
    logo: img(o.logo),
    heroSlides: imgArr(o.heroSlides),
    cards: imgArr(o.cards),
  };
}

function cleanColors(v: unknown): Overrides["colors"] {
  const o = (v ?? {}) as Record<string, unknown>;
  const hex = (x: unknown) => {
    const s = str(x, 9).trim();
    return /^#[0-9a-fA-F]{3,8}$/.test(s) ? s : "";
  };
  return {
    primary: hex(o.primary),
    primaryHover: hex(o.primaryHover),
    primaryLight: hex(o.primaryLight),
    secondary: hex(o.secondary),
    dark: hex(o.dark),
    cream: hex(o.cream),
    card: hex(o.card),
    sand: hex(o.sand),
  };
}

function cleanAnnouncement(v: unknown): Announcement {
  const o = (v ?? {}) as Record<string, unknown>;
  const date = (x: unknown) => {
    const s = str(x, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
  };
  return {
    enabled: o.enabled === true,
    message: str(o.message, 280),
    startDate: date(o.startDate),
    endDate: date(o.endDate),
  };
}

function cleanTestimonials(v: unknown): Testimonial[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((t) => {
      const r = t as Testimonial;
      return {
        author: str(r?.author, 80),
        role: str(r?.role, 120),
        body: str(r?.body, 600),
      };
    })
    .filter((t) => t.author || t.body);
}

function cleanEvents(v: unknown): EventItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((e) => {
      const r = e as EventItem;
      return {
        name: str(r?.name, 160),
        date: str(r?.date, 80),
        location: str(r?.location, 160),
        time: str(r?.time, 80),
        url: str(r?.url, 300),
      };
    })
    .filter((e) => e.name || e.date || e.location);
}

function cleanFaqs(v: unknown): Overrides["faqs"] {
  const o = (v ?? {}) as Record<string, unknown>;
  const out: Partial<Record<FaqPageKey, FaqItem[]>> = {};
  for (const p of FAQ_PAGES) {
    const list = o[p.key];
    out[p.key] = Array.isArray(list)
      ? list
          .map((f) => ({
            question: str((f as FaqItem)?.question, 200),
            answer: str((f as FaqItem)?.answer, 1000),
          }))
          .filter((f) => f.question || f.answer)
      : [];
  }
  return out;
}

function cleanAltMap(v: unknown): Record<string, string> {
  if (!v || typeof v !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    const key = str(k, 300);
    const text = str(val, 200);
    if (key && text) out[key] = text;
  }
  return out;
}

function cleanSeo(v: unknown): Overrides["seo"] {
  const o = (v ?? {}) as Record<string, unknown>;
  const out: Partial<Record<SeoPageKey, SeoEntry>> = {};
  for (const p of SEO_PAGES) {
    const entry = (o[p.key] ?? {}) as Record<string, unknown>;
    out[p.key] = { title: str(entry.title, 70), description: str(entry.description, 200) };
  }
  return out;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let section: Section;
  let value: unknown;
  try {
    const body = await request.json();
    section = body?.section;
    value = body?.value;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Unknown section." }, { status: 400 });
  }

  const current = ((await readRawDraft()) ?? (await readRawOverrides())) as Overrides;
  const next: Overrides = { ...current };

  switch (section) {
    case "contact":
      next.contact = cleanContact(value);
      break;
    case "socials":
      next.socials = cleanSocials(value);
      break;
    case "hours":
      next.hours = cleanHours(value);
      break;
    case "menu":
      next.menu = cleanMenu(value);
      break;
    case "bundles":
      next.bundles = cleanBundles(value);
      break;
    case "recipes":
      next.recipes = cleanRecipes(value);
      break;
    case "blog":
      next.blog = cleanBlog(value);
      break;
    case "hero":
      next.hero = cleanHero(value);
      break;
    case "images":
      next.brandImages = cleanBrandImages(value);
      break;
    case "colors":
      next.colors = cleanColors(value);
      break;
    case "announcement":
      next.announcement = cleanAnnouncement(value);
      break;
    case "testimonials":
      next.testimonials = cleanTestimonials(value);
      break;
    case "faqs":
      next.faqs = cleanFaqs(value);
      break;
    case "serviceTowns":
      next.serviceTowns = strArr(value, 80);
      break;
    case "gallery":
      if (Array.isArray(value)) {
        next.gallery = strArr(value, 300);
      } else {
        const g = (value ?? {}) as { images?: unknown; alt?: unknown };
        next.gallery = strArr(g.images, 300);
        next.imageAlt = cleanAltMap(g.alt);
      }
      break;
    case "events":
      next.events = cleanEvents(value);
      break;
    case "seo":
      next.seo = cleanSeo(value);
      break;
  }

  // Edits are saved to the unpublished draft — the live site is untouched
  // until the client hits "Publish".
  await writeRawDraft(next as Record<string, unknown>);

  return NextResponse.json({ ok: true, hasDraft: true });
}
