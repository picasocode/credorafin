import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? "";
    const order = searchParams.get("order") ?? "desc";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 20));

    const where = search
      ? {
          OR: [
            { email: { contains: search } },
            { product: { contains: search } },
            { brochureFile: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      db.brochureDownload.findMany({
        where,
        orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.brochureDownload.count({ where }),
    ]);

    const normalized = data.map((b) => ({
      id: b.id,
      email: b.email,
      product: b.product,
      brochure_file: b.brochureFile,
      ip_address: b.ipAddress,
      user_agent: b.userAgent,
      created_at: b.createdAt,
    }));

    return NextResponse.json({ data: normalized, total, page, limit });
  } catch (err) {
    console.error("[Admin Brochures] error:", err);
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

    const result = await db.brochureDownload.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (err) {
    console.error("[Admin Brochures] DELETE error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
