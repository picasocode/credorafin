"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Shield,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────
   SLIDE DATA — 3 rotating slides
   ──────────────────────────────────────────── */
const heroSlides = [
  {
    id: 0,
    badgeDark: "FINANCE",
    badgeLight: "Structured Funding",
    badgeIcon: CircleDollarSign,
    heading: ["Enrich Your", "Cashflow"],
    subtitle:
      "We bring capital closer by combining years of experience of our expert financial team with 70+ bank and NBFC partnerships across India.",
    primaryCTA: "Get Funded Now",
    secondaryCTA: "Speak to an Advisor",
    cardHeading: "Efficiently transform your funding experience.",
    cardText:
      "Modernize your business financing with our platform that streamlines pre-underwriting to perfection, so you stay focused on growth.",
    cardBadge: "92% Approval Rate",
    cardImage: "/images/pages/indian-professional.png",
    avatars: [
      { initials: "RK", color: "#304AC0" },
      { initials: "SP", color: "#13277E" },
      { initials: "AM", color: "#87B73C" },
      { initials: "VD", color: "#2E7D32" },
      { initials: "PN", color: "#304AC0" },
      { initials: "KS", color: "#13277E" },
      { initials: "RG", color: "#5B8DEF" },
    ],
  },
  {
    id: 1,
    badgeDark: "PRE-UNDERWRITING",
    badgeLight: "Bank-Ready Applications",
    badgeIcon: Shield,
    heading: ["Precision That", "Gets Approved"],
    subtitle:
      "Our disciplined pre-underwriting process ensures your loan application is bank-ready before it reaches a single lender. We structure for success.",
    primaryCTA: "Start Pre-Underwriting",
    secondaryCTA: "Learn the Process",
    cardHeading: "Your profile, perfectly positioned for approval.",
    cardText:
      "From credit repair to loan structuring, we handle the complexity so you can focus on growing your business. Quick disbursal in 7-10 days.",
    cardBadge: "7-10 Days Disbursal",
    cardImage: "/images/pages/hero-indian-team.png",
    avatars: [
      { initials: "DT", color: "#304AC0" },
      { initials: "NK", color: "#13277E" },
      { initials: "SV", color: "#87B73C" },
      { initials: "MB", color: "#2E7D32" },
      { initials: "AJ", color: "#5B8DEF" },
      { initials: "RK", color: "#13277E" },
      { initials: "SP", color: "#304AC0" },
    ],
  },
  {
    id: 2,
    badgeDark: "ADVISORY",
    badgeLight: "End-to-End Support",
    badgeIcon: Handshake,
    heading: ["From Application", "To Disbursal"],
    subtitle:
      "We walk with you through every step — from choosing the right lender to negotiating the best terms. Credit repair, EMI structuring, and more.",
    primaryCTA: "Get Advisory",
    secondaryCTA: "See Our Services",
    cardHeading: "Your complete finance partner for every stage.",
    cardText:
      "Trusted by 1,200+ businesses with 20+ years of expertise in the Indian financial ecosystem. Access 20+ products across 70+ banks.",
    cardBadge: "1,200+ Happy Clients",
    cardImage: "/images/pages/office-india.png",
    avatars: [
      { initials: "AM", color: "#304AC0" },
      { initials: "VD", color: "#13277E" },
      { initials: "PN", color: "#87B73C" },
      { initials: "KS", color: "#2E7D32" },
      { initials: "RG", color: "#5B8DEF" },
      { initials: "DT", color: "#13277E" },
      { initials: "NK", color: "#304AC0" },
    ],
  },
];

