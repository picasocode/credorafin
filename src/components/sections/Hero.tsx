"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Shield,
  Building2,
  Landmark,
  Zap,
  CheckCircle2,
  Star,
  Users,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA — Preserved exactly
   ──────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    badge: "STRUCTURED FINANCE",
    heading: "Enrich Your",
    headingAccent: "Cashflow",
    sub: "Funding solutions for MSMEs and growing businesses — 70+ banks, one streamlined process.",
    cta1: "Get Funded Now",
    cta2: "Speak to an Advisor",
    accent: "#304AC0",
    accentLight: "#6B8FFF",
    accentMuted: "#304AC020",
  },
  {
    id: 1,
    badge: "PRE-UNDERWRITING",
    heading: "Precision That",
    headingAccent: "Gets Approved",
    sub: "Bank-ready applications before they reach a lender. 92% approval rate, 7–10 day disbursal.",
    cta1: "Start Pre-Underwriting",
    cta2: "Learn the Process",
    accent: "#87B73C",
    accentLight: "#A8E04A",
    accentMuted: "#87B73C20",
  },
  {
    id: 2,
    badge: "END-TO-END ADVISORY",
    heading: "From Application",
    headingAccent: "To Disbursal",
    sub: "Credit repair, EMI structuring, documentation — we handle everything so you stay focused on growth.",
    cta1: "Get Advisory",
    cta2: "See Our Services",
    accent: "#13277E",
    accentLight: "#304AC0",
    accentMuted: "#13277E20",
  },
];

const stats = [
  { value: "20+", target: 20, suffix: "+", prefix: "", label: "Years Experience", icon: Building2 },
  { value: "70+", target: 70, suffix: "+", prefix: "", label: "Bank Partners", icon: Landmark },
  { value: "1,200+", target: 1200, suffix: "+", prefix: "", label: "Happy Clients", icon: Users },
  { value: "₹50Cr", target: 50, suffix: "Cr", prefix: "₹", label: "Max Funding", icon: IndianRupee },
];

/* ────────────────────────────────────────────
   ANIMATED COUNTER
   ──────────────────────────────────────────── */
