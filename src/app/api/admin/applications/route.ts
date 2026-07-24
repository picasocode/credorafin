import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") ?? "all";
    const position = searchParams.get("position") ?? "";
    const search = searchParams.get("search") ?? "";
    const order = searchParams.get("order") ?? "desc";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 20));

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (position) where.position = { contains: position };
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { position: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      db.jobApplication.findMany({
        where,
        orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.jobApplication.count({ where }),
    ]);

    const normalized = data.map((a) => ({
      id: a.id,
      full_name: a.fullName,
      email: a.email,
      phone: a.phone,
      position: a.position,
      experience: a.experience,
      message: a.message,
      status: a.status,
      resume_url: a.resumeUrl,
      ip_address: a.ipAddress,
      user_agent: a.userAgent,
      created_at: a.createdAt,
      updated_at: a.updatedAt,
    }));

    return NextResponse.json({ data: normalized, total, page, limit });
  } catch (err) {
    console.error("[Admin Applications] error:", err);
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

    const data = await db.jobApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      data: {
        ...data,
        full_name: data.fullName,
        resume_url: data.resumeUrl,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
      },
    });
  } catch (err) {
    console.error("[Admin Applications] PATCH error:", err);
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

    const result = await db.jobApplication.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (err) {
    console.error("[Admin Applications] DELETE error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
