import { promises as fs } from "fs";
import path from "path";
import { UPLOADS_DIR, UPLOAD_TYPES } from "@/lib/uploads";

// Photos uploaded from the admin panel when Supabase isn't configured. Looks in
// the upload store first, then public/uploads/ (where older uploads were saved).
const ROOTS = [UPLOADS_DIR, path.join(process.cwd(), "public", "uploads")];

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const type = UPLOAD_TYPES[path.extname(parts.at(-1) ?? "").slice(1).toLowerCase()];
  if (!type || parts.some((p) => p === ".." || p.includes("/") || p.includes("\\"))) {
    return new Response("Not found", { status: 404 });
  }
  for (const root of ROOTS) {
    try {
      // Runtime-only files: keep the build from tracing the whole project.
      const body = await fs.readFile(path.join(/*turbopackIgnore: true*/ root, ...parts));
      return new Response(body, {
        headers: {
          "Content-Type": type,
          // Names are random UUIDs, so a file never changes.
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      // try the next root
    }
  }
  return new Response("Not found", { status: 404 });
}
