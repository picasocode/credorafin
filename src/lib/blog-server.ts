/**
 * Server-side blog data accessor.
 *
 * Reads posts from the BlogPost table (Prisma) and falls back to the
 * static defaults in blog-data.ts if the DB is empty or unavailable.
 *
 * Used by server components / routes only (sitemap.ts, blog/[id]/layout.tsx).
 * Client components fetch via the /api/blog-posts REST endpoints.
 */
import { db } from "@/lib/db";
import { blogPosts, type BlogPost } from "@/lib/blog-data";

/** Convert a Prisma BlogPost row to the public BlogPost shape. */
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
}): BlogPost {
  let content: string[] = [];
  let tags: string[] = [];
  try {
    content = JSON.parse(row.content || "[]");
  } catch {
    content = [];
  }
  try {
    tags = JSON.parse(row.tags || "[]");
  } catch {
    tags = [];
  }
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

/** All active posts, newest first. Falls back to defaults if DB empty. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await db.blogPost.findMany({
      where: { isActive: true },
      orderBy: { date: "desc" },
    });
    if (rows.length === 0) {
      return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return rows.map(parseRow);
  } catch {
    return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
  }
}

/** A single active post by slug. Falls back to defaults if DB unavailable. */
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const row = await db.blogPost.findUnique({ where: { id } });
    if (row && row.isActive) return parseRow(row);
    // Fallback to defaults if not in DB (e.g. before seeding).
    return blogPosts.find((p) => p.id === id) ?? null;
  } catch {
    return blogPosts.find((p) => p.id === id) ?? null;
  }
}
