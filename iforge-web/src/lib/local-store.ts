import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Tiny JSON file store used when Supabase isn't configured, so the admin
 * panel, inbox and team editor work during local development. Files live in
 * `.data/` (gitignored). Most hosts have a read-only or throwaway disk, so
 * production should use Supabase — see ADMIN.md.
 */

const SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

export const DATA_DIR =
  process.env.DATA_DIR ||
  (SERVERLESS ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data"));

/**
 * True on serverless hosts with no DATA_DIR: `/tmp` there is per-instance and
 * wiped on every cold start or deploy, so anything written is soon lost and
 * other instances never see it. Saves that must last are refused instead.
 */
export const isEphemeralStorage = SERVERLESS && !process.env.DATA_DIR;

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${name}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Write via a temp file + rename so a crash never leaves half-written JSON. */
export async function writeJson(name: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, `${name}.json`);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, file);
}

// Writes to the same file are serialised so two requests can't interleave a
// read-modify-write and lose an update.
const queues = new Map<string, Promise<unknown>>();

export function withLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const prev = queues.get(name) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  queues.set(
    name,
    next.catch(() => {}),
  );
  return next;
}
