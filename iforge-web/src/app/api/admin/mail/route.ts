import { isAuthenticated } from "@/lib/auth";
import {
  getMailSettings,
  saveMailSettings,
  toPublic,
  MAX_RECIPIENTS,
  type MailSettings,
} from "@/lib/settings";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HOST = /^[a-z0-9.-]+$/i;
const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bad = (error: string) => Response.json({ ok: false, error }, { status: 400 });

// Admin: save the outgoing mail server and the team addresses that receive
// every enquiry. An empty password keeps the one already saved.
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const b = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return bad("Invalid request.");

  const host = s(b.host, 253);
  if (host && !HOST.test(host)) return bad("The server should look like smtp.example.com.");
  const port = Number(b.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return bad("Port must be a number, usually 465 or 587.");
  const fromEmail = s(b.fromEmail, 254);
  if (fromEmail && !EMAIL.test(fromEmail)) return bad("The From address isn't a valid email.");

  const raw = Array.isArray(b.recipients) ? b.recipients : [];
  const recipients = [...new Set(raw.map((r) => s(r, 254).toLowerCase()).filter(Boolean))];
  const invalid = recipients.find((r) => !EMAIL.test(r));
  if (invalid) return bad(`"${invalid}" isn't a valid email.`);
  if (recipients.length > MAX_RECIPIENTS) return bad(`Add at most ${MAX_RECIPIENTS} addresses.`);

  try {
    const current = await getMailSettings();
    const pass = typeof b.pass === "string" && b.pass ? b.pass.slice(0, 500) : current.pass;
    const next: MailSettings = {
      host,
      port,
      secure: b.secure === true,
      user: s(b.user, 254),
      pass,
      fromName: s(b.fromName, 100).replace(/[\r\n]+/g, " "),
      fromEmail,
      recipients,
      confirmToCustomer: b.confirmToCustomer === true,
    };
    await saveMailSettings(next);
    return Response.json({ ok: true, settings: toPublic(next) });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Save failed" }, { status: 500 });
  }
}
