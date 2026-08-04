/**
 * Admin image upload endpoint.
 *
 * POST /api/admin/upload?bucket=<bucket>
 *      multipart/form-data: { file: Image }
 *      → saves to public/uploads/<bucket>/<timestamp>-<rand>.<ext>
 *      → returns { url, size, name, type }
 *
 * Used by the ImageUploader component for hero slide images, fallback
 * images, and any other admin image upload need. Files are written to
 * public/uploads/<bucket>/ which nginx serves directly via the
 * /uploads/ location block.
 *
 * Allowed types: PNG, JPEG, WebP, GIF, AVIF, SVG
 * Max size: 10 MB
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const PUBLIC_UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
};

// Whitelist of allowed bucket subdirectories (prevents path traversal)
const ALLOWED_BUCKETS = ["hero-slides", "blog", "pages", "products", "misc"];

export async function POST(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const bucket = (request.nextUrl.searchParams.get("bucket") ?? "misc").trim();

    // Validate bucket against whitelist
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json(
        { error: `Invalid bucket. Allowed: ${ALLOWED_BUCKETS.join(", ")}` },
        { status: 400 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required." }, { status: 400 });
    }

    const ext = ALLOWED_MIME[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: PNG, JPEG, WebP, GIF, AVIF, SVG.` },
        { status: 415 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum 10 MB." },
        { status: 413 }
      );
    }

    // Ensure the bucket directory exists
    const targetDir = path.join(PUBLIC_UPLOADS_ROOT, bucket);
    await mkdir(targetDir, { recursive: true });

    // Build a safe, unique stored filename
    const rand = crypto.randomBytes(6).toString("hex");
    const storedName = `${Date.now()}-${rand}${ext}`;
    const targetPath = path.join(targetDir, storedName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, buffer);

    // Return the public URL path (nginx serves /uploads/ → public/uploads/)
    const publicUrl = `/uploads/${bucket}/${storedName}`;

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      size: buffer.length,
      name: file.name,
      type: file.type,
      bucket,
    });
  } catch (err) {
    console.error("[Admin Upload] error:", err);
    return NextResponse.json(
      { error: "Something went wrong while uploading." },
      { status: 500 }
    );
  }
}

// Admin-only status endpoint
export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, endpoint: "/api/admin/upload" });
}
