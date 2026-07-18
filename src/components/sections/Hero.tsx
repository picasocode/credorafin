"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Building2,
  Landmark,
  BarChart3,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA
   ──────────────────────────────────────────── */
const heroSlides = [
  {
    id: 0,
    badge: "Structured Finance",
    heading: ["Enrich Your", "Cashflow"],
    highlight: "Cashflow",
    description:
      "Structured funding solutions for MSMEs, professionals, and growing businesses across India. We simplify access to capital by bridging the gap between your funding needs and the right financial institutions.",
    subDescription:
      "With disciplined pre-underwriting, end-to-end advisory, and access to 70+ banks and NBFCs, we prepare your profile for success.",
    primaryCTA: "Get Funded Now",
    secondaryCTA: "Speak to an Advisor",
    statCards: [
      { label: "Loan Approval", value: "92%", color: "#304AC0" },
      { label: "Client Satisfaction", value: "98%", color: "#87B73C" },
      { label: "Lender Network", value: "70+", color: "#5B8DEF" },
    ],
    accentIcon: TrendingUp,
  },
  {
    id: 1,
    badge: "Pre-Underwriting",
    heading: ["Precision That", "Gets Approved"],
    highlight: "Gets Approved",
    description:
      "Our disciplined pre-underwriting process ensures your loan application is bank-ready before it reaches a single lender. We analyze, structure, and position your financial profile for maximum approval probability.",
    subDescription:
      "From credit repair to loan structuring, we handle the complexity so you can focus on growing your business.",
    primaryCTA: "Start Pre-Underwriting",
    secondaryCTA: "Learn the Process",
    statCards: [
      { label: "Avg. Disbursal", value: "7-10 Days", color: "#87B73C" },
      { label: "Funding Range", value: "₹5L–₹50Cr", color: "#304AC0" },
      { label: "Success Rate", value: "92%", color: "#5B8DEF" },
    ],
    accentIcon: Shield,
  },
  {
    id: 2,
    badge: "End-to-End Advisory",
    heading: ["From Application", "To Disbursal"],
    highlight: "To Disbursal",
    description:
      "We walk with you through every step — from choosing the right lender to negotiating the best terms. Our advisory covers credit repair, EMI structuring, documentation, and post-sanction support.",
    subDescription:
      "Trusted by 1,200+ businesses with 20+ years of expertise in the Indian financial ecosystem.",
    primaryCTA: "Get Advisory",
    secondaryCTA: "See Our Services",
    statCards: [
      { label: "Years Experience", value: "20+", color: "#304AC0" },
      { label: "Products", value: "20+", color: "#87B73C" },
      { label: "Happy Clients", value: "1,200+", color: "#5B8DEF" },
    ],
    accentIcon: Landmark,
  },
];

/* ────────────────────────────────────────────
   ANIMATED CHART LINE SVG
   ──────────────────────────────────────────── */
function AnimatedChartLine() {
  const pathData =
    "M0 80 C40 80, 60 40, 100 50 C140 60, 160 20, 200 30 C240 40, 260 60, 300 20 C340 -10, 360 40, 400 10 C440 -20, 460 30, 500 5";
  const areaPath =
    "M0 80 C40 80, 60 40, 100 50 C140 60, 160 20, 200 30 C240 40, 260 60, 300 20 C340 -10, 360 40, 400 10 C440 -20, 460 30, 500 5 L500 120 L0 120 Z";

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
      <svg
        viewBox="-20 -20 540 160"
        className="w-[140%] h-[60%]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#304AC0" />
            <stop offset="50%" stopColor="#5B8DEF" />
            <stop offset="100%" stopColor="#87B73C" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#304AC0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#304AC0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#chartGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
        />
        {/* Endpoint glow dot */}
        <motion.circle
          cx="500"
          cy="5"
          r="6"
          fill="#87B73C"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 3 }}
        />
        <motion.circle
          cx="500"
          cy="5"
          r="12"
          fill="none"
          stroke="#87B73C"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 2, delay: 3, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────
   GRID BACKGROUND
   ──────────────────────────────────────────── */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1026] via-[#0F1A3E] to-[#0A0E1A]" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(91,141,239,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,141,239,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow center-left */}
      <div className="absolute top-1/3 left-1/4 w-[800px] h-[600px] rounded-full bg-[#304AC0]/10 blur-[150px]" />
      {/* Radial glow bottom-right */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] rounded-full bg-[#87B73C]/[0.06] blur-[120px]" />
      {/* Top-right subtle blue glow */}
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#5B8DEF]/[0.05] blur-[100px]" />
    </div>
  );
}

