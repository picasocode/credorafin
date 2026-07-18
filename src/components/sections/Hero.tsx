"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  Landmark,
  Zap,
  CircleDollarSign,
  Users,
  Star,
  BadgeCheck,
  HeartHandshake,
  TrendingUp,
  FileText,
  Banknote,
  Globe,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA — Tata Capital Style Banners
   Each slide = full-width background image + text overlaid on left
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    heading: "Enrich Your Cashflow",
    subtitle: "Funding solutions for MSMEs and growing businesses — 70+ banks, one streamlined process.",
    cta: "Get Funded Now",
    ctaLink: "#contact",
    image: "/images/pages/hero-indian-team.png",
  },
  {
    id: 1,
    heading: "Precision That Gets Approved",
    subtitle: "Bank-ready applications before they reach a lender. 92% approval rate, 7–10 day disbursal.",
    cta: "Apply Now",
    ctaLink: "#contact",
    image: "/images/pages/indian-professional.png",
  },
  {
    id: 2,
    heading: "From Application To Disbursal",
    subtitle: "Credit repair, EMI structuring, documentation — we handle everything so you stay focused on growth.",
    cta: "Get Advisory",
    ctaLink: "#contact",
    image: "/images/pages/office-india.png",
  },
];

/* ─── Quick Links (Tata Capital product strip) ─── */
const quickLinks = [
  { label: "MSME Loans", icon: Building2, href: "/products/msme-loans" },
  { label: "Project Finance", icon: TrendingUp, href: "/products/project-finance" },
  { label: "Supply Chain", icon: Globe, href: "/products/supply-chain-finance" },
  { label: "Credit Repair", icon: Shield, href: "/services/credit-repair" },
  { label: "Fund Raising", icon: Banknote, href: "/services/fund-raising" },
  { label: "Pre-Underwriting", icon: FileText, href: "/services/pre-underwriting-loan-structuring" },
  { label: "End-to-End", icon: Handshake, href: "/services/end-to-end-support" },
];

/* ────────────────────────────────────────────
   HERO — Exact Tata Capital Replica
   Full-width banner image with text overlay on left,
   carousel with dots, star rating, product strip below
   ──────────────────────────────────────────── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  const goTo = useCallback(
    (i: number) => {
      if (isTransitioning || i === current) return;
      setIsTransitioning(true);
      setCurrent(i);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [current, isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-rotate every 6 seconds — Tata Capital style
  useEffect(() => {
    timerRef.current = setInterval(goNext, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  // Pause on hover
  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const resumeTimer = () => {
    timerRef.current = setInterval(goNext, 6000);
  };

  return (
    <section id="hero" className="relative">
      {/* ═══ FULL-WIDTH BANNER — Exact Tata Capital Style ═══ */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={pauseTimer}
        onMouseLeave={resumeTimer}
      >
        {/* Background Image — Full Width */}
        <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[600px]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <Image
                src={s.image}
                alt={s.heading}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="100vw"
              />
              {/* Left-side white/blue gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* ─── TEXT OVERLAY — Left Side (Tata Capital style) ─── */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="w-full lg:w-[48%]">
              {/* Heading */}
              <h1
                key={`h-${slide.id}`}
                className="text-[1.9rem] sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.2rem] xl:text-[3.5rem] font-bold leading-[1.15] tracking-[-0.01em] text-[#1a1a2e] mb-4 hero-text-enter"
              >
                {slide.heading}
              </h1>

              {/* Subtitle */}
              <p
                key={`s-${slide.id}`}
                className="text-[14px] sm:text-[16px] md:text-[17px] text-[#555] leading-[1.7] max-w-md mb-6 hero-text-enter-delayed"
              >
                {slide.subtitle}
              </p>

              {/* CTA Button — Blue rounded rectangle like Tata Capital */}
              <div key={`c-${slide.id}`} className="hero-text-enter-delayed2">
                <Button
                  onClick={() => {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="h-[46px] px-7 rounded-lg text-[15px] font-semibold text-white bg-[#0057B8] hover:bg-[#004494] transition-colors duration-200 shadow-[0_2px_8px_rgba(0,87,184,0.25)]"
                >
                  <span className="flex items-center gap-2">
                    {slide.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>

              {/* Star Rating — Tata Capital style */}
              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[12px] text-[#666] font-medium">4.9/5 rating</span>
                <span className="text-[11px] text-[#999]">|</span>
                <span className="text-[12px] text-[#666]">
                  <span className="font-semibold text-[#1a1a2e]">1,200+</span> businesses trust us
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Carousel Dots — Tata Capital style (centered below banner) ─── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-5 z-20">
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "26px" : "8px",
                    height: "8px",
                    backgroundColor: i === current ? "#0057B8" : "#C8D6E5",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={goPrev}
              className="w-7 h-7 rounded-full border border-[#C8D6E5] flex items-center justify-center text-[#888] hover:text-[#0057B8] hover:border-[#0057B8] transition-all duration-200 bg-white/80"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={goNext}
              className="w-7 h-7 rounded-full border border-[#C8D6E5] flex items-center justify-center text-[#888] hover:text-[#0057B8] hover:border-[#0057B8] transition-all duration-200 bg-white/80"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ PRODUCT QUICK LINKS STRIP — Like Tata Capital ═══ */}
      <div className="bg-white border-b border-[#E8ECF0]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-2 px-5 py-3.5 text-[13px] font-medium text-[#555] hover:text-[#0057B8] border-b-2 border-transparent hover:border-[#0057B8] transition-all duration-200 whitespace-nowrap group shrink-0"
              >
                <link.icon className="w-4 h-4 text-[#999] group-hover:text-[#0057B8] transition-colors duration-200" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <div className="bg-[#F7F9FC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-9 sm:py-11">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8">
            {[
              { value: "20+", label: "Years Experience", icon: Building2 },
              { value: "70+", label: "Bank Partners", icon: Landmark },
              { value: "1,200+", label: "Happy Clients", icon: Users },
              { value: "₹50Cr", label: "Max Funding", icon: CircleDollarSign },
            ].map((s, i) => (
              <div key={i} className="group text-center">
                <div className="flex items-center justify-center mb-2.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[#E8ECF0] group-hover:border-[#0057B8]/20 group-hover:shadow-sm transition-all duration-300">
                    <s.icon className="w-[18px] h-[18px] text-[#999] group-hover:text-[#0057B8] transition-colors duration-300" />
                  </div>
                </div>
                <p className="text-[1.5rem] sm:text-[1.65rem] font-bold text-[#1a1a2e] tracking-tight">
                  {s.value}
                </p>
                <p className="text-[10px] text-[#999] uppercase tracking-[0.14em] mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
