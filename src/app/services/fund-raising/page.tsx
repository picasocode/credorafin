"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  CreditCard,
  FileCheck,
  Banknote,
  HeadphonesIcon as Headphones,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Landmark,
  Users,
  TrendingUp,
  Search,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";
import AnimatedIllustration from "@/components/AnimatedIllustration";
import { SmoothReveal } from "@/lib/animations";
import { services } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const iconMap: Record<string, React.ElementType> = {
  CreditCard,
  FileCheck,
  Banknote,
  HeadphonesIcon: Headphones,
};

const service = services.find((s) => s.slug === "fund-raising")!;
const otherServices = services.filter((s) => s.slug !== "fund-raising");

const processTimeline = [
  { step: 1, icon: Users, title: "Requirement Analysis", desc: "Understand your specific funding need, amount, purpose, timeline, and business context" },
  { step: 2, icon: FileCheck, title: "Application Structuring", desc: "Prepare and structure your loan proposal professionally with all supporting documentation" },
  { step: 3, icon: Landmark, title: "Multi-Lender Presentation", desc: "Present your case to multiple lenders simultaneously with a single CIBIL enquiry" },
  { step: 4, icon: BarChart3, title: "Offer Comparison", desc: "Compare offers from multiple lenders and identify the best terms for your business" },
  { step: 5, icon: TrendingUp, title: "Sanction & Disbursal", desc: "Manage follow-ups until sanction is received and funds are disbursed to your account" },
];

const processIcons = [Users, FileCheck, Landmark, BarChart3, TrendingUp];

const lenders = [
  { name: "SBI", type: "PSU Bank", rate: "9.5%" },
  { name: "HDFC", type: "Private Bank", rate: "10.2%" },
  { name: "Bajaj Finserv", type: "NBFC", rate: "11.0%" },
  { name: "ICICI", type: "Private Bank", rate: "9.8%" },
  { name: "Axis Bank", type: "Private Bank", rate: "10.5%" },
  { name: "Tata Capital", type: "NBFC", rate: "10.8%" },
];

