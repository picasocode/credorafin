/**
 * Public single blog post endpoint.
 *
 * GET /api/blog-posts/[id] → { data: BlogPost } | 404
 *   Returns one active post by slug. Falls back to static defaults if the
 *   DB is unavailable.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/blog-data";

interface PublicBlogPost {
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
}): PublicBlogPost {
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
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const row = await db.blogPost.findUnique({ where: { id } });
    if (row && row.isActive) {
      return NextResponse.json({ data: parseRow(row) });
    }
    // Fallback to static defaults.
    const fallback = blogPosts.find((p) => p.id === id);
    if (fallback) {
      return NextResponse.json({ data: { ...fallback, featured: !!fallback.featured } });
    }
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  } catch (err) {
    console.error("[BlogPost GET]", err);
    const fallback = blogPosts.find((p) => p.id === id);
    if (fallback) {
      return NextResponse.json({ data: { ...fallback, featured: !!fallback.featured } });
    }
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
}
