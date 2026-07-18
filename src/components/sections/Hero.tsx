"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
   SLIDE DATA (Tata Capital Inspired Light Theme)
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    badge: "Empowering Enterprises",
    heading: "Accelerate Your",
    headingAccent: "MSME Growth",
    subtitle: "Customized collateral-free funding solutions for growing businesses. Syndicated across 70+ bank partners.",
    cta1: "Check Eligibility",
    cta2: "Talk to Advisor",
    image: "/images/pages/hero-indian-team.png",
    accent: "#304AC0", // Brand Blue
    features: [
      "Funding up to ₹50 Crores",
      "Collateral-free options available",
      "Interest rates from 9.5% p.a."
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
    subtitle: "Specialized debt structuring, capital raising, and structured finance for high-value corporate expansions.",
    cta1: "Raise Capital",
    cta2: "Explore Advisory",
    image: "/images/pages/office-india.png",
    accent: "#13277E", // Logo Navy
    features: [
      "Structured finance solutions",
      "Syndication with PSU & Private banks",
      "Flexible repayment structures"
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
    subtitle: "Pre-vet your loan applications before submitting to lenders to secure bank-ready credibility and high approvals.",
    cta1: "Apply Pre-Underwriting",
    cta2: "View Process",
    image: "/images/pages/indian-professional.png",
    accent: "#87B73C", // Logo Green (Brand green)
    features: [
      "92% Application approval rate",
      "Comprehensive credit assessment",
      "Zero hidden process gaps"
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
    subtitle: "Struggling with a low CIBIL score or past settlement defaults? Partner with experts to restore your borrowing health.",
    cta1: "Fix Credit Score",
    cta2: "Get Consulted",
    image: "/images/pages/handshake-india.png",
    accent: "#D97706", // Amber / Warm Orange
    features: [
      "CIBIL score improvement",
      "Removal of default records",
      "Personalized restructuring"
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
  { label: "End-to-End", icon: Handshake, href: "/services/end-to-end-support" },
];

const productTabs = [
  { id: 0, label: "Business Loans", icon: Building2 },
  { id: 1, label: "Project Finance", icon: TrendingUp },
  { id: 2, label: "Pre-Underwriting", icon: BadgeCheck },
  { id: 3, label: "Credit Repair", icon: Shield }
];

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
      setTimeout(() => setIsTransitioning(false), 850);
    },
    [current, isTransitioning]
  );

  const goNext = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const goPrev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 8000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext]);

  const pauseTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resumeTimer = () => { timerRef.current = setInterval(goNext, 8000); };

  return (
    <section id="hero" className="relative bg-[#FAFBFC] overflow-hidden">
      {/* ═══ Subtle Grid Background Overlay ═══ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* ═══ Dynamic Glow Orbs ═══ */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-1000 -right-20 -top-20"
        style={{
          background: `radial-gradient(circle, ${slide.accent} 0%, transparent 70%)`
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-1000 -left-20 bottom-20"
        style={{
          background: `radial-gradient(circle, ${slide.accent} 0%, transparent 70%)`
        }}
      />

      {/* ═══ MAIN BANNER SLIDER ═══ */}
      <div
        className="relative w-full overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24"
        onMouseEnter={pauseTimer}
        onMouseLeave={resumeTimer}
      >
        <div 
          className="flex transition-transform duration-750 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ 
            transform: `translate3d(-${current * 100}%, 0, 0)`, 
            width: `${slides.length * 100}%` 
          }}
        >
          {slides.map((s, idx) => {
            const isActive = current === idx;
            return (
              <div 
                key={s.id} 
                className="w-full shrink-0 px-5 sm:px-8 lg:px-12 max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
                style={{ width: `${100 / slides.length}%` }}
              >
                {/* Left Column: Copy & Actions */}
                <div className="lg:col-span-7 flex flex-col items-start text-left no-justify">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] mb-4 border"
                    style={{
                      color: s.accent,
                      backgroundColor: `${s.accent}12`,
                      borderColor: `${s.accent}25`
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {s.badge}
                  </motion.div>

                  {/* Heading */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[3.6rem] xl:text-[4rem] font-extrabold leading-[1.12] tracking-tight text-slate-900 mb-5"
                  >
                    {s.heading}{" "}
                    <span
                      className="bg-clip-text text-transparent block sm:inline"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${s.accent}, ${s.accent}cc)`,
                      }}
                    >
                      {s.headingAccent}
                    </span>
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-[14px] sm:text-[15px] md:text-[16px] text-slate-600 leading-[1.65] max-w-xl mb-6"
                  >
                    {s.subtitle}
                  </motion.p>

                  {/* Highlights Bullet List */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col gap-3 mb-8 w-full"
                  >
                    {s.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ 
                            backgroundColor: `${s.accent}12`, 
                            color: s.accent 
                          }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[13px] sm:text-[14px] font-semibold text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      onClick={() => {
                        const el = document.getElementById("contact");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="h-[52px] px-8 rounded-xl text-[14px] font-bold text-white transition-all duration-300 hover:shadow-lg hover:brightness-105 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${s.accent}, ${s.accent}dd)`,
                        boxShadow: `0 8px 25px ${s.accent}25`,
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {s.cta1}
                        <ArrowRight className="w-4.5 h-4.5" />
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        const el = document.getElementById("contact");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="h-[52px] px-8 rounded-xl text-[14px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {s.cta2}
                      </span>
                    </Button>
                  </motion.div>
                </div>

                {/* Right Column: Image and Dynamic Badges */}
                <div className="lg:col-span-5 relative flex justify-center items-center">
                  <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px]">
                    
                    {/* Circle backdrops */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-10 blur-3xl animate-pulse pointer-events-none"
                      style={{ backgroundColor: s.accent }}
                    />
                    
                    <div 
                      className="absolute inset-10 rounded-full border-2 border-dashed opacity-25 animate-[spin_40s_linear_infinite] pointer-events-none"
                      style={{ borderColor: s.accent }}
                    />

                    {/* Main Image Container */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-white bg-slate-100"
                    >
                      <Image
                        src={s.image}
                        alt={s.heading}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                        sizes="(max-w-lg) 280px, 380px"
                      />
                      
                      {/* Gentle overlay for light theme look */}
                      <div className="absolute inset-0 bg-slate-900/5 mix-blend-overlay" />
                    </motion.div>

                    {/* Floating Badge 1 */}
                    <motion.div
                      initial={{ opacity: 0, x: -30, y: -10 }}
                      animate={isActive ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -30, y: -10 }}
                      transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 100 }}
                      className="absolute -top-4 -left-4 sm:-left-8 z-20 bg-white/95 backdrop-blur-md border border-slate-100/80 rounded-2xl p-3 shadow-xl flex items-center gap-3 hover:scale-105 transition-transform duration-300"
                    >
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${s.accent}12`,
                          color: s.accent
                        }}
                      >
                        {React.createElement(s.floatingBadges[0].icon, { className: "w-4.5 h-4.5" })}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">{s.floatingBadges[0].sub}</p>
                        <p className="text-[13px] font-bold text-slate-800 mt-1">{s.floatingBadges[0].text}</p>
                      </div>
                    </motion.div>

                    {/* Floating Badge 2 */}
                    <motion.div
                      initial={{ opacity: 0, x: 30, y: 10 }}
                      animate={isActive ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 30, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 100 }}
                      className="absolute -bottom-4 -right-4 sm:-right-8 z-20 bg-white/95 backdrop-blur-md border border-slate-100/80 rounded-2xl p-3 shadow-xl flex items-center gap-3 hover:scale-105 transition-transform duration-300"
                    >
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${s.accent}12`,
                          color: s.accent
                        }}
                      >
                        {React.createElement(s.floatingBadges[1].icon, { className: "w-4.5 h-4.5" })}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">{s.floatingBadges[1].sub}</p>
                        <p className="text-[13px] font-bold text-slate-800 mt-1">{s.floatingBadges[1].text}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Navigation Arrows ─── */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 z-20 cursor-pointer hidden md:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 z-20 cursor-pointer hidden md:flex"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ═══ INTERACTIVE PRODUCT TABS (Tata Capital Style) ═══ */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 -mt-6 relative z-30">
        <div className="bg-white rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.07)] border border-slate-100 p-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {productTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = current === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goTo(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-300 cursor-pointer border border-transparent ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}dd)`,
                        boxShadow: `0 8px 20px -6px ${slide.accent}95`,
                      }
                    : {}
                }
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 shrink-0 ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                </div>
                <span className="whitespace-nowrap truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ PRODUCT QUICK LINKS STRIP ═══ */}
      <div className="bg-white border-b border-slate-100 shadow-sm mt-12">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-2.5 px-5 py-4.5 text-[13px] font-semibold text-slate-500 hover:text-[#304AC0] border-b-2 border-transparent hover:border-[#304AC0] transition-all duration-200 whitespace-nowrap group shrink-0"
              >
                <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-slate-50 group-hover:bg-[#304AC0]/5 transition-colors duration-200">
                  <link.icon className="w-4 h-4 text-slate-400 group-hover:text-[#304AC0] transition-colors duration-200" />
                </div>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STATS BAR — Premium Cards ═══ */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: "20+", label: "Years Experience", icon: Building2, desc: "Trusted since 2004" },
              { value: "70+", label: "Bank Partners", icon: Landmark, desc: "All major banks" },
              { value: "1,200+", label: "Happy Clients", icon: Users, desc: "Across India" },
              { value: "₹50Cr", label: "Max Funding", icon: CircleDollarSign, desc: "Single ticket size" },
            ].map((s, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.03)] hover:border-[#304AC0]/15 hover:shadow-[0_12px_30px_-8px_rgba(48,74,192,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 mb-3.5 group-hover:bg-[#304AC0]/5 transition-colors duration-300">
                  <s.icon className="w-5 h-5 text-slate-400 group-hover:text-[#304AC0] transition-colors duration-300" />
                </div>
                {/* Value */}
                <p className="text-[1.55rem] sm:text-[1.75rem] font-extrabold text-slate-900 tracking-tight leading-none">
                  {s.value}
                </p>
                {/* Label */}
                <p className="text-[12.5px] font-bold text-slate-700 mt-1.5">
                  {s.label}
                </p>
                {/* Description */}
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
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
