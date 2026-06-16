import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    // In production, this would:
    // 1. Send the brochure PDF via transactional email (SendGrid/Resend)
    // 2. Capture the lead in CRM
    // 3. Trigger the browser download via a redirect or signed URL

    console.log("=== BROCHURE DOWNLOAD REQUEST ===");
    console.log("Email:", email);
    console.log("Product:", product);
    console.log("Brochure File:", brochureFile);
    console.log("Timestamp:", new Date().toISOString());
    console.log("=================================");

    return NextResponse.json({
      success: true,
      message: "Your brochure is downloading. We've also sent a copy to your email.",
      downloadUrl: `/brochures/${brochureFile}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
