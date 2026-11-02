"use client";

import React from "react";
import type { TeamMember, TeamPageContent } from "@/lib/content";
import { Notice, PageHeader } from "./shell";

const INPUT =
  "w-full rounded-lg border border-hairline bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#E61E32] focus:outline-none";
const LABEL = "mb-1.5 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground";

const blank = (): TeamMember => ({ id: crypto.randomUUID(), name: "", role: "", bio: "", photo: "" });

export default function TeamEditor({
  initialTeam,
  initialPage,
  loadError,
}: {
  initialTeam: TeamMember[];
  initialPage: TeamPageContent;
  /** The stored content couldn't be read; saving is off so defaults can't overwrite it. */
  loadError?: string;
}) {
  const [team, setTeam] = React.useState<TeamMember[]>(initialTeam);
  const [page, setPage] = React.useState<TeamPageContent>(initialPage);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const touched = () => {
    setDirty(true);
    setStatus(null);
  };
  const edit = (next: TeamMember[]) => {
    setTeam(next);
    touched();
  };
  const editPage = (patch: Partial<TeamPageContent>) => {
    setPage((p) => ({ ...p, ...patch }));
    touched();
  };
  const setAt = (i: number, patch: Partial<TeamMember>) =>
    edit(team.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= team.length) return;
    const next = team.slice();
    [next[i], next[j]] = [next[j], next[i]];
    edit(next);
  };
  const onError = (msg: string) => setStatus({ kind: "err", msg });

  const save = async () => {
    const unnamed = team.findIndex((m) => !m.name.trim());
    if (unnamed !== -1) {
      setStatus({ kind: "err", msg: `Member #${unnamed + 1} needs a name.` });
      return;
    }
    setSaving(true);
    try {
      const r = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team, teamPage: page }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) setStatus({ kind: "err", msg: data.error || "Save failed." });
      else {
        setTeam(data.team);
        setPage(data.teamPage);
        setDirty(false);
        setStatus({ kind: "ok", msg: "Saved — the Team page is updated." });
      }
    } catch {
      setStatus({ kind: "err", msg: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Team"
        description="Everything on the public Team page, top to bottom. Empty sections are hidden on the site."
        actions={
          <a href="/team" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">
            View Team page ↗
          </a>
        }
      />
      {loadError && (
        <Notice>
          Couldn&apos;t read the saved content ({loadError}). These are the default texts, so saving is off
          until it loads — check the Supabase settings and reload.
        </Notice>
      )}

      <div className="space-y-6">
        {/* Who we are */}
        <Panel title="Who we are" hint="Intro text beside a photo. Without a photo the text spans the full width.">
          <div className="grid gap-5 sm:grid-cols-[9rem_1fr]">
            <PhotoField
              photo={page.introImage}
              name="Intro"
              aspect="aspect-[4/3]"
              onChange={(introImage) => editPage({ introImage })}
              onError={onError}
            />
            <div className="space-y-4">
              <label className="block">
                <span className={LABEL}>Heading</span>
                <input className={INPUT} value={page.introHeading} onChange={(e) => editPage({ introHeading: e.target.value })} />
              </label>
              <label className="block">
                <span className={LABEL}>Text</span>
                <textarea
                  rows={5}
                  className={`${INPUT} resize-y`}
                  value={page.introBody}
                  onChange={(e) => editPage({ introBody: e.target.value })}
                />
              </label>
            </div>
          </div>
        </Panel>

        {/* Highlights */}
        <Panel title="Highlights" hint="Up to four real figures, e.g. 10+ · Years in business. Leave empty to hide the row.">
          <div className="space-y-3">
            {page.stats.map((st, i) => (
              <div key={i} className="grid grid-cols-[7rem_1fr_auto] items-end gap-3">
                <label>
                  <span className={LABEL}>Figure</span>
                  <input
                    className={INPUT}
                    value={st.value}
                    placeholder="10+"
                    onChange={(e) => editPage({ stats: page.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })}
                  />
                </label>
                <label>
                  <span className={LABEL}>Label</span>
                  <input
                    className={INPUT}
                    value={st.label}
                    placeholder="Years in business"
                    onChange={(e) => editPage({ stats: page.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
                  />
                </label>
                <button
                  onClick={() => editPage({ stats: page.stats.filter((_, j) => j !== i) })}
                  className="mb-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-[#E61E32]"
                >
                  Remove
                </button>
              </div>
            ))}
            {page.stats.length < 4 && (
              <button
                onClick={() => editPage({ stats: [...page.stats, { value: "", label: "" }] })}
                className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
              >
                + Add highlight
              </button>
            )}
          </div>
        </Panel>

        {/* Members */}
        <Panel
          title="Members"
          hint="Everyone is added here and shown as the same card, in this order. Turn on Core member to list someone in the Core team section at the top; the rest appear under Our team. A photo is optional — without one, the card shows their initials."
        >
          <div className="space-y-4">
            {team.map((m, i) => (
              <div key={m.id} className="grid gap-5 rounded-xl border border-hairline p-4 sm:grid-cols-[9rem_1fr]">
                <PhotoField photo={m.photo} name={m.name} onChange={(photo) => setAt(i, { photo })} onError={onError} />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.65rem] text-muted-foreground">#{i + 1}</span>
                    <div className="flex items-center gap-1 text-xs">
                      <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                        ↑
                      </IconBtn>
                      <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === team.length - 1}>
                        ↓
                      </IconBtn>
                      <button
                        onClick={() => edit(team.filter((_, idx) => idx !== i))}
                        className="ml-2 rounded-full px-2.5 py-1 font-semibold text-muted-foreground transition-colors hover:text-[#E61E32]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className={LABEL}>Name *</span>
                      <input className={INPUT} value={m.name} onChange={(e) => setAt(i, { name: e.target.value })} />
                    </label>
                    <label>
                      <span className={LABEL}>Role</span>
                      <input
                        className={INPUT}
                        value={m.role}
                        placeholder="e.g. Principal Cloud Architect"
                        onChange={(e) => setAt(i, { role: e.target.value })}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className={LABEL}>Bio</span>
                    <textarea
                      rows={3}
                      className={`${INPUT} resize-y`}
                      value={m.bio}
                      placeholder="Two or three lines on what they do and what they love building."
                      onChange={(e) => setAt(i, { bio: e.target.value })}
                    />
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={Boolean(m.featured)}
                      onChange={(e) => setAt(i, { featured: e.target.checked })}
                      className="h-4 w-4 accent-[#E61E32]"
                    />
                    Core member
                    <span className="text-xs text-muted-foreground">— shown in the Core team section (e.g. founders and leads)</span>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(["linkedin", "github", "x"] as const).map((k) => (
                      <label key={k}>
                        <span className={LABEL}>{k === "x" ? "X / Twitter" : k === "github" ? "GitHub" : "LinkedIn"}</span>
                        <input
                          className={INPUT}
                          value={m[k] ?? ""}
                          placeholder="https://…"
                          onChange={(e) => setAt(i, { [k]: e.target.value })}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => edit([...team, blank()])}
            className="mt-4 w-full rounded-xl border border-dashed border-hairline py-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-[#E61E32] hover:text-[#E61E32]"
          >
            + Add team member
          </button>
        </Panel>
      </div>

      <div className="sticky bottom-0 mt-8 flex items-center justify-between gap-4 border-t border-hairline bg-background/90 py-4 backdrop-blur">
        <span
          className={`font-mono text-[0.7rem] uppercase tracking-wider ${
            status?.kind === "err" ? "text-[#E61E32]" : status?.kind === "ok" ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {status?.msg || (dirty ? "Unsaved changes" : "All changes saved")}
        </span>
        <button
          onClick={save}
          disabled={saving || !dirty || Boolean(loadError)}
          className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-[#E61E32] disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save Team page"}
        </button>
      </div>
    </div>
  );
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-hairline p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="h-7 w-7 rounded-full border border-hairline text-foreground transition-colors hover:border-foreground/40 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function PhotoField({
  photo,
  name,
  aspect = "aspect-[4/5]",
  onChange,
  onError,
}: {
  photo: string;
  name: string;
  aspect?: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const input = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await r.json();
      if (!r.ok || !data.ok) onError(data.error || "Upload failed.");
      else onChange(data.url);
    } catch {
      onError("Upload failed — network error.");
    } finally {
      setUploading(false);
    }
  };

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => input.current?.click()}
        className={`group relative block ${aspect} w-full overflow-hidden rounded-xl border border-hairline bg-foreground/[0.04]`}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name || "Photo"} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
            {initials || "+"}
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-center text-[0.65rem] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? "Uploading…" : photo ? "Change photo" : "Upload photo"}
        </span>
      </button>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
      <div className="flex gap-1.5">
        <input
          className="min-w-0 flex-1 rounded-md border border-hairline bg-background px-2 py-1.5 text-[0.7rem] text-foreground placeholder:text-muted-foreground focus:border-[#E61E32] focus:outline-none"
          value={photo}
          placeholder="…or paste an image URL"
          onChange={(e) => onChange(e.target.value)}
        />
        {photo && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove photo"
            className="rounded-md border border-hairline px-2 text-[0.7rem] text-muted-foreground hover:text-[#E61E32]"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
