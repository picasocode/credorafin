"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Shield,
  Building2,
  Landmark,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    badge: "STRUCTURED FINANCE",
    heading: "Enrich Your",
    headingAccent: "Cashflow",
    sub:
      "Funding solutions for MSMEs and growing businesses — 70+ banks, one streamlined process.",
    cta1: "Get Funded Now",
    cta2: "Speak to an Advisor",
    accent: "#304AC0",
    accentLight: "#5B8DEF",
  },
  {
    id: 1,
    badge: "PRE-UNDERWRITING",
    heading: "Precision That",
    headingAccent: "Gets Approved",
    sub:
      "Bank-ready applications before they reach a lender. 92% approval rate, 7–10 day disbursal.",
    cta1: "Start Pre-Underwriting",
    cta2: "Learn the Process",
    accent: "#87B73C",
    accentLight: "#A5D64B",
  },
  {
    id: 2,
    badge: "END-TO-END ADVISORY",
    heading: "From Application",
    headingAccent: "To Disbursal",
    sub:
      "Credit repair, EMI structuring, documentation — we handle everything so you stay focused on growth.",
    cta1: "Get Advisory",
    cta2: "See Our Services",
    accent: "#13277E",
    accentLight: "#304AC0",
  },
];

/* Stats row data */
const stats = [
  { value: "20+", label: "Years Experience" },
  { value: "70+", label: "Bank Partners" },
  { value: "1,200+", label: "Happy Clients" },
  { value: "₹50Cr", label: "Max Funding" },
];

/* ────────────────────────────────────────────
   ANIMATED COUNTER (for stats)
   ──────────────────────────────────────────── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 60;
    const step = target / totalFrames;
    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────────
   FLOATING ORB (background decoration)
   ──────────────────────────────────────────── */
