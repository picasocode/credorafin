import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendLeadNotification } from "@/lib/mail";

export async function POST(request: Request) {
  // Rate limit: 5 requests per minute per IP.
  const ip = getClientIp(request);
  const rl = rateLimit(ip, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { email, product, brochureFile } = body;

    if (!email || !product || !brochureFile) {
      return NextResponse.json(
        { error: "Email, product, and brochure file are required." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    // Check if an uploaded brochure exists for this product slug
    const slug = product;
    const uploadedFile = await db.brochureFile.findUnique({ where: { slug } });

    // Determine the actual download URL:
    // - If admin has uploaded a PDF, serve it via our download endpoint
    // - Otherwise, fall back to the static /brochures/ path
    let downloadUrl: string;
    if (uploadedFile) {
      downloadUrl = `/api/brochure/download/${slug}`;
    } else {
      downloadUrl = `/brochures/${brochureFile}`;
    }

    // Record the download
    let createdRow: Record<string, unknown> | null = null;
    try {
      createdRow = await db.brochureDownload.create({
        data: {
          email,
          product,
          brochureFile: uploadedFile ? uploadedFile.originalName : brochureFile,
          ipAddress: clientIp,
          userAgent,
        },
      });
    } catch (insertErr) {
      console.error("[Brochure API] brochure_downloads insert failed (non-blocking):", insertErr);
    }

    // Best-effort lead notification. Never fail the request if email fails.
    if (createdRow) {
      sendLeadNotification("brochure", {
        ...createdRow,
        ipAddress: clientIp,
        userAgent,
      }).catch((e) => console.error("[Brochure API] lead email failed:", e));
    }

    return NextResponse.json({
      success: true,
      message: "Your brochure is downloading now.",
      downloadUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
