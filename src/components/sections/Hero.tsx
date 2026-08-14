"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-registry";

interface PublicHeroSlide {
  id: string;
  badge: string;
  headingWords: string[];
  subtitle: string;
  cta1: string;
  cta2: string;
  image: string;
  fallbackImage: string;
  tabLabel: string;
  tabIcon: string;
}

const DEFAULT_SLIDES: PublicHeroSlide[] = [
  {
    id: "default-1",
    badge: "Empowering Enterprises",
    headingWords: ["Accelerate", "Your MSME", "Growth"],
    subtitle: "Customized collateral-free funding solutions syndicated across 70+ banking partners globally.",
    cta1: "Build Finance",
    cta2: "Contact us",
    image: "/images/pages/hero-indian-team.png",
    fallbackImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "MSME Loan",
    tabIcon: "Building2",
  },
  {
    id: "default-2",
    badge: "Infrastructure & Scale",
    headingWords: ["Raise", "Capital for", "Large Projects"],
    subtitle: "Specialized debt structuring, liquidity sourcing, and structured corporate finance built for industrial expansion.",
    cta1: "Raise Capital",
    cta2: "Contact us",
    image: "/images/pages/office-india.png",
    fallbackImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "Project Finance",
    tabIcon: "TrendingUp",
  },
  {
    id: "default-3",
    badge: "Working Capital Unlocked",
    headingWords: ["Optimize", "Cash Flow with", "SCF Solutions"],
    subtitle: "Vendor payment discounting and receivables financing that keep your supply chain liquid and resilient.",
    cta1: "Get SCF",
    cta2: "Contact us",
    image: "/images/pages/success-india.png",
    fallbackImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "Supply Chain Finance",
    tabIcon: "Briefcase",
  },
  {
    id: "default-4",
    badge: "Partner & Earn",
    headingWords: ["Grow", "Together as a", "Referral Partner"],
    subtitle: "Refer MSME clients and earn attractive recurring commissions while helping businesses access faster funding.",
    cta1: "Become a Partner",
    cta2: "Contact us",
    image: "/images/pages/referral-india.png",
    fallbackImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "Referral Partner",
    tabIcon: "Handshake",
  },
  {
    id: "default-5",
    badge: "Financial Reconstruction",
    headingWords: ["Resolve", "Defaults &", "Repair Credit"],
    subtitle: "Struggling with historical settlement records or complex CIBIL positions? Restore corporate leverage now.",
    cta1: "Fix Credit Score",
    cta2: "Contact us",
    image: "/images/pages/handshake-india.png",
    fallbackImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "Credit Repair Services",
    tabIcon: "ShieldCheck",
  }
];

// --- ASHOKA CHAKRA BACKGROUND MOTIF ---
const AshokaChakra = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] text-[#000080] opacity-[0.07] animate-[spin_90s_linear_infinite] pointer-events-none select-none"
    fill="currentColor"
  >
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="50" cy="50" r="7" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x2 = 50 + 42 * Math.cos(angle);
      const y2 = 50 + 42 * Math.sin(angle);
      return (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="1.2"
        />
      );
    })}
  </svg>
);

// --- BRIGHT VIBRANT BALLOON COMPONENT ---
interface MinimalBalloonProps {
  color: string;
  xPosition: number;
  delay: number;
  duration: number;
  size: number;
  isWhite?: boolean;
}

