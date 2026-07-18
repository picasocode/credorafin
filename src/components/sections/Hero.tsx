"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  BadgeCheck,
  TrendingUp,
  FileText,
  Banknote,
  Globe,
  Handshake,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA (Premium Light Corporate Theme)
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    badge: "Empowering Enterprises",
    heading: "Accelerate Your",
    headingAccent: "MSME Growth",
    subtitle: "Customized collateral-free funding solutions for growing businesses. Syndicated seamlessly across 70+ trusted bank partners.",
    cta1: "Check Eligibility",
    cta2: "Talk to Advisor",
    image: "/images/pages/hero-indian-team.png",
    accent: "#304AC0", // Brand Blue
    features: [
      "Funding up to ₹50 Crores",
      "Collateral-free options available",
      "Competitive rates from 9.5% p.a."
    ],
    floatingBadges: [
      { text: "From 9.5% p.a.", sub: "Interest Rates", icon: Zap },
      { text: "7-10 Days", sub: "Disbursal", icon: Clock }
    ]
  },
  {
    id: 1,
    badge: "Infrastructure & Scale",
    heading: "Raise Capital for",
    headingAccent: "Large Projects",
    subtitle: "Specialized debt structuring, capital raising, and structured corporate finance designed for high-value industrial expansions.",
    cta1: "Raise Capital",
    cta2: "Explore Advisory",
    image: "/images/pages/office-india.png",
    accent: "#13277E", // Logo Navy
    features: [
      "Structured finance solutions",
      "Syndication with PSU & Private banks",
      "Flexible, milestone-based repayment"
    ],
    floatingBadges: [
      { text: "₹5Cr - ₹100Cr", sub: "Ticket Size", icon: Building2 },
      { text: "20+ Years", sub: "Experience", icon: Landmark }
    ]
  },
  {
    id: 2,
    badge: "Risk & Compliance Vetting",
    heading: "Guarantee Success with",
    headingAccent: "Pre-Underwriting",
    subtitle: "Pre-vet your commercial loan applications before submitting to lenders to secure bank-ready institutional credibility.",
    cta1: "Apply Pre-Underwriting",
    cta2: "View Process",
    image: "/images/pages/indian-professional.png",
    accent: "#76A32B", // Deep Brand Green
    features: [
      "92% Application approval rate",
      "Comprehensive credit assessment",
      "Zero hidden processing gaps"
    ],
    floatingBadges: [
      { text: "92% Approvals", sub: "Success Rate", icon: BadgeCheck },
      { text: "48 Hours", sub: "Vetting Turnaround", icon: Clock }
    ]
  },
  {
    id: 3,
    badge: "Financial Reconstruction",
    heading: "Resolve Defaults &",
    headingAccent: "Repair Credit",
    subtitle: "Struggling with past settlement defaults or complex CIBIL issues? Partner with experts to restore your borrowing health.",
    cta1: "Fix Credit Score",
    cta2: "Get Consulted",
    image: "/images/pages/handshake-india.png",
    accent: "#D97706", // Amber / Warm Orange
    features: [
      "CIBIL score optimization",
      "Removal of historical default records",
      "Personalized strategic restructuring"
    ],
    floatingBadges: [
      { text: "+150 Points", sub: "Average Boost", icon: TrendingUp },
      { text: "1,200+ Clients", sub: "Credit Restored", icon: Users }
    ]
  }
];

const quickLinks = [
  { label: "MSME Loans", icon: Building2, href: "/products/msme-loans" },
  { label: "Project Finance", icon: TrendingUp, href: "/products/project-finance" },
  { label: "Supply Chain", icon: Globe, href: "/products/supply-chain-finance" },
  { label: "Credit Repair", icon: Shield, href: "/services/credit-repair" },
  { label: "Fund Raising", icon: Banknote, href: "/services/fund-raising" },
  { label: "Pre-Underwriting", icon: FileText, href: "/services/pre-underwriting-loan-structuring" },
  { label: "End-to-End Support", icon: Handshake, href: "/services/end-to-end-support" },
];