function FloatingOrb({
  size,
  color,
  x,
  y,
  duration,
  delay,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* ────────────────────────────────────────────
   MAIN HERO — Single Screen, Show-Off Design
   ──────────────────────────────────────────── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > current ? 1 : -1);
      setCurrent(i);
    },
    [current]
  );

  useEffect(() => {
    const t = setInterval(goNext, 5500);
    return () => clearInterval(t);
  }, [goNext]);

  const slide = slides[current];

  /* ── Variants ── */
  const textV = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };

  const dashV = {
    enter: (d: number) => ({ x: d > 0 ? 30 : -30, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -30 : 30, opacity: 0, scale: 0.96 }),
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen min-h-[600px] max-h-[900px] flex items-center overflow-hidden"
    >
      {/* ═══ BACKGROUND ═══ */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060B1F] via-[#0C1535] to-[#0A0E1A]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(91,141,239,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(91,141,239,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Gradient orbs */}
        <FloatingOrb size={600} color="#304AC0" x="5%" y="-10%" duration={8} delay={0} />
        <FloatingOrb size={500} color="#87B73C" x="60%" y="50%" duration={10} delay={2} />
        <FloatingOrb size={400} color="#5B8DEF" x="75%" y="-5%" duration={7} delay={1} />
        <FloatingOrb size={350} color="#13277E" x="-5%" y="60%" duration={9} delay={3} />
      </motion.div>

      {/* ═══ CONTENT ═══ */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ─── LEFT: Text Content ─── */}
          <div className="space-y-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={textV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 180, damping: 22 },
                  opacity: { duration: 0.3 },
                }}
                className="space-y-6"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    <Sparkles className="w-3 h-3" style={{ color: slide.accent }} />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-bold text-white leading-[1.08] tracking-[-0.02em]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {slide.heading}
                  <br />
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentLight})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {slide.headingAccent}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="text-[15px] sm:text-base text-white/45 leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {slide.sub}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="font-semibold text-sm px-7 py-3.5 rounded-xl transition-all duration-300 group shadow-[0_0_30px_rgba(48,74,192,0.3)] hover:shadow-[0_0_45px_rgba(48,74,192,0.45)]"
                    style={{ backgroundColor: slide.accent }}
                  >
                    {slide.cta1}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="border-white/[0.12] text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/20 font-semibold text-sm px-7 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-300"
                  >
                    {slide.cta2}
                  </Button>
                </motion.div>

                {/* Slide navigation */}
                <motion.div
                  className="flex items-center gap-4 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="relative h-[6px] rounded-full transition-all duration-500 cursor-pointer"
                        style={{
                          width: i === current ? "28px" : "6px",
                          backgroundColor:
                            i === current ? slide.accent : "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={goPrev}
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/30 hover:text-white/70 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/30 hover:text-white/70 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── RIGHT: Dashboard Visual ─── */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={dashV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Main glass card */}
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl p-6 overflow-hidden">
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${slide.accent}50, transparent)`,
                    }}
                  />

                  {/* Header row */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${slide.accent}20` }}
                      >
                        <Building2 className="w-4 h-4" style={{ color: slide.accentLight }} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white/70">Credora Dashboard</div>
                        <div className="text-[10px] text-white/30">Real-time overview</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border"
                      style={{ color: "#87B73C", borderColor: "rgba(135,183,60,0.2)", backgroundColor: "rgba(135,183,60,0.08)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#87B73C] animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Stat cards row */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: "Approval Rate", value: "92%", icon: Shield },
                      { label: "Disbursal", value: "7 Days", icon: TrendingUp },
                      { label: "Lenders", value: "70+", icon: Landmark },
                    ].map((c, i) => (
                      <motion.div
                        key={i}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                      >
                        <c.icon className="w-3.5 h-3.5 mb-2" style={{ color: slide.accentLight }} />
                        <div className="text-lg font-bold text-white">{c.value}</div>
                        <div className="text-[10px] text-white/30 uppercase tracking-wider">{c.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Animated chart */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
                        Funding Trend
                      </span>
                      <span className="text-[10px] text-[#87B73C] font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +24.5%
                      </span>
                    </div>
                    <svg viewBox="0 0 280 50" className="w-full h-12" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={slide.accent} stopOpacity="0.25" />
                          <stop offset="100%" stopColor={slide.accent} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M0 40 C25 38, 40 30, 70 32 C100 34, 115 20, 140 22 C165 24, 180 12, 210 10 C240 8, 255 5, 280 3 L280 50 L0 50 Z"
                        fill="url(#chartFill)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                      />
                      <motion.path
                        d="M0 40 C25 38, 40 30, 70 32 C100 34, 115 20, 140 22 C165 24, 180 12, 210 10 C240 8, 255 5, 280 3"
                        fill="none"
                        stroke={slide.accentLight}
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
                      />
                      <motion.circle
                        cx="280" cy="3" r="3" fill={slide.accentLight}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 2.1 }}
                      />
                      <motion.circle
                        cx="280" cy="3" r="7" fill="none" stroke={slide.accentLight} strokeWidth="1"
                        animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                        transition={{ duration: 1.5, delay: 2.1, repeat: Infinity }}
                      />
                    </svg>
                  </div>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <div className="flex items-center gap-1.5">
                      {["RK", "SP", "AM", "VD"].map((initials, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white/10"
                          style={{
                            backgroundColor: [slide.accent, "#13277E", "#87B73C", "#2E7D32"][i],
                            marginLeft: i > 0 ? "-6px" : 0,
                            zIndex: 4 - i,
                          }}
                        >
                          {initials}
                        </div>
                      ))}
                      <span className="text-[10px] text-white/30 ml-1.5">1,200+ clients</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {[
                        { v: "₹5L", l: "Min" },
                        { v: "₹50Cr", l: "Max" },
                      ].map((s, i) => (
                        <div key={i} className="text-right">
                          <div className="text-[11px] font-semibold text-white/70">{s.v}</div>
                          <div className="text-[9px] text-white/25">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inner glow */}
                  <div
                    className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                    style={{ backgroundColor: slide.accent, opacity: 0.08 }}
                  />
                </div>

                {/* Floating accent card — top */}
                <motion.div
                  className="absolute -top-3 -left-3 rounded-xl px-3.5 py-2.5 shadow-xl border border-white/[0.1] backdrop-blur-xl"
                  style={{ backgroundColor: `${slide.accent}E6` }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-[9px] font-medium text-white/60 uppercase tracking-wider">
                    Quick Disbursal
                  </div>
                  <div className="text-sm font-bold text-white">7–10 Days</div>
                </motion.div>

                {/* Floating accent card — bottom */}
                <motion.div
                  className="absolute -bottom-3 -right-3 rounded-xl px-3.5 py-2.5 shadow-xl border border-white/[0.1] backdrop-blur-xl bg-[#87B73C]/90"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="text-[9px] font-medium text-white/60 uppercase tracking-wider">
                    Funding Range
                  </div>
                  <div className="text-sm font-bold text-white">₹5L – ₹50Cr</div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── BOTTOM STATS BAR ─── */}
        <motion.div
          className="mt-10 lg:mt-14 pt-6 border-t border-white/[0.06]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between gap-6 flex-wrap">
            {stats.map((s, i) => (
              <div key={i} className="text-center flex-1 min-w-[80px]">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-[10px] text-white/25 uppercase tracking-[0.12em] mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F0F4FF] to-transparent z-20 pointer-events-none" />
    </section>
  );
}
