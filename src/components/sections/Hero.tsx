"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Shield,
  Building2,
  Zap,
  BadgeCheck,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA (Ultra-Premium Centered Theme)
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    badge: "Empowering Enterprises",
    heading: "Accelerate Your MSME Growth",
    subtitle: "Customized collateral-free funding solutions syndicated across 70+ banking partners globally.",
    cta1: "Build Finance",
    cta2: "Contact us",
    image: "/images/pages/hero-indian-team.png",
    accent: "#304AC0",
    hudLeft: { metric: "+18°", label: "Market Forecast", status: "Optimal Condition" },
    hudRight: { metric: "9.5% p.a.", label: "Average Interest Rate", trend: "Stable" },
    hudGraph: { value: "₹50 Crores", label: "Max Liquidity Pool Available" }
  },
  {
    id: 1,
    badge: "Infrastructure & Scale",
    heading: "Raise Capital for Large Projects",
    subtitle: "Specialized debt structuring, liquidity sourcing, and structured corporate finance built for industrial expansion.",
    cta1: "Raise Capital",
    cta2: "Contact us",
    image: "/images/pages/office-india.png",
    accent: "#13277E",
    hudLeft: { metric: "Tier-1", label: "Sourcing Channel", status: "Priority Route" },
    hudRight: { metric: "₹100 Cr", label: "Maximum Allocation Cap", trend: "High Demand" },
    hudGraph: { value: "Syndicated", label: "Multi-Bank Framework Active" }
  },
  {
    id: 2,
    badge: "Risk & Compliance Vetting",
    heading: "Guarantee Success via Pre-Underwriting",
    subtitle: "Pre-vet commercial loan files prior to bank submission to secure unmatched structural credibility.",
    cta1: "Apply Vetting",
    cta2: "Contact us",
    image: "/images/pages/indian-professional.png",
    accent: "#76A32B",
    hudLeft: { metric: "92%", label: "Approval Probability", status: "Risk Maintained" },
    hudRight: { metric: "48 Hours", label: "Maximum File Audit Time", trend: "Rapid Track" },
    hudGraph: { value: "Zero Gaps", label: "Credit Risk Pre-Assessment" }
  },
  {
    id: 3,
    badge: "Financial Reconstruction",
    heading: "Resolve Defaults & Repair Credit",
    subtitle: "Struggling with historical settlement records or complex CIBIL positions? Restore corporate leverage now.",
    cta1: "Fix Credit Score",
    cta2: "Contact us",
    image: "/images/pages/handshake-india.png",
    accent: "#D97706",
    hudLeft: { metric: "+150", label: "CIBIL Score Shift", status: "Engine Optimized" },
    hudRight: { metric: "Rapid", label: "Settlement Cycle Time", trend: "Immediate Plan" },
    hudGraph: { value: "Restored", label: "Removal of Legacy Default History" }
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  // 3D Parallax Tilt Effects for the Hero Frame Card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [8, -8]);
  const rotateY = useTransform(x, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
    timerRef.current = setInterval(goNext, 8500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  return (
    <section 
      id="hero" 
      className="relative bg-gradient-to-b from-[#FAFBFD] via-[#F4F6FA] to-[#EBF0F6] text-slate-900 w-full min-h-screen h-screen flex flex-col justify-between overflow-hidden font-sans antialiased select-none"
    >
      {/* Background Ambience Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.08, 0.95, 1],
            x: [0, 30, -20, 0],
            y: [0, -15, 25, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[650px] h-[650px] rounded-full blur-[130px] opacity-[0.22] top-[-5%] left-[30%]"
          style={{
            background: `radial-gradient(circle, ${slide.accent}40 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:40px_40px] opacity-40" />
      </div>

      {/* 1. TOP SAFE AREA SPACER */}
      <div className="w-full h-16 shrink-0" />

      {/* 2. PERSPECTIVE CONTENT FRAME CONTAINER */}
      <div className="relative w-full max-w-[1200px] mx-auto flex-1 flex flex-col items-center justify-center z-10 px-6 text-center gap-8 lg:gap-10 max-h-[calc(100vh-160px)]">
        
        {/* TEXT REGION HEADLINE ARCHITECTURE */}
        <div className="flex flex-col items-center max-w-3xl w-full tracking-tight shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`badge-${current}`}
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] mb-4 border bg-white/80 backdrop-blur-md shadow-xs text-neutral-500 border-neutral-200/50"
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: slide.accent }} />
              {slide.badge}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={`heading-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.6rem] sm:text-[3.6rem] md:text-[4.2rem] lg:text-[4.5rem] font-black tracking-[-0.04em] leading-[1.08] text-neutral-950 max-w-2xl"
            >
              {slide.heading}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`sub-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="text-[14px] sm:text-[15px] md:text-[16px] text-neutral-500 font-medium leading-[1.5] max-w-xl mt-4 mb-6"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Centered Minimal Action Buttons Layout */}
          <div className="flex items-center justify-center gap-3 w-full z-20">
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-11 px-7 rounded-full text-[13px] font-bold text-white transition-all duration-300 bg-neutral-950 hover:bg-neutral-800 shadow-[0_4px_14px_rgba(0,0,0,0.08)] active:scale-[0.97] cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                {slide.cta1}
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-11 px-7 rounded-full text-[13px] font-bold border-neutral-200 bg-white/95 text-neutral-700 backdrop-blur-xs hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 active:scale-[0.97] cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                {slide.cta2}
                <ArrowUpRight className="w-4 h-4 text-neutral-400 stroke-[2.5]" />
              </span>
            </Button>
          </div>
        </div>

        {/* 3D PARALLAX CANVAS ASPECT LAYER CONTAINER */}
        <div className="relative w-full max-w-[960px] flex-1 flex items-center justify-center px-4 perspective-[1500px]">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full aspect-[21/9] rounded-[32px] border-4 border-white shadow-[0_35px_80px_-15px_rgba(0,0,0,0.09)] bg-neutral-100 transition-all duration-300 ease-out"
          >
            {/* Infinite Curvature Asset Frame */}
            <div className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden z-10">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={slide.image}
                    alt={slide.heading}
                    fill
                    className="object-cover object-center transform transition-transform duration-1000 brightness-[0.97]"
                    priority
                    sizes="(max-w-xl) 100vw, 960px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/5 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* HUD COMPONENT 1: Weather/Status Left Float Panel */}
            <AnimatePresence>
              <motion.div
                key={`hl-${current}`}
                initial={{ opacity: 0, x: -25, y: -10 }}
                animate={{ opacity: 1, x: -24, y: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.08 }}
                style={{ transform: "translateZ(40px)" }}
                className="absolute top-[15%] -left-6 z-20 bg-white/80 backdrop-blur-xl border border-white/75 rounded-2xl p-3.5 shadow-xl flex flex-col gap-1 min-w-[130px] text-left border-neutral-200/20"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-neutral-50 text-neutral-500 mb-0.5">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span className="text-[20px] font-black text-neutral-900 tracking-tight leading-none">{slide.hudLeft.metric}</span>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{slide.hudLeft.label}</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded-md px-1.5 py-0.5 mt-1 block w-max">{slide.hudLeft.status}</span>
              </motion.div>
            </AnimatePresence>

            {/* HUD COMPONENT 2: Top Right Graph Metric Unit Block */}
            <AnimatePresence>
              <motion.div
                key={`hr-${current}`}
                initial={{ opacity: 0, x: 25, y: 10 }}
                animate={{ opacity: 1, x: 24, y: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.12 }}
                style={{ transform: "translateZ(50px)" }}
                className="absolute top-[20%] -right-6 z-20 bg-neutral-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white shadow-2xl min-w-[170px] text-left"
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{slide.hudRight.label}</span>
                  <div className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 h-1.5 bg-white/30 rounded-full animate-pulse" />
                    <span className="w-0.5 h-3 bg-white/80 rounded-full" />
                    <span className="w-0.5 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <p className="text-[18px] font-black tracking-tight text-white leading-none">{slide.hudRight.metric}</p>
                <p className="text-[10px] text-neutral-400 font-medium mt-1">Trend: {slide.hudRight.trend}</p>
              </motion.div>
            </AnimatePresence>

            {/* HUD COMPONENT 3: Absolute Bottom Action Row (Overlay Pill Cutout) */}
            <AnimatePresence>
              <motion.div
                key={`hb-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ type: "spring", stiffness: 110, damping: 15, delay: 0.18 }}
                style={{ transform: "translateZ(30px)" }}
                className="absolute bottom-4 left-6 z-20 bg-white/90 backdrop-blur-md border border-neutral-200/40 rounded-xl p-2 px-3.5 shadow-lg max-w-[320px] text-left hidden sm:flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-neutral-900 text-white shrink-0">
                  <Clock className="w-3 h-3" />
                </div>
                <div className="truncate flex items-center gap-2">
                  <span className="text-[12px] font-black text-neutral-950 tracking-tight">{slide.hudGraph.value}</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-[11px] text-neutral-500 truncate font-medium">{slide.hudGraph.label}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* 3. FOOTER TAB SYSTEM NAVIGATION STRIP */}
      <div className="w-full max-w-[1020px] mx-auto px-6 pb-6 shrink-0 z-30">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.01)] border border-neutral-200/50 p-1.5 grid grid-cols-2 md:grid-cols-4 gap-1.5">
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
                className={`relative flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive ? "text-white shadow-xs" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="perfectTabIndicator"
                    className="absolute inset-0 z-0 bg-neutral-950"
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
