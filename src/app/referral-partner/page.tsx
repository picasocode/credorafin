"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, animate } from "framer-motion";
import {
  Users,
  Search,
  Gift,
  ArrowRight,
  ChevronRight,
  Calculator,
  Briefcase,
  Landmark,
  Network,
  Handshake,
  Sparkles,
  IndianRupee,
  CheckCircle2,
  Zap,
  Send,
  UserCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  FloatingElement,
  PulseGlow,
  SmoothReveal,
} from "@/lib/animations";
import AnimatedIllustration from "@/components/AnimatedIllustration";

/* ────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────── */

const timelineSteps = [
  {
    title: "Refer",
    description:
      "You refer a business or individual who needs a funding solution.",
    icon: Users,
    accent: "#304AC0",
  },
  {
    title: "Assess",
    description:
      "Our team reaches out, assesses their requirement, and takes it forward.",
    icon: Search,
    accent: "#13277E",
  },
  {
    title: "Earn",
    description: "Once the loan is disbursed, you earn a referral reward.",
    icon: Gift,
    accent: "#87B73C",
  },
];

const partnerTypes = [
  {
    icon: Briefcase,
    label: "Chartered Accountants & Financial Advisors",
    accentBorder: "#304AC0",
    tint: "bg-[#F0F4FF]",
  },
  {
    icon: Handshake,
    label: "Business Consultants & Relationship Managers",
    accentBorder: "#87B73C",
    tint: "bg-[#F5F8EC]",
  },
  {
    icon: Landmark,
    label: "Real Estate Agents & Builders",
    accentBorder: "#87B73C",
    tint: "bg-[#F5F8EC]",
  },
  {
    icon: Network,
    label: "Anyone with a Strong Network of Business Owners",
    accentBorder: "#304AC0",
    tint: "bg-[#F0F4FF]",
  },
];

const whyPartnerItems = [
  { text: "Simple and transparent referral process", progress: 90 },
  { text: "Competitive rewards on successful disbursal", progress: 95 },
  { text: "Full support — we handle everything after the introduction", progress: 100 },
  { text: "Trusted by 1,200+ clients across India", progress: 85 },
];

const rewardCards = [
  { amount: "₹15,000", label: "Per MSME Referral" },
  { amount: "₹50,000+", label: "Large Loan Payout" },
  { amount: "₹2L+", label: "Top Partners / Year" },
];

const partnerBenefits = [
  { icon: Zap, title: "Quick Onboarding", desc: "Get started in minutes with a simple registration process.", color: "#304AC0" },
  { icon: CheckCircle2, title: "No Targets", desc: "Refer at your own pace — no minimum requirements.", color: "#87B73C" },
  { icon: Sparkles, title: "Dedicated Support", desc: "A partner manager to assist you at every step.", color: "#13277E" },
  { icon: IndianRupee, title: "Competitive Payouts", desc: "Earn rewards on every successful loan disbursal.", color: "#1C1D62" },
];

/* ────────────────────────────────────────────
   ANIMATED COUNTER (for reward calculator)
   ──────────────────────────────────────────── */

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, isInView]);

  return <span ref={ref}>{display.toLocaleString("en-IN")}</span>;
}

/* ────────────────────────────────────────────
   SPARKLE animation for Earn card
   ──────────────────────────────────────────── */

