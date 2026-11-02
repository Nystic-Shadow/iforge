import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import { readJson, writeJson } from "@/lib/local-store";

/**
 * Private settings edited from the admin panel. Stored in the `app_settings`
 * table, which has RLS on and no policies, so only the server (service-role
 * key) can read it — never the public site_content table. Falls back to
 * `.data/settings-mail.json` locally.
 */

export interface MailSettings {
  /** SMTP server, e.g. smtp.gmail.com */
  host: string;
  port: number;
  /** true = SSL/TLS from the start (port 465); false = STARTTLS (port 587). */
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  /** Up to 5 addresses that get a copy of every new enquiry. */
  recipients: string[];
  /** Send the enquirer an automatic "we got it" email. */
  confirmToCustomer: boolean;
}

/** What the admin UI may see — the password never leaves the server. */
export type PublicMailSettings = Omit<MailSettings, "pass"> & { hasPassword: boolean };

export const MAX_RECIPIENTS = 5;

const TABLE = "app_settings";
const ID = "mail";
const FILE = "settings-mail";

const EMPTY: MailSettings = {
  host: "",
  port: 465,
  secure: true,
  user: "",
  pass: "",
  fromName: "",
  fromEmail: "",
  recipients: [],
  confirmToCustomer: true,
};

function friendly(message: string): string {
  return /app_settings/.test(message)
    ? "The app_settings table is missing — run the latest supabase/schema.sql in Supabase."
    : message;
}

export async function getMailSettings(): Promise<MailSettings> {
  const db = getSupabaseAdmin();
  if (!db) return { ...EMPTY, ...(await readJson<Partial<MailSettings>>(FILE, {})) };
  const { data, error } = await db.from(TABLE).select("data").eq("id", ID).maybeSingle();
  if (error) throw new Error(friendly(error.message));
  return { ...EMPTY, ...((data?.data as Partial<MailSettings>) ?? {}) };
}

export async function saveMailSettings(settings: MailSettings): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return writeJson(FILE, settings);
  const { error } = await db
    .from(TABLE)
    .upsert({ id: ID, data: settings, updated_at: new Date().toISOString() });
  if (error) throw new Error(friendly(error.message));
}

export const isMailReady = (s: MailSettings) => Boolean(s.host && s.port && s.user && s.pass && s.fromEmail);

export function toPublic({ pass, ...rest }: MailSettings): PublicMailSettings {
  return { ...rest, hasPassword: Boolean(pass) };
}
