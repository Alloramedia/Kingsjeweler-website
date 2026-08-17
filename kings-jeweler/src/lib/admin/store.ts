import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { ContactMessage, MessageStatus } from "./types";
// Last-published overrides committed to the repo on Publish (Model A backup).
// Bundled into every deploy so published edits survive even if Netlify Blobs
// is empty or reset. It's `{}` until the first successful publish + repo sync.
import committedOverrides from "../../../content/overrides.json";

/**
 * Persistence for the simple site admin.
 *
 * Production (Netlify): edits are stored in Netlify Blobs — a built-in
 * key/value store. No external account or database is required.
 *
 * Local dev (`next dev`): Netlify Blobs isn't available, so edits fall back
 * to a gitignored JSON file under `.admin-data/` so the admin still works
 * end-to-end while developing.
 */

const STORE_NAME = "kings-jeweler-site-admin";
const MEDIA_STORE_NAME = "kings-jeweler-media";
const KEY = "overrides";
const DRAFT_KEY = "draft";
const HISTORY_KEY = "history";
const MESSAGES_KEY = "messages";
const DATA_DIR = path.join(process.cwd(), ".admin-data");
const DEV_FILE = path.join(DATA_DIR, "overrides.json");
const DEV_DRAFT_FILE = path.join(DATA_DIR, "draft.json");
const DEV_HISTORY_FILE = path.join(DATA_DIR, "history.json");
const DEV_MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const DEV_MEDIA_DIR = path.join(DATA_DIR, "media");

/** How many previous versions to keep for one-click undo. */
const HISTORY_LIMIT = 15;
/** How many contact-form messages to retain in the inbox. */
const MESSAGES_LIMIT = 500;

/** The committed repo backup, typed for use as a read fallback. */
const COMMITTED_OVERRIDES = committedOverrides as Record<string, unknown>;

/** Whether an overrides object actually carries any saved fields. */
function hasOverrides(obj: Record<string, unknown> | null | undefined): boolean {
  return !!obj && Object.keys(obj).length > 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getBlobStore(name = STORE_NAME): Promise<any | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name, consistency: "strong" });
  } catch {
    // Not running on Netlify (e.g. local `next dev`) — use the file fallback.
    return null;
  }
}

/**
 * Read the raw overrides object, newest-wins across the durable sources:
 *   1. Netlify Blobs   (live source of truth in production)
 *   2. `.admin-data`   (local-dev disk fallback)
 *   3. committed repo backup `content/overrides.json` (bundled in the deploy)
 *
 * A reachable-but-EMPTY Blobs store (e.g. a fresh/reset deploy environment)
 * must fall through to the committed backup rather than blanking the site, so
 * we only accept a source that actually carries fields. Returns `{}`
 * (code defaults) only when nothing has ever been published.
 */
