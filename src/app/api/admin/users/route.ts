import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyAdminSession, requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!requireRole(session, ["super_admin", "admin"])) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit")) || 20));

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      db.adminUser.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.adminUser.count({ where }),
    ]);

    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    console.error("[Admin Users GET]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!requireRole(session, ["super_admin"])) {
    return NextResponse.json({ error: "Only super admins can create users." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, name, password, role = "viewer" } = body;
    if (!email || !name || !password) {
      return NextResponse.json({ error: "email, name, and password are required." }, { status: 400 });
    }
    const validRoles = ["super_admin", "admin", "viewer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const existing = await db.adminUser.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already in use." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const data = await db.adminUser.create({
      data: { email, name, role, passwordHash },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Users POST]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!requireRole(session, ["super_admin"])) {
    return NextResponse.json({ error: "Only super admins can update users." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, email, name, role, password } = body;
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });

    const updates: Record<string, unknown> = {};
    if (email !== undefined) updates.email = email;
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (password) updates.passwordHash = await bcrypt.hash(password, 12);

    if (Object.keys(updates).length === 0)
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });

    const data = await db.adminUser.update({
      where: { id },
      data: updates,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[Admin Users PATCH]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!requireRole(session, ["super_admin"])) {
    return NextResponse.json({ error: "Only super admins can delete users." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ids } = body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required." }, { status: 400 });
    }
    // Prevent self-deletion
    if (ids.includes(session.id)) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    const result = await db.adminUser.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (err) {
    console.error("[Admin Users DELETE]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
