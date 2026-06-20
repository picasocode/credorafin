/**
 * Per-post metadata + JSON-LD for /blog/[id] pages.
 *
 * This is a server component (no "use client"). Next.js App Router
 * allows both layout.tsx and page.tsx in the same directory; the page
 * remains a client component for interactivity, while this layout
 * handles the SEO metadata + structured data injection.
 */

import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { blogPosts } from "@/lib/blog-data";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((p) => p.id === params.id);
  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const path = `/blog/${post.id}`;
  const ogImageUrl = `${SITE.url}${post.image}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author, url: SITE.url }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: SITE.localeOg,
      url: `${SITE.url}${path}`,
      siteName: SITE.name,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${SITE.twitterHandle}`,
      creator: `@${SITE.twitterHandle}`,
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default function BlogPostLayout({ params, children }: Props) {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) return <>{children}</>;

  const path = `/blog/${post.id}`;

  return (
    <>
      <JsonLd
        id={`article-${post.id}`}
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path,
            image: post.image,
            datePublished: new Date(post.date).toISOString(),
            author: post.author,
            tags: post.tags,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
        ]}
      />
      {children}
    </>
  );
}
