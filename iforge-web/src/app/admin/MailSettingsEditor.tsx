"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { PublicMailSettings } from "@/lib/settings";
import { PageHeader } from "./shell";

const MAX_RECIPIENTS = 5;

const INPUT =
  "w-full rounded-lg border border-hairline bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#E61E32] focus:outline-none";
const LABEL = "mb-1.5 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground";
const CARD = "space-y-5 rounded-xl border border-hairline p-6";
const H2 = "text-base font-semibold tracking-tight text-foreground";

type Preset = { id: string; label: string; host: string; port: number; secure: boolean; note: string };

const PRESETS: Preset[] = [
  {
    id: "google",
    label: "Google Workspace / Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    note: "Use an App Password, not your normal password: Google Account → Security → 2-Step Verification → App passwords. Workspace admins may need to allow it.",
  },
  {
    id: "microsoft",
    label: "Microsoft 365 / Outlook",
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    note: "Your Microsoft 365 admin must turn on “Authenticated SMTP” for this mailbox.",
  },
  {
    id: "zoho",
    label: "Zoho Mail",
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    note: "Use smtp.zoho.com if your Zoho account isn't in the India region. With two-factor sign-in on, use an app-specific password.",
  },
  {
    id: "custom",
    label: "Other / custom domain",
    host: "",
    port: 465,
    secure: true,
    note: "Your mail host's help pages list the SMTP server, port and security, e.g. Hostinger uses smtp.hostinger.com, port 465, SSL/TLS.",
  },
];

const EMPTY: PublicMailSettings = {
  host: "",
  port: 465,
  secure: true,
  user: "",
  fromName: "",
  fromEmail: "",
  recipients: [],
  confirmToCustomer: true,
  hasPassword: false,
};

