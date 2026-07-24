/**
 * Auto-generated sitemap.xml — served at /sitemap.xml
 *
 * Next.js App Router convention. Returns a MetadataRoute.Sitemap array.
 * Static pages sourced from NAV_ENTRIES in src/lib/seo.ts; blog posts
 * sourced from the BlogPost table via getAllBlogPosts() with a
 * fallback to the static defaults in blog-data.ts.
 */

import type { MetadataRoute } from "next";
import { NAV_ENTRIES, SITE } from "@/lib/seo";
import { getAllBlogPosts } from "@/lib/blog-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages from NAV_ENTRIES
  const staticEntries: MetadataRoute.Sitemap = NAV_ENTRIES.map((entry) => ({
    url: `${SITE.url}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  // Blog post entries (DB-backed with static fallback)
  const posts = await getAllBlogPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
