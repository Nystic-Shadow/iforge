import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { loadContent, saveContent, type TeamMember, type TeamPageContent } from "@/lib/content";

const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Save the Team page from the admin editor: the member list (order included)
// and, when sent, the page around it (intro, highlights, founder quote).
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body?.team)) {
    return Response.json({ ok: false, error: "Invalid team." }, { status: 400 });
  }

  const team: TeamMember[] = (body.team as Record<string, unknown>[])
    .map((m) => ({
      id: s(m.id, 64) || crypto.randomUUID(),
      name: s(m.name, 120),
      role: s(m.role, 120),
      bio: s(m.bio, 1200),
      photo: s(m.photo, 1000),
      linkedin: s(m.linkedin, 300) || undefined,
      github: s(m.github, 300) || undefined,
      x: s(m.x, 300) || undefined,
      featured: m.featured === true || undefined,
    }))
    .filter((m) => m.name);

  // The rest of the document is saved back as read, so a failed read must
  // not be saved over the real content as defaults.
  const { content, error } = await loadContent();
  if (error) {
    return Response.json(
      { ok: false, error: `Couldn't read the saved content (${error}), so nothing was saved.` },
      { status: 503 },
    );
  }

  let teamPage: TeamPageContent = content.teamPage;
  const p = body.teamPage as Record<string, unknown> | undefined;
  if (p && typeof p === "object") {
    teamPage = {
      introHeading: s(p.introHeading, 120),
      introBody: s(p.introBody, 2000),
      introImage: s(p.introImage, 1000),
      stats: (Array.isArray(p.stats) ? (p.stats as Record<string, unknown>[]) : [])
        .map((x) => ({ value: s(x.value, 20), label: s(x.label, 60) }))
        .filter((x) => x.value && x.label)
        .slice(0, 4),
      quoteLead: s(p.quoteLead, 400),
      quoteRest: s(p.quoteRest, 400),
      quoteName: s(p.quoteName, 120),
      quoteRole: s(p.quoteRole, 120),
      quotePhoto: s(p.quotePhoto, 1000),
    };
  }

  const result = await saveContent({ ...content, team, teamPage });
  if (!result.ok) return Response.json({ ok: false, error: result.error }, { status: 500 });
  revalidatePath("/team");
  return Response.json({ ok: true, team, teamPage });
}
