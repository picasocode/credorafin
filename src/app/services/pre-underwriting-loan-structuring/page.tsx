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
  XCircle,
  ArrowRight,
  ChevronRight,
  FileSearch,
  Calculator,
  ClipboardCheck,
  Building2,
  FileText,
  Target,
  BarChart3,
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

const service = services.find((s) => s.slug === "pre-underwriting-loan-structuring")!;
const otherServices = services.filter((s) => s.slug !== "pre-underwriting-loan-structuring");

const preparationChecklist = [
  { step: 1, icon: FileSearch, title: "Document Collection", desc: "Gather bank statements, financials, ITR, and business registration documents to build a complete application package." },
  { step: 2, icon: Calculator, title: "Financial Analysis", desc: "Review cash flows, existing obligations, and fund utilization patterns in detail to identify strengths and gaps." },
  { step: 3, icon: Building2, title: "Lender Matching", desc: "Identify banks and NBFCs whose criteria match your profile — ensuring applications go only to the right lenders." },
  { step: 4, icon: ClipboardCheck, title: "Gap Identification", desc: "Spot and resolve issues before the application is submitted — fixing problems proactively instead of reactively." },
  { step: 5, icon: FileText, title: "Proposal Structuring", desc: "Create a professionally structured loan proposal for maximum impact and approval chances with targeted lenders." },
];

const processIcons = [FileSearch, Calculator, Building2, ClipboardCheck, FileText];

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

