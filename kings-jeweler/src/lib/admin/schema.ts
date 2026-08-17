import "server-only";
import { draftMode, headers } from "next/headers";
import type { BlogPost } from "@/lib/content";
import { readRawOverrides, readRawDraft, hasDraft } from "./store";
import { mergeContent, type Overrides, type SiteContent } from "./types";

export * from "./types";
export { hasDraft };

/**
 * Whether the current request should render the unpublished DRAFT.
 *
 * Normally this is Next.js Draft Mode (a signed cookie enabled by the
 * auth-gated `/api/admin/preview` route). The admin's in-tool "Compare" view
 * loads a second copy of the page with `?__pm=live`; the proxy turns that
 * into an `x-pm-view: live` header which forces the PUBLISHED version here,
 * even though the same browser has Draft Mode on. Published content is already
 * public, so this never exposes the draft to visitors.
 */
export async function isPreviewMode(): Promise<boolean> {
  try {
    if ((await headers()).get("x-pm-view") === "live") return false;
  } catch {
    // headers() unavailable — fall through to Draft Mode.
  }
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

/**
 * Decide which overrides to render. Visitors always see the published version;
 * inside preview mode (Next.js Draft Mode) the unpublished draft is shown so
 * the client can review changes before they go live.
 */
async function resolveOverrides(): Promise<Overrides> {
  if (await isPreviewMode()) {
    const draft = await readRawDraft();
    if (draft) return draft as Overrides;
  }
  return (await readRawOverrides()) as Overrides;
}

/**
 * Resolved site content (defaults + saved overrides).
 *
 * Reads directly from the store during render. Public requests use the
 * published overrides; preview requests use the unpublished draft.
 */
export async function getSiteContent(): Promise<SiteContent> {
  return mergeContent(await resolveOverrides());
}

/**
 * The working copy for the admin screen — the draft when one exists, otherwise
 * the published content. Always reflects the latest edits regardless of
 * preview mode.
 */
export async function getEditableContent(): Promise<SiteContent> {
  const draft = await readRawDraft();
  return mergeContent((draft ?? (await readRawOverrides())) as Overrides);
}

/** Read the raw saved overrides (for pre-filling the admin forms). */
export async function getOverrides(): Promise<Overrides> {
  return (await readRawOverrides()) as Overrides;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { blog } = await getSiteContent();
  return blog.find((p) => p.slug === slug);
}
