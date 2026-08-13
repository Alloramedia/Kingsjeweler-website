import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { clearDraft } from "@/lib/admin/store";

/** Throw away unpublished draft changes; the live site is unaffected. */
export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  await clearDraft();
  return NextResponse.json({ ok: true });
}
