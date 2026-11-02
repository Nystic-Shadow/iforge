"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Inquiry } from "@/lib/inquiries";

/**
 * The admin app shell: sidebar navigation, and the live inbox feed shared by
 * every admin page. It polls for enquiries changed since its last check, and
 * when a new one lands it raises a toast, a desktop notification (if allowed),
 * an unread badge and a count in the tab title — so you hear about it from
 * whichever admin page you're on.
 */

const POLL_MS = 10_000;

type Toast = { id: string; inquiry: Inquiry };

interface InboxContextValue {
  inquiries: Inquiry[];
  /** Replace one enquiry after a local edit. */
  upsert: (inq: Inquiry) => void;
  /** Enquiries still marked "new". */
  unread: number;
  lastChecked: string | null;
  notifyPermission: NotificationPermission | "unsupported";
  enableNotifications: () => void;
  /** A mailbox is set up in Admin → Email, so replies can be emailed. */
  emailEnabled: boolean;
}

const InboxContext = React.createContext<InboxContextValue | null>(null);

export function useInbox() {
  const ctx = React.useContext(InboxContext);
  if (!ctx) throw new Error("useInbox must be used inside AdminShell");
  return ctx;
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

const NAV = [
  { href: "/admin", label: "Inbox", key: "inbox" },
  { href: "/admin/team", label: "Team", key: "team" },
  { href: "/admin/content", label: "Content", key: "content" },
  { href: "/admin/email", label: "Email", key: "email" },
];

export default function AdminShell({
  initialInquiries,
  storageMode,
  hermes,
  emailEnabled,
  children,
}: {
  initialInquiries: Inquiry[];
  storageMode: "supabase" | "local";
  hermes: { webhook: boolean; agentApi: boolean };
  emailEnabled: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [inquiries, setInquiries] = React.useState<Inquiry[]>(initialInquiries);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [lastChecked, setLastChecked] = React.useState<string | null>(null);
  const [notifyPermission, setNotifyPermission] = React.useState<NotificationPermission | "unsupported">(
    "default",
  );
  const since = React.useRef<string>(new Date().toISOString());
  const known = React.useRef(new Set(initialInquiries.map((i) => i.id)));

  const unread = inquiries.filter((i) => i.status === "new").length;

  React.useEffect(() => {
    setNotifyPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  }, []);

  const upsert = React.useCallback((inq: Inquiry) => {
    known.current.add(inq.id);
    setInquiries((prev) => {
      const i = prev.findIndex((x) => x.id === inq.id);
      if (i === -1) return [inq, ...prev];
      const next = prev.slice();
      next[i] = inq;
      return next;
    });
  }, []);

  // ---- live feed -----------------------------------------------------------
  React.useEffect(() => {
    let stopped = false;

    const check = async () => {
      try {
        const r = await fetch(`/api/admin/inquiries?since=${encodeURIComponent(since.current)}`, {
          cache: "no-store",
        });
        if (r.status === 401) {
          router.replace("/admin/login");
          return;
        }
        const data = await r.json();
        if (stopped || !data.ok) return;
        since.current = data.serverTime;
        setLastChecked(data.serverTime);

        const changed: Inquiry[] = data.inquiries;
        const arrivals = changed.filter((i) => !known.current.has(i.id));
        changed.forEach((i) => known.current.add(i.id));
        if (changed.length) {
          setInquiries((prev) => {
            const map = new Map(prev.map((i) => [i.id, i]));
            changed.forEach((i) => map.set(i.id, i));
            return [...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          });
        }

        for (const inq of arrivals) {
          setToasts((t) => [...t, { id: inq.id, inquiry: inq }]);
          window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== inq.id)), 8000);
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            const n = new Notification(`New enquiry · ${inq.ticket}`, {
              body: `${inq.name}${inq.service ? " — " + inq.service : ""}\n${inq.message.slice(0, 120)}`,
              tag: inq.id,
            });
            n.onclick = () => {
              window.focus();
              router.push(`/admin?open=${inq.id}`);
            };
          }
        }
      } catch {
        // Offline or server restarting — keep what we have and try again.
      }
    };

    const id = window.setInterval(check, POLL_MS);
    const onFocus = () => check();
    window.addEventListener("focus", onFocus);
    return () => {
      stopped = true;
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);

  // Unread count in the tab title, re-applied when the page changes it.
  React.useEffect(() => {
    const base = "Admin · iForge";
    document.title = unread ? `(${unread}) ${base}` : base;
  }, [unread, pathname]);

  const enableNotifications = () => {
    if (typeof Notification === "undefined") return;
    Notification.requestPermission().then(setNotifyPermission);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <InboxContext.Provider
      value={{ inquiries, upsert, unread, lastChecked, notifyPermission, enableNotifications, emailEnabled }}
    >
      <div className="min-h-screen bg-background text-foreground lg:pl-60">
        {/* Sidebar */}
        <aside className="border-b border-hairline bg-muted/40 lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col gap-6 px-5 py-5 lg:py-7">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-baseline gap-2">
                <span className="text-xl font-black lowercase tracking-tight">iforge</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Admin
                </span>
              </Link>
              <a href="/" target="_blank" className="text-xs text-muted-foreground hover:text-foreground lg:hidden">
                View site ↗
              </a>
            </div>

            <nav className="flex gap-1 lg:flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`relative flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active(n.href)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                  }`}
                >
                  {n.label}
                  {n.key === "inbox" && unread > 0 && (
                    <span className="ml-3 min-w-5 rounded-full bg-[#E61E32] px-1.5 py-0.5 text-center font-mono text-[0.65rem] font-semibold text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-auto hidden space-y-4 text-xs text-muted-foreground lg:block">
              <div className="space-y-1.5 rounded-lg border border-hairline p-3">
                <StatusRow ok={storageMode === "supabase"} label={storageMode === "supabase" ? "Supabase" : "Local files (dev)"} />
                <StatusRow ok={hermes.webhook} label={hermes.webhook ? "Hermes webhook on" : "Hermes webhook off"} />
                <StatusRow ok={hermes.agentApi} label={hermes.agentApi ? "Agent API on" : "Agent API off"} />
                <StatusRow ok={emailEnabled} label={emailEnabled ? "Email on" : "Email off"} />
              </div>
              <div className="flex items-center justify-between">
                <a href="/" target="_blank" className="hover:text-foreground">
                  View site ↗
                </a>
                <button onClick={logout} className="font-semibold hover:text-[#E61E32]">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>

        {/* New-enquiry toasts */}
        <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
          <AnimatePresence>
            {toasts.map(({ id, inquiry }) => (
              <motion.button
                key={id}
                layout
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  setToasts((t) => t.filter((x) => x.id !== id));
                  router.push(`/admin?open=${id}`);
                }}
                className="pointer-events-auto rounded-xl border border-hairline bg-card/95 p-4 text-left shadow-xl shadow-black/10 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#E61E32]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E61E32]" />
                  New enquiry · {inquiry.ticket}
                </div>
                <div className="mt-1.5 text-sm font-semibold text-foreground">{inquiry.name}</div>
                <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {inquiry.service ? `${inquiry.service} — ` : ""}
                  {inquiry.message || "Quote request"}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </InboxContext.Provider>
  );
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
      {label}
    </div>
  );
}
