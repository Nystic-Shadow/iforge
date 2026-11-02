import { isAuthenticated } from "@/lib/auth";
import { getInquiry, updateInquiry } from "@/lib/inquiries";
import { sendReply } from "@/lib/email";

// Admin: save the reply shown in the inbox, then email it to the customer.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { reply?: unknown } | null;
  const reply = typeof body?.reply === "string" ? body.reply.slice(0, 10_000) : "";
  if (!reply.trim()) return Response.json({ ok: false, error: "Write a reply first." }, { status: 400 });

  const saved = await updateInquiry(id, { reply }, "admin");
  if (!saved) return Response.json({ ok: false, error: "Not found" }, { status: 404 });

  try {
    await sendReply(saved);
  } catch (e) {
    const inquiry = await getInquiry(id);
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "Send failed", inquiry },
      { status: 502 },
    );
  }
  return Response.json({ ok: true, inquiry: await getInquiry(id) });
}