export async function readRawOverrides(): Promise<Record<string, unknown>> {
  const store = await getBlobStore();
  if (store) {
    try {
      const data = (await store.get(KEY, { type: "json" })) as
        | Record<string, unknown>
        | null;
      if (hasOverrides(data)) return data as Record<string, unknown>;
      // Blobs reachable but empty — fall through to disk / committed backup.
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }

  try {
    const raw = await fs.readFile(DEV_FILE, "utf8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (hasOverrides(data)) return data;
  } catch {
    // No local override file — fall back to the committed backup.
  }

  // Durable fallback: the last-published overrides committed to the repo.
  return COMMITTED_OVERRIDES;
}

/** Persist the full overrides object. */
export async function writeRawOverrides(
  next: Record<string, unknown>,
): Promise<void> {
  const store = await getBlobStore();
  if (store) {
    try {
      await store.setJSON(KEY, next);
      return;
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }

  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
  await fs.writeFile(DEV_FILE, JSON.stringify(next, null, 2), "utf8");
}

/* ── Draft (unpublished working copy) ───────────────────────────── */

/**
 * Read the unpublished draft overrides, or `null` when there are no pending
 * changes. The draft is a full overrides object that the public site shows
 * only in preview mode; visitors keep seeing the published version until the
 * client hits "Publish".
 */
export async function readRawDraft(): Promise<Record<string, unknown> | null> {
  const store = await getBlobStore();
  if (store) {
    try {
      const data = await store.get(DRAFT_KEY, { type: "json" });
      return (data as Record<string, unknown> | null) ?? null;
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  try {
    const raw = await fs.readFile(DEV_DRAFT_FILE, "utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Persist the unpublished draft overrides. */
export async function writeRawDraft(next: Record<string, unknown>): Promise<void> {
  const store = await getBlobStore();
  if (store) {
    try {
      await store.setJSON(DRAFT_KEY, next);
      return;
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  await fs.mkdir(path.dirname(DEV_DRAFT_FILE), { recursive: true });
  await fs.writeFile(DEV_DRAFT_FILE, JSON.stringify(next, null, 2), "utf8");
}

/** Throw away the unpublished draft. */
export async function clearDraft(): Promise<void> {
  const store = await getBlobStore();
  if (store) {
    let ok = true;
    try { await store.delete(DRAFT_KEY); } catch { ok = false; }
    if (ok) return;
  }
  try { await fs.unlink(DEV_DRAFT_FILE); } catch { /* ignore */ }
}

/** Whether unpublished draft changes currently exist. */
export async function hasDraft(): Promise<boolean> {
  return (await readRawDraft()) !== null;
}

/* ── Version history (one-click undo) ───────────────────────────── */

export interface HistoryEntry {
  id: string;
  ts: number;
  /** Plain-English label, e.g. "Menu & Prices". */
  label: string;
  /** Snapshot of the overrides as they were BEFORE this change. */
  data: Record<string, unknown>;
}

/** Read the saved version history, newest first. Returns `[]` when empty. */
export async function readHistory(): Promise<HistoryEntry[]> {
  const store = await getBlobStore();
  if (store) {
    try {
      const data = await store.get(HISTORY_KEY, { type: "json" });
      return (data as HistoryEntry[] | null) ?? [];
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  try {
    const raw = await fs.readFile(DEV_HISTORY_FILE, "utf8");
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

async function writeHistory(entries: HistoryEntry[]): Promise<void> {
  const store = await getBlobStore();
  if (store) {
    try {
      await store.setJSON(HISTORY_KEY, entries);
      return;
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DEV_HISTORY_FILE, JSON.stringify(entries, null, 2), "utf8");
}

/**
 * Plain-English names for each top-level overrides section, used to describe
 * what changed in the version-history label.
 */
const SECTION_LABELS: Record<string, string> = {
  contact: "Contact info",
  socials: "Social links",
  hours: "Hours",
  menu: "Services & prices",
  blog: "Blog posts",
  hero: "Homepage hero",
  brandImages: "Brand images",
  colors: "Brand colors",
  announcement: "Announcement banner",
  testimonials: "Testimonials",
  faqs: "FAQs",
  serviceTowns: "Service area",
  gallery: "Photo gallery",
  imageAlt: "Image descriptions",
  seo: "Search-engine text",
};

/** Friendly fallback name for an unknown section key (e.g. "menuExtras"). */
function prettifyKey(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Compare the previously-live overrides with what's about to be published and
 * return a human-readable summary of which sections changed, e.g.
 * "Menu & prices, Hours" or "Menu & prices and 2 more sections".
 */
export function summarizeOverrideChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): string {
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  const changed: string[] = [];
  for (const key of keys) {
    if (JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key])) {
      changed.push(SECTION_LABELS[key] ?? prettifyKey(key));
    }
  }
  changed.sort((a, b) => a.localeCompare(b));

  if (changed.length === 0) return "Published changes";
  if (changed.length <= 3) return changed.join(", ");
  const shown = changed.slice(0, 2).join(", ");
  const rest = changed.length - 2;
  return `${shown} and ${rest} more ${rest === 1 ? "section" : "sections"}`;
}

/**
 * Record a snapshot of the current overrides under a label, keeping only the
 * most recent `HISTORY_LIMIT` entries. Call this BEFORE writing a new change
 * so the previous state can be restored.
 */
export async function appendHistory(
  label: string,
  snapshot: Record<string, unknown>,
): Promise<void> {
  const entry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    label,
    data: snapshot,
  };
  const all = [entry, ...(await readHistory())].slice(0, HISTORY_LIMIT);
  await writeHistory(all);
}

/* ── Media (uploaded photos) ────────────────────────────────────── */

export interface StoredMedia {
  body: Buffer;
  contentType: string;
}

/** Persist an uploaded, already-optimized image. */
export async function writeMedia(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const store = await getBlobStore(MEDIA_STORE_NAME);
  if (store) {
    try {
      await store.set(key, body, { metadata: { contentType } });
      return;
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  await fs.mkdir(DEV_MEDIA_DIR, { recursive: true });
  await fs.writeFile(path.join(DEV_MEDIA_DIR, key), body);
}

/** Read an uploaded image back out for serving. Returns `null` if missing. */
export async function readMedia(key: string): Promise<StoredMedia | null> {
  const store = await getBlobStore(MEDIA_STORE_NAME);
  if (store) {
    try {
      const res = await store.getWithMetadata(key, { type: "arrayBuffer" });
      if (res) {
        const meta = res.metadata as { contentType?: string } | undefined;
        return {
          body: Buffer.from(res.data as ArrayBuffer),
          contentType: meta?.contentType ?? "image/webp",
        };
      }
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  try {
    const body = await fs.readFile(path.join(DEV_MEDIA_DIR, key));
    return { body, contentType: "image/webp" };
  } catch {
    return null;
  }
}

/** List the keys of every uploaded image, newest first. */
export async function listMedia(): Promise<string[]> {
  const store = await getBlobStore(MEDIA_STORE_NAME);
  if (store) {
    try {
      const { blobs } = await store.list();
      return (blobs as { key: string }[])
        .map((b) => b.key)
        .sort()
        .reverse();
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  try {
    const files = await fs.readdir(DEV_MEDIA_DIR);
    return files.sort().reverse();
  } catch {
    return [];
  }
}

/* ── Contact-form inbox ─────────────────────────────────────────── */

/** Read every saved contact message, newest first. */
export async function readMessages(): Promise<ContactMessage[]> {
  const store = await getBlobStore();
  if (store) {
    try {
      const data = await store.get(MESSAGES_KEY, { type: "json" });
      return normalizeMessages(data as ContactMessage[] | null);
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  try {
    const raw = await fs.readFile(DEV_MESSAGES_FILE, "utf8");
    return normalizeMessages(JSON.parse(raw) as ContactMessage[]);
  } catch {
    return [];
  }
}

/** Back-fill a default status on messages saved before statuses existed. */
function normalizeMessages(list: ContactMessage[] | null): ContactMessage[] {
  if (!Array.isArray(list)) return [];
  return list.map((m) => ({ ...m, status: m.status ?? "new" }));
}

async function writeMessages(entries: ContactMessage[]): Promise<void> {
  const store = await getBlobStore();
  if (store) {
    try {
      await store.setJSON(MESSAGES_KEY, entries);
      return;
    } catch {
      // Blobs unavailable (e.g. local `next dev`) — fall back to disk.
    }
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DEV_MESSAGES_FILE, JSON.stringify(entries, null, 2), "utf8");
}

/** Save a new contact-form submission to the inbox (newest first). */
export async function appendMessage(
  msg: Omit<ContactMessage, "id" | "ts" | "read" | "status">,
): Promise<void> {
  const entry: ContactMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    read: false,
    status: "new",
    ...msg,
  };
  const all = [entry, ...(await readMessages())].slice(0, MESSAGES_LIMIT);
  await writeMessages(all);
}

/** Mark one message read/unread. */
export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const all = await readMessages();
  await writeMessages(all.map((m) => (m.id === id ? { ...m, read } : m)));
}

/** Set the lead-pipeline status of one message. */
export async function setMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<void> {
  const all = await readMessages();
  await writeMessages(all.map((m) => (m.id === id ? { ...m, status } : m)));
}

/** Permanently delete one message from the inbox. */
export async function deleteMessage(id: string): Promise<void> {
  const all = await readMessages();
  await writeMessages(all.filter((m) => m.id !== id));
}

