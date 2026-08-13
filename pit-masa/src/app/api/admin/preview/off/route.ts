import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

/** Only allow redirects to internal, same-site paths. */
function safePath(to: string | null): string {
  if (!to || !to.startsWith("/") || to.startsWith("//")) return "/";
  return to;
}

/** Turn off preview mode and return to the published site. */
export async function GET(request: NextRequest) {
  const dest = safePath(request.nextUrl.searchParams.get("to"));
  (await draftMode()).disable();
  redirect(dest);
}
