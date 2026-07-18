"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Star,
  Play,
  BadgeCheck,
  BarChart3,
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
    accentLight: "#5B7FEF",
    accentBg: "#304AC008",
  },
  {
    id: 1,
    badge: "PRE-UNDERWRITING",
    heading: "Precision That",
    headingAccent: "Gets Approved",
    sub: "Bank-ready applications before they reach a lender. 92% approval rate, 7–10 day disbursal.",
    cta1: "Start Pre-Underwriting",
    cta2: "Learn the Process",
    accent: "#3D9B2F",
    accentLight: "#5BBF4A",
    accentBg: "#87B73C08",
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
    accentBg: "#13277E08",
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
   MAIN HERO — Light Premium Professional
   ──────────────────────────────────────────── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const fadeOut = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0px", "30px"]);

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

  /* ── Variants ── */
  const textV = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 24 : -24 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -24 : 24 }),
  };

  const cardV = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 20 : -20, scale: 0.97 }),
    center: { opacity: 1, y: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -20 : 20, scale: 0.97 }),
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
    >
      {/* ═══ BACKGROUND ═══ */}
      <div className="absolute inset-0">
        {/* Soft radial glow — top right */}
        <div
          className="absolute -top-20 -right-20 w-[60vw] h-[60vh] rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle, ${slide.accentBg} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        {/* Soft glow — bottom left */}
        <div
          className="absolute -bottom-20 -left-20 w-[40vw] h-[40vh] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(135,183,60,0.05) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 0.8px, transparent 0.8px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Top gradient fade */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* ═══ CONTENT ═══ */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-20 sm:pt-32 sm:pb-24"
        style={{ opacity: fadeOut, y: lift }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                }}
                className="space-y-7"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] border"
                    style={{
                      color: slide.accent,
                      backgroundColor: `${slide.accent}08`,
                      borderColor: `${slide.accent}18`,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" style={{ color: slide.accent }} />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  className="text-[2.6rem] sm:text-[3.1rem] lg:text-[3.4rem] xl:text-[3.8rem] font-bold leading-[1.08] tracking-[-0.03em]"
                  style={{ color: "#0F172A" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {slide.heading}
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${slide.accent}, ${slide.accentLight})`,
                    }}
                  >
                    {slide.headingAccent}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="text-base sm:text-[17px] text-slate-500 leading-[1.7] max-w-md"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.sub}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  className="flex flex-wrap gap-3.5 pt-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="relative h-[52px] px-8 rounded-2xl text-[14px] font-semibold overflow-hidden group transition-all duration-300 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentLight})`,
                      boxShadow: `0 4px 20px ${slide.accent}25`,
                      color: "#fff",
                    }}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <motion.span
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
                      />
                    </span>
                    <span className="relative z-10 flex items-center gap-2">
                      {slide.cta1}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-[52px] px-8 rounded-2xl text-[14px] font-semibold border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-slate-500" />
                      {slide.cta2}
                    </span>
                  </Button>
                </motion.div>

                {/* Trust row */}
                <motion.div
                  className="flex items-center gap-5 pt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["RK", "SP", "AM"].map((initials, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[7px] font-bold text-white border-2 border-white"
                          style={{
                            backgroundColor: [slide.accent, "#13277E", "#87B73C"][i],
                          }}
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                    <span className="text-[12px] text-slate-400">
                      Trusted by <span className="text-slate-600 font-semibold">1,200+</span> businesses
                    </span>
                  </div>
                </motion.div>

                {/* Slide navigation */}
                <motion.div
                  className="flex items-center gap-5 pt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="relative h-[4px] rounded-full transition-all duration-500 cursor-pointer"
                        style={{
                          width: i === current ? "32px" : "4px",
                          backgroundColor: i === current ? slide.accent : "#CBD5E1",
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
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={goPrev}
                      className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-300 tabular-nums tracking-wide">
                    <span className="text-slate-500 font-semibold">{String(current + 1).padStart(2, "0")}</span>
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
                {/* Main card */}
                <div className="relative rounded-3xl border border-slate-200/60 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
                  {/* Subtle gradient top edge */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{
                      background: `linear-gradient(90deg, ${slide.accent}, ${slide.accentLight}, #87B73C)`,
                    }}
                  />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${slide.accent}0A` }}
                      >
                        <Building2 className="w-[18px] h-[18px]" style={{ color: slide.accent }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800 leading-tight">Credora Dashboard</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Real-time overview</p>
                      </div>
                    </div>
                    <span
                      className="flex items-center gap-2 text-[10px] font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        color: "#2E7D32",
                        backgroundColor: "rgba(46,125,50,0.06)",
                        border: "1px solid rgba(46,125,50,0.1)",
                      }}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-40" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                      </span>
                      Live
                    </span>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-3 mb-7">
                    {[
                      { label: "Approval Rate", value: "92%", icon: Shield, badge: "+4.2%", badgeColor: "#2E7D32" },
                      { label: "Avg. Disbursal", value: "7 Days", icon: Zap, badge: "Fast", badgeColor: "#304AC0" },
                      { label: "Lender Network", value: "70+", icon: Landmark, badge: "+8", badgeColor: "#87B73C" },
                    ].map((c, i) => (
                      <motion.div
                        key={i}
                        className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all duration-300"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${slide.accent}0A` }}
                          >
                            <c.icon className="w-4 h-4" style={{ color: slide.accent }} />
                          </div>
                          <span
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md"
                            style={{ color: c.badgeColor, backgroundColor: `${c.badgeColor}0A` }}
                          >
                            {c.badge}
                          </span>
                        </div>
                        <p className="text-[22px] font-bold text-slate-900 tracking-tight leading-none">{c.value}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-[0.1em] mt-1.5">{c.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 mb-7">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.12em] font-medium">Funding Trend</p>
                        <p className="text-[8px] text-slate-300 mt-0.5">Last 12 months</p>
                      </div>
                      <span className="text-[10px] font-semibold text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />+24.5%
                      </span>
                    </div>
                    <div className="flex items-end gap-[3px] h-14">
                      {[35, 42, 38, 52, 48, 62, 58, 75, 68, 82, 78, 92].map((v, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-t-sm min-w-0"
                          style={{
                            background: `linear-gradient(to top, ${slide.accent}30, ${slide.accentLight}10)`,
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
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {["RK", "SP", "AM", "VD"].map((initials, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shadow-sm"
                          style={{
                            backgroundColor: [slide.accent, "#13277E", "#87B73C", "#2E7D32"][i],
                            marginLeft: i > 0 ? "-8px" : 0,
                            zIndex: 4 - i,
                          }}
                        >
                          {initials}
                        </div>
                      ))}
                      <span className="text-[10px] text-slate-400 ml-2">1,200+ clients</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[11px] font-semibold text-slate-700">₹5L</p>
                        <p className="text-[8px] text-slate-300 uppercase tracking-wider">Min</p>
                      </div>
                      <div className="h-6 w-px bg-slate-100" />
                      <div className="text-right">
                        <p className="text-[11px] font-semibold text-slate-700">₹50Cr</p>
                        <p className="text-[8px] text-slate-300 uppercase tracking-wider">Max</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── FLOATING CARDS ── */}

                {/* Top-left: Quick Disbursal */}
                <motion.div
                  className="absolute -top-4 -left-4 rounded-2xl px-4 py-3 shadow-xl border z-20"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentLight})`,
                    borderColor: `${slide.accent}30`,
                    boxShadow: `0 12px 32px ${slide.accent}20`,
                  }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-white/80" />
                    <div>
                      <p className="text-[8px] font-medium text-white/60 uppercase tracking-[0.12em]">Quick Disbursal</p>
                      <p className="text-[14px] font-bold text-white leading-tight">7–10 Days</p>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom-right: Funding Range */}
                <motion.div
                  className="absolute -bottom-4 -right-4 rounded-2xl px-4 py-3 shadow-xl border border-green-200/40 bg-gradient-to-br from-[#87B73C] to-[#5BBF4A] z-20"
                  style={{ boxShadow: "0 12px 32px rgba(135,183,60,0.2)" }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white/80" />
                    <div>
                      <p className="text-[8px] font-medium text-white/60 uppercase tracking-[0.12em]">Funding Range</p>
                      <p className="text-[14px] font-bold text-white leading-tight">₹5L – ₹50Cr</p>
                    </div>
                  </div>
                </motion.div>

                {/* Right-middle: Approval */}
                <motion.div
                  className="absolute top-1/2 -right-5 -translate-y-1/2 rounded-2xl px-4 py-3 shadow-xl border border-slate-200/60 bg-white z-20"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${slide.accent}0A` }}
                    >
                      <Shield className="w-4 h-4" style={{ color: slide.accent }} />
                    </div>
                    <div>
                      <p className="text-[8px] font-medium text-slate-400 uppercase tracking-[0.1em]">Approval Rate</p>
                      <p className="text-[15px] font-bold text-slate-900 leading-tight">92%</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative badge check */}
                <motion.div
                  className="absolute top-6 right-6 z-30"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200/60">
                    <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[10px] font-semibold text-green-700">Verified</span>
                  </div>
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
            <div className="h-px bg-slate-100" />
            <motion.div
              className="absolute top-0 h-px w-1/4"
              style={{ background: `linear-gradient(90deg, ${slide.accent}, transparent)` }}
              animate={{ x: ["0%", "300%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
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
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:border-slate-200 group-hover:shadow-sm transition-all duration-300">
                    <s.icon className="w-4.5 h-4.5 text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
                  </div>
                </div>
                <p className="text-[1.6rem] sm:text-[1.75rem] font-bold text-slate-900 tracking-tight group-hover:text-slate-800 transition-colors duration-300">
                  <CountUp target={s.target} suffix={s.suffix} prefix={s.prefix} />
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.16em] mt-1 group-hover:text-slate-500 transition-colors duration-300">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
