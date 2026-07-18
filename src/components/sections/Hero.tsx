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
  DollarSign,
  Percent,
  LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA (Premium Credora Corporate Theme)
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
    accent: "#1A2255",
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

// Motion Stagger Variant Mapping for Content Blocks
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  // 3D Parallax Tilt Effects for the Image Frame Card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [5, -5]);
  const rotateY = useTransform(x, [-300, 300], [-5, 5]);

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
      className="relative bg-gradient-to-b from-[#FAFBFD] via-[#F4F6FA] to-[#EBF0F6] text-slate-900 w-full h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 md:px-8 pb-4 font-sans antialiased"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Structural Minimal Alignment Grid Overlay Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A225506_1px,transparent_1px),linear-gradient(to_bottom,#1A225506_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Decorative Finance Data Vectors for Background Ambient Depth */}
        <motion.div 
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-8 text-[#1A2255]/5 hidden xl:block"
        >
          <LineChart className="w-24 h-24 stroke-[1]" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-8 text-[#1A2255]/5 hidden xl:block"
        >
          <DollarSign className="w-20 h-20 stroke-[1]" />
        </motion.div>

        {/* Brand Tint Background Glow */}
        <motion.div
          animate={{
            scale: [1, 1.04, 0.98, 1],
            x: [0, 10, -10, 0],
            y: [0, -8, 12, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[550px] h-[550px] rounded-full blur-[140px] opacity-[0.22] top-[-8%] left-[32%]"
          style={{
            background: `radial-gradient(circle, #1A225545 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* 1. LAYOUT CONTROLLER FRAME */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-[1140px] mx-auto flex-1 flex flex-col items-center justify-center z-10 text-center gap-4 min-h-0 pt-4"
      >
        
        {/* TYPOGRAPHIC TEXT WRAPPER */}
        <div className="flex flex-col items-center max-w-2xl w-full tracking-tight shrink-0">
          
          {/* Animated Accent Pill */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 border bg-white/90 text-[#1A2255] border-[#1A2255]/15 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-[#1A2255]" />
            {slide.badge}
          </motion.div>

          {/* Premium Headline Element */}
          <motion.h1
            variants={itemVariants}
            className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[3.6rem] font-black tracking-[-0.03em] leading-[1.1] text-neutral-950"
          >
            {slide.heading}
          </motion.h1>

          {/* Paragraph Context Body */}
          <motion.p
            variants={itemVariants}
            className="text-[13px] sm:text-[14px] md:text-[15px] text-neutral-500 font-medium leading-[1.5] max-w-lg mt-2.5 mb-3.5"
          >
            {slide.subtitle}
          </motion.p>

          {/* Staggered Button Navigation Dock */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2.5 w-full z-20">
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-9 px-6 rounded-full text-[12px] font-bold text-white transition-all duration-300 bg-[#1A2255] hover:bg-[#151B44] shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <span className="flex items-center gap-1">
                {slide.cta1}
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-9 px-6 rounded-full text-[12px] font-bold border-neutral-200 bg-white/95 text-neutral-700 hover:bg-neutral-50 transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              <span className="flex items-center gap-1">
                {slide.cta2}
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 stroke-[2.5]" />
              </span>
            </Button>
          </motion.div>
        </div>

        {/* MEDIA FRAME SECTION WITH TILT MATRIX */}
        <motion.div 
          variants={itemVariants}
          className="relative w-full max-w-[920px] flex-1 min-h-0 w-full flex items-center justify-center perspective-[1500px] mb-2"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-full max-h-[340px] aspect-[21/9] sm:aspect-[24/10] lg:aspect-[21/9] rounded-[24px] border-4 border-white shadow-[0_25px_60px_-15px_rgba(26,34,85,0.08)] bg-neutral-100 transition-all duration-300 ease-out"
          >
            {/* Visual Frame Asset Container */}
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
                    alt={slide.heading}
                    fill
                    className="object-cover object-center transform transition-transform duration-1000 brightness-[0.97]"
                    priority
                    sizes="(max-w-xl) 100vw, 920px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2255]/5 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* HUD FLOATER LEFT: Live Analytics Indicator */}
            <AnimatePresence>
              <motion.div
                key={`hl-${current}`}
                initial={{ opacity: 0, x: -25, y: -5 }}
                animate={{ opacity: 1, x: -16, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.1 }}
                style={{ transform: "translateZ(35px)" }}
                className="absolute top-[12%] -left-4 md:-left-6 z-20 bg-white/90 backdrop-blur-xl border border-neutral-200/40 rounded-xl p-2.5 shadow-md flex flex-col gap-0.5 min-w-[120px] text-left"
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#1A2255]/5 text-[#1A2255] mb-0.5">
                  <Percent className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-[16px] font-black text-neutral-900 tracking-tight leading-none">{slide.hudLeft.metric}</span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{slide.hudLeft.label}</span>
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 rounded px-1 py-0.5 mt-1 block w-max">{slide.hudLeft.status}</span>
              </motion.div>
            </AnimatePresence>

            {/* HUD FLOATER RIGHT: Premium Dark Parameter Box */}
            <AnimatePresence>
              <motion.div
                key={`hr-${current}`}
                initial={{ opacity: 0, x: 25, y: 5 }}
                animate={{ opacity: 1, x: 16, y: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.15 }}
                style={{ transform: "translateZ(45px)" }}
                className="absolute top-[18%] -right-4 md:-right-6 z-20 bg-[#1A2255]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-white shadow-xl min-w-[150px] text-left"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[8px] text-neutral-300 font-bold uppercase tracking-widest">{slide.hudRight.label}</span>
                  <div className="flex gap-0.5 items-end h-2.5">
                    <span className="w-0.5 h-1.5 bg-white/40 rounded-full" />
                    <span className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" />
                    <span className="w-0.5 h-1 bg-white/20 rounded-full" />
                  </div>
                </div>
                <p className="text-[15px] font-black tracking-tight text-white leading-none">{slide.hudRight.metric}</p>
                <p className="text-[9px] text-neutral-300 font-medium mt-1">Status: {slide.hudRight.trend}</p>
              </motion.div>
            </AnimatePresence>

            {/* HUD FLOATER BOTTOM: Transaction Ticker Drawer */}
            <AnimatePresence>
              <motion.div
                key={`hb-${current}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 110, damping: 15, delay: 0.2 }}
                style={{ transform: "translateZ(25px)" }}
                className="absolute bottom-3 left-4 z-20 bg-white/95 backdrop-blur-md border border-neutral-200/40 rounded-lg p-1.5 px-3 shadow-md max-w-[280px] text-left hidden sm:flex items-center gap-2.5"
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#1A2255] text-white shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                </div>
                <div className="truncate flex items-center gap-2 text-[10px] sm:text-[11px]">
                  <span className="font-black text-[#1A2255] tracking-tight">{slide.hudGraph.value}</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-500 truncate font-medium">{slide.hudGraph.label}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 2. NAVIGATION BOTTOM DOCK STRIP */}
      <div className="w-full max-w-[960px] mx-auto shrink-0 z-30 pt-1">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] border border-neutral-200/40 p-1 grid grid-cols-2 md:grid-cols-4 gap-1">
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
