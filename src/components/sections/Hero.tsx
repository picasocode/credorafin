"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Award } from "lucide-react";
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
    headingWords: ["Celebrate", "Prosperous Onam", "Growth"],
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
    accent: "#D4AF37",
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
    accent: "#D4AF37",
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
    accent: "#D4AF37",
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
    accent: "#D4AF37",
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
    accent: "#D4AF37",
    isActive: true,
    sortOrder: 4
  }
];

// PETAL ANIMATION ENGINE
interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  rotation: number;
}

const PetalShower = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const colors = ["#FF4500", "#FFA500", "#FFD700", "#E60026", "#FF69B4", "#FFF8DC"];
    const generated: Petal[] = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 12 + 10,
      duration: Math.random() * 8 + 7,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            top: "-5%",
            left: `${p.x}%`,
            opacity: 0,
            rotate: p.rotation,
          }}
          animate={{
            top: "105%",
            left: `${p.x + (Math.random() * 10 - 5)}%`,
            opacity: [0, 0.9, 0.9, 0],
            rotate: p.rotation + 360,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: `${p.size}px`,
            height: `${p.size * 1.4}px`,
            backgroundColor: p.color,
            borderRadius: "80% 0% 80% 40%",
            boxShadow: `0 0 6px ${p.color}aa`,
            filter: "blur(0.4px)",
          }}
        />
      ))}
    </div>
  );
};

