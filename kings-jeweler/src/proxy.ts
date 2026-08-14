import { NextRequest, NextResponse } from "next/server";

/**
 * Lets the in-tool admin "Compare" preview render the PUBLISHED version of a
 * page even when the admin's browser has Draft Mode enabled.
 *
 * The admin tool loads the live page in an iframe with `?__pm=live`. This
 * forwards an `x-pm-view: live` header that the server reads (see
 * `isPreviewMode` in `lib/admin/schema.ts`) to force published content for
 * that one request, so the draft and live versions can sit side by side.
 *
 * Only the *published* (already-public) view is forced this way — the draft
 * stays behind the existing auth-gated Draft Mode cookie, so nothing private
 * is exposed.
 */
export function proxy(req: NextRequest) {
  if (req.nextUrl.searchParams.get("__pm") === "live") {
    const headers = new Headers(req.headers);
    headers.set("x-pm-view", "live");
    return NextResponse.next({ request: { headers } });
  }
  return NextResponse.next();
}

export const config = {
  // Run on page requests only — skip API routes, Next internals and static files.
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
