"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  PulseGlow,
  SmoothReveal,
  ImageReveal,
} from "@/lib/animations";
import FluidTimeline from "@/components/FluidTimeline";
import Hero from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Landmark,
  Settings,
  TrendingUp,
  Building2,
  Link2,
  Globe,
  HardHat,
  Puzzle,
  Star,
  Quote,
} from "lucide-react";

/* ────────────────────────────────────────────
   Animated Counter Component
   ──────────────────────────────────────────── */
interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  sublabel?: string;
}

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  label,
  sublabel,
}: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(end);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <motion.div
        className="inline-block"
        animate={isInView ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
          {prefix}
          {count.toLocaleString()}
          {suffix}
        </div>
      </motion.div>
      <div className="text-base sm:text-lg text-white/90 font-medium">
        {label}
      </div>
      {sublabel && (
        <div className="text-sm text-white/60 mt-1">{sublabel}</div>
      )}
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   WHY CHOOSE US SECTION
   ──────────────────────────────────────────── */
const whyChooseData = [
  {
    icon: ShieldCheck,
    title: "Disciplined Pre-Underwriting",
    desc: "We prepare your profile before submission, ensuring higher approval rates.",
  },
  {
    icon: Landmark,
    title: "Access to 70+ Financial Institutions",
    desc: "A wide network of financial institutions means better terms and the right fit for your business.",
  },
  {
    icon: Settings,
    title: "Tailored Solutions",
    desc: "Every solution is customized. Every recommendation is intentional, with end-to-end support.",
  },
  {
    icon: TrendingUp,
    title: "Cash Flow & Long-Term Growth",
    desc: "We focus on improving your cash flow and positioning your business for sustainable growth.",
  },
];

function WhyChooseUsSection() {
  return (
    <section
      id="why-us"
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F0F4FF] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F0F4FF] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header — using SmoothReveal for smoother entrance */}
        <SmoothReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            We go beyond arranging funds
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            We prepare your profile, structure your application, and connect you
            with lenders who are the right fit for your business.
          </p>
        </SmoothReveal>

        {/* Cards grid */}
        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          staggerDelay={0.15}
        >
          {whyChooseData.map((item, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="h-full"
                whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(48,74,192,0.12)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="group relative bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm hover:border-[#304AC0]/20 transition-all duration-300 h-full min-h-[220px] flex flex-col">
                  {/* Icon with rotation on hover */}
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-[#F0F4FF] flex items-center justify-center mb-5 group-hover:bg-[#304AC0] transition-colors duration-300"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <item.icon className="w-7 h-7 text-[#304AC0] group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-[#1C1D62] mb-2 group-hover:text-[#304AC0] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#718096] leading-relaxed flex-1">
                    {item.desc}
                  </p>
                  {/* Accent line */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-[#304AC0] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   WHAT WE DO SECTION
   ──────────────────────────────────────────── */
const whatWeDoData = [
  {
    icon: Building2,
    title: "MSME Loans",
    desc: "Collateral-free and secured funding for growth and operations.",
    href: "/products/msme-loans",
    color: "#304AC0",
    image: "/images/products/msme-indian.png",
  },
  {
    icon: Link2,
    title: "Supply Chain Finance",
    desc: "Unlock liquidity from invoices, payables, and inventory.",
    href: "/products/supply-chain-finance",
    color: "#13277E",
    image: "/images/products/scf-indian.png",
  },
  {
    icon: Globe,
    title: "Cross Border Finance",
    desc: "Export and import solutions for international trade.",
    href: "/products/cross-border-finance",
    color: "#1C1D62",
    image: "/images/products/crossborder-indian.png",
  },
  {
    icon: HardHat,
    title: "Project Finance",
    desc: "Structured funding for real estate and large-scale projects.",
    href: "/products/project-finance",
    color: "#304AC0",
    image: "/images/products/project-indian.png",
  },
  {
    icon: Puzzle,
    title: "Specialized Finance",
    desc: "Niche solutions including stressed assets and complex requirements.",
    href: "/products/specialized-finance",
    color: "#87B73C",
    image: "/images/services/advisory-indian.png",
  },
];

function WhatWeDoSection() {
  return (
    <section
      id="what-we-do"
      className="py-20 md:py-28 bg-[#F0F4FF] relative overflow-hidden"
    >
      {/* Decorative dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-3 h-3 rounded-full bg-[#304AC0]/10" />
        <div className="absolute top-40 right-[12%] w-4 h-4 rounded-full bg-[#87B73C]/10" />
        <div className="absolute bottom-32 left-[20%] w-2 h-2 rounded-full bg-[#13277E]/10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <SectionReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            Tailored Solutions. Intentional Recommendations.
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            We assess your financials, repair credit where needed, structure
            proposals, and connect you with the right lender.
          </p>
        </SectionReveal>

        {/* Cards grid */}
        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.12}
        >
          {whatWeDoData.map((item, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="h-full"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  href={item.href}
                  className="group relative bg-white rounded-2xl text-center border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 h-full min-h-[280px] flex flex-col overflow-hidden"
                >
                  {/* Image strip at top with gradient overlay */}
                  <div className="relative h-28 overflow-hidden rounded-t-2xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"
                    />
                  </div>

                  {/* Icon centered on top of image bottom edge (overlapping) */}
                  <div className="relative -mt-8 z-10">
                    <div className="relative w-16 h-16 mx-auto">
                      <div
                        className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="relative w-full h-full rounded-2xl flex items-center justify-center bg-white shadow-md group-hover:shadow-lg transition-shadow duration-300 border border-[#E8ECF0]">
                        <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                          <item.icon
                            className="w-8 h-8 transition-colors duration-300"
                            style={{ color: item.color }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Content below image + icon */}
                  <div className="px-5 pb-5 pt-2 flex-1 flex flex-col">
                    <h3 className="text-base font-semibold text-[#1C1D62] mb-2 group-hover:text-[#304AC0] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#718096] leading-relaxed flex-1">
                      {item.desc}
                    </p>
                    {/* Hover arrow that slides right */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                      <span
                        className="text-sm font-medium inline-flex items-center gap-1"
                        style={{ color: item.color }}
                      >
                        Learn More
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>

                  {/* Colored border bottom on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ backgroundColor: item.color }}
                  />
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   KEY NUMBERS SECTION
   ──────────────────────────────────────────── */
const keyStats = [
  {
    end: 20,
    suffix: "+",
    label: "Years of Combined Experience",
    sublabel: "Industry expertise",
  },
  {
    end: 70,
    suffix: "+",
    label: "Banks and NBFCs Associated",
    sublabel: "Pan-India network",
  },
  {
    end: 1200,
    suffix: "+",
    label: "Happy Clients",
    sublabel: "Across India",
  },
  {
    end: 20,
    suffix: "+",
    label: "Funding Products",
    sublabel: "Tailored solutions",
  },
];

function KeyNumbersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="key-numbers"
      className="py-20 md:py-28 bg-[#1C1D62] relative overflow-hidden"
      ref={ref}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#304AC0]/10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#87B73C]/10"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header — using SmoothReveal for smoother entrance */}
        <SmoothReveal className="text-center mb-14">
          <span className="inline-block text-[#87B73C] text-xs font-semibold uppercase tracking-widest mb-4">
            Key Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Numbers That Speak
          </h2>
        </SmoothReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {keyStats.map((stat, i) => (
            <AnimatedCounter key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   TESTIMONIAL SECTION
   ──────────────────────────────────────────── */
function TestimonialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="testimonial"
      className="py-20 md:py-28 bg-white relative overflow-hidden"
      ref={ref}
    >
      {/* Subtle blue tint pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="testimonial-dots"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="#304AC0" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#testimonial-dots)" />
          </svg>
        </div>
        <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-[#304AC0]/[0.03]" />
        <div className="absolute -bottom-16 left-0 w-80 h-80 rounded-full bg-[#87B73C]/[0.03]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left side — Image */}
          <ImageReveal className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/pages/success-india.png"
                alt="Successful Indian business professional"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              {/* Subtle gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-xl bg-[#304AC0]/5 -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-xl bg-[#87B73C]/5 -z-10" />
          </ImageReveal>

          {/* Right side — Quote content */}
          <SmoothReveal direction="right" className="space-y-6">
            {/* Star rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + star * 0.1, type: "spring", stiffness: 200 }}
                >
                  <Star className="w-5 h-5 fill-[#F6AD55] text-[#F6AD55]" />
                </motion.div>
              ))}
            </div>

            {/* Quote icon */}
            <div className="text-[#304AC0]/10">
              <Quote className="w-12 h-12" />
            </div>

            {/* Quote text */}
            <blockquote className="text-xl sm:text-2xl font-medium text-[#1C1D62] leading-relaxed">
              &ldquo;Being a Credora client has been transformative. They didn&rsquo;t just find us a lender — they prepared our entire financial profile.&rdquo;
            </blockquote>

            {/* Attribution */}
            <div className="space-y-1">
              <div className="text-base font-semibold text-[#304AC0]">
                Rajesh Kumar
              </div>
              <div className="text-sm text-[#718096]">
                Director, Kumar Industries, Chennai
              </div>
            </div>

            {/* Decorative line */}
            <div className="w-16 h-1 bg-[#87B73C] rounded-full" />
          </SmoothReveal>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   CTA BANNER SECTION
   ──────────────────────────────────────────── */
function CTABannerSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="cta"
      className="py-16 md:py-20 bg-[#1C1D62] relative overflow-hidden"
      ref={ref}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/pages/office-india.png"
          alt="Indian office background"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-[#1C1D62]/80" />
      </div>

      {/* Decorative circles with animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-[10%] w-64 h-64 bg-[#304AC0]/10 rounded-full -translate-y-1/2"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-[15%] w-48 h-48 bg-[#87B73C]/10 rounded-full translate-y-1/2"
          animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Confetti-like animated dots */}
        {[
          { x: "8%", y: "25%", size: 6, color: "#87B73C", delay: 0, dur: 4 },
          { x: "22%", y: "65%", size: 4, color: "#304AC0", delay: 0.8, dur: 5 },
          { x: "35%", y: "15%", size: 5, color: "#87B73C", delay: 1.6, dur: 3.5 },
          { x: "48%", y: "80%", size: 7, color: "rgba(255,255,255,0.25)", delay: 0.4, dur: 6 },
          { x: "62%", y: "20%", size: 4, color: "#304AC0", delay: 2, dur: 4.5 },
          { x: "75%", y: "70%", size: 6, color: "#87B73C", delay: 1.2, dur: 5.5 },
          { x: "88%", y: "35%", size: 5, color: "rgba(255,255,255,0.2)", delay: 0.6, dur: 4 },
          { x: "15%", y: "45%", size: 3, color: "#304AC0", delay: 1.8, dur: 3.8 },
          { x: "55%", y: "50%", size: 4, color: "#87B73C", delay: 2.4, dur: 5 },
          { x: "80%", y: "55%", size: 5, color: "rgba(255,255,255,0.15)", delay: 1, dur: 4.2 },
          { x: "42%", y: "30%", size: 3, color: "#304AC0", delay: 2.8, dur: 3.5 },
          { x: "68%", y: "85%", size: 6, color: "#87B73C", delay: 0.3, dur: 5.8 },
          { x: "92%", y: "75%", size: 4, color: "rgba(255,255,255,0.2)", delay: 1.5, dur: 4.8 },
          { x: "5%", y: "80%", size: 5, color: "#304AC0", delay: 2.2, dur: 5.2 },
          { x: "30%", y: "40%", size: 3, color: "#87B73C", delay: 3, dur: 4.5 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
            }}
            animate={{
              y: [0, -30, -10, -35, 0],
              x: [0, 8, -6, 4, 0],
              opacity: [0, 0.8, 0.5, 0.7, 0],
              scale: [0.5, 1.2, 0.8, 1, 0.5],
            }}
            transition={{
              duration: dot.dur,
              delay: dot.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        >
          Ready to Strengthen your Credit Profile?
        </motion.h2>
        <motion.p
          className="text-lg text-white/70 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 80 }}
        >
          Contact us now for a free credit and Financial Assessment.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 80 }}
        >
          <Link href="/contact">
            <PulseGlow color="#304AC0" className="inline-block">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-10 py-4 rounded-md shadow-xl group transition-all duration-300">
                  Get in Touch
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </PulseGlow>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   BLOG PREVIEW SECTION
   ──────────────────────────────────────────── */
const blogPosts = [
  {
    category: "Credit Health",
    title: "Why Your Credit Profile Matters More Than Your CIBIL Score",
    excerpt: "Lenders look beyond just your score. Learn how a well-structured credit profile can significantly improve your loan approval chances and get you better interest rates.",
    href: "/blog",
    color: "#304AC0",
  },
  {
    category: "Loan Structuring",
    title: "Pre-Underwriting: The Secret to 95% Loan Approval Rates",
    excerpt: "Most businesses apply directly and get rejected. Discover how disciplined pre-underwriting can transform your approval rate from 30% to 95%.",
    href: "/blog",
    color: "#13277E",
  },
  {
    category: "MSME Funding",
    title: "5 Common Mistakes MSMEs Make When Applying for Business Loans",
    excerpt: "From incomplete documentation to choosing the wrong lender, avoid these common pitfalls that delay or derail your funding journey.",
    href: "/blog",
    color: "#87B73C",
  },
];

function BlogPreviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog-preview" className="py-20 md:py-28 bg-white relative overflow-hidden" ref={ref}>
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#F0F4FF] rounded-full -translate-y-1/2 -translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#F5F8EC] rounded-full translate-y-1/2 translate-x-1/2 opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
            Insights & Resources
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            Latest from Our Blog
          </h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">
            Expert insights on credit management, loan structuring, and funding strategies for growing businesses.
          </p>
        </SectionReveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.12}>
          {blogPosts.map((post, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="h-full"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  href={post.href}
                  className="group relative bg-white rounded-2xl border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 h-full min-h-[260px] flex flex-col overflow-hidden"
                >
                  {/* Category strip */}
                  <div className="h-1.5 w-full" style={{ backgroundColor: post.color }} />

                  <div className="p-6 flex flex-col flex-1">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-widest mb-3"
                      style={{ color: post.color }}
                    >
                      {post.category}
                    </span>
                    <h3 className="text-base font-semibold text-[#1C1D62] mb-3 group-hover:text-[#304AC0] transition-colors duration-300 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#718096] leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium" style={{ color: post.color }}>
                      Read More
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-10">
          <Link href="/blog">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="border-[#304AC0] text-[#304AC0] hover:bg-[#304AC0] hover:text-white font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md transition-all duration-300"
              >
                View All Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   HOME PAGE — Compose all sections
   ──────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUsSection />
      <WhatWeDoSection />
      <KeyNumbersSection />
      <FluidTimeline />
      <BlogPreviewSection />
      <TestimonialSection />
      <CTABannerSection />
    </>
  );
}