const MinimalBalloon = ({ color, xPosition, delay, duration, size, isWhite }: MinimalBalloonProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      style={{
        left: `${xPosition}%`,
        width: `${size}px`,
        height: `${size * 1.3}px`,
      }}
      initial={{ y: "-15vh", opacity: 0, x: 0 }}
      animate={{
        y: "115vh",
        opacity: [0, 0.85, 0.85, 0], // Increased opacity for bright presence
        x: [0, 18, -18, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <svg viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Balloon Body */}
        <path
          d="M25 0C11.19 0 0 11.19 0 25C0 37.8 18.5 50 22.5 53.5C23.9 54.7 26.1 54.7 27.5 53.5C31.5 50 50 37.8 50 25C50 11.19 38.81 0 25 0Z"
          fill={color}
          stroke={isWhite ? "#D1D5DB" : "none"}
          strokeWidth={isWhite ? "1" : "0"}
        />
        {/* Highlight Curve */}
        <path
          d="M12 10C7 16 7 24 10 30"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={isWhite ? "0.6" : "0.45"}
        />
        {/* Balloon Knot */}
        <polygon points="22,54 28,54 25,58" fill={color} />
        {/* Balloon String */}
        <path
          d="M25 58 C 22 62, 28 66, 25 70"
          stroke="#64748B"
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
};

export default function Hero() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<PublicHeroSlide[]>(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>(DEFAULT_SLIDES[0].image);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- BRIGHT TRICOLOR BALLOONS CONFIGURATION ---
  const balloonConfig = [
    { color: "#FF671F", xPosition: 6, delay: 0, duration: 15, size: 46 },               // Vibrant Saffron Left
    { color: "#FFFFFF", xPosition: 20, delay: 4, duration: 19, size: 42, isWhite: true }, // Crisp White Left-Center
    { color: "#046A38", xPosition: 35, delay: 2, duration: 17, size: 50 },               // Vibrant Green Center-Left
    { color: "#FF671F", xPosition: 64, delay: 6, duration: 16, size: 44 },               // Vibrant Saffron Center-Right
    { color: "#FFFFFF", xPosition: 78, delay: 1, duration: 21, size: 48, isWhite: true }, // Crisp White Right
    { color: "#046A38", xPosition: 92, delay: 3, duration: 18, size: 42 },               // Vibrant Green Far-Right
  ];

  const slide = slides[current] ?? slides[0];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/hero-slides");
        const json = await res.json();
        if (cancelled) return;
        const data = json?.data;
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
          setCurrent((c) => (c >= data.length ? 0 : c));
        }
      } catch {
        // Fallback silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setImgSrc(slides[current]?.image ?? DEFAULT_SLIDES[0].image);
  }, [current, slides]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [3, -3]);
  const rotateY = useTransform(x, [-300, 300], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const goTo = useCallback((nextIndex: number) => {
    if (nextIndex === current) return;
    setCurrent(nextIndex);
  }, [current]);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  return (
    <section
      id="hero"
      aria-busy={loading}
      className="relative bg-[#FAFBFD] w-full min-h-[100svh] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-12 py-6 font-sans antialiased"
    >
      {/* BACKGROUND LAYER WITH ASHOKA CHAKRA & VIBRANT BALLOONS */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A225506_1px,transparent_1px),linear-gradient(to_bottom,#1A225506_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* Ashoka Chakra Centerpiece Motif */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
          <AshokaChakra />
        </div>

        {/* Soft Tricolor Ambient Glows */}
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.12] -top-20 -left-20 bg-[#FF671F]" />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.10] -bottom-20 -right-20 bg-[#046A38]" />

        {/* Floating Bright Tricolor Balloons */}
        {balloonConfig.map((b, index) => (
          <MinimalBalloon
            key={index}
            color={b.color}
            xPosition={b.xPosition}
            delay={b.delay}
            duration={b.duration}
            size={b.size}
            isWhite={b.isWhite}
          />
        ))}
      </div>

      {/* MAIN HERO CONTENT */}
      <div className="relative w-full max-w-[1400px] mx-auto flex-1 flex flex-col items-center justify-center z-10 my-auto">
        <div className="flex flex-col items-center text-center gap-3 w-full">
          <div className="flex flex-col items-center max-w-3xl w-full tracking-tight shrink-0">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] mb-2 border bg-white border-neutral-200/80 shadow-xs backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF671F]" />
                <span className="w-2 h-2 rounded-full bg-slate-300 border border-slate-400/50" />
                <span className="w-2 h-2 rounded-full bg-[#046A38]" />
              </span>
              <span className="text-[#FF671F] font-extrabold pl-1">Independence Day Special</span>
              <span className="text-neutral-300">|</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
              <span className="text-[#1A2255] font-bold">{slide.badge}</span>
            </div>

            {/* Typography with High Contrast Colors */}
            <h1 className="text-[1.9rem] sm:text-[2.8rem] md:text-[3.3rem] lg:text-[3.6rem] font-black tracking-[-0.03em] leading-[1.1] text-slate-900 flex flex-col justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`h1-${current}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45 }}
                  className="block text-slate-900"
                >
                  {slide.headingWords.slice(0, -1).join(" ")}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`h2-${current}`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="block bg-gradient-to-r from-[#FF5722] via-[#1A2255] to-[#046A38] bg-clip-text text-transparent relative whitespace-nowrap overflow-hidden pr-1.5 font-black"
                >
                  {slide.headingWords[slide.headingWords.length - 1]}
                </motion.span>
              </AnimatePresence>
            </h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[13px] sm:text-[15px] text-slate-600 font-semibold leading-[1.55] max-w-lg mt-2 mb-3.5"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full z-20 mb-2 max-w-md sm:max-w-none mx-auto">
              <Button
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold text-white transition-all duration-300 bg-[#1A2255] hover:bg-[#141b44] shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer group w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta1}
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold border-[#304AC0] bg-white text-[#1A2255] hover:bg-[#F0F4FF] shadow-xs transition-all duration-300 active:scale-[0.98] cursor-pointer w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta2}
                  <ArrowUpRight className="w-4 h-4 text-[#304AC0] stroke-[2.5]" />
                </span>
              </Button>
            </div>
          </div>

          {/* CANVAS IMAGE */}
          <div className="relative w-full max-w-[1280px] h-[280px] sm:h-[300px] md:h-[360px] lg:h-[400px] perspective-[1200px] my-2">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-[24px] border-4 border-white shadow-[0_25px_60px_-15px_rgba(26,34,85,0.14)] bg-neutral-200 transition-all duration-300 ease-out overflow-hidden"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={imgSrc}
                    alt="Credora Enterprise Funding Platform"
                    fill
                    unoptimized
                    onError={() => setImgSrc(slide.fallbackImage)}
                    className="object-cover object-center brightness-[0.98]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2255]/20 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* DOCK NAVIGATION STRIP */}
      <div className="w-full max-w-[1000px] mx-auto shrink-0 z-30 pt-2">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_5px_20px_-5px_rgba(0,0,0,0.05)] border border-neutral-200/80 p-1.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          {slides.map((s, i) => {
            const TabIcon = getIcon(s.tabIcon);
            const isActive = current === i;
            return (
              <button
                key={s.id ?? i}
                onClick={() => goTo(i)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive ? "text-white" : "text-slate-600 hover:text-[#1A2255]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="perfectTabIndicatorPremium"
                    className="absolute inset-0 z-0 bg-[#1A2255]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <TabIcon className={`w-3.5 h-3.5 z-10 shrink-0 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#1A2255]"}`} />
                <span className="whitespace-nowrap truncate z-10">{s.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
