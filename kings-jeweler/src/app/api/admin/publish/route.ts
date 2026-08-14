import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/admin/auth";
import {
  readRawOverrides,
  readRawDraft,
  writeRawOverrides,
  clearDraft,
  appendHistory,
  summarizeOverrideChanges,
} from "@/lib/admin/store";
import { syncOverridesToRepo } from "@/lib/admin/repo-sync";

/** Report whether there are unpublished draft changes. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const draft = await readRawDraft();
  return NextResponse.json({ hasDraft: draft !== null });
}

/** Publish the draft: make the working copy the live site. */
export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const draft = await readRawDraft();
  if (!draft) {
    return NextResponse.json({ ok: true, published: false });
  }

  // Snapshot the currently-live version first so a publish can be undone.
  const current = await readRawOverrides();
  await appendHistory(summarizeOverrideChanges(current, draft), current);
  await writeRawOverrides(draft);
  await clearDraft();
  // Regenerate every route that uses the root layout so edits go live.
  revalidatePath("/", "layout");

  // Mirror the now-live content into the Git repo as a versioned backup.
  // Never blocks or fails the publish — the live update already happened.
  const repoSync = await syncOverridesToRepo(draft);
  if (!repoSync.ok) {
    console.error("[admin] Repo content backup failed:", repoSync.error);
  }

  return NextResponse.json({ ok: true, published: true, repoSync });
}
