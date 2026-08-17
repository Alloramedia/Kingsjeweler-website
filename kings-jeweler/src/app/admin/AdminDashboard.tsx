"use client";

import {
  useState, useCallback, useEffect, useMemo, useRef,
  createContext, useContext,
} from "react";
import {
  Phone, Share2, Clock, Megaphone, Gem, FileText,
  Plus, Trash2, Check, LogOut, ChevronLeft, ChevronRight, Loader2, ExternalLink,
  History, RotateCcw, AlertTriangle, Copy, Images,
  Inbox, Search, Bell, GripVertical, Mail, Phone as PhoneIcon,
  Quote, HelpCircle, Download, MapPin, Palette,
  Eye, Columns2, ChevronDown, Home,
  Receipt, FileDown, DollarSign,
} from "lucide-react";
import type {
  SiteContent, HoursRow, MenuSection, HeroOverride, SocialLinks, BrandImages, BrandColors,
  Announcement, Seo, ContactMessage, Testimonial, Faqs, FaqItem, MessageStatus,
} from "@/lib/admin/types";
import { SEO_PAGES, seoDefaults, FAQ_PAGES, defaultBrandColors } from "@/lib/admin/types";
import type { BlogPost } from "@/lib/content";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ImagePicker } from "./ImagePicker";
import { PreviewPanel } from "./PreviewPanel";

/** Format a dollar amount as USD, e.g. 1234.5 → "$1,234.50". */
function money(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ── Toast (friendly confirmation) ─────────────────────────────── */

type Toast = { id: number; kind: "success" | "error"; text: string };
const ToastCtx = createContext<(t: Omit<Toast, "id">) => void>(() => {});
const useToast = () => useContext(ToastCtx);

/** Lets any editor flag that an unpublished draft now exists after a save. */
const PublishCtx = createContext<() => void>(() => {});
const useMarkDraft = () => useContext(PublishCtx);

/** Opens the in-tool live preview and refreshes it after a save. */
type PreviewRequest = { path: string; compare?: boolean };
const PreviewCtx = createContext<{
  open: (req: PreviewRequest) => void;
  refresh: () => void;
}>({ open: () => {}, refresh: () => {} });
const usePreview = () => useContext(PreviewCtx);

/** Prefill for the quote builder, e.g. started from an inbox message. */
type QuotePrefill = {
  client?: {
    name?: string; email?: string; phone?: string;
    itemType?: string; dueDate?: string;
  };
};
const QuoteCtx = createContext<(prefill?: QuotePrefill) => void>(() => {});
const useStartQuote = () => useContext(QuoteCtx);

function ToastHost({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((cur) => [...cur, { ...t, id }]);
    setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-60 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg ${
              t.kind === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {t.kind === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ── tiny UI building blocks ───────────────────────────────────── */

function Counter({ value, max }: { value: string; max?: number }) {
  if (!max) return null;
  const over = value.length > max;
  return (
    <span className={`text-[11px] ${over ? "font-semibold text-red-600" : "text-slate-400"}`}>
      {value.length}/{max}
    </span>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", max, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; max?: number; hint?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-slate-700">{label}</span>
        <Counter value={value} max={max} />
      </span>
      {hint && <span className="mt-0.5 block text-[11px] text-slate-400">{hint}</span>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      />
    </label>
  );
}

function Area({
  label, value, onChange, placeholder, rows = 3, hint, max,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; hint?: string; max?: number;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-slate-700">{label}</span>
        <Counter value={value} max={max} />
      </span>
      {hint && <span className="mt-0.5 block text-[11px] text-slate-400">{hint}</span>}
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      />
    </label>
  );
}

type Status = "idle" | "saving" | "saved" | "error";

/**
 * Per-section editor state with built-in safety: tracks unsaved changes,
 * autosaves a draft to the browser so nothing is lost, and warns before
 * leaving with unsaved work.
 */
function useEditor<T>(section: string, initial: T) {
  const storageKey = `pm-admin-draft:${section}`;
  const [data, setDataRaw] = useState<T>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [draftAvailable, setDraftAvailable] = useState(false);
  // Snapshot of what's currently saved, in state so `dirty` recomputes after a save.
  const [savedSnapshot, setSavedSnapshot] = useState<string>(() => JSON.stringify(initial));
  const toast = useToast();
  const markDraft = useMarkDraft();
  const preview = usePreview();

  // Offer to restore an autosaved draft from a previous visit.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw && raw !== savedSnapshot) setDraftAvailable(true);
    } catch { /* ignore */ }
    // Only checked on mount for this section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const dirty = useMemo(
    () => JSON.stringify(data) !== savedSnapshot,
    [data, savedSnapshot],
  );

  const setData = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setDataRaw((prev) => {
        const next =
          typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
        try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    },
    [storageKey],
  );

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const save = useCallback(
    async (payload?: unknown, nextData?: T) => {
      setStatus("saving");
      try {
        const res = await fetch("/api/admin/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, value: payload ?? data }),
        });
        if (!res.ok) throw new Error();
        setSavedSnapshot(JSON.stringify(nextData ?? data));
        try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
        setStatus("saved");
        setDraftAvailable(false);
        markDraft();
        preview.refresh();
        toast({ kind: "success", text: "Saved to your preview. Publish when you're ready to go live." });
        setTimeout(() => setStatus("idle"), 3000);
      } catch {
        setStatus("error");
        toast({ kind: "error", text: "Couldn't save — please try again." });
      }
    },
    [section, data, storageKey, toast, markDraft, preview],
  );

  const restoreDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDataRaw(JSON.parse(raw) as T);
    } catch { /* ignore */ }
    setDraftAvailable(false);
  }, [storageKey]);

  const discardDraft = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    setDraftAvailable(false);
  }, [storageKey]);

  return { data, setData, status, dirty, save, draftAvailable, restoreDraft, discardDraft };
}

function DraftBanner({
  available, onRestore, onDiscard,
}: { available: boolean; onRestore: () => void; onDiscard: () => void }) {
  if (!available) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm">
      <span className="font-semibold text-amber-800">
        You have unsaved edits from last time.
      </span>
      <button onClick={onRestore} className="rounded-lg bg-amber-600 px-3 py-1.5 font-semibold text-white hover:bg-amber-700">
        Restore them
      </button>
      <button onClick={onDiscard} className="font-semibold text-amber-700 underline">
        Discard
      </button>
    </div>
  );
}

