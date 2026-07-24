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
  AlertTriangle,
  XCircle,
  Clock,
  FileWarning,
  BadgeAlert,
  ShieldCheck,
  TrendingUp,
  Eye,
  RefreshCw,
  FileText,
  Search,
} from "lucide-react";
import AnimatedIllustration from "@/components/AnimatedIllustration";
import ProcessInfographic from "@/components/ProcessInfographic";
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

const service = services.find((s) => s.slug === "credit-repair")!;
const otherServices = services.filter((s) => s.slug !== "credit-repair");

const commonIssues = [
  { icon: XCircle, title: "Incorrect Personal Info", desc: "Wrong name, address, or PAN linked to your credit report affecting your profile accuracy and causing mismatched records across bureaus." },
  { icon: AlertTriangle, title: "Duplicate Accounts", desc: "Same loan or credit card appearing multiple times, inflating your exposure and making lenders think you carry more debt than you actually do." },
  { icon: Clock, title: "Outdated Negative Marks", desc: "Settled or closed accounts still showing as active defaults or late payments, even after you've fully repaid the outstanding amount." },
  { icon: FileWarning, title: "Unrecognized Enquiries", desc: "Credit enquiries you never authorized, pulling down your score unnecessarily and signalling risk to potential lenders." },
  { icon: BadgeAlert, title: "Written-Off Status", desc: "Accounts incorrectly marked as written-off even after full repayment, severely damaging your creditworthiness in the eyes of any lender." },
];

const processIcons = [Search, Eye, FileText, RefreshCw, ShieldCheck];

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

