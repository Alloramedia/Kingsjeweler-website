import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/admin/auth";
import {
  readHistory,
  readRawOverrides,
  writeRawOverrides,
  appendHistory,
} from "@/lib/admin/store";

/** List recent versions so the client can undo a change. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const history = await readHistory();
  // Don't ship the full snapshot data to the browser — just what's shown.
  return NextResponse.json({
    history: history.map((h) => ({ id: h.id, ts: h.ts, label: h.label })),
  });
}

/** Restore a previous version by id. */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let id: string;
  try {
    const body = await request.json();
    id = String(body?.id ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const history = await readHistory();
  const entry = history.find((h) => h.id === id);
  if (!entry) {
    return NextResponse.json({ error: "That version is no longer available." }, { status: 404 });
  }

  // Snapshot the current state first so the undo itself can be undone.
  const current = await readRawOverrides();
  await appendHistory(`Undo: ${entry.label}`, current);
  await writeRawOverrides(entry.data);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