export default function PreUnderwritingPage() {
  const IconComponent = iconMap[service.icon];

  return (
    <div className="overflow-hidden">
      {/* ─── 1. Hero Section ─── */}
      <section className="relative">
        <div className="h-1.5 w-full" style={{ backgroundColor: service.color }} />
        <div className="bg-gradient-to-br from-[#F0F4FF] via-[#E0E7FA] to-[#F0F4FF] py-14 md:py-24 relative overflow-hidden">
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
                <Link href="/" className="hover:text-[#13277E] transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/services" className="hover:text-[#13277E] transition-colors">Services</Link>
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
                      <Button variant="outline" size="lg" className="border-[#13277E] text-[#13277E] hover:bg-[#13277E] hover:text-white font-semibold text-sm uppercase tracking-wider px-8 py-3.5 rounded-lg transition-all duration-300">
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
                      alt="Professional reviewing loan documents and financial statements"
                      width={600}
                      height={400}
                      priority
                      className="w-full h-[300px] sm:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13277E]/30 via-transparent to-transparent" />
                  </div>
                  <motion.div className="absolute -bottom-6 -right-6" animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                    <div className="bg-white rounded-xl shadow-xl p-3 border border-[#E8ECF0]">
                      <AnimatedIllustration theme="document" size={96} color="#13277E" />
                    </div>
                  </motion.div>
                  <motion.div className="absolute -top-4 -left-4" animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                    <motion.div animate={{ boxShadow: [`0 0 0px #13277E00`, `0 0 20px #13277E30`, `0 0 0px #13277E00`] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                      <div className="bg-white rounded-xl shadow-xl p-3 border border-[#E8ECF0]">
                        <AnimatedIllustration theme="shield" size={70} color="#13277E" />
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
                <motion.div className="h-full flex flex-col min-h-[120px] text-center p-6 rounded-xl border border-[#E8ECF0] bg-[#FAFBFF] transition-all duration-300 cursor-default" whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(19,39,126,0.12)" }}>
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
              <p className="text-[#718096] max-w-2xl mx-auto">We thoroughly evaluate your financial profile and structure your application so that lenders see the strongest possible version of your business.</p>
            </div>
          </FadeIn>
          <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.whatWeDo.map((item, idx) => (
              <StaggerChild key={idx}>
                <motion.div className="h-full flex flex-col min-h-[100px] bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm transition-all duration-300 group" whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(19,39,126,0.1)", borderColor: service.color }}>
                  <div className="flex-1 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#13277E]" style={{ backgroundColor: `${service.color}12` }}>
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

      {/* ─── 4. Before vs After Comparison — Unique to Pre-Underwriting ─── */}
      <section className="py-16 md:py-24 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Before vs After Pre-Underwriting</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">The difference between applying directly and applying after pre-underwriting is dramatic — see how preparation transforms your outcome.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FadeIn delay={0.1}>
              <motion.div className="flex flex-col bg-[#FFF5F5] rounded-2xl border border-red-100 p-6 sm:p-8 h-full" whileHover={{ y: -4 }}>
                <div className="flex items-center gap-2 mb-6">
                  <XCircle className="w-5 h-5 text-[#DC2626]" />
                  <h3 className="text-lg font-semibold text-[#1C1D62]">Without Pre-Underwriting</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Apply directly to a single bank without preparation",
                    "No prior assessment of eligibility or lender fit",
                    "Gaps and issues discovered only after submission",
                    "High chance of rejection — wasting time and credit enquiries",
                    "Multiple CIBIL enquiries from different lenders",
                    "Weak position for securing favourable commercial terms",
                  ].map((item, idx) => (
                    <motion.div key={idx} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }}>
                      <XCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#2D3748]">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-red-100">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-[#DC2626]">~30%</span>
                    <span className="text-sm text-[#718096] block">Average Approval Rate</span>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <motion.div className="flex flex-col bg-[#F0FFF4] rounded-2xl border border-green-100 p-6 sm:p-8 h-full" whileHover={{ y: -4 }}>
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-[#87B73C]" />
                  <h3 className="text-lg font-semibold text-[#1C1D62]">With Pre-Underwriting</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Complete financial profile reviewed and optimized in advance",
                    "Eligibility assessed across multiple lender criteria simultaneously",
                    "Issues identified and resolved before any application is submitted",
                    "Significantly higher approval chances with targeted lenders",
                    "Controlled, minimal CIBIL enquiries — protecting your score",
                    "Better interest rates and commercial terms through structured presentation",
                  ].map((item, idx) => (
                    <motion.div key={idx} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }}>
                      <CheckCircle2 className="w-4 h-4 text-[#87B73C] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#2D3748]">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-green-100">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-[#87B73C]">~85%</span>
                    <span className="text-sm text-[#718096] block">Average Approval Rate</span>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── 5. Process Steps — Visual Timeline ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Our Process</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">A methodical approach that transforms your raw financial data into a compelling, approval-ready loan application.</p>
            </div>
          </FadeIn>
          <div className="max-w-4xl mx-auto">
            {service.processSteps?.map((step, idx) => {
              const PIcon = processIcons[idx] || FileSearch;
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
                    <motion.div className="bg-white rounded-xl border border-[#E8ECF0] p-5 sm:p-6 shadow-sm flex-1 group transition-all duration-300" whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(19,39,126,0.1)", borderColor: service.color }}>
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

      {/* ─── 6. 5-Step Preparation Checklist — Unique to Pre-Underwriting ─── */}
      <section className="py-16 md:py-24 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">5-Step Preparation Checklist</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">Every successful application starts with thorough preparation. Here&apos;s our structured approach to getting you application-ready.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto space-y-4">
              {preparationChecklist.map((item, idx) => {
                const CIcon = item.icon;
                return (
                  <motion.div key={idx} className="flex items-start gap-5 bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm transition-all duration-300 group" whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(19,39,126,0.1)", borderColor: service.color }} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md" style={{ backgroundColor: service.color }}>
                        {item.step}
                      </div>
                      {idx < preparationChecklist.length - 1 && (
                        <div className="w-0.5 h-8 mt-2" style={{ backgroundColor: `${service.color}30` }} />
                      )}
                    </div>
                    <div className="flex-1 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#13277E]" style={{ backgroundColor: `${service.color}10` }}>
                        <CIcon className="w-5 h-5 transition-colors duration-300 group-hover:text-white" style={{ color: service.color }} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#1C1D62] mb-1">{item.title}</h3>
                        <p className="text-sm text-[#718096] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 7. Benefits Grid ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Benefits of Pre-Underwriting</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">Investing time in preparation before applying consistently delivers better results, fewer rejections, and more favourable terms.</p>
            </div>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <StaggerParent className="grid sm:grid-cols-2 gap-4">
              {service.benefits.map((benefit, idx) => (
                <StaggerChild key={idx}>
                  <motion.div className="h-full flex flex-col min-h-[100px] bg-[#FAFBFF] rounded-xl border border-[#E8ECF0] p-5 shadow-sm transition-all duration-300 group" whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(19,39,126,0.08)", borderColor: "#87B73C" }}>
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
                <AnimatedIllustration theme="document" size={260} color="#13277E" />
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
              <p className="text-[#718096] max-w-2xl mx-auto">Common questions about our pre-underwriting and loan structuring services.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E8ECF0] p-6 sm:p-8 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {service.faqs?.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-[#E8ECF0] last:border-0">
                    <AccordionTrigger className="text-left text-[#1C1D62] font-medium hover:no-underline hover:text-[#13277E] transition-colors py-4">
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
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#13277E]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#87B73C]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <FadeIn>
            <motion.div className="mb-8 inline-block" animate={{ y: [-6, 6, -6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <AnimatedIllustration theme="success" size={120} color="#87B73C" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Get Started with {service.title}</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">Our advisors can help you prepare your application for the strongest possible outcome. Don&apos;t apply blind — apply prepared.</p>
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
              <p className="text-[#718096] max-w-2xl mx-auto">Explore our other services that work hand-in-hand with pre-underwriting to maximize your funding success.</p>
            </div>
          </FadeIn>
          <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherServices.map((os) => {
              const OsIcon = iconMap[os.icon];
              return (
                <StaggerChild key={os.slug}>
                  <motion.div className="h-full" whileHover={{ y: -5 }}>
                    <Link href={`/services/${os.slug}`} className="group flex flex-col h-full min-h-[180px] bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#13277E]/30">
                      <div className="flex items-center gap-3 mb-4">
                        {OsIcon && <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#13277E]" style={{ backgroundColor: `${os.color}12` }}><OsIcon className="w-5 h-5 transition-colors duration-300 group-hover:text-white" style={{ color: os.color }} /></div>}
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: os.color }}>Service</span>
                      </div>
                      <h3 className="text-base font-semibold text-[#1C1D62] mb-2 group-hover:text-[#13277E] transition-colors">{os.title}</h3>
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
