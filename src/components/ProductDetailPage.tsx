"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Building2,
  Link2,
  Globe,
  HardHat,
  Puzzle,
  X,
  CheckCircle2,
  Download,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { products, type ProductData } from "@/lib/data";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  SmoothReveal,
} from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Link2,
  Globe,
  HardHat,
  Puzzle,
};

interface ProductDetailPageProps {
  product: ProductData;
  otherProducts: ProductData[];
}

export default function ProductDetailPage({
  product,
  otherProducts,
}: ProductDetailPageProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const IconComponent = iconMap[product.icon];

  // Map product slug to hero image key
  const heroImageKey =
    product.slug === "supply-chain-finance"
      ? "scf"
      : product.slug === "cross-border-finance"
        ? "crossborder"
        : product.slug === "project-finance"
          ? "project"
          : product.slug === "msme-loans"
            ? "msme"
            : "advisory";

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address to download the brochure.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product: product.title,
          brochureFile: product.brochureFile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      toast({
        title: "Brochure download started!",
        description: data.message || "Check your email for a copy.",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description:
          err instanceof Error ? err.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ─── 1. Page Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Color accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: product.color }}
        />

        {/* Hero image strip */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image
            src={`/images/products/${heroImageKey}-indian.png`}
            alt={product.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F0F4FF]/50 to-[#F0F4FF]" />
        </div>

        <div className="bg-[#F0F4FF] py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionReveal>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-8">
                <Link
                  href="/"
                  className="hover:text-[#304AC0] transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link
                  href="/products"
                  className="hover:text-[#304AC0] transition-colors"
                >
                  Products
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#1C1D62] font-medium">
                  {product.title}
                </span>
              </nav>

              {/* Icon + Heading */}
              <div className="flex items-start gap-5 mb-6">
                {IconComponent && (
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${product.color}12` }}
                  >
                    <IconComponent
                      className="w-7 h-7"
                      style={{ color: product.color }}
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
                    {product.title}
                  </h1>
                  <p
                    className="mt-2 text-lg sm:text-xl font-medium"
                    style={{ color: product.color }}
                  >
                    {product.shortDesc}
                  </p>
                </div>
              </div>

              {/* Full Description */}
              <p className="text-[#2D3748] leading-relaxed max-w-3xl text-base sm:text-lg">
                {product.fullDesc}
              </p>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ─── 2. Sub-Products Grid ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
              What&apos;s Included
            </h2>
          </SectionReveal>

          <StaggerContainer
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            staggerDelay={0.08}
          >
            {product.products.map((item, idx) => (
              <StaggerItem key={idx}>
                <HoverCard className="h-full">
                  <div
                    className="h-full bg-white rounded-xl border-2 border-[#E8ECF0] p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-lg group"
                    style={{
                      transitionProperty: "border-color, box-shadow, transform",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        product.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#E8ECF0";
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Colored dot indicator */}
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: product.color }}
                      />
                      <div>
                        <h3 className="text-[15px] sm:text-base font-semibold text-[#1C1D62] mb-2 group-hover:text-[#304AC0] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-[#718096] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 3. Key Benefits (SmoothReveal) ─── */}
      {product.benefits.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F0F4FF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SmoothReveal>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
                Key Benefits
              </h2>
            </SmoothReveal>

            <SmoothReveal delay={0.1}>
              <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
                {product.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-white rounded-xl border border-[#E8ECF0] p-4 sm:p-5 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#87B73C] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2D3748] text-sm sm:text-base leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </SmoothReveal>
          </div>
        </section>
      )}

      {/* ─── 4. Brochure Download Section (SmoothReveal) ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SmoothReveal>
            <div
              className="rounded-2xl border-2 p-8 sm:p-10 md:p-12 text-center"
              style={{ borderColor: `${product.color}30` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: `${product.color}12` }}
              >
                <Download
                  className="w-7 h-7"
                  style={{ color: product.color }}
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-3">
                Download {product.title} Brochure
              </h2>
              <p className="text-[#718096] mb-8 max-w-lg mx-auto">
                Enter your email address to receive our detailed brochure with
                product information, eligibility criteria, and more.
              </p>

              {success ? (
                <div className="flex items-center justify-center gap-3 text-[#87B73C]">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-lg font-medium">
                    Brochure sent! Check your inbox.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleBrochureSubmit}
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-11 bg-white"
                    disabled={loading}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 px-6 text-white font-medium text-sm uppercase tracking-wider rounded-md whitespace-nowrap"
                    style={{ backgroundColor: product.color }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </SmoothReveal>
        </div>
      </section>

      {/* ─── 5. Related Products ─── */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
              Other Products
            </h2>
          </SectionReveal>

          <StaggerContainer
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            staggerDelay={0.08}
          >
            {otherProducts.map((op) => {
              const OpIcon = iconMap[op.icon];
              return (
                <StaggerItem key={op.slug}>
                  <HoverCard className="h-full">
                    <Link
                      href={`/products/${op.slug}`}
                      className="group block h-full bg-white rounded-xl border-2 border-[#E8ECF0] p-5 shadow-sm hover:shadow-lg transition-all duration-300"
                      style={{
                        transitionProperty: "border-color, box-shadow, transform",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          op.color;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#E8ECF0";
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {OpIcon && (
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${op.color}12` }}
                          >
                            <OpIcon
                              className="w-4.5 h-4.5"
                              style={{ color: op.color }}
                            />
                          </div>
                        )}
                        <span
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: op.color }}
                        >
                          {op.products.length} Product
                          {op.products.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[#1C1D62] mb-1 group-hover:text-[#304AC0] transition-colors">
                        {op.title}
                      </h3>
                      <p className="text-sm text-[#718096] leading-relaxed line-clamp-2">
                        {op.shortDesc}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-sm font-semibold" style={{ color: op.color }}>
                        <span className="uppercase tracking-wider text-xs">
                          Learn More
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </Link>
                  </HoverCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 6. CTA with Office India background ─── */}
      <section className="py-16 md:py-20 bg-[#1C1D62] relative overflow-hidden">
        {/* Subtle background image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/pages/office-india.png"
            alt=""
            fill
            className="object-cover opacity-[0.08]"
            sizes="100vw"
            aria-hidden="true"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <SectionReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
              Get Started with {product.title}
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Our advisors can help you find the right funding solution tailored
              to your business needs.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-[#87B73C] hover:bg-[#6d9a2e] text-white font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md group"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </SectionReveal>
        </div>
      </section>
    </motion.div>
  );
}
