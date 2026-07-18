"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Building2,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  CircleDollarSign,
  Handshake,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA — 3 rotating slides
   ──────────────────────────────────────────── */
const heroSlides = [
  {
    id: 0,
    badge: "STRUCTURED FINANCE",
    badgeIcon: CircleDollarSign,
    heading: ["Enrich Your", "Cashflow"],
    highlight: "Cashflow",
    subtitle:
      "Structured funding solutions for MSMEs, professionals, and growing businesses across India. We simplify access to capital by bridging the gap between your funding needs and the right financial institutions.",
    primaryCTA: "Get Funded Now",
    secondaryCTA: "Speak to an Advisor",
    cardHeading: "Funding Made Simple",
    cardText:
      "With disciplined pre-underwriting, end-to-end advisory, and access to 70+ banks and NBFCs, we prepare your profile for success.",
    cardBadge: "92% Approval Rate",
    avatars: [
      { initials: "RK", name: "Rajesh K.", role: "CEO, TechFlow" },
      { initials: "SP", name: "Sunita P.", role: "Founder, BuildRight" },
      { initials: "AM", name: "Amit M.", role: "CFO, GreenEdge" },
      { initials: "VD", name: "Vikram D.", role: "MD, SolarMax" },
    ],
  },
  {
    id: 1,
    badge: "PRE-UNDERWRITING",
    badgeIcon: Shield,
    heading: ["Precision That", "Gets Approved"],
    highlight: "Gets Approved",
    subtitle:
      "Our disciplined pre-underwriting process ensures your loan application is bank-ready before it reaches a single lender. We analyze, structure, and position your financial profile for maximum approval probability.",
    primaryCTA: "Start Pre-Underwriting",
    secondaryCTA: "Learn the Process",
    cardHeading: "Bank-Ready Applications",
    cardText:
      "From credit repair to loan structuring, we handle the complexity so you can focus on growing your business. Quick disbursal in 7-10 days.",
    cardBadge: "7-10 Days Disbursal",
    avatars: [
      { initials: "PN", name: "Priya N.", role: "Co-Founder, FreshMart" },
      { initials: "KS", name: "Karan S.", role: "Director, IronWorks" },
      { initials: "RG", name: "Ritu G.", role: "CEO, MediCare Plus" },
      { initials: "AJ", name: "Arjun J.", role: "Partner, LegalEdge" },
    ],
  },
  {
    id: 2,
    badge: "END-TO-END ADVISORY",
    badgeIcon: Handshake,
    heading: ["From Application", "To Disbursal"],
    highlight: "To Disbursal",
    subtitle:
      "We walk with you through every step — from choosing the right lender to negotiating the best terms. Our advisory covers credit repair, EMI structuring, documentation, and post-sanction support.",
    primaryCTA: "Get Advisory",
    secondaryCTA: "See Our Services",
    cardHeading: "Your Finance Partner",
    cardText:
      "Trusted by 1,200+ businesses with 20+ years of expertise in the Indian financial ecosystem. Access 20+ products across 70+ banks.",
    cardBadge: "1,200+ Happy Clients",
    avatars: [
      { initials: "MB", name: "Meera B.", role: "Owner, TextileHub" },
      { initials: "DT", name: "Deepak T.", role: "CEO, LogiTrans" },
      { initials: "NK", name: "Nisha K.", role: "Founder, EduBright" },
      { initials: "SV", name: "Suresh V.", role: "MD, AgriGrow" },
    ],
  },
];

/* ────────────────────────────────────────────
   AVATAR CIRCLE
   ──────────────────────────────────────────── */
