/**
 * Admin job positions CRUD endpoint.
 *
 * GET    — list all positions (including inactive)
 * POST   — create a new position
 * PATCH  — update an existing position
 * DELETE — delete positions by ids
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession, requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? "";
    const order = searchParams.get("order") ?? "desc";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 50));

    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { department: { contains: search } },
            { location: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      db.jobPosition.findMany({
        where,
        orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.jobPosition.count({ where }),
    ]);

    const normalized = data.map((p) => ({
      id: p.id,
      title: p.title,
      department: p.department,
      location: p.location,
      type: p.type,
      experience: p.experience,
      salary: p.salary,
      color: p.color,
      description: p.description,
      skills: JSON.parse(p.skills || "[]"),
      is_active: p.isActive,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    }));

    return NextResponse.json({ data: normalized, total, page, limit });
  } catch (err) {
    console.error("[Admin Positions GET]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!requireRole(session, ["super_admin", "admin"])) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, department, location, type, experience, salary, color, description, skills, is_active } = body;

    if (!title || !department || !location) {
      return NextResponse.json({ error: "title, department, and location are required." }, { status: 400 });
    }

    const data = await db.jobPosition.create({
      data: {
        title,
        department,
        location,
        type: type || "Full-time",
        experience: experience || "",
        salary: salary || "",
        color: color || "#304AC0",
        description: description || "",
        skills: JSON.stringify(skills || []),
        isActive: is_active !== undefined ? is_active : true,
      },
    });

    return NextResponse.json({
      data: { ...data, skills: JSON.parse(data.skills || "[]"), is_active: data.isActive },
    }, { status: 201 });
  } catch (err) {
    console.error("[Admin Positions POST]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!requireRole(session, ["super_admin", "admin"])) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, title, department, location, type, experience, salary, color, description, skills, is_active } = body;

    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (department !== undefined) updates.department = department;
    if (location !== undefined) updates.location = location;
    if (type !== undefined) updates.type = type;
    if (experience !== undefined) updates.experience = experience;
    if (salary !== undefined) updates.salary = salary;
    if (color !== undefined) updates.color = color;
    if (description !== undefined) updates.description = description;
    if (skills !== undefined) updates.skills = JSON.stringify(skills);
    if (is_active !== undefined) updates.isActive = is_active;

    if (Object.keys(updates).length === 0)
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });

    const data = await db.jobPosition.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({
      data: { ...data, skills: JSON.parse(data.skills || "[]"), is_active: data.isActive },
    });
  } catch (err) {
    console.error("[Admin Positions PATCH]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!requireRole(session, ["super_admin", "admin"])) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ids } = body;
    if (!ids || !Array.isArray(ids) || ids.length === 0)
      return NextResponse.json({ error: "ids array is required." }, { status: 400 });

    const result = await db.jobPosition.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (err) {
    console.error("[Admin Positions DELETE]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
