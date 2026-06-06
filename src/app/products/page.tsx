"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, Link2, Globe, HardHat, Puzzle, ArrowRight, CheckCircle2 } from "lucide-react";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  PageTransition,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  SmoothReveal,
} from "@/lib/animations";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Link2,
  Globe,
  HardHat,
  Puzzle,
};

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// Animated counter component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

const totalSubProducts = products.reduce((acc, p) => acc + p.products.length, 0);

// Comparison data for the table
const comparisonData = [
  { feature: "Collateral", msme: "Optional (CGTMSE)", scf: "Invoice-backed", cb: "Trade docs", pf: "Project assets", spec: "Case-specific" },
  { feature: "Tenure", msme: "1–7 years", scf: "30–180 days", cb: "60–365 days", pf: "2–15 years", spec: "Varies" },
  { feature: "Typical Amount", msme: "₹5L – ₹5Cr", scf: "₹10L – ₹50Cr", cb: "₹50L – ₹100Cr", pf: "₹1Cr – ₹200Cr", spec: "Custom" },
  { feature: "Disbursal Speed", msme: "7–14 days", scf: "24–72 hrs", cb: "3–10 days", pf: "15–45 days", spec: "Case-specific" },
  { feature: "Balance Sheet Impact", msme: "On", scf: "Off-balance sheet option", cb: "On", pf: "On", spec: "Varies" },
];

