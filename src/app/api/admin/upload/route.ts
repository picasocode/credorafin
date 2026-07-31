/**
 * Admin file upload endpoint.
 *
 * POST  — accepts multipart/form-data with a single `file` field,
 *         writes it to public/uploads/<bucket>/<timestamp>-<sanitized-name>,
 *         returns { url, size, name }
 *
 * Supported query params:
 *   ?bucket=hero-slides   (default: hero-slides) — subdir under public/uploads/
 *
 * Auth: any logged-in admin (super_admin / admin / editor).
 *
 * Limits:
 *   - 10 MB max file size (enforced in-memory)
 *   - allowed MIME types: image/png, image/jpeg, image/webp, image/gif,
 *     image/avif, image/svg+xml
 *
 * Returns the URL path (relative, e.g. "/uploads/hero-slides/abc.png") so the
 * frontend can save it into any field (hero slide image, blog post image, etc).
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const bucketRaw = request.nextUrl.searchParams.get("bucket") || "hero-slides";
  // Sanitize bucket — only allow [a-z0-9-_]
  const bucket = bucketRaw.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40) || "hero-slides";

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart form data." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "No file provided. Expected a 'file' field." },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max ${Math.round(MAX_BYTES / 1024 / 1024)} MB.` },
      { status: 413 }
    );
  }

  const mime = file.type || "";
  const ext = ALLOWED_MIME[mime];
  if (!ext) {
    return NextResponse.json(
      {
        error: `Unsupported file type: ${mime || "unknown"}. Allowed: PNG, JPEG, WebP, GIF, AVIF, SVG.`,
      },
      { status: 415 }
    );
  }

  // Build a safe filename: <timestamp>-<random6>.<ext>
  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const safeName = `${timestamp}-${rand}.${ext}`;

  // Resolve target dir relative to project root (process.cwd())
  const projectRoot = process.cwd();
  const targetDir = join(projectRoot, "public", "uploads", bucket);
  const targetPath = join(targetDir, safeName);

  try {
    await mkdir(targetDir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, buf);
  } catch (err) {
    console.error("[Admin Upload] write error:", err);
    return NextResponse.json(
      { error: "Failed to write file to disk." },
      { status: 500 }
    );
  }

  // Public URL path (relative). The frontend stores this in the DB.
  const publicUrl = `/uploads/${bucket}/${safeName}`;

  return NextResponse.json({
    url: publicUrl,
    size: file.size,
    name: file.name,
    type: mime,
  });
}
