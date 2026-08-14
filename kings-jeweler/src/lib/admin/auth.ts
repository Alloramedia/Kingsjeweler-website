import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Minimal single-password auth for the site admin.
 *
 * - The password is set via the `ADMIN_PASSWORD` environment variable
 *   (Netlify → Site settings → Environment variables). It is never stored
 *   in the repo or sent to the browser.
 * - On success a signed, httpOnly session cookie is issued. The signature
 *   uses `ADMIN_SECRET` (falls back to `ADMIN_PASSWORD`) so the cookie can't
 *   be forged.
 */

export const ADMIN_COOKIE = "pm_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function signingSecret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", signingSecret()).update(payload).digest("hex");
}

/** Constant-time compare of the submitted password against the env value. */
export function isPasswordValid(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Build a signed session token: `v1.<expiry>.<hmac>`. */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function isTokenValid(token: string | undefined | null): boolean {
  if (!token || !signingSecret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [version, expiry, signature] = parts;
  const payload = `${version}.${expiry}`;
  const expected = sign(payload);
  if (signature.length !== expected.length) return false;
  const ok = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!ok) return false;
  if (Number(expiry) < Date.now()) return false;
  return true;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

/** Server-side check used by admin pages and protected API routes. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isTokenValid(store.get(ADMIN_COOKIE)?.value);
}

/** True when no admin password has been configured yet. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
