import { isAuthenticated } from "@/lib/auth";
import { saveImage } from "@/lib/uploads";

// Image upload for the admin panel (multipart form, field "file").
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "No image received." }, { status: 400 });
  }
  const result = await saveImage(file, "team").catch((e) => ({
    url: undefined,
    error: e instanceof Error ? e.message : "Upload failed.",
  }));
  if (!result.url) return Response.json({ ok: false, error: result.error }, { status: 400 });
  return Response.json({ ok: true, url: result.url });
}
