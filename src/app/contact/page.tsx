"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Linkedin,
  Facebook,
  Instagram,
  Send,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Clock,
  Ban,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 93448 99971",
    href: "tel:+919344899971",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@credorafin.com",
    href: "mailto:info@credorafin.com",
  },
  {
    icon: Globe,
    label: "Website",
    value: "www.credorafin.com",
    href: "https://www.credorafin.com",
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Free Assessment", color: "text-[#304AC0]" },
  { icon: Clock, label: "1 Business Day Response", color: "text-[#87B73C]" },
  { icon: Ban, label: "No Obligation", color: "text-[#13277E]" },
];

const faqs = [
  {
    question: "What happens after I submit the inquiry?",
    answer:
      "Our experienced advisor reviews your requirement and contacts you within 1 business day to schedule a free financial assessment.",
  },
  {
    question: "Is there any fee for the initial consultation?",
    answer:
      "No, the initial consultation and financial assessment are completely free with no obligation.",
  },
  {
    question: "What information should I prepare?",
    answer:
      "It helps to have your business details, bank statements, and an idea of your funding requirement ready, but we can guide you through everything.",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessType: "",
    fundingRequirement: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep = () => {
    if (!formData.name) {
      toast({
        title: "Missing Fields",
        description: "Please fill in your full name to continue.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
      toast({
        title: "Inquiry Sent!",
        description: "We will contact you within 1 business day.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ═══════════════════════════════════════
          PAGE HERO — With background image
          ═══════════════════════════════════════ */}
      <section className="bg-[#F0F4FF] pt-16 md:pt-24 pb-16 md:pb-20 relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/pages/contact-hero.png"
            alt="Modern office building"
            fill
            sizes="100vw"
            className="object-cover opacity-[0.07]"
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

        {/* Decorative floating elements */}
        <FloatingElement amplitude={10} duration={4} className="absolute top-20 right-[10%] hidden lg:block">
          <div className="w-4 h-4 rounded-full bg-[#87B73C]/15" />
        </FloatingElement>
        <FloatingElement amplitude={8} duration={3} className="absolute bottom-10 left-[8%] hidden lg:block">
          <div className="w-3 h-3 rounded-full bg-[#304AC0]/15" />
        </FloatingElement>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <SectionReveal>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#304AC0] transition-colors duration-300">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#1C1D62] font-medium">Contact</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight max-w-3xl">
                  Let&apos;s Talk About Your{" "}
                  <span className="relative inline-block">
                    Funding Requirement
                    <motion.span
                      className="absolute left-0 -bottom-1 w-full h-1.5 bg-[#304AC0] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </span>
                </h1>
                <p className="mt-5 text-[#2D3748] leading-relaxed max-w-2xl text-base sm:text-lg">
                  Get in touch with our team for a free, no-obligation consultation.
                  We&apos;re here to help you find the right funding solution.
                </p>

                {/* Trust badges inline */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {trustBadges.map((badge, i) => {
                    const IconComp = badge.icon;
                    return (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2 bg-white/80 rounded-lg px-4 py-2 border border-[#E8ECF0]"
                        whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(48,74,192,0.08)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <IconComp className={`w-4 h-4 ${badge.color}`} />
                        <span className="text-xs font-medium text-[#2D3748]">{badge.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Animated illustration */}
              <div className="hidden lg:flex justify-center">
                <AnimatedIllustration theme="support" size={220} color="#304AC0" />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          Two-column layout
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Left Column — Contact Card */}
            <div className="lg:col-span-2 space-y-6">
              <SectionReveal direction="left">
                <div className="bg-[#1C1D62] rounded-2xl p-6 sm:p-8 text-white overflow-hidden relative">
                  {/* Abstract SVG Map Pin Illustration */}
                  <div className="mb-6 flex items-center justify-center">
                    <svg
                      viewBox="0 0 240 140"
                      className="w-full max-w-[240px] h-auto"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      {/* Map outline suggestion */}
                      <rect x="20" y="20" width="200" height="100" rx="12" stroke="white" strokeWidth="1" opacity="0.15" />
                      {/* Grid lines */}
                      <line x1="20" y1="50" x2="220" y2="50" stroke="white" strokeWidth="0.5" opacity="0.1" />
                      <line x1="20" y1="80" x2="220" y2="80" stroke="white" strokeWidth="0.5" opacity="0.1" />
                      <line x1="80" y1="20" x2="80" y2="120" stroke="white" strokeWidth="0.5" opacity="0.1" />
                      <line x1="140" y1="20" x2="140" y2="120" stroke="white" strokeWidth="0.5" opacity="0.1" />
                      {/* Roads */}
                      <path d="M40 90 L120 40 L200 70" stroke="white" strokeWidth="1" opacity="0.12" />
                      <path d="M30 60 L100 100 L180 50" stroke="white" strokeWidth="1" opacity="0.08" />
                      {/* Pin shadow */}
                      <ellipse cx="120" cy="100" rx="12" ry="4" fill="#000" opacity="0.15" />
                      {/* Map pin */}
                      <motion.path
                        d="M120 35 C106 35 96 45 96 58 C96 76 120 95 120 95 C120 95 144 76 144 58 C144 45 134 35 120 35Z"
                        fill="#87B73C"
                        opacity="0.9"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <circle cx="120" cy="55" r="8" fill="white" opacity="0.9" />
                      {/* Small location dots */}
                      <circle cx="70" cy="70" r="3" fill="#304AC0" opacity="0.4" />
                      <circle cx="170" cy="45" r="2.5" fill="#87B73C" opacity="0.4" />
                      <circle cx="50" cy="100" r="2" fill="white" opacity="0.2" />
                    </svg>
                  </div>

                  <h2 className="text-lg font-semibold mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-5">
                    {contactInfo.map((item, i) => {
                      const IconComp = item.icon;
                      return (
                        <motion.a
                          key={i}
                          href={item.href}
                          className="flex items-start gap-4 group"
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div
                            className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors duration-300"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          >
                            <IconComp className="w-5 h-5 text-[#87B73C]" />
                          </motion.div>
                          <div>
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">
                              {item.label}
                            </p>
                            <p className="text-white text-sm font-medium group-hover:text-[#87B73C] transition-colors duration-300">
                              {item.value}
                            </p>
                          </div>
                        </motion.a>
                      );
                    })}

                    {/* Address */}
                    <motion.div
                      className="flex items-start gap-4"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <motion.div
                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <MapPin className="w-5 h-5 text-[#87B73C]" />
                      </motion.div>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">
                          Address
                        </p>
                        <p className="text-white text-sm font-medium leading-relaxed">
                          1157, 17th St, Anna Nagar West Extension, Padi,
                          Chennai, Tamil Nadu 600050
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-3">
                      Follow Us
                    </p>
                    <div className="flex items-center gap-3">
                      {[
                        { icon: Linkedin, label: "LinkedIn" },
                        { icon: Facebook, label: "Facebook" },
                        { icon: Instagram, label: "Instagram" },
                      ].map((social, i) => (
                        <motion.a
                          key={i}
                          href="#"
                          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                          aria-label={social.label}
                          whileHover={{ scale: 1.1, rotate: 3 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <social.icon className="w-4 h-4 text-white" />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionReveal>

              {/* Trust Badges */}
              <SectionReveal direction="left" delay={0.1}>
                <div className="grid grid-cols-3 gap-3">
                  {trustBadges.map((badge, i) => {
                    const IconComp = badge.icon;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(48,74,192,0.08)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="bg-[#F0F4FF] rounded-xl p-3 sm:p-4 text-center border border-[#E8ECF0] h-full">
                          <IconComp className={`w-5 h-5 mx-auto mb-2 ${badge.color}`} />
                          <p className="text-[#2D3748] text-[11px] sm:text-xs font-medium leading-tight">
                            {badge.label}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </SectionReveal>
            </div>

            {/* Right Column — Form */}
            <div className="lg:col-span-3">
              <SectionReveal direction="right">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-[#E8ECF0]">
                  {submitted ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-12 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full bg-[#87B73C]/10 flex items-center justify-center mb-5"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <CheckCircle2 className="w-8 h-8 text-[#87B73C]" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-[#1C1D62] mb-2">
                        Thank you!
                      </h3>
                      <p className="text-[#718096] text-sm max-w-sm">
                        Your inquiry has been received. Our team will contact you
                        within 1 business day.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Step Indicator */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-[#304AC0]" />
                          <h2 className="text-lg font-semibold text-[#1C1D62]">
                            Send Us an Inquiry
                          </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 ${step === 1 ? "bg-[#304AC0] text-white" : "bg-[#E8ECF0] text-[#718096]"}`}>
                            1
                          </span>
                          <motion.div
                            className="w-8 h-px"
                            style={{ backgroundColor: step === 2 ? "#304AC0" : "#E8ECF0" }}
                            animate={{ backgroundColor: step === 2 ? "#304AC0" : "#E8ECF0" }}
                          />
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 ${step === 2 ? "bg-[#304AC0] text-white" : "bg-[#E8ECF0] text-[#718096]"}`}>
                            2
                          </span>
                          <span className="text-[#718096] text-xs ml-1.5">
                            Step {step} of 2
                          </span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <Link href="/referral-partner" className="text-sm text-[#304AC0] hover:text-[#13277E] underline underline-offset-2 transition-colors duration-300">
                          Form Specified for Referral Partner →
                        </Link>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5"
                          >
                            <div className="grid sm:grid-cols-2 gap-5">
                              {/* Full Name */}
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-[#304AC0] mb-1.5 transition-all duration-300"
                                >
                                  Full Name<span className="text-red-500">*</span>
                                </label>
                                <motion.div
                                  animate={{
                                    boxShadow: focusedField === "name"
                                      ? "0 0 0 3px rgba(48,74,192,0.1)"
                                      : "0 0 0 0px rgba(48,74,192,0)"
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="rounded-md"
                                >
                                  <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("name")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Your full name"
                                    required
                                    className="border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 focus:ring-4 transition-all duration-300"
                                  />
                                </motion.div>
                              </div>

                              {/* Business Name */}
                              <div>
                                <label
                                  htmlFor="businessName"
                                  className="block text-sm font-medium text-[#304AC0] mb-1.5 transition-all duration-300"
                                >
                                  Business Name
                                </label>
                                <motion.div
                                  animate={{
                                    boxShadow: focusedField === "businessName"
                                      ? "0 0 0 3px rgba(48,74,192,0.1)"
                                      : "0 0 0 0px rgba(48,74,192,0)"
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="rounded-md"
                                >
                                  <Input
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("businessName")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Your business name"
                                    className="border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 focus:ring-4 transition-all duration-300"
                                  />
                                </motion.div>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                              {/* Business Type / Industry */}
                              <div>
                                <label
                                  htmlFor="businessType"
                                  className="block text-sm font-medium text-[#304AC0] mb-1.5 transition-all duration-300"
                                >
                                  Business Type / Industry
                                </label>
                                <Select
                                  value={formData.businessType}
                                  onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}
                                >
                                  <SelectTrigger className="w-full border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 focus:ring-4 transition-all duration-300">
                                    <SelectValue placeholder="Select your industry" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="Trading">Trading</SelectItem>
                                    <SelectItem value="Export/Import">Export/Import</SelectItem>
                                    <SelectItem value="Retail">Retail</SelectItem>
                                    <SelectItem value="Services">Services</SelectItem>
                                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Hospitality">Hospitality</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Funding Requirement */}
                              <div>
                                <label
                                  htmlFor="fundingRequirement"
                                  className="block text-sm font-medium text-[#304AC0] mb-1.5 transition-all duration-300"
                                >
                                  Funding Requirement in &#8377;
                                </label>
                                <motion.div
                                  animate={{
                                    boxShadow: focusedField === "fundingRequirement"
                                      ? "0 0 0 3px rgba(48,74,192,0.1)"
                                      : "0 0 0 0px rgba(48,74,192,0)"
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="rounded-md"
                                >
                                  <Input
                                    id="fundingRequirement"
                                    name="fundingRequirement"
                                    value={formData.fundingRequirement}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("fundingRequirement")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="e.g., 50,00,000"
                                    className="border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 focus:ring-4 transition-all duration-300"
                                  />
                                </motion.div>
                              </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                type="button"
                                size="lg"
                                onClick={handleNextStep}
                                className="w-full bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider py-3 rounded-md group transition-all duration-300"
                              >
                                Continue
                                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5"
                          >
                            <div className="grid sm:grid-cols-2 gap-5">
                              {/* Phone Number */}
                              <div>
                                <label
                                  htmlFor="phone"
                                  className="block text-sm font-medium text-[#304AC0] mb-1.5 transition-all duration-300"
                                >
                                  Phone Number<span className="text-red-500">*</span>
                                </label>
                                <motion.div
                                  animate={{
                                    boxShadow: focusedField === "phone"
                                      ? "0 0 0 3px rgba(48,74,192,0.1)"
                                      : "0 0 0 0px rgba(48,74,192,0)"
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="rounded-md"
                                >
                                  <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("phone")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                    className="border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 focus:ring-4 transition-all duration-300"
                                  />
                                </motion.div>
                              </div>

                              {/* Email Address */}
                              <div>
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-[#304AC0] mb-1.5 transition-all duration-300"
                                >
                                  Email Address
                                </label>
                                <motion.div
                                  animate={{
                                    boxShadow: focusedField === "email"
                                      ? "0 0 0 3px rgba(48,74,192,0.1)"
                                      : "0 0 0 0px rgba(48,74,192,0)"
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="rounded-md"
                                >
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className="border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 focus:ring-4 transition-all duration-300"
                                  />
                                </motion.div>
                              </div>
                            </div>

                            {/* Message */}
                            <div>
                              <label
                                htmlFor="message"
                                className="block text-sm font-medium text-[#304AC0] mb-1.5 transition-all duration-300"
                              >
                                Message / Describe your requirement
                              </label>
                              <motion.div
                                animate={{
                                  boxShadow: focusedField === "message"
                                    ? "0 0 0 3px rgba(48,74,192,0.1)"
                                    : "0 0 0 0px rgba(48,74,192,0)"
                                }}
                                transition={{ duration: 0.2 }}
                                className="rounded-md"
                              >
                                <Textarea
                                  id="message"
                                  name="message"
                                  value={formData.message}
                                  onChange={handleChange}
                                  onFocus={() => setFocusedField("message")}
                                  onBlur={() => setFocusedField(null)}
                                  placeholder="Tell us about your funding requirement..."
                                  rows={4}
                                  className="border-[#E8ECF0] focus:border-[#304AC0] focus:ring-[#304AC0]/20 focus:ring-4 transition-all duration-300 resize-none"
                                />
                              </motion.div>
                            </div>

                            <div className="flex gap-3">
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="lg"
                                  onClick={() => setStep(1)}
                                  className="font-medium text-sm uppercase tracking-wider py-3 rounded-md border-[#E8ECF0] text-[#2D3748] hover:bg-[#F0F4FF] transition-all duration-300"
                                >
                                  Back
                                </Button>
                              </motion.div>
                              <PulseGlow color="#304AC0" className="flex-1">
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="h-full">
                                  <Button
                                    type="submit"
                                    size="lg"
                                    disabled={loading}
                                    className="w-full bg-[#304AC0] hover:bg-[#13277E] text-white font-medium text-sm uppercase tracking-wider py-3 rounded-md group transition-all duration-300"
                                  >
                                    {loading ? (
                                      <span className="flex items-center gap-2">
                                        <svg
                                          className="animate-spin h-4 w-4"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          />
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                          />
                                        </svg>
                                        Sending...
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-2">
                                        Send Inquiry
                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                      </span>
                                    )}
                                  </Button>
                                </motion.div>
                              </PulseGlow>
                            </div>
                          </motion.div>
                        )}
                      </form>
                    </>
                  )}
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ Section
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SmoothReveal>
            <span className="inline-block text-[#304AC0] text-xs font-semibold uppercase tracking-widest mb-4">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-8">
              Common Questions
            </h2>
          </SmoothReveal>

          <SectionReveal delay={0.1}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-xl border border-[#E8ECF0] px-6 data-[state=open]:shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="text-[#1C1D62] font-semibold text-left text-sm sm:text-base hover:no-underline py-5 hover:text-[#304AC0] transition-colors duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#2D3748] text-sm sm:text-base leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionReveal>
        </div>
      </section>
    </motion.div>
  );
}
