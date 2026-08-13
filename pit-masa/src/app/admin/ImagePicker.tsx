"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, ImageIcon, Loader2, X, Check } from "lucide-react";

type Photos = { uploaded: string[]; library: string[] };

/**
 * A friendly photo chooser: shows the current photo, lets the client upload a
 * new one from their phone/computer, or pick one from the existing library.
 */
export function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload failed.");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-1.5 flex items-center gap-4 rounded-xl border border-slate-300 p-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <ImageIcon size={28} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading…" : "Upload a photo"}
          </button>
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            <ImageIcon size={16} /> Choose existing
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>}

      {picking && (
        <PhotoLibrary
          selected={value}
          onClose={() => setPicking(false)}
          onPick={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

function PhotoLibrary({
  selected,
  onPick,
  onClose,
}: {
  selected: string;
  onPick: (url: string) => void;
  onClose: () => void;
}) {
  const [photos, setPhotos] = useState<Photos | null>(null);

  useEffect(() => {
    fetch("/api/admin/photos")
      .then((r) => r.json())
      .then((d) => setPhotos({ uploaded: d.uploaded ?? [], library: d.library ?? [] }))
      .catch(() => setPhotos({ uploaded: [], library: [] }));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">Choose a photo</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          {!photos ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            <>
              {photos.uploaded.length > 0 && (
                <Group title="Your uploads" items={photos.uploaded} selected={selected} onPick={onPick} />
              )}
              <Group title="Photo library" items={photos.library} selected={selected} onPick={onPick} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Group({
  title,
  items,
  selected,
  onPick,
}: {
  title: string;
  items: string[];
  selected: string;
  onPick: (url: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-semibold text-slate-500">{title}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => onPick(url)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
              selected === url ? "border-orange-500" : "border-transparent hover:border-slate-300"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
            {selected === url && (
              <span className="absolute right-1 top-1 rounded-full bg-orange-500 p-1 text-white">
                <Check size={12} />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
