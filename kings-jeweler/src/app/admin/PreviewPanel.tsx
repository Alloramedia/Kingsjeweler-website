"use client";

import { useEffect, useState } from "react";
import {
  X, RefreshCw, Monitor, Smartphone, ExternalLink, Eye, Columns2,
} from "lucide-react";
import { SEO_PAGES } from "@/lib/admin/types";

type Device = "desktop" | "mobile";
type Mode = "single" | "compare";

/** Friendly list of top-level pages the client can jump between. */
const PAGES: { label: string; path: string }[] = SEO_PAGES.map((p) => ({
  label: p.label,
  path: p.path,
}));

/** Published (live) version of a page — `?__pm=live` forces it past Draft Mode. */
function liveSrc(p: string): string {
  return `${p}${p.includes("?") ? "&" : "?"}__pm=live`;
}

/** Draft version — the preview route turns on Draft Mode, then shows the page. */
function draftSrc(p: string): string {
  return `/api/admin/preview?to=${encodeURIComponent(p)}`;
}

function tabClass(active: boolean): string {
  return `flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition ${
    active ? "bg-orange-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
  }`;
}

function Pane({
  label, tone, children,
}: {
  label: string; tone: "live" | "draft"; children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm lg:min-h-0">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
          tone === "draft" ? "bg-orange-50 text-orange-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${tone === "draft" ? "bg-orange-500" : "bg-slate-400"}`}
        />
        {label}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

/**
 * Full-screen, in-tool live preview. Shows the draft of any page without
 * leaving the editor, and a side-by-side "Compare" view (published vs. draft)
 * so the client can see exactly what their edits changed.
 */
export function PreviewPanel({
  path, compare, nonce, onClose,
}: {
  path: string;
  compare: boolean;
  /** Bumped by the editor after a save so the iframes reload with fresh content. */
  nonce: number;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>(compare ? "compare" : "single");
  const [device, setDevice] = useState<Device>("desktop");
  const [selPath, setSelPath] = useState(path);
  const [reload, setReload] = useState(0);

  // Follow the caller when it asks to preview a different page / mode.
  useEffect(() => { setSelPath(path); }, [path]);
  useEffect(() => { setMode(compare ? "compare" : "single"); }, [compare]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const known = PAGES.some((p) => p.path === selPath);
  const pages = known ? PAGES : [{ label: selPath, path: selPath }, ...PAGES];

  // Remount the iframes (forcing a reload) whenever any of these change.
  const stamp = `${selPath}-${device}-${nonce}-${reload}`;

  const frame = (src: string, title: string) => (
    <div className={`mx-auto h-full ${device === "mobile" ? "w-[390px] max-w-full" : "w-full"}`}>
      <iframe
        key={`${title}-${stamp}`}
        src={src}
        title={title}
        className="h-full w-full border-0 bg-white"
      />
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-200"
      role="dialog"
      aria-modal="true"
      aria-label="Live preview"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-300 bg-white px-3 py-2.5 sm:px-4">
        <span className="flex items-center gap-2 font-bold text-slate-900">
          <Eye size={18} className="text-orange-600" /> Live preview
        </span>

        <select
          value={selPath}
          onChange={(e) => setSelPath(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 outline-none focus:border-orange-500"
          aria-label="Page to preview"
        >
          {pages.map((p) => (
            <option key={p.path} value={p.path}>{p.label}</option>
          ))}
        </select>

        {/* Single vs. side-by-side */}
        <div className="flex overflow-hidden rounded-lg border border-slate-300">
          <button type="button" onClick={() => setMode("single")} className={tabClass(mode === "single")}>
            <Eye size={15} /> Preview
          </button>
          <button type="button" onClick={() => setMode("compare")} className={tabClass(mode === "compare")}>
            <Columns2 size={15} /> Compare
          </button>
        </div>

        {/* Device width */}
        <div className="flex overflow-hidden rounded-lg border border-slate-300">
          <button type="button" onClick={() => setDevice("desktop")} className={tabClass(device === "desktop")} aria-label="Desktop width" title="Desktop">
            <Monitor size={15} />
          </button>
          <button type="button" onClick={() => setDevice("mobile")} className={tabClass(device === "mobile")} aria-label="Phone width" title="Phone">
            <Smartphone size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setReload((n) => n + 1)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <RefreshCw size={15} /> Refresh
        </button>

        <a
          href={draftSrc(selPath)}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:flex"
        >
          <ExternalLink size={15} /> New tab
        </a>

        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <X size={16} /> Close
        </button>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
        {mode === "single" ? (
          <div className="h-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
            {frame(draftSrc(selPath), "Your draft")}
          </div>
        ) : (
          <div className="grid h-full gap-3 lg:grid-cols-2">
            <Pane label="Live — what visitors see now" tone="live">
              {frame(liveSrc(selPath), "Live site")}
            </Pane>
            <Pane label="Draft — your unpublished changes" tone="draft">
              {frame(draftSrc(selPath), "Your draft")}
            </Pane>
          </div>
        )}
      </div>
    </div>
  );
}
