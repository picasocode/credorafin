import { NextResponse } from "next/server";

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

    // In production, this would send to a CRM or email service
    if (type === "referral-partner") {
      console.log("=== REFERRAL PARTNER APPLICATION ===");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone);
      console.log("Business Type:", businessType || "N/A");
      console.log("Company / Firm Name:", businessName || "N/A");
      console.log("City:", city || "N/A");
      console.log("Referral Source:", referralSource || "N/A");
      console.log("Message:", message || "N/A");
      console.log("Timestamp:", new Date().toISOString());
      console.log("====================================");
    } else {
      console.log("=== NEW CONTACT INQUIRY ===");
      console.log("Name:", name);
      console.log("Business Name:", businessName || "N/A");
      console.log("Business Type:", businessType || "N/A");
      console.log("Funding Requirement:", fundingRequirement || "N/A");
      console.log("Phone:", phone);
      console.log("Email:", email);
      console.log("Message:", message || "N/A");
      console.log("Timestamp:", new Date().toISOString());
      console.log("==========================");
    }

    return NextResponse.json({
      success: true,
      message:
        type === "referral-partner"
          ? "Application received. Our partner team will contact you within 1 business day."
          : "Inquiry received. We will contact you within 1 business day.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
