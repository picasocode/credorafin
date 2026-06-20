/**
 * Auto-generated sitemap.xml — served at /sitemap.xml
 *
 * Next.js App Router convention. Returns a MetadataRoute.Sitemap array.
 * Sourced from NAV_ENTRIES in src/lib/seo.ts. Update that array to add
 * or remove pages.
 */

import type { MetadataRoute } from "next";
import { NAV_ENTRIES, SITE } from "@/lib/seo";
import { blogPosts } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages from NAV_ENTRIES
  const staticEntries: MetadataRoute.Sitemap = NAV_ENTRIES.map((entry) => ({
    url: `${SITE.url}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  // Blog post entries
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE.url}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
