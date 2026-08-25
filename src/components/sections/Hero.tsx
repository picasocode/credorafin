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

// Cartoon Flower Petal Component
function CartoonFlower({ color, centerColor }: { color: string; centerColor: string }) {
  return (
    <svg className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="10" r="7" fill={color} stroke="#78350F" strokeWidth="2" />
      <circle cx="30" cy="20" r="7" fill={color} stroke="#78350F" strokeWidth="2" />
      <circle cx="20" cy="30" r="7" fill={color} stroke="#78350F" strokeWidth="2" />
      <circle cx="10" cy="20" r="7" fill={color} stroke="#78350F" strokeWidth="2" />
      <circle cx="20" cy="20" r="6" fill={centerColor} stroke="#78350F" strokeWidth="2" />
    </svg>
  );
}

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

  // Cartoon flower colors array
  const flowerStyles = [
    { color: "#FF4500", centerColor: "#FFD700" }, // Bright Orange-Red
    { color: "#FF1493", centerColor: "#FFFFFF" }, // Deep Pink
    { color: "#FFD700", centerColor: "#FF4500" }, // Vibrant Yellow
    { color: "#9370DB", centerColor: "#FFD700" }, // Bright Purple
    { color: "#00FF7F", centerColor: "#FF1493" }, // Spring Green
  ];

  return (
    <section
      id="hero"
      aria-busy={loading}
      className="relative bg-gradient-to-b from-[#FFF5D6] via-[#FDE68A] to-[#FFF5D6] w-full min-h-[100svh] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-12 py-6 font-sans antialiased border-t-8 border-[#F59E0B]"
    >
      {/* 1. CARTOON FLOWER RAIN (FALLING VERTICALLY FROM TOP) */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => {
          const style = flowerStyles[i % flowerStyles.length];
          const leftPos = (i * 6.25) + 1; // Even horizontal distribution
          return (
            <motion.div
              key={i}
              initial={{ y: "-10vh", rotate: 0 }}
              animate={{
                y: "115vh",
                rotate: 360,
              }}
              transition={{
                duration: 5 + (i % 4),
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.35,
              }}
              style={{ left: `${leftPos}%` }}
              className="absolute top-0"
            >
              <CartoonFlower color={style.color} centerColor={style.centerColor} />
            </motion.div>
          );
        })}
      </div>

      {/* 2. BRIGHT CARTOON POOKKALAM (ROTATING FLOWER CARPET) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[850px] lg:h-[850px] z-0 pointer-events-none opacity-85">
        <svg className="w-full h-full animate-[spin_40s_linear_infinite]" viewBox="0 0 300 300">
          {/* Outer Marigold Ring */}
          <circle cx="150" cy="150" r="140" fill="#F59E0B" stroke="#B45309" strokeWidth="6" />
          <circle cx="150" cy="150" r="125" fill="#EF4444" stroke="#991B1B" strokeWidth="5" />
          <circle cx="150" cy="150" r="105" fill="#10B981" stroke="#065F46" strokeWidth="5" />
          <circle cx="150" cy="150" r="85" fill="#FBBF24" stroke="#D97706" strokeWidth="5" />
          <circle cx="150" cy="150" r="60" fill="#EC4899" stroke="#BE185D" strokeWidth="5" />
          <circle cx="150" cy="150" r="35" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="4" />
          <circle cx="150" cy="150" r="15" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />

          {/* Cartoon Petals Around Circles */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle} 150 150)`}>
              <ellipse cx="150" cy="30" rx="12" ry="22" fill="#FF4500" stroke="#78350F" strokeWidth="3" />
              <circle cx="150" cy="12" r="7" fill="#FFD700" stroke="#78350F" strokeWidth="2" />
              <ellipse cx="150" cy="72" rx="9" ry="16" fill="#FFFFFF" stroke="#78350F" strokeWidth="3" />
            </g>
          ))}
        </svg>
      </div>

      {/* 3. BRIGHT CARTOON VALLAM KALI (ANIMATED ROWING SNAKE BOAT WITH UMBRELLAS) */}
      <div className="absolute bottom-10 left-0 right-0 h-36 z-10 pointer-events-none overflow-hidden">
        {/* Animated Boat Moving Across Screen */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 flex items-end"
        >
          <svg className="w-[600px] sm:w-[800px] h-32" viewBox="0 0 800 160" fill="none">
            {/* Snake Boat Hull */}
            <path
              d="M 20 130 Q 150 150 400 145 Q 680 150 780 120 C 795 90 800 40 790 10 C 780 60 760 110 730 125 L 50 125 C 35 110 25 70 20 10 C 15 50 10 90 20 130 Z"
              fill="#854D0E"
              stroke="#451A03"
              strokeWidth="6"
            />
            {/* Gold Stripe on Boat */}
            <path d="M 40 130 Q 400 142 740 125" stroke="#FBBF24" strokeWidth="6" fill="none" />

            {/* Cartoon Rowers */}
            {[100, 160, 220, 280, 340, 400, 460, 520, 580, 640].map((xPos, idx) => (
              <g key={idx}>
                {/* Rower Body */}
                <circle cx={xPos} cy="100" r="10" fill="#FDBA74" stroke="#78350F" strokeWidth="3" />
                <rect x={xPos - 8} y="110" width="16" height="18" rx="4" fill="#DC2626" stroke="#78350F" strokeWidth="3" />
                {/* Oar Moving */}
                <motion.line
                  x1={xPos}
                  y1="115"
                  x2={xPos - 15}
                  y2="150"
                  stroke="#451A03"
                  strokeWidth="5"
                  strokeLinecap="round"
                  animate={{ rotate: [0, -20, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
              </g>
            ))}

            {/* Bright Cartoon Ceremonial Umbrellas (Muthukkuda) */}
            {[130, 250, 370, 490, 610].map((uX, idx) => (
              <g key={idx}>
                <line x1={uX} y1="125" x2={uX} y2="55" stroke="#451A03" strokeWidth="5" />
                {/* Umbrella Canopy */}
                <path
                  d={`M ${uX - 32} 55 Q ${uX} 15 ${uX + 32} 55 Z`}
                  fill={idx % 2 === 0 ? "#EF4444" : "#F59E0B"}
                  stroke="#78350F"
                  strokeWidth="4"
                />
                {/* Hanging Gold Tassels */}
                <circle cx={uX - 28} cy="58" r="4" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
                <circle cx={uX - 14} cy="58" r="4" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
                <circle cx={uX} cy="58" r="4" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
                <circle cx={uX + 14} cy="58" r="4" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
                <circle cx={uX + 28} cy="58" r="4" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
              </g>
            ))}
          </svg>
        </motion.div>
      </div>

      {/* CARTOON WATER WAVES AT BOTTOM */}
      <div className="absolute bottom-0 left-0 right-0 h-14 z-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 C150,90 350,-10 500,50 C650,110 900,10 1200,40 L1200,120 L0,120 Z" fill="#0284C7" />
          <path d="M0,60 C200,100 450,20 700,70 C950,120 1100,30 1200,60 L1200,120 L0,120 Z" fill="#0369A1" />
        </svg>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative w-full max-w-[1400px] mx-auto flex-1 flex flex-col items-center justify-center z-30 my-auto pt-2">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-3 w-full"
        >
          {/* HEADER TYPOGRAPHY */}
          <div className="flex flex-col items-center max-w-3xl w-full tracking-tight shrink-0">
            
            {/* CARTOON FESTIVE BADGE */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#F59E0B] stroke-[#78350F] border-3 border-[#78350F] text-[#78350F] text-[12px] font-black tracking-widest uppercase mb-2 shadow-[3px_3px_0px_#78350F]"
            >
              <Sparkles className="w-4 h-4 text-white fill-white" />
              <span>Happy Onam • Grand Celebrations</span>
              <Sparkles className="w-4 h-4 text-white fill-white" />
            </motion.div>

            {/* RESTORED ISO CERTIFIED BADGE (EXACT ORIGINAL STYLING) */}
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
                  className="block drop-shadow-sm"
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
                  className="block text-[#1A2255] relative after:content-[''] after:absolute after:-right-1.5 after:bottom-1 after:w-[3px] after:h-[75%] after:bg-[#1A2255] after:animate-pulse whitespace-nowrap overflow-hidden pr-1.5 drop-shadow-sm"
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
                className="text-[13px] sm:text-[15px] text-neutral-900 font-bold leading-[1.5] max-w-lg mt-2 mb-3.5 bg-white/70 backdrop-blur-xs px-4 py-1.5 rounded-xl border-2 border-amber-400/60"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* ACTION BUTTONS */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full z-20 mb-2 max-w-md sm:max-w-none mx-auto">
              <Button
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold text-white transition-all duration-300 bg-[#1A2255] hover:bg-[#141b44] shadow-md hover:shadow-lg hover:shadow-[#1A2255]/10 active:scale-[0.98] cursor-pointer group w-full sm:w-auto border-2 border-slate-900"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta1}
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold border-2 border-amber-600 bg-white text-[#1A2255] hover:bg-[#FEFCE8] hover:border-amber-700 shadow-xs transition-all duration-300 active:scale-[0.98] cursor-pointer w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta2}
                  <ArrowUpRight className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* CANVAS CARD WITH CARTOON BORDER */}
          <motion.div 
            variants={itemVariants} 
            className="relative w-full max-w-[1280px] h-[260px] sm:h-[280px] md:h-[340px] lg:h-[380px] perspective-[1200px] my-2"
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-[24px] border-4 border-[#78350F] shadow-[8px_8px_0px_#78350F] bg-neutral-200 transition-all duration-300 ease-out overflow-hidden"
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
      <div className="w-full max-w-[1000px] mx-auto shrink-0 z-40 pt-2 pb-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[4px_4px_0px_#78350F] border-2 border-[#78350F] p-1.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          {slides.map((s, i) => {
            const TabIcon = getIcon(s.tabIcon);
            const isActive = current === i;
            return (
              <button
                key={s.id ?? i}
                onClick={() => goTo(i)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive ? "text-white" : "text-neutral-700 hover:text-[#1A2255]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="perfectTabIndicatorPremium"
                    className="absolute inset-0 z-0 bg-[#1A2255]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <TabIcon className={`w-3.5 h-3.5 z-10 shrink-0 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-amber-400" : "text-neutral-500 group-hover:text-[#1A2255]"}`} />
                <span className="whitespace-nowrap truncate z-10">{s.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
