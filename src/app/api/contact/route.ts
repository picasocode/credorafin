import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, businessName, businessType, fundingRequirement, phone, email, message } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Name, phone, and email are required." },
        { status: 400 }
      );
    }

    // In production, this would send to a CRM or email service
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

    return NextResponse.json({ success: true, message: "Inquiry received. We will contact you within 1 business day." });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