/* Avatar positions — scattered pattern like the reference */
const avatarPositions = [
  { x: "8%", y: "12%" },
  { x: "42%", y: "6%" },
  { x: "72%", y: "14%" },
  { x: "22%", y: "48%" },
  { x: "58%", y: "44%" },
  { x: "78%", y: "52%" },
  { x: "38%", y: "72%" },
];

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

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];

  const contentVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const cardVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, scale: 0.98 }),
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
            {/* Badge Pill — dark left section + lighter right section */}
            <motion.div
              className="inline-flex items-center rounded-full border border-gray-200 overflow-hidden mb-8 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Dark left section */}
              <span className="bg-[#1C1D62] text-white text-[11px] font-semibold uppercase tracking-[0.14em] px-4 py-2 flex items-center gap-1.5">
                <slide.badgeIcon className="w-3 h-3" />
                {slide.badgeDark}
              </span>
              {/* Lighter right section */}
              <span className="bg-white text-[#718096] text-[11px] font-medium px-4 py-2 flex items-center gap-1.5">
                {slide.badgeLight}
                <ArrowRight className="w-3 h-3 text-[#718096]/50" />
              </span>
            </motion.div>

            {/* Main Heading — 2 lines, same color */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-[#1C1D62] leading-[1.12] tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {slide.heading[0]}
              <br />
              {slide.heading[1]}
            </motion.h1>

            {/* Subtitle — gray, centered */}
            <motion.p
              className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {slide.subtitle}
            </motion.p>

            {/* CTA Buttons — slightly rounded corners, dark navy primary */}
            <motion.div
              className="flex items-center justify-center gap-3 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="bg-[#1C1D62] hover:bg-[#13277E] text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                {slide.primaryCTA}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="border-gray-200 text-[#666666] hover:text-[#1C1D62] hover:border-[#1C1D62]/20 hover:bg-gray-50 font-semibold text-sm px-7 py-3.5 rounded-lg transition-all duration-300"
              >
                {slide.secondaryCTA}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Controls */}
        <motion.div
          className="flex items-center justify-center gap-5 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <SlideIndicators current={currentSlide} total={heroSlides.length} onSelect={goToSlide} />
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-[#999999] hover:text-[#1C1D62] hover:border-[#1C1D62]/20 hover:bg-gray-50 transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-[#999999] hover:text-[#1C1D62] hover:border-[#1C1D62]/20 hover:bg-gray-50 transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ===== BOTTOM SECTION — Split Content Card with Photo ===== */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-20 md:pb-28">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`card-${slide.id}`}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-[#F5F5F5] shadow-sm">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left — Text Content (60%) */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  {/* Small label */}
                  <motion.span
                    className="inline-flex items-center gap-2 bg-white text-[#87B73C] text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2 rounded-full border border-[#87B73C]/15 shadow-sm w-fit mb-6"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
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
                    className="text-base text-[#666666] leading-relaxed mb-8"
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
                      <div key={i}>
                        <div className="text-xl font-bold text-[#1C1D62]">{s.val}</div>
                        <div className="text-[11px] text-[#999999] uppercase tracking-wider">{s.lab}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Right — Photo with Floating Avatar Circles */}
                <div className="relative min-h-[320px] md:min-h-[420px] overflow-hidden">
                  {/* Background Photo */}
                  <Image
                    src={slide.cardImage}
                    alt="Credora Finance Professional"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Subtle dark overlay for avatar readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

                  {/* Floating Avatar Circles — scattered pattern, circles only with initials, NO name cards */}
                  {slide.avatars.map((avatar, i) => (
                    <motion.div
                      key={`${slide.id}-${i}`}
                      className="absolute"
                      style={{ left: avatarPositions[i].x, top: avatarPositions[i].y }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 1 + i * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 18,
                      }}
                      whileHover={{ scale: 1.15, y: -4 }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-[2.5px] border-white shadow-lg"
                        style={{ backgroundColor: avatar.color }}
                      >
                        {avatar.initials}
                      </div>
                    </motion.div>
                  ))}

                  {/* Small floating info card — top right */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-lg"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#87B73C]/10 flex items-center justify-center">
                        <CircleDollarSign className="w-3.5 h-3.5 text-[#87B73C]" />
                      </div>
                      <div>
                        <div className="text-[9px] text-[#999999] uppercase tracking-wider">Quick Disbursal</div>
                        <div className="text-xs font-bold text-[#1C1D62]">7-10 Days</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Small floating info card — bottom left */}
                  <motion.div
                    className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-lg"
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#304AC0]/10 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-[#304AC0]" />
                      </div>
                      <div>
                        <div className="text-[9px] text-[#999999] uppercase tracking-wider">Funding Range</div>
                        <div className="text-xs font-bold text-[#1C1D62]">₹5L - ₹50Cr</div>
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
