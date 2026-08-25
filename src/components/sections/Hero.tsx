"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
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
    badge: "Festive Onam Offers",
    headingWords: ["Celebrate Onam", "With MSME", "Growth"],
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
    accent: "#B8860B",
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
    accent: "#B8860B",
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
    accent: "#B8860B",
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
    accent: "#B8860B",
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
    tabLabel: "Credit Repair",
    tabIcon: "ShieldCheck",
    accent: "#B8860B",
    isActive: true,
    sortOrder: 4
  }
];

/** Centered Grand Pookkalam Ornament */
const CenterPookkalam = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 300 300" className={`w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] opacity-25 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="150" r="145" stroke="#EAB308" strokeWidth="2.5" strokeDasharray="8 8" />
    <circle cx="150" cy="150" r="130" fill="#FEF08A" opacity="0.35" />
    <circle cx="150" cy="150" r="115" stroke="#D97706" strokeWidth="4" />
    <circle cx="150" cy="150" r="100" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 4" />
    <g transform="translate(150, 150)">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <path
          key={i}
          d="M0 0 C-22 -60 0 -105 0 -105 C0 -105 22 -60 0 0 Z"
          fill={i % 2 === 0 ? "#DC2626" : "#F59E0B"}
          transform={`rotate(${angle})`}
          opacity="0.85"
        />
      ))}
      {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
        <path
          key={i}
          d="M0 0 C-15 -40 0 -75 0 -75 C0 -75 15 -40 0 0 Z"
          fill="#16A34A"
          transform={`rotate(${angle})`}
          opacity="0.9"
        />
      ))}
      <circle cx="0" cy="0" r="35" fill="#B45309" />
      <circle cx="0" cy="0" r="22" fill="#FEF08A" />
      <circle cx="0" cy="0" r="12" fill="#DC2626" />
    </g>
  </svg>
);