export default function MailSettingsEditor({
  initial,
  loadError,
}: {
  initial: PublicMailSettings | null;
  loadError: string;
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<PublicMailSettings>(initial ?? EMPTY);
  const [pass, setPass] = React.useState("");
  const [recipients, setRecipients] = React.useState<string[]>(
    initial?.recipients.length ? initial.recipients : [""],
  );
  const [preset, setPreset] = React.useState<string>(
    () => PRESETS.find((p) => p.host && p.host === initial?.host)?.id ?? "custom",
  );
  const [dirty, setDirty] = React.useState(false);
  const [busy, setBusy] = React.useState<"save" | "test" | null>(null);
  const [status, setStatus] = React.useState<{ kind: "ok" | "err"; msg: string } | null>(
    loadError ? { kind: "err", msg: loadError } : null,
  );

  const edit = (patch: Partial<PublicMailSettings>) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
    setStatus(null);
  };
  const editRecipients = (next: string[]) => {
    setRecipients(next);
    setDirty(true);
    setStatus(null);
  };
  const choosePreset = (p: Preset) => {
    setPreset(p.id);
    edit(p.id === "custom" ? {} : { host: p.host, port: p.port, secure: p.secure });
  };

  const ready = Boolean(form.host && form.port && form.user && (pass || form.hasPassword) && form.fromEmail);

  const save = async () => {
    setBusy("save");
    setStatus(null);
    try {
      const r = await fetch("/api/admin/mail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pass, recipients: recipients.filter((x) => x.trim()) }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        setStatus({ kind: "err", msg: data.error || "Couldn't save." });
        return;
      }
      setForm(data.settings);
      setRecipients(data.settings.recipients.length ? data.settings.recipients : [""]);
      setPass("");
      setDirty(false);
      setStatus({ kind: "ok", msg: "Saved." });
      router.refresh();
    } catch {
      setStatus({ kind: "err", msg: "Network error." });
    } finally {
      setBusy(null);
    }
  };

  const test = async () => {
    setBusy("test");
    setStatus(null);
    try {
      const r = await fetch("/api/admin/mail/test", { method: "POST" });
      const data = await r.json();
      setStatus(
        r.ok && data.ok
          ? { kind: "ok", msg: `Test email sent to ${data.to.join(", ")}. Check the inbox (and spam).` }
          : { kind: "err", msg: data.error || "Couldn't send." },
      );
    } catch {
      setStatus({ kind: "err", msg: "Network error." });
    } finally {
      setBusy(null);
    }
  };

  const activePreset = PRESETS.find((p) => p.id === preset) ?? PRESETS[3];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Email"
        description="The mailbox the website sends from. New enquiries are emailed to your team, the customer gets a confirmation, and replies from the inbox go out from here."
      />

      <div className="space-y-6">
        <section className={CARD}>
          <h2 className={H2}>Mail provider</h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => choosePreset(p)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  preset === p.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-hairline text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="rounded-lg bg-foreground/[0.04] p-3 text-xs leading-relaxed text-muted-foreground">
            {activePreset.note}
          </p>

          <div className="grid gap-4 sm:grid-cols-[1fr_7rem_10rem]">
            <label>
              <span className={LABEL}>SMTP server</span>
              <input
                className={INPUT}
                value={form.host}
                placeholder="smtp.example.com"
                onChange={(e) => edit({ host: e.target.value.trim() })}
              />
            </label>
            <label>
              <span className={LABEL}>Port</span>
              <input
                className={INPUT}
                inputMode="numeric"
                value={form.port || ""}
                onChange={(e) => edit({ port: Number(e.target.value.replace(/\D/g, "")) || 0 })}
              />
            </label>
            <label>
              <span className={LABEL}>Security</span>
              <select
                className={INPUT}
                value={form.secure ? "ssl" : "starttls"}
                onChange={(e) => edit({ secure: e.target.value === "ssl" })}
              >
                <option value="ssl">SSL/TLS (465)</option>
                <option value="starttls">STARTTLS (587)</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={LABEL}>Username</span>
              <input
                className={INPUT}
                value={form.user}
                autoComplete="off"
                placeholder="you@yourdomain.com"
                onChange={(e) => edit({ user: e.target.value.trim() })}
              />
            </label>
            <label>
              <span className={LABEL}>Password / app password</span>
              <input
                className={INPUT}
                type="password"
                value={pass}
                autoComplete="new-password"
                placeholder={form.hasPassword ? "Saved — leave blank to keep" : "Mailbox or app password"}
                onChange={(e) => {
                  setPass(e.target.value);
                  setDirty(true);
                  setStatus(null);
                }}
              />
            </label>
          </div>
        </section>

        <section className={CARD}>
          <h2 className={H2}>Sender</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={LABEL}>From name</span>
              <input
                className={INPUT}
                value={form.fromName}
                placeholder="iForge Technologies"
                onChange={(e) => edit({ fromName: e.target.value })}
              />
            </label>
            <label>
              <span className={LABEL}>From address</span>
              <input
                className={INPUT}
                type="email"
                value={form.fromEmail}
                placeholder="Usually the same as the username"
                onChange={(e) => edit({ fromEmail: e.target.value.trim() })}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Customers who reply to a confirmation or to your reply reach this address.
          </p>
        </section>

        <section className={CARD}>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className={H2}>Send new enquiries to</h2>
            <span className="font-mono text-[0.65rem] text-muted-foreground">
              {recipients.filter((r) => r.trim()).length} of {MAX_RECIPIENTS}
            </span>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            Each address gets every contact-form and quote request. Hitting Reply in that email answers the customer.
          </p>
          <div className="space-y-2">
            {recipients.map((r, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={INPUT}
                  type="email"
                  value={r}
                  placeholder="team@yourdomain.com"
                  onChange={(e) => editRecipients(recipients.map((x, j) => (j === i ? e.target.value.trim() : x)))}
                />
                <button
                  type="button"
                  aria-label="Remove address"
                  onClick={() => {
                    const next = recipients.filter((_, j) => j !== i);
                    editRecipients(next.length ? next : [""]);
                  }}
                  className="shrink-0 rounded-lg border border-hairline px-3 text-sm text-muted-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {recipients.length < MAX_RECIPIENTS && (
            <button
              type="button"
              onClick={() => editRecipients([...recipients, ""])}
              className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
            >
              + Add address
            </button>
          )}

          <label className="flex items-start gap-3 border-t border-hairline pt-5 text-sm text-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[#E61E32]"
              checked={form.confirmToCustomer}
              onChange={(e) => edit({ confirmToCustomer: e.target.checked })}
            />
            <span>
              Send the customer an automatic confirmation
              <span className="block text-xs text-muted-foreground">
                Their ticket number and a copy of what they sent.
              </span>
            </span>
          </label>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            role="status"
            className={`text-sm ${status?.kind === "err" ? "text-[#E61E32]" : "text-emerald-600 dark:text-emerald-400"}`}
          >
            {status?.msg}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={test}
              disabled={busy !== null || dirty || !ready}
              title={dirty ? "Save first" : undefined}
              className="rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40 disabled:opacity-40"
            >
              {busy === "test" ? "Sending…" : "Send test email"}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy !== null || !dirty}
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32] disabled:opacity-40"
            >
              {busy === "save" ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
