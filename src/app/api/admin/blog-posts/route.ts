/**
 * Admin blog posts CRUD endpoint.
 *
 * GET    — list ALL posts (including inactive), newest first
 * POST   — create a new post (id = slug, must be unique)
 * PATCH  — update an existing post (by id); supports toggling isActive
 * DELETE — delete posts by ids
 *
 * Auth: any logged-in admin can read; only super_admin / admin can write.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession, requireRole } from "@/lib/admin-auth";

interface AdminBlogPost {
  id: string;
  category: string;
  categoryIcon: string;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  readTime: string;
  color: string;
  featured: boolean;
  tags: string[];
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function parseRow(row: {
  id: string;
  category: string;
  categoryIcon: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  color: string;
  featured: boolean;
  tags: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AdminBlogPost {
  let content: string[] = [];
  let tags: string[] = [];
  try {
    const c = JSON.parse(row.content || "[]");
    if (Array.isArray(c)) content = c.map(String);
  } catch { /* empty */ }
  try {
    const t = JSON.parse(row.tags || "[]");
    if (Array.isArray(t)) tags = t.map(String);
  } catch { /* empty */ }
  return {
    id: row.id,
    category: row.category,
    categoryIcon: row.categoryIcon,
    title: row.title,
    excerpt: row.excerpt,
    content,
    author: row.author,
    date: row.date,
    readTime: row.readTime,
    color: row.color,
    featured: row.featured,
    tags,
    image: row.image,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? "";
    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { category: { contains: search } },
            { excerpt: { contains: search } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      db.blogPost.findMany({ where, orderBy: { date: "desc" } }),
      db.blogPost.count({ where }),
    ]);
    return NextResponse.json({ data: rows.map(parseRow), total });
  } catch (err) {
    console.error("[Admin BlogPosts GET]", err);
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
      id, category, categoryIcon, title, excerpt, content, author,
      date, readTime, color, featured, tags, image, isActive,
    } = body;

    if (!title || !category || !excerpt || !image) {
      return NextResponse.json(
        { error: "title, category, excerpt, and image are required." },
        { status: 400 }
      );
    }

    // Slug: use provided id (slugified) or derive from title.
    const slug = slugify(id || title);
    if (!slug) {
      return NextResponse.json({ error: "A valid slug is required." }, { status: 400 });
    }

    const existing = await db.blogPost.findUnique({ where: { id: slug } });
    if (existing) {
      return NextResponse.json({ error: "A post with that slug already exists." }, { status: 409 });
    }

    const contentArr = Array.isArray(content) ? content.map(String) : [];
    const tagsArr = Array.isArray(tags) ? tags.map(String) : [];

    const row = await db.blogPost.create({
      data: {
        id: slug,
        category,
        categoryIcon: categoryIcon || "FileText",
        title,
        excerpt,
        content: JSON.stringify(contentArr),
        author: author || "Credora Advisory Team",
        date: date || new Date().toISOString().slice(0, 10),
        readTime: readTime || "5 min read",
        color: color || "#304AC0",
        featured: !!featured,
        tags: JSON.stringify(tagsArr),
        image,
        isActive: isActive !== undefined ? !!isActive : true,
      },
    });

    return NextResponse.json({ data: parseRow(row) }, { status: 201 });
  } catch (err) {
    console.error("[Admin BlogPosts POST]", err);
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
    const { id, content, tags, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });

    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) updates[k] = v;
    }
    if (content !== undefined) {
      updates.content = JSON.stringify(Array.isArray(content) ? content.map(String) : []);
    }
    if (tags !== undefined) {
      updates.tags = JSON.stringify(Array.isArray(tags) ? tags.map(String) : []);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const row = await db.blogPost.update({ where: { id }, data: updates });
    return NextResponse.json({ data: parseRow(row) });
  } catch (err) {
    console.error("[Admin BlogPosts PATCH]", err);
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
    const result = await db.blogPost.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (err) {
    console.error("[Admin BlogPosts DELETE]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
