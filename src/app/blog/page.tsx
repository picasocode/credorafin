"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Tag,
  Search,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  StaggerContainer,
  StaggerItem,
  SmoothReveal,
} from "@/lib/animations";
import { blogPosts, categories, type BlogPost } from "@/lib/blog-data";

/* ────────────────────────────────────────────
   BLOG POST CARD
   ──────────────────────────────────────────── */

function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const IconComp = post.categoryIcon;
  return (
    <StaggerItem>
      <motion.div
        className="h-full"
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link
          href={`/blog/${post.id}`}
          className="group relative bg-white rounded-2xl border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden"
        >
          {/* Image Section */}
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Category color strip overlay at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: post.color }}
            />
          </div>

          <div className="p-6 flex flex-col flex-1">
            {/* Category + Read Time */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ color: post.color, backgroundColor: `${post.color}10` }}
              >
                <IconComp className="w-3 h-3" />
                {post.category}
              </span>
              <span className="text-[10px] text-[#718096] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-[#1C1D62] mb-3 group-hover:text-[#304AC0] transition-colors duration-300 leading-snug">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-[#718096] leading-relaxed flex-1">
              {post.excerpt}
            </p>

            {/* Meta + Read More */}
            <div className="mt-4 pt-4 border-t border-[#E8ECF0] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#718096]">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <span
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: post.color }}
              >
                Read More
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </StaggerItem>
  );
}

/* ────────────────────────────────────────────
   FEATURED POST CARD (Horizontal layout)
   ──────────────────────────────────────────── */

function FeaturedPostCard({ post }: { post: BlogPost }) {
  const IconComp = post.categoryIcon;
  return (
    <motion.article
      className="bg-white rounded-2xl border border-[#E8ECF0] shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/blog/${post.id}`} className="group flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-2/5 aspect-[16/9] md:aspect-auto md:min-h-[280px] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1.5 md:bottom-0 md:left-0 md:top-0 md:w-1.5 md:h-full"
            style={{ backgroundColor: post.color }}
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{ color: post.color, backgroundColor: `${post.color}10` }}
            >
              <IconComp className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <span className="text-xs text-[#718096] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
            <span className="text-xs text-[#718096] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] leading-snug mb-3 group-hover:text-[#304AC0] transition-colors duration-300">
            {post.title}
          </h2>

          <p className="text-sm text-[#718096] leading-relaxed mb-4">
            {post.excerpt}
          </p>

          <span
            className="text-sm font-medium flex items-center gap-2"
            style={{ color: post.color }}
          >
            Read Article
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

/* ────────────────────────────────────────────
   MAIN BLOG PAGE
   ──────────────────────────────────────────── */

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1D62] via-[#13277E] to-[#304AC0] py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#87B73C]/[0.05] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 text-[#87B73C] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              Insights & Resources
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, type: "spring", stiffness: 80 }}
          >
            Credora Blog
          </motion.h1>

          <motion.p
            className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 80 }}
          >
            Expert insights on credit management, loan structuring, and funding
            strategies to help your business grow.
          </motion.p>

          {/* Breadcrumb */}
          <motion.div
            className="flex items-center justify-center gap-1 text-xs text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Blog</span>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-8 bg-[#F7F9FC] border-b border-[#E8ECF0] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                    activeCategory === cat.value
                      ? "bg-[#304AC0] text-white border-[#304AC0] shadow-md"
                      : "bg-white text-[#718096] border-[#E8ECF0] hover:border-[#304AC0]/30 hover:text-[#304AC0]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-white border-[#E8ECF0] rounded-lg focus:border-[#304AC0] focus:ring-[#304AC0]/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {activeCategory === "all" && searchQuery === "" && (
        <section className="py-12 md:py-16 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SmoothReveal className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1C1D62] flex items-center gap-2">
                <span className="w-8 h-1 bg-[#87B73C] rounded-full" />
                Featured Articles
              </h2>
            </SmoothReveal>
            <div className="space-y-6">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SmoothReveal className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1C1D62] flex items-center gap-2">
              <span className="w-8 h-1 bg-[#304AC0] rounded-full" />
              {activeCategory === "all" ? "All Articles" : activeCategory}
              <span className="text-sm font-normal text-[#718096] ml-2">
                ({filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"})
              </span>
            </h2>
          </SmoothReveal>

          {filteredPosts.length > 0 ? (
            <StaggerContainer
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.1}
            >
              {filteredPosts.map((post, i) => (
                <BlogPostCard key={post.id} post={post} index={i} />
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-[#E8ECF0] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1C1D62] mb-2">
                No articles found
              </h3>
              <p className="text-sm text-[#718096] mb-4">
                Try adjusting your search or category filter.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="border-[#304AC0] text-[#304AC0] hover:bg-[#304AC0] hover:text-white text-xs"
              >
                Clear Filters
              </Button>
            </div>
          )}
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
            Stay Informed, Stay Ahead
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Get expert insights on credit management and funding strategies
            delivered to your inbox. Contact us for a free financial assessment.
          </p>
          <Link href="/contact">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md shadow-xl group transition-all duration-300">
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