// SVG REALISTIC FLORAL POOKKALAM COMPONENT
const FloralPookkalam = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] pointer-events-none opacity-25 z-0 select-none">
      <motion.svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <radialGradient id="pookkalamGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="40%" stopColor="#FFC800" />
            <stop offset="75%" stopColor="#E67300" />
            <stop offset="100%" stopColor="#800000" />
          </radialGradient>
        </defs>

        {/* Outer Ring Petals */}
        <circle cx="250" cy="250" r="235" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="250" cy="250" r="225" fill="none" stroke="#E65100" strokeWidth="3" />

        {/* Dynamic Flower Petal Base Layers */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 250 250)`}>
            {/* Outer Marigold Petals */}
            <path
              d="M 250 30 Q 230 110 250 170 Q 270 110 250 30 Z"
              fill={i % 2 === 0 ? "#FF4500" : "#FFA500"}
              opacity="0.85"
            />
            {/* Inner Golden Layer */}
            <path
              d="M 250 70 Q 238 130 250 170 Q 262 130 250 70 Z"
              fill="#FFD700"
              opacity="0.9"
            />
            {/* Dark Red Base Ring Petals */}
            <circle cx="250" cy="50" r="10" fill="#8B0000" />
            <circle cx="250" cy="50" r="6" fill="#FF8C00" />
          </g>
        ))}

        {/* Middle Star Floral Ring */}
        {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
          <g key={`mid-${i}`} transform={`rotate(${angle} 250 250)`}>
            <path
              d="M 250 100 Q 240 150 250 190 Q 260 150 250 100 Z"
              fill={i % 2 === 0 ? "#D81B60" : "#FFB300"}
            />
          </g>
        ))}

        {/* Central Lotus Pattern */}
        <circle cx="250" cy="250" r="75" fill="url(#pookkalamGold)" />
        <circle cx="250" cy="250" r="60" fill="none" stroke="#800000" strokeWidth="2" />

        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={`lotus-${i}`} transform={`rotate(${angle} 250 250)`}>
            <path
              d="M 250 190 C 235 210 235 235 250 250 C 265 235 265 210 250 190 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
            <path
              d="M 250 195 C 240 213 240 233 250 245 C 260 233 260 213 250 195 Z"
              fill="#E60026"
            />
          </g>
        ))}

        {/* Center Diya / Lamp Flame */}
        <circle cx="250" cy="250" r="22" fill="#4A0000" />
        <circle cx="250" cy="250" r="16" fill="#FF8C00" />
        <circle cx="250" cy="250" r="9" fill="#FFD700" />
        <circle cx="250" cy="250" r="4" fill="#FFFFFF" />
      </motion.svg>
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
        // leave DEFAULT_SLIDES in place on any error
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
      className="relative bg-gradient-to-b from-[#FFFBF0] via-[#FDF3D8] to-[#F7E7B6] w-full min-h-[100svh] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-12 py-6 font-sans antialiased border-b border-[#E6C280]/40"
    >
      {/* FALLING FLOWER PETALS ENGINE */}
      <PetalShower />

      {/* BACKGROUND POOKKALAM & GOLD GLOW */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#B8860B0A_1px,transparent_1px),linear-gradient(to_bottom,#B8860B0A_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* Animated Radial Golden Glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.08, 0.95, 1], 
            opacity: [0.35, 0.5, 0.35]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[800px] h-[800px] rounded-full blur-[130px] top-[-5%] left-[15%]"
          style={{ background: `radial-gradient(circle, #FFD700 0%, #D4AF37 35%, transparent 70%)` }}
        />

        {/* Real Golden Floral Pookkalam Centerpiece */}
        <FloralPookkalam />
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
            
            {/* UNCHANGED ISO CERTIFIED BADGE WITH AWARD ICON */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] mb-2 bg-[#1A2255] text-white shadow-md border border-[#1A2255]"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ISO/IEC 27001:2022 CERTIFIED</span>
            </motion.div>

            <h1 className="text-[1.9rem] sm:text-[2.8rem] md:text-[3.3rem] lg:text-[3.6rem] font-black tracking-[-0.03em] leading-[1.1] text-amber-950 flex flex-col justify-center items-center">
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
                  className="block text-[#8B0000] relative after:content-[''] after:absolute after:-right-1.5 after:bottom-1 after:w-[3px] after:h-[75%] after:bg-[#D4AF37] after:animate-pulse whitespace-nowrap overflow-hidden pr-1.5 drop-shadow-sm"
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
                className="text-[13px] sm:text-[15px] text-amber-900/80 font-semibold leading-[1.5] max-w-lg mt-2 mb-3.5"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* ACTION BUTTONS */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full z-20 mb-2 max-w-md sm:max-w-none mx-auto">
              <Button
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold text-amber-950 transition-all duration-300 bg-gradient-to-r from-[#FFD700] via-[#FDB813] to-[#D4AF37] hover:brightness-105 shadow-md hover:shadow-lg hover:shadow-[#D4AF37]/30 active:scale-[0.98] cursor-pointer group w-full sm:w-auto border border-[#B8860B]/40"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta1}
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/contact")}
                className="h-11 sm:h-10 px-6 sm:px-7 rounded-full text-[12px] font-bold border-[#B8860B] bg-white/90 text-[#8B0000] hover:bg-[#FFFDF5] hover:text-[#500000] hover:border-[#8B0000] shadow-xs transition-all duration-300 active:scale-[0.98] cursor-pointer w-full sm:w-auto backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {slide.cta2}
                  <ArrowUpRight className="w-4 h-4 text-[#8B0000] stroke-[2.5]" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* CANVAS DISPLAY FRAME */}
          <motion.div 
            variants={itemVariants} 
            className="relative w-full max-w-[1280px] h-[280px] sm:h-[300px] md:h-[360px] lg:h-[400px] perspective-[1200px] my-2"
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-[24px] border-4 border-[#FFD700]/70 shadow-[0_25px_60px_-15px_rgba(212,175,55,0.3)] bg-amber-100 transition-all duration-300 ease-out overflow-hidden"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/25 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* TABS NAVIGATION DOCK STRIP */}
      <div className="w-full max-w-[1000px] mx-auto shrink-0 z-30 pt-2">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgb(212,175,55,0.15)] border border-[#E6C280]/60 p-1.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          {slides.map((s, i) => {
            const TabIcon = getIcon(s.tabIcon);
            const isActive = current === i;
            return (
              <button
                key={s.id ?? i}
                onClick={() => goTo(i)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive ? "text-amber-950" : "text-amber-900/70 hover:text-[#8B0000]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="perfectTabIndicatorPremium"
                    className="absolute inset-0 z-0 bg-gradient-to-r from-[#FFD700] via-[#FDB813] to-[#D4AF37] shadow-sm"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <TabIcon className={`w-3.5 h-3.5 z-10 shrink-0 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-amber-950" : "text-amber-800/60 group-hover:text-[#8B0000]"}`} />
                <span className="whitespace-nowrap truncate z-10">{s.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
