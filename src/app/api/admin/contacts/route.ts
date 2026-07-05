import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") ?? "all";
    const search = searchParams.get("search") ?? "";
    const order = searchParams.get("order") ?? "desc";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 20));

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { businessName: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      db.contactInquiry.findMany({
        where,
        orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.contactInquiry.count({ where }),
    ]);

    // Normalize field names for the admin dashboard (snake_case → snake_case already matches)
    const normalized = data.map((c) => ({
      id: c.id,
      name: c.name,
      business_name: c.businessName,
      business_type: c.businessType,
      funding_requirement: c.fundingRequirement,
      phone: c.phone,
      email: c.email,
      message: c.message,
      status: c.status,
      ip_address: c.ipAddress,
      user_agent: c.userAgent,
      created_at: c.createdAt,
      updated_at: c.updatedAt,
    }));

    return NextResponse.json({ data: normalized, total, page, limit });
  } catch (err) {
    console.error("[Admin Contacts] error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
    if (!status) return NextResponse.json({ error: "No fields to update." }, { status: 400 });

    const data = await db.contactInquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      data: {
        ...data,
        business_name: data.businessName,
        business_type: data.businessType,
        funding_requirement: data.fundingRequirement,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
      },
    });
  } catch (err) {
    console.error("[Admin Contacts] PATCH error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const { ids } = body;
    if (!ids || !Array.isArray(ids) || ids.length === 0)
      return NextResponse.json({ error: "ids array is required." }, { status: 400 });

    const result = await db.contactInquiry.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (err) {
    console.error("[Admin Contacts] DELETE error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