const productTabs = [
  { id: 0, label: "Business Loans", icon: Building2 },
  { id: 1, label: "Project Finance", icon: TrendingUp },
  { id: 2, label: "Pre-Underwriting", icon: BadgeCheck },
  { id: 3, label: "Credit Repair", icon: Shield }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === current) return;
      setDirection(nextIndex > current ? 1 : -1);
      setCurrent(nextIndex);
    },
    [current]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  const resumeTimer = () => {
    timerRef.current = setInterval(goNext, 8000);
  };

  return (
    <section id="hero" className="relative bg-[#FAFBFC] overflow-hidden font-sans antialiased selection:bg-slate-200">
      {/* ═══ Clean Grid Background Overlay ═══ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* ═══ Dynamic Ambient Glow Orbs ═══ */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.12] pointer-events-none transition-all duration-1000 ease-out -right-40 -top-40"
        style={{
          background: `radial-gradient(circle, ${slide.accent} 0%, transparent 70%)`
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.08] pointer-events-none transition-all duration-1000 ease-out -left-40 bottom-10"
        style={{
          background: `radial-gradient(circle, ${slide.accent} 0%, transparent 70%)`
        }}
      />

      {/* ═══ MAIN BANNER SLIDER CONTAINER ═══ */}
      <div
        className="relative w-full overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-[1440px] mx-auto min-h-[620px] lg:min-h-[680px] flex items-center"
        onMouseEnter={pauseTimer}
        onMouseLeave={resumeTimer}
      >
        <div className="w-full px-5 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative">
          
          {/* Left Column Layout: Animated Content Elements */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`content-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.215, 0.610, 0.355, 1.0] }}
                className="w-full"
              >
                {/* Micro Category Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] mb-5 border shadow-sm backdrop-blur-sm transition-all duration-300"
                  style={{
                    color: slide.accent,
                    backgroundColor: `${slide.accent}0A`,
                    borderColor: `${slide.accent}20`
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  {slide.badge}
                </div>

                {/* Primary Headings */}
                <h1 className="text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[3.8rem] xl:text-[4.2rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-5">
                  {slide.heading}{" "}
                  <span
                    className="bg-clip-text text-transparent block sm:inline-block relative drop-shadow-sm font-black"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)`,
                    }}
                  >
                    {slide.headingAccent}
                  </span>
                </h1>

                {/* Subtitle Description */}
                <p className="text-[15px] sm:text-[16px] md:text-[17px] text-slate-500 font-medium leading-[1.7] max-w-xl mb-8">
                  {slide.subtitle}
                </p>

                {/* Highlights Vetting List */}
                <div className="flex flex-col gap-3.5 mb-9 w-full">
                  {slide.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 group">
                      <div 
                        className="w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{ 
                          backgroundColor: `${slide.accent}0F`, 
                          color: slide.accent 
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[14px] font-semibold text-slate-700 tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA Buttons Block */}
                <div className="flex flex-wrap gap-4 items-center">
                  <Button
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-13 px-8 rounded-xl text-[14px] font-bold text-white transition-all duration-300 hover:shadow-xl hover:brightness-105 active:scale-[0.98] cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}ee)`,
                      boxShadow: `0 10px 28px ${slide.accent}30`,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {slide.cta1}
                      <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-13 px-8 rounded-xl text-[14px] font-bold border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {slide.cta2}
                    </span>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column Layout: Sliding Structural Frame & Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[340px] sm:h-[420px] lg:h-[480px]">
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[410px] lg:h-[410px]">
              
              {/* Geometric Decorative Rings */}
              <div 
                className="absolute inset-0 rounded-full opacity-[0.05] blur-2xl animate-pulse pointer-events-none"
                style={{ backgroundColor: slide.accent }}
              />
              <div 
                className="absolute -inset-6 rounded-full border border-dashed opacity-20 animate-[spin_60s_linear_infinite] pointer-events-none"
                style={{ borderColor: slide.accent }}
              />

              {/* Masked Frame Showcase with AnimatePresence Slider Cross-Fade */}
              <div className="relative w-full h-full rounded-[48px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border-[8px] border-white bg-white z-10">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={`image-${current}`}
                    initial={{ opacity: 0, scale: 1.05, x: direction * 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: direction * -50 }}
                    transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.heading}
                      fill
                      className="object-cover object-center transform transition-transform duration-700 hover:scale-105"
                      priority
                      sizes="(max-w-lg) 280px, 410px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent mix-blend-multiply" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Status Card Left Top */}
              <AnimatePresence>
                <motion.div
                  key={`badge1-${current}`}
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
                  className="absolute -top-3 -left-6 sm:-left-12 z-20 bg-white/95 backdrop-blur-md border border-slate-100/90 rounded-2xl p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.06)] flex items-center gap-3.5 hover:scale-[1.03] transition-transform duration-300"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-colors duration-500"
                    style={{
                      backgroundColor: `${slide.accent}0F`,
                      color: slide.accent
                    }}
                  >
                    {React.createElement(slide.floatingBadges[0].icon, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{slide.floatingBadges[0].sub}</p>
                    <p className="text-[14px] font-extrabold text-slate-800 mt-1">{slide.floatingBadges[0].text}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Status Card Right Bottom */}
              <AnimatePresence>
                <motion.div
                  key={`badge2-${current}`}
                  initial={{ opacity: 0, y: -15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.15 }}
                  className="absolute -bottom-3 -right-6 sm:-right-12 z-20 bg-white/95 backdrop-blur-md border border-slate-100/90 rounded-2xl p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.06)] flex items-center gap-3.5 hover:scale-[1.03] transition-transform duration-300"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-colors duration-500"
                    style={{
                      backgroundColor: `${slide.accent}0F`,
                      color: slide.accent
                    }}
                  >
                    {React.createElement(slide.floatingBadges[1].icon, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{slide.floatingBadges[1].sub}</p>
                    <p className="text-[14px] font-extrabold text-slate-800 mt-1">{slide.floatingBadges[1].text}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* ─── Premium Architectural Slit Controls (Desktop Navigation Only) ─── */}
        <button
          onClick={goPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 z-30 cursor-pointer hidden xl:flex hover:shadow-lg"
          aria-label="Previous core slide"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 z-30 cursor-pointer hidden xl:flex hover:shadow-lg"
          aria-label="Next core slide"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* ═══ INTERACTIVE ANCHORED PRODUCT TABS ═══ */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-16 -mt-4 relative z-30">
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100/80 p-2.5 grid grid-cols-2 md:grid-cols-4 gap-2">
          {productTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = current === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goTo(tab.id)}
                className={`relative flex items-center gap-3 px-5 py-4 rounded-xl text-[13px] font-bold transition-all duration-300 cursor-pointer border border-transparent overflow-hidden ${
                  isActive ? "text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/70"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 z-0"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}dd)`,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 z-10 ${
                    isActive ? "bg-white/20 text-white shadow-sm" : "bg-slate-50 text-slate-400"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                </div>
                <span className="whitespace-nowrap truncate z-10 tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ COMPACT PRODUCT QUICK LINKS NAVIGATION STRIP ═══ */}
      <div className="bg-white border-b border-slate-100 shadow-xs mt-14">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-16">
          <div className="flex items-center overflow-x-auto scrollbar-none py-1">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-2.5 px-6 py-4 text-[13px] font-bold text-slate-400 hover:text-[#304AC0] border-b-2 border-transparent hover:border-[#304AC0] transition-all duration-200 whitespace-nowrap group shrink-0 tracking-wide"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50/60 group-hover:bg-[#304AC0]/5 transition-colors duration-200">
                  <link.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#304AC0] transition-colors duration-200" />
                </div>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CORPORATE TRUSTED STATS BAR — PREMIUM PLATES ═══ */}
      <div className="bg-gradient-to-b from-slate-50/60 to-white border-b border-slate-100">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-16 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { value: "20+", label: "Years Scale Experience", icon: Building2, desc: "Trusted financial structuring" },
              { value: "70+", label: "Banking Partners", icon: Landmark, desc: "Nationalized & private networks" },
              { value: "1,200+", label: "Corporate Clients", icon: Users, desc: "Across cross-border industries" },
              { value: "₹50 Cr+", label: "Max Funding Ticket", icon: CircleDollarSign, desc: "Custom structured underwriting" },
            ].map((s, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] hover:border-[#304AC0]/15 hover:shadow-[0_16px_35px_-8px_rgba(48,74,192,0.08)] hover:-translate-y-1 transition-all duration-350 ease-out"
              >
                {/* Micro Animated Icon Frame */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 mb-4 group-hover:bg-[#304AC0]/5 transition-colors duration-300">
                  <s.icon className="w-4.5 h-4.5 text-slate-400 group-hover:text-[#304AC0] transition-colors duration-300" />
                </div>
                {/* Values Data */}
                <p className="text-[1.65rem] sm:text-[1.8rem] font-black text-slate-900 tracking-tight leading-none">
                  {s.value}
                </p>
                {/* Content Descriptions */}
                <p className="text-[13px] font-bold text-slate-800 mt-2 tracking-wide">
                  {s.label}
                </p>
                <p className="text-[11.5px] text-slate-450 mt-0.5 font-medium leading-normal text-slate-400">
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
