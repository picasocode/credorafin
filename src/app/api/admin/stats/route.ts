import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/admin-auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const [contacts, referrals, applications, brochures] = await Promise.all([
      db.contactInquiry.findMany({ select: { status: true } }),
      db.referralPartner.findMany({ select: { status: true } }),
      db.jobApplication.findMany({ select: { status: true } }),
      db.brochureDownload.count(),
    ]);

    const buildCounts = (prefix: string, rows: { status: string }[]) => {
      const result: Record<string, number> = { [prefix]: rows.length };
      for (const row of rows) {
        const s = row.status || "unassigned";
        result[`${prefix}_${s}`] = (result[`${prefix}_${s}`] || 0) + 1;
      }
      return result;
    };

    const [recentContacts, recentReferrals, recentApps, recentBrochures] = await Promise.all([
      db.contactInquiry.findMany({
        select: { id: true, name: true, email: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.referralPartner.findMany({
        select: { id: true, name: true, email: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.jobApplication.findMany({
        select: { id: true, fullName: true, email: true, position: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.brochureDownload.findMany({
        select: { id: true, email: true, product: true, brochureFile: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const recent = [
      ...recentContacts.map((r) => ({ ...r, type: "Contact", created_at: r.createdAt })),
      ...recentReferrals.map((r) => ({ ...r, type: "Referral", created_at: r.createdAt })),
      ...recentApps.map((r) => ({ ...r, name: r.fullName, type: "Application", created_at: r.createdAt })),
      ...recentBrochures.map((r) => ({
        ...r,
        name: r.email,
        status: null,
        type: "Brochure",
        created_at: r.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 15);

    return NextResponse.json({
      ...buildCounts("contacts", contacts),
      ...buildCounts("referrals", referrals),
      ...buildCounts("applications", applications),
      brochures,
      recent,
    });
  } catch (err) {
    console.error("[Admin Stats] error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