/** Ornate Snake Boat (Vallamkali) */
const SnakeBoat = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 600 140" className={`w-80 sm:w-[540px] lg:w-[640px] h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="boatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#451A03" />
        <stop offset="50%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>

    {/* Shadow */}
    <path d="M15 90 Q180 135 580 65 C480 100 230 100 15 90 Z" fill="#451A03" opacity="0.25" filter="blur(4px)" />

    {/* Hull */}
    <path d="M10 85 Q180 130 570 60 C480 92 230 92 10 85 Z" fill="url(#boatGrad)" />
    <path d="M10 85 Q180 118 550 54 C460 85 220 85 10 85 Z" fill="#92400E" />

    {/* Traditional High Curved Snake Hood (Aamadi) */}
    <path d="M550 54 C585 25 575 -5 555 -10 C540 10 530 30 510 42 Z" fill="#D97706" />
    <path d="M555 -10 C565 -5 570 8 560 18 C550 28 535 38 515 45 Z" fill="url(#goldRibbon)" />
    <circle cx="552" cy="5" r="5" fill="#DC2626" />
    <circle cx="552" cy="5" r="2" fill="#FEF08A" />

    {/* Decorative Gold & Red Trims */}
    <path d="M30 87 Q200 110 530 58" stroke="url(#goldRibbon)" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M40 91 Q200 113 520 62" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />

    {/* Rowers & Decorative Umbrellas */}
    {[60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480].map((x, i) => (
      <g key={i}>
        {i % 4 === 0 && (
          <path d={`M${x - 2} ${38 + i * 0.3} Q${x} ${28 + i * 0.3} ${x + 8} ${38 + i * 0.3} Z`} fill="#DC2626" />
        )}
        <circle cx={x} cy={60 + i * 0.35} r="4.5" fill="#FDE047" />
        <path d={`M${x - 2} ${65 + i * 0.35} L${x + 2} ${82 + i * 0.35}`} stroke="#DC2626" strokeWidth="3" />
        <line x1={x} y1={70 + i * 0.35} x2={x - 10} y2={95 + i * 0.35} stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

/** Falling Flower Petals Overlay Animation (Confined to Background Layer) */
const PetalsOverlay = () => {
  const petals = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    duration: 7 + Math.random() * 5,
    delay: Math.random() * 4,
    scale: 0.6 + Math.random() * 0.7,
    color: i % 3 === 0 ? "#DC2626" : i % 3 === 1 ? "#F59E0B" : "#FEF08A",
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-10vh", x: `${p.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 3 : -3)}vw`, `${p.x}vw`],
            opacity: [0, 0.9, 0.9, 0],
            rotate: 360,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className="absolute top-0 left-0"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0 C15 5 20 10 10 20 C0 10 5 5 10 0 Z"
              fill={p.color}
              opacity="0.8"
              transform={`scale(${p.scale})`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

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
        // Fallback slides remain active
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
      className="relative bg-gradient-to-b from-[#FFFDF0] via-[#FEF9C3] to-[#FEF3C7] w-full min-h-[100svh] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-12 py-6 font-sans antialiased border-b-4 border-[#D97706]"
    >
      {/* FALLING PETALS ANIMATION (BEHIND MAIN CONTENT) */}
      <PetalsOverlay />

      {/* POOKKALAM IN THE EXACT CENTER */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <CenterPookkalam />
      </div>

      {/* GOLDEN GLOW OVERLAY */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#B453090F_1px,transparent_1px),linear-gradient(to_bottom,#B453090F_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        <motion.div
          animate={{ 
            scale: [1, 1.08, 0.95, 1], 
            x: [0, 20, -20, 0], 
            y: [0, -15, 15, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[750px] h-[750px] rounded-full blur-[140px] opacity-[0.35] top-[-15%] left-[20%]"
          style={{ background: `radial-gradient(circle, #F59E0B 0%, transparent 70%)` }}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative w-full max-w-[1400px] mx-auto flex-1 flex flex-col items-center justify-center z-10 my-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-3 w-full"
        >
          {/* HEADER TYPOGRAPHY */}
          <div className="flex flex-col items-center max-w-3xl w-full tracking-tight shrink-0">
            
            {/* FESTIVE GOLD BADGE */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] mb-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white shadow-lg border border-amber-300 z-10"
            >
              <Sparkles className="w-4 h-4 text-yellow-200 shrink-0 fill-yellow-200 animate-pulse" />
              <span>HAPPY ONAM • ISO/IEC 27001:2022 CERTIFIED</span>
            </motion.div>

            <h1 className="text-[1.9rem] sm:text-[2.8rem] md:text-[3.3rem] lg:text-[3.6rem] font-black tracking-[-0.03em] leading-[1.1] text-amber-950 flex flex-col justify-center items-center z-10">
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
                  className="block text-amber-700 relative after:content-[''] after:absolute after:-right-1.5 after:bottom-1 after:w-[3px] after:h-[75%] after:bg-amber-600 after:animate-pulse whitespace-nowrap overflow-hidden pr-1.5"
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
                className="text-[13px] sm:text-[15px] text-amber-900/80 font-medium leading-[1.5] max-w-lg mt-2 mb-3.5 z-10"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* ACTION BUTTONS */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full z-20 mb-2 max-w-md sm:max-w-none mx-auto">
              <Button
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold text-white transition-all duration-300 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 shadow-md hover:shadow-lg hover:shadow-amber-600/20 active:scale-[0.98] cursor-pointer group w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta1}
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold border-amber-600 bg-white/90 text-amber-900 hover:bg-amber-100/60 hover:text-amber-950 hover:border-amber-700 shadow-xs transition-all duration-300 active:scale-[0.98] cursor-pointer w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta2}
                  <ArrowUpRight className="w-4 h-4 text-amber-700 stroke-[2.5]" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* IMAGE CANVAS WITH ELEVATED Z-INDEX TO KEEP SLIDES CLEAR */}
          <motion.div 
            variants={itemVariants} 
            className="relative w-full max-w-[1280px] h-[280px] sm:h-[300px] md:h-[360px] lg:h-[400px] perspective-[1200px] my-2 z-30"
          >
            {/* PRETTIER SNAKE BOAT OVERLAY */}
            <motion.div 
              initial={{ x: -120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none filter drop-shadow-2xl"
            >
              <SnakeBoat />
            </motion.div>

            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-[24px] border-4 border-amber-300/90 shadow-[0_25px_60px_-15px_rgba(217,119,6,0.25)] bg-amber-100 transition-all duration-300 ease-out overflow-hidden z-30"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/30 via-transparent to-amber-500/10 pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* TABS NAVIGATION DOCK STRIP (HIGH Z-INDEX TO STAY UNBLURRED BY PETALS) */}
      <div className="w-full max-w-[1000px] mx-auto shrink-0 z-40 pt-2">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_5px_20px_-5px_rgba(180,83,9,0.15)] border border-amber-200 p-1.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          {slides.map((s, i) => {
            const TabIcon = getIcon(s.tabIcon);
            const isActive = current === i;
            return (
              <button
                key={s.id ?? i}
                onClick={() => goTo(i)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive ? "text-white" : "text-amber-900/70 hover:text-amber-950"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="perfectTabIndicatorPremium"
                    className="absolute inset-0 z-0 bg-gradient-to-r from-amber-600 to-yellow-600"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <TabIcon className={`w-3.5 h-3.5 z-10 shrink-0 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-white" : "text-amber-700 group-hover:text-amber-900"}`} />
                <span className="whitespace-nowrap truncate z-10">{s.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