function CelebrationSparkle() {
  return (
    <div className="absolute -top-2 -right-2 pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="absolute block w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? "#87B73C" : "#304AC0",
            left: `${[8, -4, 14, 2][i]}px`,
            top: `${[-2, 6, 4, 14][i]}px`,
          }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.4,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   PAGE COMPONENT
   ──────────────────────────────────────────── */

export default function ReferralPartnerPage() {
  const [loanSize, setLoanSize] = useState(25); // in lakhs
  const estimatedReward = Math.round((loanSize * 100000 * 0.5) / 100); // 0.5%

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessType: "",
    company: "",
    city: "",
    referralSource: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email address";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) errors.phone = "Enter a valid 10-digit phone number";
    if (!formData.city.trim()) errors.city = "City is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "referral-partner",
          name: formData.fullName,
          email: formData.email,
          phone: `+91${formData.phone}`,
          businessType: formData.businessType,
          businessName: formData.company,
          city: formData.city,
          referralSource: formData.referralSource,
          message: formData.message,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. Our team will contact you within 1 business day.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        businessType: "",
        company: "",
        city: "",
        referralSource: "",
        message: "",
      });
      setFormErrors({});
    } catch {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ═══════════════════════════════════════
          PAGE HERO — Split layout with image + floating cards
          ═══════════════════════════════════════ */}
      <section className="bg-[#F0F4FF] py-16 md:py-24 relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/pages/referral-india.png"
            alt="Business partnership"
            fill
            sizes="100vw"
            className="object-cover opacity-[0.06]"
            priority
          />
        </div>

        {/* Decorative floating elements */}
        <FloatingElement amplitude={10} duration={4} className="absolute top-10 right-[12%] hidden lg:block">
          <div className="w-4 h-4 rounded-full bg-[#87B73C]/15" />
        </FloatingElement>
        <FloatingElement amplitude={8} duration={3.5} className="absolute bottom-20 left-[8%] hidden lg:block">
          <div className="w-3 h-3 rounded-full bg-[#304AC0]/15" />
        </FloatingElement>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <SectionReveal>
            <nav
              className="flex items-center gap-1.5 text-sm text-[#718096] mb-8"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-[#304AC0] transition-colors duration-300">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#1C1D62] font-medium">
                Referral Partner
              </span>
            </nav>
          </SectionReveal>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT — Heading with green checkmark watermark */}
            <SectionReveal direction="left">
              <div className="relative">
                {/* Decorative checkmark SVG watermark */}
                <svg
                  viewBox="0 0 200 200"
                  className="absolute -top-10 -left-10 w-48 h-48 opacity-[0.07] pointer-events-none"
                  aria-hidden="true"
                >
                  <circle cx="100" cy="100" r="90" fill="#87B73C" />
                  <path
                    d="M60 100 L90 130 L140 75"
                    stroke="white"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight relative z-10">
                  Turn Your Network{" "}
                  <span className="relative inline-block">
                    <span className="text-[#87B73C]">Into Rewards</span>
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#87B73C]/20 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </span>
                </h1>
                <p className="mt-5 text-[#2D3748] leading-relaxed max-w-xl text-base sm:text-lg relative z-10">
                  Join Credora&apos;s referral partner program and earn
                  competitive rewards by connecting businesses with the funding
                  solutions they need. It&apos;s simple, transparent, and
                  rewarding.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 relative z-10">
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md group transition-all duration-300"
                      >
                        Join Now
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-[#304AC0] text-[#304AC0] hover:bg-[#F0F4FF] font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md transition-all duration-300"
                      >
                        Learn More
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </SectionReveal>

            {/* RIGHT — Floating reward cards */}
            <SectionReveal direction="right" delay={0.15}>
              <div className="relative flex flex-col items-center gap-5">
                {rewardCards.map((card, i) => (
                  <motion.div
                    key={i}
                    className="w-full max-w-xs"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + i * 0.15,
                      ease: "easeOut",
                    }}
                    whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(48,74,192,0.10)" }}
                  >
                    <div
                      className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm flex items-center gap-5 transition-all duration-300 group"
                      style={{
                        borderLeftWidth: "4px",
                        borderLeftColor:
                          i === 1 ? "#87B73C" : "#304AC0",
                      }}
                    >
                      <motion.div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          i === 1
                            ? "bg-[#F5F8EC]"
                            : "bg-[#F0F4FF]"
                        }`}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <IndianRupee
                          className={`w-6 h-6 ${
                            i === 1
                              ? "text-[#87B73C]"
                              : "text-[#304AC0]"
                          }`}
                        />
                      </motion.div>
                      <div>
                        <motion.p
                          className="text-2xl font-bold text-[#1C1D62]"
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            duration: 3,
                            delay: i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {card.amount}
                        </motion.p>
                        <p className="text-[#718096] text-sm mt-0.5">
                          {card.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — Animated Timeline with Card Steps
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-12">
              Three Simple Steps to Start Earning
            </h2>
          </SectionReveal>

          {/* Desktop — Horizontal timeline */}
          <div className="hidden md:flex flex-col md:flex-row items-stretch gap-0 relative">
            {timelineSteps.map((step, i) => (
              <SectionReveal key={i} delay={i * 0.2} direction="up" className="flex-1 relative">
                {/* Connecting line between steps */}
                {i < timelineSteps.length - 1 && (
                  <div className="absolute top-16 -right-3 w-6 z-20 pointer-events-none hidden md:block">
                    <svg viewBox="0 0 24 40" className="w-full h-10" fill="none" aria-hidden="true">
                      <motion.path
                        d="M0 20 C12 4, 12 36, 24 20"
                        stroke="#304AC0"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.2 }}
                      />
                      {/* Flowing dot */}
                      <motion.circle
                        r="3"
                        fill="#87B73C"
                        animate={{
                          offsetDistance: ["0%", "100%"],
                          opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          offsetPath: "path('M0 20 C12 4, 12 36, 24 20')",
                        }}
                      />
                    </svg>
                  </div>
                )}

                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(48,74,192,0.10)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`relative bg-white rounded-2xl border border-[#E8ECF0] shadow-sm p-6 sm:p-8 h-full min-h-[200px] flex flex-col text-center ${
                      i < timelineSteps.length - 1
                        ? "md:mr-6"
                        : ""
                    } transition-all duration-300 group overflow-hidden`}
                  >
                    {/* Celebration sparkle for Earn card */}
                    {i === 2 && <CelebrationSparkle />}

                    {/* Step number badge */}
                    <div className="flex justify-center mb-5">
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${step.accent}12`,
                        }}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <step.icon
                          className="w-8 h-8"
                          style={{ color: step.accent }}
                        />
                      </motion.div>
                    </div>

                    {/* Step label */}
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: step.accent }}
                    >
                      Step {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-xl font-semibold text-[#1C1D62] mb-3 group-hover:text-[#304AC0] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-[#2D3748] leading-relaxed text-sm sm:text-base max-w-xs mx-auto flex-1">
                      {step.description}
                    </p>

                    {/* Bottom accent bar */}
                    <div
                      className="mt-6 h-1 rounded-full mx-auto w-16 group-hover:w-24 transition-all duration-500"
                      style={{ backgroundColor: step.accent }}
                    />
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>

          {/* Mobile — Vertical timeline */}
          <div className="md:hidden space-y-0">
            {timelineSteps.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                {/* Vertical line + node */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-white border-2 shadow-sm flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: step.accent }}
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: step.accent }} />
                  </motion.div>
                  {i < timelineSteps.length - 1 && (
                    <motion.div
                      className="w-0.5 flex-1 min-h-[32px]"
                      style={{ backgroundColor: `${step.accent}30` }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.accent }}>
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-lg font-semibold text-[#1C1D62] mt-0.5">{step.title}</h4>
                  <p className="text-sm text-[#718096] mt-1 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PARTNER BENEFITS — 4 cards with AnimatedIllustration
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SmoothReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              Partner Benefits
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-10">
              Why Join Our Program
            </h2>
          </SmoothReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.12}>
            {partnerBenefits.map((benefit, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="h-full"
                  whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(48,74,192,0.10)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-white rounded-2xl p-6 border border-[#E8ECF0] shadow-sm h-full min-h-[200px] flex flex-col text-center group relative overflow-hidden transition-all duration-300">
                    {/* Colored bottom border on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ backgroundColor: benefit.color }}
                    />
                    <motion.div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${benefit.color}10` }}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <benefit.icon className="w-7 h-7" style={{ color: benefit.color }} />
                    </motion.div>
                    <h3 className="text-base font-semibold text-[#1C1D62] mb-2 group-hover:text-[#304AC0] transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-[#718096] leading-relaxed flex-1">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHO CAN BE A REFERRAL PARTNER — 2x2 grid with accent borders
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text content */}
            <SectionReveal direction="left">
              <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
                Who Can Be a Referral Partner
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-6">
                Anyone with the Right Network
              </h2>
              <p className="text-[#2D3748] leading-relaxed mb-8">
                Whether you&apos;re a financial professional or simply well-connected
                in the business community, you can earn rewards by connecting
                businesses with Credora&apos;s funding solutions.
              </p>
            </SectionReveal>

            {/* Right — Cards */}
            <SectionReveal direction="right" delay={0.15}>
              <StaggerContainer
                className="grid sm:grid-cols-2 gap-5"
                staggerDelay={0.1}
              >
                {partnerTypes.map((type, i) => (
                  <StaggerItem key={i}>
                    <motion.div
                      className="h-full"
                      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(48,74,192,0.08)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div
                        className={`${type.tint} rounded-2xl p-6 h-full min-h-[150px] flex flex-col border border-[#E8ECF0] group transition-all duration-300`}
                        style={{
                          borderTopWidth: "4px",
                          borderTopColor: type.accentBorder,
                        }}
                      >
                        <motion.div
                          className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <type.icon
                            className="w-6 h-6"
                            style={{ color: type.accentBorder }}
                          />
                        </motion.div>
                        <p className="text-[#2D3748] font-medium text-sm leading-relaxed flex-1">
                          {type.label}
                        </p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY PARTNER WITH US — Dark card with dot matrix pattern + horizontal bars
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="bg-[#1C1D62] rounded-2xl p-8 sm:p-10 md:p-12 text-white relative overflow-hidden">
              {/* Dot matrix pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-10">
                  Why Partner With Us
                </h2>

                <StaggerContainer
                  className="flex flex-col gap-5"
                  staggerDelay={0.1}
                >
                  {whyPartnerItems.map((item, i) => (
                    <StaggerItem key={i}>
                      <motion.div
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <p className="text-white/90 leading-relaxed text-base sm:w-72 flex-shrink-0">
                          {item.text}
                        </p>
                        {/* Animated progress bar */}
                        <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor:
                                i % 2 === 0 ? "#87B73C" : "#304AC0",
                            }}
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${item.progress}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.2,
                              delay: 0.2 + i * 0.15,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                        <span className="text-white/60 text-sm font-medium w-10 text-right flex-shrink-0">
                          {item.progress}%
                        </span>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          REWARD CALCULATOR — Interactive estimation with AnimatedIllustration
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calculator className="w-5 h-5 text-[#304AC0]" />
                <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest">
                  Reward Calculator
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-2 text-center">
                Estimated Referral Rewards
              </h2>
              <p className="text-[#718096] text-center mb-10 text-sm">
                See your potential earnings based on the average loan size you
                refer. This is an illustrative estimate.
              </p>

              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8ECF0] shadow-sm">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[#2D3748] font-medium text-sm">
                      Average Business Loan Size
                    </label>
                    <span className="text-[#304AC0] font-bold text-lg">
                      ₹{loanSize} Lakh
                    </span>
                  </div>
                  <Slider
                    value={[loanSize]}
                    min={5}
                    max={200}
                    step={5}
                    onValueChange={(v) => setLoanSize(v[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[#718096] text-xs mt-1.5">
                    <span>₹5L</span>
                    <span>₹2Cr</span>
                  </div>
                </div>

                <div className="bg-[#F0F4FF] rounded-xl p-6 text-center border border-[#E8ECF0]">
                  <p className="text-[#718096] text-sm mb-2">
                    Estimated Reward (0.5% of loan amount)
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-[#87B73C]">
                    ₹<AnimatedNumber value={estimatedReward} />
                  </p>
                  <p className="text-[#718096] text-xs mt-2">
                    *Actual rewards may vary based on product and disbursal terms
                  </p>
                </div>

                <p className="text-[#718096] text-xs mt-4 text-center italic">
                  For Illustration Purpose only. Actual commission varies based on loan type, amount, and lender.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIAL / QUOTE with AnimatedIllustration
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="max-w-3xl mx-auto relative">
              {/* Decorative quote mark SVG */}
              <svg
                viewBox="0 0 80 80"
                className="absolute -top-6 -left-4 w-16 h-16 opacity-10 pointer-events-none"
                aria-hidden="true"
              >
                <text
                  x="0"
                  y="65"
                  fontSize="80"
                  fontFamily="Georgia, serif"
                  fill="#304AC0"
                >
                  &ldquo;
                </text>
              </svg>

              <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E8ECF0] relative z-10">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0 hidden md:block">
                    <AnimatedIllustration theme="success" size={100} color="#304AC0" />
                  </div>
                  <div>
                    <blockquote className="text-lg sm:text-xl font-medium text-[#1C1D62] leading-relaxed italic">
                      Being a Credora referral partner has been seamless. I
                      connect businesses, they handle the rest.
                    </blockquote>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#87B73C] flex items-center justify-center text-white font-bold text-sm">
                        RP
                      </div>
                      <div>
                        <p className="text-[#1C1D62] font-semibold text-sm">
                          Referral Partner
                        </p>
                        <p className="text-[#718096] text-xs">
                          Credora Partner Network
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          REFERRAL PARTNER REGISTRATION FORM
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
                  Become a Partner
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-3">
                  Referral Partner Registration
                </h2>
                <p className="text-[#718096] text-sm sm:text-base max-w-lg mx-auto">
                  Fill out the form below to apply for our referral partner program. Our team will review your application and get back to you.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-[#E8ECF0] shadow-lg">
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[#2D3748] text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" });
                        }}
                        className={`pl-10 h-11 rounded-lg border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 ${formErrors.fullName ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                      />
                    </div>
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#2D3748] text-sm font-medium">
                        Email Address <span className="text-[#718096] font-normal">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                          }}
                          className={`pl-10 h-11 rounded-lg border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 ${formErrors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                        />
                      </div>
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#2D3748] text-sm font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
                        <div className="flex">
                          <span className="inline-flex items-center px-3 h-11 rounded-l-lg border border-r-0 border-[#E8ECF0] bg-[#F7F8FA] text-[#718096] text-sm font-medium">
                            +91
                          </span>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setFormData({ ...formData, phone: val });
                              if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
                            }}
                            className={`rounded-l-none h-11 rounded-r-lg border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 ${formErrors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                          />
                        </div>
                      </div>
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>

                  {/* Business Type & Company Row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-[#2D3748] text-sm font-medium">
                        Business Type / Profession <span className="text-[#718096] font-normal">(optional)</span>
                      </Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(val) => {
                          setFormData({ ...formData, businessType: val });
                          if (formErrors.businessType) setFormErrors({ ...formErrors, businessType: "" });
                        }}
                      >
                        <SelectTrigger
                          className={`w-full h-11 rounded-lg border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 ${formErrors.businessType ? "border-red-400" : ""}`}
                        >
                          <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chartered Accountant">Chartered Accountant</SelectItem>
                          <SelectItem value="Financial Advisor / Wealth Manager">Financial Advisor / Wealth Manager</SelectItem>
                          <SelectItem value="Business Consultant">Business Consultant</SelectItem>
                          <SelectItem value="Real Estate Agent / Builder">Real Estate Agent / Builder</SelectItem>
                          <SelectItem value="Insurance Agent">Insurance Agent</SelectItem>
                          <SelectItem value="Tax Consultant">Tax Consultant</SelectItem>
                          <SelectItem value="Company Secretary">Company Secretary</SelectItem>
                          <SelectItem value="Loan Agent / DSA">Loan Agent / DSA</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.businessType && <p className="text-red-500 text-xs mt-1">{formErrors.businessType}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-[#2D3748] text-sm font-medium">
                        Company / Firm Name <span className="text-[#718096] font-normal">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Your company or firm name"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="pl-10 h-11 rounded-lg border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* City & Referral Source Row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[#2D3748] text-sm font-medium">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
                        <Input
                          id="city"
                          type="text"
                          placeholder="Enter your city"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (formErrors.city) setFormErrors({ ...formErrors, city: "" });
                          }}
                          className={`pl-10 h-11 rounded-lg border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 ${formErrors.city ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                        />
                      </div>
                      {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referralSource" className="text-[#2D3748] text-sm font-medium">
                        How did you hear about us? <span className="text-[#718096] font-normal">(optional)</span>
                      </Label>
                      <Select
                        value={formData.referralSource}
                        onValueChange={(val) => setFormData({ ...formData, referralSource: val })}
                      >
                        <SelectTrigger className="w-full h-11 rounded-lg border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Google Search">Google Search</SelectItem>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Referral from existing partner">Referral from existing partner</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Newspaper / Magazine">Newspaper / Magazine</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#2D3748] text-sm font-medium">
                      Message / Additional Details <span className="text-[#718096] font-normal">(optional)</span>
                    </Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#718096]" />
                      <Textarea
                        id="message"
                        placeholder="Tell us anything else you'd like us to know..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="pl-10 rounded-lg border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#304AC0] hover:bg-[#13277E] text-white font-semibold text-sm uppercase tracking-wider rounded-lg group transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Submit Application
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  <p className="text-[#718096] text-xs text-center">
                    By submitting, you agree to our privacy policy. We will never share your information with third parties.
                  </p>
                </form>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — Full-width with confetti dots + bouncing arrow
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#1C1D62] relative overflow-hidden">
        {/* Confetti-like animated dots pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute block rounded-full"
              style={{
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                backgroundColor:
                  i % 4 === 0
                    ? "#87B73C"
                    : i % 4 === 1
                    ? "#304AC0"
                    : i % 4 === 2
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(135,183,60,0.3)",
                left: `${(i * 17 + 5) % 100}%`,
                top: `${(i * 23 + 10) % 100}%`,
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2 + (i % 3),
                delay: i * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <SectionReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
              Become a Referral Partner
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Start earning rewards by connecting businesses with the right
              funding solutions. Join our growing network of partners.
            </p>
            <Link href="/contact">
              <PulseGlow color="#87B73C" className="inline-block">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="bg-[#87B73C] hover:bg-[#6f9a2f] text-white font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md group transition-all duration-300"
                  >
                    Get Started
                    <motion.span
                      className="ml-2 inline-flex"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
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
