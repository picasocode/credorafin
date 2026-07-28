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
    const { full_name, email, phone, position, experience, message, name, resumeUrl } = body;

    // Support both `full_name` and `name` keys for flexibility
    const applicantName = full_name || name;
    if (!applicantName || !email || !phone || !position) {
      return NextResponse.json(
        { error: "Name, email, phone, and position are required." },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    const created = await db.jobApplication.create({
      data: {
        fullName: applicantName,
        email,
        phone,
        position,
        experience: experience ?? null,
        message: message ?? null,
        resumeUrl: resumeUrl ?? null,
        ipAddress: clientIp,
        userAgent,
      },
    });

    // Best-effort lead notification. Never fail the request if email fails.
    sendLeadNotification("career", {
      ...created,
      ipAddress: clientIp,
      userAgent,
    }).catch((e) => console.error("[Careers API] lead email failed:", e));

    return NextResponse.json({
      success: true,
      message:
        "Application received. Our HR team will review it and get back to you.",
    });
  } catch (err) {
    console.error("[Careers API] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
