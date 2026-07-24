/**
 * Admin Products API
 *
 * Products are defined statically in src/lib/data.ts.
 * This API stores overrides/customizations in the database (ProductOverride table).
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/admin-auth";
import { products as staticProducts } from "@/lib/data";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const overrides = await db.productOverride.findMany();
    const overrideMap = new Map(overrides.map((o) => [o.slug, o]));

    // Get brochure files from DB so admin can see which products have uploaded brochures
    const brochureFiles = await db.brochureFile.findMany();
    const brochureMap = new Map(brochureFiles.map((b) => [b.slug, b]));

    const merged = staticProducts.map((p) => {
      const ov = overrideMap.get(p.slug);
      const bf = brochureMap.get(p.slug);
      return {
        slug: p.slug,
        title: ov?.title ?? p.title,
        short_desc: ov?.shortDesc ?? p.shortDesc,
        full_desc: ov?.fullDesc ?? p.fullDesc,
        brochure_file: ov?.brochureFile ?? p.brochureFile,
        brochure_url: ov?.brochureUrl ?? null,
        brochure_uploaded: !!bf,
        brochure_original_name: bf?.originalName ?? null,
        is_active: ov?.isActive ?? true,
        sub_product_count: p.products.length,
        color: p.color,
        updated_at: ov?.updatedAt ?? null,
        updated_by: ov?.updatedBy ?? null,
      };
    });

    return NextResponse.json({ data: merged });
  } catch (err) {
    console.error("[Admin Products GET]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const { slug, title, short_desc, full_desc, brochure_file, brochure_url, is_active } = body;

    if (!slug) return NextResponse.json({ error: "slug is required." }, { status: 400 });

    const staticProduct = staticProducts.find((p) => p.slug === slug);
    if (!staticProduct) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
      updatedBy: session.name,
    };
    if (title !== undefined) updates.title = title;
    if (short_desc !== undefined) updates.shortDesc = short_desc;
    if (full_desc !== undefined) updates.fullDesc = full_desc;
    if (brochure_file !== undefined) updates.brochureFile = brochure_file;
    if (brochure_url !== undefined) updates.brochureUrl = brochure_url;
    if (is_active !== undefined) updates.isActive = is_active;

    const data = await db.productOverride.upsert({
      where: { slug },
      create: { slug, ...updates },
      update: updates,
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[Admin Products PATCH]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