function SaveBar({
  status, dirty, onSave,
}: { status: Status; dirty: boolean; onSave: () => void; viewUrl?: string }) {
  // Nothing to save and nothing in flight — stay out of the way.
  if (!dirty && status === "idle") return null;
  const saved = status === "saved";
  return (
    <div className="pointer-events-none sticky bottom-4 z-30 mt-6 flex justify-end">
      <div
        className={`pointer-events-auto flex items-center gap-2 rounded-full border bg-white/95 py-1.5 pl-4 pr-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur ${
          saved ? "border-green-200" : "border-slate-200"
        }`}
      >
        {saved ? (
          <span className="flex items-center gap-1.5 px-2 py-1 text-sm font-semibold text-green-600">
            <Check size={16} /> Saved
          </span>
        ) : (
          <>
            {dirty && <span className="pl-1 text-sm font-medium text-amber-600">Unsaved changes</span>}
            <button
              onClick={onSave}
              disabled={status === "saving"}
              className="flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
            >
              {status === "saving" ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const toLines = (arr: string[]) => arr.join("\n");
const fromLines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

/* ── Drag-to-reorder list ──────────────────────────────────────── */

/**
 * Renders a vertical, reorderable list. Each row gets a drag handle that the
 * client can grab to drag, or focus and nudge with the arrow keys.
 */
function ReorderList<T>({
  items, onReorder, getKey, children, gap = "gap-3",
}: {
  items: T[];
  onReorder: (next: T[]) => void;
  getKey: (item: T, i: number) => string | number;
  children: (item: T, i: number, handle: React.ReactNode) => React.ReactNode;
  gap?: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [over, setOver] = useState<number | null>(null);
  const fromRef = useRef<number | null>(null);

  const move = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || to >= items.length) return;
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onReorder(next);
  };

  return (
    <div className={`flex flex-col ${gap}`}>
      {items.map((item, i) => {
        const handle = (
          <button
            type="button"
            onPointerDown={() => setEnabled(true)}
            onPointerUp={() => setEnabled(false)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") { e.preventDefault(); move(i, i - 1); }
              if (e.key === "ArrowDown") { e.preventDefault(); move(i, i + 1); }
            }}
            className="shrink-0 cursor-grab touch-none rounded-lg p-2 text-slate-300 hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
            aria-label="Drag to reorder, or press the up and down arrow keys"
            title="Drag to reorder"
          >
            <GripVertical size={18} />
          </button>
        );
        return (
          <div
            key={getKey(item, i)}
            draggable={enabled}
            onDragStart={(e) => { fromRef.current = i; e.dataTransfer.effectAllowed = "move"; }}
            onDragEnter={() => setOver(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (fromRef.current !== null) move(fromRef.current, i); fromRef.current = null; setOver(null); setEnabled(false); }}
            onDragEnd={() => { fromRef.current = null; setOver(null); setEnabled(false); }}
            className={`rounded-2xl ${over === i ? "ring-2 ring-orange-300" : ""}`}
          >
            {children(item, i, handle)}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A single list item that starts collapsed, showing only a summary header so
 * editors don't have to scroll past every item's settings. Click the header
 * (or press Enter/Space) to reveal the full fields. The drag handle and delete
 * button stay visible while collapsed.
 */
function Collapsible({
  handle, title, meta, onRemove, removeLabel = "Remove", defaultOpen = false, tone = "item", action, children,
}: {
  handle?: React.ReactNode;
  title: string;
  meta?: string;
  onRemove?: () => void;
  removeLabel?: string;
  defaultOpen?: boolean;
  tone?: "item" | "section";
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const section = tone === "section";
  return (
    <div className={`border border-slate-200 ${section ? "rounded-xl bg-white" : "rounded-lg bg-slate-50"}`}>
      <div className="flex items-center gap-1">
        {handle}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-left hover:bg-slate-100 ${section ? "py-2.5" : "py-2"}`}
        >
          <ChevronDown size={section ? 16 : 14} className={`shrink-0 text-slate-400 transition-transform ${open ? "" : "-rotate-90"}`} />
          <span className={`truncate ${section ? "text-[15px] font-bold text-slate-900" : "text-sm font-semibold text-slate-700"}`}>{title}</span>
          {meta && <span className="shrink-0 text-[13px] text-slate-400">{meta}</span>}
        </button>
        {action && <div className="shrink-0">{action}</div>}
        {onRemove && (
          <button onClick={onRemove} className="mr-1 shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={removeLabel}>
            <Trash2 size={15} />
          </button>
        )}
      </div>
      {open && <div className="border-t border-slate-200/70 px-3 pb-2.5 pt-2.5">{children}</div>}
    </div>
  );
}

/* ── Section editors ───────────────────────────────────────────── */

function ContactEditor({ data }: { data: SiteContent["contact"] }) {
  const { data: d, setData: setD, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor("contact", data);
  return (
    <div className="space-y-5">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <Field label="Phone number" value={d.phone} onChange={(v) => setD({ ...d, phone: v })} placeholder="(203) 555-0199" max={40} />
      <Field label="Email address" type="email" value={d.email} onChange={(v) => setD({ ...d, email: v })} placeholder="info@kingsjewelerct.com" max={120} />
      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/contact" />
    </div>
  );
}

function SocialsEditor({ data }: { data: SocialLinks }) {
  const { data: d, setData: setD, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor("socials", data);
  const rows: { key: keyof SocialLinks; label: string }[] = [
    { key: "gmb", label: "Google Business Profile" },
    { key: "instagram", label: "Instagram" },
    { key: "facebook", label: "Facebook" },
    { key: "tiktok", label: "TikTok" },
  ];
  return (
    <div className="space-y-5">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">Paste the full web address of each page (starts with https://). Leave blank to hide one.</p>
      {rows.map((r) => (
        <Field key={r.key} label={r.label} value={d[r.key]} onChange={(v) => setD({ ...d, [r.key]: v })} placeholder={`https://${r.key}.com/kingsjeweler`} max={300} />
      ))}
      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/" />
    </div>
  );
}

function HoursEditor({ data }: { data: HoursRow[] }) {
  const { data: rows, setData: setRows, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<HoursRow[]>("hours", data);
  const update = (i: number, patch: Partial<HoursRow>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-4">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      {rows.map((r, i) => (
        <div key={i} className="flex items-end gap-3 rounded-xl border border-slate-200 p-3">
          <div className="flex-1"><Field label="Day(s)" value={r.day} onChange={(v) => update(i, { day: v })} placeholder="Monday – Friday" /></div>
          <div className="flex-1"><Field label="Hours" value={r.hours} onChange={(v) => update(i, { hours: v })} placeholder="9 AM – 7 PM" /></div>
          <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="mb-1 rounded-lg p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove row">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button onClick={() => setRows([...rows, { day: "", hours: "" }])} className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600">
        <Plus size={18} /> Add a row
      </button>
      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/" />
    </div>
  );
}

function HeroEditor({ data }: { data: HeroOverride }) {
  const { data: d, setData: setD, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<HeroOverride>("hero", data);
  return (
    <div className="space-y-5">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">This is the big headline and intro line on the home page.</p>
      <Field label="Headline" value={d.title ?? ""} onChange={(v) => setD({ ...d, title: v })} placeholder="Manchester's Family Jeweler" max={160} hint="Tip: press Enter inside this won't work — keep it to one line." />
      <Area label="Intro line" value={d.subtitle ?? ""} onChange={(v) => setD({ ...d, subtitle: v })} rows={3} placeholder="Fine jewelry & expert repairs…" max={400} />
      <SaveBar status={status} dirty={dirty} onSave={() => save({ home: d })} viewUrl="/" />
    </div>
  );
}

function MenuEditor({ data }: { data: MenuSection[] }) {
  const { data: sections, setData: setSections, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<MenuSection[]>("menu", data);
  const [editing, setEditing] = useState<number | null>(null);
  const updateSection = (si: number, patch: Partial<MenuSection>) =>
    setSections(sections.map((s, i) => (i === si ? { ...s, ...patch } : s)));
  const updateItem = (si: number, ii: number, patch: Partial<MenuSection["items"][number]>) =>
    setSections(sections.map((s, i) =>
      i === si ? { ...s, items: s.items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) } : s,
    ));

  /* ── detail view: edit a single package ── */
  if (editing !== null && sections[editing]) {
    const si = editing;
    const sec = sections[si];
    return (
      <div className="space-y-5">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ChevronLeft size={18} /> Back to all packages
        </button>
        <div className="space-y-3">
          <Field label="Package / section name" value={sec.title} onChange={(v) => updateSection(si, { title: v })} max={120} />
          <Field label="Category" hint="Groups services on the page, e.g. Jewelry Services, Watch Services, Buying & Appraisals." value={sec.group ?? ""} onChange={(v) => updateSection(si, { group: v })} placeholder="Jewelry Services" max={120} />
          <Area label="Short description" value={sec.blurb} onChange={(v) => updateSection(si, { blurb: v })} rows={2} max={400} />
        </div>
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Menu items</h3>
            <span className="text-xs text-slate-400">{sec.items.length} item{sec.items.length === 1 ? "" : "s"}</span>
          </div>
          <ReorderList items={sec.items} onReorder={(next) => updateSection(si, { items: next })} getKey={(_, j) => j}>
            {(it, ii, itemHandle) => (
              <Collapsible
                handle={itemHandle}
                title={it.name || "Untitled item"}
                meta={it.price || undefined}
                onRemove={() => updateSection(si, { items: sec.items.filter((_, j) => j !== ii) })}
                removeLabel="Remove item"
              >
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <div className="flex-1"><Field label="Item / category" value={it.name} onChange={(v) => updateItem(si, ii, { name: v })} max={160} /></div>
                    <div className="w-32"><Field label="Price" value={it.price ?? ""} onChange={(v) => updateItem(si, ii, { price: v })} placeholder="$14" max={60} /></div>
                  </div>
                  <Field label="Chooser badge" hint='Optional, e.g. "Choose two". Shown as a tag next to the name.' value={it.choose ?? ""} onChange={(v) => updateItem(si, ii, { choose: v })} placeholder="Choose two" max={60} />
                  <Area
                    label="Options (one per line)"
                    hint="Render as a bulleted list of what's included, below the description."
                    value={(it.options ?? []).join("\n")}
                    onChange={(v) => updateItem(si, ii, { options: v.split("\n").map((o) => o.trim()).filter(Boolean) })}
                    rows={3}
                    max={2000}
                  />
                  <Area label="Description" hint="Optional blurb shown above the options list." value={it.desc} onChange={(v) => updateItem(si, ii, { desc: v })} rows={2} max={400} />
                </div>
              </Collapsible>
            )}
          </ReorderList>
          <button onClick={() => updateSection(si, { items: [...sec.items, { name: "", desc: "", price: "" }] })} className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
            <Plus size={16} /> Add item
          </button>
        </div>
        <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/services" />
      </div>
    );
  }

  /* ── list view: services grouped by category ── */
  const groupOrder: string[] = [];
  const groups = new Map<string, { sec: MenuSection; idx: number }[]>();
  sections.forEach((sec, idx) => {
    const g = sec.group?.trim() || "Other";
    if (!groups.has(g)) { groups.set(g, []); groupOrder.push(g); }
    groups.get(g)!.push({ sec, idx });
  });

  const reorderGroup = (group: string, nextMembers: MenuSection[]) => {
    const next: MenuSection[] = [];
    for (const g of groupOrder) {
      if (g === group) next.push(...nextMembers);
      else next.push(...groups.get(g)!.map((m) => m.sec));
    }
    setSections(next);
  };
  const duplicate = (idx: number) => {
    const orig = sections[idx];
    const copy: MenuSection = { ...orig, title: orig.title ? `${orig.title} (copy)` : "New section", items: orig.items.map((it) => ({ ...it })) };
    setSections([...sections.slice(0, idx + 1), copy, ...sections.slice(idx + 1)]);
    setEditing(idx + 1);
  };
  const remove = (idx: number) => {
    const sec = sections[idx];
    if (!confirm(`Delete "${sec.title || "this section"}"? You can undo this from History.`)) return;
    const next = sections.filter((_, i) => i !== idx);
    setSections(next); save(next, next);
  };

  return (
    <div className="space-y-6">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">Services are grouped by <strong>category</strong>. Click <em>Edit</em> to open a section&apos;s details, items and prices. Drag the <GripVertical size={14} className="inline align-text-bottom" /> handle to reorder sections within a group.</p>
      {groupOrder.map((group) => {
        const members = groups.get(group)!;
        return (
          <div key={group} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{group} <span className="text-slate-300">· {members.length}</span></h3>
            <ReorderList items={members.map((m) => m.sec)} onReorder={(next) => reorderGroup(group, next)} getKey={(_, i) => members[i]?.idx ?? i} gap="gap-2">
              {(sec, i, handle) => {
                const idx = members[i].idx;
                const itemCount = sec.items.length;
                const priced = sec.items.filter((it) => it.price).length;
                return (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div className="flex min-w-0 items-center gap-2">
                      {handle}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{sec.title || "(untitled)"}</p>
                        <p className="text-sm text-slate-500">{[`${itemCount} item${itemCount === 1 ? "" : "s"}`, priced > 0 ? `${priced} priced` : null].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditing(idx)} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Edit</button>
                      <button onClick={() => duplicate(idx)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Duplicate" title="Make a copy"><Copy size={18} /></button>
                      <button onClick={() => remove(idx)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 size={18} /></button>
                    </div>
                  </div>
                );
              }}
            </ReorderList>
          </div>
        );
      })}
      <button onClick={() => { setSections([...sections, { title: "New section", group: "", blurb: "", items: [] }]); setEditing(sections.length); }} className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600">
        <Plus size={18} /> Add a service section
      </button>
      {(dirty || status !== "idle") && <div className="pt-2"><SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/services" /></div>}
    </div>
  );
}

const emptyPost = (): BlogPost => ({
  slug: "", title: "", excerpt: "", category: "Stories", image: "/images/jewelry/kings-02.webp",
  author: "King's Jeweler", date: new Date().toISOString().slice(0, 10), readTime: "4 min read", body: [],
});

function BlogEditor({ data }: { data: BlogPost[] }) {
  const { data: list, setData: setList, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<BlogPost[]>("blog", data);
  const [editing, setEditing] = useState<number | null>(null);

  if (editing !== null) {
    const p = list[editing];
    const set = (patch: Partial<BlogPost>) =>
      setList(list.map((x, i) => (i === editing ? { ...x, ...patch } : x)));
    return (
      <div className="space-y-5">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ChevronLeft size={18} /> Back to all posts
        </button>
        <Field label="Title" value={p.title} onChange={(v) => set({ title: v })} max={160} />
        <Field label="Web address (slug)" hint="Lowercase words with dashes — this becomes the page link." value={p.slug} onChange={(v) => set({ slug: v })} placeholder="my-post" max={120} />
        <Area label="Short summary" value={p.excerpt} onChange={(v) => set({ excerpt: v })} rows={2} max={400} />
        <ImagePicker label="Photo" value={p.image} onChange={(v) => set({ image: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" value={p.category} onChange={(v) => set({ category: v })} max={80} />
          <Field label="Author" value={p.author} onChange={(v) => set({ author: v })} max={120} />
          <Field label="Read time" value={p.readTime} onChange={(v) => set({ readTime: v })} placeholder="4 min read" max={40} />
          <Field label="Date" type="date" value={p.date} onChange={(v) => set({ date: v })} />
        </div>
        <Area
          label="Article body"
          hint="Write normally. Leave a blank line between paragraphs. Start a line with # to make it a heading."
          value={p.body.map((b) => [b.heading ? `# ${b.heading}` : null, ...b.paragraphs].filter(Boolean).join("\n\n")).join("\n\n")}
          onChange={(v) => {
            const blocks = v.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
            set({
              body: blocks.map((block) => {
                if (block.startsWith("#")) {
                  const [first, ...rest] = block.split("\n");
                  return { heading: first.replace(/^#\s*/, "").trim(), paragraphs: rest.map((r) => r.trim()).filter(Boolean) };
                }
                return { paragraphs: [block] };
              }),
            });
          }}
          rows={12}
        />
        <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl={p.slug ? `/blog/${p.slug}` : "/blog"} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <ReorderList items={list} onReorder={setList} getKey={(_, i) => i} gap="gap-2">
        {(p, i, handle) => (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div className="flex min-w-0 items-center gap-2">
              {handle}
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{p.title || "(untitled)"}</p>
                <p className="text-sm text-slate-500">{p.category} · {p.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing(i)} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Edit</button>
              <button
                onClick={() => {
                  const copy = { ...p, slug: p.slug ? `${p.slug}-copy` : "", title: p.title ? `${p.title} (copy)` : "" };
                  const next = [...list.slice(0, i + 1), copy, ...list.slice(i + 1)];
                  setList(next);
                  setEditing(i + 1);
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Duplicate"
                title="Make a copy"
              >
                <Copy size={18} />
              </button>
              <button onClick={() => { if (confirm(`Delete "${p.title}"? You can undo this from History.`)) { const next = list.filter((_, idx) => idx !== i); setList(next); save(next, next); } }} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </ReorderList>
      <button onClick={() => { setList([...list, emptyPost()]); setEditing(list.length); }} className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600">
        <Plus size={18} /> Add a post
      </button>
      {(dirty || status !== "idle") && <div className="pt-2"><SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/blog" /></div>}
    </div>
  );
}

/* ── Site Photos (brand imagery) ───────────────────────────────── */

const SINGLE_PHOTOS: { key: keyof BrandImages; label: string; where: string }[] = [
  { key: "logo", label: "Site logo", where: "Header (top of every page) and the footer" },
  { key: "heroHome", label: "Home page — big background photo", where: "Top of the home page" },
  { key: "menuFeature", label: "Menu page — top photo", where: "Top of the Menu page" },
  { key: "aboutFeature", label: "About page — top photo", where: "Top of the About page" },
  { key: "owner", label: "About page — owner portrait", where: "Owner photo on the About page" },
  { key: "heroCatering", label: "Catering — top photo", where: "Catering page banner" },
  { key: "heroEvents", label: "Contact — top photo", where: "Contact page banner" },
];

function PhotoList({
  title, hint, items, onChange, alt, onAlt,
}: {
  title: string; hint: string; items: string[]; onChange: (next: string[]) => void;
  alt?: Record<string, string>; onAlt?: (url: string, text: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="font-bold text-slate-900">{title}</p>
      <p className="mb-3 text-sm text-slate-500">{hint}</p>
      <ReorderList items={items} onReorder={onChange} getKey={(_, i) => i}>
        {(url, i, handle) => (
          <div className="flex items-start gap-2">
            <div className="mt-3">{handle}</div>
            <div className="flex-1 space-y-2">
              <ImagePicker label={`Photo ${i + 1}`} value={url} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
              {onAlt && url && (
                <Field
                  label="Describe this photo"
                  hint="A short description for visually-impaired visitors and Google — e.g. “Diamond engagement ring on a velvet display.”"
                  value={alt?.[url] ?? ""}
                  onChange={(v) => onAlt(url, v)}
                  max={160}
                />
              )}
            </div>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="mt-3 rounded-lg p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove photo">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </ReorderList>
      <button onClick={() => onChange([...items, ""])} className="mt-3 flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600">
        <Plus size={18} /> Add a photo
      </button>
    </div>
  );
}

function PhotosEditor({ data }: { data: BrandImages }) {
  const { data: d, setData: setD, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<BrandImages>("images", data);
  return (
    <div className="space-y-6">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">Swap the main photos shown across your website. Upload your own or pick from the library.</p>

      <div className="space-y-4">
        {SINGLE_PHOTOS.map((p) => (
          <div key={p.key} className="rounded-2xl border border-slate-200 p-4">
            <ImagePicker label={p.label} value={d[p.key] as string} onChange={(v) => setD({ ...d, [p.key]: v })} />
            <p className="mt-2 text-xs text-slate-400">{p.where}</p>
          </div>
        ))}
      </div>

      <PhotoList
        title="Rotating background photos"
        hint="These fade in and out behind the headline on several pages."
        items={d.heroSlides}
        onChange={(next) => setD({ ...d, heroSlides: next })}
      />

      <PhotoList
        title="Home & catering cards"
        hint="The photos on the service cards (Parties, Holiday Packs, Meal Prep, and more)."
        items={d.cards}
        onChange={(next) => setD({ ...d, cards: next })}
      />

      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/" />
    </div>
  );
}

/* ── Brand colors ──────────────────────────────────────────────── */

function ColorField({
  label, hint, value, onChange,
}: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
}) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
      <input
        type="color"
        value={safe}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5"
        aria-label={`${label} color picker`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{label}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono uppercase text-slate-700"
        maxLength={9}
        aria-label={`${label} hex code`}
      />
    </div>
  );
}

function ColorsEditor({ data }: { data: BrandColors }) {
  const { data: d, setData: setD, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<BrandColors>("colors", data);
  const set = (k: keyof BrandColors, v: string) => setD({ ...d, [k]: v });
  return (
    <div className="space-y-5">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">Change your brand colors across the whole website. Buttons, banners, headings and links update everywhere. A few soft glow effects keep their original tint.</p>
      <div className="space-y-3">
        <ColorField label="Primary" hint="Buttons, links & accents" value={d.primary} onChange={(v) => set("primary", v)} />
        <ColorField label="Primary — hover" hint="Darker shade when hovering buttons" value={d.primaryHover} onChange={(v) => set("primaryHover", v)} />
        <ColorField label="Primary — light" hint="Accent text on dark sections" value={d.primaryLight} onChange={(v) => set("primaryLight", v)} />
        <ColorField label="Secondary" hint="Teal accent" value={d.secondary} onChange={(v) => set("secondary", v)} />
        <ColorField label="Dark" hint="Body text & dark banners" value={d.dark} onChange={(v) => set("dark", v)} />
        <ColorField label="Background" hint="Main page background (cream)" value={d.cream} onChange={(v) => set("cream", v)} />
        <ColorField label="Card background" hint="Cards & panels" value={d.card} onChange={(v) => set("card", v)} />
        <ColorField label="Sand" hint="Soft alternating sections" value={d.sand} onChange={(v) => set("sand", v)} />
      </div>
      <button
        type="button"
        onClick={() => setD({ ...defaultBrandColors })}
        className="text-sm font-semibold text-slate-500 underline-offset-2 hover:text-orange-600 hover:underline"
      >
        Reset to original colors
      </button>
      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/" />
    </div>
  );
}

/* ── Announcement / holiday banner ─────────────────────────────── */

function AnnouncementEditor({ data }: { data: Announcement }) {
  const { data: d, setData: setD, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<Announcement>("announcement", data);
  return (
    <div className="space-y-5">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">Show a colored bar across the top of every page — perfect for holiday hours, a closure, or a special offer.</p>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
        <button
          type="button"
          role="switch"
          aria-checked={d.enabled}
          onClick={() => setD({ ...d, enabled: !d.enabled })}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${d.enabled ? "bg-green-600" : "bg-slate-300"}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${d.enabled ? "left-6" : "left-1"}`} />
        </button>
        <span>
          <span className="block font-semibold text-slate-900">{d.enabled ? "Banner is ON — showing on the site" : "Banner is OFF — hidden"}</span>
          <span className="block text-sm text-slate-500">Tap to show or hide the banner.</span>
        </span>
      </div>
      <Area
        label="Banner message"
        value={d.message}
        onChange={(v) => setD({ ...d, message: v })}
        rows={2}
        max={280}
        placeholder="Closed Dec 24–26 for the holidays — back open the 27th!"
        hint="Keep it short — it shows on one line at the very top."
      />
      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700">Show it only during these dates (optional)</p>
        <p className="mb-3 text-xs text-slate-400">Leave blank to show right away and/or with no end date. Outside this window the banner stays hidden even when it&apos;s switched on.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Start date" type="date" value={d.startDate} onChange={(v) => setD({ ...d, startDate: v })} />
          <Field label="End date" type="date" value={d.endDate} onChange={(v) => setD({ ...d, endDate: v })} />
        </div>
        {d.startDate && d.endDate && d.endDate < d.startDate && (
          <p className="mt-2 text-xs font-semibold text-red-600">The end date is before the start date — the banner won&apos;t show.</p>
        )}
      </div>
      {d.enabled && d.message.trim() && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Preview</p>
          <div className="rounded-xl bg-[#C68A17] px-4 py-2.5 text-center text-sm font-semibold text-[#14141A]">{d.message}</div>
        </div>
      )}
      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/" />
    </div>
  );
}

/* ── Search-engine (SEO) text ──────────────────────────────────── */

function SeoEditor({ data }: { data: Seo }) {
  const { data: d, setData: setD, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<Seo>("seo", data);
  return (
    <div className="space-y-6">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">This is the title and summary Google shows for each page. Leave a box blank to keep the current wording (shown in grey).</p>
      {SEO_PAGES.map((p) => {
        const def = seoDefaults[p.key];
        const entry = d[p.key];
        return (
          <div key={p.key} className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">{p.label}</p>
              <a href={p.path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-orange-600">
                <ExternalLink size={13} /> View
              </a>
            </div>
            <Field label="Page title" value={entry.title} onChange={(v) => setD({ ...d, [p.key]: { ...entry, title: v } })} placeholder={def.title} max={70} hint="Around 50–60 characters works best." />
            <Area label="Page summary" value={entry.description} onChange={(v) => setD({ ...d, [p.key]: { ...entry, description: v } })} rows={2} placeholder={def.description} max={200} hint="Around 150 characters works best." />
          </div>
        );
      })}
      <SaveBar status={status} dirty={dirty} onSave={() => save()} />
    </div>
  );
}

/* ── Reviews / testimonials ────────────────────────────────────── */

function TestimonialsEditor({ data }: { data: Testimonial[] }) {
  const { data: list, setData: setList, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<Testimonial[]>("testimonials", data);
  const update = (i: number, patch: Partial<Testimonial>) =>
    setList(list.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const remove = (i: number) => setList(list.filter((_, idx) => idx !== i));
  const add = () => setList([...list, { author: "", role: "", body: "" }]);
  return (
    <div className="space-y-4">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">The guest reviews shown on your home page. Drag the <GripVertical size={13} className="inline" /> handle to reorder.</p>
      <ReorderList items={list} onReorder={setList} getKey={(_, i) => i} gap="gap-4">
        {(t, i, handle) => (
          <Collapsible
            handle={handle}
            title={t.author || "New review"}
            meta={t.role || undefined}
            onRemove={() => remove(i)}
            removeLabel="Remove review"
          >
            <div className="space-y-3">
              <Field label="Reviewer name" value={t.author} onChange={(v) => update(i, { author: v })} placeholder="Marisa T." max={80} />
              <Field label="Event & town" value={t.role} onChange={(v) => update(i, { role: v })} placeholder="Backyard birthday · West Hartford" max={120} />
              <Area label="Review" value={t.body} onChange={(v) => update(i, { body: v })} rows={3} max={600} placeholder="They resized my ring while I waited…" />
            </div>
          </Collapsible>
        )}
      </ReorderList>
      <button onClick={add} className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600">
        <Plus size={18} /> Add a review
      </button>
      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/" />
    </div>
  );
}

/* ── FAQs ──────────────────────────────────────────────────────── */

function FaqEditor({ data }: { data: Faqs }) {
  const { data: d, setData: setD, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<Faqs>("faqs", data);
  const setPage = (key: keyof Faqs, next: FaqItem[]) => setD({ ...d, [key]: next });
  return (
    <div className="space-y-6">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">The questions &amp; answers shown on each page. Drag the <GripVertical size={13} className="inline" /> handle to reorder.</p>
      {FAQ_PAGES.map((p) => {
        const list = d[p.key];
        const update = (i: number, patch: Partial<FaqItem>) =>
          setPage(p.key, list.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
        return (
          <Collapsible
            key={p.key}
            tone="section"
            title={p.label}
            meta={`${list.length} ${list.length === 1 ? "question" : "questions"}`}
            action={
              <a href={p.path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 text-xs font-semibold text-slate-500 hover:text-orange-600">
                <ExternalLink size={13} /> View
              </a>
            }
          >
            <div className="space-y-3">
              <ReorderList items={list} onReorder={(next) => setPage(p.key, next)} getKey={(_, i) => i} gap="gap-3">
                {(f, i, handle) => (
                  <Collapsible
                    handle={handle}
                    title={f.question || "New question"}
                    onRemove={() => setPage(p.key, list.filter((_, idx) => idx !== i))}
                    removeLabel="Remove question"
                  >
                    <div className="space-y-2">
                      <Field label="Question" value={f.question} onChange={(v) => update(i, { question: v })} placeholder="How far in advance should I book?" max={200} />
                      <Area label="Answer" value={f.answer} onChange={(v) => update(i, { answer: v })} rows={3} max={1000} placeholder="We recommend reaching out 3–4 weeks ahead…" />
                    </div>
                  </Collapsible>
                )}
              </ReorderList>
              <button onClick={() => setPage(p.key, [...list, { question: "", answer: "" }])} className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600">
                <Plus size={16} /> Add a question
              </button>
            </div>
          </Collapsible>
        );
      })}
      <SaveBar status={status} dirty={dirty} onSave={() => save()} />
    </div>
  );
}

/* ── Service area (towns) ──────────────────────────────────────── */

function ServiceAreaEditor({ data }: { data: string[] }) {
  const { data: list, setData, status, dirty, save, draftAvailable, restoreDraft, discardDraft } = useEditor<string[]>("serviceTowns", data);
  return (
    <div className="space-y-4">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">The Connecticut towns shown in your &ldquo;service area&rdquo; lists across the site. One town per line.</p>
      <Area label="Towns you serve" value={toLines(list)} onChange={(v) => setData(fromLines(v))} rows={14} hint="One town per line." />
      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/about" />
    </div>
  );
}

/* ── Gallery ───────────────────────────────────────────────────── */

function GalleryEditor({ data, alt }: { data: string[]; alt: Record<string, string> }) {
  const { data: state, setData, status, dirty, save, draftAvailable, restoreDraft, discardDraft } =
    useEditor<{ images: string[]; alt: Record<string, string> }>("gallery", { images: data, alt });
  return (
    <div className="space-y-4">
      <DraftBanner available={draftAvailable} onRestore={restoreDraft} onDiscard={discardDraft} />
      <p className="text-sm text-slate-500">Pick and order the photos on your Gallery page, and add a short description of each one. Leave this empty to automatically show every food photo.</p>
      <PhotoList
        title="Gallery photos"
        hint="Drag to reorder — the first photos load first. Add a photo to upload your own."
        items={state.images}
        onChange={(next) => setData({ ...state, images: next })}
        alt={state.alt}
        onAlt={(url, text) => setData({ ...state, alt: { ...state.alt, [url]: text } })}
      />
      <SaveBar status={status} dirty={dirty} onSave={() => save()} viewUrl="/gallery" />
    </div>
  );
}

/* ── Messages inbox (contact-form submissions) ─────────────────── */

const STATUS_META: Record<MessageStatus, { label: string; cls: string; ring: string }> = {
  new: { label: "New", cls: "bg-orange-100 text-orange-700", ring: "ring-orange-300" },
  quoted: { label: "Quoted", cls: "bg-blue-100 text-blue-700", ring: "ring-blue-300" },
  booked: { label: "Booked", cls: "bg-green-100 text-green-700", ring: "ring-green-300" },
  archived: { label: "Archived", cls: "bg-slate-200 text-slate-600", ring: "ring-slate-400" },
};

function MessagesPanel({ onBack, onChanged }: { onBack: () => void; onChanged?: () => void }) {
  const [items, setItems] = useState<ContactMessage[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | MessageStatus>("all");
  const toast = useToast();
  const startQuote = useStartQuote();

  const load = useCallback(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => setItems(d.messages ?? []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function act(
    id: string,
    action: "read" | "unread" | "delete" | "status",
    status?: MessageStatus,
  ) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, status }),
      });
      if (!res.ok) throw new Error();
      // Optimistically update locally so the UI feels instant.
      setItems((cur) =>
        cur
          ? action === "delete"
            ? cur.filter((m) => m.id !== id)
            : cur.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      ...(action === "status"
                        ? { status: status! }
                        : { read: action === "read" }),
                    }
                  : m,
              )
          : cur,
      );
      onChanged?.();
    } catch {
      toast({ kind: "error", text: "Something went wrong — please try again." });
      load();
    } finally {
      setBusy(false);
    }
  }

  function open(m: ContactMessage) {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    if (next && !m.read) act(m.id, "read");
  }

  const shown = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    return items.filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (!q) return true;
      return [m.name, m.email, m.phone, m.service, m.business, m.message]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, filter]);

  function exportCsv() {
    const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["Date", "Name", "Email", "Phone", "Service", "Status", "Event/company", "Message"];
    const rows = shown.map((m) =>
      [
        new Date(m.ts).toLocaleString(),
        m.name,
        m.email,
        m.phone,
        m.service,
        STATUS_META[m.status].label,
        m.business,
        m.message,
      ]
        .map(esc)
        .join(","),
    );
    const csv = [header.map(esc).join(","), ...rows].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `kings-jeweler-messages-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filters: { key: "all" | MessageStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "quoted", label: "Quoted" },
    { key: "booked", label: "Booked" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ChevronLeft size={18} /> Back to home
      </button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Messages</h2>
          <p className="text-sm text-slate-500">Everyone who fills out your contact form shows up here.</p>
        </div>
        {items && items.length > 0 && (
          <button onClick={exportCsv} className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
            <Download size={16} /> Export to spreadsheet
          </button>
        )}
      </div>
      {items && items.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, message…"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const count = f.key === "all" ? items.length : items.filter((m) => m.status === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${filter === f.key ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {f.label} <span className={filter === f.key ? "text-white/80" : "text-slate-400"}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {items === null ? (
        <div className="flex items-center justify-center py-12 text-slate-400"><Loader2 size={24} className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No messages yet. New contact-form submissions will appear here.</p>
      ) : shown.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No messages match your search.</p>
      ) : (
        <ul className="space-y-2">
          {shown.map((m) => {
            const isOpen = openId === m.id;
            const sm = STATUS_META[m.status];
            return (
              <li key={m.id} className={`rounded-xl border ${m.read ? "border-slate-200" : "border-orange-300 bg-orange-50/40"}`}>
                <button onClick={() => open(m)} className="flex w-full items-center gap-3 p-4 text-left">
                  {!m.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" aria-label="Unread" />}
                  <div className="min-w-0 flex-1">
                    <p className={`truncate ${m.read ? "font-semibold text-slate-800" : "font-bold text-slate-900"}`}>{m.name || "(no name)"}</p>
                    <p className="truncate text-sm text-slate-500">{m.service || "Inquiry"}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${sm.cls}`}>{sm.label}</span>
                  <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{new Date(m.ts).toLocaleDateString()}</span>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-slate-200 px-4 py-4 text-sm">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 font-semibold text-orange-600 hover:underline"><Mail size={15} /> {m.email}</a>
                      {m.phone && <a href={`tel:${m.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 font-semibold text-orange-600 hover:underline"><PhoneIcon size={15} /> {m.phone}</a>}
                    </div>
                    <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                      {m.business && (<div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Event / company</dt><dd className="text-slate-800">{m.business}</dd></div>)}
                      {m.details.map((row, i) => (
                        <div key={i}><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{row.label}</dt><dd className="text-slate-800">{row.value}</dd></div>
                      ))}
                    </dl>
                    {m.message && (
                      <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Message</dt><dd className="mt-0.5 whitespace-pre-wrap text-slate-800">{m.message}</dd></div>
                    )}
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Lead status</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(["new", "quoted", "booked", "archived"] as MessageStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => act(m.id, "status", s)}
                            disabled={busy}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${m.status === s ? STATUS_META[s].cls + " ring-2 ring-offset-1 " + STATUS_META[s].ring : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                          >
                            {STATUS_META[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Received {new Date(m.ts).toLocaleString()}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: Your King's Jeweler inquiry")}`} className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">Reply by email</a>
                      <button
                        onClick={() => {
                          const detail = (label: string) => m.details.find((d) => d.label === label)?.value ?? "";
                          startQuote({
                            client: {
                              name: m.name, email: m.email, phone: m.phone,
                              itemType: detail("Occasion") || m.service,
                            },
                          });
                          if (m.status === "new") act(m.id, "status", "quoted");
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        <Receipt size={15} /> Make a quote
                      </button>
                      <button onClick={() => act(m.id, m.read ? "unread" : "read")} disabled={busy} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60">{m.read ? "Mark unread" : "Mark read"}</button>
                      <button onClick={() => { if (confirm("Delete this message? This can't be undone.")) act(m.id, "delete"); }} disabled={busy} className="ml-auto flex items-center gap-1.5 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-60" aria-label="Delete message"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ── History (undo) panel ──────────────────────────────────────── */

type HistoryItem = { id: string; ts: number; label: string };

/** Turn a stored history label into the headline shown in the list. */
function historyLabel(label: string): string {
  if (label.startsWith("Undo:")) return label;
  if (label === "Published changes") return "Published changes";
  return `Changed: ${label}`;
}

function HistoryPanel({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const toast = useToast();

  const load = useCallback(() => {
    fetch("/api/admin/history")
      .then((r) => r.json())
      .then((d) => setItems(d.history ?? []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function restore(id: string, label: string) {
    if (!confirm(`Undo the change to "${label}"? This puts that section back the way it was.`)) return;
    setRestoring(id);
    try {
      const res = await fetch("/api/admin/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast({ kind: "success", text: "Restored! Refreshing…" });
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast({ kind: "error", text: "Couldn't restore — please try again." });
      setRestoring(null);
    }
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ChevronLeft size={18} /> Back to home
      </button>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Recent changes</h2>
        <p className="text-sm text-slate-500">Made a mistake? Put any section back the way it was with one click.</p>
      </div>
      {items === null ? (
        <div className="flex items-center justify-center py-12 text-slate-400"><Loader2 size={24} className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No changes yet. Once you start editing, your history shows up here.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((h) => (
            <li key={h.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-slate-900">{historyLabel(h.label)}</p>
                <p className="text-sm text-slate-500">{new Date(h.ts).toLocaleString()}</p>
              </div>
              <button
                onClick={() => restore(h.id, h.label)}
                disabled={restoring !== null}
                className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
              >
                {restoring === h.id ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                Undo
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Number input that keeps a tidy local string while editing. */
function NumInput({
  value, onChange, className, placeholder,
}: { value: number; onChange: (n: number) => void; className?: string; placeholder?: string }) {
  const [text, setText] = useState(value ? String(value) : "");
  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        const t = e.target.value.replace(/[^0-9.]/g, "");
        setText(t);
        onChange(t === "" ? 0 : parseFloat(t) || 0);
      }}
      className={className}
    />
  );
}

/* ── Quotes tool (branded PDF) ──────────────────────────────────── */

type QuoteLine = { label: string; detail: string; qty: number; unitPrice: number };

function QuotesPanel({
  onBack, content, prefill,
}: { onBack: () => void; content: SiteContent; prefill: QuotePrefill | null }) {
  const toast = useToast();
  const [client, setClient] = useState({
    name: prefill?.client?.name ?? "",
    email: prefill?.client?.email ?? "",
    phone: prefill?.client?.phone ?? "",
    itemType: prefill?.client?.itemType ?? "",
    dueDate: prefill?.client?.dueDate ?? "",
  });
  const [lines, setLines] = useState<QuoteLine[]>([
    { label: "", detail: "", qty: 0, unitPrice: 0 },
  ]);
  const [taxPct, setTaxPct] = useState(0);
  const [depositPct, setDepositPct] = useState(50);
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const subtotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const tax = (subtotal * taxPct) / 100;
  const total = subtotal + tax;
  const deposit = (total * depositPct) / 100;

  function setLine(i: number, p: Partial<QuoteLine>) {
    setLines((cur) => cur.map((l, idx) => (idx === i ? { ...l, ...p } : l)));
  }
  function addLine() { setLines((cur) => [...cur, { label: "", detail: "", qty: 0, unitPrice: 0 }]); }

  /** Add a service as a charged line, carrying its item names as the detail. */
  function addService(sec: MenuSection) {
    const names = sec.items.map((it) => it.name).filter(Boolean).join(", ");
    const line: QuoteLine = { label: sec.title || "Service", detail: names, qty: 1, unitPrice: 0 };
    setLines((cur) => {
      const blank = cur.findIndex((l) => !l.label && !l.qty && !l.unitPrice);
      if (blank >= 0) return cur.map((l, i) => (i === blank ? line : l));
      return [...cur, line];
    });
  }

  async function download() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client,
          lines: lines.filter((l) => l.label || l.qty || l.unitPrice),
          taxPct, depositPct, validUntil, notes,
        }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kings-jeweler-quote-${(client.name || "client").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ kind: "success", text: "Quote PDF downloaded." });
    } catch {
      toast({ kind: "error", text: "Couldn't build the PDF — please try again." });
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ChevronLeft size={18} /> Back to home
      </button>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Branded quote</h2>
        <p className="text-sm text-slate-500">Build a repair, custom design, or appraisal quote and download a polished, on-brand PDF to send the client.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          {/* client */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-700">Prepared for</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} placeholder="Client name" className={inputCls} />
              <input value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} placeholder="Email" className={inputCls} />
              <input value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} placeholder="Phone" className={inputCls} />
              <input value={client.itemType} onChange={(e) => setClient({ ...client, itemType: e.target.value })} placeholder="Item (e.g. Ring, Watch, Chain)" className={inputCls} />
              <input value={client.dueDate} onChange={(e) => setClient({ ...client, dueDate: e.target.value })} placeholder="Pickup / completion date" className="sm:col-span-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" />
            </div>
          </div>

          {/* add from services */}
          {content.menu.length > 0 && (
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-1 text-sm font-bold text-slate-700">Add from your services</h3>
              <p className="mb-3 text-xs text-slate-500">Drop a service in as a line item, then fill in the price.</p>
              <ul className="space-y-2">
                {content.menu.map((sec, i) => {
                  const names = sec.items.map((it) => it.name).filter(Boolean).join(" · ");
                  return (
                    <li key={i} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-800">{sec.title || "Untitled service"}</span>
                        {sec.group && <span className="text-xs text-slate-400">{sec.group}</span>}
                        <button onClick={() => addService(sec)} className="ml-auto flex items-center gap-1 rounded-lg bg-orange-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"><Plus size={13} /> Add</button>
                      </div>
                      {names && <p className="mt-1.5 text-xs text-slate-500">{names}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* line items */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-700">Line items</h3>
              <span className="text-xs text-slate-400">What the client is charged</span>
            </div>
            <ul className="space-y-3">
              {lines.map((l, i) => (
                <li key={i} className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <input value={l.label} onChange={(e) => setLine(i, { label: e.target.value })} placeholder="Item / service" className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-orange-500" />
                    <button onClick={() => setLines((cur) => cur.filter((_, idx) => idx !== i))} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove line"><Trash2 size={15} /></button>
                  </div>
                  <input value={l.detail} onChange={(e) => setLine(i, { detail: e.target.value })} placeholder="Description (optional)" className="mt-2 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 outline-none focus:border-orange-500" />
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <label className="text-xs text-slate-500">Qty
                      <NumInput value={l.qty} onChange={(n) => setLine(i, { qty: n })} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-orange-500" placeholder="0" />
                    </label>
                    <label className="text-xs text-slate-500">Unit price
                      <NumInput value={l.unitPrice} onChange={(n) => setLine(i, { unitPrice: n })} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-orange-500" placeholder="0.00" />
                    </label>
                    <label className="text-xs text-slate-500">Amount
                      <div className="mt-1 rounded-lg bg-slate-100 px-2 py-1.5 text-sm font-semibold text-slate-700">{money(l.qty * l.unitPrice)}</div>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={addLine} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"><Plus size={15} /> Add line item</button>
          </div>

          {/* terms */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-700">Terms</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-xs font-semibold text-slate-600">Tax %
                <NumInput value={taxPct} onChange={setTaxPct} className={`mt-1 ${inputCls}`} placeholder="0" />
              </label>
              <label className="text-xs font-semibold text-slate-600">Deposit %
                <NumInput value={depositPct} onChange={setDepositPct} className={`mt-1 ${inputCls}`} placeholder="50" />
              </label>
              <label className="text-xs font-semibold text-slate-600">Valid until
                <input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} placeholder="e.g. Aug 1" className={`mt-1 ${inputCls}`} />
              </label>
            </div>
            <label className="mt-3 block text-xs font-semibold text-slate-600">Notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Anything the client should know…" className={`mt-1 ${inputCls}`} />
            </label>
          </div>
        </div>

        {/* totals + download */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900"><DollarSign size={18} className="text-orange-600" /> Quote total</h3>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-semibold text-slate-800">{money(subtotal)}</dd></div>
              {taxPct > 0 && <div className="flex justify-between"><dt className="text-slate-500">Tax ({taxPct}%)</dt><dd className="font-semibold text-slate-800">{money(tax)}</dd></div>}
              <div className="flex justify-between border-t border-slate-200 pt-1.5"><dt className="font-bold text-slate-900">Total</dt><dd className="text-lg font-bold text-orange-600">{money(total)}</dd></div>
              {depositPct > 0 && <div className="flex justify-between"><dt className="text-slate-500">Deposit ({depositPct}%)</dt><dd className="font-semibold text-slate-800">{money(deposit)}</dd></div>}
            </dl>
            <button onClick={download} disabled={busy} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />} Download quote PDF
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">Branded with your site colors &amp; contact details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shell ─────────────────────────────────────────────────────── */

const SECTIONS = [
  { key: "contact", label: "Contact Info", desc: "Phone & email", icon: Phone, path: "/contact" },
  { key: "socials", label: "Social Links", desc: "Facebook, Instagram & more", icon: Share2, path: "/" },
  { key: "hours", label: "Hours", desc: "When you're open", icon: Clock, path: "/" },
  { key: "announcement", label: "Announcement", desc: "Holiday hours & alert banner", icon: Bell, path: "/" },
  { key: "hero", label: "Home Headline", desc: "Big text on the home page", icon: Megaphone, path: "/" },
  { key: "menu", label: "Services & Prices", desc: "Services, descriptions & prices", icon: Gem, path: "/services" },
  { key: "images", label: "Photos", desc: "Swap the main site photos", icon: Images, path: "/" },
  { key: "colors", label: "Colors", desc: "Brand colors across the site", icon: Palette, path: "/" },
  { key: "blog", label: "Blog Posts", desc: "Add, edit & remove posts", icon: FileText, path: "/blog" },
  { key: "testimonials", label: "Reviews", desc: "Guest reviews on the home page", icon: Quote, path: "/" },
  { key: "faqs", label: "FAQs", desc: "Common questions & answers", icon: HelpCircle, path: "/" },
  { key: "gallery", label: "Gallery", desc: "Photos on the gallery page", icon: Images, path: "/gallery" },
  { key: "serviceTowns", label: "Service Area", desc: "Towns you cover", icon: MapPin, path: "/about" },
  { key: "seo", label: "Search Engine", desc: "Page titles & Google summaries", icon: Search, path: "/" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];
type View = "home" | "history" | "messages" | "quotes" | SectionKey;

/** Sub-groups of website-content sections, shown under "Website Content". */
const CONTENT_GROUPS: { title: string; keys: SectionKey[] }[] = [
  { title: "Services", keys: ["menu"] },
  { title: "Home & Branding", keys: ["hero", "images", "colors", "announcement"] },
  { title: "Pages & Stories", keys: ["blog", "testimonials", "faqs", "gallery"] },
  { title: "Business Info", keys: ["contact", "socials", "hours", "serviceTowns"] },
  { title: "Search Engine", keys: ["seo"] },
];

/** A single dashboard tile — used for both tools and content sections. */
function DashCard({
  label, desc, icon: Icon, badge, onClick,
}: {
  label: string; desc: string; icon: LucideIcon; badge?: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
        <Icon size={20} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-slate-900">{label}</span>
        <span className="block text-[13px] text-slate-500">{desc}</span>
      </span>
      {badge ? (
        <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-[11px] font-bold text-white">{badge}</span>
      ) : null}
    </button>
  );
}

/** A titled dashboard zone with a divider header. */
function DashZone({
  title, desc, children,
}: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {desc && <p className="hidden text-[13px] text-slate-500 sm:block">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

/** Top-level "gate" topics shown first on the home screen. */
type CategoryKey = "customers" | "content";
const CATEGORIES: { key: CategoryKey; label: string; desc: string; icon: LucideIcon }[] = [
  { key: "customers", label: "Customers", desc: "Inbox messages & quotes", icon: Inbox },
  { key: "content", label: "Website Content", desc: "Services, pages, photos, branding & SEO", icon: FileText },
];

/** A large entry tile on the gate screen. */
function GateCard({
  label, desc, icon: Icon, badge, onClick,
}: {
  label: string; desc: string; icon: LucideIcon; badge?: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        <Icon size={24} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-slate-900">{label}</span>
        <span className="mt-0.5 block text-[13px] text-slate-500">{desc}</span>
      </span>
      {badge ? (
        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 px-1.5 text-xs font-bold text-white">{badge}</span>
      ) : (
        <ChevronRight size={18} className="shrink-0 text-slate-300 transition group-hover:text-orange-400" />
      )}
    </button>
  );
}

/* ── Publish bar (preview / publish / discard the draft) ───────── */

function PublishBar({
  onPublished, onDiscarded,
}: { onPublished: () => void; onDiscarded: () => void }) {
  const [busy, setBusy] = useState<null | "publish" | "discard">(null);
  const toast = useToast();
  const { open } = usePreview();

  async function publish() {
    setBusy("publish");
    try {
      const res = await fetch("/api/admin/publish", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json().catch(() => ({}));
      const sync = data?.repoSync as { ok?: boolean; skipped?: boolean } | undefined;
      if (sync?.ok && !sync.skipped) {
        toast({ kind: "success", text: "You're live! Your changes are on the website and backed up to GitHub." });
      } else if (sync && sync.ok === false) {
        toast({ kind: "success", text: "You're live! Your changes are on the website. (The Git backup didn't run this time — the site is still fully updated.)" });
      } else {
        toast({ kind: "success", text: "You're live! Your changes are now on the website." });
      }
      onPublished();
    } catch {
      toast({ kind: "error", text: "Couldn't publish — please try again." });
    } finally {
      setBusy(null);
    }
  }

  async function discard() {
    if (!confirm("Discard your unpublished changes? Everything goes back to what's currently live on the site.")) return;
    setBusy("discard");
    try {
      const res = await fetch("/api/admin/discard", { method: "POST" });
      if (!res.ok) throw new Error();
      toast({ kind: "success", text: "Draft changes discarded." });
      onDiscarded();
    } catch {
      toast({ kind: "error", text: "Couldn't discard — please try again." });
      setBusy(null);
    }
  }

  return (
    <div className="sticky top-0 z-40 border-b border-amber-300 bg-amber-50">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <span className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          <AlertTriangle size={16} />
          You have changes that aren&apos;t live yet.
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => open({ path: "/", compare: true })}
            className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
          >
            <Columns2 size={16} /> Preview &amp; compare
          </button>
          <button
            onClick={discard}
            disabled={busy !== null}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-amber-800 underline hover:text-amber-900 disabled:opacity-60"
          >
            {busy === "discard" ? "Discarding…" : "Discard"}
          </button>
          <button
            onClick={publish}
            disabled={busy !== null}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {busy === "publish" ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {busy === "publish" ? "Publishing…" : "Publish — make it live"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminInner({
  initialContent, unpublished: initialUnpublished,
}: { initialContent: SiteContent; unpublished: boolean }) {
  const [view, setView] = useState<View>("home");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [unread, setUnread] = useState(0);
  const [unpublished, setUnpublished] = useState(initialUnpublished);
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);
  const markDraft = useCallback(() => setUnpublished(true), []);
  // Return to the top-level gate (clears the active topic).
  const goHome = useCallback(() => { setView("home"); setCategory(null); }, []);

  const startQuote = useCallback((prefill?: QuotePrefill) => {
    setQuotePrefill(prefill ?? null);
    setCategory("customers");
    setView("quotes");
  }, []);

  // In-tool live preview overlay.
  const [preview, setPreview] = useState<{ open: boolean; path: string; compare: boolean }>({
    open: false, path: "/", compare: false,
  });
  const [previewNonce, setPreviewNonce] = useState(0);
  const previewApi = useMemo(
    () => ({
      open: (req: PreviewRequest) =>
        setPreview({ open: true, path: req.path || "/", compare: !!req.compare }),
      refresh: () => setPreviewNonce((n) => n + 1),
    }),
    [],
  );

  const loadUnread = useCallback(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => setUnread((d.messages ?? []).filter((m: ContactMessage) => !m.read).length))
      .catch(() => {});
  }, []);

  useEffect(() => { loadUnread(); }, [loadUnread]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const current = SECTIONS.find((s) => s.key === view);

  return (
    <PublishCtx.Provider value={markDraft}>
    <PreviewCtx.Provider value={previewApi}>
    <QuoteCtx.Provider value={startQuote}>
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <button onClick={goHome} className="min-w-0 text-left">
            <h1 className="truncate text-base font-bold text-slate-900">King's Jeweler — Site Editor</h1>
            <p className="hidden text-[11px] text-slate-500 sm:block">Edits save as a draft — preview, then publish to go live.</p>
          </button>
          <div className="flex items-center gap-0.5">
            <Link href="/" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              <Home size={15} /> <span className="hidden sm:inline">Back to site</span>
            </Link>
            <button onClick={() => { setCategory("customers"); setView("messages"); }} className="relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              <Inbox size={15} /> <span className="hidden sm:inline">Messages</span>
              {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">{unread}</span>}
            </button>
            <button onClick={() => { setCategory(null); setView("history"); }} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              <History size={15} /> <span className="hidden sm:inline">History</span>
            </button>
            <button onClick={logout} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              <LogOut size={15} /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {unpublished && (
        <PublishBar
          onPublished={() => setUnpublished(false)}
          onDiscarded={() => window.location.reload()}
        />
      )}

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        {view === "home" && category === null && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">What would you like to work on?</h2>
              <p className="text-sm text-slate-500">Pick an area to get started.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <GateCard
                  key={c.key}
                  label={c.label}
                  desc={c.desc}
                  icon={c.icon}
                  badge={c.key === "customers" ? (unread || undefined) : undefined}
                  onClick={() => setCategory(c.key)}
                />
              ))}
            </div>
          </div>
        )}

        {view === "home" && category !== null && (
          <div className="space-y-5">
            <button onClick={() => setCategory(null)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
              <ChevronLeft size={16} /> Main menu
            </button>

            {category === "customers" && (
              <DashZone title="Customers" desc="Your inbox & catering quotes">
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  <DashCard
                    label="Messages"
                    desc={unread > 0 ? `${unread} new message${unread > 1 ? "s" : ""}` : "Contact-form inbox"}
                    icon={Inbox}
                    badge={unread || undefined}
                    onClick={() => setView("messages")}
                  />
                  <DashCard label="Quotes" desc="Build a branded PDF quote" icon={Receipt} onClick={() => setView("quotes")} />
                </div>
              </DashZone>
            )}

            {category === "content" && (
              <div className="space-y-5">
                {CONTENT_GROUPS.map((group) => (
                  <div key={group.title}>
                    <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{group.title}</h4>
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {group.keys.map((key) => {
                        const s = SECTIONS.find((x) => x.key === key);
                        if (!s) return null;
                        return <DashCard key={s.key} label={s.label} desc={s.desc} icon={s.icon} onClick={() => setView(s.key)} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "messages" && (
          <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <MessagesPanel onBack={() => setView("home")} onChanged={loadUnread} />
          </section>
        )}

        {view === "history" && (
          <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <HistoryPanel onBack={() => setView("home")} />
          </section>
        )}

        {view === "quotes" && (
          <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <QuotesPanel onBack={() => setView("home")} content={initialContent} prefill={quotePrefill} />
          </section>
        )}

        {current && (
          <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button onClick={() => setView("home")} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
                <ChevronLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => previewApi.open({ path: current.path })}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:border-orange-300 hover:text-orange-600"
              >
                <Eye size={15} /> Live preview
              </button>
            </div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <current.icon size={18} />
              </span>
              <h2 className="text-base font-bold text-slate-900">{current.label}</h2>
            </div>
            {view === "contact" && <ContactEditor data={initialContent.contact} />}
            {view === "socials" && <SocialsEditor data={initialContent.socials} />}
            {view === "hours" && <HoursEditor data={initialContent.hours} />}
            {view === "announcement" && <AnnouncementEditor data={initialContent.announcement} />}
            {view === "hero" && <HeroEditor data={initialContent.hero.home} />}
            {view === "menu" && <MenuEditor data={initialContent.menu} />}
            {view === "images" && <PhotosEditor data={initialContent.brandImages} />}
            {view === "colors" && <ColorsEditor data={initialContent.colors} />}
            {view === "blog" && <BlogEditor data={initialContent.blog} />}
            {view === "testimonials" && <TestimonialsEditor data={initialContent.testimonials} />}
            {view === "faqs" && <FaqEditor data={initialContent.faqs} />}
            {view === "gallery" && <GalleryEditor data={initialContent.gallery} alt={initialContent.imageAlt} />}
            {view === "serviceTowns" && <ServiceAreaEditor data={initialContent.serviceTowns} />}
            {view === "seo" && <SeoEditor data={initialContent.seo} />}
          </section>
        )}
      </div>
    </div>

    {preview.open && (
      <PreviewPanel
        path={preview.path}
        compare={preview.compare}
        nonce={previewNonce}
        onClose={() => setPreview((p) => ({ ...p, open: false }))}
      />
    )}
    </QuoteCtx.Provider>
    </PreviewCtx.Provider>
    </PublishCtx.Provider>
  );
}

export function AdminDashboard({
  initialContent, unpublished,
}: { initialContent: SiteContent; unpublished: boolean }) {
  return (
    <ToastHost>
      <AdminInner initialContent={initialContent} unpublished={unpublished} />
    </ToastHost>
  );
}
