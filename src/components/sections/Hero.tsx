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
  Briefcase,
  ChevronRight
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
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  // 3D Tilt Effect Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [6, -6]);
  const rotateY = useTransform(x, [-300, 300], [-6, 6]);

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
    timerRef.current = setInterval(goNext, 8500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  return (
    <section 
      id="hero" 
      className="relative bg-[#FAFBFD] w-full h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-10 pb-4 font-sans antialiased"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* 1. BACKGROUND ENGINE (Grid Matrix & Radial Glows) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A225504_1px,transparent_1px),linear-gradient(to_bottom,#1A225504_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* Dynamic Ambient Background Light Aura */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 0.95, 1], 
            x: [0, 15, -15, 0], 
            y: [0, -10, 10, 0] 
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[650px] h-[650px] rounded-full blur-[140px] opacity-[0.22] top-[-15%] left-[28%]"
          style={{ background: `radial-gradient(circle, #1A225540 0%, transparent 70%)` }}
        />
      </div>

      {/* 2. THE THREE-COLUMN SYSTEM */}
      <div className="relative w-full max-w-[1400px] mx-auto flex-1 grid grid-cols-1 xl:grid-cols-12 gap-5 items-center justify-center z-10 min-h-0 pt-3">
        
        {/* LEFT COLUMN: LIVE INVESTMENT STRATEGY DECK */}
        <div className="hidden xl:flex xl:col-span-3 flex-col h-full justify-center pr-3 border-r border-neutral-200/40">
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-neutral-200/50 shadow-[0_10px_30px_-15px_rgba(26,34,85,0.05)] flex flex-col gap-3.5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#1A2255]/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold tracking-[0.12em] text-[#1A2255]/70 bg-[#1A2255]/5 px-2 py-0.5 rounded-md">Live Yield Matrix</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ChartIcon className="w-2.5 h-2.5" /> +28.4%
              </span>
            </div>
            
            {/* Visual Micro-Graph */}
            <div className="h-24 w-full bg-neutral-50/70 rounded-xl relative overflow-hidden border border-neutral-200/40 p-2 flex items-end">
              <svg className="absolute inset-0 w-full h-full p-1 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlowAccent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A2255" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#1A2255" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,38 Q12,24 28,30 T55,14 T85,6 L100,2 L100,40 L0,40 Z" fill="url(#chartGlowAccent)" />
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  d="M0,38 Q12,24 28,30 T55,14 T85,6 L100,2" 
                  fill="none" 
                  stroke="#1A2255" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex justify-between w-full text-[8px] font-bold text-neutral-400 z-10">
                <span>FY26 PROJ</span>
                <span className="text-[#1A2255] tracking-wide">OPTIMAL LAYER</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-[11px] font-black tracking-tight text-[#1A2255]">Syndicated Liquidity Pool</span>
              <p className="text-[9.5px] text-neutral-500 font-medium leading-[1.45]">Automated placement algorithm monitoring institutional capital streams across top-tier banking networks live.</p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: HIGH-END PRESENTATION ENGINE */}
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
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] mb-2 border bg-white text-[#1A2255] border-[#1A2255]/15 shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-[#1A2255]" />
              {slide.badge}
            </motion.div>

            {/* Dynamic Sliding Text Heading Cluster */}
            <h1 className="text-[2.2rem] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.2rem] font-black tracking-[-0.03em] leading-[1.12] text-neutral-950 min-h-[110px] sm:min-h-[135px] flex flex-col justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`h1-${current}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  {slide.headingWords.slice(0, -1).join(" ")}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`h2-${current}`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="block text-[#1A2255] relative after:content-[''] after:absolute after:-right-1.5 after:bottom-1 after:w-[3px] after:h-[75%] after:bg-[#1A2255] after:animate-pulse whitespace-nowrap overflow-hidden pr-1.5"
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

            {/* Premium Pill Actions */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2.5 w-full z-20">
              <Button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="h-9 px-6 rounded-full text-[11px] font-bold text-white transition-all duration-300 bg-[#1A2255] hover:bg-[#141b44] shadow-md hover:shadow-lg hover:shadow-[#1A2255]/10 active:scale-[0.98] cursor-pointer group"
              >
                <span className="flex items-center gap-1">
                  {slide.cta1}
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="h-9 px-6 rounded-full text-[11px] font-bold border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 shadow-xs transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  {slide.cta2}
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 stroke-[2.5]" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* MAIN INTERACTIVE DEVICE CANVAS (3D PARALLAX FRAME) */}
          <motion.div variants={itemVariants} className="relative w-full max-w-[760px] flex-1 min-h-0 flex items-center justify-center perspective-[1200px] mb-1">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full max-h-[290px] aspect-[21/9] sm:aspect-[24/10] rounded-[24px] border-4 border-white shadow-[0_25px_50px_-15px_rgba(26,34,85,0.08)] bg-neutral-100 transition-all duration-300 ease-out"
            >
              <div className="absolute inset-0 w-full h-full rounded-[20px] overflow-hidden z-10">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={`img-${current}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={slide.image}
                      alt="Credora Enterprise Funding Platform"
                      fill
                      className="object-cover object-center transform transition-transform duration-1000 brightness-[0.97]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2255]/5 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* FLOATER 1: Left Metric */}
              <AnimatePresence>
                <motion.div
                  key={`hl-${current}`}
                  initial={{ opacity: 0, x: -25, scale: 0.95 }}
                  animate={{ opacity: 1, x: -14, scale: 1 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 100, damping: 14 }}
                  className="absolute top-[12%] -left-4 z-20 bg-white/95 backdrop-blur-xl border border-neutral-200/40 rounded-xl p-2.5 shadow-md flex flex-col gap-0.5 min-w-[120px] text-left"
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#1A2255]/5 text-[#1A2255] mb-0.5">
                    <Percent className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-[15px] font-black text-neutral-900 tracking-tight leading-none">{slide.hudLeft.metric}</span>
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{slide.hudLeft.label}</span>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 rounded px-1 py-0.5 mt-1 block w-max">{slide.hudLeft.status}</span>
                </motion.div>
              </AnimatePresence>

              {/* FLOATER 2: Right Premium Parameter Block */}
              <AnimatePresence>
                <motion.div
                  key={`hr-${current}`}
                  initial={{ opacity: 0, x: 25, scale: 0.95 }}
                  animate={{ opacity: 1, x: 14, scale: 1 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ type: "spring", stiffness: 100, damping: 14 }}
                  className="absolute top-[16%] -right-4 z-20 bg-[#1A2255]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-white shadow-xl min-w-[145px] text-left"
                >
                  <span className="text-[8px] text-neutral-300 font-bold uppercase tracking-widest block mb-1">{slide.hudRight.label}</span>
                  <p className="text-[14px] font-black tracking-tight text-white leading-none">{slide.hudRight.metric}</p>
                  <p className="text-[9px] text-neutral-300 font-medium mt-1">Status: {slide.hudRight.trend}</p>
                </motion.div>
              </AnimatePresence>

              {/* FLOATER 3: Bottom Ticker */}
              <AnimatePresence>
                <motion.div
                  key={`hb-${current}`}
                  initial={{ opacity: 0, y: 15 }}
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

        {/* RIGHT COLUMN: STRUCTURAL COMPLIANCE ENGINE TIMELINE */}
        <div className="hidden xl:flex xl:col-span-3 flex-col h-full justify-center pl-3 border-l border-neutral-200/40">
          <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-4 border border-neutral-200/50 shadow-[0_10px_30px_-15px_rgba(26,34,85,0.05)] flex flex-col gap-3.5 text-left relative overflow-hidden">
            <span className="text-[9px] uppercase font-bold tracking-[0.12em] text-[#1A2255]/70 bg-[#1A2255]/5 px-2 py-0.5 rounded-md w-max">System Pipelines</span>
            
            <div className="flex flex-col gap-3.5 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-200/80">
              {[
                { label: "Verification Engine", desc: "Parsing core structure criteria assets", icon: Globe, current: true },
                { label: "Syndication Routing", desc: "Matching capital parameters to channels", icon: Briefcase, current: false }
              ].map((node, i) => (
                <div key={i} className="flex gap-3 items-start relative z-10 group/node">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 transition-transform duration-300 ${node.current ? "bg-[#1A2255] shadow-sm scale-110" : "bg-neutral-300"}`}>
                    <node.icon className="w-2 h-2" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-[11px] font-bold tracking-tight transition-colors duration-300 ${node.current ? "text-[#1A2255]" : "text-neutral-700"}`}>{node.label}</span>
                    <span className="text-[9px] text-neutral-400 font-medium leading-tight">{node.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200/50 pt-2.5 mt-0.5 flex items-center justify-between">
              <span className="text-[9px] text-neutral-400 font-bold">API Gateways:</span>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" /> Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PREMIUM TABS NAVIGATION DOCK STRIP */}
      <div className="w-full max-w-[900px] mx-auto shrink-0 z-30 pt-1">
        <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_5px_20px_-5px_rgba(0,0,0,0.03)] border border-neutral-200/50 p-1.5 grid grid-cols-2 md:grid-cols-4 gap-1">
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
                className={`relative flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive ? "text-white" : "text-neutral-500 hover:text-[#1A2255]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="perfectTabIndicatorPremium"
                    className="absolute inset-0 z-0 bg-[#1A2255]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <TabIcon className={`w-3.5 h-3.5 z-10 shrink-0 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-white" : "text-neutral-400 group-hover:text-[#1A2255]"}`} />
                <span className="whitespace-nowrap truncate z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
