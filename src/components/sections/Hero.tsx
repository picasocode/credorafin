"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
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
    subtitle:
      "Customized collateral-free funding solutions syndicated across 70+ banking partners globally.",
    cta1: "Build Finance",
    cta2: "Contact us",
    image: "/images/pages/hero-indian-team.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "MSME Loan",
    tabIcon: "Building2",
  },
  {
    id: "default-2",
    badge: "Infrastructure & Scale",
    headingWords: ["Raise", "Capital for", "Large Projects"],
    subtitle:
      "Specialized debt structuring, liquidity sourcing, and structured corporate finance built for industrial expansion.",
    cta1: "Raise Capital",
    cta2: "Contact us",
    image: "/images/pages/office-india.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "Project Finance",
    tabIcon: "TrendingUp",
  },
  {
    id: "default-3",
    badge: "Working Capital Unlocked",
    headingWords: ["Optimize", "Cash Flow with", "SCF Solutions"],
    subtitle:
      "Vendor payment discounting and receivables financing that keep your supply chain liquid and resilient.",
    cta1: "Get SCF",
    cta2: "Contact us",
    image: "/images/pages/success-india.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "Supply Chain Finance",
    tabIcon: "Briefcase",
  },
  {
    id: "default-4",
    badge: "Partner & Earn",
    headingWords: ["Grow", "Together as a", "Referral Partner"],
    subtitle:
      "Refer MSME clients and earn attractive recurring commissions while helping businesses access faster funding.",
    cta1: "Become a Partner",
    cta2: "Contact us",
    image: "/images/pages/referral-india.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "Referral Partner",
    tabIcon: "Handshake",
  },
  {
    id: "default-5",
    badge: "Financial Reconstruction",
    headingWords: ["Resolve", "Defaults &", "Repair Credit"],
    subtitle:
      "Struggling with historical settlement records or complex CIBIL positions? Restore corporate leverage now.",
    cta1: "Fix Credit Score",
    cta2: "Contact us",
    image: "/images/pages/handshake-india.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    tabLabel: "Credit Repair Services",
    tabIcon: "ShieldCheck",
  },
];

/* -------------------------------------------------------------------------- */
/* FLOATING BALLOON                                                            */
/* -------------------------------------------------------------------------- */

interface SolidBalloonProps {
  color: string;
  xPosition: number;
  delay: number;
  duration: number;
  size: number;
  isWhite?: boolean;
}

