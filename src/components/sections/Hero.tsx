"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Building2,
  Landmark,
  Zap,
  Users,
  BadgeCheck,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA (Clean Light Corporate Theme)
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    badge: "Empowering Enterprises",
    heading: "Accelerate Your",
    headingAccent: "MSME Growth",
    subtitle: "Customized collateral-free funding solutions syndicated across 70+ banking partners.",
    cta1: "Check Eligibility",
    cta2: "Talk to Advisor",
    image: "/images/pages/hero-indian-team.png",
    accent: "#304AC0",
    features: ["Funding up to ₹50 Crores", "Collateral-free options", "Rates from 9.5% p.a."],
    hudData: {
      rate: "9.5% p.a.",
      time: "7-10 Days",
      metric: "Instant Vetting"
    }
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
    accent: "#13277E",
    features: ["Structured syndicate finance", "PSU & Private bank networks", "Flexible milestone matrices"],
    hudData: {
      rate: "₹5Cr - ₹100Cr",
      time: "Custom Terms",
      metric: "Top Tier Priority"
    }
  },
  {
    id: 2,
    badge: "Risk & Compliance Vetting",
    heading: "Guarantee Success with",
    headingAccent: "Pre-Underwriting",
    subtitle: "Pre-vet commercial loan files prior to bank submission to secure unmatched structural credibility.",
    cta1: "Apply Pre-Underwriting",
    cta2: "View Process",
    image: "/images/pages/indian-professional.png",
    accent: "#76A32B",
    features: ["92% Approval rating", "Credit risk pre-assessment", "Zero process gaps"],
    hudData: {
      rate: "92% Rate",
      time: "48 Hours",
      metric: "Risk Protected"
    }
  },
  {
    id: 3,
    badge: "Financial Reconstruction",
    heading: "Resolve Defaults &",
    headingAccent: "Repair Credit",
    subtitle: "Struggling with historical settlement records or complex CIBIL positions? Restore leverage now.",
    cta1: "Fix Credit Score",
    cta2: "Get Consulted",
    image: "/images/pages/handshake-india.png",
    accent: "#D97706",
    features: ["CIBIL optimization", "Removal of default records", "Strategic settlements"],
    hudData: {
      rate: "+150 Points",
      time: "Rapid Action",
      metric: "Score Restored"
    }
  }
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

  useEffect(() => {
    timerRef.current = setInterval(goNext, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  return (
    <section 
      id="hero" 
      className="relative bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] text-slate-900 w-full min-h-screen xl:h-screen flex flex-col justify-between overflow-hidden font-sans antialiased"
    >
      {/* Ambient Moving Gradient Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.08, 0.95, 1],
            x: [0, 20, -15, 0],
            y: [0, -30, 15, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.4] -right-20 -top-40 mix-blend-multiply transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${slide.accent}20 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.008)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Top Header Spacing Area */}
      <div className="w-full h-16 shrink-0" />

      {/* Viewport Dynamic Content Frame */}
      <div className="relative w-full max-w-[1440px] mx-auto flex-1 flex items-center z-10 px-4 sm:px-8 lg:px-16 py-4 lg:py-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 xl:gap-8 items-center">
          
          {/* Left Column Copy */}
          <div className="lg:col-span-5 flex flex-col items-start text-left order-2 lg:order-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`content-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {/* Section Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] mb-4 border bg-white/60 backdrop-blur-md shadow-xs transition-all duration-500"
                  style={{
                    color: slide.accent,
                    borderColor: `${slide.accent}30`
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.badge}
                </div>

                {/* Main Heading Text */}
                <h1 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[2.8rem] xl:text-[3.5rem] font-black leading-[1.1] tracking-tight text-slate-900 mb-4">
                  {slide.heading}{" "}
                  <span
                    className="block font-black tracking-tight mt-1"
                    style={{ color: slide.accent }}
                  >
                    {slide.headingAccent}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-[14px] xl:text-[16px] text-slate-600 font-medium leading-[1.6] max-w-md mb-6">
                  {slide.subtitle}
                </p>

                {/* Features Checkmarks */}
                <div className="flex flex-col gap-2.5 mb-6 w-full">
                  {slide.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border"
                        style={{ 
                          backgroundColor: `${slide.accent}10`, 
                          borderColor: `${slide.accent}30`,
                          color: slide.accent 
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[13px] xl:text-[14px] font-bold text-slate-700 tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Action Block */}
                <div className="flex flex-wrap gap-3.5 items-center">
                  <Button
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-12 px-6 rounded-xl text-[13px] font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}dd)`,
                      boxShadow: `0 8px 20px ${slide.accent}30`,
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
                    className="h-12 px-6 rounded-xl text-[13px] font-bold border-slate-200 bg-white/80 text-slate-700 backdrop-blur-md hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] cursor-pointer"
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

          {/* Right Column Showcase Asset with Interactive HUD HUD Layers */}
          <div className="lg:col-span-7 flex justify-center items-center order-1 lg:order-2 w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[unset]">
            <div className="relative w-full max-w-[640px] aspect-[16/10.5] sm:aspect-[16/10] lg:h-full lg:max-h-[460px] xl:max-h-[520px]">
              
              {/* Core Presentation Mask Frame */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-4 border-white bg-slate-200 z-10">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={`image-${current}`}
                    initial={{ opacity: 0, scale: 1.04, x: direction * 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.96, x: direction * -30 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.heading}
                      fill
                      className="object-cover object-center transform transition-transform duration-700 hover:scale-[1.02]"
                      priority
                      sizes="(max-w-lg) 100vw, 640px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* HUD OVERLAY 1: Top-Left Plate */}
              <AnimatePresence>
                <motion.div
                  key={`hud1-${current}`}
                  initial={{ opacity: 0, scale: 0.9, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
                  className="absolute -top-3 -left-3 sm:-left-6 z-20 bg-white/85 backdrop-blur-md border border-white/60 rounded-xl p-3 shadow-lg flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
                    <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Status Metrics</p>
                    <p className="text-[13px] font-black text-slate-800 mt-1">{slide.hudData.metric}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* HUD OVERLAY 2: Top-Right Glass Panel */}
              <AnimatePresence>
                <motion.div
                  key={`hud2-${current}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.15 }}
                  className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl p-3.5 text-white shadow-xl min-w-[130px] sm:min-w-[160px]"
                >
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Parameters</p>
                  <p className="text-[15px] sm:text-[18px] font-black mt-1.5 tracking-tight text-white">{slide.hudData.rate}</p>
                  <div className="w-full bg-white/20 h-[2px] rounded-full mt-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-white" 
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* HUD OVERLAY 3: Bottom-Left Time Panel */}
              <AnimatePresence>
                <motion.div
                  key={`hud3-${current}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ type: "spring", stiffness: 110, damping: 14, delay: 0.2 }}
                  className="absolute bottom-4 left-4 z-20 bg-white/70 backdrop-blur-lg border border-white/80 rounded-2xl p-3 shadow-xl max-w-[200px] sm:max-w-[240px] hidden sm:block"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Processing window</span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] font-extrabold text-slate-800 leading-tight">{slide.hudData.time} Turnaround</p>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>

      {/* Dock Segment Control Navigation Strip */}
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-16 pb-6 shrink-0 z-30">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-200/60 p-1.5 grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {[
            { id: 0, label: "Business Loans", icon: Building2 },
            { id: 1, label: "Project Finance", icon: TrendingUp },
            { id: 2, label: "Pre-Underwriting", icon: BadgeCheck },
            { id: 3, label: "Credit Repair", icon: Shield }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = current === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goTo(tab.id)}
                className={`relative flex items-center gap-3 px-4 py-2.5 xl:py-3.5 rounded-xl text-[12px] xl:text-[13px] font-bold transition-all duration-300 cursor-pointer border border-transparent overflow-hidden ${
                  isActive ? "text-white" : "text-slate-600 hover:text-slate-950 hover:bg-slate-50/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="lightDockTabIndicator"
                    className="absolute inset-0 z-0"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}dd)`,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 z-10 ${
                    isActive ? "bg-white/20 text-white shadow-sm" : "bg-slate-100/80 text-slate-400"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                </div>
                <span className="whitespace-nowrap truncate z-10 tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
