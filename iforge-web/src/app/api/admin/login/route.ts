import { checkPassword, createSession, isAdminConfigured } from "@/lib/auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return Response.json(
      { ok: false, error: "ADMIN_PASSWORD is not set on the server." },
      { status: 503 },
    );
  }
  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return Response.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  await createSession(request);
  return Response.json({ ok: true });
}
