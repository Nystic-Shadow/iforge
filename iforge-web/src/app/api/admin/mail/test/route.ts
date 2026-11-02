import { isAuthenticated } from "@/lib/auth";
import { sendTestEmail } from "@/lib/email";

// Admin: send a test email with the saved settings and report the SMTP result.
export async function POST() {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const to = await sendTestEmail();
    return Response.json({ ok: true, to });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Send failed" }, { status: 502 });
  }
}
