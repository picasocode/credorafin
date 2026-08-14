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

// --- UNIFORM SOLID BRIGHT BALLOON COMPONENT ---
interface SolidBalloonProps {
  color: string;
  xPosition: number;
  delay: number;
  duration: number;
  size: number;
  isWhite?: boolean;
}

const SolidBalloon = ({ color, xPosition, delay, duration, size, isWhite }: SolidBalloonProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      style={{
        left: `${xPosition}%`,
        width: `${size}px`,
        height: `${size * 1.3}px`,
      }}
      initial={{ y: "-15vh", x: 0 }}
      animate={{
        y: "115vh",
        x: [0, 15, -15, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <svg viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <path
          d="M25 0C11.19 0 0 11.19 0 25C0 37.8 18.5 50 22.5 53.5C23.9 54.7 26.1 54.7 27.5 53.5C31.5 50 50 37.8 50 25C50 11.19 38.81 0 25 0Z"
          fill={color}
          stroke={isWhite ? "#94A3B8" : "none"}
          strokeWidth={isWhite ? "1.5" : "0"}
        />
        <path
          d="M12 10C7 16 7 24 10 30"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity={isWhite ? "0.8" : "0.6"}
        />
        <polygon points="22,54 28,54 25,58" fill={color} />
        <path
          d="M25 58 C 22 62, 28 66, 25 70"
          stroke="#475569"
          strokeWidth="1.5"
          fill="none"
          opacity="0.75"
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

  const balloonConfig = [
    { color: "#FF671F", xPosition: 5, delay: 0, duration: 14, size: 44 },
    { color: "#FFFFFF", xPosition: 22, delay: 3, duration: 18, size: 40, isWhite: true },
    { color: "#046A38", xPosition: 38, delay: 1, duration: 16, size: 48 },
    { color: "#FF671F", xPosition: 62, delay: 5, duration: 15, size: 42 },
    { color: "#FFFFFF", xPosition: 78, delay: 2, duration: 20, size: 46, isWhite: true },
    { color: "#046A38", xPosition: 92, delay: 4, duration: 17, size: 40 },
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
      className="relative bg-[#FAFBFD] w-full min-h-[calc(100vh-4rem)] max-h-[1000px] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-10 py-3 sm:py-4 font-sans antialiased"
    >
      {/* BACKGROUND LAYER WITH LARGER & DARKER TRICOLOR CORNER GRADIENTS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A225506_1px,transparent_1px),linear-gradient(to_bottom,#1A225506_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />

        {/* Top-Left Darker, Larger Glassy Saffron Gradient Corner */}
        <div className="absolute -top-28 -left-28 w-[450px] h-[450px] sm:w-[580px] sm:h-[580px] rounded-full bg-gradient-to-br from-[#E65100]/45 via-[#FF671F]/25 to-transparent blur-3xl backdrop-blur-xl border border-white/20" />

        {/* Bottom-Right Darker, Larger Glassy Green Gradient Corner */}
        <div className="absolute -bottom-28 -right-28 w-[450px] h-[450px] sm:w-[580px] sm:h-[580px] rounded-full bg-gradient-to-tl from-[#024B27]/45 via-[#046A38]/25 to-transparent blur-3xl backdrop-blur-xl border border-white/20" />

        {/* Floating Solid Bright Balloons */}
        {balloonConfig.map((b, index) => (
          <SolidBalloon
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

      {/* MAIN HERO CONTENT - AUTO FIT FRAME */}
      <div className="relative w-full max-w-[1300px] mx-auto flex-1 flex flex-col items-center justify-center z-10 py-1">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-center max-w-2xl sm:max-w-3xl w-full tracking-tight shrink-0">
            
            {/* Glassy Tricolor Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 border border-white/80 bg-white/70 backdrop-blur-md shadow-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FF671F]" />
                <span className="w-2 h-2 rounded-full bg-slate-300 border border-slate-400/50" />
                <span className="w-2 h-2 rounded-full bg-[#046A38]" />
              </span>
              <span className="text-[#FF671F] font-extrabold pl-1">Independence Day Special</span>
              <span className="text-neutral-300">|</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
              <span className="text-[#1A2255] font-bold">{slide.badge}</span>
            </div>

            {/* Compact Scaled Heading */}
            <h1 className="text-[1.75rem] sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.1rem] font-black tracking-[-0.03em] leading-[1.08] text-slate-900 flex flex-col justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`h1-${current}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
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
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="block bg-gradient-to-r from-[#FF5722] via-[#1A2255] to-[#046A38] bg-clip-text text-transparent relative whitespace-nowrap overflow-hidden pr-1 font-black"
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
                transition={{ duration: 0.25 }}
                className="text-[12px] sm:text-[14px] text-slate-600 font-semibold leading-[1.45] max-w-md sm:max-w-lg mt-1.5 mb-2.5"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-row items-center justify-center gap-2.5 w-full z-20 mb-1">
              <Button
                onClick={() => router.push("/contact")}
                className="h-9 sm:h-9 px-5 sm:px-6 rounded-full text-[11px] sm:text-[12px] font-bold text-white transition-all duration-300 bg-[#1A2255] hover:bg-[#141b44] shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer group"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta1}
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/contact")}
                className="h-9 sm:h-9 px-5 sm:px-6 rounded-full text-[11px] sm:text-[12px] font-bold border-[#304AC0] bg-white/80 backdrop-blur-md text-[#1A2255] hover:bg-[#F0F4FF] shadow-xs transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta2}
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#304AC0] stroke-[2.5]" />
                </span>
              </Button>
            </div>
          </div>

          {/* COMPACT RESPONSIVE DISPLAY FRAME */}
          <div className="relative w-full max-w-[1180px] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[330px] perspective-[1200px] my-1">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-[20px] border-4 border-white/90 shadow-[0_20px_50px_-15px_rgba(26,34,85,0.12)] bg-neutral-200 transition-all duration-300 ease-out overflow-hidden"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
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

      {/* COMPACT DOCK NAVIGATION STRIP */}
      <div className="w-full max-w-[950px] mx-auto shrink-0 z-30 pt-1 pb-1">
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] border border-white/90 p-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          {slides.map((s, i) => {
            const TabIcon = getIcon(s.tabIcon);
            const isActive = current === i;
            return (
              <button
                key={s.id ?? i}
                onClick={() => goTo(i)}
                className={`relative flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[10.5px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
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
