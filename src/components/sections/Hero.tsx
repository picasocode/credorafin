"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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
  Zap,
  CheckCircle2,
  Star,
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
    chartData: [35, 42, 38, 52, 48, 62, 58, 75, 68, 82, 78, 92],
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
    chartData: [20, 35, 30, 45, 55, 50, 65, 60, 75, 80, 85, 92],
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
    chartData: [25, 30, 40, 35, 50, 55, 60, 70, 65, 80, 85, 90],
  },
];

/* Stats row data */
const stats = [
  { value: "20+", target: 20, suffix: "+", label: "Years Experience" },
  { value: "70+", target: 70, suffix: "+", label: "Bank Partners" },
  { value: "1,200+", target: 1200, suffix: "+", label: "Happy Clients" },
  { value: "₹50Cr", target: 50, suffix: "Cr", prefix: "₹", label: "Max Funding" },
];

/* ────────────────────────────────────────────
   ANIMATED COUNTER (for stats)
   ──────────────────────────────────────────── */
function CountUp({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let frame = 0;
    const totalFrames = 70;
    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 22);
    return () => clearInterval(timer);
  }, [target, hasStarted]);

  return (
    <span ref={ref}>
      {prefix}
      {target >= 1000 ? count.toLocaleString("en-IN") : count}
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
        background: `radial-gradient(circle, ${color}18 0%, ${color}08 40%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
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
   MAGNETIC BUTTON WRAPPER
   ──────────────────────────────────────────── */
function MagneticButton({ children, className, style, ...props }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.15);
    y.set(dy * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   ANIMATED BAR CHART
   ──────────────────────────────────────────── */
function AnimatedBarChart({ data, color, accent }: { data: number[]; color: string; accent: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] h-14">
      {data.map((val, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm relative group cursor-pointer"
          style={{
            background: `linear-gradient(to top, ${color}60, ${accent}40)`,
            minWidth: 0,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${(val / max) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{
            background: `linear-gradient(to top, ${accent}, ${accent})`,
            transition: { duration: 0.15 },
          }}
        >
          {/* Tooltip on hover */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-bold bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {val}%
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   SHIMMER LINE (decorative)
   ──────────────────────────────────────────── */
function ShimmerLine({ color, className }: { color: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}60 50%, transparent 100%)`,
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   NOISE TEXTURE OVERLAY
   ──────────────────────────────────────────── */
function NoiseTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

/* ────────────────────────────────────────────
   MAIN HERO — Premium Show-Off Dark Design
   ──────────────────────────────────────────── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

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
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, filter: "blur(4px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, filter: "blur(4px)" }),
  };

  const dashV = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0, scale: 0.95, rotateY: d > 0 ? 3 : -3 }),
    center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0, scale: 0.95, rotateY: d > 0 ? -3 : 3 }),
  };

  /* Generate dot positions for particle field */
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen min-h-[600px] max-h-[1000px] flex items-center overflow-hidden"
    >
      {/* ═══ BACKGROUND ═══ */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {/* Base gradient - deeper and richer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#0A1128] to-[#060B1F]" />

        {/* Secondary gradient layer for depth */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 20% 40%, ${slide.accent}15 0%, transparent 60%),
                         radial-gradient(ellipse 60% 50% at 80% 30%, ${slide.accentLight}10 0%, transparent 50%)`,
          }}
        />

        {/* Grid overlay - refined */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(91,141,239,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(91,141,239,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Diagonal line accents */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(91,141,239,0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Noise texture for premium feel */}
        <NoiseTexture />

        {/* Gradient orbs - more refined */}
        <FloatingOrb size={700} color={slide.accent} x="0%" y="-15%" duration={9} delay={0} />
        <FloatingOrb size={500} color="#87B73C" x="55%" y="45%" duration={11} delay={2} />
        <FloatingOrb size={450} color={slide.accentLight} x="70%" y="-8%" duration={8} delay={1.5} />
        <FloatingOrb size={350} color="#13277E" x="-8%" y="55%" duration={10} delay={3} />
        <FloatingOrb size={300} color={slide.accent} x="40%" y="70%" duration={12} delay={4} />

        {/* Floating particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: "rgba(91,141,239,0.3)",
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </motion.div>

      {/* ═══ CONTENT ═══ */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ opacity, y: contentY }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* ─── LEFT: Text Content ─── */}
          <div className="space-y-7">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={textV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 150, damping: 20 },
                  opacity: { duration: 0.35 },
                  filter: { duration: 0.35 },
                }}
                className="space-y-7"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-md px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-300 cursor-default">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: slide.accentLight, boxShadow: `0 0 8px ${slide.accent}60` }}
                    />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  className="text-[2.5rem] sm:text-[3.2rem] lg:text-[3.6rem] xl:text-[4rem] font-bold text-white leading-[1.05] tracking-[-0.03em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="block">{slide.heading}</span>
                  <span
                    className="block mt-1"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentLight}, ${slide.accent})`,
                      backgroundSize: "200% 200%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      animation: "gradientShift 4s ease infinite",
                    }}
                  >
                    {slide.headingAccent}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="text-[15px] sm:text-[16px] text-white/40 leading-[1.7] max-w-lg"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.sub}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  className="flex flex-wrap gap-3 pt-1"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <MagneticButton>
                    <Button
                      onClick={() => {
                        const el = document.getElementById("contact");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="relative font-semibold text-sm px-8 py-4 rounded-2xl transition-all duration-300 group overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentLight})`,
                        boxShadow: `0 4px 25px ${slide.accent}35, 0 0 60px ${slide.accent}15`,
                      }}
                    >
                      {/* Shimmer overlay */}
                      <span className="absolute inset-0 overflow-hidden rounded-2xl">
                        <motion.span
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)`,
                          }}
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
                        />
                      </span>
                      <span className="relative z-10 flex items-center gap-2">
                        {slide.cta1}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </span>
                    </Button>
                  </MagneticButton>

                  <MagneticButton>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const el = document.getElementById("contact");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="border-white/[0.1] text-white/50 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.2] font-semibold text-sm px-8 py-4 rounded-2xl backdrop-blur-md transition-all duration-300 group"
                    >
                      <span className="flex items-center gap-2">
                        {slide.cta2}
                        <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      </span>
                    </Button>
                  </MagneticButton>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  className="flex items-center gap-4 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-yellow-400/70 text-yellow-400/70"
                      />
                    ))}
                  </div>
                  <span className="text-[12px] text-white/30">
                    Trusted by <span className="text-white/50 font-medium">1,200+</span> businesses
                  </span>
                </motion.div>

                {/* Slide navigation */}
                <motion.div
                  className="flex items-center gap-5 pt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-center gap-2.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="relative h-[5px] rounded-full transition-all duration-700 cursor-pointer group"
                        style={{
                          width: i === current ? "36px" : "5px",
                          backgroundColor:
                            i === current ? slide.accent : "rgba(255,255,255,0.12)",
                        }}
                      >
                        {i === current && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: slide.accentLight }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 5.5, ease: "linear" }}
                            style2={{ transformOrigin: "left" }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={goPrev}
                      className="w-8 h-8 rounded-xl border border-white/[0.08] flex items-center justify-center text-white/25 hover:text-white/60 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="w-8 h-8 rounded-xl border border-white/[0.08] flex items-center justify-center text-white/25 hover:text-white/60 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-white/20 tabular-nums">
                    <span className="text-white/40 font-semibold">{String(current + 1).padStart(2, "0")}</span>
                    {" / "}
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
                variants={dashV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Main glass card */}
                <div className="relative rounded-[20px] border border-white/[0.07] bg-white/[0.025] backdrop-blur-2xl p-7 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                  {/* Top gradient accent line with shimmer */}
                  <ShimmerLine color={slide.accent} className="absolute top-0 left-0 right-0 h-[1px]" />

                  {/* Animated border glow */}
                  <motion.div
                    className="absolute -inset-[1px] rounded-[20px] pointer-events-none"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${slide.accent}30, transparent, ${slide.accentLight}20, transparent)`,
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-[1px] rounded-[20px] bg-gradient-to-br from-[#0A1128] via-[#0C1535] to-[#060B1F]" />
                  <div className="relative z-10">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: `${slide.accent}15`,
                            boxShadow: `0 0 20px ${slide.accent}10`,
                          }}
                        >
                          <Building2 className="w-4 h-4" style={{ color: slide.accentLight }} />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-white/75">Credora Dashboard</div>
                          <div className="text-[10px] text-white/25">Real-time overview</div>
                        </div>
                      </div>
                      <span
                        className="flex items-center gap-2 text-[10px] font-semibold px-3 py-1.5 rounded-full border"
                        style={{
                          color: "#87B73C",
                          borderColor: "rgba(135,183,60,0.15)",
                          backgroundColor: "rgba(135,183,60,0.06)",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#87B73C] animate-pulse"
                          style={{ boxShadow: "0 0 6px rgba(135,183,60,0.5)" }}
                        />
                        Live
                      </span>
                    </div>

                    {/* Stat cards row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: "Approval Rate", value: "92%", icon: Shield, trend: "+4.2%", up: true },
                        { label: "Disbursal", value: "7 Days", icon: Zap, trend: "Avg.", up: true },
                        { label: "Lenders", value: "70+", icon: Landmark, trend: "+8", up: true },
                      ].map((c, i) => (
                        <motion.div
                          key={i}
                          className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-4 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 cursor-default group"
                          initial={{ opacity: 0, y: 16, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="flex items-center justify-between mb-2.5">
                            <c.icon className="w-3.5 h-3.5" style={{ color: slide.accentLight }} />
                            <span className="text-[9px] text-[#87B73C] font-medium flex items-center gap-0.5">
                              {c.up && <TrendingUp className="w-2.5 h-2.5" />}
                              {c.trend}
                            </span>
                          </div>
                          <div className="text-xl font-bold text-white tracking-tight">{c.value}</div>
                          <div className="text-[9px] text-white/25 uppercase tracking-[0.1em] mt-0.5">
                            {c.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Animated chart area */}
                    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[10px] text-white/25 uppercase tracking-[0.12em] font-medium block">
                            Funding Trend
                          </span>
                          <span className="text-[9px] text-white/15 mt-0.5 block">Last 12 months</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-[#87B73C] font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +24.5%
                          </span>
                          <span className="text-[10px] text-white/20 font-medium">YoY</span>
                        </div>
                      </div>
                      <AnimatedBarChart data={slide.chartData} color={slide.accent} accent={slide.accentLight} />
                      {/* SVG trend line overlay */}
                      <svg viewBox="0 0 280 30" className="w-full h-6 -mt-6 relative z-10" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={slide.accent} />
                            <stop offset="100%" stopColor={slide.accentLight} />
                          </linearGradient>
                        </defs>
                        <motion.path
                          d="M0 25 C20 22, 40 18, 60 20 C80 22, 100 14, 120 16 C140 18, 160 10, 180 8 C200 6, 220 4, 240 5 C260 6, 270 3, 280 2"
                          fill="none"
                          stroke="url(#lineGrad)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                        />
                        <motion.circle
                          cx="280" cy="2" r="2.5" fill={slide.accentLight}
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 2.5 }}
                        />
                        <motion.circle
                          cx="280" cy="2" r="6" fill="none" stroke={slide.accentLight} strokeWidth="0.8"
                          animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                          transition={{ duration: 2, delay: 2.5, repeat: Infinity }}
                        />
                      </svg>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        {["RK", "SP", "AM", "VD"].map((initials, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white/90 border-2 border-[#060B1F]"
                            style={{
                              backgroundColor: [slide.accent, "#13277E", "#87B73C", "#2E7D32"][i],
                              marginLeft: i > 0 ? "-8px" : 0,
                              zIndex: 4 - i,
                              boxShadow: `0 2px 8px ${[slide.accent, "#13277E", "#87B73C", "#2E7D32"][i]}30`,
                            }}
                          >
                            {initials}
                          </div>
                        ))}
                        <span className="text-[10px] text-white/25 ml-2">1,200+ clients</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {[
                          { v: "₹5L", l: "Min" },
                          { v: "₹50Cr", l: "Max" },
                        ].map((s, i) => (
                          <div key={i} className="text-right">
                            <div className="text-[12px] font-bold text-white/65">{s.v}</div>
                            <div className="text-[8px] text-white/20 uppercase tracking-wider">{s.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Inner glow effects */}
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
                    style={{ backgroundColor: slide.accent, opacity: 0.06 }}
                  />
                  <div
                    className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
                    style={{ backgroundColor: slide.accentLight, opacity: 0.04 }}
                  />
                </div>

                {/* Floating accent card — top left */}
                <motion.div
                  className="absolute -top-4 -left-4 rounded-2xl px-4 py-3 shadow-2xl border border-white/[0.08] backdrop-blur-xl z-20"
                  style={{
                    backgroundColor: `${slide.accent}E6`,
                    boxShadow: `0 8px 32px ${slide.accent}40, 0 0 60px ${slide.accent}15`,
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-white/70" />
                    <div>
                      <div className="text-[8px] font-medium text-white/50 uppercase tracking-[0.15em]">
                        Quick Disbursal
                      </div>
                      <div className="text-[14px] font-bold text-white">7–10 Days</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating accent card — bottom right */}
                <motion.div
                  className="absolute -bottom-4 -right-4 rounded-2xl px-4 py-3 shadow-2xl border border-white/[0.08] backdrop-blur-xl z-20 bg-[#87B73C]/90"
                  style={{
                    boxShadow: "0 8px 32px rgba(135,183,60,0.3), 0 0 60px rgba(135,183,60,0.1)",
                  }}
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/70" />
                    <div>
                      <div className="text-[8px] font-medium text-white/50 uppercase tracking-[0.15em]">
                        Funding Range
                      </div>
                      <div className="text-[14px] font-bold text-white">₹5L – ₹50Cr</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating accent card — right middle */}
                <motion.div
                  className="absolute top-1/2 -right-5 -translate-y-1/2 rounded-2xl px-3 py-2.5 shadow-2xl border border-white/[0.08] backdrop-blur-xl z-20 bg-[#0A1128]/90"
                  style={{
                    boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 30px ${slide.accent}10`,
                  }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" style={{ color: slide.accentLight }} />
                    <div>
                      <div className="text-[8px] font-medium text-white/40 uppercase tracking-[0.12em]">
                        Approval
                      </div>
                      <div className="text-[13px] font-bold text-white">92%</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── BOTTOM STATS BAR ─── */}
        <motion.div
          className="mt-10 lg:mt-16"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Divider line with gradient */}
          <div className="relative mb-6">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <motion.div
              className="absolute top-0 h-[1px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${slide.accent}50, transparent)`,
              }}
              animate={{ width: ["0%", "100%", "0%"], left: ["0%", "0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                className="text-center flex-1 min-w-[90px] group cursor-default"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
              >
                <div className="text-2xl sm:text-[1.7rem] font-bold tracking-tight group-hover:scale-105 transition-transform duration-300"
                  style={{
                    background: "linear-gradient(135deg, #FFFFFF, #FFFFFF99)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <CountUp
                    target={s.target}
                    suffix={s.suffix}
                    prefix={s.prefix || ""}
                  />
                </div>
                <div className="text-[10px] text-white/20 uppercase tracking-[0.14em] mt-1 group-hover:text-white/30 transition-colors duration-300">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F0F4FF] to-transparent z-20 pointer-events-none" />

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(3,7,18,0.4) 100%)",
        }}
      />
    </section>
  );
}