/* ────────────────────────────────────────────
   TICKER TAPE / MARQUEE
   ──────────────────────────────────────────── */
const tickerItems = [
  { label: "MSME Loans", icon: Building2 },
  { label: "Supply Chain Finance", icon: BarChart3 },
  { label: "Project Finance", icon: Landmark },
  { label: "Cross-Border", icon: Wallet },
  { label: "Credit Repair", icon: Shield },
  { label: "Pre-Underwriting", icon: CheckCircle2 },
  { label: "Fund Raising", icon: TrendingUp },
  { label: "EMI Structuring", icon: IndianRupee },
];

function TickerTape() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="absolute top-0 left-0 right-0 z-10 overflow-hidden border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <motion.div
        className="flex items-center gap-10 py-3 px-5 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-white/40 text-xs font-medium tracking-wider uppercase"
          >
            <item.icon className="w-3.5 h-3.5 text-[#5B8DEF]/60" />
            <span>{item.label}</span>
            <span className="ml-4 text-white/10">|</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────
   GLASS STAT CARD
   ──────────────────────────────────────────── */
function GlassStatCard({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.12]">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
        <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
          {label}
        </div>
        <div
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color }}
        >
          {value}
        </div>
        {/* Subtle glow on hover */}
        <div
          className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
          style={{ backgroundColor: color, opacity: 0.15 }}
        />
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   FLOATING ORB DECORATIONS
   ──────────────────────────────────────────── */
