/**
 * Admin brochure upload / delete endpoint.
 *
 * POST   /api/admin/brochures/upload
 *        multipart/form-data: { slug: string, file: PDF }
 *        → saves PDF to public/uploads/brochures/, upserts BrochureFile row
 *
 * DELETE /api/admin/brochures/upload?slug=<slug>
 *        → removes the PDF from disk + deletes the BrochureFile row
 *
 * Storage convention (matches /api/brochure/download/[slug]):
 *   public/uploads/brochures/<slug>-<timestamp>.pdf
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/admin-auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "brochures");
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_MIME = ["application/pdf"];

export async function POST(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const slug = String(form.get("slug") ?? "").trim();
    const file = form.get("file");

    if (!slug) {
      return NextResponse.json({ error: "slug is required." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required." }, { status: 400 });
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large. Max 25 MB." },
        { status: 413 }
      );
    }

    // Ensure the upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // If a brochure already exists for this slug, remove the old file first
    const existing = await db.brochureFile.findUnique({ where: { slug } });
    if (existing) {
      try {
        await unlink(path.join(UPLOAD_DIR, existing.fileName));
      } catch {
        // old file may already be gone — ignore
      }
    }

    // Build a safe, unique stored filename
    const ext = path.extname(file.name) || ".pdf";
    const storedName = `${slug}-${Date.now()}${ext.toLowerCase()}`;
    const targetPath = path.join(UPLOAD_DIR, storedName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, buffer);

    // Upsert the DB record
    const record = await db.brochureFile.upsert({
      where: { slug },
      update: {
        fileName: storedName,
        originalName: file.name,
        mimeType: file.type,
        size: buffer.length,
        uploadedBy: session.email ?? null,
        updatedAt: new Date(),
      },
      create: {
        slug,
        fileName: storedName,
        originalName: file.name,
        mimeType: file.type,
        size: buffer.length,
        uploadedBy: session.email ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      slug,
      fileName: storedName,
      originalName: file.name,
      size: buffer.length,
      url: `/api/brochure/download/${slug}`,
      id: record.id,
    });
  } catch (err) {
    console.error("[Admin Brochures Upload] error:", err);
    return NextResponse.json(
      { error: "Something went wrong while uploading." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json(
        { error: "slug query param is required." },
        { status: 400 }
      );
    }

    const record = await db.brochureFile.findUnique({ where: { slug } });
    if (!record) {
      return NextResponse.json(
        { error: "No brochure on file for this slug." },
        { status: 404 }
      );
    }

    // Remove file from disk
    try {
      await unlink(path.join(UPLOAD_DIR, record.fileName));
    } catch {
      // already gone — ignore
    }

    // Delete DB record
    await db.brochureFile.delete({ where: { slug } });

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("[Admin Brochures Upload DELETE] error:", err);
    return NextResponse.json(
      { error: "Something went wrong while removing." },
      { status: 500 }
    );
  }
}

// Lightweight status endpoint (admin-only)
export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const count = await db.brochureFile.count();
  return NextResponse.json({ ok: true, count });
}
