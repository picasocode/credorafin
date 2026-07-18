"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Shield,
  Building2,
  BadgeCheck,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Percent,
  TrendingUp as ChartIcon,
  Globe,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 0,
    badge: "Empowering Enterprises",
    headingWords: ["Accelerate", "Your MSME", "Growth"],
    subtitle: "Customized collateral-free funding solutions syndicated across 70+ banking partners globally.",
    cta1: "Build Finance",
    cta2: "Contact us",
    image: "/images/pages/hero-indian-team.png",
    hudLeft: { metric: "+18%", label: "Market Forecast", status: "Optimal Condition" },
    hudRight: { metric: "9.5% p.a.", label: "Average Interest Rate", trend: "Stable" },
    hudGraph: { value: "₹50 Crores", label: "Max Liquidity Pool Available" }
  },
  {
    id: 1,
    badge: "Infrastructure & Scale",
    headingWords: ["Raise", "Capital for", "Large Projects"],
    subtitle: "Specialized debt structuring, liquidity sourcing, and structured corporate finance built for industrial expansion.",
    cta1: "Raise Capital",
    cta2: "Contact us",
    image: "/images/pages/office-india.png",
    hudLeft: { metric: "Tier-1", label: "Sourcing Channel", status: "Priority Route" },
    hudRight: { metric: "₹100 Cr", label: "Maximum Allocation Cap", trend: "High Demand" },
    hudGraph: { value: "Syndicated", label: "Multi-Bank Framework Active" }
  },
  {
    id: 2,
    badge: "Risk & Compliance Vetting",
    headingWords: ["Guarantee", "Success via", "Pre-Underwriting"],
    subtitle: "Pre-vet commercial loan files prior to bank submission to secure unmatched structural credibility.",
    cta1: "Apply Vetting",
    cta2: "Contact us",
    image: "/images/pages/indian-professional.png",
    hudLeft: { metric: "92%", label: "Approval Probability", status: "Risk Maintained" },
    hudRight: { metric: "48 Hours", label: "Maximum File Audit Time", trend: "Rapid Track" },
    hudGraph: { value: "Zero Gaps", label: "Credit Risk Pre-Assessment" }
  },
  {
    id: 3,
    badge: "Financial Reconstruction",
    headingWords: ["Resolve", "Defaults &", "Repair Credit"],
    subtitle: "Struggling with historical settlement records or complex CIBIL positions? Restore corporate leverage now.",
    cta1: "Fix Credit Score",
    cta2: "Contact us",
    image: "/images/pages/handshake-india.png",
    hudLeft: { metric: "+150", label: "CIBIL Score Shift", status: "Engine Optimized" },
    hudRight: { metric: "Rapid", label: "Settlement Cycle Time", trend: "Immediate Plan" },
    hudGraph: { value: "Restored", label: "Removal of Legacy Default History" }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [4, -4]);
  const rotateY = useTransform(x, [-300, 300], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const goTo = useCallback((nextIndex: number) => {
    if (nextIndex === current) return;
    setDirection(nextIndex > current ? 1 : -1);
    setCurrent(nextIndex);
  }, [current]);

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
      className="relative bg-[#FAFBFD] w-full h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-12 pb-4 font-sans antialiased"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A225505_1px,transparent_1px),linear-gradient(to_bottom,#1A225505_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.03, 0.97, 1], x: [0, 8, -8, 0], y: [0, -6, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-[0.25] top-[-10%] left-[30%]"
          style={{ background: `radial-gradient(circle, #1A225535 0%, transparent 70%)` }}
        />
      </div>

      {/* THREE-COLUMN GRID CONTAINER */}
      <div className="relative w-full max-w-[1440px] mx-auto flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 items-center justify-center z-10 min-h-0 pt-3">
        
        {/* LEFT COLUMN: GROWTH INDEX RADAR */}
        <div className="hidden xl:flex xl:col-span-3 flex-col h-full justify-center pr-2 border-r border-neutral-200/30">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-neutral-200/40 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A2255]/60">Syndication Index</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ChartIcon className="w-2.5 h-2.5" /> +24.8%
              </span>
            </div>
            
            {/* Live Rendered Analytics Vector Graph */}
            <div className="h-28 w-full bg-neutral-50/50 rounded-xl relative overflow-hidden border border-neutral-200/30 p-2 flex items-end">
              <svg className="absolute inset-0 w-full h-full p-1 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A2255" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#1A2255" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 Q15,28 30,32 T60,15 T90,8 L100,5 L100,40 L0,40 Z" fill="url(#chartGlow)" />
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  d="M0,35 Q15,28 30,32 T60,15 T90,8 L100,5" 
                  fill="none" 
                  stroke="#1A2255" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex justify-between w-full text-[8px] font-bold text-neutral-400 z-10">
                <span>Q1 2026</span>
                <span>Active Projection</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-[11px] font-bold text-[#1A2255]">Institutional Capital Flow</span>
              <p className="text-[9px] text-neutral-400 leading-normal">Real-time optimization matrix monitoring continuous multi-bank liquidity deployment.</p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: MAIN INTERACTIVE HERO DISPLAY */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="xl:col-span-6 flex flex-col items-center justify-center text-center gap-4 min-h-0 w-full"
        >
          {/* Typography cluster */}
          <div className="flex flex-col items-center max-w-xl w-full tracking-tight shrink-0">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] mb-2 border bg-white text-[#1A2255] border-[#1A2255]/15 shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-[#1A2255]" />
              {slide.badge}
            </motion.div>

            {/* Dynamic Interactive Typewriter Header */}
            <h1 className="text-[2.2rem] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.2rem] font-black tracking-[-0.03em] leading-[1.15] text-[#1A2255] min-h-[110px] sm:min-h-[140px] flex flex-col justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`h-${current}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-neutral-950"
                >
                  {slide.headingWords.slice(0, -1).join(" ")}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`h2-${current}`}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="block text-[#1A2255] relative after:content-[''] after:absolute after:-right-1 after:bottom-1 after:w-[3px] after:h-[80%] after:bg-[#1A2255] after:animate-pulse whitespace-nowrap overflow-hidden"
                >
                  {slide.headingWords[slide.headingWords.length - 1]}
                </motion.span>
              </AnimatePresence>
            </h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[13px] sm:text-[14px] text-neutral-500 font-medium leading-[1.5] max-w-md mt-2 mb-3.5"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Premium Action Pills */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2.5 w-full z-20">
              <Button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="h-9 px-6 rounded-full text-[11px] font-bold text-white transition-all duration-300 bg-[#1A2255] hover:bg-[#151B44] shadow-md active:scale-[0.98] cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  {slide.cta1}
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="h-9 px-6 rounded-full text-[11px] font-bold border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 shadow-xs transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  {slide.cta2}
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 stroke-[2.5]" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* VIEWPORT CONTROLLER CARD */}
          <motion.div variants={itemVariants} className="relative w-full max-w-[780px] flex-1 min-h-0 flex items-center justify-center perspective-[1200px] mb-1">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full max-h-[300px] aspect-[21/9] sm:aspect-[24/10] rounded-[24px] border-4 border-white shadow-[0_20px_50px_-12px_rgba(26,34,85,0.08)] bg-neutral-100 transition-all duration-300 ease-out"
            >
              <div className="absolute inset-0 w-full h-full rounded-[20px] overflow-hidden z-10">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={`img-${current}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={slide.image}
                      alt="Credora Underwriting"
                      fill
                      className="object-cover object-center transform transition-transform duration-1000 brightness-[0.97]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2255]/5 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* HUD FLOATER LEFT */}
              <AnimatePresence>
                <motion.div
                  key={`hl-${current}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: -14 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 100, damping: 14 }}
                  className="absolute top-[12%] -left-4 z-20 bg-white/95 backdrop-blur-xl border border-neutral-200/40 rounded-xl p-2.5 shadow-md flex flex-col gap-0.5 min-w-[115px] text-left"
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#1A2255]/5 text-[#1A2255] mb-0.5">
                    <Percent className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-[15px] font-black text-neutral-900 tracking-tight leading-none">{slide.hudLeft.metric}</span>
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{slide.hudLeft.label}</span>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 rounded px-1 py-0.5 mt-1 block w-max">{slide.hudLeft.status}</span>
                </motion.div>
              </AnimatePresence>

              {/* HUD FLOATER RIGHT */}
              <AnimatePresence>
                <motion.div
                  key={`hr-${current}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 14 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ type: "spring", stiffness: 100, damping: 14 }}
                  className="absolute top-[18%] -right-4 z-20 bg-[#1A2255]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-white shadow-xl min-w-[140px] text-left"
                >
                  <span className="text-[8px] text-neutral-300 font-bold uppercase tracking-widest block mb-1">{slide.hudRight.label}</span>
                  <p className="text-[14px] font-black tracking-tight text-white leading-none">{slide.hudRight.metric}</p>
                  <p className="text-[9px] text-neutral-300 font-medium mt-1">Status: {slide.hudRight.trend}</p>
                </motion.div>
              </AnimatePresence>

              {/* HUD FLOATER BOTTOM */}
              <AnimatePresence>
                <motion.div
                  key={`hb-${current}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-3 left-4 z-20 bg-white/95 backdrop-blur-md border border-neutral-200/40 rounded-lg p-1.5 px-3 shadow-md max-w-[280px] text-left hidden sm:flex items-center gap-2.5"
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#1A2255] text-white shrink-0">
                    <Clock className="w-2.5 h-2.5" />
                  </div>
                  <div className="truncate flex items-center gap-2 text-[10px]">
                    <span className="font-black text-[#1A2255] tracking-tight">{slide.hudGraph.value}</span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-neutral-500 truncate font-medium">{slide.hudGraph.label}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: STRUCTURAL REAL-TIME TIMELINE ACTION */}
        <div className="hidden xl:flex xl:col-span-3 flex-col h-full justify-center pl-2 border-l border-neutral-200/30">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-neutral-200/40 shadow-xs flex flex-col gap-3 text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A2255]/60">Processing Pipelines</span>
            
            <div className="flex flex-col gap-3 relative before:content-[''] after:clear-both before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-200">
              {[
                { label: "File Verification Pipeline", desc: "Automated structure engine parsing metrics", icon: Globe, current: true },
                { label: "Syndication Matching Engine", desc: "Mapping structures against active channels", icon: Briefcase, current: false }
              ].map((node, i) => (
                <div key={i} className="flex gap-3 items-start relative z-10">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${node.current ? "bg-[#1A2255] shadow-sm animate-pulse" : "bg-neutral-300"}`}>
                    <node.icon className="w-2 h-2" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-[11px] font-bold ${node.current ? "text-[#1A2255]" : "text-neutral-700"}`}>{node.label}</span>
                    <span className="text-[9px] text-neutral-400 leading-tight">{node.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200/40 pt-2 mt-1 flex items-center justify-between">
              <span className="text-[9px] text-neutral-400 font-medium">Gateway Health:</span>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" /> Nominal (99.98%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* THREE-WAY DOCK SELECTOR BAR */}
      <div className="w-full max-w-[920px] mx-auto shrink-0 z-30 pt-1">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xs border border-neutral-200/40 p-1 grid grid-cols-2 md:grid-cols-4 gap-1">
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
                className={`relative flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive ? "text-white shadow-xs" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="perfectTabIndicator"
                    className="absolute inset-0 z-0 bg-[#1A2255]"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <TabIcon className={`w-3.5 h-3.5 z-10 shrink-0 ${isActive ? "text-white" : "text-neutral-400"}`} />
                <span className="whitespace-nowrap truncate z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
