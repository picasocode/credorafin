"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Building2,
  Zap,
  BadgeCheck,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA (Centered Minimalist Theme)
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
    hudLeft: { title: "Instant Vetting", desc: "Funding up to ₹50 Crores" },
    hudRight: { title: "9.5% p.a.", desc: "Collateral-free options" },
    hudBottom: { title: "7-10 Days Turnaround", desc: "Priority processing channel active" }
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
    hudLeft: { title: "Top Tier Priority", desc: "Structured syndicate finance" },
    hudRight: { title: "₹5Cr - ₹100Cr", desc: "PSU & Private networks" },
    hudBottom: { title: "Custom Terms", desc: "Flexible milestone disbursement matrices" }
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
    hudLeft: { title: "Risk Protected", desc: "92% Approval rating metrics" },
    hudRight: { title: "92% Rate", desc: "Credit risk pre-assessment" },
    hudBottom: { title: "48 Hours Window", desc: "Zero process structural gaps found" }
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
    hudLeft: { title: "Score Restored", desc: "Strategic bank settlements" },
    hudRight: { title: "+150 Points", desc: "CIBIL optimization engine" },
    hudBottom: { title: "Rapid Action Plan", desc: "Removal of legacy default history markers" }
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
    timerRef.current = setInterval(goNext, 9000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  return (
    <section 
      id="hero" 
      className="relative bg-[#FAFAFA] text-slate-900 w-full min-h-screen h-screen flex flex-col justify-between overflow-hidden font-sans antialiased"
    >
      {/* Subtle organic cloud gradient overlay for the clean theme */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] bg-gradient-to-br from-slate-200 to-transparent" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] bg-gradient-to-tl from-slate-100 to-transparent" />
      </div>

      {/* 1. TOP HEADER APP SPACE BUFFER */}
      <div className="w-full h-14 shrink-0" />

      {/* 2. CORE CENTERED CONTENT FRAME */}
      <div className="relative w-full max-w-[1280px] mx-auto flex-1 flex flex-col items-center justify-center z-10 px-4 sm:px-8 text-center gap-6 lg:gap-8 max-h-[calc(100vh-140px)]">
        
        {/* TEXT & CTA WRAPPER */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-3xl w-full"
          >
            {/* Minimalist Header Text */}
            <h1 className="text-[2.25rem] sm:text-[3.2rem] md:text-[3.6rem] lg:text-[4rem] font-bold tracking-[-0.03em] leading-[1.1] text-[#111111] mb-4">
              {slide.heading}
            </h1>

            {/* Sub-description Text */}
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#666666] font-normal leading-[1.5] max-w-2xl mb-5 tracking-tight">
              {slide.subtitle}
            </p>

            {/* Pill Shape Call-to-Actions (Matches Reference 2 Perfectly) */}
            <div className="flex items-center justify-center gap-3 w-full">
              <Button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="h-11 px-6 rounded-full text-[13px] font-semibold text-white transition-all duration-300 bg-black hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  {slide.cta1}
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="h-11 px-6 rounded-full text-[13px] font-semibold border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  {slide.cta2}
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 stroke-[2.5]" />
                </span>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* MASSIVE SINGLE BANNED IMAGE VIEW WITH HUD OVERLAYS */}
        <div className="relative w-full max-w-[1100px] flex-1 min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:max-h-[420px] w-full px-2 sm:px-6 md:px-12">
          <div className="relative w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] border border-neutral-200/50 bg-neutral-100">
            
            {/* Animated Asset Transition Core */}
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`img-${current}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={slide.image}
                  alt={slide.heading}
                  fill
                  className="object-cover object-center transform transition-transform duration-1000 ease-out brightness-[0.98]"
                  priority
                  sizes="(max-w-xl) 100vw, 1100px"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* HUD GLASS ELEMENT 1: Left-Floating Badge (Overlapping Image Rim) */}
          <AnimatePresence>
            <motion.div
              key={`hleft-${current}`}
              initial={{ opacity: 0, x: -15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
              className="absolute top-[20%] left-0 sm:left-2 md:left-6 z-20 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 shadow-md flex items-center gap-3 max-w-[180px] sm:max-w-[220px] text-left"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${slide.accent}15`, color: slide.accent }}>
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="truncate">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">{slide.hudLeft.title}</p>
                <p className="text-[12px] font-bold text-neutral-800 mt-1 truncate">{slide.hudLeft.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* HUD GLASS ELEMENT 2: Right-Floating Parameter Block */}
          <AnimatePresence>
            <motion.div
              key={`hright-${current}`}
              initial={{ opacity: 0, x: 15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.15 }}
              className="absolute top-[45%] right-0 sm:right-2 md:right-6 z-20 bg-neutral-900/85 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-white shadow-xl min-w-[130px] sm:min-w-[160px] text-left"
            >
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest leading-none">Parameters</p>
              <p className="text-[14px] sm:text-[16px] font-extrabold mt-1 tracking-tight text-white">{slide.hudRight.title}</p>
              <p className="text-[11px] text-neutral-300 mt-0.5 font-medium tracking-wide truncate">{slide.hudRight.desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* HUD GLASS ELEMENT 3: Bottom-Left Extended Activity Overlay */}
          <AnimatePresence>
            <motion.div
              key={`hbottom-${current}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 95, damping: 14, delay: 0.2 }}
              className="absolute bottom-4 left-6 sm:left-12 md:left-20 z-20 bg-white/75 backdrop-blur-lg border border-neutral-200/40 rounded-xl p-2.5 px-4 shadow-lg max-w-[260px] sm:max-w-[340px] text-left hidden sm:flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${slide.accent}10`, color: slide.accent }}>
                <Clock className="w-3 h-3" />
              </div>
              <div className="truncate">
                <span className="text-[12px] font-bold text-neutral-800 tracking-tight block">{slide.hudBottom.title}</span>
                <span className="text-[11px] text-neutral-500 block truncate font-medium">{slide.hudBottom.desc}</span>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* 3. HORIZONTAL NAVIGATOR DESK STRIP */}
      <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-8 pb-5 shrink-0 z-30">
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-200/50 p-1 grid grid-cols-2 md:grid-cols-4 gap-1">
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
                className={`relative flex items-center justify-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="centeredTabIndicator"
                    className="absolute inset-0 z-0 bg-black"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
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
