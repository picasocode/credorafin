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
  Phone,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    badge: "Structured Finance",
    heading: "Enrich Your",
    headingAccent: "Cashflow",
    subtitle: "Funding solutions for MSMEs and growing businesses — 70+ banks, one streamlined process.",
    cta1: "Get Funded Now",
    cta2: "Speak to an Advisor",
    image: "/images/pages/hero-indian-team.png",
    accent: "#0057B8",
  },
  {
    id: 1,
    badge: "Pre-Underwriting",
    heading: "Precision That",
    headingAccent: "Gets Approved",
    subtitle: "Bank-ready applications before they reach a lender. 92% approval rate, 7–10 day disbursal.",
    cta1: "Apply Now",
    cta2: "Learn the Process",
    image: "/images/pages/indian-professional.png",
    accent: "#006B3F",
  },
  {
    id: 2,
    badge: "End-to-End Advisory",
    heading: "From Application",
    headingAccent: "To Disbursal",
    subtitle: "Credit repair, EMI structuring, documentation — we handle everything so you stay focused on growth.",
    cta1: "Get Advisory",
    cta2: "See Our Services",
    image: "/images/pages/office-india.png",
    accent: "#1B3A6B",
  },
];

/* ─── Quick Links ─── */
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
   HERO — Premium Finance Landing
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

  const goNext = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const goPrev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext]);

  const pauseTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resumeTimer = () => { timerRef.current = setInterval(goNext, 6000); };

  return (
    <section id="hero" className="relative">
      {/* ═══ FULL-WIDTH BANNER ═══ */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={pauseTimer}
        onMouseLeave={resumeTimer}
      >
        {/* Background Images with crossfade */}
        <div className="relative w-full h-[460px] sm:h-[520px] md:h-[580px] lg:h-[640px]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-800 ease-in-out"
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
            </div>
          ))}

          {/* Multi-layer gradient overlay — deep, rich, professional */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/65 to-[#0a1628]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/40 via-transparent to-transparent" />
          {/* Accent color glow from bottom-left */}
          <div
            className="absolute bottom-0 left-0 w-[50%] h-[60%] transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse at bottom left, ${slide.accent}18 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* ─── TEXT OVERLAY — Left Side ─── */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="w-full lg:w-[50%]">
              {/* Badge Pill */}
              <div
                key={`b-${slide.id}`}
                className="hero-text-enter mb-5"
              >
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] border backdrop-blur-sm"
                  style={{
                    color: "#fff",
                    backgroundColor: `${slide.accent}20`,
                    borderColor: `${slide.accent}40`,
                  }}
                >
                  <Zap className="w-3 h-3" style={{ color: slide.accent }} />
                  {slide.badge}
                </span>
              </div>

              {/* Heading with accent word */}
              <h1
                key={`h-${slide.id}`}
                className="text-[2rem] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.4rem] xl:text-[3.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-white mb-5 hero-text-enter"
              >
                {slide.heading}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${slide.accent}, #60A5FA)`,
                  }}
                >
                  {slide.headingAccent}
                </span>
              </h1>

              {/* Subtitle */}
              <p
                key={`s-${slide.id}`}
                className="text-[14px] sm:text-[16px] md:text-[17px] text-white/70 leading-[1.75] max-w-lg mb-7 hero-text-enter-delayed"
              >
                {slide.subtitle}
              </p>

              {/* Dual CTA Buttons */}
              <div key={`c-${slide.id}`} className="flex flex-wrap gap-3 hero-text-enter-delayed2">
                <Button
                  onClick={() => {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="h-[50px] px-7 rounded-xl text-[14px] font-semibold text-white transition-all duration-300 hover:shadow-lg hover:brightness-110"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent}, #3B82F6)`,
                    boxShadow: `0 4px 20px ${slide.accent}40`,
                  }}
                >
                  <span className="flex items-center gap-2">
                    {slide.cta1}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="h-[50px] px-7 rounded-xl text-[14px] font-semibold border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    {slide.cta2}
                  </span>
                </Button>
              </div>

              {/* Trust indicators row */}
              <div className="flex items-center gap-4 mt-6 hero-text-enter-delayed2">
                {/* Star rating */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[12px] text-white/60 font-medium ml-1">4.9/5</span>
                </div>

                <div className="h-3.5 w-px bg-white/20" />

                {/* Avatar stack + trust text */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {["RK", "SP", "AM"].map((initials, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white border border-white/30"
                        style={{ backgroundColor: [slide.accent, "#13277E", "#87B73C"][i] }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] text-white/50">
                    <span className="text-white/80 font-semibold">1,200+</span> businesses trust us
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Carousel Controls — Bottom Center ─── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          {/* Slide counter */}
          <span className="text-[11px] text-white/40 tabular-nums tracking-wide">
            <span className="text-white font-semibold">{String(current + 1).padStart(2, "0")}</span>
            <span className="mx-0.5">/</span>
            {String(slides.length).padStart(2, "0")}
          </span>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative transition-all duration-400 cursor-pointer group"
                aria-label={`Go to slide ${i + 1}`}
              >
                <span
                  className="block rounded-full transition-all duration-400"
                  style={{
                    width: i === current ? "32px" : "8px",
                    height: "8px",
                    backgroundColor: i === current ? "#fff" : "rgba(255,255,255,0.3)",
                  }}
                />
                {/* Progress bar inside active dot */}
                {i === current && (
                  <span
                    className="absolute inset-0 rounded-full overflow-hidden"
                  >
                    <span
                      className="block h-full rounded-full hero-progress-bar"
                      style={{ backgroundColor: slide.accent }}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={goPrev}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ PRODUCT QUICK LINKS STRIP ═══ */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-2.5 px-5 py-4 text-[13px] font-medium text-slate-500 hover:text-[#0057B8] border-b-2 border-transparent hover:border-[#0057B8] transition-all duration-200 whitespace-nowrap group shrink-0"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 group-hover:bg-[#0057B8]/5 transition-colors duration-200">
                  <link.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0057B8] transition-colors duration-200" />
                </div>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STATS BAR — Premium Cards ═══ */}
      <div className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { value: "20+", label: "Years Experience", icon: Building2, desc: "Trusted since 2004" },
              { value: "70+", label: "Bank Partners", icon: Landmark, desc: "All major banks" },
              { value: "1,200+", label: "Happy Clients", icon: Users, desc: "Across India" },
              { value: "₹50Cr", label: "Max Funding", icon: CircleDollarSign, desc: "Single ticket size" },
            ].map((s, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 hover:border-[#0057B8]/15 hover:shadow-[0_8px_30px_-8px_rgba(0,87,184,0.1)] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0057B8]/5 mb-3 group-hover:bg-[#0057B8]/10 transition-colors duration-300">
                  <s.icon className="w-5 h-5 text-[#0057B8]/60 group-hover:text-[#0057B8] transition-colors duration-300" />
                </div>
                {/* Value */}
                <p className="text-[1.55rem] sm:text-[1.7rem] font-bold text-[#1a1a2e] tracking-tight leading-none">
                  {s.value}
                </p>
                {/* Label */}
                <p className="text-[12px] font-medium text-slate-600 mt-1">
                  {s.label}
                </p>
                {/* Description */}
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
