/**
 * Public blog posts list endpoint.
 *
 * GET /api/blog-posts → { data: BlogPost[], categories: {label,value}[] }
 *   Returns all active posts, newest first. Categories are derived
 *   dynamically from the active posts (with the static fallback list
 *   merged in so the filter UI always shows the standard set).
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, categories as defaultCategories } from "@/lib/blog-data";

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

export async function GET() {
  try {
    const rows = await db.blogPost.findMany({
      where: { isActive: true },
      orderBy: { date: "desc" },
    });

    let data: PublicBlogPost[];
    if (rows.length === 0) {
      // Fallback to static defaults (e.g. before seeding).
      data = blogPosts.map((p) => ({ ...p, featured: !!p.featured }));
    } else {
      data = rows.map(parseRow);
    }

    // Build categories: union of default list + any new categories in DB.
    const seen = new Set(defaultCategories.map((c) => c.value));
    const cats = [...defaultCategories];
    for (const p of data) {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        cats.push({ label: p.category, value: p.category });
      }
    }

    return NextResponse.json({ data, categories: cats });
  } catch (err) {
    console.error("[BlogPosts GET]", err);
    // Graceful fallback so the blog page never renders empty.
    return NextResponse.json({
      data: blogPosts.map((p) => ({ ...p, featured: !!p.featured })),
      categories: defaultCategories,
    });
  }
}
