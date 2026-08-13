import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";

/** Only allow redirects to internal, same-site paths. */
function safePath(to: string | null): string {
  if (!to || !to.startsWith("/") || to.startsWith("//")) return "/";
  return to;
}

/** Turn on preview mode, then send the client to the page they want to see. */
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const dest = safePath(request.nextUrl.searchParams.get("to"));
  (await draftMode()).enable();
  redirect(dest);
}
