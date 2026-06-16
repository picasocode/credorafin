"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronRight,
  Tag,
  Share2,
  LinkIcon,
  Linkedin,
  Twitter,
  User,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SmoothReveal,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  ImageReveal,
} from "@/lib/animations";
import { blogPosts, type BlogPost } from "@/lib/blog-data";

/* ────────────────────────────────────────────
   SHARE BUTTONS
   ──────────────────────────────────────────── */

function ShareButtons({ title, id }: { title: string; id: string }) {
  const [copied, setCopied] = React.useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-[#718096] flex items-center gap-1 mr-1">
        <Share2 className="w-3.5 h-3.5" />
        Share:
      </span>
      <button
        onClick={handleCopyLink}
        className="w-8 h-8 rounded-full bg-[#F0F4FF] hover:bg-[#304AC0] text-[#304AC0] hover:text-white flex items-center justify-center transition-all duration-200"
        title="Copy link"
      >
        {copied ? <CheckCircle2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
      </button>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-[#F0F4FF] hover:bg-[#0077B5] text-[#0077B5] hover:text-white flex items-center justify-center transition-all duration-200"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-[#F0F4FF] hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white flex items-center justify-center transition-all duration-200"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>
    </div>
  );
}

/* ────────────────────────────────────────────
   RELATED ARTICLE CARD
   ──────────────────────────────────────────── */

function RelatedArticleCard({ post }: { post: BlogPost }) {
  const IconComp = post.categoryIcon;
  return (
    <StaggerItem>
      <Link
        href={`/blog/${post.id}`}
        className="group bg-white rounded-xl border border-[#E8ECF0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
      >
        {/* Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: post.color }}
          />
        </div>

        <div className="p-4 flex flex-col flex-1">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: post.color }}
          >
            <IconComp className="w-3 h-3" />
            {post.category}
          </span>
          <h4 className="text-sm font-semibold text-[#1C1D62] leading-snug mb-2 group-hover:text-[#304AC0] transition-colors duration-300 line-clamp-2">
            {post.title}
          </h4>
          <div className="mt-auto flex items-center gap-1.5 text-[10px] text-[#718096]">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </div>
        </div>
      </Link>
    </StaggerItem>
  );
}

/* ────────────────────────────────────────────
   404 NOT FOUND VIEW
   ──────────────────────────────────────────── */

function BlogNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen className="w-16 h-16 text-[#E8ECF0] mx-auto mb-4" />
          <h1 className="text-3xl font-semibold text-[#1C1D62] mb-3">
            Article Not Found
          </h1>
          <p className="text-[#718096] mb-6 max-w-md mx-auto">
            The blog post you are looking for may have been moved or does not exist.
            Browse our latest articles to find what you need.
          </p>
          <Link href="/blog">
            <Button className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-6 py-3 rounded-md">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   BLOG DETAIL PAGE
   ──────────────────────────────────────────── */

export default function BlogDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const post = blogPosts.find((p) => p.id === postId);

  if (!post) {
    return <BlogNotFound />;
  }

  const IconComp = post.categoryIcon;

  // Get related posts: same category first, then fill with others
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => {
      const aMatch = a.category === post.category ? 0 : 1;
      const bMatch = b.category === post.category ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 3);

  const formattedDate = new Date(post.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1D62] via-[#13277E] to-[#304AC0] pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#87B73C]/[0.05] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-1 text-xs text-white/40 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-white/70 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70 truncate max-w-[200px] sm:max-w-none">
              {post.title}
            </span>
          </motion.nav>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/10 mb-4"
            >
              <IconComp className="w-3.5 h-3.5" />
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {post.title}
          </motion.h1>

          {/* Meta Row */}
          <motion.div
            className="flex flex-wrap items-center gap-4 text-sm text-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="relative -mt-8 md:-mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ImageReveal>
            <div className="relative w-full aspect-[16/8] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          </ImageReveal>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <article className="flex-1 min-w-0">
              <SmoothReveal>
                {/* Back to Blog */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm text-[#304AC0] font-medium hover:text-[#13277E] transition-colors mb-8 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to Blog
                </Link>
              </SmoothReveal>

              {/* Article Body */}
              <SmoothReveal delay={0.1}>
                <div className="prose-custom">
                  {post.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base sm:text-lg text-[#2D3748] leading-relaxed mb-6"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </SmoothReveal>

              {/* Tags */}
              <SmoothReveal delay={0.2}>
                <div className="mt-10 pt-8 border-t border-[#E8ECF0]">
                  <h3 className="text-sm font-semibold text-[#1C1D62] mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#304AC0]" />
                    Related Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#304AC0] hover:bg-[#304AC0] hover:text-white transition-colors duration-200 cursor-default"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </SmoothReveal>

              {/* Share Section */}
              <SmoothReveal delay={0.3}>
                <div className="mt-8 pt-8 border-t border-[#E8ECF0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <ShareButtons title={post.title} id={post.id} />
                </div>
              </SmoothReveal>
            </article>

            {/* Sidebar (desktop only) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-6">
                {/* Post Info Card */}
                <motion.div
                  className="bg-[#F7F9FC] rounded-xl p-5 border border-[#E8ECF0]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1C1D62] mb-4">
                    Article Info
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-[#718096]">
                      <User className="w-4 h-4 text-[#304AC0]" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#718096]">
                      <Calendar className="w-4 h-4 text-[#304AC0]" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#718096]">
                      <Clock className="w-4 h-4 text-[#304AC0]" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#E8ECF0]">
                    <ShareButtons title={post.title} id={post.id} />
                  </div>
                </motion.div>

                {/* CTA Card */}
                <motion.div
                  className="bg-gradient-to-br from-[#1C1D62] to-[#13277E] rounded-xl p-5 text-white"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h4 className="text-sm font-semibold mb-2">
                    Need Financial Guidance?
                  </h4>
                  <p className="text-xs text-white/70 mb-4 leading-relaxed">
                    Get a free credit assessment and personalised funding strategy.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-[#304AC0] hover:bg-[#87B73C] text-white text-xs uppercase tracking-wider font-medium py-2.5 transition-colors duration-300">
                      Get Free Consultation
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Author Bio Card */}
      <section className="py-10 bg-[#F7F9FC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="bg-white rounded-2xl border border-[#E8ECF0] p-6 md:p-8 flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#304AC0] to-[#13277E] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">C</span>
                </div>
              </div>
              {/* Bio */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1C1D62] mb-1">
                  {post.author}
                </h3>
                <p className="text-xs text-[#304AC0] font-medium uppercase tracking-wider mb-3">
                  Financial Advisory Experts
                </p>
                <p className="text-sm text-[#718096] leading-relaxed mb-4">
                  The Credora Advisory Team brings decades of collective experience in
                  credit management, loan structuring, and financial advisory for
                  Indian businesses. Our experts have helped over 1,200 businesses
                  secure funding worth ₹500+ crore through disciplined pre-underwriting
                  and strategic lender matching.
                </p>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-[#304AC0] text-[#304AC0] hover:bg-[#304AC0] hover:text-white text-xs uppercase tracking-wider font-medium"
                  >
                    Contact Our Team
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SmoothReveal className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1C1D62] flex items-center gap-2">
              <span className="w-8 h-1 bg-[#87B73C] rounded-full" />
              Related Articles
            </h2>
          </SmoothReveal>

          <StaggerContainer
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.1}
          >
            {relatedPosts.map((relatedPost) => (
              <RelatedArticleCard key={relatedPost.id} post={relatedPost} />
            ))}
          </StaggerContainer>

          <SmoothReveal className="mt-10 text-center">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-[#304AC0] text-[#304AC0] hover:bg-[#304AC0] hover:text-white text-sm uppercase tracking-wider font-medium px-8"
              >
                View All Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </SmoothReveal>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-16 md:py-20 bg-[#1C1D62] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-64 h-64 bg-[#304AC0]/10 rounded-full -translate-y-1/2" />
          <div className="absolute bottom-0 right-[15%] w-48 h-48 bg-[#87B73C]/10 rounded-full translate-y-1/2" />
        </div>
        <SmoothReveal className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
            Ready to Improve Your Credit Profile?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Get a free financial assessment and discover how Credora can help
            your business secure the funding it needs.
          </p>
          <Link href="/contact">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-[#87B73C] hover:bg-[#6A9A2C] text-white font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md shadow-xl group transition-all duration-300">
                Get Free Consultation
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </Link>
        </SmoothReveal>
      </section>
    </>
  );
}
