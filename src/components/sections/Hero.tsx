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
  TrendingDown,
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
    hudGraph: { value: "₹50 Crores", label: "Max Liquidity Pool Available", type: "success" }
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
    hudGraph: { value: "Syndicated", label: "Multi-Bank Framework Active", type: "neutral" }
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
    hudGraph: { value: "Zero Gaps", label: "Credit Risk Pre-Assessment", type: "success" }
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
    hudGraph: { value: "Restored", label: "Removal of Legacy Default History", type: "alert" }
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
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

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
      className="relative bg-gradient-to-b from-[#FAFBFD] via-[#F4F6FA] to-[#EBF0F6] text-slate-900 w-full min-h-screen h-screen flex flex-col justify-between overflow-hidden font-sans antialiased"
    >
      {/* Dynamic Ambient Fluid Light Waves */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.12, 0.93, 1],
            x: [0, 40, -30, 0],
            y: [0, -20, 35, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-[0.25] top-[-10%] left-[25%] transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${slide.accent}40 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />
      </div>

      {/* 1. TOP NAVBAR BLOCK BUFFER */}
      <div className="w-full h-14 shrink-0" />

      {/* 2. CENTERED CINEMATIC LAYOUT CANVAS */}
      <div className="relative w-full max-w-[1340px] mx-auto flex-1 flex flex-col items-center justify-center z-10 px-4 sm:px-6 text-center gap-5 lg:gap-6 max-h-[calc(100vh-130px)]">
        
        {/* TEXT CONTENT HUB WITH SPRING ANIMATION */}
        <div className="flex flex-col items-center max-w-4xl w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`badge-${current}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] mb-4 border bg-white/70 backdrop-blur-md shadow-xs text-neutral-600 border-neutral-200/60"
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: slide.accent }} />
              {slide.badge}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={`heading-${current}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.4rem] sm:text-[3.4rem] md:text-[4rem] lg:text-[4.4rem] font-black tracking-[-0.04em] leading-[1.05] text-[#0A0A0A] max-w-3xl"
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
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[14px] sm:text-[15px] md:text-[16px] text-neutral-500 font-medium leading-[1.5] max-w-2xl mt-4 mb-5 tracking-tight"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Action Pills */}
          <div className="flex items-center justify-center gap-3 w-full z-20">
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-11 px-7 rounded-full text-[13px] font-bold text-white transition-all duration-300 bg-neutral-900 hover:bg-neutral-800 shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.97] cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                {slide.cta1}
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-11 px-7 rounded-full text-[13px] font-bold border-neutral-200 bg-white/90 text-neutral-700 backdrop-blur-sm hover:bg-neutral-50 transition-all duration-300 active:scale-[0.97] cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                {slide.cta2}
                <ArrowUpRight className="w-4 h-4 text-neutral-400 stroke-[2.5]" />
              </span>
            </Button>
          </div>
        </div>

        {/* 3D INTERACTIVE FLUID CARD ENGINE + OVERLAYS */}
        <div className="relative w-full max-w-[1080px] flex-1 min-h-[240px] sm:min-h-[300px] md:min-h-[360px] lg:max-h-[430px] w-full px-4 sm:px-12 md:px-16 perspective-[1200px]">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-full rounded-[32px] overflow-visible border-4 border-white shadow-[0_30px_70px_-10px_rgba(0,0,0,0.08)] bg-neutral-200 transition-all duration-200 ease-out"
          >
            {/* The Cinematic Media Container */}
            <div className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden z-10">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={slide.image}
                    alt={slide.heading}
                    fill
                    className="object-cover object-center transform transition-transform duration-1000 brightness-[0.96]"
                    priority
                    sizes="(max-w-xl) 100vw, 1080px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/10 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* HUD CARD 1: Left Hanging Data Pod */}
            <AnimatePresence>
              <motion.div
                key={`hl-${current}`}
                initial={{ opacity: 0, x: -30, y: -10 }}
                animate={{ opacity: 1, x: -20, y: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ type: "spring", stiffness: 90, damping: 12, delay: 0.1 }}
                style={{ transform: "translateZ(40px)" }}
                className="absolute top-[18%] -left-4 sm:left-2 z-20 bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-3.5 shadow-xl flex flex-col gap-1 min-w-[120px] sm:min-w-[140px] text-left"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-neutral-100 text-neutral-500 mb-1">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span className="text-[20px] font-black text-neutral-900 tracking-tight leading-none">{slide.hudLeft.metric}</span>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{slide.hudLeft.label}</span>
                <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 rounded-md px-1 py-0.5 mt-1 block w-max">{slide.hudLeft.status}</span>
              </motion.div>
            </AnimatePresence>

            {/* HUD CARD 2: Right Glass Parameter Block (Dark Theme Accent Layer) */}
            <AnimatePresence>
              <motion.div
                key={`hr-${current}`}
                initial={{ opacity: 0, x: 30, y: 10 }}
                animate={{ opacity: 1, x: 20, y: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ type: "spring", stiffness: 95, damping: 13, delay: 0.15 }}
                style={{ transform: "translateZ(55px)" }}
                className="absolute top-[25%] -right-4 sm:right-4 z-20 bg-neutral-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white shadow-2xl min-w-[150px] sm:min-w-[190px] text-left"
              >
                {/* Simulated Chart Wave Header */}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{slide.hudRight.label}</span>
                  <div className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 h-2 bg-white/40 rounded-full" />
                    <span className="w-0.5 h-3 bg-white rounded-full" />
                    <span className="w-0.5 h-1 bg-white/30 rounded-full" />
                    <span className="w-0.5 h-2.5 bg-white/80 rounded-full" />
                  </div>
                </div>
                <p className="text-[16px] sm:text-[20px] font-black tracking-tight text-white leading-none">{slide.hudRight.metric}</p>
                <p className="text-[10px] text-neutral-400 font-bold tracking-wide mt-1">Status: {slide.hudRight.trend}</p>
              </motion.div>
            </AnimatePresence>

            {/* HUD CARD 3: Bottom Left Premium Transaction Drawer */}
            <AnimatePresence>
              <motion.div
                key={`hb-${current}`}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.2 }}
                style={{ transform: "translateZ(30px)" }}
                className="absolute bottom-5 left-6 sm:left-12 z-20 bg-white/85 backdrop-blur-xl border border-neutral-200/50 rounded-2xl p-3 px-4 shadow-xl max-w-[280px] sm:max-w-[360px] text-left hidden sm:flex items-center gap-3.5"
              >
                <div className="h-10 px-3.5 bg-neutral-900 text-white rounded-xl flex flex-col justify-center items-center font-black tracking-tight shrink-0">
                  <span className="text-[13px] leading-none">LIVE</span>
                  <span className="text-[8px] tracking-widest text-emerald-400 mt-0.5">RUN</span>
                </div>
                <div className="truncate">
                  <span className="text-[13px] font-black text-neutral-900 tracking-tight block">{slide.hudGraph.value}</span>
                  <span className="text-[11px] text-neutral-500 block truncate font-medium mt-0.5">{slide.hudGraph.label}</span>
                </div>
              </motion.div>
            </AnimatePresence>

          </motion.div>
        </div>
      </div>

      {/* 3. FOOTER HORIZONTAL NAV DOCK */}
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 pb-5 shrink-0 z-30">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] border border-neutral-200/60 p-1.5 grid grid-cols-2 md:grid-cols-4 gap-1">
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
                className={`relative flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl text-[12px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive ? "text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="impressiveTabIndicator"
                    className="absolute inset-0 z-0 bg-neutral-950"
                    transition={{ type: "spring", stiffness: 430, damping: 33 }}
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