/* ── Animated circular progress ── */
function AnimatedCircle({ percent, color, score, label }: { percent: number; color: string; score: number; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const circumference = 2 * Math.PI * 52;
  return (
    <div ref={ref} className="relative w-44 h-44 mx-auto mb-6">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#E8ECF0" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference - percent * circumference } : {}}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-bold" style={{ color }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
          {score}
        </motion.span>
        <span className="text-xs text-[#718096] font-medium">{label}</span>
      </div>
    </div>
  );
}

export default function CreditRepairPage() {
  const IconComponent = iconMap[service.icon];

  return (
    <div className="overflow-hidden">
      {/* ─── 1. Hero Section ─── */}
      <section className="relative">
        <div className="h-1.5 w-full" style={{ backgroundColor: service.color }} />
        <div className="bg-gradient-to-br from-[#F0F4FF] via-[#E8EDFA] to-[#F0F4FF] py-14 md:py-24 relative overflow-hidden">
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
                <Link href="/" className="hover:text-[#304AC0] transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/services" className="hover:text-[#304AC0] transition-colors">Services</Link>
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
                      <Button variant="outline" size="lg" className="border-[#304AC0] text-[#304AC0] hover:bg-[#304AC0] hover:text-white font-semibold text-sm uppercase tracking-wider px-8 py-3.5 rounded-lg transition-all duration-300">
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
                      src="/images/services/credit-repair-hero.png"
                      alt="Professional analyzing financial documents and credit reports"
                      width={600}
                      height={400}
                      priority
                      className="w-full h-[300px] sm:h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1D62]/30 via-transparent to-transparent" />
                  </div>
                  <motion.div className="absolute -bottom-6 -left-6" animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                    <div className="bg-white rounded-xl shadow-xl p-3 border border-[#E8ECF0]">
                      <AnimatedIllustration theme="business" size={96} color="#304AC0" />
                    </div>
                  </motion.div>
                  <motion.div className="absolute -top-4 -right-4" animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                    <motion.div animate={{ boxShadow: [`0 0 0px #304AC000`, `0 0 20px #304AC030`, `0 0 0px #304AC000`] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                      <div className="bg-white rounded-xl shadow-xl p-3 border border-[#E8ECF0]">
                        <AnimatedIllustration theme="shield" size={70} color="#304AC0" />
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
                <motion.div className="h-full flex flex-col min-h-[120px] text-center p-6 rounded-xl border border-[#E8ECF0] bg-[#FAFBFF] transition-all duration-300 cursor-default" whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(48,74,192,0.12)" }}>
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
              <p className="text-[#718096] max-w-2xl mx-auto">Our comprehensive credit repair process addresses every aspect of your credit profile to ensure maximum improvement.</p>
            </div>
          </FadeIn>
          <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.whatWeDo.map((item, idx) => (
              <StaggerChild key={idx}>
                <motion.div className="h-full flex flex-col min-h-[100px] bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm transition-all duration-300 group" whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(48,74,192,0.1)", borderColor: service.color }}>
                  <div className="flex-1 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#304AC0]" style={{ backgroundColor: `${service.color}12` }}>
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

      {/* ─── 4. Process Steps — Infographic ─── */}
      <ProcessInfographic
        steps={(service.processSteps || []).map((s, i) => {
          const icons = [Search, Eye, FileText, RefreshCw, ShieldCheck];
          return { icon: icons[i] || Search, label: s.title, desc: s.desc };
        })}
        color={service.color}
        heading="Our Process"
        subtext="A systematic, transparent approach to improving your credit profile — from initial analysis to confirmed score updates."
        compact
      />

      {/* ─── 5. Credit Score Improvement — Unique to Credit Repair ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Credit Score Improvement</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">See the tangible difference our credit repair service makes — from a damaged profile to a clean, lender-ready credit report.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FadeIn delay={0.1}>
              <motion.div className="flex flex-col bg-[#FFF5F5] rounded-2xl border border-red-100 p-8 text-center relative h-full" whileHover={{ y: -4 }}>
                <span className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-4 block">Before Credit Repair</span>
                <AnimatedCircle percent={0.38} color="#DC2626" score={540} label="Poor" />
                <div className="space-y-2 text-left max-w-xs mx-auto">
                  {[
                    "5 incorrect entries on report",
                    "3 duplicate accounts inflating exposure",
                    "2 outdated defaults still showing",
                    "Loan applications consistently rejected",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#718096]"><XCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0" /> <span>{item}</span></div>
                  ))}
                </div>
              </motion.div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <motion.div className="flex flex-col bg-[#F0FFF4] rounded-2xl border border-green-100 p-8 text-center relative h-full" whileHover={{ y: -4 }}>
                <span className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-4 block">After Credit Repair</span>
                <AnimatedCircle percent={0.74} color="#87B73C" score={745} label="Good" />
                <div className="space-y-2 text-left max-w-xs mx-auto">
                  {[
                    "All errors corrected and verified",
                    "Duplicates removed from all bureaus",
                    "Outdated marks properly updated",
                    "Loan-ready profile, higher approvals",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#718096]"><CheckCircle2 className="w-4 h-4 text-[#87B73C] flex-shrink-0" /> <span>{item}</span></div>
                  ))}
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── 6. Common Credit Issues — Unique to Credit Repair ─── */}
      <section className="py-16 md:py-24 bg-[#F0F4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Common Credit Issues We Fix</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">These are the most frequent credit report errors that silently damage your score and prevent loan approvals.</p>
            </div>
          </FadeIn>
          <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {commonIssues.map((issue, idx) => {
              const IIcon = issue.icon;
              return (
                <StaggerChild key={idx}>
                  <motion.div className="h-full flex flex-col min-h-[100px] bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm transition-all duration-300 group" whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(48,74,192,0.1)", borderColor: service.color }}>
                    <div className="flex-1 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#304AC0]" style={{ backgroundColor: `${service.color}10` }}>
                        <IIcon className="w-6 h-6 transition-colors duration-300 group-hover:text-white" style={{ color: service.color }} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#1C1D62] mb-2 group-hover:text-[#304AC0] transition-colors">{issue.title}</h3>
                        <p className="text-sm text-[#718096] leading-relaxed">{issue.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </StaggerChild>
              );
            })}
          </StaggerParent>
        </div>
      </section>

      {/* ─── 7. Benefits Grid ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1D62] mb-3">Benefits of Credit Repair</h2>
              <p className="text-[#718096] max-w-2xl mx-auto">A clean, accurate credit profile opens doors that would otherwise remain closed — better terms, faster approvals, and more lender options.</p>
            </div>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <StaggerParent className="grid sm:grid-cols-2 gap-4">
              {service.benefits.map((benefit, idx) => (
                <StaggerChild key={idx}>
                  <motion.div className="h-full flex flex-col min-h-[100px] bg-[#FAFBFF] rounded-xl border border-[#E8ECF0] p-5 shadow-sm transition-all duration-300 group" whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(48,74,192,0.08)", borderColor: "#87B73C" }}>
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
                <AnimatedIllustration theme="success" size={260} color="#87B73C" />
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
              <p className="text-[#718096] max-w-2xl mx-auto">Everything you need to know about our credit repair services and how they can help you get funding-ready.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E8ECF0] p-6 sm:p-8 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {service.faqs?.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-[#E8ECF0] last:border-0">
                    <AccordionTrigger className="text-left text-[#1C1D62] font-medium hover:no-underline hover:text-[#304AC0] transition-colors py-4">
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
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#304AC0]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#87B73C]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <FadeIn>
            <motion.div className="mb-8 inline-block" animate={{ y: [-6, 6, -6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <AnimatedIllustration theme="success" size={120} color="#87B73C" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Get Started with {service.title}</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">Our advisors can help you improve your credit profile and increase your funding eligibility. Don&apos;t let credit errors hold your business back.</p>
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
              <p className="text-[#718096] max-w-2xl mx-auto">Explore our other services that complement credit repair and help you achieve your financial goals.</p>
            </div>
          </FadeIn>
          <StaggerParent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherServices.map((os) => {
              const OsIcon = iconMap[os.icon];
              return (
                <StaggerChild key={os.slug}>
                  <motion.div className="h-full" whileHover={{ y: -5 }}>
                    <Link href={`/services/${os.slug}`} className="group flex flex-col h-full min-h-[180px] bg-white rounded-xl border border-[#E8ECF0] p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#304AC0]/30">
                      <div className="flex items-center gap-3 mb-4">
                        {OsIcon && <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#304AC0]" style={{ backgroundColor: `${os.color}12` }}><OsIcon className="w-5 h-5 transition-colors duration-300 group-hover:text-white" style={{ color: os.color }} /></div>}
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: os.color }}>Service</span>
                      </div>
                      <h3 className="text-base font-semibold text-[#1C1D62] mb-2 group-hover:text-[#304AC0] transition-colors">{os.title}</h3>
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