export default function ProductsPage() {
  return (
    <PageTransition>
      {/* ─── Page Hero with Hexagon Grid Pattern ─── */}
      <section className="relative overflow-hidden bg-[#F0F4FF]">
        {/* Subtle Indian team background image */}
        <Image
          src="/images/pages/hero-indian-team.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.08] pointer-events-none"
          aria-hidden="true"
        />
        {/* SVG Hexagon Grid Pattern Background */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexGrid" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#1C1D62" strokeWidth="1" />
                <path d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34" fill="none" stroke="#1C1D62" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexGrid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <SmoothReveal>
            <nav className="flex items-center gap-2 text-sm text-[#718096] mb-6">
              <Link href="/" className="hover:text-[#304AC0] transition-colors">
                Home
              </Link>
              <span className="text-[#718096]">&gt;</span>
              <span className="text-[#1C1D62] font-medium">Products</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight max-w-3xl">
              Comprehensive Funding Solutions
            </h1>
            <p className="mt-5 text-[#2D3748] leading-relaxed max-w-2xl text-base sm:text-lg">
              From everyday working capital to complex cross-border and specialized finance — every product is matched to your business profile and delivered through the right lender.
            </p>
          </SmoothReveal>

          {/* Animated Stats Counter Row */}
          <SectionReveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-6 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#1C1D62] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">
                    <AnimatedCounter target={5} />
                  </div>
                  <div className="text-xs sm:text-sm text-[#718096] font-medium uppercase tracking-wider">Products</div>
                </div>
              </div>
              <div className="w-px h-12 bg-[#E8ECF0] hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#304AC0] flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">
                    <AnimatedCounter target={totalSubProducts} suffix="+" />
                  </div>
                  <div className="text-xs sm:text-sm text-[#718096] font-medium uppercase tracking-wider">Sub-Products</div>
                </div>
              </div>
              <div className="w-px h-12 bg-[#E8ECF0] hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#87B73C] flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">
                    <AnimatedCounter target={70} suffix="+" />
                  </div>
                  <div className="text-xs sm:text-sm text-[#718096] font-medium uppercase tracking-wider">Lender Network</div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── Product Cards Grid ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StaggerContainer
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.12}
          >
            {products.map((product) => {
              const IconComponent = iconMap[product.icon];
              const maxProducts = 10;
              const progress = (product.products.length / maxProducts) * 100;
              return (
                <StaggerItem key={product.slug}>
                  <HoverCard className="h-full">
                    <Link
                      href={`/products/${product.slug}`}
                      className="group flex flex-col h-full min-h-[320px] bg-white rounded-2xl border border-[#E8ECF0] shadow-sm transition-all duration-300 overflow-hidden hover:-translate-y-2"
                    >
                      {/* TOP colored accent bar */}
                      <div
                        className="h-1 w-full transition-all duration-300 group-hover:h-2"
                        style={{ backgroundColor: product.color }}
                      />

                      {/* Background pattern with product color */}
                      <div className="relative flex-1 flex flex-col">
                        <div
                          className="absolute inset-0 opacity-[0.03]"
                          style={{
                            backgroundImage: `radial-gradient(circle at 80% 20%, ${product.color} 1px, transparent 1px)`,
                            backgroundSize: "24px 24px",
                          }}
                        />

                        <div className="relative p-6 flex flex-col flex-1">
                          {/* Icon in Hexagonal Container + Products Count */}
                          <div className="flex items-start justify-between mb-5">
                            <div
                              className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                              style={{
                                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                                backgroundColor: `${product.color}15`,
                              }}
                            >
                              {IconComponent ? (
                                <IconComponent
                                  className="w-6 h-6"
                                  style={{ color: product.color }}
                                />
                              ) : (
                                <span
                                  className="text-lg font-bold"
                                  style={{ color: product.color }}
                                >
                                  {product.title.charAt(0)}
                                </span>
                              )}
                            </div>
                            <span
                              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: `${product.color}10`,
                                color: product.color,
                              }}
                            >
                              {product.products.length} Product{product.products.length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-semibold text-[#1C1D62] mb-1.5 group-hover:text-[#304AC0] transition-colors">
                            {product.title}
                          </h3>

                          {/* Short Desc */}
                          <p
                            className="text-sm font-medium mb-3"
                            style={{ color: product.color }}
                          >
                            {product.shortDesc}
                          </p>

                          {/* Full Desc (truncated) */}
                          <p className="text-sm text-[#718096] leading-relaxed mb-5 flex-1">
                            {truncateText(product.fullDesc, 140)}
                          </p>

                          {/* Products Inside count with mini progress bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-[#2D3748] uppercase tracking-wider">Products Inside</span>
                              <span className="text-xs font-bold" style={{ color: product.color }}>
                                {product.products.length}/{maxProducts}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E8ECF0] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${progress}%`, backgroundColor: product.color }}
                              />
                            </div>
                          </div>

                          {/* Benefits Count */}
                          {product.benefits.length > 0 && (
                            <div className="flex items-center gap-2 mb-5 pt-4 border-t border-[#E8ECF0]">
                              <CheckCircle2 className="w-4 h-4 text-[#87B73C] flex-shrink-0" />
                              <span className="text-sm text-[#2D3748] font-medium">
                                {product.benefits.length} Key Benefit{product.benefits.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}

                          {/* Explore Link */}
                          <div className="flex items-center justify-between">
                            <span
                              className="text-sm font-semibold uppercase tracking-wider transition-colors"
                              style={{ color: product.color }}
                            >
                              Explore Products
                            </span>
                            <ArrowRight
                              className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                              style={{ color: product.color }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </HoverCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Compare Our Products Section ─── */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-3">
                Compare Our Products
              </h2>
              <p className="text-[#718096] max-w-xl mx-auto">
                See how our product categories differ across key parameters to find the right fit for your business.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl border border-[#E8ECF0] shadow-sm overflow-hidden">
                <thead>
                  <tr className="border-b border-[#E8ECF0]">
                    <th className="text-left p-4 sm:p-5 text-sm font-semibold text-[#718096] uppercase tracking-wider bg-[#F0F4FF]">
                      Feature
                    </th>
                    {products.map((p) => (
                      <th key={p.slug} className="text-center p-4 sm:p-5">
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-8 h-8 flex items-center justify-center"
                            style={{
                              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                              backgroundColor: `${p.color}15`,
                            }}
                          >
                            {(() => {
                              const Icon = iconMap[p.icon];
                              return Icon ? <Icon className="w-3.5 h-3.5" style={{ color: p.color }} /> : null;
                            })()}
                          </div>
                          <span
                            className="text-xs sm:text-sm font-semibold"
                            style={{ color: p.color }}
                          >
                            {p.title}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr
                      key={row.feature}
                      className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFBFE]"}
                    >
                      <td className="p-4 sm:p-5 text-sm font-medium text-[#2D3748] border-r border-[#E8ECF0]">
                        {row.feature}
                      </td>
                      <td className="p-4 sm:p-5 text-sm text-[#2D3748] text-center">{row.msme}</td>
                      <td className="p-4 sm:p-5 text-sm text-[#2D3748] text-center">{row.scf}</td>
                      <td className="p-4 sm:p-5 text-sm text-[#2D3748] text-center">{row.cb}</td>
                      <td className="p-4 sm:p-5 text-sm text-[#2D3748] text-center">{row.pf}</td>
                      <td className="p-4 sm:p-5 text-sm text-[#2D3748] text-center">{row.spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── Split CTA Section ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0">
              {/* Left side */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-3">
                  Not sure which product?
                </h2>
                <p className="text-[#718096] max-w-md">
                  Our advisors can assess your business profile and recommend the most suitable funding solution for your needs.
                </p>
              </div>

              {/* Center divider */}
              <div className="hidden md:block w-px h-24 bg-[#304AC0] mx-8" />

              {/* Right side */}
              <div className="flex-shrink-0">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-[#304AC0] hover:bg-[#1C1D62] text-white font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md group"
                  >
                    Talk to an Advisor
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
}
