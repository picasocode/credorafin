"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  Landmark,
  Zap,
  CheckCircle2,
  CircleDollarSign,
  Users,
  BadgeCheck,
  HeartHandshake,
  Handshake,
  TrendingUp,
  FileText,
  CreditCard,
  Banknote,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA — Credora version of Tata Capital style
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    heading: "Enrich Your Cashflow",
    subtitle: "Funding solutions for MSMEs and growing businesses — 70+ banks, one streamlined process.",
    cta: "Get Funded Now",
    ctaLink: "#contact",
    image: "/images/pages/hero-indian-team.png",
    accent: "#304AC0",
  },
  {
    id: 1,
    heading: "Precision That Gets Approved",
    subtitle: "Bank-ready applications before they reach a lender. 92% approval rate, 7–10 day disbursal.",
    cta: "Start Pre-Underwriting",
    ctaLink: "#contact",
    image: "/images/pages/indian-professional.png",
    accent: "#1E40AF",
  },
  {
    id: 2,
    heading: "From Application To Disbursal",
    subtitle: "Credit repair, EMI structuring, documentation — we handle everything so you stay focused on growth.",
    cta: "Get Advisory",
    ctaLink: "#contact",
    image: "/images/pages/office-india.png",
    accent: "#13277E",
  },
];

/* ─── Quick Links (like Tata Capital's product strip) ─── */
const quickLinks = [
  { label: "MSME Loans", icon: Building2, href: "/products/msme-loans" },
  { label: "Project Finance", icon: TrendingUp, href: "/products/project-finance" },
  { label: "Supply Chain", icon: Globe, href: "/products/supply-chain-finance" },
  { label: "Credit Repair", icon: Shield, href: "/services/credit-repair" },
  { label: "Fund Raising", icon: Banknote, href: "/services/fund-raising" },
  { label: "Pre-Underwriting", icon: FileText, href: "/services/pre-underwriting-loan-structuring" },
];

/* ─── Stats ─── */
const stats = [
  { value: "20+", label: "Years Experience", icon: Building2 },
  { value: "70+", label: "Bank Partners", icon: Landmark },
  { value: "1,200+", label: "Happy Clients", icon: Users },
  { value: "₹50Cr", label: "Max Funding", icon: CircleDollarSign },
];

/* ────────────────────────────────────────────
   HERO — Tata Capital Style
   Full-width banner with left text + right image,
   carousel dots, clean corporate blue theme
   ──────────────────────────────────────────── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const slide = slides[current];

  const goTo = useCallback(
    (i: number) => {
      if (isTransitioning || i === current) return;
      setIsTransitioning(true);
      setCurrent(i);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [current, isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const t = setInterval(goNext, 6000);
    return () => clearInterval(t);
  }, [goNext]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden"
    >
      {/* ═══ MAIN BANNER — Full Width like Tata Capital ═══ */}
      <div className="relative w-full bg-gradient-to-r from-[#F0F4FF] via-white to-[#F8FAFF]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center min-h-[520px] sm:min-h-[560px] lg:min-h-[600px]">
            {/* ─── LEFT: Text Content (40%) ─── */}
            <div className="w-full lg:w-[45%] py-12 lg:py-0 pr-0 lg:pr-8">
              {/* Heading */}
              <h1
                key={`h-${slide.id}`}
                className="text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] xl:text-[3.5rem] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e] mb-5 animate-[fadeSlideUp_0.5s_ease-out]"
              >
                {slide.heading}
              </h1>

              {/* Subtitle */}
              <p
                key={`s-${slide.id}`}
                className="text-[15px] sm:text-[17px] text-[#555] leading-[1.7] max-w-md mb-8 animate-[fadeSlideUp_0.5s_ease-out_0.1s_both]"
              >
                {slide.subtitle}
              </p>

              {/* CTA Button — Tata Capital style blue button */}
              <div
                key={`c-${slide.id}`}
                className="animate-[fadeSlideUp_0.5s_ease-out_0.2s_both]"
              >
                <Button
                  onClick={() => {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="h-[50px] px-8 rounded-lg text-[15px] font-semibold text-white transition-all duration-300 hover:shadow-lg hover:brightness-110"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent}, #3B5FDB)`,
                    boxShadow: `0 4px 14px ${slide.accent}30`,
                  }}
                >
                  <span className="flex items-center gap-2">
                    {slide.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </div>

            {/* ─── RIGHT: Image (55%) ─── */}
            <div className="hidden lg:block w-[55%] relative">
              <div
                key={`img-${slide.id}`}
                className="relative animate-[fadeScale_0.6s_ease-out]"
              >
                <Image
                  src={slide.image}
                  alt="Credora Finance"
                  width={700}
                  height={480}
                  className="w-full h-[480px] object-cover rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]"
                  priority
                />

                {/* Verified badge — top right of image */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm">
                    <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[10px] font-semibold text-green-700">Verified Partner</span>
                  </div>
                </div>

                {/* Quick stat overlay — bottom left of image */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  {[
                    { label: "Approval Rate", value: "92%", color: slide.accent },
                    { label: "Disbursal", value: "7 Days", color: "#87B73C" },
                    { label: "Lenders", value: "70+", color: slide.accent },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-xl bg-white/85 backdrop-blur-md p-3 border border-white/50"
                    >
                      <p className="text-[8px] text-slate-400 uppercase tracking-wider font-medium mb-1">{c.label}</p>
                      <p className="text-[17px] font-bold text-slate-900 leading-none">{c.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Carousel Dots — Tata Capital style ─── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative transition-all duration-400 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              >
                <span
                  className="block rounded-full transition-all duration-400"
                  style={{
                    width: i === current ? "28px" : "8px",
                    height: "8px",
                    backgroundColor: i === current ? slide.accent : "#CBD5E1",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-white transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={goNext}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-white transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ QUICK LINKS STRIP — Like Tata Capital's product bar ═══ */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide py-0">
            {quickLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex items-center gap-2.5 px-5 py-4 text-[13px] font-medium text-slate-600 hover:text-[#304AC0] border-b-2 border-transparent hover:border-[#304AC0] transition-all duration-200 whitespace-nowrap group"
              >
                <link.icon className="w-4 h-4 text-slate-400 group-hover:text-[#304AC0] transition-colors duration-200" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <div className="bg-[#FAFBFF]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="group text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white border border-slate-100 group-hover:border-[#304AC0]/20 group-hover:shadow-sm transition-all duration-300">
                    <s.icon className="w-5 h-5 text-slate-400 group-hover:text-[#304AC0] transition-colors duration-300" />
                  </div>
                </div>
                <p className="text-[1.6rem] sm:text-[1.75rem] font-bold text-[#1a1a2e] tracking-tight">
                  {s.value}
                </p>
                <p className="text-[11px] text-slate-400 uppercase tracking-[0.14em] mt-1">
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
