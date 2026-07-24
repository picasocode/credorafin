/**
 * Public hero slides endpoint.
 *
 * GET /api/hero-slides → { data: HeroSlide[] }
 *   Returns all active slides ordered by sortOrder asc, then createdAt.
 *   Response shape is tailored for the Hero component (grouped HUD fields,
 *   parsed headingWords array).
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export interface PublicHeroSlide {
  id: string;
  badge: string;
  headingWords: string[];
  subtitle: string;
  cta1: string;
  cta2: string;
  image: string;
  fallbackImage: string;
  hudLeft: { metric: string; label: string; status: string };
  hudRight: { metric: string; label: string; trend: string };
  hudGraph: { value: string; label: string };
  tabLabel: string;
  tabIcon: string;
  accent: string;
  isActive: boolean;
  sortOrder: number;
}

function parse(row: {
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
}): PublicHeroSlide {
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
    hudLeft: { metric: row.hudLeftMetric, label: row.hudLeftLabel, status: row.hudLeftStatus },
    hudRight: { metric: row.hudRightMetric, label: row.hudRightLabel, trend: row.hudRightTrend },
    hudGraph: { value: row.hudGraphValue, label: row.hudGraphLabel },
    tabLabel: row.tabLabel,
    tabIcon: row.tabIcon,
    accent: row.accent,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

export async function GET() {
  try {
    const rows = await db.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ data: rows.map(parse) });
  } catch (err) {
    console.error("[HeroSlides GET]", err);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
