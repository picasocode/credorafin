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
      className="relative bg-gradient-to-b from-[#FFFDF2] via-[#FAF3DC] to-[#FFFDF2] w-full min-h-[100svh] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-6 lg:px-12 py-6 font-sans antialiased border-t-8 border-[#D97706]"
    >
      {/* 1. ONAM POOKKALAM FLOWER RAIN (FALLING PETALS FROM TOP) */}
      <div className="absolute inset-x-0 top-0 h-full z-20 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -30, opacity: 0, x: `${(i * 5.5) + 2}%`, rotate: 0 }}
            animate={{
              y: ["0vh", "100vh"],
              opacity: [0, 0.85, 0.85, 0],
              x: [`${(i * 5.5) + 2}%`, `${(i * 5.5) + (i % 2 === 0 ? 5 : -3)}%`],
              rotate: [0, 360]
            }}
            transition={{
              duration: 7 + (i % 5),
              repeat: Infinity,
              ease: "linear",
              delay: (i * 0.4)
            }}
            className="absolute"
          >
            {/* Flower Petal SVG Variations */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C13.5 6 18 8 18 12C18 16 13.5 18 12 22C10.5 18 6 16 6 12C6 8 10.5 6 12 2Z"
                fill={i % 3 === 0 ? "#F59E0B" : i % 3 === 1 ? "#EF4444" : "#10B981"}
                opacity="0.8"
              />
              <circle cx="12" cy="12" r="2" fill="#FEF08A" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 2. BACKGROUND POOKKALAM MANDALA & GOLD GLOW */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft Kerala Kasavu Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#D9770612_1px,transparent_1px),linear-gradient(to_bottom,#D9770612_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* Warm Golden Backdrop Lighting */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-300/30 via-orange-300/15 to-transparent blur-3xl rounded-full" />

        {/* POOKKALAM: Large Traditional Rotating Flower Carpet Centerpiece */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] sm:w-[850px] sm:h-[850px] opacity-[0.09]">
          <svg className="w-full h-full animate-[spin_90s_linear_infinite]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="95" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="#059669" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="68" fill="none" stroke="#DC2626" strokeWidth="1" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle} 100 100)`}>
                <ellipse cx="100" cy="32" rx="7" ry="20" fill="#F59E0B" opacity="0.8" />
                <ellipse cx="100" cy="38" rx="4" ry="14" fill="#059669" opacity="0.7" />
                <circle cx="100" cy="16" r="3" fill="#DC2626" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 3. VALLAM KALI (SNAKE BOAT) WITH MUTHUKKUDA (CEREMONIAL UMBRELLAS) */}
      <div className="absolute bottom-0 left-0 right-0 h-28 opacity-20 pointer-events-none z-0 flex items-end justify-center overflow-hidden">
        <svg className="w-full max-w-[1400px] h-24" viewBox="0 0 1000 120" preserveAspectRatio="none">
          {/* Backwater Waves */}
          <path d="M0,80 Q250,110 500,80 T1000,80 L1000,120 L0,120 Z" fill="#059669" />
          
          {/* Snake Boat (Vallam) Curved Silhouette */}
          <path d="M50,90 Q150,98 500,95 Q850,98 950,90 C970,70 980,40 985,20 C980,50 960,80 940,88 L60,88 Q40,75 25,20 C32,50 40,75 50,90 Z" fill="#78350F" />
          
          {/* Muthukkuda Decorative Umbrellas on the Snake Boat */}
          {[200, 350, 500, 650, 800].map((cx, idx) => (
            <g key={idx}>
              <line x1={cx} y1="90" x2={cx} y2="45" stroke="#78350F" strokeWidth="2" />
              <path d={`M${cx - 20},45 Q${cx},25 ${cx + 20},45 Z`} fill={idx % 2 === 0 ? "#DC2626" : "#F59E0B"} />
              {/* Umbrella Frills */}
              <circle cx={cx - 18} cy="46" r="2" fill="#FEF08A" />
              <circle cx={cx} cy="46" r="2" fill="#FEF08A" />
              <circle cx={cx + 18} cy="46" r="2" fill="#FEF08A" />
            </g>
          ))}
        </svg>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative w-full max-w-[1400px] mx-auto flex-1 flex flex-col items-center justify-center z-10 my-auto pt-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-3 w-full"
        >
          {/* HEADER TYPOGRAPHY */}
          <div className="flex flex-col items-center max-w-3xl w-full tracking-tight shrink-0">
            
            {/* FESTIVE ONAM BANNER */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-emerald-500/20 border border-amber-600/30 text-amber-900 text-[11px] font-bold tracking-widest uppercase mb-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Happy Onam • Festivities & Prosperity</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
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
                className="text-[13px] sm:text-[15px] text-neutral-700 font-medium leading-[1.5] max-w-lg mt-2 mb-3.5"
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

          {/* IMAGE CANVAS WITH KASAVU GOLD DECORATION */}
          <motion.div 
            variants={itemVariants} 
            className="relative w-full max-w-[1280px] h-[280px] sm:h-[300px] md:h-[360px] lg:h-[400px] perspective-[1200px] my-2"
          >
            {/* Decorative Golden Kasavu Edging */}
            <div className="absolute -top-1.5 inset-x-12 h-1 bg-gradient-to-r from-transparent via-[#D97706] to-transparent z-20" />
            <div className="absolute -bottom-1.5 inset-x-12 h-1 bg-gradient-to-r from-transparent via-[#D97706] to-transparent z-20" />

            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-[24px] border-4 border-[#FDE047] shadow-[0_25px_60px_-15px_rgba(217,119,6,0.2)] bg-neutral-200 transition-all duration-300 ease-out overflow-hidden ring-2 ring-amber-500/30"
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
      <div className="w-full max-w-[1000px] mx-auto shrink-0 z-30 pt-2">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_5px_20px_-5px_rgba(217,119,6,0.12)] border border-amber-200/60 p-1.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          {slides.map((s, i) => {
            const TabIcon = getIcon(s.tabIcon);
            const isActive = current === i;
            return (
              <button
                key={s.id ?? i}
                onClick={() => goTo(i)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive ? "text-white" : "text-neutral-600 hover:text-[#1A2255]"
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
