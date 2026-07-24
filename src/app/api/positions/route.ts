/**
 * Public job positions endpoint.
 *
 * Returns all active job positions for display on the careers page.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const positions = await db.jobPosition.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const data = positions.map((p) => ({
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
    }));

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[Positions GET] error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