/* ── Reusable animated wrappers ── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function StaggerParent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={inView ? "visible" : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
      {children}
    </motion.div>
  );
}

function StaggerChild({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}>
      {children}
    </motion.div>
  );
}

export default function FundRaisingPage() {
  const IconComponent = iconMap[service.icon];

  return (
    <div className="overflow-hidden">
      {/* ─── 1. Hero Section ─── */}
      <section className="relative">
        <div className="h-1.5 w-full" style={{ backgroundColor: service.color }} />
        <div className="bg-gradient-to-br from-[#E8EDFA] via-[#F0F4FF] to-[#E0E7FA] py-14 md:py-24 relative overflow-hidden">
          {/* Subtle Indian-themed background image */}
          <Image
            src="/images/services/advisory-indian.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.08] pointer-events-none"
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <FadeIn>
              <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-8">
                <Link href="/" className="hover:text-[#1C1D62] transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/services" className="hover:text-[#1C1D62] transition-colors">Services</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#1C1D62] font-medium">{service.title}</span>
              </nav>
            </FadeIn>
            <SmoothReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="flex items-start gap-5 mb-6">
                  {IconComponent && (
                    <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ backgroundColor: service.color }} whileHover={{ scale: 1.08, rotate: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1D62] leading-tight">{service.title}</h1>
                    <p className="mt-2 text-lg sm:text-xl font-semibold" style={{ color: service.color }}>{service.headline}</p>
                  </div>
                </div>
                <p className="text-[#2D3748] leading-relaxed text-base sm:text-lg mb-8">{service.desc}</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                      <Button size="lg" className="bg-[#87B73C] hover:bg-[#6d9a2e] text-white font-semibold text-sm uppercase tracking-wider px-8 py-3.5 rounded-lg shadow-lg shadow-[#87B73C]/25 group">
                        Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/services">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" size="lg" className="border-[#1C1D62] text-[#1C1D62] hover:bg-[#1C1D62] hover:text-white font-semibold text-sm uppercase tracking-wider px-8 py-3.5 rounded-lg transition-all duration-300">
                        All Services
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-2xl relative">
                    <Image
                      src="/images/products/msme-hero.png"
                      alt="Business analytics dashboard and financial growth charts"
                      width={600}
                      height={400}
                      priority
                      className="w-full h-[300px] sm:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1D62]/30 via-transparent to-transparent" />
                  </div>
                  <motion.div className="absolute -bottom-6 -left-6" animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                    <div className="bg-white rounded-xl shadow-xl p-3 border border-[#E8ECF0]">
                      <AnimatedIllustration theme="chart" size={96} color="#1C1D62" />
                    </div>
                  </motion.div>
                  <motion.div className="absolute -top-4 -right-4" animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                    <motion.div animate={{ boxShadow: [`0 0 0px #1C1D6200`, `0 0 20px #1C1D6230`, `0 0 0px #1C1D6200`] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                      <div className="bg-white rounded-xl shadow-xl p-3 border border-[#E8ECF0]">
                        <AnimatedIllustration theme="money" size={70} color="#1C1D62" />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </FadeIn>
            </div>
            </SmoothReveal>
          </div>
        </div>
      </section>

      {/* ─── 2. Stats Row ─── */}
      <section className="py-14 md:py-18 bg-white border-b border-[#E8ECF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StaggerParent className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {service.stats?.map((stat, idx) => (
              <StaggerChild key={idx}>
                <motion.div className="h-full flex flex-col min-h-[120px] text-center p-6 rounded-xl border border-[#E8ECF0] bg-[#FAFBFF] transition-all duration-300 cursor-default" whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(28,29,98,0.12)" }}>
                  <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: service.color }}>
                    <CountUp target={parseInt(stat.value.replace(/[^0-9]/g, "")) || 0} suffix={stat.suffix || ""} />
                  </div>
                  <p className="text-sm text-[#718096] font-medium">{stat.label}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ─── 3. What We Do ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">What We Do</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">We manage the entire fund-raising lifecycle — from understanding your requirement to securing the best possible terms from the right lenders.</p>
            </div>
          </FadeIn>
          <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.whatWeDo.map((item, idx) => (
              <StaggerChild key={idx}>
                <motion.div className="h-full flex flex-col min-h-[100px] bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm transition-all duration-300 group" whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(28,29,98,0.1)", borderColor: service.color }}>
                  <div className="flex-1 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#1C1D62]" style={{ backgroundColor: `${service.color}12` }}>
                      <span className="text-sm font-bold transition-colors duration-300 group-hover:text-white" style={{ color: service.color }}>{idx + 1}</span>
                    </div>
                    <p className="text-sm sm:text-base text-[#2D3748] leading-relaxed">{item}</p>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ─── 4. Multi-Lender Access Diagram — Unique to Fund Raising ─── */}
      <section className="py-16 md:py-24 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">How Multi-Lender Access Works</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">Your application is structured once and presented to multiple lenders simultaneously — giving you access to the best terms with a single CIBIL enquiry.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <motion.div className="bg-white rounded-2xl border border-[#E8ECF0] p-6 sm:p-10 shadow-sm max-w-5xl mx-auto" whileHover={{ boxShadow: "0 12px 50px rgba(28,29,98,0.08)" }}>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* You (Single Point) */}
                <div className="flex flex-col items-center text-center">
                  <motion.div className="w-24 h-24 rounded-full border-2 flex items-center justify-center mb-3" style={{ borderColor: service.color, backgroundColor: `${service.color}08` }} whileHover={{ scale: 1.08, borderColor: service.color }} transition={{ type: "spring" }}>
                    <Users className="w-10 h-10" style={{ color: service.color }} />
                  </motion.div>
                  <span className="text-sm font-semibold text-[#1C1D62]">Your Business</span>
                  <span className="text-xs text-[#718096]">One application</span>
                </div>

                {/* Arrow connector */}
                <div className="hidden lg:flex items-center">
                  <motion.div className="w-16 h-0.5 origin-left" style={{ backgroundColor: `${service.color}30` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} />
                  <ArrowRight className="w-4 h-4" style={{ color: service.color }} />
                </div>

                {/* Credora in the middle */}
                <div className="flex flex-col items-center text-center">
                  <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-lg" style={{ backgroundColor: service.color }} whileHover={{ scale: 1.08 }} transition={{ type: "spring" }}>
                    <Banknote className="w-9 h-9 text-white" />
                  </motion.div>
                  <span className="text-sm font-bold" style={{ color: service.color }}>Credora</span>
                  <span className="text-xs text-[#718096]">Structured presentation</span>
                </div>

                {/* Arrow connector */}
                <div className="hidden lg:flex items-center">
                  <motion.div className="w-16 h-0.5 origin-left" style={{ backgroundColor: `${service.color}30` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} />
                  <ArrowRight className="w-4 h-4" style={{ color: service.color }} />
                </div>

                {/* Lenders */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {lenders.map((lender, idx) => (
                      <motion.div key={idx} className="bg-[#F0F4FF] rounded-xl border border-[#E8ECF0] p-4 text-center shadow-sm transition-all duration-300" whileHover={{ y: -3, boxShadow: "0 6px 20px rgba(28,29,98,0.1)", borderColor: service.color }} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 * idx }}>
                        <Landmark className="w-6 h-6 mx-auto mb-2" style={{ color: service.color }} />
                        <span className="text-xs font-semibold text-[#1C1D62] block">{lender.name}</span>
                        <span className="text-[10px] text-[#718096]">{lender.type}</span>
                        <span className="text-xs font-bold mt-1 block" style={{ color: service.color }}>{lender.rate}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-[#718096]">+ 64 more lenders in our network</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E8ECF0] text-center">
                <p className="text-sm text-[#2D3748]">
                  <span className="font-semibold" style={{ color: service.color }}>Single CIBIL enquiry</span> — your application is structured once and presented to multiple lenders, so you get the best terms without multiple hits on your credit score.
                </p>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 5. Process Steps — Visual Timeline ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Our Process</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">From initial consultation to funds in your account — a transparent, managed process that keeps you informed at every stage.</p>
            </div>
          </FadeIn>
          <div className="max-w-4xl mx-auto">
            {service.processSteps?.map((step, idx) => {
              const PIcon = processIcons[idx] || Search;
              return (
                <FadeIn key={idx} delay={idx * 0.08}>
                  <div className="flex gap-5 mb-8 last:mb-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <motion.div className="w-12 h-12 rounded-full flex items-center justify-center relative z-10 shadow-lg" style={{ backgroundColor: service.color }} whileHover={{ scale: 1.12 }}>
                        <PIcon className="w-5 h-5 text-white" />
                      </motion.div>
                      {idx < (service.processSteps?.length || 0) - 1 && (
                        <motion.div className="w-0.5 flex-1 min-h-[40px] mt-2" style={{ backgroundColor: `${service.color}30` }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} />
                      )}
                    </div>
                    <motion.div className="bg-white rounded-xl border border-[#E8ECF0] p-5 sm:p-6 shadow-sm flex-1 group transition-all duration-300" whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(28,29,98,0.1)", borderColor: service.color }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: service.color }}>Step {idx + 1}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#1C1D62] mb-2">{step.title}</h3>
                      <p className="text-sm text-[#718096] leading-relaxed">{step.desc}</p>
                    </motion.div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 6. Fund Raising Process Timeline — Unique to Fund Raising ─── */}
      <section className="py-16 md:py-24 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Fund Raising Timeline</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">A clear, step-by-step journey from your first consultation to receiving funds in your account.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                {processTimeline.map((item, idx) => {
                  const TIcon = item.icon;
                  return (
                    <motion.div key={idx} className="flex flex-col items-center text-center" whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 relative shadow-md transition-all duration-300" style={{ backgroundColor: `${service.color}10` }}>
                        <TIcon className="w-7 h-7" style={{ color: service.color }} />
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow" style={{ backgroundColor: service.color }}>{item.step}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#1C1D62] mb-1">{item.title}</h3>
                      <p className="text-xs text-[#718096] leading-relaxed">{item.desc}</p>
                      {idx < processTimeline.length - 1 && (
                        <div className="hidden sm:block mt-3">
                          <ArrowRight className="w-4 h-4 text-[#718096]/40" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 7. Benefits Grid ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Benefits of Our Fund Raising Service</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">Save time, protect your credit score, and secure the best possible terms — all with a single point of contact.</p>
            </div>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <StaggerParent className="grid sm:grid-cols-2 gap-4">
              {service.benefits.map((benefit, idx) => (
                <StaggerChild key={idx}>
                  <motion.div className="h-full flex flex-col min-h-[100px] bg-[#FAFBFF] rounded-xl border border-[#E8ECF0] p-5 shadow-sm transition-all duration-300 group" whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(28,29,98,0.08)", borderColor: "#87B73C" }}>
                    <div className="flex-1 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#87B73C]/10">
                        <CheckCircle2 className="w-4 h-4 text-[#87B73C]" />
                      </div>
                      <span className="text-[#2D3748] text-sm leading-relaxed">{benefit}</span>
                    </div>
                  </motion.div>
                </StaggerChild>
              ))}
            </StaggerParent>
            <FadeIn delay={0.2}>
              <div className="flex justify-center">
                <AnimatedIllustration theme="money" size={260} color="#1C1D62" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── 8. FAQ Section ─── */}
      <section className="py-16 md:py-24 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Frequently Asked Questions</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">Common questions about our fund raising services and how we help businesses secure the right funding.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E8ECF0] p-6 sm:p-8 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {service.faqs?.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-[#E8ECF0] last:border-0">
                    <AccordionTrigger className="text-left text-[#1C1D62] font-medium hover:no-underline hover:text-[#1C1D62] transition-colors py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#718096] leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 9. CTA Section ─── */}
      <section className="py-16 md:py-24 bg-[#1C1D62] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#1C1D62]/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#87B73C]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <FadeIn>
            <motion.div className="mb-8 inline-block" animate={{ y: [-6, 6, -6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <AnimatedIllustration theme="success" size={120} color="#87B73C" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Get Started with {service.title}</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">Let us connect you with the right lenders and secure the best possible terms for your funding needs.</p>
            <Link href="/contact">
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }} animate={{ boxShadow: ["0 0 0px #87B73C00", "0 0 30px #87B73C40", "0 0 0px #87B73C00"] }} transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.2 } }}>
                <Button size="lg" className="bg-[#87B73C] hover:bg-[#6d9a2e] text-white font-semibold text-sm uppercase tracking-wider px-10 py-4 rounded-lg group">
                  Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ─── 10. Related Services ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Related Services</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">Explore our complementary services that enhance your fund raising outcomes.</p>
            </div>
          </FadeIn>
          <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherServices.map((os) => {
              const OsIcon = iconMap[os.icon];
              return (
                <StaggerChild key={os.slug}>
                  <motion.div className="h-full" whileHover={{ y: -5 }}>
                    <Link href={`/services/${os.slug}`} className="group flex flex-col h-full min-h-[180px] bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#1C1D62]/30">
                      <div className="flex items-center gap-3 mb-4">
                        {OsIcon && <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#1C1D62]" style={{ backgroundColor: `${os.color}12` }}><OsIcon className="w-5 h-5 transition-colors duration-300 group-hover:text-white" style={{ color: os.color }} /></div>}
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: os.color }}>Service</span>
                      </div>
                      <h3 className="text-base font-semibold text-[#1C1D62] mb-2 group-hover:text-[#1C1D62] transition-colors">{os.title}</h3>
                      <p className="text-sm text-[#718096] leading-relaxed line-clamp-2 flex-1">{os.headline}</p>
                      <div className="flex items-center gap-1 mt-4 text-sm font-semibold" style={{ color: os.color }}>
                        <span className="uppercase tracking-wider text-xs">Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                </StaggerChild>
              );
            })}
          </StaggerParent>
        </div>
      </section>
    </div>
  );
}

/* ── CountUp animation ── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}
