"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  ParallaxSection,
  PulseGlow,
  FloatingElement,
  SmoothReveal,
  ImageReveal,
} from "@/lib/animations";
import AnimatedIllustration from "@/components/AnimatedIllustration";
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
  Search,
  FileText,
  MapPin,
  FileCheck,
  Banknote,
  HeadphonesIcon,
  Sparkles,
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const totalFrames = duration * 60;
    const step = end / totalFrames;
    // Ease-out cubic for smoother animation
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const easedProgress = easeOut(progress);
      const currentValue = Math.floor(easedProgress * end);
      if (progress >= 1) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentValue);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      className="text-center group"
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
   HERO SECTION
   ──────────────────────────────────────────── */
function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const circleY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const circleY2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#F0F4FF]"
      ref={heroRef}
    >
      {/* Decorative circles with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#304AC0]/5"
          style={{ y: circleY1 }}
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#87B73C]/5"
          style={{ y: circleY2 }}
          animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        {/* Dot patterns — top-left */}
        <div className="absolute top-20 left-[10%] grid grid-cols-5 gap-4 opacity-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#304AC0]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
        {/* Dot patterns — bottom-right */}
        <div className="absolute bottom-20 right-[8%] grid grid-cols-5 gap-4 opacity-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#13277E]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
              transition={{ duration: 3.5, delay: i * 0.12, repeat: Infinity }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            >
              <span className="inline-flex items-center gap-2 bg-white text-[#304AC0] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-[#304AC0]/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#87B73C] animate-pulse" />
                Trusted by 1,200+ Clients
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1C1D62] leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, type: "spring", stiffness: 80 }}
            >
              Enrich Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#304AC0]">Cashflow</span>
                <motion.span
                  className="absolute bottom-1 left-0 right-0 h-3 bg-[#87B73C]/20 -skew-x-3 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1, type: "spring", stiffness: 60 }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-[#718096] leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 80 }}
            >
              Structured funding solutions for MSMEs, professionals, and growing
              businesses across India. We simplify access to capital by bridging
              the gap between your funding needs and the right financial
              institutions.
            </motion.p>

            <motion.p
              className="text-base text-[#2D3748] leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 80 }}
            >
              With disciplined pre-underwriting, end-to-end advisory, and access
              to{" "}
              <strong className="text-[#304AC0]">
                70+ banks and NBFCs
              </strong>
              , we prepare your profile for success.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 80 }}
            >
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl group">
                    Get Funded Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="border-[#13277E] text-[#13277E] hover:bg-[#F8F9FA] font-medium text-sm uppercase tracking-wider px-8 py-3.5 rounded-md transition-all duration-300"
                  >
                    Speak to an Advisor
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["M", "S", "R", "K"].map((letter, i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-full bg-[#304AC0]/10 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-[#304AC0]"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.1, type: "spring" }}
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-[#718096]">
                  1,200+ Happy Clients
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right side — Funding Overview Card with Image */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 60 }}
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#E8ECF0] overflow-hidden">
                {/* Hero image strip at top */}
                <div className="relative -mx-8 -mt-8 mb-6 h-40 overflow-hidden rounded-t-3xl">
                  <Image
                    src="/images/pages/hero-indian-team.png"
                    alt="Indian business team collaborating"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
                  <div className="absolute bottom-3 left-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#87B73C]" />
                    <span className="text-sm font-medium text-[#1C1D62]">Funding Dashboard</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#718096]">
                      Funding Overview
                    </span>
                    <span className="text-xs bg-[#87B73C]/10 text-[#2E7D32] px-3 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </div>

                  {/* Animated progress bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#2D3748]">
                          Loan Approval Rate
                        </span>
                        <span className="font-semibold text-[#304AC0]">
                          92%
                        </span>
                      </div>
                      <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#304AC0] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{
                            duration: 1.8,
                            delay: 1,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#2D3748]">
                          Client Satisfaction
                        </span>
                        <span className="font-semibold text-[#87B73C]">
                          98%
                        </span>
                      </div>
                      <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#87B73C] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "98%" }}
                          transition={{
                            duration: 1.8,
                            delay: 1.2,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#2D3748]">Lender Network</span>
                        <span className="font-semibold text-[#13277E]">
                          70+
                        </span>
                      </div>
                      <div className="h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#13277E] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{
                            duration: 1.8,
                            delay: 1.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E8ECF0]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1C1D62]">
                        20+
                      </div>
                      <div className="text-xs text-[#718096]">Years Exp.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#304AC0]">
                        70+
                      </div>
                      <div className="text-xs text-[#718096]">Banks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#87B73C]">
                        20+
                      </div>
                      <div className="text-xs text-[#718096]">Products</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent card — Quick Disbursal */}
              <FloatingElement amplitude={8} duration={3} className="absolute -top-4 -left-4">
                <div className="bg-[#304AC0] text-white rounded-xl px-4 py-3 shadow-lg">
                  <div className="text-xs font-medium opacity-80">
                    Quick Disbursal
                  </div>
                  <div className="text-sm font-bold">7-10 Days</div>
                </div>
              </FloatingElement>

              {/* Floating accent card — Funding Range */}
              <FloatingElement amplitude={8} duration={3.5} className="absolute -bottom-4 -right-4">
                <div className="bg-[#87B73C] text-white rounded-xl px-4 py-3 shadow-lg">
                  <div className="text-xs font-medium opacity-80">
                    Funding Range
                  </div>
                  <div className="text-sm font-bold">₹5L - ₹50Cr</div>
                </div>
              </FloatingElement>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   WHY CHOOSE US SECTION
   ──────────────────────────────────────────── */
const whyChooseData = [
  {
    icon: ShieldCheck,
    title: "Disciplined Pre-Underwriting",
    desc: "We prepare your profile before submission, ensuring higher approval rates and fewer rejections.",
  },
  {
    icon: Landmark,
    title: "Access to 70+ Banks & NBFCs",
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
   PROCESS FLOW SECTION — Clean Card-Based Flow
   ──────────────────────────────────────────── */
const processSteps = [
  { icon: Search, title: "Understand Requirement", num: "01", color: "#304AC0", desc: "We listen to your business needs and funding goals." },
  { icon: FileText, title: "Financial Assessment", num: "02", color: "#13277E", desc: "Deep-dive into your financials and credit profile." },
  { icon: ShieldCheck, title: "Pre-Underwriting", num: "03", color: "#1C1D62", desc: "We prepare and strengthen your application." },
  { icon: MapPin, title: "Lender Mapping", num: "04", color: "#304AC0", desc: "Match your profile to the best-fit lenders." },
  { icon: FileCheck, title: "Proposal Structuring", num: "05", color: "#13277E", desc: "Professional proposal positioned for approval." },
  { icon: Banknote, title: "Sanction & Disbursal", num: "06", color: "#1C1D62", desc: "Faster approval with managed follow-ups." },
  { icon: HeadphonesIcon, title: "Client Support Service", num: "07", color: "#87B73C", desc: "Ongoing support beyond disbursal." },
];

function ProcessFlowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-20 md:py-28 bg-[#F7F9FC] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#304AC0]/[0.02]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#87B73C]/[0.03]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6" ref={ref}>
        <SectionReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">Our Process</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">From Assessment to Disbursal</h2>
          <p className="mt-5 text-lg text-[#718096] leading-relaxed">A structured, disciplined approach that ensures your funding journey is smooth and successful.</p>
        </SectionReveal>

        {/* ── Desktop: Two-row flow with connecting lines ── */}
        <div className="hidden lg:block">
          {/* Top row — Steps 1–4 */}
          <div className="relative">
            <div className="grid grid-cols-4 gap-6">
              {processSteps.slice(0, 4).map((step, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#304AC0]/20 h-full min-h-[170px] flex flex-col">
                    {/* Step number + icon row */}
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${step.color}10` }}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <step.icon className="w-6 h-6" style={{ color: step.color }} />
                      </motion.div>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: step.color }}>
                        Step {step.num}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#1C1D62] mb-2">{step.title}</h4>
                    <p className="text-sm text-[#718096] leading-relaxed flex-1">{step.desc}</p>
                  </div>
                  {/* Arrow connector (not on last) */}
                  {i < 3 && (
                    <div className="absolute top-1/2 -right-3 translate-x-1/2 -translate-y-1/2 z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.8 + i * 0.15 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-[#E8ECF0] flex items-center justify-center shadow-sm">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4h5M5 1.5L7.5 4 5 6.5" stroke="#304AC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Curved connector from row 1 to row 2 */}
            <div className="flex justify-end pr-[12.5%] my-4">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
              >
                <div className="w-px h-8 bg-[#304AC0]/20" />
                <div className="w-6 h-6 rounded-full bg-[#13277E]/10 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="#13277E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom row — Steps 5–7 */}
          <div className="relative">
            <div className="grid grid-cols-4 gap-6">
              {/* Offset: empty cell for alignment */}
              <div />
              {processSteps.slice(4).map((step, i) => (
                <motion.div
                  key={i + 4}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1.5 + i * 0.15 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#304AC0]/20 h-full min-h-[170px] flex flex-col">
                    {/* Step number + icon row */}
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${step.color}10` }}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <step.icon className="w-6 h-6" style={{ color: step.color }} />
                      </motion.div>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: step.color }}>
                        Step {step.num}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#1C1D62] mb-2">{step.title}</h4>
                    <p className="text-sm text-[#718096] leading-relaxed flex-1">{step.desc}</p>
                  </div>
                  {/* Arrow connector (not on last) */}
                  {i < 2 && (
                    <div className="absolute top-1/2 -right-3 translate-x-1/2 -translate-y-1/2 z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 2 + i * 0.15 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-[#E8ECF0] flex items-center justify-center shadow-sm">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4h5M5 1.5L7.5 4 5 6.5" stroke="#304AC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tablet: 2-column grid ── */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-5">
          {processSteps.map((step, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#E8ECF0] shadow-sm min-h-[150px] flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(48,74,192,0.08)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${step.color}10` }}
                >
                  <step.icon className="w-5 h-5" style={{ color: step.color }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>
                  Step {step.num}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#1C1D62] mb-1">{step.title}</h4>
              <p className="text-xs text-[#718096] leading-relaxed flex-1">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Mobile: Vertical timeline ── */}
        <div className="md:hidden space-y-0">
          {processSteps.map((step, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            >
              {/* Vertical line + node */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-white border-2 shadow-sm flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: step.color }}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <step.icon className="w-5 h-5" style={{ color: step.color }} />
                </motion.div>
                {i < processSteps.length - 1 && (
                  <motion.div
                    className="w-0.5 flex-1 min-h-[32px]"
                    style={{ backgroundColor: `${step.color}20` }}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  />
                )}
              </div>
              {/* Content */}
              <div className="pb-8 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>Step {step.num}</span>
                <h4 className="text-base font-semibold text-[#1C1D62] mt-0.5">{step.title}</h4>
                <p className="text-sm text-[#718096] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
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
        {/* Original floating sparkle elements */}
        {[
          { x: "20%", y: "20%", delay: 0, color: "#87B73C" },
          { x: "75%", y: "15%", delay: 1.5, color: "#304AC0" },
          { x: "60%", y: "80%", delay: 0.8, color: "#87B73C" },
          { x: "15%", y: "70%", delay: 2, color: "rgba(255,255,255,0.2)" },
          { x: "85%", y: "60%", delay: 1.2, color: "rgba(255,255,255,0.15)" },
        ].map((spark, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: spark.x,
              top: spark.y,
              backgroundColor: spark.color,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              y: [0, -20, -40],
            }}
            transition={{
              duration: 3,
              delay: spark.delay,
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
          Ready to Strengthen Your Cash Flow?
        </motion.h2>
        <motion.p
          className="text-lg text-white/70 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 80 }}
        >
          Contact us today for a free financial assessment. No obligation.
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
   HOME PAGE — Compose all sections
   ──────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <WhyChooseUsSection />
      <WhatWeDoSection />
      <KeyNumbersSection />
      <ProcessFlowSection />
      <TestimonialSection />
      <CTABannerSection />
    </>
  );
}
