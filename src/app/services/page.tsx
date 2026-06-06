"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CreditCard,
  FileCheck,
  Banknote,
  HeadphonesIcon as Headphones,
  CheckCircle2,
  ArrowRight,
  Search,
  ClipboardList,
  Rocket,
  HeartHandshake,
} from "lucide-react";
import { services } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  PageTransition,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  SmoothReveal,
} from "@/lib/animations";

const iconMap: Record<string, React.ElementType> = {
  CreditCard,
  FileCheck,
  Banknote,
  HeadphonesIcon: Headphones,
};

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// Process Timeline data
const processSteps = [
  { icon: Search, label: "Assessment", desc: "Deep-dive into your credit profile & business needs" },
  { icon: ClipboardList, label: "Preparation", desc: "Fix gaps, structure applications, prepare documents" },
  { icon: Rocket, label: "Execution", desc: "Submit to lenders, compare offers, secure sanction" },
  { icon: HeartHandshake, label: "Support", desc: "Post-disbursal tracking, updates & closure" },
];

export default function ServicesPage() {
  return (
    <PageTransition>
      {/* ─── Page Hero with Diagonal Stripe Pattern ─── */}
      <section className="relative overflow-hidden bg-[#F0F4FF]">
        {/* Subtle Indian-themed background image */}
        <Image
          src="/images/services/advisory-indian.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.08] pointer-events-none"
          aria-hidden="true"
        />
        {/* Diagonal Stripe Pattern Background */}
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagStripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="20" stroke="#1C1D62" strokeWidth="6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagStripes)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <SmoothReveal>
            <nav className="flex items-center gap-2 text-sm text-[#718096] mb-6">
              <Link href="/" className="hover:text-[#304AC0] transition-colors">
                Home
              </Link>
              <span className="text-[#718096]">&gt;</span>
              <span className="text-[#1C1D62] font-medium">Services</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight max-w-3xl">
              Comprehensive Support Beyond Funding
            </h1>
            <p className="mt-5 text-[#2D3748] leading-relaxed max-w-2xl text-base sm:text-lg">
              Getting funded is only part of the journey. Our services ensure your credit profile is strong, your application is structured right, and you have support through every stage of the loan lifecycle.
            </p>
          </SmoothReveal>
        </div>
      </section>

      {/* ─── Service Cards Grid ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StaggerContainer
            className="grid md:grid-cols-2 gap-6"
            staggerDelay={0.12}
          >
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon];
              const stepNum = String(index + 1).padStart(2, "0");
              return (
                <StaggerItem key={service.slug}>
                  <HoverCard className="h-full">
                    <Link
                      href={`/services/${service.slug}`}
                      className="group block h-full min-h-[300px] bg-white rounded-2xl border border-[#E8ECF0] shadow-sm transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex h-full">
                        {/* LEFT colored sidebar */}
                        <div
                          className="w-2 flex-shrink-0 transition-colors duration-300"
                          style={{ backgroundColor: service.color }}
                        />

                        {/* Card Content */}
                        <div className="flex-1 p-6 flex flex-col h-full">
                          {/* Numbered step indicator + Icon */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-11 h-11 rounded-full flex items-center justify-center border-2 text-sm font-bold flex-shrink-0"
                                style={{
                                  borderColor: service.color,
                                  color: service.color,
                                  backgroundColor: `${service.color}08`,
                                }}
                              >
                                {stepNum}
                              </div>
                              {IconComponent && (
                                <div
                                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${service.color}10` }}
                                >
                                  <IconComponent
                                    className="w-5 h-5"
                                    style={{ color: service.color }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Title + Headline */}
                          <h3 className="text-xl font-semibold text-[#1C1D62] mb-1 group-hover:text-[#304AC0] transition-colors">
                            {service.title}
                          </h3>
                          <p
                            className="text-sm font-medium mb-3"
                            style={{ color: service.color }}
                          >
                            {service.headline}
                          </p>

                          {/* Description (truncated) */}
                          <p className="text-sm text-[#718096] leading-relaxed mb-5 flex-1">
                            {truncateText(service.desc, 160)}
                          </p>

                          {/* What We Do as mini tags/pills */}
                          <div className="mb-5 pt-4 border-t border-[#E8ECF0]">
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-xs font-semibold text-[#2D3748] uppercase tracking-wider">What We Do</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {service.whatWeDo.slice(0, 3).map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
                                  style={{
                                    borderColor: `${service.color}30`,
                                    color: service.color,
                                    backgroundColor: `${service.color}08`,
                                  }}
                                >
                                  {item.length > 30 ? item.slice(0, 30) + "…" : item}
                                </span>
                              ))}
                              {service.whatWeDo.length > 3 && (
                                <span
                                  className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                                  style={{
                                    color: service.color,
                                    backgroundColor: `${service.color}10`,
                                  }}
                                >
                                  +{service.whatWeDo.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stats Row */}
                          <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#87B73C] flex-shrink-0" />
                              <span className="text-sm text-[#2D3748] font-medium">
                                {service.benefits.length} Benefit{service.benefits.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          {/* Learn More Link */}
                          <div className="flex items-center justify-between mt-4">
                            <span
                              className="text-sm font-semibold uppercase tracking-wider transition-colors"
                              style={{ color: service.color }}
                            >
                              Learn More
                            </span>
                            <ArrowRight
                              className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                              style={{ color: service.color }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </HoverCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Process Timeline Section ─── */}
      <section className="py-16 md:py-20 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1C1D62] mb-3">
                Our Engagement Process
              </h2>
              <p className="text-[#718096] max-w-xl mx-auto">
                From first assessment to ongoing support — how we work with you through every stage.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
              {processSteps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.label} className="relative flex flex-col items-center text-center">
                    {/* Connector line */}
                    {idx < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-0.5 bg-[#304AC0] opacity-20" />
                    )}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative z-10 border-2"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: idx === 0 ? "#304AC0" : "#E8ECF0",
                      }}
                    >
                      <StepIcon
                        className="w-7 h-7"
                        style={{ color: idx === 0 ? "#304AC0" : "#718096" }}
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#304AC0] mb-1">
                      Step {idx + 1}
                    </span>
                    <h3 className="text-base font-semibold text-[#1C1D62] mb-1">
                      {step.label}
                    </h3>
                    <p className="text-xs text-[#718096] max-w-[180px] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── CTA Section with Pulsing Button ─── */}
      <section className="py-16 md:py-20 bg-[#1C1D62]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Our team is ready to help you strengthen your credit profile, structure your application, and manage the entire loan lifecycle.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-[#87B73C] hover:bg-[#6d9a2e] text-white font-medium text-sm uppercase tracking-wider px-8 py-3 rounded-md group animate-pulse"
                style={{ animationDuration: "2.5s" }}
              >
                Contact Us
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </SectionReveal>
        </div>
      </section>
    </PageTransition>
  );
}
