/**
 * Admin hero slides CRUD endpoint.
 *
 * GET    — list ALL slides (including inactive), ordered by sortOrder
 * POST   — create a new slide
 * PATCH  — update an existing slide (by id); supports reordering & toggling
 * DELETE — delete slides by ids
 *
 * Auth: any logged-in admin can read; only super_admin / admin can write.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession, requireRole } from "@/lib/admin-auth";

interface AdminHeroSlide {
  id: string;
  badge: string;
  headingWords: string[];
  subtitle: string;
  cta1: string;
  cta2: string;
  image: string;
  fallbackImage: string;
  hudLeftMetric: string;
  hudLeftLabel: string;
  hudLeftStatus: string;
  hudRightMetric: string;
  hudRightLabel: string;
  hudRightTrend: string;
  hudGraphValue: string;
  hudGraphLabel: string;
  tabLabel: string;
  tabIcon: string;
  accent: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function parseRow(row: {
  id: string;
  badge: string;
  headingWords: string;
  subtitle: string;
  cta1: string;
  cta2: string;
  image: string;
  fallbackImage: string;
  hudLeftMetric: string;
  hudLeftLabel: string;
  hudLeftStatus: string;
  hudRightMetric: string;
  hudRightLabel: string;
  hudRightTrend: string;
  hudGraphValue: string;
  hudGraphLabel: string;
  tabLabel: string;
  tabIcon: string;
  accent: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}): AdminHeroSlide {
  let headingWords: string[] = [];
  try {
    const parsed = JSON.parse(row.headingWords || "[]");
    if (Array.isArray(parsed)) headingWords = parsed.map(String);
  } catch {
    headingWords = [];
  }
  return {
    id: row.id,
    badge: row.badge,
    headingWords,
    subtitle: row.subtitle,
    cta1: row.cta1,
    cta2: row.cta2,
    image: row.image,
    fallbackImage: row.fallbackImage,
    hudLeftMetric: row.hudLeftMetric,
    hudLeftLabel: row.hudLeftLabel,
    hudLeftStatus: row.hudLeftStatus,
    hudRightMetric: row.hudRightMetric,
    hudRightLabel: row.hudRightLabel,
    hudRightTrend: row.hudRightTrend,
    hudGraphValue: row.hudGraphValue,
    hudGraphLabel: row.hudGraphLabel,
    tabLabel: row.tabLabel,
    tabIcon: row.tabIcon,
    accent: row.accent,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const rows = await db.heroSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ data: rows.map(parseRow) });
  } catch (err) {
    console.error("[Admin HeroSlides GET]", err);
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
    const {
      badge, headingWords, subtitle, cta1, cta2, image, fallbackImage,
      hudLeftMetric, hudLeftLabel, hudLeftStatus,
      hudRightMetric, hudRightLabel, hudRightTrend,
      hudGraphValue, hudGraphLabel,
      tabLabel, tabIcon, accent, isActive, sortOrder,
    } = body;

    if (!badge || !subtitle || !image) {
      return NextResponse.json({ error: "badge, subtitle, and image are required." }, { status: 400 });
    }

    const words = Array.isArray(headingWords) ? headingWords.map(String) : [];
    if (words.length === 0) {
      return NextResponse.json({ error: "headingWords must be a non-empty array." }, { status: 400 });
    }

    // Determine next sort order if not provided.
    let nextOrder = typeof sortOrder === "number" ? sortOrder : 0;
    if (typeof sortOrder !== "number") {
      const max = await db.heroSlide.aggregate({ _max: { sortOrder: true } });
      nextOrder = (max._max.sortOrder ?? -1) + 1;
    }

    const row = await db.heroSlide.create({
      data: {
        badge,
        headingWords: JSON.stringify(words),
        subtitle,
        cta1: cta1 || "Build Finance",
        cta2: cta2 || "Contact us",
        image,
        fallbackImage: fallbackImage || image,
        hudLeftMetric: hudLeftMetric || "",
        hudLeftLabel: hudLeftLabel || "",
        hudLeftStatus: hudLeftStatus || "",
        hudRightMetric: hudRightMetric || "",
        hudRightLabel: hudRightLabel || "",
        hudRightTrend: hudRightTrend || "",
        hudGraphValue: hudGraphValue || "",
        hudGraphLabel: hudGraphLabel || "",
        tabLabel: tabLabel || "Slide",
        tabIcon: tabIcon || "Sparkles",
        accent: accent || "#1A2255",
        isActive: isActive !== undefined ? !!isActive : true,
        sortOrder: nextOrder,
      },
    });

    return NextResponse.json({ data: parseRow(row) }, { status: 201 });
  } catch (err) {
    console.error("[Admin HeroSlides POST]", err);
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
    const { id, headingWords, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });

    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) updates[k] = v;
    }
    if (headingWords !== undefined) {
      const words = Array.isArray(headingWords) ? headingWords.map(String) : [];
      updates.headingWords = JSON.stringify(words);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const row = await db.heroSlide.update({ where: { id }, data: updates });
    return NextResponse.json({ data: parseRow(row) });
  } catch (err) {
    console.error("[Admin HeroSlides PATCH]", err);
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
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required." }, { status: 400 });
    }
    const result = await db.heroSlide.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (err) {
    console.error("[Admin HeroSlides DELETE]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
