"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Inquiry, InquiryAssignee, InquiryStatus } from "@/lib/inquiries";
import { PageHeader, useInbox } from "./shell";

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
  archived: "Archived",
};

const STATUS_STYLE: Record<InquiryStatus, string> = {
  new: "bg-[#E61E32]/12 text-[#E61E32] border-[#E61E32]/30",
  in_progress: "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/30",
  resolved: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  archived: "bg-foreground/[0.06] text-muted-foreground border-hairline",
};

const ASSIGNEE_LABEL: Record<InquiryAssignee, string> = {
  unassigned: "Unassigned",
  hermes: "Hermes",
  admin: "You",
};

const ACTOR_LABEL: Record<string, string> = {
  website: "Website",
  admin: "You",
  agent: "Hermes",
  system: "System",
};

const FILTERS: (InquiryStatus | "all")[] = ["all", "new", "in_progress", "resolved", "archived"];

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

function StatusPill({ status }: { status: InquiryStatus }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function InboxView() {
  const { inquiries, upsert, lastChecked, notifyPermission, enableNotifications } = useInbox();
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = React.useState<InquiryStatus | "all">("all");
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(params.get("open"));

  // A notification or toast links here with ?open=<id>.
  React.useEffect(() => {
    const open = params.get("open");
    if (open) setSelectedId(open);
  }, [params]);

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: inquiries.length };
    for (const i of inquiries) c[i.status] = (c[i.status] ?? 0) + 1;
    return c;
  }, [inquiries]);

  const visible = inquiries.filter((i) => {
    if (filter !== "all" && i.status !== filter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [i.name, i.email, i.company, i.ticket, i.service].some((v) => v?.toLowerCase().includes(q));
  });

  const selected = inquiries.find((i) => i.id === selectedId) ?? null;
  const detailRef = React.useRef<HTMLDivElement>(null);

  const select = (id: string) => {
    setSelectedId(id);
    router.replace(`/admin?open=${id}`, { scroll: false });
    // Below xl the detail stacks under the list — bring it into view.
    if (window.innerWidth < 1280) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Inbox"
        description="Enquiries from the contact form and quote wizard. New ones are pushed to Hermes as they arrive; you'll see everything it does here."
        actions={
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {lastChecked && <span>Live · checked {new Date(lastChecked).toLocaleTimeString()}</span>}
            {notifyPermission === "default" && (
              <button
                onClick={enableNotifications}
                className="rounded-full border border-hairline px-3 py-1.5 font-semibold text-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
              >
                Enable desktop alerts
              </button>
            )}
            {notifyPermission === "granted" && (
              <span className="rounded-full border border-emerald-500/30 px-3 py-1.5 text-emerald-600 dark:text-emerald-400">
                Desktop alerts on
              </span>
            )}
          </div>
        }
      />

      {inquiries.length === 0 ? (
        <EmptyInbox />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,26rem)_1fr]">
          {/* List */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    filter === f
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "All" : STATUS_LABEL[f]}
                  <span className="ml-1.5 font-mono opacity-60">{counts[f] ?? 0}</span>
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, company, ticket…"
              className="w-full rounded-lg border border-hairline bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#E61E32] focus:outline-none"
            />

            <ul className="overflow-hidden rounded-xl border border-hairline">
              {visible.length === 0 && (
                <li className="p-6 text-center text-sm text-muted-foreground">Nothing matches.</li>
              )}
              {visible.map((i) => (
                <li key={i.id} className="border-b border-hairline last:border-b-0">
                  <button
                    onClick={() => select(i.id)}
                    className={`block w-full p-4 text-left transition-colors ${
                      selectedId === i.id ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 truncate text-sm font-semibold text-foreground">
                        {i.status === "new" && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E61E32]" />}
                        <span className="truncate">{i.name}</span>
                      </span>
                      <span className="shrink-0 text-[0.7rem] text-muted-foreground">{timeAgo(i.createdAt)}</span>
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {i.service ? `${i.service} — ` : ""}
                      {i.message || `${i.scope ?? "Quote request"}`}
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <StatusPill status={i.status} />
                      <span className="font-mono text-[0.65rem] text-muted-foreground">{i.ticket}</span>
                      <span className="text-[0.65rem] text-muted-foreground">
                        · {i.source === "quote" ? "Quote" : "Contact"}
                      </span>
                      {i.assignee === "hermes" && (
                        <span className="ml-auto rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[0.65rem] font-semibold text-foreground">
                          Hermes
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail */}
          <div ref={detailRef} className="scroll-mt-6">
            {selected ? (
              <InquiryDetail key={selected.id} inquiry={selected} onSaved={upsert} />
            ) : (
              <div className="hidden h-full items-center justify-center rounded-xl border border-dashed border-hairline p-10 text-sm text-muted-foreground xl:flex">
                Select an enquiry to read it.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline font-mono text-xs text-muted-foreground">
        0
      </span>
      <h2 className="mt-5 text-lg font-semibold text-foreground">No enquiries yet</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        When someone sends the contact form or the quote wizard, it lands here within seconds — with a
        toast and a desktop alert if you turn them on.
      </p>
    </div>
  );
}

function InquiryDetail({ inquiry, onSaved }: { inquiry: Inquiry; onSaved: (i: Inquiry) => void }) {
  const { emailEnabled } = useInbox();
  const [notes, setNotes] = React.useState(inquiry.notes ?? "");
  const [reply, setReply] = React.useState(inquiry.reply ?? "");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [confirming, setConfirming] = React.useState(false);
  const lastEmailed = [...inquiry.events].reverse().find((e) => e.type === "email.reply");

  // Hermes may edit the same enquiry while it's open; follow its changes
  // unless you're halfway through typing.
  const dirty = notes !== (inquiry.notes ?? "") || reply !== (inquiry.reply ?? "");
  const lastSynced = React.useRef(inquiry.updatedAt);
  React.useEffect(() => {
    if (inquiry.updatedAt !== lastSynced.current && !dirty) {
      setNotes(inquiry.notes ?? "");
      setReply(inquiry.reply ?? "");
    }
    lastSynced.current = inquiry.updatedAt;
  }, [inquiry, dirty]);

  const patch = async (body: Record<string, string>) => {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) setError(data.error || "Couldn't save.");
      else onSaved(data.inquiry);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/admin/inquiries/${inquiry.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });
      const data = await r.json();
      if (data.inquiry) onSaved(data.inquiry);
      if (!r.ok || !data.ok) setError(data.error || "Couldn't send.");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  const details: [string, string | undefined][] = [
    ["Service", inquiry.service],
    ["Budget", inquiry.budget],
    ["Scope", inquiry.scope],
    ["Timeline", inquiry.timeline],
    ["Company", inquiry.company],
    ["Phone", inquiry.phone],
    ["Sent from", inquiry.page],
    ["Received", when(inquiry.createdAt)],
  ];

  return (
    <article className="rounded-xl border border-hairline">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline p-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
            {inquiry.ticket} · {inquiry.source === "quote" ? "Quote wizard" : "Contact form"}
          </div>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{inquiry.name}</h2>
          <a href={`mailto:${inquiry.email}`} className="mt-0.5 inline-block text-sm text-[#E61E32] hover:underline">
            {inquiry.email}
          </a>
        </div>
        <StatusPill status={inquiry.status} />
      </header>

      <div className="space-y-7 p-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          {details
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">{k}</dt>
                <dd className="mt-0.5 text-sm text-foreground">{v}</dd>
              </div>
            ))}
        </dl>

        {inquiry.message && (
          <div>
            <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">Message</h3>
            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-foreground/[0.03] p-4 text-sm leading-relaxed text-foreground">
              {inquiry.message}
            </p>
          </div>
        )}

        {/* Status + owner */}
        <div className="grid gap-5 sm:grid-cols-2">
          <ButtonGroup
            label="Status"
            value={inquiry.status}
            options={(Object.keys(STATUS_LABEL) as InquiryStatus[]).map((s) => [s, STATUS_LABEL[s]])}
            disabled={busy}
            onChange={(status) => patch({ status })}
          />
          <ButtonGroup
            label="Handled by"
            value={inquiry.assignee}
            options={(Object.keys(ASSIGNEE_LABEL) as InquiryAssignee[]).map((a) => [a, ASSIGNEE_LABEL[a]])}
            disabled={busy}
            onChange={(assignee) => patch({ assignee })}
          />
        </div>

        {/* Shared workspace with Hermes */}
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
              Notes — shared with Hermes
            </span>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context, next steps, anything Hermes found…"
              className="mt-2 w-full resize-y rounded-lg border border-hairline bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#E61E32] focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
              Reply to customer
            </span>
            <textarea
              rows={5}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Draft a reply — Hermes can draft one here too."
              className="mt-2 w-full resize-y rounded-lg border border-hairline bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#E61E32] focus:outline-none"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            {error && <div className="text-[#E61E32]">{error}</div>}
            {lastEmailed && <div className="text-muted-foreground">Reply last emailed {when(lastEmailed.at)}</div>}
            {!emailEnabled && (
              <div className="text-muted-foreground">
                Email is off —{" "}
                <a href="/admin/email" className="underline hover:text-foreground">
                  set up your mailbox
                </a>{" "}
                to send replies.
              </div>
            )}
          </div>
          {confirming ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-foreground">
                Email this reply to <span className="font-semibold">{inquiry.email}</span>?
              </span>
              <button
                onClick={() => setConfirming(false)}
                disabled={busy}
                className="rounded-full border border-hairline px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={busy}
                className="rounded-full bg-[#E61E32] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {busy ? "Sending…" : "Send now"}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => patch({ notes, reply })}
                disabled={busy || !dirty}
                className="rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40 disabled:opacity-40"
              >
                {busy ? "Saving…" : "Save notes & reply"}
              </button>
              <button
                onClick={() => {
                  setError("");
                  setConfirming(true);
                }}
                disabled={busy || !emailEnabled || !reply.trim()}
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32] disabled:opacity-40"
              >
                Send reply
              </button>
            </div>
          )}
        </div>

        {/* Activity */}
        <div>
          <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">Activity</h3>
          <ol className="mt-3 space-y-3 border-l border-hairline pl-4">
            {[...inquiry.events].reverse().map((e, idx) => (
              <li key={idx} className="relative text-sm">
                <span
                  className={`absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full ${
                    e.type === "webhook.failed" || e.type === "email.failed"
                      ? "bg-[#E61E32]"
                      : e.actor === "agent"
                        ? "bg-violet-500"
                        : "bg-muted-foreground/50"
                  }`}
                />
                <span className="font-medium text-foreground">{ACTOR_LABEL[e.actor] ?? e.actor}</span>{" "}
                <span className="text-muted-foreground">
                  {describe(e.type)}
                  {e.detail ? ` — ${e.detail}` : ""}
                </span>
                <div className="text-[0.7rem] text-muted-foreground">{when(e.at)}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}

function describe(type: string): string {
  switch (type) {
    case "created":
      return "received the enquiry";
    case "status":
      return "changed the status";
    case "assigned":
      return "assigned it";
    case "note":
      return "updated the notes";
    case "reply":
      return "updated the reply";
    case "webhook.delivered":
      return "sent it to Hermes";
    case "webhook.failed":
      return "couldn't reach Hermes";
    case "email.notify":
      return "emailed it to the team";
    case "email.confirmation":
      return "sent the confirmation email";
    case "email.reply":
      return "emailed the reply";
    case "email.failed":
      return "couldn't send an email";
    default:
      return type;
  }
}

function ButtonGroup<T extends string>({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  disabled: boolean;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map(([v, text]) => (
          <button
            key={v}
            disabled={disabled || v === value}
            onClick={() => onChange(v)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-default ${
              v === value
                ? "border-foreground bg-foreground text-background"
                : "border-hairline text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
