"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Award, Sparkles } from "lucide-react";
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
  hudLeft: { metric: string; label: string; status: string };
  hudRight: { metric: string; label: string; trend: string };
  hudGraph: { value: string; label: string };
  tabLabel: string;
  tabIcon: string;
  accent: string;
  isActive: boolean;
  sortOrder: number;
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
    hudLeft: { metric: "+18%", label: "Market Forecast", status: "Optimal Condition" },
    hudRight: { metric: "9.5% p.a.", label: "Average Interest Rate", trend: "Stable" },
    hudGraph: { value: "₹50 Crores", label: "Max Liquidity Pool Available" },
    tabLabel: "MSME Loan",
    tabIcon: "Building2",
    accent: "#1A2255",
    isActive: true,
    sortOrder: 0
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
    hudLeft: { metric: "Tier-1", label: "Sourcing Channel", status: "Priority Route" },
    hudRight: { metric: "₹100 Cr", label: "Maximum Allocation Cap", trend: "High Demand" },
    hudGraph: { value: "Syndicated", label: "Multi-Bank Framework Active" },
    tabLabel: "Project Finance",
    tabIcon: "TrendingUp",
    accent: "#1A2255",
    isActive: true,
    sortOrder: 1
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
    hudLeft: { metric: "90 Days", label: "Payment Cycle", status: "Discounted Early" },
    hudRight: { metric: "0 Collateral", label: "Asset-Light Facility", trend: "Flexible" },
    hudGraph: { value: "₹25 Crores", label: "Annual SCF Limit Available" },
    tabLabel: "Supply Chain Finance",
    tabIcon: "Briefcase",
    accent: "#1A2255",
    isActive: true,
    sortOrder: 2
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
    hudLeft: { metric: "Tier-1", label: "Commission Slab", status: "Recurring Payouts" },
    hudRight: { metric: "48 Hours", label: "Payout Cycle", trend: "Transparent" },
    hudGraph: { value: "Unlimited", label: "Referral Earning Potential" },
    tabLabel: "Referral Partner",
    tabIcon: "Handshake",
    accent: "#1A2255",
    isActive: true,
    sortOrder: 3
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
    hudLeft: { metric: "+150", label: "CIBIL Score Shift", status: "Engine Optimized" },
    hudRight: { metric: "Rapid", label: "Settlement Cycle Time", trend: "Immediate Plan" },
    hudGraph: { value: "Restored", label: "Removal of Legacy Default History" },
    tabLabel: "Credit Repair Services",
    tabIcon: "ShieldCheck",
    accent: "#1A2255",
    isActive: true,
    sortOrder: 4
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Hero() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<PublicHeroSlide[]>(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>(DEFAULT_SLIDES[0].image);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        // keep defaults
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
  const rotateX = useTransform(y, [-300, 300], [2, -2]);
  const rotateY = useTransform(x, [-300, 300], [-2, 2]);

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
      className="relative bg-[#FAF9F5] w-full min-h-[100svh] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-12 py-6 font-sans antialiased border-t-8 border-[#D97706]"
    >
      {/* 1. HIGH-END ANIMATED FLOWER RAIN (PETALS FALLING DOWNWARD) */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {[...Array(22)].map((_, i) => {
          const petalColors = ["#D97706", "#DC2626", "#059669", "#F59E0B"];
          const color = petalColors[i % petalColors.length];
          const leftPercent = (i * 4.5) + 1;

          return (
            <motion.div
              key={i}
              initial={{ y: -40, opacity: 0, rotate: 0 }}
              animate={{
                y: ["0vh", "105vh"],
                opacity: [0, 0.9, 0.9, 0],
                rotate: [0, 240, 480],
                x: [0, i % 2 === 0 ? 25 : -25, 0]
              }}
              transition={{
                duration: 6 + (i % 5),
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3
              }}
              style={{ left: `${leftPercent}%` }}
              className="absolute top-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 filter drop-shadow-sm" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8 7 3 11 3 15.5C3 19.1 6.1 22 12 22C17.9 22 21 19.1 21 15.5C21 11 16 7 12 2Z"
                  fill={color}
                  opacity="0.85"
                />
              </svg>
            </motion.div>
          );
        })}
      </div>

      {/* 2. ELEGANT POOKKALAM GEOMETRIC MANDALA (BACKGROUND) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Soft Golden Ambient Light */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-200/40 via-amber-100/20 to-transparent blur-3xl rounded-full" />

        {/* Dynamic Rotating Geometric Pookkalam */}
        <div className="w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] lg:w-[900px] lg:h-[900px] opacity-[0.14] transition-all">
          <svg className="w-full h-full animate-[spin_120s_linear_infinite]" viewBox="0 0 400 400" fill="none">
            {/* Concentric Traditional Rings */}
            <circle cx="200" cy="200" r="190" stroke="#D97706" strokeWidth="2" strokeDasharray="8 4" />
            <circle cx="200" cy="200" r="165" stroke="#15803D" strokeWidth="3" />
            <circle cx="200" cy="200" r="140" stroke="#B45309" strokeWidth="2" />
            <circle cx="200" cy="200" r="110" stroke="#DC2626" strokeWidth="2.5" />
            <circle cx="200" cy="200" r="80" fill="#FDE047" opacity="0.15" />
            
            {/* Symmetric Radial Petal Layers */}
            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 200 200)`}>
                <path d="M200 35 C208 65 208 95 200 125 C192 95 192 65 200 35 Z" fill={i % 2 === 0 ? "#D97706" : "#059669"} opacity="0.6" />
                <circle cx="200" cy="25" r="4" fill="#DC2626" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 3. VALLAM KALI (SNAKE BOAT SILHOUETTE) WITH BACKWATER FLOATING ANIMATION */}
      <div className="absolute bottom-12 left-0 right-0 z-10 pointer-events-none flex justify-center overflow-hidden">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-[1300px] h-28 opacity-25 flex items-end"
        >
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
            {/* Backwater Fluid Wave Lines */}
            <path d="M0,90 Q300,110 600,90 T1200,90 L1200,120 L0,120 Z" fill="#059669" />
            
            {/* Grand Snake Boat (Vallam) Profile */}
            <path
              d="M 100,92 Q 300,105 600,100 Q 900,105 1080,88 C 1105,65 1115,35 1120,10 C 1110,42 1090,75 1060,85 L 140,85 C 120,72 105,42 100,10 C 95,38 90,70 100,92 Z"
              fill="#1A2255"
            />

            {/* Traditional Royal Umbrellas (Muthukkuda) */}
            {[260, 430, 600, 770, 940].map((uX, idx) => (
              <g key={idx}>
                <line x1={uX} y1="85" x2={uX} y2="40" stroke="#1A2255" strokeWidth="2.5" />
                <path d={`M ${uX - 22},40 Q ${uX},22 ${uX + 22},40 Z`} fill={idx % 2 === 0 ? "#D97706" : "#DC2626"} />
                <line x1={uX - 22} y1="40" x2={uX + 22} y2="40" stroke="#1A2255" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
        </motion.div>
      </div>

      {/* MAIN HERO CONTENT */}
      <div className="relative w-full max-w-[1400px] mx-auto flex-1 flex flex-col items-center justify-center z-30 my-auto pt-2">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-3 w-full"
        >
          {/* HEADER TYPOGRAPHY */}
          <div className="flex flex-col items-center max-w-3xl w-full tracking-tight shrink-0">
            
            {/* FESTIVE ONAM BADGE */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-600/30 text-[#B45309] text-[11px] font-bold tracking-widest uppercase mb-1.5 shadow-2xs backdrop-blur-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Happy Onam • Festival of Abundance</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </motion.div>

            {/* RESTORED EXACT ORIGINAL ISO CERTIFIED BADGE */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] mb-2 bg-[#1A2255] text-white shadow-md border border-[#1A2255]"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ISO/IEC 27001:2022 CERTIFIED</span>
            </motion.div>

            <h1 className="text-[1.9rem] sm:text-[2.8rem] md:text-[3.3rem] lg:text-[3.6rem] font-black tracking-[-0.03em] leading-[1.1] text-neutral-950 flex flex-col justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`h1-${current}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
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
                  className="block text-[#1A2255] relative after:content-[''] after:absolute after:-right-1.5 after:bottom-1 after:w-[3px] after:h-[75%] after:bg-[#1A2255] after:animate-pulse whitespace-nowrap overflow-hidden pr-1.5"
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
                className="text-[13px] sm:text-[15px] text-neutral-600 font-medium leading-[1.5] max-w-lg mt-2 mb-3.5"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* ACTION BUTTONS */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full z-20 mb-2 max-w-md sm:max-w-none mx-auto">
              <Button
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold text-white transition-all duration-300 bg-[#1A2255] hover:bg-[#141b44] shadow-md hover:shadow-lg hover:shadow-[#1A2255]/10 active:scale-[0.98] cursor-pointer group w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta1}
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold border-[#D97706] bg-white text-[#1A2255] hover:bg-[#FEFCE8] hover:border-[#B45309] shadow-xs transition-all duration-300 active:scale-[0.98] cursor-pointer w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta2}
                  <ArrowUpRight className="w-4 h-4 text-[#D97706] stroke-[2.5]" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* MAIN IMAGE CANVAS FRAME WITH KASAVU GOLD BORDER */}
          <motion.div 
            variants={itemVariants} 
            className="relative w-full max-w-[1280px] h-[280px] sm:h-[300px] md:h-[360px] lg:h-[400px] perspective-[1200px] my-2"
          >
            {/* Kasavu Gold Top and Bottom Accent Strips */}
            <div className="absolute -top-1.5 inset-x-12 h-1 bg-gradient-to-r from-transparent via-[#D97706] to-transparent z-20" />
            <div className="absolute -bottom-1.5 inset-x-12 h-1 bg-gradient-to-r from-transparent via-[#D97706] to-transparent z-20" />

            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-[24px] border-4 border-amber-300/80 shadow-[0_25px_60px_-15px_rgba(217,119,6,0.18)] bg-neutral-200 transition-all duration-300 ease-out overflow-hidden ring-1 ring-[#1A2255]/10"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={imgSrc}
                    alt="Credora Enterprise Funding Platform"
                    fill
                    unoptimized
                    onError={() => setImgSrc(slide.fallbackImage)}
                    className="object-cover object-center brightness-[0.97]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2255]/20 via-transparent to-amber-500/10 pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* TABS NAVIGATION DOCK STRIP */}
      <div className="w-full max-w-[1000px] mx-auto shrink-0 z-40 pt-2 pb-2">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_5px_20px_-5px_rgba(0,0,0,0.06)] border border-amber-200/60 p-1.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          {slides.map((s, i) => {
            const TabIcon = getIcon(s.tabIcon);
            const isActive = current === i;
            return (
              <button
                key={s.id ?? i}
                onClick={() => goTo(i)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive ? "text-white" : "text-neutral-500 hover:text-[#1A2255]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="perfectTabIndicatorPremium"
                    className="absolute inset-0 z-0 bg-[#1A2255]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <TabIcon className={`w-3.5 h-3.5 z-10 shrink-0 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-amber-400" : "text-neutral-400 group-hover:text-[#1A2255]"}`} />
                <span className="whitespace-nowrap truncate z-10">{s.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
