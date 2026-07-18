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
  HeartHandshake,
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
    image: "/images/pages/hero-indian-team.png",
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
    image: "/images/pages/indian-professional.png",
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
    image: "/images/pages/office-india.png",
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
   MAIN HERO — Warm, Emotional, Human
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

  const imgV = {
    enter: (d: number) => ({ opacity: 0, scale: 1.08, x: d > 0 ? 30 : -30 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, scale: 0.95, x: d > 0 ? -30 : 30 }),
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ═══ WARM BACKGROUND ═══ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFF] via-white to-[#F5F0FF]">
        {/* Soft warm glow blobs */}
        <div
          className="absolute top-0 right-0 w-[55vw] h-[55vh] rounded-full opacity-50"
          style={{
            background: `radial-gradient(circle, ${slide.accent}08 0%, transparent 65%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[40vw] h-[40vh] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(135,183,60,0.06) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Warm peach glow for comfort */}
        <div className="absolute top-1/3 left-1/4 w-[30vw] h-[30vh] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(255,183,130,0.06) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ═══ CONTENT ═══ */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-20 sm:pt-32 sm:pb-24"
        style={{ opacity: fadeOut, y: lift }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                  className="text-[2.6rem] sm:text-[3.1rem] lg:text-[3.4rem] xl:text-[3.8rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#0F172A]"
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
                    className="relative h-[52px] px-8 rounded-2xl text-[14px] font-semibold overflow-hidden group transition-all duration-300"
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
                      {slide.cta2}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </Button>
                </motion.div>

                {/* Trust row — emotional, comforting */}
                <motion.div
                  className="flex items-center gap-5 pt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[12px] text-slate-500 ml-1 font-medium">4.9/5</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["RK", "SP", "AM"].map((initials, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[7px] font-bold text-white border-2 border-white shadow-sm"
                          style={{
                            backgroundColor: [slide.accent, "#13277E", "#87B73C"][i],
                          }}
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                    <span className="text-[12px] text-slate-400">
                      <span className="text-slate-600 font-semibold">1,200+</span> businesses trust us
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

          {/* ─── RIGHT: Image + Floating Cards ─── */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={imgV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative"
              >
                {/* Main image container */}
                <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.12)] border border-white/60">
                  {/* Image */}
                  <motion.img
                    src={slide.image}
                    alt="Credora Finance"
                    className="w-full h-[480px] object-cover"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: "easeOut" }}
                  />

                  {/* Gradient overlay on image — bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent" />

                  {/* Content overlaid on image bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    {/* Mini stat cards */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: "Approval Rate", value: "92%", icon: Shield, color: slide.accent },
                        { label: "Disbursal", value: "7 Days", icon: Zap, color: "#87B73C" },
                        { label: "Lenders", value: "70+", icon: Landmark, color: slide.accent },
                      ].map((c, i) => (
                        <motion.div
                          key={i}
                          className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-xl p-3.5"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${c.color}12` }}
                            >
                              <c.icon className="w-3 h-3" style={{ color: c.color }} />
                            </div>
                            <span className="text-[8px] text-slate-400 uppercase tracking-wider font-medium">{c.label}</span>
                          </div>
                          <p className="text-[18px] font-bold text-slate-900 leading-none">{c.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Trust line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-[#87B73C]" />
                        <span className="text-[11px] text-slate-500 font-medium">Your growth, our commitment</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-white/40">
                        <BadgeCheck className="w-3 h-3 text-green-600" />
                        <span className="text-[10px] font-semibold text-green-700">Verified Partner</span>
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
                  className="absolute top-1/2 -right-5 -translate-y-1/2 rounded-2xl px-4 py-3 shadow-xl border border-slate-100 bg-white z-20"
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

                {/* Top-right: Verified badge */}
                <motion.div
                  className="absolute top-5 right-5 z-30"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-sm">
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
                    <s.icon className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
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
