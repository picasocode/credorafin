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

  // 3D Parallax Tilt Effects for the Image Frame Card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [6, -6]);
  const rotateY = useTransform(x, [-300, 300], [-6, 6]);

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
      className="relative bg-gradient-to-b from-[#FAFBFD] via-[#F4F6FA] to-[#EBF0F6] text-slate-900 w-full h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden font-sans antialiased select-none px-4 sm:px-6 md:px-8 pb-4"
    >
      {/* Background Subtle Organic Lighting Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.05, 0.98, 1],
            x: [0, 15, -15, 0],
            y: [0, -10, 15, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.18] top-[-5%] left-[35%]"
          style={{
            background: `radial-gradient(circle, ${slide.accent}40 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:36px_36px] opacity-30" />
      </div>

      {/* 1. CENTRAL CONTAINER: Auto-balances Typography vs Media Box without Overflow */}
      <div className="relative w-full max-w-[1140px] mx-auto flex-1 flex flex-col items-center justify-center z-10 text-center gap-4 min-h-0 pt-4">
        
        {/* TEXT CONTENT CLUSTER */}
        <div className="flex flex-col items-center max-w-2xl w-full tracking-tight shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`badge-${current}`}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] mb-2 border bg-white/80 backdrop-blur-md text-neutral-500 border-neutral-200/60 shadow-xs"
            >
              <Sparkles className="w-3 h-3" style={{ color: slide.accent }} />
              {slide.badge}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={`heading-${current}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[3.6rem] font-black tracking-[-0.03em] leading-[1.1] text-neutral-950"
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
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-[13px] sm:text-[14px] md:text-[15px] text-neutral-500 font-medium leading-[1.45] max-w-lg mt-2 mb-3"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Action Button Pills */}
          <div className="flex items-center justify-center gap-2.5 w-full z-20">
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-9 px-5 rounded-full text-[12px] font-bold text-white transition-all duration-300 bg-neutral-950 hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
            >
              <span className="flex items-center gap-1">
                {slide.cta1}
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-9 px-5 rounded-full text-[12px] font-bold border-neutral-200 bg-white/95 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              <span className="flex items-center gap-1">
                {slide.cta2}
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 stroke-[2.5]" />
              </span>
            </Button>
          </div>
        </div>

        {/* DYNAMIC FILL CANVAS LAYER (Strictly bounded container preventing vertical spill) */}
        <div className="relative w-full max-w-[920px] flex-1 min-h-0 w-full flex items-center justify-center perspective-[1500px] mb-2">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-full max-h-[340px] aspect-[21/9] sm:aspect-[24/10] lg:aspect-[21/9] rounded-[24px] border-4 border-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.07)] bg-neutral-100 transition-all duration-300 ease-out"
          >
            {/* Smooth Cinematic Mask Asset Layer */}
            <div className="absolute inset-0 w-full h-full rounded-[20px] overflow-hidden z-10">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={slide.image}
                    alt={slide.heading}
                    fill
                    className="object-cover object-center transform transition-transform duration-1000 brightness-[0.97]"
                    priority
                    sizes="(max-w-xl) 100vw, 920px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/5 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* HUD FLOATER 1: Left Vetting Badge Panel */}
            <AnimatePresence>
              <motion.div
                key={`hl-${current}`}
                initial={{ opacity: 0, x: -20, y: -5 }}
                animate={{ opacity: 1, x: -16, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ type: "spring", stiffness: 110, damping: 15, delay: 0.05 }}
                style={{ transform: "translateZ(35px)" }}
                className="absolute top-[12%] -left-4 md:-left-6 z-20 bg-white/85 backdrop-blur-xl border border-white/80 rounded-xl p-2.5 shadow-lg flex flex-col gap-0.5 min-w-[115px] text-left border-neutral-200/20"
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-neutral-50 text-neutral-500 mb-0.5">
                  <Activity className="w-3 h-3" />
                </div>
                <span className="text-[16px] font-black text-neutral-900 tracking-tight leading-none">{slide.hudLeft.metric}</span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{slide.hudLeft.label}</span>
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 rounded px-1 py-0.5 mt-1 block w-max">{slide.hudLeft.status}</span>
              </motion.div>
            </AnimatePresence>

            {/* HUD FLOATER 2: Dark Glass Target Metrics Block */}
            <AnimatePresence>
              <motion.div
                key={`hr-${current}`}
                initial={{ opacity: 0, x: 20, y: 5 }}
                animate={{ opacity: 1, x: 16, y: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ type: "spring", stiffness: 110, damping: 15, delay: 0.1 }}
                style={{ transform: "translateZ(45px)" }}
                className="absolute top-[18%] -right-4 md:-right-6 z-20 bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-white shadow-xl min-w-[145px] text-left"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest">{slide.hudRight.label}</span>
                  <div className="flex gap-0.5 items-end h-2.5">
                    <span className="w-0.5 h-1 bg-white/30 rounded-full" />
                    <span className="w-0.5 h-2.5 bg-white/80 rounded-full" />
                    <span className="w-0.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <p className="text-[15px] font-black tracking-tight text-white leading-none">{slide.hudRight.metric}</p>
                <p className="text-[9px] text-neutral-400 font-medium mt-1">Trend: {slide.hudRight.trend}</p>
              </motion.div>
            </AnimatePresence>

            {/* HUD FLOATER 3: Bottom Left Transaction Bar */}
            <AnimatePresence>
              <motion.div
                key={`hb-${current}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.15 }}
                style={{ transform: "translateZ(25px)" }}
                className="absolute bottom-3 left-4 z-20 bg-white/90 backdrop-blur-md border border-neutral-200/40 rounded-lg p-1.5 px-3 shadow-md max-w-[280px] text-left hidden sm:flex items-center gap-2.5"
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-neutral-900 text-white shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                </div>
                <div className="truncate flex items-center gap-2 text-[10px] sm:text-[11px]">
                  <span className="font-black text-neutral-950 tracking-tight">{slide.hudGraph.value}</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-500 truncate font-medium">{slide.hudGraph.label}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* 3. TABS DOCK CONTROLLER STRIP */}
      <div className="w-full max-w-[960px] mx-auto shrink-0 z-30 pt-1">
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] border border-neutral-200/50 p-1 grid grid-cols-2 md:grid-cols-4 gap-1">
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
