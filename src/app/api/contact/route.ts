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
    const {
      type,
      name,
      businessName,
      businessType,
      fundingRequirement,
      phone,
      email,
      city,
      referralSource,
      message,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    if (type === "referral-partner") {
      const created = await db.referralPartner.create({
        data: {
          name,
          email: email ?? null,
          phone,
          businessName: businessName ?? null,
          businessType: businessType ?? null,
          city: city ?? null,
          referralSource: referralSource ?? null,
          message: message ?? null,
          ipAddress: clientIp,
          userAgent,
        },
      });

      // Best-effort lead notification. Never fail the request if email fails.
      sendLeadNotification("referral-partner", {
        ...created,
        ipAddress: clientIp,
        userAgent,
      }).catch((e) => console.error("[Contact API] lead email failed:", e));

      return NextResponse.json({
        success: true,
        message:
          "Application received. Our partner team will contact you within 1 business day.",
      });
    }

    // Default: contact inquiry
    const created = await db.contactInquiry.create({
      data: {
        name,
        email: email ?? null,
        phone,
        businessName: businessName ?? null,
        businessType: businessType ?? null,
        fundingRequirement: fundingRequirement ?? null,
        message: message ?? null,
        ipAddress: clientIp,
        userAgent,
      },
    });

    // Best-effort lead notification. Never fail the request if email fails.
    sendLeadNotification("contact", {
      ...created,
      ipAddress: clientIp,
      userAgent,
    }).catch((e) => console.error("[Contact API] lead email failed:", e));

    return NextResponse.json({
      success: true,
      message: "Inquiry received. We will contact you within 1 business day.",
    });
  } catch (err) {
    console.error("[Contact API] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
