import { isAuthenticated } from "@/lib/auth";
import { getContent, loadContent, saveContent, type SiteContent } from "@/lib/content";
import { revalidatePath } from "next/cache";

// GET: current content (admin only — the public reads via getContent() in pages).
export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const content = await getContent();
  return Response.json({ ok: true, content });
}

// PUT: save the full content document, then revalidate every page that reads it.
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let content: SiteContent;
  try {
    content = (await request.json()) as SiteContent;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // If the stored document can't be read, the editor was showing defaults —
  // saving those would wipe the real content.
  const current = await loadContent();
  if (current.error) {
    return Response.json(
      { ok: false, error: `Couldn't read the saved content (${current.error}), so nothing was saved.` },
      { status: 503 },
    );
  }

  const result = await saveContent(content);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 500 });
  }

  // Refresh every public page: the nav, footer and page titles come from this
  // content too, so it isn't just the pages that show a section of it.
  revalidatePath("/", "layout");

  return Response.json({ ok: true });
}