const SolidBalloon = ({
  color,
  xPosition,
  delay,
  duration,
  size,
  isWhite,
}: SolidBalloonProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      style={{
        left: `${xPosition}%`,
        width: `${size}px`,
        height: `${size * 1.3}px`,
      }}
      initial={{ y: "-18vh", x: 0 }}
      animate={{
        y: "118vh",
        x: [0, 12, -12, 0],
      }}
      transition={{
        duration,
        delay,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <svg
        viewBox="0 0 50 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.10)]"
      >
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
          opacity={isWhite ? "0.8" : "0.55"}
        />

        <polygon
          points="22,54 28,54 25,58"
          fill={color}
        />

        <path
          d="M25 58 C22 62, 28 66, 25 70"
          stroke="#475569"
          strokeWidth="1.5"
          fill="none"
          opacity="0.65"
        />
      </svg>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* HERO                                                                       */
/* -------------------------------------------------------------------------- */

export default function Hero() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [slides, setSlides] =
    useState<PublicHeroSlide[]>(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(DEFAULT_SLIDES[0].image);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---------------------------------------------------------------------- */
  /* BALLOONS                                                               */
  /* ---------------------------------------------------------------------- */

  const balloonConfig = [
    {
      color: "#FF671F",
      xPosition: 5,
      delay: 0,
      duration: 16,
      size: 38,
    },
    {
      color: "#FFFFFF",
      xPosition: 18,
      delay: 4,
      duration: 20,
      size: 32,
      isWhite: true,
    },
    {
      color: "#046A38",
      xPosition: 34,
      delay: 1,
      duration: 18,
      size: 40,
    },
    {
      color: "#FF671F",
      xPosition: 66,
      delay: 5,
      duration: 17,
      size: 36,
    },
    {
      color: "#FFFFFF",
      xPosition: 82,
      delay: 2,
      duration: 21,
      size: 34,
      isWhite: true,
    },
    {
      color: "#046A38",
      xPosition: 95,
      delay: 4,
      duration: 19,
      size: 36,
    },
  ];

  const slide = slides[current] ?? slides[0];

  /* ---------------------------------------------------------------------- */
  /* LOAD CMS SLIDES                                                        */
  /* ---------------------------------------------------------------------- */

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
        // Keep default slides silently.
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* IMAGE                                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setImgSrc(
      slides[current]?.image ?? DEFAULT_SLIDES[0].image
    );
  }, [current, slides]);

  /* ---------------------------------------------------------------------- */
  /* 3D IMAGE MOTION                                                        */
  /* ---------------------------------------------------------------------- */

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(
    y,
    [-300, 300],
    [2.5, -2.5]
  );

  const rotateY = useTransform(
    x,
    [-300, 300],
    [-2.5, 2.5]
  );

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    x.set(
      e.clientX -
        rect.left -
        rect.width / 2
    );

    y.set(
      e.clientY -
        rect.top -
        rect.height / 2
    );
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  /* ---------------------------------------------------------------------- */
  /* SLIDER                                                                 */
  /* ---------------------------------------------------------------------- */

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === current) return;
      setCurrent(nextIndex);
    },
    [current]
  );

  const goNext = useCallback(() => {
    setCurrent(
      (prev) => (prev + 1) % slides.length
    );
  }, [slides.length]);

  useEffect(() => {
    timerRef.current = setInterval(
      goNext,
      5000
    );

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [goNext]);

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */

  return (
    <section
      id="hero"
      aria-busy={loading}
      className="
        relative
        isolate
        w-full
        h-[calc(100dvh-80px)]
        min-h-[520px]
        max-h-[850px]
        overflow-hidden
        select-none
        bg-[#FAFBFD]
        px-4
        sm:px-6
        lg:px-10
        py-2
        font-sans
        antialiased
      "
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                          */}
      {/* ================================================================== */}

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">

        {/* Extremely subtle technical grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.38]
            bg-[linear-gradient(to_right,#1A225506_1px,transparent_1px),linear-gradient(to_bottom,#1A225506_1px,transparent_1px)]
            bg-[size:2.5rem_2.5rem]
          "
        />

        {/* ================================================================ */}
        {/* ORANGE — TOP LEFT CORNER ONLY                                   */}
        {/* ================================================================ */}

        <div
          className="
            absolute
            -top-40
            -left-40
            w-[620px]
            h-[620px]
            rounded-full
            bg-[radial-gradient(circle_at_center,rgba(255,103,31,0.34)_0%,rgba(255,103,31,0.18)_32%,rgba(255,103,31,0.07)_55%,transparent_75%)]
            blur-3xl
          "
        />

        {/* Small concentrated orange glow */}
        <div
          className="
            absolute
            top-0
            left-0
            w-[260px]
            h-[260px]
            rounded-full
            bg-[#FF671F]/10
            blur-[70px]
          "
        />

        {/* ================================================================ */}
        {/* GREEN — BOTTOM RIGHT CORNER ONLY                                 */}
        {/* ================================================================ */}

        <div
          className="
            absolute
            -bottom-44
            -right-44
            w-[650px]
            h-[650px]
            rounded-full
            bg-[radial-gradient(circle_at_center,rgba(4,106,56,0.38)_0%,rgba(4,106,56,0.20)_34%,rgba(4,106,56,0.08)_57%,transparent_76%)]
            blur-3xl
          "
        />

        {/* Slightly darker green core */}
        <div
          className="
            absolute
            bottom-0
            right-0
            w-[280px]
            h-[280px]
            rounded-full
            bg-[#046A38]/10
            blur-[70px]
          "
        />

        {/* ================================================================ */}
        {/* BALLOONS                                                          */}
        {/* ================================================================ */}

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

      {/* ================================================================== */}
      {/* MAIN CONTENT                                                        */}
      {/* ================================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[1240px]
          h-full
          mx-auto
          flex
          flex-col
          justify-between
          min-h-0
        "
      >

        {/* ================================================================ */}
        {/* TOP / CENTER CONTENT                                              */}
        {/* ================================================================ */}

        <div
          className="
            flex
            min-h-0
            flex-1
            flex-col
            items-center
            justify-center
            text-center
            gap-1
          "
        >
          {/* -------------------------------------------------------------- */}
          {/* BADGE                                                           */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              px-3
              py-1
              text-[9px]
              sm:text-[10px]
              font-bold
              uppercase
              tracking-[0.11em]
              border
              border-white/90
              bg-white/80
              backdrop-blur-xl
              shadow-[0_4px_18px_rgba(26,34,85,0.06)]
              mb-1
              shrink-0
            "
          >
            <span className="flex items-center gap-[3px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 border border-slate-400/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#046A38]" />
            </span>

            <span className="text-[#FF671F] font-extrabold pl-1">
              Independence Day Special
            </span>

            <span className="text-neutral-300">
              |
            </span>

            <Sparkles className="w-3 h-3 text-[#FF671F]" />

            <span className="text-[#1A2255] font-bold">
              {slide.badge}
            </span>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* HEADLINE                                                        */}
          {/* -------------------------------------------------------------- */}

          <h1
            className="
              text-[1.55rem]
              sm:text-[2.1rem]
              md:text-[2.45rem]
              lg:text-[2.75rem]
              font-black
              tracking-[-0.035em]
              leading-[1.04]
              text-slate-900
              flex
              flex-col
              justify-center
              items-center
              shrink-0
            "
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`h1-${current}`}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="block text-slate-900"
              >
                {slide.headingWords
                  .slice(0, -1)
                  .join(" ")}
              </motion.span>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.span
                key={`h2-${current}`}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.05,
                }}
                className="
                  block
                  text-[#1A2255]
                  font-black
                "
              >
                {
                  slide.headingWords[
                    slide.headingWords.length - 1
                  ]
                }
              </motion.span>
            </AnimatePresence>
          </h1>

          {/* -------------------------------------------------------------- */}
          {/* SUBTITLE                                                        */}
          {/* -------------------------------------------------------------- */}

          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${current}`}
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                text-[11px]
                sm:text-[13px]
                text-slate-600
                font-semibold
                leading-[1.35]
                max-w-[430px]
                sm:max-w-[560px]
                mt-1
                mb-2
                shrink-0
              "
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* -------------------------------------------------------------- */}
          {/* BUTTONS                                                         */}
          {/* -------------------------------------------------------------- */}

          <div
            className="
              flex
              flex-row
              items-center
              justify-center
              gap-2
              w-full
              z-20
              mb-2
              shrink-0
            "
          >
            <Button
              onClick={() =>
                router.push("/contact")
              }
              className="
                h-8
                px-4
                sm:px-5
                rounded-full
                text-[10px]
                sm:text-[11px]
                font-bold
                text-white
                bg-[#1A2255]
                hover:bg-[#141b44]
                shadow-[0_5px_16px_rgba(26,34,85,0.18)]
                hover:shadow-[0_8px_22px_rgba(26,34,85,0.22)]
                transition-all
                duration-300
                active:scale-[0.98]
                cursor-pointer
                group
              "
            >
              <span className="flex items-center gap-1.5">
                {slide.cta1}

                <ArrowUpRight
                  className="
                    w-3.5
                    h-3.5
                    stroke-[2.5]
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                router.push("/contact")
              }
              className="
                h-8
                px-4
                sm:px-5
                rounded-full
                text-[10px]
                sm:text-[11px]
                font-bold
                border-[#304AC0]
                bg-white/90
                backdrop-blur-md
                text-[#1A2255]
                hover:bg-[#F0F4FF]
                shadow-sm
                transition-all
                duration-300
                active:scale-[0.98]
                cursor-pointer
              "
            >
              <span className="flex items-center gap-1.5">
                {slide.cta2}

                <ArrowUpRight
                  className="
                    w-3.5
                    h-3.5
                    text-[#304AC0]
                    stroke-[2.5]
                  "
                />
              </span>
            </Button>
          </div>

          {/* ============================================================ */}
          {/* IMAGE FRAME                                                    */}
          {/* ============================================================ */}

          <div
            className="
              relative
              w-full
              max-w-[1100px]
              h-[clamp(150px,27vh,270px)]
              perspective-[1200px]
              mt-1
              mb-1
              shrink
              min-h-0
            "
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="
                relative
                w-full
                h-full
                rounded-[18px]
                border-[3px]
                sm:border-4
                border-white/95
                shadow-[0_18px_45px_-15px_rgba(26,34,85,0.20)]
                bg-neutral-200
                overflow-hidden
                transition-all
                duration-300
                ease-out
              "
            >
              <AnimatePresence
                initial={false}
                mode="popLayout"
              >
                <motion.div
                  key={`img-${current}`}
                  initial={{
                    opacity: 0,
                    scale: 1.025,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.985,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={imgSrc}
                    alt="Credora Enterprise Funding Platform"
                    fill
                    unoptimized
                    priority={current === 0}
                    onError={() =>
                      setImgSrc(
                        slide.fallbackImage
                      )
                    }
                    className="
                      object-cover
                      object-center
                      brightness-[0.98]
                    "
                  />

                  {/* Image depth overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#1A2255]/25
                      via-transparent
                      to-white/5
                      pointer-events-none
                    "
                  />

                  {/* Very subtle glass reflection */}
                  <div
                    className="
                      absolute
                      inset-x-0
                      top-0
                      h-[35%]
                      bg-gradient-to-b
                      from-white/10
                      to-transparent
                      pointer-events-none
                    "
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* BOTTOM NAVIGATION                                                  */}
        {/* ================================================================ */}

        <div
          className="
            w-full
            max-w-[900px]
            mx-auto
            shrink-0
            z-30
            pt-1
            pb-1
          "
        >
          <div
            className="
              bg-white/90
              backdrop-blur-xl
              rounded-xl
              shadow-[0_5px_20px_-5px_rgba(0,0,0,0.10)]
              border
              border-white
              p-1
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-5
              gap-1
            "
          >
            {slides.map((s, i) => {
              const TabIcon = getIcon(
                s.tabIcon
              );

              const isActive =
                current === i;

              return (
                <button
                  key={s.id ?? i}
                  onClick={() =>
                    goTo(i)
                  }
                  className={`
                    relative
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    px-2
                    py-1.5
                    rounded-lg
                    text-[10px]
                    sm:text-[10.5px]
                    font-bold
                    tracking-tight
                    transition-all
                    duration-300
                    cursor-pointer
                    overflow-hidden
                    group
                    ${
                      isActive
                        ? "text-white"
                        : "text-slate-600 hover:text-[#1A2255]"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="perfectTabIndicatorPremium"
                      className="
                        absolute
                        inset-0
                        z-0
                        bg-[#1A2255]
                        rounded-lg
                      "
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}

                  <TabIcon
                    className={`
                      w-3.5
                      h-3.5
                      z-10
                      shrink-0
                      transition-transform
                      duration-300
                      group-hover:scale-105
                      ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-[#1A2255]"
                      }
                    `}
                  />

                  <span className="whitespace-nowrap truncate z-10">
                    {s.tabLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