function FloatingOrbs() {
  return (
    <>
      <motion.div
        className="absolute top-[15%] right-[10%] w-3 h-3 rounded-full bg-[#5B8DEF]/30"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[60%] right-[25%] w-2 h-2 rounded-full bg-[#87B73C]/40"
        animate={{ y: [0, 15, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-[30%] left-[5%] w-2.5 h-2.5 rounded-full bg-[#304AC0]/30"
        animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[15%] w-2 h-2 rounded-full bg-white/20"
        animate={{ y: [0, 10, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </>
  );
}

/* ────────────────────────────────────────────
   SLIDE INDICATOR DOTS
   ──────────────────────────────────────────── */
function SlideIndicators({
  current,
  total,
  onSelect,
}: {
  current: number;
  total: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="relative h-2 rounded-full transition-all duration-500 cursor-pointer"
          style={{
            width: i === current ? "32px" : "8px",
            backgroundColor:
              i === current ? "#5B8DEF" : "rgba(255,255,255,0.2)",
          }}
        >
          {i === current && (
            <motion.div
              className="absolute inset-0 rounded-full"
              layoutId="activeSlide"
              style={{
                background: "linear-gradient(90deg, #304AC0, #5B8DEF)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN HERO COMPONENT
   ──────────────────────────────────────────── */
export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    },
    [currentSlide]
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];

  /* Slide animation variants */
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background layers */}
      <GridBackground />
      <AnimatedChartLine />
      <FloatingOrbs />
      <TickerTape />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span className="inline-flex items-center gap-2.5 bg-white/[0.06] text-[#5B8DEF] text-xs font-semibold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full border border-white/[0.08] backdrop-blur-sm">
                    <Zap className="w-3.5 h-3.5 text-[#87B73C]" />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-white leading-[1.08] tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  {slide.heading.map((word, i) => (
                    <span key={i}>
                      {word === slide.highlight ? (
                        <span className="relative inline-block">
                          <span
                            className="relative z-10"
                            style={{
                              background:
                                "linear-gradient(135deg, #5B8DEF 0%, #87B73C 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {word}
                          </span>
                          <motion.span
                            className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #304AC0, #87B73C)",
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.8,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style-origin="left"
                          />
                        </span>
                      ) : (
                        word
                      )}
                      {i < slide.heading.length - 1 && " "}
                    </span>
                  ))}
                </motion.h1>

                {/* Description */}
                <motion.p
                  className="text-base sm:text-lg text-white/50 leading-relaxed max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  {slide.description}
                </motion.p>

                {/* Sub description */}
                <motion.p
                  className="text-sm text-white/35 leading-relaxed max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  {slide.subDescription}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <Button
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el)
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="relative overflow-hidden bg-[#304AC0] hover:bg-[#3E5BD4] text-white font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(48,74,192,0.3)] hover:shadow-[0_0_40px_rgba(48,74,192,0.5)] group"
                  >
                    {/* Shine sweep effect */}
                    <span className="absolute inset-0 overflow-hidden rounded-xl">
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut",
                        }}
                      />
                    </span>
                    <span className="relative flex items-center gap-2">
                      {slide.primaryCTA}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el)
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="border-white/[0.12] text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300"
                  >
                    {slide.secondaryCTA}
                  </Button>
                </motion.div>

                {/* Slide navigation */}
                <motion.div
                  className="flex items-center gap-6 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <SlideIndicators
                    current={currentSlide}
                    total={heroSlides.length}
                    onSelect={goToSlide}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 hover:bg-white/[0.06] transition-all duration-300"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 hover:bg-white/[0.06] transition-all duration-300"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Glass Stats + Visual */}
          <div className="relative hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.96 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                {/* Main glass panel */}
                <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl p-8 overflow-hidden">
                  {/* Top accent gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5B8DEF]/40 to-transparent" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#304AC0]/20 flex items-center justify-center">
                        <slide.accentIcon className="w-5 h-5 text-[#5B8DEF]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white/80">
                          Credora Financial
                        </div>
                        <div className="text-xs text-white/30">
                          Dashboard Overview
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#87B73C] bg-[#87B73C]/10 px-3 py-1.5 rounded-full border border-[#87B73C]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#87B73C] animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Stat cards grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {slide.statCards.map((card, i) => (
                      <GlassStatCard
                        key={`${slide.id}-${i}`}
                        label={card.label}
                        value={card.value}
                        color={card.color}
                        delay={0.3 + i * 0.15}
                      />
                    ))}
                  </div>

                  {/* Mini chart visualization */}
                  <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        Funding Trend
                      </span>
                      <span className="text-xs text-[#87B73C] font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +24.5%
                      </span>
                    </div>
                    <svg
                      viewBox="0 0 300 60"
                      className="w-full h-16"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="miniChartGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#304AC0"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#304AC0"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M0 50 C30 45, 50 35, 80 38 C110 41, 130 25, 160 28 C190 31, 210 15, 240 18 C270 21, 280 10, 300 5 L300 60 L0 60 Z"
                        fill="url(#miniChartGrad)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                      />
                      <motion.path
                        d="M0 50 C30 45, 50 35, 80 38 C110 41, 130 25, 160 28 C190 31, 210 15, 240 18 C270 21, 280 10, 300 5"
                        fill="none"
                        stroke="#5B8DEF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 2,
                          delay: 0.5,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.circle
                        cx="300"
                        cy="5"
                        r="4"
                        fill="#5B8DEF"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 2.5 }}
                      />
                      <motion.circle
                        cx="300"
                        cy="5"
                        r="8"
                        fill="none"
                        stroke="#5B8DEF"
                        strokeWidth="1"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [1, 2],
                          opacity: [0.5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: 2.5,
                          repeat: Infinity,
                        }}
                      />
                    </svg>
                  </div>

                  {/* Bottom stats row */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
                    {[
                      { val: "20+", lab: "Years Exp.", c: "#5B8DEF" },
                      { val: "70+", lab: "Banks", c: "#87B73C" },
                      { val: "20+", lab: "Products", c: "#5B8DEF" },
                    ].map((s, i) => (
                      <div key={i} className="text-center">
                        <div
                          className="text-xl font-bold tracking-tight"
                          style={{ color: s.c }}
                        >
                          {s.val}
                        </div>
                        <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">
                          {s.lab}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inner glow effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#304AC0]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#87B73C]/5 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* Floating accent card — top-left */}
                <motion.div
                  className="absolute -top-5 -left-5 rounded-xl border border-white/[0.1] bg-[#304AC0]/90 backdrop-blur-xl px-4 py-3 shadow-[0_8px_32px_rgba(48,74,192,0.3)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="text-[10px] font-medium text-white/60 uppercase tracking-wider">
                    Quick Disbursal
                  </div>
                  <div className="text-sm font-bold text-white">7-10 Days</div>
                </motion.div>

                {/* Floating accent card — bottom-right */}
                <motion.div
                  className="absolute -bottom-5 -right-5 rounded-xl border border-white/[0.1] bg-[#87B73C]/90 backdrop-blur-xl px-4 py-3 shadow-[0_8px_32px_rgba(135,183,60,0.25)]"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="text-[10px] font-medium text-white/60 uppercase tracking-wider">
                    Funding Range
                  </div>
                  <div className="text-sm font-bold text-white">
                    ₹5L - ₹50Cr
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F0F4FF] to-transparent z-20 pointer-events-none" />
    </section>
  );
}