function AvatarCircle({
  initials,
  name,
  role,
  index,
  total,
}: {
  initials: string;
  name: string;
  role: string;
  index: number;
  total: number;
}) {
  const colors = ["#304AC0", "#13277E", "#87B73C", "#2E7D32"];
  const bgColor = colors[index % colors.length];

  // Stagger positions — fan out in a grid-like pattern on the image area
  const positions = [
    { x: "15%", y: "25%" },
    { x: "55%", y: "15%" },
    { x: "35%", y: "55%" },
    { x: "70%", y: "50%" },
  ];
  const pos = positions[index % positions.length];

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1.5"
      style={{ left: pos.x, top: pos.y }}
      initial={{ opacity: 0, scale: 0, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 1.2 + index * 0.15,
        type: "spring",
        stiffness: 200,
        damping: 18,
      }}
    >
      {/* Circle avatar */}
      <div className="relative">
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold border-[3px] border-white shadow-lg"
          style={{ backgroundColor: bgColor }}
          whileHover={{ scale: 1.15, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {initials}
        </motion.div>
        {/* Green online dot */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#87B73C] border-2 border-white" />
      </div>
      {/* Name card */}
      <motion.div
        className="bg-white rounded-xl px-3 py-2 shadow-md border border-gray-100 text-center min-w-[100px]"
        whileHover={{ y: -2, shadow: "lg" }}
      >
        <div className="text-[11px] font-semibold text-[#1C1D62] leading-tight">
          {name}
        </div>
        <div className="text-[10px] text-[#718096] leading-tight">{role}</div>
      </motion.div>
    </motion.div>
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
    <div className="flex items-center gap-2.5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="relative h-2 rounded-full transition-all duration-500 cursor-pointer"
          style={{
            width: i === current ? "32px" : "8px",
            backgroundColor: i === current ? "#304AC0" : "#D1D5DB",
          }}
        >
          {i === current && (
            <motion.div
              className="absolute inset-0 rounded-full"
              layoutId="activeHeroSlide"
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
  const contentVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <section id="hero" className="relative bg-white overflow-hidden">
      {/* ===== TOP SECTION — Centered Text ===== */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-12 text-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`top-${slide.id}`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.35 },
            }}
            className="flex flex-col items-center"
          >
            {/* Badge Pill */}
            <motion.div
              className="inline-flex items-center gap-2 bg-[#F0F4FF] text-[#304AC0] text-xs font-semibold uppercase tracking-[0.12em] px-5 py-2.5 rounded-full border border-[#304AC0]/10 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <slide.badgeIcon className="w-3.5 h-3.5 text-[#87B73C]" />
              {slide.badge}
              <ArrowRight className="w-3.5 h-3.5 text-[#304AC0]/50" />
            </motion.div>

            {/* Main Heading — 2 lines */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-[#1C1D62] leading-[1.12] tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {slide.heading.map((line, i) => (
                <span key={i}>
                  {line === slide.highlight ? (
                    <span className="relative inline-block">
                      <span
                        style={{
                          background:
                            "linear-gradient(135deg, #304AC0 0%, #87B73C 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {line}
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
                          duration: 0.7,
                          delay: 0.9,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </span>
                  ) : (
                    line
                  )}
                  {i < slide.heading.length - 1 && <br />}
                </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg text-[#718096] leading-relaxed max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {slide.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex items-center justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="bg-[#1C1D62] hover:bg-[#13277E] text-white font-semibold text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                {slide.primaryCTA}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="border-[#1C1D62]/20 text-[#1C1D62] hover:bg-[#F0F4FF] font-semibold text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-300"
              >
                {slide.secondaryCTA}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Controls — below buttons */}
        <motion.div
          className="flex items-center justify-center gap-5 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <SlideIndicators
            current={currentSlide}
            total={heroSlides.length}
            onSelect={goToSlide}
          />
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-[#718096] hover:text-[#304AC0] hover:border-[#304AC0]/30 hover:bg-[#F0F4FF] transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-[#718096] hover:text-[#304AC0] hover:border-[#304AC0]/30 hover:bg-[#F0F4FF] transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ===== BOTTOM SECTION — Split Content Card ===== */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-20 md:pb-28">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`card-${slide.id}`}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-[#F8F9FC] to-[#EEF1F8] shadow-sm">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left — Text Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  {/* Card badge */}
                  <motion.span
                    className="inline-flex items-center gap-2 bg-white text-[#87B73C] text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 rounded-full border border-[#87B73C]/15 shadow-sm w-fit mb-6"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {slide.cardBadge}
                  </motion.span>

                  <motion.h3
                    className="text-2xl sm:text-3xl font-bold text-[#1C1D62] leading-tight mb-4"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {slide.cardHeading}
                  </motion.h3>

                  <motion.p
                    className="text-base text-[#718096] leading-relaxed mb-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {slide.cardText}
                  </motion.p>

                  {/* Quick stats row */}
                  <motion.div
                    className="flex items-center gap-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    {[
                      { val: "20+", lab: "Years" },
                      { val: "70+", lab: "Banks" },
                      { val: "20+", lab: "Products" },
                    ].map((s, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xl font-bold text-[#304AC0]">
                          {s.val}
                        </div>
                        <div className="text-[11px] text-[#718096] uppercase tracking-wider">
                          {s.lab}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Right — Image Area with Floating Avatars */}
                <div className="relative min-h-[320px] md:min-h-[400px] bg-gradient-to-br from-[#304AC0]/5 via-[#5B8DEF]/5 to-[#87B73C]/5 overflow-hidden">
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 25% 25%, #304AC0 1px, transparent 1px),
                          radial-gradient(circle at 75% 75%, #87B73C 1px, transparent 1px)
                        `,
                        backgroundSize: "30px 30px",
                      }}
                    />
                  </div>

                  {/* Abstract finance illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      viewBox="0 0 400 300"
                      className="w-3/4 h-3/4 opacity-10"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <linearGradient
                          id="heroIllGrad"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#304AC0" />
                          <stop offset="100%" stopColor="#87B73C" />
                        </linearGradient>
                      </defs>
                      {/* Bar chart */}
                      <rect
                        x="60"
                        y="180"
                        width="30"
                        height="80"
                        rx="4"
                        fill="url(#heroIllGrad)"
                        opacity="0.4"
                      />
                      <rect
                        x="110"
                        y="140"
                        width="30"
                        height="120"
                        rx="4"
                        fill="url(#heroIllGrad)"
                        opacity="0.5"
                      />
                      <rect
                        x="160"
                        y="100"
                        width="30"
                        height="160"
                        rx="4"
                        fill="url(#heroIllGrad)"
                        opacity="0.6"
                      />
                      <rect
                        x="210"
                        y="60"
                        width="30"
                        height="200"
                        rx="4"
                        fill="url(#heroIllGrad)"
                        opacity="0.7"
                      />
                      <rect
                        x="260"
                        y="30"
                        width="30"
                        height="230"
                        rx="4"
                        fill="url(#heroIllGrad)"
                        opacity="0.8"
                      />
                      <rect
                        x="310"
                        y="10"
                        width="30"
                        height="250"
                        rx="4"
                        fill="url(#heroIllGrad)"
                        opacity="0.9"
                      />
                      {/* Trend line */}
                      <motion.path
                        d="M75 220 L125 180 L175 140 L225 100 L275 70 L325 40"
                        fill="none"
                        stroke="#304AC0"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 2,
                          delay: 0.8,
                          ease: "easeInOut",
                        }}
                      />
                      {/* Data points */}
                      {[
                        [75, 220],
                        [125, 180],
                        [175, 140],
                        [225, 100],
                        [275, 70],
                        [325, 40],
                      ].map(([cx, cy], i) => (
                        <motion.circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r="4"
                          fill="#304AC0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 1 + i * 0.15,
                          }}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Floating Avatar Circles */}
                  {slide.avatars.map((avatar, i) => (
                    <AvatarCircle
                      key={`${slide.id}-${i}`}
                      initials={avatar.initials}
                      name={avatar.name}
                      role={avatar.role}
                      index={i}
                      total={slide.avatars.length}
                    />
                  ))}

                  {/* Floating accent card — top right */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#87B73C]/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-[#87B73C]" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#718096] uppercase tracking-wider">
                          Quick Disbursal
                        </div>
                        <div className="text-sm font-bold text-[#1C1D62]">
                          7-10 Days
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating accent card — bottom left */}
                  <motion.div
                    className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100"
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#304AC0]/10 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-[#304AC0]" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#718096] uppercase tracking-wider">
                          Funding Range
                        </div>
                        <div className="text-sm font-bold text-[#1C1D62]">
                          ₹5L - ₹50Cr
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
