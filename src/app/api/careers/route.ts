import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
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

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    await db.jobApplication.create({
      data: {
        fullName: applicantName,
        email,
        phone,
        position,
        experience: experience ?? null,
        message: message ?? null,
        resumeUrl: resumeUrl ?? null,
        ipAddress: ip,
        userAgent,
      },
    });

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
