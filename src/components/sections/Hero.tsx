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
   SLIDE DATA (Premium Dark Cinematic FinTech Theme)
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    badge: "Empowering Enterprises",
    heading: "Accelerate Your",
    headingAccent: "MSME Growth",
    subtitle: "Customized collateral-free funding solutions syndicated seamlessly across 70+ institutional banking partners.",
    cta1: "Check Eligibility",
    cta2: "Talk to Advisor",
    image: "/images/pages/hero-indian-team.png",
    accent: "#4F46E5", // Electric Indigo
    glow: "rgba(79, 70, 229, 0.15)",
    features: [
      "Funding up to ₹50 Crores",
      "Collateral-free deployments",
      "Institutional rates from 9.5% p.a."
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
    subtitle: "Specialized debt structuring, liquidity sourcing, and structured corporate finance built for industrial expansion.",
    cta1: "Raise Capital",
    cta2: "Explore Advisory",
    image: "/images/pages/office-india.png",
    accent: "#3B82F6", // High-end Blue
    glow: "rgba(59, 130, 246, 0.15)",
    features: [
      "Structured syndicate finance",
      "PSU & Private bank networks",
      "Milestone-based repayment custom matrices"
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
    subtitle: "Pre-vet commercial loan files prior to bank submission to secure unmatched credibility and high approval marks.",
    cta1: "Apply Pre-Underwriting",
    cta2: "View Process",
    image: "/images/pages/indian-professional.png",
    accent: "#10B981", // Emerald Mint
    glow: "rgba(16, 185, 129, 0.15)",
    features: [
      "92% Application approval rating",
      "Granular credit risk pre-assessment",
      "Zero hidden architectural process gaps"
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
    subtitle: "Struggling with historical settlement records or complex CIBIL positions? Deploy expert strategies to restore leverage.",
    cta1: "Fix Credit Score",
    cta2: "Get Consulted",
    image: "/images/pages/handshake-india.png",
    accent: "#F59E0B", // Amber gold
    glow: "rgba(245, 158, 11, 0.15)",
    features: [
      "CIBIL optimization architecture",
      "Removal of restrictive default remarks",
      "Strategic structural settlement options"
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
  const [direction, setDirection] = useState(0);
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
    timerRef.current = setInterval(goNext, 9000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  return (
    <section id="hero" className="relative bg-[#070A13] text-slate-100 overflow-hidden font-sans antialiased selection:bg-slate-800 selection:text-white">
      
      {/* ═══ Video Intro Ambient Background Animation Loop ═══ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Moving Fluid Nebula Orb 1 */}
        <motion.div
          animate={{
            scale: [1, 1.15, 0.9, 1],
            x: [0, 40, -30, 0],
            y: [0, -50, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-[0.25] -right-40 -top-40 mix-blend-screen transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${slide.accent} 0%, transparent 75%)`,
          }}
        />
        {/* Animated Moving Fluid Nebula Orb 2 */}
        <motion.div
          animate={{
            scale: [1, 0.85, 1.2, 1],
            x: [0, -30, 50, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.15] -left-40 bottom-10 mix-blend-screen transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${slide.accent} 0%, transparent 75%)`,
          }}
        />
        {/* Matrix Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* Deep Horizon Vignette Blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070A13]/50 to-[#070A13]" />
      </div>

      {/* ═══ MAIN HERO PRESENTATION INTERFACE ═══ */}
      <div className="relative w-full overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 max-w-[1440px] mx-auto min-h-[640px] lg:min-h-[720px] flex items-center z-10">
        <div className="w-full px-6 sm:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Content Block Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`content-${current}`}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {/* Modern Framed Category Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] mb-6 border bg-white/[0.02] backdrop-blur-md shadow-2xl transition-all duration-500"
                  style={{
                    color: slide.accent,
                    borderColor: `${slide.accent}35`
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  {slide.badge}
                </div>

                {/* Main Heading Text */}
                <h1 className="text-[2.5rem] sm:text-[3.2rem] md:text-[3.8rem] lg:text-[4rem] xl:text-[4.6rem] font-black leading-[1.08] tracking-tight text-white mb-6">
                  {slide.heading}{" "}
                  <span
                    className="bg-clip-text text-transparent block sm:inline-block relative font-black tracking-tight"
                    style={{
                      backgroundImage: `linear-gradient(135deg, #FFFFFF, ${slide.accent})`,
                    }}
                  >
                    {slide.headingAccent}
                  </span>
                </h1>

                {/* Subtitle Descriptive Text */}
                <p className="text-[15px] sm:text-[16px] md:text-[18px] text-slate-400 font-medium leading-[1.75] max-w-xl mb-8">
                  {slide.subtitle}
                </p>

                {/* Vetting System Verification Checkmarks */}
                <div className="flex flex-col gap-3.5 mb-10 w-full">
                  {slide.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <div 
                        className="w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-500"
                        style={{ 
                          backgroundColor: `${slide.accent}15`, 
                          borderColor: `${slide.accent}40`,
                          color: slide.accent 
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[14px] font-semibold text-slate-300 tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Execution Buttons Area */}
                <div className="flex flex-wrap gap-4 items-center">
                  <Button
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-13 px-8 rounded-xl text-[14px] font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)`,
                      boxShadow: `0 12px 30px ${slide.accent}40`,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {slide.cta1}
                      <ArrowRight className="w-4.5 h-4.5" />
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-13 px-8 rounded-xl text-[14px] font-bold border-white/[0.08] bg-white/[0.02] text-slate-200 backdrop-blur-md hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {slide.cta2}
                    </span>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Frame Asset Showcase Container */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[360px] sm:h-[440px] lg:h-[500px]">
            <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] lg:w-[430px] lg:h-[430px]">
              
              {/* Complex Orbital Radial System */}
              <div 
                className="absolute inset-0 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none transition-colors duration-1000"
                style={{ backgroundColor: slide.accent }}
              />
              <div 
                className="absolute -inset-8 rounded-full border border-white/[0.03] border-dashed opacity-40 animate-[spin_80s_linear_infinite] pointer-events-none"
              />

              {/* Glass Frame Mask Structure */}
              <div className="relative w-full h-full rounded-[48px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl z-10">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={`image-${current}`}
                    initial={{ opacity: 0, scale: 1.06, x: direction * 40 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.94, x: direction * -40 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.heading}
                      fill
                      className="object-cover object-center brightness-[0.9] contract-[1.05]"
                      priority
                      sizes="(max-w-lg) 300px, 430px"
                    />
                    {/* Shadow Blending Gradient Shield */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070A13]/60 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Meta Plate Left Top */}
              <AnimatePresence>
                <motion.div
                  key={`badge1-${current}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 140, damping: 15, delay: 0.05 }}
                  className="absolute -top-3 -left-6 sm:-left-12 z-20 bg-[#0E1322]/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 shadow-3xl flex items-center gap-3.5 hover:scale-[1.03] transition-transform duration-300"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-500 shadow-inner"
                    style={{
                      backgroundColor: `${slide.accent}15`,
                      borderColor: `${slide.accent}30`,
                      color: slide.accent
                    }}
                  >
                    {React.createElement(slide.floatingBadges[0].icon, { className: "w-4.5 h-4.5" })}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{slide.floatingBadges[0].sub}</p>
                    <p className="text-[14px] font-black text-white mt-1.5">{slide.floatingBadges[0].text}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Meta Plate Right Bottom */}
              <AnimatePresence>
                <motion.div
                  key={`badge2-${current}`}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 140, damping: 15, delay: 0.1 }}
                  className="absolute -bottom-3 -right-6 sm:-right-12 z-20 bg-[#0E1322]/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 shadow-3xl flex items-center gap-3.5 hover:scale-[1.03] transition-transform duration-300"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-500 shadow-inner"
                    style={{
                      backgroundColor: `${slide.accent}15`,
                      borderColor: `${slide.accent}30`,
                      color: slide.accent
                    }}
                  >
                    {React.createElement(slide.floatingBadges[1].icon, { className: "w-4.5 h-4.5" })}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{slide.floatingBadges[1].sub}</p>
                    <p className="text-[14px] font-black text-white mt-1.5">{slide.floatingBadges[1].text}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* Slit Micro Navigation Controls */}
        <button
          onClick={goPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all duration-200 z-30 cursor-pointer hidden xl:flex shadow-2xl"
          aria-label="Previous frame slide"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all duration-200 z-30 cursor-pointer hidden xl:flex shadow-2xl"
          aria-label="Next frame slide"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* ═══ INTERACTIVE SEGMENT DOCK TABS ═══ */}
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-20 -mt-6 relative z-30">
        <div className="bg-[#0D1220]/70 backdrop-blur-2xl rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.4)] border border-white/[0.05] p-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {productTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = current === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goTo(tab.id)}
                className={`relative flex items-center gap-3.5 px-5 py-4 rounded-xl text-[13px] font-bold transition-all duration-300 cursor-pointer border border-transparent overflow-hidden ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockTabIndicator"
                    className="absolute inset-0 z-0"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)`,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 32 }}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 z-10 ${
                    isActive ? "bg-white/20 text-white shadow-md" : "bg-white/[0.03] border border-white/[0.04] text-slate-500"
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

      {/* ═══ SUB-LINK ANCHOR HORIZONTAL STRIP ═══ */}
      <div className="bg-[#090D18]/40 border-b border-white/[0.03] backdrop-blur-md mt-16">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-20">
          <div className="flex items-center overflow-x-auto scrollbar-none py-1">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-2.5 px-6 py-4.5 text-[13px] font-bold text-slate-500 hover:text-white border-b-2 border-transparent hover:border-white transition-all duration-200 whitespace-nowrap group shrink-0 tracking-wide"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/[0.04] group-hover:bg-white/[0.06] transition-colors duration-200">
                  <link.icon className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors duration-200" />
                </div>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ TRUST MATRICES - DISCRETE PREMIUM PLATES ═══ */}
      <div className="bg-gradient-to-b from-[#080B15] to-[#05070D] border-b border-white/[0.02]">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-20 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { value: "20+", label: "Years Scale Experience", icon: Building2, desc: "Trusted institutional advisory" },
              { value: "70+", label: "Banking Partners", icon: Landmark, desc: "Nationalized & private networks" },
              { value: "1,200+", label: "Corporate Clients", icon: Users, desc: "Across primary core industries" },
              { value: "₹50 Cr+", label: "Max Funding Ticket", icon: CircleDollarSign, desc: "Custom structured deployments" },
            ].map((s, i) => (
              <div
                key={i}
                className="group relative bg-[#0B0F19]/40 rounded-2xl p-6 border border-white/[0.04] shadow-2xl hover:border-white/[0.1] hover:bg-[#0B0F19]/80 transition-all duration-350 ease-out"
              >
                {/* Micro Animatible Icon Wrapper Frame */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/[0.04] mb-4.5 group-hover:bg-white/[0.06] transition-colors duration-300">
                  <s.icon className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-300 transition-colors duration-300" />
                </div>
                {/* Metrics */}
                <p className="text-[1.7rem] sm:text-[1.85rem] font-black text-white tracking-tight leading-none">
                  {s.value}
                </p>
                {/* Labels Descriptions */}
                <p className="text-[13px] font-bold text-slate-200 mt-2.5 tracking-wide">
                  {s.label}
                </p>
                <p className="text-[12px] text-slate-500 mt-1 font-medium leading-normal">
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
