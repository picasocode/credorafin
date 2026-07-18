"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
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
  CircleDollarSign,
  Users,
  IndianRupee,
  Activity,
  BarChart3,
  Globe,
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
    glow: "#304AC0",
  },
  {
    id: 1,
    badge: "PRE-UNDERWRITING",
    heading: "Precision That",
    headingAccent: "Gets Approved",
    sub: "Bank-ready applications before they reach a lender. 92% approval rate, 7–10 day disbursal.",
    cta1: "Start Pre-Underwriting",
    cta2: "Learn the Process",
    accent: "#5B9B3C",
    accentLight: "#87D64B",
    glow: "#87B73C",
  },
  {
    id: 2,
    badge: "END-TO-END ADVISORY",
    heading: "From Application",
    headingAccent: "To Disbursal",
    sub: "Credit repair, EMI structuring, documentation — we handle everything so you stay focused on growth.",
    cta1: "Get Advisory",
    cta2: "See Our Services",
    accent: "#1E3A8A",
    accentLight: "#304AC0",
    glow: "#304AC0",
  },
];

const stats = [
  { value: "20+", target: 20, suffix: "+", prefix: "", label: "Years Experience", icon: Building2 },
  { value: "70+", target: 70, suffix: "+", prefix: "", label: "Bank Partners", icon: Landmark },
  { value: "1,200+", target: 1200, suffix: "+", prefix: "", label: "Happy Clients", icon: Users },
  { value: "₹50Cr", target: 50, suffix: "Cr", prefix: "₹", label: "Max Funding", icon: CircleDollarSign },
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
   AURORA GRADIENT BACKGROUND
   ──────────────────────────────────────────── */
function AuroraBackground({ accent, glow }: { accent: string; glow: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base - near black */}
      <div className="absolute inset-0 bg-[#060608]" />

      {/* Primary aurora glow — bottom right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "70vw",
          height: "70vh",
          bottom: "-30%",
          right: "-15%",
          background: `radial-gradient(ellipse at center, ${glow}18 0%, ${glow}08 40%, transparent 65%)`,
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 25, 0], y: [0, -15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary glow — top left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "50vw",
          height: "50vh",
          top: "-20%",
          left: "-10%",
          background: `radial-gradient(ellipse at center, ${accent}10 0%, transparent 60%)`,
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Accent spot — center-right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "30vw",
          height: "30vh",
          top: "30%",
          right: "20%",
          background: `radial-gradient(circle, ${glow}0A 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Green aurora wisp — bottom center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "40vw",
          height: "20vh",
          bottom: "5%",
          left: "20%",
          background: "radial-gradient(ellipse, rgba(135,183,60,0.06) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   FLOATING DATA CARD (overlaid on visual)
   ──────────────────────────────────────────── */
function FloatingCard({
  icon: Icon,
  title,
  value,
  detail,
  accent,
  position,
  delay,
}: {
  icon: any;
  title: string;
  value: string;
  detail: string;
  accent: string;
  position: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute ${position} z-20 rounded-2xl border border-white/[0.08] backdrop-blur-xl px-4 py-3 min-w-[160px]`}
      style={{
        background: "rgba(10, 10, 15, 0.75)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
        </div>
        <span className="text-[9px] text-white/30 uppercase tracking-[0.12em] font-medium">{title}</span>
      </div>
      <p className="text-[17px] font-bold text-white leading-tight">{value}</p>
      <p className="text-[10px] text-white/25 mt-0.5 leading-snug">{detail}</p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   MAIN HERO — Dribbble AeroSense Style
   ──────────────────────────────────────────── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0px", "35px"]);

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
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 28 : -28, filter: "blur(8px)" }),
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -28 : 28, filter: "blur(8px)" }),
  };

  const cardV = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 24 : -24, scale: 0.96 }),
    center: { opacity: 1, y: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -24 : 24, scale: 0.96 }),
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ═══ AURORA BACKGROUND ═══ */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AuroraBackground accent={slide.accent} glow={slide.glow} />
      </motion.div>

      {/* ═══ CONTENT ═══ */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-20 sm:pt-32 sm:pb-24"
        style={{ opacity: fadeOut, y: lift }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ─── LEFT: Text Content ─── */}
          <div className="max-w-lg">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={textV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  y: { type: "spring", stiffness: 140, damping: 20 },
                  opacity: { duration: 0.4 },
                  filter: { duration: 0.4 },
                }}
                className="space-y-7"
              >
                {/* Badge pill */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  <span
                    className="inline-flex items-center gap-2.5 rounded-full border px-4.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      borderColor: `${slide.accent}25`,
                      backgroundColor: `${slide.accent}0A`,
                      color: `${slide.accentLight}BB`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: slide.accentLight, boxShadow: `0 0 8px ${slide.accent}60` }}
                    />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  className="text-[2.6rem] sm:text-[3.1rem] lg:text-[3.4rem] xl:text-[3.8rem] font-bold text-white leading-[1.06] tracking-[-0.03em]"
                  initial={{ opacity: 0, y: 18 }}
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
                  className="text-[15.5px] text-white/35 leading-[1.7] max-w-md"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.sub}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-3.5 pt-1"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="relative h-[52px] px-7 rounded-2xl text-[14px] font-semibold overflow-hidden group transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentLight})`,
                      boxShadow: `0 4px 24px ${slide.accent}30, 0 0 0 1px ${slide.accent}18`,
                    }}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <motion.span
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
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
                    className="h-[52px] px-7 rounded-2xl text-[14px] font-semibold text-white/45 hover:text-white/75 hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 backdrop-blur-sm"
                  >
                    {slide.cta2}
                  </Button>
                </motion.div>

                {/* Slide navigation */}
                <motion.div
                  className="flex items-center gap-5 pt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  {/* Progress dots */}
                  <div className="flex items-center gap-2.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="relative h-[4px] rounded-full transition-all duration-700 cursor-pointer"
                        style={{
                          width: i === current ? "36px" : "4px",
                          backgroundColor: i === current ? slide.accent : "rgba(255,255,255,0.1)",
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

                  {/* Arrow buttons */}
                  <div className="flex items-center gap-1.5">
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
                  <span className="text-[11px] text-white/12 tabular-nums tracking-wide">
                    <span className="text-white/30 font-semibold">{String(current + 1).padStart(2, "0")}</span>
                    <span className="mx-0.5">/</span>
                    {String(slides.length).padStart(2, "0")}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── RIGHT: Dashboard Visual with Floating Data Cards ─── */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={cardV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative h-[520px]"
              >
                {/* Main dashboard card — large rounded */}
                <div className="absolute inset-0 rounded-[28px] border border-white/[0.05] bg-white/[0.02] backdrop-blur-2xl overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.55)]">
                  {/* Top accent line with shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        background: `linear-gradient(90deg, transparent 10%, ${slide.accent}45 50%, transparent 90%)`,
                      }}
                    />
                    <motion.div
                      className="absolute top-0 h-full w-1/3"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${slide.accentLight}70, transparent)`,
                      }}
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    />
                  </div>

                  {/* Inner content */}
                  <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: `${slide.accent}12` }}
                        >
                          <Building2 className="w-[18px] h-[18px]" style={{ color: slide.accentLight }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-white/65 leading-tight">Credora Dashboard</p>
                          <p className="text-[10px] text-white/20 mt-0.5">Real-time overview</p>
                        </div>
                      </div>
                      <span
                        className="flex items-center gap-2 text-[10px] font-semibold px-3 py-1.5 rounded-full"
                        style={{
                          color: "#87B73C",
                          backgroundColor: "rgba(135,183,60,0.06)",
                          border: "1px solid rgba(135,183,60,0.1)",
                        }}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#87B73C] opacity-40" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#87B73C]" />
                        </span>
                        Live
                      </span>
                    </div>

                    {/* Stat mini-cards row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: "Approval Rate", value: "92%", badge: "+4.2%", icon: Shield },
                        { label: "Avg. Disbursal", value: "7 Days", badge: "Fast", icon: Zap },
                        { label: "Lender Network", value: "70+", badge: "+8", icon: Landmark },
                      ].map((c, i) => (
                        <motion.div
                          key={i}
                          className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-4 hover:bg-white/[0.03] hover:border-white/[0.07] transition-all duration-300"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
                        >
                          <div className="flex items-center justify-between mb-2.5">
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center"
                              style={{ backgroundColor: `${slide.accent}0E` }}
                            >
                              <c.icon className="w-3 h-3" style={{ color: slide.accentLight }} />
                            </div>
                            <span className="text-[8px] font-semibold text-[#87B73C]/70 bg-[#87B73C]/[0.05] px-1.5 py-0.5 rounded">
                              {c.badge}
                            </span>
                          </div>
                          <p className="text-[20px] font-bold text-white tracking-tight leading-none">{c.value}</p>
                          <p className="text-[8px] text-white/18 uppercase tracking-[0.12em] mt-1">{c.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chart area */}
                    <div className="rounded-2xl border border-white/[0.04] bg-white/[0.012] p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[9px] text-white/18 uppercase tracking-[0.14em] font-medium">
                          Funding Trend
                        </p>
                        <span className="text-[9px] text-[#87B73C]/60 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5" />+24.5%
                        </span>
                      </div>
                      <div className="flex items-end gap-[2px] h-12">
                        {[35, 42, 38, 52, 48, 62, 58, 75, 68, 82, 78, 92].map((v, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 rounded-t-sm min-w-0"
                            style={{
                              background: `linear-gradient(to top, ${slide.accent}40, ${slide.accentLight}15)`,
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: `${(v / 92) * 100}%` }}
                            transition={{ duration: 0.45, delay: 0.25 + i * 0.03 }}
                            whileHover={{
                              background: `linear-gradient(to top, ${slide.accent}, ${slide.accentLight})`,
                              transition: { duration: 0.12 },
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        {["RK", "SP", "AM", "VD"].map((initials, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold text-white/80 border-2 border-[#060608]"
                            style={{
                              backgroundColor: [slide.accent, "#13277E", "#87B73C", "#2E7D32"][i],
                              marginLeft: i > 0 ? "-6px" : 0,
                              zIndex: 4 - i,
                            }}
                          >
                            {initials}
                          </div>
                        ))}
                        <span className="text-[9px] text-white/18 ml-1.5">1,200+ clients</span>
                      </div>
                      <div className="flex items-center gap-3.5">
                        <div className="text-right">
                          <p className="text-[10px] font-semibold text-white/45">₹5L</p>
                          <p className="text-[7px] text-white/12 uppercase tracking-wider">Min</p>
                        </div>
                        <div className="h-5 w-px bg-white/[0.05]" />
                        <div className="text-right">
                          <p className="text-[10px] font-semibold text-white/45">₹50Cr</p>
                          <p className="text-[7px] text-white/12 uppercase tracking-wider">Max</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Soft inner glow */}
                  <div
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
                    style={{ backgroundColor: slide.accent, opacity: 0.04 }}
                  />
                </div>

                {/* ── FLOATING DATA CARDS (overlaid, AeroSense-style) ── */}

                {/* Card 1: Top-right — Wind Speed → Approval Rate */}
                <FloatingCard
                  icon={Activity}
                  title="Approval Rate"
                  value="92%"
                  detail="Bank-ready applications"
                  accent={slide.accentLight}
                  position="top-8 -right-6"
                  delay={0.6}
                />

                {/* Card 2: Bottom-left — Soil Type → Funding Range */}
                <FloatingCard
                  icon={CircleDollarSign}
                  title="Funding Range"
                  value="₹5L – ₹50Cr"
                  detail="MSME to enterprise scale"
                  accent="#87B73C"
                  position="bottom-20 -left-6"
                  delay={0.8}
                />

                {/* Card 3: Right-middle — Wind Speed → Quick Disbursal */}
                <FloatingCard
                  icon={Zap}
                  title="Disbursal"
                  value="7–10 Days"
                  detail="Average turnaround time"
                  accent={slide.accentLight}
                  position="top-1/2 -right-6 -translate-y-1/2"
                  delay={1.0}
                />

                {/* Decorative pulsing dot on card corner */}
                <motion.div
                  className="absolute top-4 left-4 z-30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: slide.accentLight, boxShadow: `0 0 12px ${slide.accent}50` }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── BOTTOM STATS BAR ─── */}
        <motion.div
          className="mt-16 lg:mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          {/* Divider */}
          <div className="relative mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
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
                <div className="flex items-center justify-center mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${slide.accent}0A` }}
                  >
                    <s.icon className="w-4 h-4 text-white/15 group-hover:text-white/30 transition-colors duration-300" />
                  </div>
                </div>
                <p className="text-[1.6rem] sm:text-[1.75rem] font-bold text-white tracking-tight group-hover:text-white transition-colors duration-300">
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
    </section>
  );
}