function CountUp({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const total = 60;
    const t = setInterval(() => {
      frame++;
      const p = Math.min(frame / total, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p >= 1) clearInterval(t);
    }, 24);
    return () => clearInterval(t);
  }, [target, started]);

  return (
    <span ref={ref}>
      {prefix}
      {target >= 1000 ? count.toLocaleString("en-IN") : count}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────────
   MESH GRADIENT BACKGROUND
   ──────────────────────────────────────────── */
function MeshGradient({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#09090B]" />

      {/* Primary mesh blob */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "80vw",
          height: "80vh",
          top: "-20%",
          left: "-10%",
          background: `radial-gradient(circle, ${accent}12 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary mesh blob */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vh",
          bottom: "-20%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(135,183,60,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Subtle center glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 40%, ${accent}08 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   GRID OVERLAY
   ──────────────────────────────────────────── */
function GridOverlay() {
  return (
    <>
      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Large grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "256px 256px",
        }}
      />
    </>
  );
}

/* ────────────────────────────────────────────
   FLOATING DOT PARTICLES
   ──────────────────────────────────────────── */
function DotParticles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        dur: Math.random() * 5 + 4,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <>
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full pointer-events-none bg-white/[0.12]"
          style={{ width: d.size, height: d.size, left: `${d.x}%`, top: `${d.y}%` }}
          animate={{ opacity: [0.08, 0.3, 0.08] }}
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
        />
      ))}
    </>
  );
}

/* ────────────────────────────────────────────
   MAIN HERO
   ──────────────────────────────────────────── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);

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
    const t = setInterval(goNext, 6000);
    return () => clearInterval(t);
  }, [goNext]);

  const slide = slides[current];

  /* ── Animation Variants ── */
  const textV = {
    enter: (d: number) => ({
      opacity: 0,
      y: d > 0 ? 24 : -24,
      filter: "blur(6px)",
    }),
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (d: number) => ({
      opacity: 0,
      y: d > 0 ? -24 : 24,
      filter: "blur(6px)",
    }),
  };

  const cardV = {
    enter: (d: number) => ({
      opacity: 0,
      y: d > 0 ? 20 : -20,
      scale: 0.97,
    }),
    center: { opacity: 1, y: 0, scale: 1 },
    exit: (d: number) => ({
      opacity: 0,
      y: d > 0 ? -20 : 20,
      scale: 0.97,
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ═══ BACKGROUND LAYERS ═══ */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <MeshGradient accent={slide.accent} />
        <GridOverlay />
        <DotParticles />
      </motion.div>

      {/* Top-edge glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${slide.accent}40, transparent)`,
        }}
      />

      {/* ═══ CONTENT ═══ */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-16 sm:pt-28 sm:pb-20"
        style={{ opacity: fadeOut, y: lift }}
      >
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 xl:gap-24 items-center">
          {/* ─── LEFT: Text Content ─── */}
          <div className="max-w-xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={textV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  y: { type: "spring", stiffness: 160, damping: 22 },
                  opacity: { duration: 0.35 },
                  filter: { duration: 0.35 },
                }}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  <span
                    className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300"
                    style={{
                      borderColor: `${slide.accent}20`,
                      backgroundColor: `${slide.accent}08`,
                      color: `${slide.accentLight}CC`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: slide.accentLight, boxShadow: `0 0 8px ${slide.accent}50` }}
                    />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem] font-bold leading-[1.08] tracking-[-0.035em] text-white"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {slide.heading}
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${slide.accentLight}, ${slide.accent})`,
                    }}
                  >
                    {slide.headingAccent}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="text-base sm:text-[17px] text-white/40 leading-[1.7] max-w-md"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.sub}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  className="flex flex-wrap gap-3 pt-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="relative h-12 px-7 rounded-2xl text-sm font-semibold overflow-hidden group transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentLight})`,
                      boxShadow: `0 2px 20px ${slide.accent}25, 0 0 0 1px ${slide.accent}15`,
                    }}
                  >
                    {/* Shimmer */}
                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <motion.span
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
                      />
                    </span>
                    <span className="relative z-10 flex items-center gap-2 text-white">
                      {slide.cta1}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-12 px-7 rounded-2xl text-sm font-semibold text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 backdrop-blur-sm"
                  >
                    {slide.cta2}
                  </Button>
                </motion.div>

                {/* Trust row */}
                <motion.div
                  className="flex items-center gap-5 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400/60 text-amber-400/60" />
                    ))}
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-xs text-white/25">
                    Trusted by <span className="text-white/45 font-medium">1,200+</span> businesses
                  </span>
                </motion.div>

                {/* Slide navigation */}
                <motion.div
                  className="flex items-center gap-5 pt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {/* Dots */}
                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="relative h-[4px] rounded-full transition-all duration-600 cursor-pointer"
                        style={{
                          width: i === current ? "32px" : "4px",
                          backgroundColor: i === current ? slide.accent : "rgba(255,255,255,0.12)",
                        }}
                      >
                        {i === current && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: slide.accentLight, transformOrigin: "left" }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 5.8, ease: "linear" }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={goPrev}
                      className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white/50 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-200"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="w-8 h-8 rounded-xl border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white/50 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-200"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Counter */}
                  <span className="text-[11px] text-white/15 tabular-nums tracking-wide">
                    <span className="text-white/35 font-semibold">{String(current + 1).padStart(2, "0")}</span>
                    <span className="mx-0.5">/</span>
                    {String(slides.length).padStart(2, "0")}
                  </span>
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
                variants={cardV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative"
              >
                {/* Main dashboard card */}
                <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-3xl p-8 overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.5)]">
                  {/* Inner fill */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        background: `linear-gradient(90deg, transparent 10%, ${slide.accent}50 50%, transparent 90%)`,
                      }}
                    />
                    <motion.div
                      className="absolute top-0 h-full w-1/3"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${slide.accentLight}80, transparent)`,
                      }}
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                  </div>

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: `${slide.accent}12` }}
                        >
                          <Building2 className="w-[18px] h-[18px]" style={{ color: slide.accentLight }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-white/70 leading-tight">Credora Dashboard</p>
                          <p className="text-[10px] text-white/20 mt-0.5">Real-time overview</p>
                        </div>
                      </div>
                      <span
                        className="flex items-center gap-2 text-[10px] font-semibold px-3.5 py-1.5 rounded-full"
                        style={{
                          color: "#87B73C",
                          backgroundColor: "rgba(135,183,60,0.06)",
                          border: "1px solid rgba(135,183,60,0.1)",
                        }}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#87B73C] opacity-50" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#87B73C]" />
                        </span>
                        Live
                      </span>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-3 gap-3 mb-7">
                      {[
                        { label: "Approval Rate", value: "92%", icon: Shield, badge: "+4.2%" },
                        { label: "Avg. Disbursal", value: "7 Days", icon: Zap, badge: "Fast" },
                        { label: "Lender Network", value: "70+", icon: Landmark, badge: "+8" },
                      ].map((c, i) => (
                        <motion.div
                          key={i}
                          className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-4 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300"
                          initial={{ opacity: 0, y: 14, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${slide.accent}10` }}
                            >
                              <c.icon className="w-3.5 h-3.5" style={{ color: slide.accentLight }} />
                            </div>
                            <span className="text-[9px] font-semibold text-[#87B73C]/80 bg-[#87B73C]/[0.06] px-1.5 py-0.5 rounded-md">
                              {c.badge}
                            </span>
                          </div>
                          <p className="text-[22px] font-bold text-white tracking-tight leading-none">{c.value}</p>
                          <p className="text-[9px] text-white/20 uppercase tracking-[0.12em] mt-1.5">{c.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chart area */}
                    <div className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-5 mb-7">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] font-medium">
                            Funding Trend
                          </p>
                          <p className="text-[8px] text-white/[0.12] mt-0.5">Last 12 months</p>
                        </div>
                        <span className="text-[10px] text-[#87B73C]/70 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />+24.5%
                        </span>
                      </div>

                      {/* Bar chart */}
                      <div className="flex items-end gap-[3px] h-14">
                        {slide.id === 0 &&
                          [35, 42, 38, 52, 48, 62, 58, 75, 68, 82, 78, 92].map((v, i) => (
                            <motion.div
                              key={i}
                              className="flex-1 rounded-t-sm min-w-0"
                              style={{
                                background: `linear-gradient(to top, ${slide.accent}50, ${slide.accentLight}20)`,
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(v / 92) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.3 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                              whileHover={{
                                background: `linear-gradient(to top, ${slide.accent}, ${slide.accentLight})`,
                                transition: { duration: 0.15 },
                              }}
                            />
                          ))}
                        {slide.id === 1 &&
                          [20, 35, 30, 45, 55, 50, 65, 60, 75, 80, 85, 92].map((v, i) => (
                            <motion.div
                              key={i}
                              className="flex-1 rounded-t-sm min-w-0"
                              style={{
                                background: `linear-gradient(to top, ${slide.accent}50, ${slide.accentLight}20)`,
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(v / 92) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.3 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                              whileHover={{
                                background: `linear-gradient(to top, ${slide.accent}, ${slide.accentLight})`,
                                transition: { duration: 0.15 },
                              }}
                            />
                          ))}
                        {slide.id === 2 &&
                          [25, 30, 40, 35, 50, 55, 60, 70, 65, 80, 85, 90].map((v, i) => (
                            <motion.div
                              key={i}
                              className="flex-1 rounded-t-sm min-w-0"
                              style={{
                                background: `linear-gradient(to top, ${slide.accent}50, ${slide.accentLight}20)`,
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(v / 90) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.3 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                              whileHover={{
                                background: `linear-gradient(to top, ${slide.accent}, ${slide.accentLight})`,
                                transition: { duration: 0.15 },
                              }}
                            />
                          ))}
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        {["RK", "SP", "AM", "VD"].map((initials, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white/80 border-2 border-[#09090B]"
                            style={{
                              backgroundColor: [slide.accent, "#13277E", "#87B73C", "#2E7D32"][i],
                              marginLeft: i > 0 ? "-8px" : 0,
                              zIndex: 4 - i,
                            }}
                          >
                            {initials}
                          </div>
                        ))}
                        <span className="text-[10px] text-white/20 ml-2">1,200+ clients</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <p className="text-[11px] font-semibold text-white/55">₹5L</p>
                          <p className="text-[8px] text-white/15 uppercase tracking-wider">Min</p>
                        </div>
                        <div className="h-6 w-px bg-white/[0.06]" />
                        <div className="text-right">
                          <p className="text-[11px] font-semibold text-white/55">₹50Cr</p>
                          <p className="text-[8px] text-white/15 uppercase tracking-wider">Max</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Soft inner glow */}
                  <div
                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
                    style={{ backgroundColor: slide.accent, opacity: 0.04 }}
                  />
                </div>

                {/* ── FLOATING CARDS ── */}

                {/* Top-left: Quick Disbursal */}
                <motion.div
                  className="absolute -top-5 -left-5 rounded-2xl px-4 py-3 border border-white/[0.08] backdrop-blur-xl z-20"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent}E8, ${slide.accentLight}D0)`,
                    boxShadow: `0 12px 40px ${slide.accent}30`,
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-white/70" />
                    <div>
                      <p className="text-[8px] font-medium text-white/50 uppercase tracking-[0.14em]">Quick Disbursal</p>
                      <p className="text-[14px] font-bold text-white leading-tight">7–10 Days</p>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom-right: Funding Range */}
                <motion.div
                  className="absolute -bottom-5 -right-5 rounded-2xl px-4 py-3 border border-white/[0.08] backdrop-blur-xl z-20 bg-[#87B73C]/90"
                  style={{ boxShadow: "0 12px 40px rgba(135,183,60,0.25)" }}
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white/70" />
                    <div>
                      <p className="text-[8px] font-medium text-white/50 uppercase tracking-[0.14em]">Funding Range</p>
                      <p className="text-[14px] font-bold text-white leading-tight">₹5L – ₹50Cr</p>
                    </div>
                  </div>
                </motion.div>

                {/* Right-middle: Approval */}
                <motion.div
                  className="absolute top-1/2 -right-6 -translate-y-1/2 rounded-2xl px-3.5 py-2.5 border border-white/[0.06] backdrop-blur-xl z-20"
                  style={{
                    background: "rgba(9,9,11,0.85)",
                    boxShadow: `0 12px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
                  }}
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" style={{ color: slide.accentLight }} />
                    <div>
                      <p className="text-[8px] font-medium text-white/30 uppercase tracking-[0.12em]">Approval</p>
                      <p className="text-[13px] font-bold text-white leading-tight">92%</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── BOTTOM STATS BAR ─── */}
        <motion.div
          className="mt-14 lg:mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          {/* Divider */}
          <div className="relative mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                className="group text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.08 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <s.icon className="w-3.5 h-3.5 text-white/[0.12] group-hover:text-white/25 transition-colors duration-300" />
                </div>
                <p className="text-2xl sm:text-[1.65rem] font-bold text-white tracking-tight group-hover:text-white transition-colors duration-300">
                  <CountUp target={s.target} suffix={s.suffix} prefix={s.prefix} />
                </p>
                <p className="text-[10px] text-white/15 uppercase tracking-[0.16em] mt-1 group-hover:text-white/25 transition-colors duration-300">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F0F4FF] to-transparent z-20 pointer-events-none" />

      {/* Side vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 40%, rgba(9,9,11,0.5) 100%)",
        }}
      />
    </section>
  );
}
