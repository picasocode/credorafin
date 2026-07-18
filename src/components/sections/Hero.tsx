"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Shield,
  Building2,
  BadgeCheck,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
  Zap,
  Layers,
  Fingerprint,
  PieChart,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 0,
    tag: "Institutional Synergy",
    titleLine1: "Syndicated Capital.",
    titleLine2: "Zero Collateral.",
    desc: "Engineered liquidity networks connecting mid-market enterprises to 70+ global banking partners with pre-negotiated yield frameworks.",
    cta: "Initiate Funding",
    image: "/images/pages/hero-indian-team.png",
    metricValue: "₹50 Cr+",
    metricLabel: "Liquidity Pool Active",
    dataStream: [
      { label: "Partner Banks", val: "72 Nodes Live" },
      { label: "Deployment Rate", val: "Instantaneous" }
    ]
  },
  {
    id: 1,
    tag: "Scale Architecture",
    titleLine1: "Infrastructure Debt.",
    titleLine2: "Structured Leverage.",
    desc: "High-volume capital sourcing and custom debt syndication architectures designed explicitly to fund large-scale industrial assets.",
    cta: "Deploy Capital",
    image: "/images/pages/office-india.png",
    metricValue: "₹100 Cr",
    metricLabel: "Single Allocation Cap",
    dataStream: [
      { label: "Structure Typology", val: "Multi-Tranche" },
      { label: "Placement Route", val: "Priority Tier-1" }
    ]
  },
  {
    id: 2,
    tag: "Risk Optimization",
    titleLine1: "Pre-Underwritten.",
    titleLine2: "Guaranteed Audit.",
    desc: "Eliminate bank rejection cycles. Our autonomous file-vetting framework repairs, structures, and hardens your application before submission.",
    cta: "Verify File Risk",
    image: "/images/pages/indian-professional.png",
    metricValue: "92.4%",
    metricLabel: "Audit Success Ratio",
    dataStream: [
      { label: "Vetting SLA", val: "< 48 Hours" },
      { label: "Risk Matrix", val: "Zero-Gap Compliance" }
    ]
  },
  {
    id: 3,
    tag: "Balance Sheet Repair",
    titleLine1: "Credit Restoration.",
    titleLine2: "Legacy Recovery.",
    desc: "Overcome historical settlement defaults and complex commercial ratings. We re-engineer corporate leverage layers structurally.",
    cta: "Repair Corporate Score",
    image: "/images/pages/handshake-india.png",
    metricValue: "+150 PTS",
    metricLabel: "Target CIBIL Drift",
    dataStream: [
      { label: "Default Resolution", val: "Accelerated Plan" },
      { label: "Leverage Recovery", val: "Fully Restored" }
    ]
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  // 3D Parallax Tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [7, -7]);
  const rotateY = useTransform(x, [-300, 300], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const goNext = useCallback(() => {
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
      className="relative w-full min-h-screen bg-[#F8FAFC] flex flex-col justify-between overflow-hidden px-6 lg:px-16 pt-24 pb-8 antialiased selection:bg-[#1A2255]/10 selection:text-[#1A2255]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* BACKGROUND GRAPHIC MATRIX */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a04_1px,transparent_1px),linear-gradient(to_bottom,#0f172a04_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-[#1A2255]/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* ASYMMETRIC MAIN ENGINE CONTENT */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 my-auto">
        
        {/* LEFT COLUMN: HIGH-DENSITY ENTERPRISE TEXT ENGINE */}
        <div className="lg:col-span-6 flex flex-col justify-center items-start text-left space-y-6">
          
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2255]/5 border border-[#1A2255]/10 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A2255]" />
            <AnimatePresence mode="wait">
              <motion.span
                key={`tag-${current}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A2255]"
              >
                {slide.tag}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Core Headings */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl xl:text-[3.6rem] font-black tracking-[-0.03em] leading-[1.08] text-slate-900">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`line1-${current}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.4 }}
                  className="block"
                >
                  {slide.titleLine1}
                </motion.span>
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.span
                  key={`line2-${current}`}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 25 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="block text-[#1A2255] bg-gradient-to-r from-[#1A2255] to-[#2E3B87] bg-clip-text text-transparent"
                >
                  {slide.titleLine2}
                </motion.span>
              </AnimatePresence>
            </h1>
          </div>

          {/* Description */}
          <div className="max-w-lg min-h-[72px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[14px] text-slate-500 font-medium leading-[1.6]"
              >
                {slide.desc}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Call to Actions & Micro Statistics Integration */}
          <div className="flex flex-wrap items-center gap-6 pt-2 w-full">
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="h-12 px-8 rounded-xl text-[12px] font-bold text-white transition-all duration-300 bg-[#1A2255] hover:bg-[#141b44] shadow-md hover:shadow-xl hover:shadow-[#1A2255]/15 active:scale-[0.98] cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={`cta-${current}`}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                  >
                    {slide.cta}
                  </motion.span>
                </AnimatePresence>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>

            {/* Dynamic System Output Stream */}
            <div className="flex items-center gap-6 border-l border-slate-200 pl-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`stream-${current}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex gap-4"
                >
                  {slide.dataStream.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                      <span className="text-[12px] font-black text-slate-800 tracking-tight">{item.val}</span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HIGH-AESTHETIC FLOATING HUD IMAGE HUB */}
        <div className="lg:col-span-6 w-full flex justify-center items-center perspective-[1500px]">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/11] rounded-[32px] bg-slate-200/40 p-3 shadow-[0_30px_70px_-20px_rgba(15,23,42,0.08)] border border-white/60 transition-all duration-300 ease-out"
          >
            {/* The Main Image Asset Mask Frame */}
            <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-slate-900 shadow-inner z-10">
              <AnimatePresence mode="popLayout">
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
                    alt="Credora Premium Enterprise Engine Layout"
                    fill
                    className="object-cover object-center brightness-[0.92] contrast-[1.02]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
              
              {/* Glass HUD Accent Cover */}
              <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md rounded-lg p-1.5 px-3 border border-white/10 text-white z-20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">System Secured</span>
              </div>
            </div>

            {/* FLOATING GLASS ELEMENT: Main Large Metric (Bottom Left Offset) */}
            <AnimatePresence>
              <motion.div
                key={`metric-${current}`}
                initial={{ opacity: 0, y: 30, x: -20 }}
                animate={{ opacity: 1, y: 16, x: -16 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="absolute -bottom-4 -left-4 z-20 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-4 shadow-xl flex flex-col min-w-[160px] text-left"
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="w-7 h-7 rounded-lg bg-[#1A2255]/5 flex items-center justify-center text-[#1A2255] mb-2">
                  <Activity className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{slide.metricValue}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{slide.metricLabel}</span>
              </motion.div>
            </AnimatePresence>

            {/* FLOATING GLASS ELEMENT: Status Layer (Top Right Offset) */}
            <AnimatePresence>
              <motion.div
                key={`hudright-${current}`}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 16 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="absolute -top-6 -right-4 z-20 bg-[#1A2255] border border-white/10 rounded-xl p-3 text-white shadow-2xl min-w-[150px] text-left hidden sm:block"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[8px] uppercase font-bold tracking-[0.12em] text-slate-300">Routing Live</span>
                </div>
                <p className="text-[11px] font-bold text-white leading-tight">Institutional Placement Engine</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* DOCK NAVIGATOR: CLEAN SEGMENTED CAPABILITIES LINE */}
      <div className="w-full max-w-5xl mx-auto z-20 mt-12">
        <div className="bg-white border border-slate-200/60 shadow-[0_4px_20px_-5px_rgba(15,23,42,0.04)] rounded-2xl p-2 grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {[
            { id: 0, label: "Business Funding", icon: Building2 },
            { id: 1, label: "Project Capital", icon: TrendingUp },
            { id: 2, label: "Pre-Underwriting", icon: BadgeCheck },
            { id: 3, label: "Asset Repair", icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = current === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrent(tab.id)}
                className={`relative flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
                  active ? "text-white" : "text-slate-500 hover:text-[#1A2255]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="heroTabIndicatorPerfect"
                    className="absolute inset-0 z-0 bg-gradient-to-r from-[#1A2255] to-[#243075]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 z-10 shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "text-white" : "text-slate-400 group-hover:text-[#1A2255]"}`} />
                <span className="truncate z-10 whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
