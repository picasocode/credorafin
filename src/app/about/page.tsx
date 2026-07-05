"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, animate } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Building2,
  Factory,
  Globe2,
  UserCheck,
  Users,
  Target,
  HeartHandshake,
  Lightbulb,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  FloatingElement,
  PulseGlow,
  SmoothReveal,
} from "@/lib/animations";

const apartItems = [
  "Structured, insight-driven approach focused on approval quality and pricing",
  "Strong network across 70+ Financial Institutions",
  "Dedicated, personalized advisory with a long-term partnership mindset",
  "Emphasis on financial clarity and smarter decision-making",
];

const clientTypes = [
  {
    icon: Building2,
    label: "Growing MSMEs to established companies",
    tint: "bg-[#F0F4FF]",
    iconColor: "text-[#304AC0]",
  },
  {
    icon: Factory,
    label: "Manufacturers, traders & service providers",
    tint: "bg-[#F5F8EC]",
    iconColor: "text-[#87B73C]",
  },
  {
    icon: Globe2,
    label: "Exporters and importers",
    tint: "bg-[#EEF0FA]",
    iconColor: "text-[#13277E]",
  },
  {
    icon: UserCheck,
    label: "Professionals and practice owners",
    tint: "bg-[#ECF5EF]",
    iconColor: "text-[#2D3748]",
  },
];

const promises = [
  { mark: "✦", text: "Clarity over complexity" },
  { mark: "✦", text: "Structure over uncertainty" },
  { mark: "✦", text: "Partnership over transactions" },
];

const stats = [
  { value: 20, suffix: "+", label: "Years" },
  { value: 70, suffix: "+", label: "Banks" },
  { value: 1200, suffix: "+", label: "Clients" },
];

const coreValues = [
  {
    icon: Target,
    title: "Precision",
    desc: "Every recommendation is backed by thorough financial analysis and structured evaluation.",
    color: "#304AC0",
  },
  {
    icon: HeartHandshake,
    title: "Partnership",
    desc: "We build long-term relationships, not one-time transactions. Your growth is our success.",
    color: "#87B73C",
  },
  {
    icon: Lightbulb,
    title: "Clarity",
    desc: "We demystify complex financial processes so you can make informed, confident decisions.",
    color: "#13277E",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "Our disciplined approach to pre-underwriting ensures higher approval rates and better outcomes.",
    color: "#1C1D62",
  },
];

