import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "iforge_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  // Sign sessions with the admin password itself (plus a salt) so rotating the
  // password invalidates old sessions. Falls back to a constant in dev.
  return (process.env.ADMIN_PASSWORD || "iforge-dev") + "::session-salt";
}

/** Constant-time compare of two strings. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** The signed value stored in the cookie. */
function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

/** True if the given password matches ADMIN_PASSWORD. */
export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

/** Whether admin auth can work at all (password configured). */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/**
 * Set the admin session cookie after a successful login. `secure` follows the
 * request's protocol: browsers drop Secure cookies on plain-http sites (e.g.
 * http://<server-ip>:3000), which would make every login bounce back.
 */
export async function createSession(request: Request): Promise<void> {
  const token = sign("admin");
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
    new URL(request.url).protocol.replace(":", "");
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Clear the admin session. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** True if the current request carries a valid admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, sign("admin"));
}
