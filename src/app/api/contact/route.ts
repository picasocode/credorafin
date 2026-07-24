import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
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

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    if (type === "referral-partner") {
      await db.referralPartner.create({
        data: {
          name,
          email: email ?? null,
          phone,
          businessName: businessName ?? null,
          businessType: businessType ?? null,
          city: city ?? null,
          referralSource: referralSource ?? null,
          message: message ?? null,
          ipAddress: ip,
          userAgent,
        },
      });

      return NextResponse.json({
        success: true,
        message:
          "Application received. Our partner team will contact you within 1 business day.",
      });
    }

    // Default: contact inquiry
    await db.contactInquiry.create({
      data: {
        name,
        email: email ?? null,
        phone,
        businessName: businessName ?? null,
        businessType: businessType ?? null,
        fundingRequirement: fundingRequirement ?? null,
        message: message ?? null,
        ipAddress: ip,
        userAgent,
      },
    });

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