/* ────────────────────────────────────────────
   Animated Stat Counter
   ──────────────────────────────────────────── */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, isInView]);

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-2 px-5"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
    >
      <span className="text-2xl sm:text-3xl font-bold text-[#304AC0]">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-[#718096] font-medium uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ═══════════════════════════════════════
          PAGE HERO — With Image Background
          ═══════════════════════════════════════ */}
      <section className="bg-[#F0F4FF] py-16 md:py-24 relative overflow-hidden">
        {/* Hero image background with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/pages/about-hero.png"
            alt="Indian business team"
            fill
            sizes="100vw"
            className="object-cover opacity-[0.08]"
            priority
          />
        </div>

        {/* Animated gradient border at top */}
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <motion.div
            className="h-full w-[200%]"
            style={{
              background: "linear-gradient(90deg, #304AC0, #87B73C, #304AC0, #87B73C)",
            }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">


          <SectionReveal className="sm:pl-8">
            {/* Breadcrumb with chevron separators */}
            <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#304AC0] transition-colors duration-300">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#1C1D62] font-medium">About</span>
            </nav>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight max-w-3xl"
              style={{ textShadow: "0 2px 8px rgba(28, 29, 98, 0.08)" }}
            >
              <span className="relative inline-block">
                <span className="relative z-10 text-[#304AC0]">Structured for Approval. </span>
                <span className="relative z-10 text-[#304AC0]">
                    Positioned for Growth.
                    <motion.span
                        className="absolute bottom-1 left-0 right-0 h-2 bg-[#87B73C]/20 rounded -z-10"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                        style={{ transformOrigin: "left" }}
                    />
                </span>
              </span>
            </h1>
            <p className="mt-5 text-[#2D3748] leading-relaxed max-w-2xl text-base sm:text-lg">
              Credora Fintech is more than a loan intermediary — we are your
              financial advisory partner, preparing your profile for
              sustainable, well-structured funding.
            </p>
          </SectionReveal>

          {/* Animated Stats Ribbon */}
          <SectionReveal delay={0.2} className="sm:pl-2">
            <div className="mt-10 flex flex-wrap items-center justify-start gap-4 sm:gap-0 sm:divide-x sm:divide-[#304AC0]/20">
              {stats.map((stat, i) => (
                <StatCounter key={i} {...stat} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHO WE ARE — Split Layout with Real Image
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text Left */}
            <SectionReveal direction="left">
              <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
                Who We Are
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-6 max-w-xl">
                A Financial Services & Advisory Firm You Can Rely On
              </h2>
              <div className="space-y-4">
                <p className="text-[#2D3748] leading-relaxed">
                  Credora Fintech Pvt Ltd is a financial services and advisory
                  firm providing structured funding solutions to businesses and
                  professionals across India. We specialize in assessing financial
                  positions, structuring funding requirements, and connecting
                  clients with the lenders best aligned to their profile.
                </p>
                <p className="text-[#2D3748] leading-relaxed">
                  By combining financial expertise with strong institutional
                  partnerships, we enable efficient access to capital while
                  minimizing delays and rejections. Our approach is built on
                  transparency, precision, and a deep understanding of how
                  financial institutions evaluate and approve funding.
                </p>
              </div>
            </SectionReveal>

            {/* Right — Real Indian Image */}
            <SectionReveal direction="right" delay={0.15}>
              <div className="relative h-80 lg:h-96">
                <div className="relative rounded-2xl overflow-hidden shadow-xl h-full">
                  <Image src="/images/pages/handshake-india.png" alt="Indian business partnership" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1D62]/20 to-transparent" />
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHAT WE DO — Bold Quote Style (SmoothReveal)
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SmoothReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              What We Do
            </span>
            <div className="border-l-4 border-[#304AC0] pl-6 sm:pl-8 mb-6">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1C1D62] italic leading-snug max-w-3xl">
                We don&apos;t just arrange funding.{" "}
                <span className="text-[#304AC0] not-italic">We prepare you for it.</span>
              </p>
            </div>
            <p className="text-[#2D3748] leading-relaxed max-w-3xl mt-4 text-base sm:text-lg pl-6 sm:pl-8 border-l-4 border-transparent">
              We analyse your financials, Credit profile, and overall eligibility
              in detail, aligning your profile with the specific requirements of
              financial institutions. This ensures your application is positioned
              correctly with clarity, accuracy, and intent. The outcome: faster
              access, stronger alignment, and reduced uncertainty in approvals.
            </p>
          </SmoothReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MISSION & VISION — Top Accent Bar Cards with hover
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              Mission & Vision
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
              What Drives Us Forward
            </h2>
          </SectionReveal>

          <StaggerContainer className="grid md:grid-cols-2 gap-6" staggerDelay={0.15}>
            {/* Mission Card — Blue top accent */}
            <StaggerItem>
              <motion.div
                className="h-full"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-sm h-full min-h-[180px] flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="h-1.5 bg-[#304AC0] group-hover:h-2 transition-all duration-300" />
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="w-10 h-10 rounded-lg bg-[#F0F4FF] flex items-center justify-center"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <Target className="w-5 h-5 text-[#304AC0]" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-[#1C1D62] group-hover:text-[#304AC0] transition-colors duration-300">
                        Mission
                      </h3>
                    </div>
                    <p className="text-[#2D3748] leading-relaxed flex-1">
                      To simplify the funding process through transparent advisory,
                      structured financial evaluation, and customized loan solutions
                      that support long-term business growth.
                    </p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Vision Card — Green top accent */}
            <StaggerItem>
              <motion.div
                className="h-full"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-sm h-full min-h-[180px] flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="h-1.5 bg-[#87B73C] group-hover:h-2 transition-all duration-300" />
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="w-10 h-10 rounded-lg bg-[#F5F8EC] flex items-center justify-center"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <Lightbulb className="w-5 h-5 text-[#87B73C]" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-[#1C1D62] group-hover:text-[#87B73C] transition-colors duration-300">
                        Vision
                      </h3>
                    </div>
                    <p className="text-[#2D3748] leading-relaxed flex-1">
                      To build a trusted financial solutions platform that empowers
                      businesses and professionals with reliable access to capital
                      and smarter financial decision-making.
                    </p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CORE VALUES — Cards with icons and hover
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              Core Values
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
              What We Stand For
            </h2>
          </SectionReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.12}>
            {coreValues.map((value, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="h-full"
                  whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(48,74,192,0.10)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm h-full min-h-[200px] flex flex-col hover:border-transparent transition-all duration-300 group relative overflow-hidden">
                    {/* Colored bottom border on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ backgroundColor: value.color }}
                    />
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${value.color}10` }}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <value.icon className="w-6 h-6" style={{ color: value.color }} />
                    </motion.div>
                    <h3 className="text-base font-semibold text-[#1C1D62] mb-2 group-hover:text-[#304AC0] transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-sm text-[#718096] leading-relaxed flex-1">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHAT SETS US APART — White cards with left accent border
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              What Sets Us Apart
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
              Why Businesses Choose Credora
            </h2>
          </SectionReveal>

          <StaggerContainer className="space-y-4" staggerDelay={0.1}>
            {apartItems.map((item, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ x: 4, boxShadow: "0 8px 24px rgba(48,74,192,0.08)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8ECF0] shadow-sm flex items-start gap-5 border-l-4 border-l-[#304AC0] hover:border-l-[#87B73C] transition-all duration-300 group">
                    <motion.span
                      className="text-[#304AC0] font-bold text-lg w-8 h-8 rounded-lg bg-[#F0F4FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#87B73C] group-hover:text-white transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 3 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>
                    <p className="text-[#2D3748] leading-relaxed text-base pt-0.5">
                      {item}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OUR PROMISE — Cards with ✦ and rotation hover (SmoothReveal)
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SmoothReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              Our Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
              What You Can Always Expect from Us
            </h2>
          </SmoothReveal>

          <StaggerContainer className="grid sm:grid-cols-3 gap-6" staggerDelay={0.12}>
            {promises.map((promise, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="bg-[#F0F4FF] rounded-2xl p-6 sm:p-8 text-center h-full min-h-[180px] flex flex-col items-center justify-center border border-[#E8ECF0] relative overflow-hidden"
                  whileHover={{ rotate: -1.5, scale: 1.02, boxShadow: "0 12px 24px rgba(48,74,192,0.08)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.span
                    className="inline-block text-[#87B73C] text-4xl mb-4 select-none"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {promise.mark}
                  </motion.span>
                  <p className="text-[#1C1D62] font-semibold text-lg flex-1 flex items-center">
                    {promise.text}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHO WE WORK WITH — 4 cards with icons and different tints
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              Who We Work With
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
              Businesses and Professionals Across Sectors
            </h2>
          </SectionReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.1}>
            {clientTypes.map((client, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="h-full"
                  whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(48,74,192,0.08)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className={`${client.tint} rounded-2xl p-6 border border-[#E8ECF0] h-full min-h-[140px] flex flex-col group transition-all duration-300`}>
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <client.icon className={`w-6 h-6 ${client.iconColor}`} />
                    </motion.div>
                    <span className="text-[#2D3748] font-medium text-sm sm:text-base leading-relaxed flex-1">
                      {client.label}
                    </span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — Full-width with pattern overlay and Indian professional image
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23304AC0' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        {/* Decorative floating elements */}
        <FloatingElement amplitude={8} duration={4} className="absolute top-10 right-[15%] hidden lg:block">
          <div className="w-3 h-3 rounded-full bg-[#304AC0]/20" />
        </FloatingElement>
        <FloatingElement amplitude={6} duration={3} className="absolute bottom-10 left-[10%] hidden lg:block">
          <div className="w-2 h-2 rounded-full bg-[#87B73C]/30" />
        </FloatingElement>

        {/* Indian professional decorative image (right side, hidden on mobile) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src="/images/pages/indian-professional.png"
              alt=""
              fill
              className="object-cover object-right opacity-[0.07]"
              sizes="33vw"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <SectionReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1C1D62] mb-4">
              Let&apos;s understand your funding requirement.
            </h2>
            <p className="text-[#718096] mb-8 max-w-xl mx-auto">
              Reach out for a free consultation and let us help you find the
              right funding solution.
            </p>
            <Link href="/contact">
              <PulseGlow color="#304AC0" className="inline-block">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md group transition-all duration-300"
                  >
                    Get in Touch
                    <motion.span
                      className="ml-2 inline-flex"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Button>
                </motion.div>
              </PulseGlow>
            </Link>
          </SectionReveal>
        </div>
      </section>
    </motion.div>
  );
}
