/**
 * Public brochure download endpoint.
 *
 * Serves the uploaded PDF for a product slug.
 * If no brochure has been uploaded, returns 404.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "brochures");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const file = await db.brochureFile.findUnique({ where: { slug } });
    if (!file) {
      return NextResponse.json(
        { error: "No brochure available for this product." },
        { status: 404 }
      );
    }

    const filePath = path.join(UPLOAD_DIR, file.fileName);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": file.mimeType || "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.originalName)}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[Brochure Download] error:", err);
    return NextResponse.json(
      { error: "Brochure file not found on disk." },
      { status: 404 }
    );
  }
}
